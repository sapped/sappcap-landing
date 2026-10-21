import { CONSENT_NOTICE_VERSION, CONSENT_NOTICE_TEXT } from "@/lib/consent-notice";
import { applicationMode } from "@/lib/application-experience";
import { isEmail } from "@/lib/application-schema";
import { readApplicationRequest, readEntryContext, response } from "@/lib/application-request";
import { saveReviewRecord } from "@/lib/application-review-store";
import { readAttribution } from "@/lib/acquisition-review-config";
import { deliverApplicationIntake, intakeRateAllowed } from "@/lib/application-delivery";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  const mode = applicationMode();
  if (mode === "disabled") return response(503, { accepted: false });
  try {
    const body = await readApplicationRequest(request);
    if (!body || typeof body.email !== "string" || !isEmail(body.email.trim()) || !["home", "acquisition", "capacity", "ownership", "templates", "website-starter"].includes(String(body.campaign)) || body.marketingConsent !== true || body.consentNoticeVersion !== CONSENT_NOTICE_VERSION) return response(400, { accepted: false });
    const attribution = readAttribution(new URLSearchParams(typeof body.attribution === "object" && body.attribution ? body.attribution as Record<string, string> : {}));
    if (mode === "live") {
      if(body.campaign === "templates")return response(503,{accepted:false});
      if(!intakeRateAllowed(request))return response(429,{accepted:false});
      const delivery=await deliverApplicationIntake({kind:"email-capture",id:String(body.id),email:body.email.trim().toLowerCase(),campaign:String(body.campaign),attribution,...readEntryContext(body)});
      return response(200,{accepted:true,saved:true,mode,...delivery});
    }
    if (mode === "local-review") await saveReviewRecord({ kind: body.campaign === "templates" ? "template-request" : "email-capture", id: body.id, email: body.email.trim().toLowerCase(), campaign: body.campaign, marketingConsent: body.marketingConsent, consentMethod: "submission-notice", consentNoticeVersion: CONSENT_NOTICE_VERSION, consentNoticeText: CONSENT_NOTICE_TEXT, attribution, ...readEntryContext(body), ...(body.campaign === "templates" ? { fulfillment: "local-outbox-only", resource: "template-library", applicationRequired: false } : {}) });
    return response(200, { accepted: true, saved: mode === "local-review", mode, emailSent: false });
  } catch { return response(503, { accepted: false }); }
}
