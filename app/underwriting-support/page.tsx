import type { Metadata } from "next";
import { CampaignLanding } from "@/components/campaign-landing";

export const metadata: Metadata = {
  title: "CRE underwriting support | Sapp Capital Advisors",
  description: "Underwriting support for a live commercial real estate deal. Work through the analysis with Sapp Capital Advisors or delegate a defined scope. Start with a free 30-minute intro.",
  alternates: { canonical: "https://www.sapp.capital/underwriting-support" },
};

export default function Page() { return <CampaignLanding angle="capacity" />; }
