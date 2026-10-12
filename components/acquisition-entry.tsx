"use client";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { acquisitionTestimonials } from "@/lib/testimonials";
import { WalkthroughSignup } from "./walkthrough-signup";
import { PressQuote } from "./press-quote";
import styles from "./acquisition.module.css";
import { campaignEntryCopy, type CampaignAngle } from "@/lib/campaign-entry-copy";
export function CampaignEntry({ angle = "acquisition" }: { angle?: CampaignAngle }) {
 const copy = campaignEntryCopy[angle];
 return <main className={styles.entryMain}>
  <section className={styles.entryHero}>
   <p className={styles.eyebrow}>{copy.eyebrow}</p>
   <h1>{copy.headline}<br /><span>{copy.emphasis}</span></h1>
   <p className={styles.heroDescription}>{copy.description}</p>
   <WalkthroughSignup destination={copy.destination} angle={angle} />
  </section>
  <section className={styles.entryProof} aria-label="What clients say"><TestimonialCarousel testimonials={acquisitionTestimonials} compact tone="dark" /></section>
  <PressQuote />
 </main>;
}
export function AcquisitionEntry() { return <CampaignEntry />; }
