export const SMS_CONSENT_VERSION = "sca-sms-2026-11-12-v1";
export const SMS_OPT_IN_URL = "https://www.sapp.capital/apply";
export const SMS_SERVICE_DISCLOSURE = "I agree to receive automated text messages from Sapp Capital Advisors LLC about my inquiry, appointments, and requested services at the phone number provided. Message frequency varies. Message & data rates may apply. Reply HELP for help or STOP to unsubscribe.";
export const SMS_MARKETING_DISCLOSURE = "I agree to receive automated marketing and promotional text messages from Sapp Capital Advisors LLC, including service updates, educational resources, and offers, at the phone number provided. Message frequency varies. Message & data rates may apply. Reply HELP for help or STOP to unsubscribe. Consent is not a condition of purchase.";
export type SmsChoices = { smsServiceConsent?: boolean; smsMarketingConsent?: boolean };
export type SmsConsentEvidence = {
  service: boolean; marketing: boolean; phone: string; recordedAt: string;
  sourceUrl: string; version: string; serviceDisclosure: string; marketingDisclosure: string;
  method: "separate-optional-unchecked-checkboxes";
};
// Ten-digit US numbers are accepted; international numbers require a country code.
export function normalizeSmsPhone(value: string): string | null {
  if (!value || value.length > 40 || !/^[+\d\s().-]+$/.test(value)) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 && /^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return "+1" + digits;
  if (digits.length === 11 && /^1[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return "+" + digits;
  return value.trim().startsWith("+") && /^[1-9]\d{7,14}$/.test(digits) ? "+" + digits : null;
}
export function readSmsConsent(body: Record<string, unknown>): SmsConsentEvidence | null | false {
  const present = ["smsServiceConsent", "smsMarketingConsent", "smsConsentVersion"].some(key => key in body);
  // A cached older form grants no SMS consent.
  if (!present) return null;
  if (typeof body.smsServiceConsent !== "boolean" || typeof body.smsMarketingConsent !== "boolean" || body.smsConsentVersion !== SMS_CONSENT_VERSION) return false;
  const phone = normalizeSmsPhone(String(body.phone ?? ""));
  if ((body.smsServiceConsent || body.smsMarketingConsent) && !phone) return false;
  return {
    service: body.smsServiceConsent, marketing: body.smsMarketingConsent, phone: phone || "",
    recordedAt: new Date().toISOString(), sourceUrl: SMS_OPT_IN_URL, version: SMS_CONSENT_VERSION,
    serviceDisclosure: SMS_SERVICE_DISCLOSURE, marketingDisclosure: SMS_MARKETING_DISCLOSURE,
    method: "separate-optional-unchecked-checkboxes"
  };
}
