import { CampaignLayout } from "@/components/campaign-layout";
import { CampaignReview } from "@/components/campaign-landing";
export const metadata = { title: "Your ownership waterfall walkthrough | Sapp Capital Advisors", robots: { index: false, follow: false } };
export default function Page() { return <CampaignLayout><CampaignReview angle="ownership" /></CampaignLayout>; }
