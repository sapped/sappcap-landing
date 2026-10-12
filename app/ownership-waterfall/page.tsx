import type { Metadata } from "next";
import { CampaignLanding } from "@/components/campaign-landing";

export const metadata: Metadata = {
  title: "GP/LP ownership waterfalls | Sapp Capital Advisors",
  description: "Work through ownership waterfalls, distribution tiers and the terms behind a CRE deal's GP/LP allocation. Start with a free 30-minute intro to define the question and scope.",
  alternates: { canonical: "https://www.sapp.capital/ownership-waterfall" },
};

export default function Page() { return <CampaignLanding angle="ownership" />; }
