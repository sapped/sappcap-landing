export const ACQUISITION_EXPERIMENT = "acquisition_review_v1";
export const CAL_BOOKING_URL = "https://cal.com/sappcapital/client-intro";
export const ATTRIBUTION_STORAGE_KEY = "sca_acquisition_attribution_v1";
export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "li_fat_id", "oppref", "ga_client_id", "ga_session_id"] as const;
export type Attribution = Partial<Record<typeof ATTRIBUTION_KEYS[number], string>>;

// Only explicit campaign fields pass through. Never accept a destination or contact data.
export function readAttribution(params: URLSearchParams): Attribution {
  const result: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (!value || value.length > 512 || /[\x00-\x1f\x7f@]/.test(value)) continue;
    if ((key === "ga_client_id" || key === "ga_session_id") && !/^[0-9.]+$/.test(value)) continue;
    result[key] = value;
  }
  return result;
}
export function withAttribution(destination: string, attribution: Attribution): string {
  const query = new URLSearchParams(readAttribution(new URLSearchParams(attribution)));
  return query.size ? `${destination}?${query.toString()}` : destination;
}
// Local preview only. Replace with durable subscriber capture before production launch.
export async function submitPreviewLead(fail: boolean): Promise<{ id: string }> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  if (fail) throw new Error("Preview submission failure");
  return { id: `preview-${crypto.randomUUID()}` };
}
