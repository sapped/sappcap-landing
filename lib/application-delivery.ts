import { createHash } from "node:crypto";
import { CONSENT_NOTICE_TEXT, CONSENT_NOTICE_VERSION } from "./consent-notice";

type Intake = { id: string; email: string; kind: "email-capture" | "application"; campaign: string; attribution: Record<string, string>; name?: string; company?: string; dealSize?: string; completedDeals?: string; targetDeals?: string; goals?: string };

// No raw email, application answers or provider response bodies in server logs.
// Existing opt-outs are never overridden, and legacy welcome tags are untouched.
export async function deliverApplicationIntake(record: Intake) {
  const key = process.env.MAILCHIMP_API_KEY;
  const audience = process.env.MAILCHIMP_AUDIENCE_ID;
  const dc = key?.match(/-(us\d+)$/)?.[1];
  if (!key || !dc || !audience || !/^[a-zA-Z0-9]+$/.test(audience)) throw new Error("intake_configuration");
  const deadline = AbortSignal.timeout(20000);
  const base = `https://${dc}.api.mailchimp.com/3.0/lists/${audience}/members/${createHash("md5").update(record.email).digest("hex")}`;
  async function provider(suffix: string, method = "GET", body?: unknown) {
    const result = await fetch(base + suffix, { method, cache: "no-store", signal: deadline, headers: { Authorization: `Basic ${Buffer.from(`sca:${key}`).toString("base64")}`, "Content-Type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    if (!result.ok) throw new Error("intake_provider");
    return result.status === 204 ? null : result.json();
  }
  const member = await provider("", "PUT", { email_address: record.email, status_if_new: "subscribed" });
  const snapshot = JSON.stringify({ ...record, consentMethod: "submission-notice", consentNoticeVersion: CONSENT_NOTICE_VERSION, consentNoticeText: CONSENT_NOTICE_TEXT });
  const digest = createHash("sha256").update(snapshot).digest("hex").slice(0,16);
  const prefix = `sca-intake-v1:${record.id}:${digest}:`;
  const existing = await provider("/notes?count=1000&fields=notes.note");
  if (!Array.isArray(existing?.notes)) throw new Error("intake_notes");
  const markers = new Set(existing.notes.map((note: { note: string }) => note.note.split("\n",1)[0]));
  const chunks = snapshot.match(/[\s\S]{1,850}/g) || [];
  await Promise.all(chunks.map(async (chunk,index) => {
    const marker = `${prefix}${index+1}/${chunks.length}`;
    if (!markers.has(marker)) await provider("/notes", "POST", { note: `${marker}\n${chunk}` });
  }));
  await provider("/tags", "POST", { tags: [{name:"sca-application-funnel-v1",status:"active"},{name:`sca-source-${record.campaign}`,status:"active"},...(record.kind === "application" ? [{name:"sca-application-submitted",status:"active"}] : [])] });
  // Capturing a service request does not re-subscribe an opted-out contact.
  return { marketingSubscribed: member.status === "subscribed", notificationSent: false };
}

// Best-effort per-instance abuse limit. Origin/body/honeypot validation is separate.
const limits = new Map<string,{count:number;expires:number}>();
export function intakeRateAllowed(request: Request) {
  const now=Date.now();
  for(const [key,value] of limits)if(value.expires<=now)limits.delete(key);
  const identity=createHash("sha256").update(request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "local").digest("hex");
  const old=limits.get(identity);
  if(old){if(old.count>=10)return false;old.count++;return true;}
  if(limits.size>=1000){const first=limits.keys().next().value;if(first)limits.delete(first);}
  limits.set(identity,{count:1,expires:now+600000});return true;
}
