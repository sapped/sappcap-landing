import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {handleCalBookingWebhook, BOOKED_TAG} from '../lib/cal-booking-webhook.ts';

const config={enabled:true,secret:'test-only-secret-not-for-production-0123456789',eventTypeId:'5775130',apiKey:'test-key-us21',audience:'testaudience'};
const fixture=()=>({triggerEvent:'BOOKING_CREATED',payload:{eventTypeId:5775130,type:'client-intro',status:'ACCEPTED',requiresConfirmation:false,responses:{email:{value:'booker@example.test'}},attendees:[{email:'booker@example.test'},{email:'guest@example.test'}]}});
function request(event=fixture(), overrides={}, signedRaw) {
 const raw=typeof event==='string'?event:JSON.stringify(event);
 return new Request('https://staging.example.test/api/cal/booking',{method:'POST',headers:{'content-type':'application/json','x-cal-webhook-version':'2021-10-20','x-cal-signature-256':createHmac('sha256',config.secret).update(signedRaw??raw).digest('hex'),...overrides},body:raw});
}
function mock(member={status:'subscribed',tags:[{name:'acquisition-review-v1'}]},fail=false) {
 const calls=[];
 const fetcher=async(url,options)=>{calls.push({url,options});return options.method==='POST'?new Response(null,{status:fail?503:204}):Response.json(member);};
 return {calls,fetcher};
}
test('disabled endpoint never contacts Mailchimp',async()=>{const m=mock();assert.equal((await handleCalBookingWebhook(request(),{...config,enabled:false},m.fetcher)).status,503);assert.equal(m.calls.length,0);});
for(const signature of ['', 'no-secret-provided','sha256='+'0'.repeat(64),'0'.repeat(64)]) test(`rejects invalid signature ${signature.slice(0,18)}`,async()=>{const m=mock();assert.equal((await handleCalBookingWebhook(request(fixture(),{'x-cal-signature-256':signature}),config,m.fetcher)).status,401);assert.equal(m.calls.length,0);});
test('rejects tampered exact bytes',async()=>{const m=mock();assert.equal((await handleCalBookingWebhook(request(' '+JSON.stringify(fixture()),{},JSON.stringify(fixture())),config,m.fetcher)).status,401);assert.equal(m.calls.length,0);});
test('rejects unsupported payload version',async()=>{const m=mock();assert.equal((await handleCalBookingWebhook(request(fixture(),{'x-cal-webhook-version':'2026-07-27'}),config,m.fetcher)).status,400);assert.equal(m.calls.length,0);});
for(const change of [e=>e.triggerEvent='BOOKING_CANCELLED',e=>e.payload.eventTypeId=99,e=>e.payload.status='PENDING',e=>e.payload.requiresConfirmation=true]) test('ignores a nonqualifying booking',async()=>{const e=fixture();change(e);const m=mock();assert.equal((await handleCalBookingWebhook(request(e),config,m.fetcher)).status,202);assert.equal(m.calls.length,0);});
test('does not act on an arbitrary response email',async()=>{const e=fixture();e.payload.responses.email.value='someoneelse@example.test';const m=mock();assert.equal((await handleCalBookingWebhook(request(e),config,m.fetcher)).status,400);assert.equal(m.calls.length,0);});
for(const status of ['unsubscribed','cleaned','pending','transactional']) test(`does not enroll ${status} contacts`,async()=>{const m=mock({status,tags:[{name:'acquisition-review-v1'}]});assert.equal((await handleCalBookingWebhook(request(),config,m.fetcher)).status,202);assert.equal(m.calls.length,1);});
test('does not tag a subscriber outside this campaign',async()=>{const m=mock({status:'subscribed',tags:[]});assert.equal((await handleCalBookingWebhook(request(),config,m.fetcher)).status,202);assert.equal(m.calls.length,1);});
test('tags only the actual booker and never creates contacts',async()=>{const m=mock();assert.equal((await handleCalBookingWebhook(request(),config,m.fetcher)).status,200);assert.equal(m.calls.length,2);assert.equal(m.calls[0].options.method,undefined);assert.equal(m.calls[1].options.method,'POST');assert.match(m.calls[1].url,/\/tags$/);assert.deepEqual(JSON.parse(m.calls[1].options.body),{tags:[{name:BOOKED_TAG,status:'active'}]});});
test('duplicate booking already suppressed performs no write',async()=>{const m=mock({status:'subscribed',tags:[{name:'acquisition-review-v1'},{name:BOOKED_TAG}]});assert.equal((await handleCalBookingWebhook(request(),config,m.fetcher)).status,200);assert.equal(m.calls.length,1);});
test('provider failure is retryable',async()=>{const m=mock(undefined,true);assert.equal((await handleCalBookingWebhook(request(),config,m.fetcher)).status,503);});
test('malformed provider evidence is retryable, not silently ignored',async()=>{const m=mock({status:'subscribed'});assert.equal((await handleCalBookingWebhook(request(),config,m.fetcher)).status,503);assert.equal(m.calls.length,1);});
test('unknown contact is never created',async()=>{let calls=0;const f=async()=>{calls++;return new Response(null,{status:404});};assert.equal((await handleCalBookingWebhook(request(),config,f)).status,202);assert.equal(calls,1);});
test('stream body limit applies without Content-Length',async()=>{const raw=JSON.stringify({data:'x'.repeat(65536)});const m=mock();assert.equal((await handleCalBookingWebhook(request(raw),config,m.fetcher)).status,413);assert.equal(m.calls.length,0);});
