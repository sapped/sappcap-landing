import { applicationMode } from "@/lib/application-experience";
import { AcquisitionShell } from "@/components/acquisition-shell";
import { DealHome } from "@/components/deal-home";
export const metadata = { title: "Commercial Real Estate Underwriting Capacity | Sapp Capital Advisors", description: "Work directly with Edward Sapp and our analyst team to move deals through investment committee. Principal-led underwriting and flexible analyst support built around your firm’s priorities." };
export default function Page() { return <AcquisitionShell navigation applicationFunnel={applicationMode() !== "disabled"} preview={applicationMode() !== "live" && (applicationMode() !== "disabled" || process.env.ACQUISITION_LIVE !== "true")}><DealHome /></AcquisitionShell>; }
