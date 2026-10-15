import { AcquisitionShell } from "@/components/acquisition-shell";
import { AcquisitionWatch } from "@/components/acquisition-watch";
import { applicationMode } from "@/lib/application-experience";
export const metadata = { title: "Your deal model review | Sapp Capital Advisors" };
export default function Page() { return <AcquisitionShell applicationFunnel={applicationMode() !== "disabled"} preview={applicationMode() !== "live" && (applicationMode() !== "disabled" || process.env.ACQUISITION_LIVE !== "true")}><AcquisitionWatch deal /></AcquisitionShell>; }
