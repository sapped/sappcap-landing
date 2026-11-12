import { createHash } from "node:crypto";
import type { Intake } from "./application-delivery";
import { CONSENT_NOTICE_TEXT, CONSENT_NOTICE_VERSION } from "./consent-notice";
import { normalizeSmsPhone } from "./sms-consent";

type Contact = { id: string; email?: string; phone?: string; locationId?: string; dnd?: boolean; dndSettings?: Record<string, {status?: string}> };
type Note = { body?: string; bodyText?: string };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));

// This adapter stores requests and consent only. It sends no messages, adds no
// workflow tags, and never clears existing global or channel opt-outs.
export async function deliverGhlIntake(record: Intake) {
  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  const serviceField = process.env.GHL_SMS_SERVICE_FIELD_ID;
  const marketingField = process.env.GHL_SMS_MARKETING_FIELD_ID;
  const evidenceField = process.env.GHL_SMS_EVIDENCE_FIELD_ID;
  const emailField = process.env.GHL_EMAIL_NOTICE_FIELD_ID;
  if (!token || !locationId || !serviceField || !marketingField || !evidenceField || !emailField) throw new Error("intake_configuration");
  const deadline = AbortSignal.timeout(20000);
  async function api(endpoint: string, method = "GET", body?: unknown) {
    const result = await fetch("https://services.leadconnectorhq.com" + endpoint, {
      method, cache: "no-store", signal: deadline,
      headers: { Authorization: `Bearer ${token}`, Version: "v3", "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
    if (!result.ok) throw new Error("intake_provider");
    return result.status === 204 ? null : result.json();
  }
  const phone = normalizeSmsPhone(record.phone || "");
  async function lookup(key: "email" | "phone", value: string): Promise<Contact | null> {
    const data = await api("/contacts/lookup?" + new URLSearchParams({ locationId: locationId!, [key]: value, limit: "2" }));
    if (!Array.isArray(data?.contacts) || data.contacts.length > 1 || data.nextCursor) throw new Error("intake_identity");
    const contact = data.contacts[0];
    if (contact && (!/^[a-zA-Z0-9_-]+$/.test(contact.id) || contact.locationId !== locationId)) throw new Error("intake_identity");
    return contact || null;
  }
  const [byEmail, byPhone] = await Promise.all([lookup("email", record.email), phone ? lookup("phone", phone) : Promise.resolve(null)]);
  // A shared/recycled number must never merge two people's records.
  if (byPhone && byPhone.id !== byEmail?.id) throw new Error("intake_identity");
  if (byEmail && (record.smsConsent?.service || record.smsConsent?.marketing) && byEmail.phone && normalizeSmsPhone(byEmail.phone) !== phone) throw new Error("intake_identity");
  let contact: Contact;
  if (byEmail) contact = byEmail;
  else {
    const created = await api("/contacts", "POST", {
      locationId, email: record.email, ...(record.name ? { name: record.name } : {}),
      ...(record.company ? { companyName: record.company } : {}), ...(phone ? { phone } : {}),
      source: "SCA website", dndSettings: { sms: { status: "active" } }
    });
    contact = created?.contact;
    if (!contact || !/^[a-zA-Z0-9_-]+$/.test(contact.id) || contact.locationId !== locationId) throw new Error("intake_contact");
  }
  const endpoint = "/contacts/" + encodeURIComponent(contact.id);
  const notes = await api(endpoint + "/notes");
  if (!Array.isArray(notes?.notes)) throw new Error("intake_notes");
  // Stable across retries: the first durable note keeps the server receipt time.
  const smsChoices = record.smsConsent ? { ...record.smsConsent, recordedAt: undefined } : null;
  const fingerprint = createHash("sha256").update(JSON.stringify({ ...record, smsConsent: record.smsConsent ? smsChoices : null })).digest("hex").slice(0, 24);
  const marker = `sca-website-intake-v2:${record.id}:${fingerprint}`;
  const existing: Note | undefined = notes.notes.find((note: Note) => (note.bodyText || note.body || "").includes(marker));
  let smsEvidence = record.smsConsent;
  if (existing && smsEvidence) {
    const text = existing.bodyText;
    if (!text) throw new Error("intake_evidence");
    try {
      const snapshot = JSON.parse(text.slice(text.indexOf(marker) + marker.length).trim());
      if (snapshot.smsConsent?.version !== smsEvidence.version || !snapshot.smsConsent?.recordedAt) throw new Error();
      smsEvidence = snapshot.smsConsent;
    } catch { throw new Error("intake_evidence"); }
  }
  if (!existing) {
    const snapshot = { ...record, receivedAt: new Date().toISOString(), emailConsent: { method: "submission-notice", version: CONSENT_NOTICE_VERSION, disclosure: CONSENT_NOTICE_TEXT }, smsConsent: smsEvidence || null };
    await api(endpoint + "/notes", "POST", {
      title: "SCA website " + record.kind + " " + record.id,
      body: "<pre>" + escapeHtml(marker + "\n" + JSON.stringify(snapshot, null, 2)) + "</pre>"
    });
  }
  // Only update dedicated website preference fields. Do not replace tags, primary
  // email, an established phone, or any DND state. Unchecked means no new grant.
  await api(endpoint, "PUT", {
    ...(!contact.phone && phone ? { phone } : {}),
    customFields: [
      { id: emailField, fieldValue: CONSENT_NOTICE_VERSION },
      ...(smsEvidence ? [
        { id: serviceField, fieldValue: smsEvidence.service ? "yes" : "no" },
        { id: marketingField, fieldValue: smsEvidence.marketing ? "yes" : "no" },
        { id: evidenceField, fieldValue: JSON.stringify(smsEvidence) }
      ] : [])
    ]
  });
  // A receipt means the application is retained, not that messaging is enabled.
  return { marketingSubscribed: false, notificationSent: false, intakeProvider: "ghl" };
}
