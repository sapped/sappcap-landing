// ChatGPT Ads (OpenAI) conversion pixel.
// Mirrors the official snippet: creates a queued `window.oaiq` stub, loads the
// SDK async, and inits with our pixel ID. Fire events via logOaiqEvent().

type OaiqQueue = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    oaiq?: OaiqQueue;
  }
}

const PIXEL_ID = "Kjjig18MokGwVUmQhe5BPV";
const SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js";

let initialized = false;

export const initOaiq = () => {
  if (initialized || typeof window === "undefined") return;

  if (!window.oaiq) {
    const q: OaiqQueue = function (...args: unknown[]) {
      q.q!.push(args);
    };
    q.q = [];
    window.oaiq = q;

    const j = document.createElement("script");
    j.async = true;
    j.src = SDK_URL;
    const f = document.getElementsByTagName("script")[0];
    if (f?.parentNode) {
      f.parentNode.insertBefore(j, f);
    } else {
      document.head.appendChild(j);
    }
  }

  // TODO: flip debug to false once events are verified in the ChatGPT Ads UI.
  window.oaiq("init", { pixelId: PIXEL_ID, debug: true });
  initialized = true;
};

// e.g. logOaiqEvent("appointment_scheduled", { type: "customer_action" })
export const logOaiqEvent = (
  name: string,
  params?: Record<string, unknown>
) => {
  initOaiq();
  window.oaiq?.("measure", name, params);
};
