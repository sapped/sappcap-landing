import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AcquisitionShell } from "@/components/acquisition-shell";

export const metadata: Metadata = {
  title: "Acquisition Model Review | Sapp Capital Advisors",
  description: "Understand the acquisition model you inherited before your next IC.",
  robots: { index: false, follow: false },
};

export default function AcquisitionLayout({ children }: { children: React.ReactNode }) {
  // Do not accidentally publish a simulated funnel while production integrations are pending.
  const live = process.env.ACQUISITION_LIVE === "true";
  if (process.env.NODE_ENV === "production" && !live) notFound();
  return <AcquisitionShell preview={!live}>{children}</AcquisitionShell>;
}
