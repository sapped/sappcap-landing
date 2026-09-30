import ReactGA from "react-ga4";
import type { Attribution } from "@/lib/acquisition-review-config";

export const GA_MEASUREMENT_ID = "G-DPX39ZX3N4";
let initialized = false;

// Preview deployments and local tests must never pollute the live property.
export const analyticsAllowed = () => typeof window !== "undefined"
  && process.env.NODE_ENV === "production"
  && ["sapp.capital", "www.sapp.capital"].includes(window.location.hostname);

export const initGA = () => {
  if (!analyticsAllowed() || initialized) return;
  ReactGA.initialize(GA_MEASUREMENT_ID, { gtagOptions: { send_page_view: false } });
  initialized = true;
};

export const logPageView = (path?: string) => {
  initGA();
  if (!analyticsAllowed() || !initialized) return;
  ReactGA.send({ hitType: "pageview", page: path ?? window.location.pathname });
};

// Signup and calendar clicks are funnel events, never booked-appointment conversions.
export const logGAEvent = (name: string, params?: Record<string, unknown>) => {
  initGA();
  if (!analyticsAllowed() || !initialized) return;
  ReactGA.event(name, params);
};

// Ask the actual Google tag for its IDs. If blocked/unavailable, omit them rather
// than manufacture an identity that cannot join to the visitor's GA session.
export async function getAnalyticsAttribution(): Promise<Attribution> {
  initGA();
  if (!analyticsAllowed()) return {};
  type Getter = (command: "get", id: string, field: string, callback: (value: unknown) => void) => void;
  const tag = (window as unknown as { gtag?: Getter }).gtag;
  if (!tag) return {};
  const read = (field: "client_id" | "session_id") => new Promise<string>((resolve) => {
    const timeout = window.setTimeout(() => resolve(""), 1200);
    try {
      tag("get", GA_MEASUREMENT_ID, field, (value) => {
        window.clearTimeout(timeout);
        const clean = String(value ?? "");
        resolve(clean.length <= 128 && /^[0-9.]+$/.test(clean) ? clean : "");
      });
    } catch { window.clearTimeout(timeout); resolve(""); }
  });
  const [client, session] = await Promise.all([read("client_id"), read("session_id")]);
  return { ...(client ? { ga_client_id: client } : {}), ...(session ? { ga_session_id: session } : {}) };
}
