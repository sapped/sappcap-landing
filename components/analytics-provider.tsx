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

  // Track clicks on any cal.com booking CTA, anywhere on the site.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.(
        'a[href*="cal.com"]'
      ) as HTMLAnchorElement | null;
      if (!link) return;
      logGAEvent("book_cta_click", {
        link_url: link.href,
        link_text: (link.textContent || "").trim().slice(0, 100),
        page_path: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <>{children}</>;
}
