import ReactGA from "react-ga4";

export const initGA = () => {
  const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (MEASUREMENT_ID) {
    ReactGA.initialize(MEASUREMENT_ID, {
      gtagOptions: {
        send_page_view: false, // Prevents duplicate page views
      },
    });
  } else {
    console.warn("Google Analytics Measurement ID not found");
  }
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

export const logEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
