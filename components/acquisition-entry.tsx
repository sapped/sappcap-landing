"use client";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { acquisitionTestimonials } from "@/lib/testimonials";
import { WalkthroughSignup } from "./walkthrough-signup";
import { PressQuote } from "./press-quote";
import styles from "./acquisition.module.css";
export function AcquisitionEntry() {
 return <main className={styles.entryMain}>
  <section className={styles.entryHero}>
   <p className={styles.eyebrow}>FOR ACQUISITION DEAL TEAMS</p>
   <h1>Inherited a model?<br /><span>Know what’s in it before IC.</span></h1>
   <p className={styles.heroDescription}>See the hidden assumptions and formula problems we look for, so you can explain the numbers even when the person who built it has moved on.</p>
   <WalkthroughSignup />
  </section>
  <section className={styles.entryProof} aria-label="What clients say"><TestimonialCarousel testimonials={acquisitionTestimonials} compact tone="dark" /></section>
  <PressQuote />
 </main>;
}
