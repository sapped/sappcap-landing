export type ApplicationMode = "local-review" | "staging-preview" | "live" | "disabled";
export function applicationMode(): ApplicationMode {
  if (process.env.VERCEL_ENV === "production") return process.env.APPLICATION_FUNNEL_LIVE === "true" ? "live" : "disabled";
  if (process.env.VERCEL_ENV === "preview") return "staging-preview";
  if (process.env.LOCAL_REVIEW === "true" || process.env.NODE_ENV === "development") return "local-review";
  return "disabled";
}
