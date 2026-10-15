import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const BOOKED_TAG = "intro-booked-ever";
const CAMPAIGN_TAG = "acquisition-review-v1";
const MAX_BYTES = 65536;

type Config = { enabled: boolean; secret?: string; eventTypeId?: string; apiKey?: string; audience?: string };
type Provider = typeof fetch;

function reply(status: number, outcome: string) {
  return Response.json({ outcome }, { status, headers: { "Cache-Control": "no-store" } });
}

// Raw bytes must be authenticated before parsing. Missing signing credentials
// fail closed; no unsigned ping/replay exception is accepted.
export async function handleCalBookingWebhook(request: Request, config: Config, provider: Provider = fetch) {
  const { secret, eventTypeId, apiKey, audience } = config;
  const dc = apiKey?.match(/-(us\d+)$/)?.[1];
  if (!config.enabled || !secret || secret.length < 32 || !eventTypeId || !/^\d+$/.test(eventTypeId) ||
      !apiKey || !dc || !audience || !/^[a-zA-Z0-9]+$/.test(audience)) return reply(503, "not_configured");
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") return reply(415, "invalid_content_type");
  if (Number(request.headers.get("content-length")) > MAX_BYTES) return reply(413, "too_large");
  const signature = request.headers.get("x-cal-signature-256") ?? "";
  if (!/^[a-f0-9]{64}$/i.test(signature)) return reply(401, "invalid_signature");
  const reader = request.body?.getReader();
  if (!reader) return reply(400, "invalid_body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.length;
      if (size > MAX_BYTES) { await reader.cancel(); return reply(413, "too_large"); }
      chunks.push(chunk.value);
    }
  } catch { return reply(400, "invalid_body"); }
  const raw = Buffer.concat(chunks);
  const expected = createHmac("sha256", secret).update(raw).digest();
  if (!timingSafeEqual(expected, Buffer.from(signature, "hex"))) return reply(401, "invalid_signature");
  if (request.headers.get("x-cal-webhook-version") !== "2021-10-20") return reply(400, "unsupported_version");
  let event;
  try { event = JSON.parse(raw.toString("utf8")); } catch { return reply(400, "invalid_body"); }
  const booking = event?.payload;
  // Cancellation/rescheduling never removes the permanent suppression tag or
  // restarts marketing. Only accepted bookings on the specific intro qualify.
  if (event?.triggerEvent !== "BOOKING_CREATED" || String(booking?.eventTypeId) !== eventTypeId ||
      booking?.type !== "client-intro" || booking?.status !== "ACCEPTED" || booking?.requiresConfirmation !== false) return reply(202, "ignored_event");
  const email = typeof booking?.responses?.email?.value === "string" ? booking.responses.email.value.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !Array.isArray(booking.attendees) || !booking.attendees.some((person: { email?: unknown }) =>
        typeof person?.email === "string" && person.email.trim().toLowerCase() === email)) return reply(400, "invalid_booker");
  const memberId = createHash("md5").update(email).digest("hex");
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audience}/members/${memberId}`;
  const headers = { Authorization: `Basic ${Buffer.from(`sca:${apiKey}`).toString("base64")}`, "Content-Type": "application/json" };
  const deadline = AbortSignal.timeout(15000);
  try {
    // Lookup only. No PUT/create/status override, including for existing opt-outs.
    const found = await provider(`${url}?fields=status,tags`, { headers, cache: "no-store", signal: deadline });
    if (found.status === 404) return reply(202, "not_in_campaign");
    if (!found.ok) throw new Error("lookup_failed");
    const member = await found.json();
    if (typeof member?.status !== "string" || !Array.isArray(member.tags)) throw new Error("invalid_member");
    if (member.status !== "subscribed" ||
        !member.tags.some((tag: { name?: string }) => tag?.name === CAMPAIGN_TAG)) return reply(202, "not_in_campaign");
    if (member.tags.some((tag: { name?: string }) => tag?.name === BOOKED_TAG)) return reply(200, "already_suppressed");
    // Setting an active tag is idempotent on retry. It is not the welcome trigger.
    const tagged = await provider(`${url}/tags`, { method: "POST", headers, cache: "no-store", signal: deadline,
      body: JSON.stringify({ tags: [{ name: BOOKED_TAG, status: "active" }] }) });
    if (!tagged.ok) throw new Error("tag_failed");
    return reply(200, "suppressed");
  } catch {
    // No attendee, raw body, provider response, signature or secret in logs.
    console.error("Booking suppression provider request failed.");
    return reply(503, "retry_required");
  }
}
