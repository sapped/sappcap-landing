"use client";

import { useEffect, useState } from "react";
import { getAnalyticsAttribution } from "@/lib/analytics";
import { CAL_BOOKING_URL, readAttribution, withAttribution } from "@/lib/acquisition-review-config";

export default function IntroCallPage() {
  const [showFallback, setShowFallback] = useState(false);
  const [destination, setDestination] = useState(CAL_BOOKING_URL);
  useEffect(() => {
    let active = true;
    const incoming = readAttribution(new URLSearchParams(window.location.search));
    setDestination(withAttribution(CAL_BOOKING_URL, incoming));
    const forward = async () => {
      const identity = await getAnalyticsAttribution();
      const url = withAttribution(CAL_BOOKING_URL, { ...incoming, ...identity });
      if (active) { setDestination(url); window.location.replace(url); }
    };
    const fallbackTimer = window.setTimeout(() => setShowFallback(true), 1800);
    void forward();
    return () => { active = false; window.clearTimeout(fallbackTimer); };
  }, []);
  return <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-slate-950"><div>
    <p className="text-lg font-medium">Opening the intro call calendar...</p>
    {showFallback && <a className="mt-4 inline-block underline" href={destination}>Continue to scheduling</a>}
  </div></main>;
}
