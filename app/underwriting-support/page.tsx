import type { Metadata } from "next";
import { CampaignEntry } from "@/components/acquisition-entry";
import { CampaignLayout } from "@/components/campaign-layout";

export const metadata: Metadata = {
  title: "CRE underwriting support | Sapp Capital Advisors",
  description: "Underwriting support for a live commercial real estate deal. Work through the analysis with Sapp Capital Advisors or delegate a defined scope. Start with a free 30-minute intro.",
  alternates: { canonical: "https://www.sapp.capital/underwriting-support" },
};

export default function Page() { return <CampaignLayout><CampaignEntry angle="capacity" /></CampaignLayout>; }
