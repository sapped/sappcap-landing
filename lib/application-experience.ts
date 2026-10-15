// This review release cannot turn on the replacement funnel in production.
export type ApplicationMode = "local-review" | "staging-preview" | "disabled";
export function applicationMode(): ApplicationMode {
  if (process.env.VERCEL_ENV === "production") return "disabled";
  if (process.env.VERCEL_ENV === "preview") return "staging-preview";
  if (process.env.LOCAL_REVIEW === "true" || process.env.NODE_ENV === "development") return "local-review";
  return "disabled";
}
