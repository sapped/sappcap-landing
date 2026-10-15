import { applicationMode } from "@/lib/application-experience";
import { isEmail } from "@/lib/application-schema";
import { readApplicationRequest, response } from "@/lib/application-request";
import { saveReviewRecord } from "@/lib/application-review-store";
import { readAttribution } from "@/lib/acquisition-review-config";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const mode = applicationMode();
  if (mode === "disabled") return response(503, { accepted: false });
  try {
    const body = await readApplicationRequest(request);
    if (!body || typeof body.email !== "string" || !isEmail(body.email.trim()) || !["home", "acquisition", "capacity", "ownership", "templates"].includes(String(body.campaign)) || typeof body.marketingConsent !== "boolean") return response(400, { accepted: false });
    const attribution = readAttribution(new URLSearchParams(typeof body.attribution === "object" && body.attribution ? body.attribution as Record<string, string> : {}));
    if (mode === "local-review") await saveReviewRecord({ kind: body.campaign === "templates" ? "template-request" : "email-capture", id: body.id, email: body.email.trim().toLowerCase(), campaign: body.campaign, marketingConsent: body.marketingConsent, attribution, ...(body.campaign === "templates" ? { fulfillment: "local-outbox-only", resource: "template-library", applicationRequired: false } : {}) });
    return response(200, { accepted: true, saved: mode === "local-review", mode, emailSent: false });
  } catch { return response(503, { accepted: false }); }
}
