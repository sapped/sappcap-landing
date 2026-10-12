import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { AcquisitionShell } from "./acquisition-shell";

export function CampaignLayout({ children }: { children: ReactNode }) {
  const live = process.env.ACQUISITION_LIVE === "true";
  if (process.env.NODE_ENV === "production" && !live) notFound();
  return <AcquisitionShell preview={!live}>{children}</AcquisitionShell>;
}
