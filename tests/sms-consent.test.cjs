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

test("live intake retains purpose-specific SMS evidence in existing Mailchimp notes",async()=>{
 const previous={...process.env},oldFetch=global.fetch,notes=[];
 try{
  process.env.VERCEL_ENV="production";process.env.APPLICATION_FUNNEL_LIVE="true";
  process.env.MAILCHIMP_API_KEY="fixture-us21";process.env.MAILCHIMP_AUDIENCE_ID="fixture";
  delete process.env.FORMSPREE_NOTIFICATIONS_ENABLED;
  global.fetch=async(url,init)=>{
   const body=init.body?JSON.parse(init.body):{};
   if(body.note)notes.push(body.note);
   return new Response(JSON.stringify(init.method==="PUT"?{status:"unsubscribed"}:url.includes("/notes?")?{notes:[]}:{}),{status:200});
  };
  const before=Date.now();
  const r=await POST(request({...valid,...choices,smsServiceConsent:true}));
  assert.equal(r.status,200);const receipt=await r.json();assert.equal(receipt.saved,true);assert.equal(receipt.marketingSubscribed,false);
  const snapshot=JSON.parse(notes.map(n=>n.slice(n.indexOf("\n")+1)).join(""));
  assert.equal(snapshot.smsConsent.service,true);assert.equal(snapshot.smsConsent.marketing,false);
  assert.equal(snapshot.smsConsent.phone,"+14045550100");assert.equal(snapshot.smsConsent.sourceUrl,"https://www.sapp.capital/apply");
  assert.ok(Date.parse(snapshot.smsConsent.recordedAt)>=before);
  assert.equal(snapshot.smsConsent.marketingDisclosure,SMS_MARKETING_DISCLOSURE);
 }finally{process.env=previous;global.fetch=oldFetch;}
});
