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
const valid={name:'QA Reviewer',email:'qa@example.test',company:'Review firm',phone:'',sponsorEquity:'$250,000 to under $500,000',completedDeals:'0',targetDeals:'4',goals:'We need more underwriting capacity.',marketingConsent:true,consentNoticeVersion:'email-submit-notice-2026-10-15-v2'};
test('application allows unknown deal counts',()=>assert.deepEqual(validateApplication({...valid,completedDeals:'',targetDeals:''}),{}));
test('direct application requires a valid email',()=>assert.equal(validateApplication({...valid,email:''}).email,'Enter a valid email address.'));
test('negative or fractional deal counts are rejected',()=>{assert.ok(validateApplication({...valid,completedDeals:'-1'}).completedDeals);assert.ok(validateApplication({...valid,targetDeals:'1.5'}).targetDeals);});
test('sponsor equity must be from the shared schema',()=>assert.ok(validateApplication({...valid,sponsorEquity:'unbounded'}).sponsorEquity));
test('overlong answers are rejected',()=>assert.ok(validateApplication({...valid,goals:'x'.repeat(2501)}).goals));

test('company and cell phone can be omitted',()=>assert.deepEqual(validateApplication({...valid,company:'',phone:''}),{}));
test('optional phone accepts formatting and rejects malformed or overlong numbers',()=>{
 assert.deepEqual(validateApplication({...valid,phone:'+1 (404) 555-0100'}),{});
 for(const phone of ['123','please call me','1'.repeat(41)])assert.ok(validateApplication({...valid,phone}).phone);
});
test('historical total deal size is never treated as sponsor equity',()=>assert.ok(validateApplication({...valid,sponsorEquity:'',dealSize:'$5M to under $10M'}).sponsorEquity));
test('answer summary includes every application field and preserves zeros and multiline goals',()=>{
 const {applicationAnswerRows,APPLICATION_ANSWER_LABELS}=load('lib/application-schema.ts');
 const rows=applicationAnswerRows({...valid,company:'',phone:'',goals:'Goal one\nGoal two'});
 assert.equal(rows.length,Object.keys(APPLICATION_ANSWER_LABELS).length);
 assert.ok(rows.some(([label,value])=>label==='Company'&&value==='Not provided'));
 assert.ok(rows.some(([label,value])=>label==='Cell phone'&&value==='Not provided'));
 assert.ok(rows.some(([,value])=>value==='0'));assert.ok(rows.some(([,value])=>value==='Goal one\nGoal two'));
});
test('direct visit has blank email',()=>{storage.clear();assert.equal(consumeApplicationEmail(),'');});
test('lander email prefills once and is cleared for a later direct visit',()=>{storeApplicationEmail('qa@example.test');assert.equal(consumeApplicationEmail(),'qa@example.test');assert.equal(consumeApplicationEmail(),'');});
test('expired handoff is blank',()=>{storeApplicationEmail('qa@example.test');const key=[...storage.keys()][0];storage.set(key,JSON.stringify({email:'qa@example.test',createdAt:Date.now()-31*60*1000}));assert.equal(consumeApplicationEmail(),'');});
test('malformed cached handoff is blank',()=>{storage.set('sca_application_email_handoff_v1','not json');assert.equal(consumeApplicationEmail(),'');});

test('homepage, acquisition and future landers survive the shared handoff and server parsing',()=>{
 const {consumeApplicationHandoff}=load('lib/application-handoff.ts');
 const {readEntryContext}=load('lib/application-request.ts');
 const {landingPageName}=load('lib/application-source.ts');
 for(const path of ['/','/acquisition','/new-investment-angle-v2']){
  storeApplicationEmail(valid.email,path);const handoff=consumeApplicationHandoff();
  assert.equal(handoff.landingPage,path);assert.equal(readEntryContext({...handoff,emailPrefilled:true}).landingPage,path);
  assert.ok(landingPageName(path).includes(`(${path})`));
 }
 assert.equal(landingPageName('/'),'Homepage (/)');assert.equal(landingPageName('/acquisition'),'Acquisition lander (/acquisition)');
 assert.equal(consumeApplicationHandoff().landingPage,'/apply');
});
test('source paths reject URLs, queries, email addresses and oversized input',()=>{
 const {normalizeLandingPath}=load('lib/application-source.ts');
 for(const path of ['https://example.test','//example','/apply?email=qa@example.test','/qa@example.test','/x'.repeat(100)])assert.equal(normalizeLandingPath(path),'/apply');
 assert.equal(normalizeLandingPath('/new-angle/'),'/new-angle');
});
test('direct application link from a lander preserves source without inventing an email',()=>{
 const {storeApplicationEntry,consumeApplicationHandoff}=load('lib/application-handoff.ts');
 storeApplicationEntry('/new-campaign');assert.deepEqual(consumeApplicationHandoff(),{email:'',landingPage:'/new-campaign'});
 assert.deepEqual(consumeApplicationHandoff(),{email:'',landingPage:'/apply'});
});
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

test('Formspree retains requests if Mailchimp is unavailable, using one message with source details',async()=>{
 const previous={...process.env},oldFetch=global.fetch;let notification;
 try{
  process.env.FORMSPREE_NOTIFICATIONS_ENABLED='true';process.env.MAILCHIMP_API_KEY='fixture-us21';process.env.MAILCHIMP_AUDIENCE_ID='fixture';
  global.fetch=async(url,init)=>{if(url.startsWith('https://formspree.io/')){notification=JSON.parse(init.body);return new Response('{}',{status:200});}return new Response('{}',{status:503});};
  const {deliverApplicationIntake}=load('lib/application-delivery.ts');
  const result=await deliverApplicationIntake({kind:'application',id:envelope.id,email:valid.email,campaign:'application',goals:valid.goals,landingPage:'/acquisition',emailPrefilled:true,attribution:{utm_source:'linkedin'}});
  assert.equal(result.notificationSent,true);assert.equal(result.marketingSubscribed,false);
  assert.deepEqual(Object.keys(notification),['email','message']);
  for(const part of ['Subject:','/acquisition','linkedin','Email collected on: Acquisition lander (/acquisition)',valid.goals])assert.ok(notification.message.includes(part));
 }finally{process.env=previous;global.fetch=oldFetch;}
});

test('notification includes sponsor equity, phone and named source without ambiguous campaign labels',()=>{
 const {intakeNotificationMessage}=load('lib/application-delivery.ts');
 const message=intakeNotificationMessage({...valid,id:envelope.id,kind:'application',campaign:'application',phone:'+1 (404) 555-0100',landingPage:'/',emailPrefilled:true,attribution:{utm_source:'linkedin'}});
 for(const part of ['Entry page: Homepage (/)','Email collected on: Homepage (/)','Cell phone:\n+1 (404) 555-0100',valid.sponsorEquity,'linkedin','website generated'])assert.ok(message.includes(part));
 assert.ok(!message.includes('Campaign: application'));assert.ok(!message.includes('carried from earlier lander: Yes'));assert.ok(!message.includes('Typical deal size'));
});

test('live application parsing delivers new fields and future source paths to both providers',async()=>{
 const previous={...process.env},oldFetch=global.fetch;const notes=[];let notification;
 try{
  process.env.VERCEL_ENV='production';process.env.APPLICATION_FUNNEL_LIVE='true';process.env.FORMSPREE_NOTIFICATIONS_ENABLED='true';process.env.MAILCHIMP_API_KEY='fixture-us21';process.env.MAILCHIMP_AUDIENCE_ID='fixture';
  global.fetch=async(url,init)=>{
   const body=init.body?JSON.parse(init.body):null;
   if(url.startsWith('https://formspree.io/')){notification=body;return new Response('{}',{status:200});}
   if(body?.note)notes.push(body.note);
   return new Response(JSON.stringify(init.method==='PUT'?{status:'subscribed'}:url.includes('/notes?')?{notes:[]}:{}),{status:200});
  };
  const {POST}=load('app/api/applications/route.ts');
  const r=await POST(request({...envelope,...valid,phone:'+1 (404) 555-0100',company:'',landingPage:'/new-capital-angle',emailPrefilled:true,attribution:{utm_source:'linkedin'}}));
  assert.equal(r.status,200);assert.equal((await r.json()).notificationSent,true);
  const snapshot=JSON.parse(notes.filter(note=>note.includes('\n')).map(note=>note.slice(note.indexOf('\n')+1)).join(''));
  assert.equal(snapshot.sponsorEquity,valid.sponsorEquity);assert.equal(snapshot.phone,'+1 (404) 555-0100');assert.equal(snapshot.company,'');
  assert.equal(snapshot.landingPage,'/new-capital-angle');assert.equal(snapshot.attribution.utm_source,'linkedin');assert.equal(snapshot.dealSize,undefined);
  assert.ok(notification.message.includes('New capital angle lander (/new-capital-angle)'));assert.ok(notification.message.includes('Company:\nNot provided'));
 }finally{process.env=previous;global.fetch=oldFetch;}
});
