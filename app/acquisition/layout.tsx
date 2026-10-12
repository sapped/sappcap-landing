import type { Metadata } from "next";
import { CampaignLayout } from "@/components/campaign-layout";

export const metadata: Metadata = {
  title: "Acquisition Model Review | Sapp Capital Advisors",
  description: "Understand the acquisition model you inherited before your next IC.",
  robots: { index: false, follow: false },
};

export default function AcquisitionLayout({ children }: { children: React.ReactNode }) {
  return <CampaignLayout>{children}</CampaignLayout>;
}
