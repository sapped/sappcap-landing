import { notFound } from "next/navigation";
import Link from "next/link";
import { applicationMode } from "@/lib/application-experience";
import { AcquisitionShell } from "@/components/acquisition-shell";
import { ApplicationForm } from "@/components/application-form";
import styles from "@/components/application-form.module.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Apply to work with Sapp Capital Advisors", robots: { index: false, follow: false } };
export default function ApplyPage() {
  const mode=applicationMode();if(mode==="disabled")notFound();
  return <AcquisitionShell preview={false} applicationFunnel><div className={styles.banner}>{mode==="local-review" ? <>LOCAL REVIEW · Applications save on this computer. No emails or bookings. <Link href="/review-inbox">Review inbox</Link></> : "STAGING PREVIEW · No applications saved, emails sent or access granted."}</div><main className={styles.main}><header className={styles.intro}><p className={styles.kicker}>WORK WITH SAPP CAPITAL ADVISORS</p><h1>Let's put capacity behind<br />your next investment.</h1><p>Tell me about your business, the deals you're pursuing and where your team needs support. I'll use that context to recommend how we can work together.</p><p>Edward Sapp · Principal</p></header><ApplicationForm mode={mode} year={new Date().getFullYear()} /></main></AcquisitionShell>;
}
