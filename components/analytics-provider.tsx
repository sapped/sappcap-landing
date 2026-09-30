"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initGA, logPageView, logGAEvent } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initGA();
  }, []);

  // Fire a page view on first load and on every client-side route change.
  useEffect(() => {
    logPageView(pathname);
  }, [pathname]);

  // Track outbound CTA clicks anywhere on the site:
  //  - cal.com booking links  -> book_cta_click
  //  - underwriting portal links -> portal_click (with template slug)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!link) return;

      let destination: URL;
      try { destination = new URL(link.href); } catch { return; }
      // Never report contact data or attribution IDs carried in destination queries.
      const safeUrl = destination.origin + destination.pathname;

      if (destination.hostname === "cal.com") {
        logGAEvent("book_cta_click", {
          link_url: safeUrl,
          link_text: (link.textContent || "").trim().slice(0, 100),
          page_path: window.location.pathname,
        });
        return;
      }

      if (destination.hostname === "underwriting.sapp.capital") {
        logGAEvent("portal_click", {
          link_url: safeUrl,
          // Set on each template card / CTA; "all" = the generic portal button.
          template: link.dataset.template || "unknown",
          link_text: (link.textContent || "").trim().slice(0, 100),
          page_path: window.location.pathname,
        });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <>{children}</>;
}
