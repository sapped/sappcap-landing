import ReactGA from "react-ga4";

let initialized = false;

export const initGA = () => {
  if (initialized) return;

  const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (MEASUREMENT_ID) {
    ReactGA.initialize(MEASUREMENT_ID, {
      gtagOptions: {
        send_page_view: false, // We fire page views manually on route change.
      },
    });
    initialized = true;
  } else if (typeof window !== "undefined") {
    console.warn("Google Analytics Measurement ID not found");
  }
};

export const logPageView = (path?: string) => {
  initGA();
  if (!initialized) return;
  ReactGA.send({
    hitType: "pageview",
    page: path ?? window.location.pathname,
  });
};

// GA4-style named event, e.g. logGAEvent("book_cta_click", { link_text }).
export const logGAEvent = (name: string, params?: Record<string, unknown>) => {
  initGA();
  if (!initialized) return;
  ReactGA.event(name, params);
};
