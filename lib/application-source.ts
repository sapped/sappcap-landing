// Capture the actual path in the shared form, not a hand-maintained campaign route list.
// Only plain site paths are accepted; query strings, external URLs and email addresses are not retained.
export function normalizeLandingPath(value: unknown, fallback = "/apply"): string {
  if (typeof value !== "string" || value.length > 160 || !/^\/(?:[a-zA-Z0-9_-]+\/?)*$/.test(value)) return fallback;
  return value === "/" ? "/" : value.replace(/\/$/, "");
}
export function landingPageName(value: unknown): string {
  const path = normalizeLandingPath(value);
  const known: Record<string, string> = {
    "/": "Homepage", "/apply": "Direct application", "/acquisition": "Acquisition lander",
    "/underwriting-support": "Underwriting support lander", "/ownership-waterfall": "Ownership waterfall lander",
    "/templates": "Template library lander", "/website-starter": "Website starter lander",
  };
  const generic = path.slice(1).split("/").map(part => part.replace(/[-_]/g, " ")).join(" / ");
  return `${known[path] || generic.charAt(0).toUpperCase() + generic.slice(1) + " lander"} (${path})`;
}
