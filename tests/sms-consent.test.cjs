const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const cache = new Map();
function load(relative) {
 const file = path.resolve(__dirname, "..", relative);
 if(cache.has(file)) return cache.get(file).exports;
 const mod = {exports:{}}; cache.set(file, mod);
 const localRequire = name => name.startsWith("@/") ? load(name.slice(2)+".ts") : name.startsWith(".") ? load(path.relative(path.join(__dirname,".."),path.resolve(path.dirname(file),name))+".ts") : require(name);
 new Function("require","module","exports",ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText)(localRequire,mod,mod.exports);
 return mod.exports;
}
const {readSmsConsent,normalizeSmsPhone,SMS_CONSENT_VERSION,SMS_SERVICE_DISCLOSURE,SMS_MARKETING_DISCLOSURE}=load("lib/sms-consent.ts");
const {validateApplication}=load("lib/application-schema.ts");
const {POST}=load("app/api/applications/route.ts");
const {deliverApplicationIntake}=load("lib/application-delivery.ts");
const choices={smsConsentVersion:SMS_CONSENT_VERSION,smsServiceConsent:false,smsMarketingConsent:false};
const valid={id:"12345678-1234-4234-8234-123456789abc",website:"",name:"QA Reviewer",email:"qa@example.test",company:"Test firm",phone:"+1 404 555 0100",sponsorEquity:"Not sure yet",completedDeals:"",targetDeals:"",goals:"Review our underwriting capacity.",marketingConsent:true,consentNoticeVersion:"email-submit-notice-2026-10-15-v2"};
const request=body=>new Request("https://review.example.test/api/applications",{method:"POST",headers:{"content-type":"application/json",origin:"https://review.example.test"},body:JSON.stringify(body)});
test("all four independent SMS choices validate and record their exact disclosures",()=>{
 for(const service of [false,true]) for(const marketing of [false,true]){
  const body={...valid,...choices,smsServiceConsent:service,smsMarketingConsent:marketing};
  assert.deepEqual(validateApplication(body),{});
  const evidence=readSmsConsent(body);
  assert.equal(evidence.service,service);assert.equal(evidence.marketing,marketing);
  assert.equal(evidence.serviceDisclosure,SMS_SERVICE_DISCLOSURE);assert.equal(evidence.marketingDisclosure,SMS_MARKETING_DISCLOSURE);
  assert.equal(evidence.phone,"+14045550100");assert.equal(evidence.sourceUrl,"https://www.sapp.capital/apply");
  assert.ok(!Number.isNaN(Date.parse(evidence.recordedAt)));
 }
});
test("no SMS selection allows a blank phone; an affirmative choice requires a valid mobile format",()=>{
 assert.deepEqual(validateApplication({...valid,...choices,phone:""}),{});
 for(const key of ["smsServiceConsent","smsMarketingConsent"]) assert.ok(validateApplication({...valid,...choices,phone:"",[key]:true}).phone);
 assert.equal(readSmsConsent({...choices,phone:"",smsServiceConsent:true}),false);
 assert.equal(normalizeSmsPhone("404 555 0100"),"+14045550100");assert.equal(normalizeSmsPhone("555-0100"),null);
});
test("cached forms confer no SMS permission; strings and stale disclosures are rejected",()=>{
 assert.equal(readSmsConsent(valid),null);
 for(const body of [{...choices,smsServiceConsent:"true"},{...choices,smsMarketingConsent:"false"},{...choices,smsConsentVersion:"old"},{smsServiceConsent:true}])assert.equal(readSmsConsent({...valid,...body}),false);
});
test("server never trusts a visitor-supplied receipt time or disclosure",()=>{
 const e=readSmsConsent({...valid,...choices,recordedAt:"1900-01-01",smsConsent:{service:true},serviceDisclosure:"forged"});
 assert.equal(e.service,false);assert.notEqual(e.recordedAt,"1900-01-01");assert.equal(e.serviceDisclosure,SMS_SERVICE_DISCLOSURE);
});
test("API accepts neither/service/marketing/both and rejects forged consent",async()=>{
 const previous={...process.env};
 try {
 process.env.VERCEL_ENV="preview";
 for(const service of [false,true]) for(const marketing of [false,true]){
  const r=await POST(request({...valid,...choices,smsServiceConsent:service,smsMarketingConsent:marketing}));
  assert.equal(r.status,200);assert.equal((await r.json()).saved,false);
 }
 assert.equal((await POST(request({...valid,...choices,smsServiceConsent:"true"}))).status,400);
 assert.equal((await POST(request({...valid,...choices,smsConsentVersion:"old"}))).status,400);
 }finally{process.env=previous;}
});
function configured(){
 process.env.APPLICATION_INTAKE_PROVIDER="ghl";process.env.GHL_PRIVATE_INTEGRATION_TOKEN="fixture-token";process.env.GHL_LOCATION_ID="fixtureLocation";
 process.env.GHL_SMS_SERVICE_FIELD_ID="service";process.env.GHL_SMS_MARKETING_FIELD_ID="marketing";process.env.GHL_SMS_EVIDENCE_FIELD_ID="evidence";process.env.GHL_EMAIL_NOTICE_FIELD_ID="emailnotice";
}
function fixture({existing=true,collision=false,outage=false}={}){
 const calls=[];const notes=[];
 const contact={id:"fixtureContact",locationId:"fixtureLocation",email:valid.email,phone:"+14045550100",dnd:true,dndSettings:{sms:{status:"permanent"},email:{status:"active"}}};
 return {calls,notes,fetch:async(url,init={})=>{
  const u=new URL(url),body=init.body?JSON.parse(init.body):undefined;calls.push({url,method:init.method,body,headers:init.headers});
  assert.ok(url.startsWith("https://services.leadconnectorhq.com/"));assert.equal(init.headers.Version,"v3");
  if(outage)return new Response("{}",{status:503});
  let response={};
  if(u.pathname==="/contacts/lookup"){
   const phone=u.searchParams.has("phone");
   response={contacts:existing?[phone&&collision?{...contact,id:"otherContact",email:"other@example.test"}:contact]:[]};
  }else if(u.pathname==="/contacts"){response={contact:{...contact,dnd:false,...body}};}
  else if(u.pathname.endsWith("/notes")&&init.method==="GET")response={notes};
  else if(u.pathname.endsWith("/notes")){notes.push({body:body.body,bodyText:body.body.slice(5,-6).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&")});response={note:{id:"note1"}};}
  return new Response(JSON.stringify(response),{status:200});
 }};
}
const record=()=>({...valid,kind:"application",campaign:"application",attribution:{},smsConsent:readSmsConsent({...valid,...choices,smsServiceConsent:true})});
test("GHL stores complete evidence, preserves opt-outs and keeps service/marketing independent",async()=>{
 const previous={...process.env},oldFetch=global.fetch;
 try{
  configured();const f=fixture();global.fetch=f.fetch;
  const result=await deliverApplicationIntake(record());assert.equal(result.intakeProvider,"ghl");
  const write=f.calls.find(c=>c.method==="PUT");
  assert.equal(write.body.dnd,undefined);assert.equal(write.body.dndSettings,undefined);assert.equal(write.body.tags,undefined);assert.equal(write.body.email,undefined);
  const fields=Object.fromEntries(write.body.customFields.map(f=>[f.id,f.fieldValue]));
  assert.equal(fields.service,"yes");assert.equal(fields.marketing,"no");
  const evidence=JSON.parse(fields.evidence);assert.equal(evidence.version,SMS_CONSENT_VERSION);assert.equal(evidence.phone,"+14045550100");
  assert.ok(f.notes[0].bodyText.includes(valid.goals));assert.ok(f.notes[0].bodyText.includes(SMS_MARKETING_DISCLOSURE));
  assert.ok(!f.calls.some(c=>/conversations|workflow|campaigns|mailchimp/.test(c.url)));
 }finally{process.env=previous;global.fetch=oldFetch;}
});
test("new contacts start with SMS blocked; recording consent does not send or clear DND",async()=>{
 const previous={...process.env},oldFetch=global.fetch;
 try{configured();const f=fixture({existing:false});global.fetch=f.fetch;await deliverApplicationIntake(record());
 assert.equal(f.calls.find(c=>c.url.endsWith("/contacts")).body.dndSettings.sms.status,"active");
 assert.ok(!f.calls.filter(c=>c.method==="PUT").some(c=>c.body.dndSettings));
 }finally{process.env=previous;global.fetch=oldFetch;}
});
test("GHL retries retain the first server receipt time without duplicating notes",async()=>{
 const previous={...process.env},oldFetch=global.fetch;
 try{configured();const f=fixture();global.fetch=f.fetch;const first=record();await deliverApplicationIntake(first);
 const retry=record();retry.smsConsent.recordedAt="2099-01-01T00:00:00.000Z";await deliverApplicationIntake(retry);
 assert.equal(f.notes.length,1);
 const writes=f.calls.filter(c=>c.method==="PUT");const e=JSON.parse(writes[1].body.customFields.find(c=>c.id==="evidence").fieldValue);
 assert.equal(e.recordedAt,first.smsConsent.recordedAt);
 }finally{process.env=previous;global.fetch=oldFetch;}
});
test("phone/email identity collisions stop before any writes",async()=>{
 const previous={...process.env},oldFetch=global.fetch;
 try{configured();const f=fixture({collision:true});global.fetch=f.fetch;await assert.rejects(deliverApplicationIntake(record()),/intake_identity/);assert.ok(f.calls.every(c=>c.method==="GET"));
 }finally{process.env=previous;global.fetch=oldFetch;}
});
test("GHL outage never silently falls back to Mailchimp or reports acceptance",async()=>{
 const previous={...process.env},oldFetch=global.fetch;
 try{configured();process.env.VERCEL_ENV="production";process.env.APPLICATION_FUNNEL_LIVE="true";process.env.FORMSPREE_NOTIFICATIONS_ENABLED="true";const f=fixture({outage:true});global.fetch=f.fetch;
 const response=await POST(request({...valid,...choices,smsServiceConsent:true}));assert.equal(response.status,503);assert.equal((await response.json()).accepted,false);
 assert.ok(f.calls.every(c=>c.url.includes("leadconnectorhq.com")));
 }finally{process.env=previous;global.fetch=oldFetch;}
});
test("email-only capture does not overwrite SMS preference fields",async()=>{
 const previous={...process.env},oldFetch=global.fetch;
 try{configured();const f=fixture();global.fetch=f.fetch;
 await deliverApplicationIntake({id:valid.id,email:valid.email,kind:"email-capture",campaign:"home",attribution:{}});
 const write=f.calls.find(c=>c.method==="PUT");assert.deepEqual(write.body.customFields,[{id:"emailnotice",fieldValue:valid.consentNoticeVersion}]);
 }finally{process.env=previous;global.fetch=oldFetch;}
});
