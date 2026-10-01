import { AcquisitionShell } from "@/components/acquisition-shell";
import { AcquisitionWatch } from "@/components/acquisition-watch";
export const metadata = { title: "Your deal model review | Sapp Capital Advisors" };
export default function Page() { return <AcquisitionShell preview={process.env.ACQUISITION_LIVE !== "true"}><AcquisitionWatch deal /></AcquisitionShell>; }
