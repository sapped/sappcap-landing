import { applicationMode } from "@/lib/application-experience";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { AcquisitionShell } from "./acquisition-shell";

export function CampaignLayout({ children }: { children: ReactNode }) {
  const applicationFunnel = applicationMode() !== "disabled";
  const live = process.env.ACQUISITION_LIVE === "true";
  if (process.env.NODE_ENV === "production" && !live && !applicationFunnel) notFound();
  return <AcquisitionShell preview={applicationFunnel || !live} applicationFunnel={applicationFunnel}>{children}</AcquisitionShell>;
}
