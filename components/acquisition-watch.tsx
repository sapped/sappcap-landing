"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";
import { getAnalyticsAttribution } from "@/lib/analytics";
import { ArrowUpRight } from "lucide-react";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { acquisitionTestimonials } from "@/lib/testimonials";
import { withAttribution, CAL_BOOKING_URL } from "@/lib/acquisition-review-config";
import { useAcquisition } from "./acquisition-shell";
import styles from "./acquisition.module.css";

const examples = [
  { label: "DOCUMENTED MODEL CORRECTION", metric: "+21%", metricLabel: "in the sponsor’s modeled profit allocation", title: "The old deal still inside your waterfall.", body: "A reused workbook still carried a preferred-return hurdle from an earlier deal. Removing that term increased the sponsor’s modeled allocation by about 21%, bringing it back to the agreed split. Total project profit stayed the same.", check: "A corrected allocation, not new profit or cash recovered.", before: "Prior deal’s hurdle", after: "Allocation corrected" },
  { label: "DOCUMENTED SCENARIO ANALYSIS", metric: "−70%", metricLabel: "in projected promote under an alternate case", title: "The promote depended on the assumptions.", body: "In a platform acquisition review, we tested lower rent premiums, normalized operating margins and adjusted one exit cap rate across a sample portfolio. Projected promote fell by about 70% against management’s case.", check: "A modeled sensitivity, not a realized loss. It showed the buyer how much the acquired economics depended on those assumptions.", before: "Management assumptions", after: "Alternate underwriting case" },
];

function BookingCTA({ placement }: { placement: "top" | "bottom" }) {
  const { attribution, record, preview } = useAcquisition();
  const [opening, setOpening] = useState(false);
  async function openCalendar(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (opening) return;
    setOpening(true);
    record("intro_calendar_click", { simulated: String(preview), placement });
    const identity = await getAnalyticsAttribution();
    window.location.assign(withAttribution(CAL_BOOKING_URL, { ...attribution, ...identity }));
  }
  return <div className={styles.bookingAction}>
    <a className={styles.primaryButton} href={withAttribution(CAL_BOOKING_URL, attribution)} onClick={openCalendar} aria-busy={opening}>Let’s work through your model <ArrowUpRight size={18} /></a>
    <p className={styles.smallPrint}>Choose a time on Cal.com · Free 30-minute intro</p>
  </div>;
}

export function AcquisitionWatch() {
  return (
    <main className={styles.watchMain}>
      <header className={styles.watchIntro}>
        <p className={styles.eyebrow}>YOUR ACQUISITION MODEL REVIEW</p>
        <h1>Know what you’re<br /><span>taking to IC.</span></h1>
        <p>Let’s work through the model you inherited, the assumptions behind it and the questions you need answered before your decision.</p>
        <BookingCTA placement="top" />
      </header>
      <section className={styles.reviewSteps} aria-labelledby="review-steps">
        <p className={styles.eyebrow}>HOW WE GET THERE</p>
        <h2 id="review-steps">Start with the model you have.</h2>
        <ol>
          <li><span>01</span><div><h3>Share the materials.</h3><p>First, choose a time to discuss your deal and deadline. Once we agree scope, we’ll request the latest model and relevant supporting materials, such as debt terms and ownership agreements.</p></div></li>
          <li><span>02</span><div><h3>We trace and test.</h3><p>We compare assumptions with the source documents, follow the formulas and test how the outputs respond when the inputs change.</p></div></li>
          <li><span>03</span><div><h3>Walk through the findings together.</h3><p>See what needs correcting, what needs more information and which assumptions still need your judgment.</p></div></li>
        </ol>
      </section>
      <section aria-labelledby="review-examples">
      <div className={styles.examplesIntro}><p className={styles.eyebrow}>EXAMPLES FROM OUR REVIEWS</p><h2 id="review-examples">Problems that didn’t show up as Excel errors.</h2></div>
      <div className={styles.caseList}>
        {examples.map((item, index) => <article className={styles.caseCard} key={item.title}>
          <div className={styles.caseTop}><span className={styles.caseNumber}>0{index + 1}</span><p className={styles.eyebrow}>{item.label}</p></div>
          <div className={styles.caseMetric}><strong>{item.metric}</strong><span>{item.metricLabel}</span></div>
          <h2>{item.title}</h2><p>{item.body}</p>
          <div className={styles.causeEffect}><span>{item.before}</span><span aria-hidden="true">→</span><strong>{item.after}</strong></div>
          <p className={styles.reviewCheck}>{item.check}</p>
        </article>)}
      </div>
      </section>
      <section className={styles.personalNote}>
        <Image src="/images/edward_blue.jpeg" alt="Edward Sapp" width={72} height={72} />
        <div><h2>Let’s look at what you inherited.</h2><p>I’m Edward Sapp. We can start with the workbook you have, the decision in front of you and the deadline. We’ll agree what needs review, trace the assumptions and formulas, and walk through the findings with your team.</p><p className={styles.smallPrint}>Examples are anonymized; engagements span acquisition and development work. Review scope depends on your deal.</p></div>
      </section>
      <section className={styles.salesProof} aria-label="What clients say"><TestimonialCarousel testimonials={acquisitionTestimonials} compact tone="dark" /></section>
      <section id="calendar" className={styles.bookingClose}>
        <p className={styles.eyebrow}>YOUR NEXT STEP</p>
        <h2>Bring the deal.<br />We’ll talk through the review.</h2>
        <p>Tell me what you’re buying, when you need an answer and where the model leaves you unsure.</p>
        <BookingCTA placement="bottom" />
        <p className={styles.smallPrint}>We’ll agree the scope before requesting your files.<br />The intro is free. Model review and corrections are scoped separately.</p>
      </section>
    </main>
  );
}
