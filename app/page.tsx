import { AcquisitionShell } from "@/components/acquisition-shell";
import { DealHome } from "@/components/deal-home";
export const metadata = { title: "Complex CRE deals on short fuses | Sapp Capital Advisors", description: "Principal-led underwriting and model review for commercial real estate deals, portfolios and capital structures. Trace assumptions, test returns and work through the findings." };
export default function Page() { return <AcquisitionShell navigation preview={process.env.ACQUISITION_LIVE !== "true"}><DealHome /></AcquisitionShell>; }
