import { CONSENT_NOTICE_VERSION, CONSENT_NOTICE_TEXT } from "@/lib/consent-notice";
import { applicationMode } from "@/lib/application-experience";
import { validateApplication, type ApplicationFields } from "@/lib/application-schema";
import { readApplicationRequest, response } from "@/lib/application-request";
import { saveReviewRecord } from "@/lib/application-review-store";
import { readAttribution } from "@/lib/acquisition-review-config";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const mode = applicationMode();
  if (mode === "disabled") return response(503, { accepted: false });
  try {
    const body = await readApplicationRequest(request);
    if (!body || body.marketingConsent !== true || body.consentNoticeVersion !== CONSENT_NOTICE_VERSION) return response(400, { accepted: false });
    const fields: ApplicationFields = {
      name: String(body.name ?? "").trim(), email: String(body.email ?? "").trim().toLowerCase(), company: String(body.company ?? "").trim(),
      dealSize: String(body.dealSize ?? ""), completedDeals: String(body.completedDeals ?? ""), targetDeals: String(body.targetDeals ?? ""), goals: String(body.goals ?? "").trim(), marketingConsent: body.marketingConsent as boolean,
    };
    const errors = validateApplication(fields);
    if (Object.keys(errors).length) return response(400, { accepted: false, errors });
    const attribution = readAttribution(new URLSearchParams(typeof body.attribution === "object" && body.attribution ? body.attribution as Record<string, string> : {}));
    if (mode === "local-review") await saveReviewRecord({ kind: "application", id: body.id, ...fields, attribution, consentMethod: "submission-notice", consentNoticeVersion: CONSENT_NOTICE_VERSION, consentNoticeText: CONSENT_NOTICE_TEXT });
    return response(200, { accepted: true, id: body.id, saved: mode === "local-review", mode });
  } catch { return response(503, { accepted: false }); }
}
