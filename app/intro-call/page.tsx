"use client";

import { useEffect, useState } from "react";

const CAL_URL = "https://cal.com/sappcapital/client-intro";
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type Gtag = (
  command: "get",
  targetId: string,
  fieldName: "client_id" | "session_id",
  callback: (value: string) => void,
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

function getAnalyticsValue(fieldName: "client_id" | "session_id") {
  return new Promise<string>((resolve) => {
    if (!MEASUREMENT_ID || !window.gtag) {
      resolve("");
      return;
    }

    const timeout = window.setTimeout(() => resolve(""), 1200);
    window.gtag("get", MEASUREMENT_ID, fieldName, (value) => {
      window.clearTimeout(timeout);
      resolve(value || "");
    });
  });
}

export default function IntroCallPage() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    let active = true;

    const forwardToCal = async () => {
      const destination = new URL(CAL_URL);
      const current = new URLSearchParams(window.location.search);

      for (const [key, value] of current.entries()) {
        if (key.startsWith("utm_") || key === "li_fat_id") {
          destination.searchParams.set(key, value);
        }
      }

      const [clientId, sessionId] = await Promise.all([
        getAnalyticsValue("client_id"),
        getAnalyticsValue("session_id"),
      ]);

      if (clientId) destination.searchParams.set("ga_client_id", clientId);
      if (sessionId) destination.searchParams.set("ga_session_id", sessionId);

      if (active) window.location.replace(destination.toString());
    };

    const fallbackTimer = window.setTimeout(() => setShowFallback(true), 1800);
    void forwardToCal();

    return () => {
      active = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-slate-950">
      <div>
        <p className="text-lg font-medium">Opening the intro call calendar...</p>
        {showFallback ? (
          <a className="mt-4 inline-block underline" href={CAL_URL}>
            Continue to scheduling
          </a>
        ) : null}
      </div>
    </main>
  );
}
