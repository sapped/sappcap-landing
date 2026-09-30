import { createHash, createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { ACQUISITION_EXPERIMENT, readAttribution } from "@/lib/acquisition-review-config";

export const runtime = "nodejs";
export const maxDuration = 30;
const DISCLOSURE = "acquisition-email-v1-2026-09-30";
const TAG = "acquisition-review-v1";
const LIMIT = 8192;

function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

// Best-effort protection per running server instance, not a shared global quota.
// Cold starts reset these counters. Origin/size/consent checks and the honeypot
// remain independent; use Vercel Firewall for stronger distributed protection.
const rateLimits = new Map<string, { count: number; expiresAt: number }>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_RATE_IDENTITIES = 1000;
function rateLimit(identity: string, key: string): boolean {
  const now = Date.now();
  for (const [hash, entry] of rateLimits) if (entry.expiresAt <= now) rateLimits.delete(hash);
  const hash = createHmac("sha256", key).update(identity).digest("hex");
  const entry = rateLimits.get(hash);
  if (entry) {
    // Refresh insertion order so overflow evicts the least recently seen entry.
    rateLimits.delete(hash);
    rateLimits.set(hash, entry);
    if (entry.count >= 10) return false;
    entry.count++;
    return true;
  }
  if (rateLimits.size >= MAX_RATE_IDENTITIES) {
    const oldest = rateLimits.keys().next().value;
    if (oldest) rateLimits.delete(oldest);
  }
  rateLimits.set(hash, { count: 1, expiresAt: now + RATE_WINDOW_MS });
  return true;
}

export async function POST(request: Request) {
  // Enable only after subscriber capture AND the tagged welcome flow are verified.
  if (process.env.ACQUISITION_LIVE !== "true") return reply(503, { accepted: false });
  const key = process.env.MAILCHIMP_API_KEY;
  const audience = process.env.MAILCHIMP_AUDIENCE_ID;
  const dc = key?.match(/-(us\d+)$/)?.[1];
  if (!key || !dc || !audience || !/^[a-zA-Z0-9]+$/.test(audience)) return reply(503, { accepted: false });
  const origin = request.headers.get("origin");
  const allowed = new Set(["https://www.sapp.capital", "https://sapp.capital"]);
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) allowed.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.NODE_ENV !== "production") allowed.add("http://localhost:3002");
  if (!origin || !allowed.has(origin)) return reply(403, { accepted: false });
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") return reply(415, { accepted: false });
  if (Number(request.headers.get("content-length")) > LIMIT) return reply(413, { accepted: false });

  let body;
  try {
    // Limit streamed bodies too; Content-Length alone is client-controlled.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { accepted: false });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.length;
      if (size > LIMIT) { await reader.cancel(); return reply(413, { accepted: false }); }
      chunks.push(chunk.value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return reply(400, { accepted: false }); }
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.consent !== true || typeof body.website !== "string" || body.website) {
    return reply(400, { accepted: false });
  }
  const captureId = typeof body.captureId === "string" ? body.captureId : "";
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(captureId)) return reply(400, { accepted: false });
  const params = new URLSearchParams();
  if (body.attribution && typeof body.attribution === "object") {
    for (const [name, value] of Object.entries(body.attribution)) if (typeof value === "string") params.set(name, value);
  }
  const attribution = readAttribution(params);
  const memberId = createHash("md5").update(email).digest("hex");
  const path = `/lists/${audience}/members/${memberId}`;
  // One deadline covers the entire provider sequence, not 7 seconds per chunk.
  const deadline = AbortSignal.timeout(20000);
  const provider = async (suffix: string, method = "GET", data?: unknown) => {
    const result = await fetch(`https://${dc}.api.mailchimp.com/3.0${path}${suffix}`, {
      method, cache: "no-store", signal: AbortSignal.any([deadline, AbortSignal.timeout(7000)]),
      headers: { Authorization: `Basic ${Buffer.from(`sca:${key}`).toString("base64")}`, "Content-Type": "application/json" },
      ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
    });
    if (!result.ok) throw new Error(`provider_${result.status}`);
    return result.status === 204 ? null : result.json();
  };
  try {
    // Vercel supplies this header; never retain or report the raw IP.
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!rateLimit(ip, key)) return reply(429, { accepted: false });
    // status_if_new never overrides an existing unsubscribe or cleaned address.
    const member = await provider("", "PUT", { email_address: email, status_if_new: "subscribed" });
    if (member.status !== "subscribed") return reply(409, { accepted: false, code: "confirmation_required" });

    // Provider notes carry their own creation timestamps. Keep snapshot content
    // deterministic on retry; a digest distinguishes changed attribution instead
    // of accidentally assembling old and new chunks under the same capture ID.
    const snapshot = JSON.stringify({ disclosure: DISCLOSURE, consent: true, attribution });
    const digest = createHash("sha256").update(snapshot).digest("hex").slice(0, 16);
    const prefix = `${ACQUISITION_EXPERIMENT}:${captureId}:${digest}:`;
    const notes = await provider("/notes?count=1000&fields=notes.note");
    if (!Array.isArray(notes?.notes)) throw new Error("provider_invalid_notes");
    const existing = new Set<string>(notes.notes.map((note: { note: string }) => note.note.split("\n", 1)[0]));
    const parts = snapshot.match(/[\s\S]{1,850}/g) || [];
    // Parallel writes stay within the shared deadline. A partial failure never
    // activates the welcome tag; the next retry only writes missing chunks.
    await Promise.all(parts.map(async (part, index) => {
      const marker = `${prefix}${index + 1}/${parts.length}`;
      if (!existing.has(marker)) await provider("/notes", "POST", { note: `${marker}\n${part}` });
    }));
    // The native welcome automation starts only on this tag, after the metadata is saved.
    // Re-applying an active tag does not remove/re-add it or restart the sequence.
    await provider("/tags", "POST", { tags: [{ name: TAG, status: "active" }] });
    return reply(200, { accepted: true });
  } catch {
    // Avoid logging provider responses: they can contain emails and account information.
    console.error("Acquisition subscription failed; inspect provider availability and configuration.");
    return reply(503, { accepted: false });
  }
}
