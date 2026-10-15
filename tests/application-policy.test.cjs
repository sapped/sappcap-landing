const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const cache = new Map();
const storage = new Map();
const sessionStorage = {getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
function load(relative) {
 const file=path.resolve(__dirname,'..',relative);
 if(cache.has(file))return cache.get(file).exports;
 const mod={exports:{}};cache.set(file,mod);
 const output=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
 const localRequire=name=>name.startsWith('@/')?load(name.slice(2)+'.ts'):name.startsWith('.')?load(path.relative(path.join(__dirname,'..'),path.resolve(path.dirname(file),name))+'.ts'):require(name);
 new Function('require','module','exports','sessionStorage',output)(localRequire,mod,mod.exports,sessionStorage);
 return mod.exports;
}
const {validateApplication}=load('lib/application-schema.ts');
const {storeApplicationEmail,consumeApplicationEmail}=load('lib/application-handoff.ts');
const {applicationMode}=load('lib/application-experience.ts');
const {readApplicationRequest}=load('lib/application-request.ts');
const valid={name:'QA Reviewer',email:'qa@example.test',company:'Review firm',dealSize:'$5M to under $10M',completedDeals:'0',targetDeals:'4',goals:'We need more underwriting capacity.',marketingConsent:true,consentNoticeVersion:'email-submit-notice-2026-10-15-v2'};
test('application allows unknown deal counts',()=>assert.deepEqual(validateApplication({...valid,completedDeals:'',targetDeals:''}),{}));
test('direct application requires a valid email',()=>assert.equal(validateApplication({...valid,email:''}).email,'Enter a valid email address.'));
test('negative or fractional deal counts are rejected',()=>{assert.ok(validateApplication({...valid,completedDeals:'-1'}).completedDeals);assert.ok(validateApplication({...valid,targetDeals:'1.5'}).targetDeals);});
test('deal size must be from the shared schema',()=>assert.ok(validateApplication({...valid,dealSize:'unbounded'}).dealSize));
test('overlong answers are rejected',()=>assert.ok(validateApplication({...valid,goals:'x'.repeat(2501)}).goals));
test('direct visit has blank email',()=>{storage.clear();assert.equal(consumeApplicationEmail(),'');});
test('lander email prefills once and is cleared for a later direct visit',()=>{storeApplicationEmail('qa@example.test');assert.equal(consumeApplicationEmail(),'qa@example.test');assert.equal(consumeApplicationEmail(),'');});
test('expired handoff is blank',()=>{storeApplicationEmail('qa@example.test');const key=[...storage.keys()][0];storage.set(key,JSON.stringify({email:'qa@example.test',createdAt:Date.now()-31*60*1000}));assert.equal(consumeApplicationEmail(),'');});
test('malformed cached handoff is blank',()=>{storage.set('sca_application_email_handoff_v1','not json');assert.equal(consumeApplicationEmail(),'');});
test('production stays disabled even with local review flag',()=>{const previous={...process.env};try{process.env.VERCEL_ENV='production';process.env.LOCAL_REVIEW='true';assert.equal(applicationMode(),'disabled');}finally{process.env=previous;}});
test('hosted staging is preview only',()=>{const previous={...process.env};try{process.env.VERCEL_ENV='preview';process.env.LOCAL_REVIEW='true';assert.equal(applicationMode(),'staging-preview');}finally{process.env=previous;}});
function request(body,origin='https://review.example.test'){return new Request('https://review.example.test/api/applications',{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(body)});}
const envelope={id:'12345678-1234-4234-8234-123456789abc',website:''};
test('cross-origin requests rejected',async()=>assert.equal(await readApplicationRequest(request(envelope,'https://other.example.test')),null));
test('Next internal hostname may differ from the browser Host',async()=>{const r=new Request('http://localhost:3015/api/applications',{method:'POST',headers:{'content-type':'application/json',origin:'http://127.0.0.1:3015',host:'127.0.0.1:3015'},body:JSON.stringify(envelope)});assert.equal((await readApplicationRequest(r)).id,envelope.id);});
test('honeypot requests rejected',async()=>assert.equal(await readApplicationRequest(request({...envelope,website:'bot'})),null));
test('stream body limit rejected without trusting content length',async()=>assert.equal(await readApplicationRequest(request({...envelope,padding:'x'.repeat(17000)})),null));
test('bounded same-origin JSON accepted',async()=>assert.equal((await readApplicationRequest(request(envelope))).id,envelope.id));
test('production application endpoint fails closed',async()=>{const previous={...process.env};try{process.env.VERCEL_ENV='production';const {POST}=load('app/api/applications/route.ts');const r=await POST(request({...envelope,...valid}));assert.equal(r.status,503);}finally{process.env=previous;}});
test('hosted preview does not claim durable capture',async()=>{const previous={...process.env};try{process.env.VERCEL_ENV='preview';const {POST}=load('app/api/applications/route.ts');const r=await POST(request({...envelope,...valid}));assert.equal(r.status,200);assert.equal((await r.json()).saved,false);}finally{process.env=previous;}});

test('submission without the displayed notice version is rejected',async()=>{const previous={...process.env};try{process.env.VERCEL_ENV='preview';const {POST}=load('app/api/applications/route.ts');const r=await POST(request({...envelope,...valid,consentNoticeVersion:'old-version'}));assert.equal(r.status,400);}finally{process.env=previous;}});
test('submission notice is not recorded when request disagrees',async()=>{const previous={...process.env};try{process.env.VERCEL_ENV='preview';const {POST}=load('app/api/applications/route.ts');const r=await POST(request({...envelope,...valid,marketingConsent:false}));assert.equal(r.status,400);}finally{process.env=previous;}});

test('production intake requires explicit activation',()=>{const previous={...process.env};try{process.env.VERCEL_ENV='production';process.env.APPLICATION_FUNNEL_LIVE='true';assert.equal(applicationMode(),'live');delete process.env.APPLICATION_FUNNEL_LIVE;assert.equal(applicationMode(),'disabled');}finally{process.env=previous;}});

test('live delivery preserves opt-outs and stores complete application without starting legacy flow',async()=>{
 const previous={...process.env},oldFetch=global.fetch;const calls=[];
 try{
  process.env.MAILCHIMP_API_KEY='fixture-us21';process.env.MAILCHIMP_AUDIENCE_ID='fixture';
  global.fetch=async(url,init)=>{calls.push({url,method:init.method,body:init.body?JSON.parse(init.body):null});return new Response(JSON.stringify(init.method==='PUT'?{status:'unsubscribed'}:url.includes('/notes?')?{notes:[]}:{}),{status:200});};
  const {deliverApplicationIntake}=load('lib/application-delivery.ts');
  const result=await deliverApplicationIntake({kind:'application',id:envelope.id,email:valid.email,campaign:'application',name:valid.name,company:valid.company,goals:valid.goals,attribution:{}});
  assert.equal(result.marketingSubscribed,false);assert.equal(result.notificationSent,false);
  assert.equal(calls[0].body.status_if_new,'subscribed');assert.equal(calls[0].body.status,undefined);
  assert.ok(calls.some(c=>c.body?.note?.includes(valid.goals)));
  assert.ok(!JSON.stringify(calls).includes('acquisition-review-v1'));
  assert.ok(JSON.stringify(calls).includes('submission-notice'));
 }finally{process.env=previous;global.fetch=oldFetch;}
});

test('provider outage never reports a saved application',async()=>{
 const previous={...process.env},oldFetch=global.fetch;
 try{process.env.VERCEL_ENV='production';process.env.APPLICATION_FUNNEL_LIVE='true';process.env.MAILCHIMP_API_KEY='fixture-us21';process.env.MAILCHIMP_AUDIENCE_ID='fixture';global.fetch=async()=>new Response('{}',{status:503});const {POST}=load('app/api/applications/route.ts');const r=await POST(request({...envelope,...valid}));assert.equal(r.status,503);assert.equal((await r.json()).accepted,false);}finally{process.env=previous;global.fetch=oldFetch;}
});
