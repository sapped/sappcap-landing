export const CONSENT_COOKIE = "sca_privacy_choices";
export type PrivacyChoices = { version: 1; analytics: boolean; advertising: boolean };
const denied: PrivacyChoices = { version: 1, analytics: false, advertising: false };

export function privacySignalEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true
    || navigator.doNotTrack === "1";
}

export function savedPrivacyChoices(): PrivacyChoices | null {
  if (typeof document === "undefined") return null;
  try {
    const value = document.cookie.split(";").map(item => item.trim()).find(item => item.startsWith(CONSENT_COOKIE + "="));
    if (!value) return null;
    const parsed: unknown = JSON.parse(decodeURIComponent(value.slice(CONSENT_COOKIE.length + 1)));
    if (!parsed || typeof parsed !== "object") return null;
    const choice = parsed as Record<string, unknown>;
    return choice.version === 1 && typeof choice.analytics === "boolean" && typeof choice.advertising === "boolean"
      ? { version: 1, analytics: choice.analytics, advertising: choice.advertising } : null;
  } catch { return null; }
}

export function privacyChoices(): PrivacyChoices {
  return privacySignalEnabled() ? { ...denied } : savedPrivacyChoices() || { ...denied };
}

export function optionalTrackingAllowed(category: "analytics" | "advertising"): boolean {
  return privacyChoices()[category];
}

export function clearOptionalCookies() {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  const domains = ["", "; Domain=" + host];
  if (host === "sapp.capital" || host.endsWith(".sapp.capital")) domains.push("; Domain=sapp.capital");
  for (const item of document.cookie.split(";")) {
    const name = item.trim().split("=", 1)[0];
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$)|_fbp$|_fbc$)/.test(name)) continue;
    for (const domain of domains) document.cookie = name + "=; Max-Age=0; Path=/" + domain + "; SameSite=Lax";
  }
}

export function savePrivacyChoices(analytics: boolean, advertising: boolean): boolean {
  if (typeof document === "undefined") return false;
  const choice: PrivacyChoices = privacySignalEnabled() ? { ...denied } : { version: 1, analytics, advertising };
  const host = window.location.hostname;
  const domain = host === "sapp.capital" || host.endsWith(".sapp.capital") ? "; Domain=sapp.capital" : "";
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  try {
    document.cookie = CONSENT_COOKIE + "=" + encodeURIComponent(JSON.stringify(choice)) + "; Max-Age=15552000; Path=/; SameSite=Lax" + domain + secure;
    if (!choice.analytics || !choice.advertising) clearOptionalCookies();
    const stored = savedPrivacyChoices();
    return stored?.analytics === choice.analytics && stored.advertising === choice.advertising;
  } catch { return false; }
}
