import { notFound } from "next/navigation";
import { applicationMode } from "@/lib/application-experience";
import { AcquisitionShell } from "@/components/acquisition-shell";
import { CampaignEmailCapture } from "@/components/campaign-email-capture";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { acquisitionTestimonials } from "@/lib/testimonials";
import styles from "@/components/acquisition.module.css";
export const metadata = { title: "CRE template library | Sapp Capital Advisors", robots: { index: false, follow: false } };
export default function TemplatesPage() {
  if(["disabled","live"].includes(applicationMode()))notFound();
  return <AcquisitionShell applicationFunnel><main className={styles.entryMain}><section className={styles.entryHero}><p className={styles.eyebrow}>SAPP CAPITAL ADVISORS TEMPLATE LIBRARY</p><h1>Claim your CRE template.<br /><span>Start with a working foundation.</span></h1><p className={styles.heroDescription}>Explore how we structure acquisition and development underwriting, debt and ownership returns. Request access to the library, then tell us about your business if you need help applying it.</p><CampaignEmailCapture campaign="templates" /></section><section className={styles.entryProof} aria-label="What clients say"><TestimonialCarousel testimonials={acquisitionTestimonials} compact tone="dark" /></section></main></AcquisitionShell>;
}
