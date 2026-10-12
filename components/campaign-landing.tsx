"use client";

import Image from "next/image";
import { BookingCTA } from "./acquisition-watch";
import { TestimonialCarousel } from "./testimonial-carousel";
import { acquisitionTestimonials } from "@/lib/testimonials";
import styles from "./acquisition.module.css";

const content = {
  capacity: {
    eyebrow: "COMMERCIAL REAL ESTATE UNDERWRITING",
    heading: "Underwriting support for a live deal.",
    description: "Your team has a deal to work through. We can work alongside you or take on the analysis: acquisition underwriting, debt structures and ownership waterfalls.",
    processHeading: "Work through it together or hand it over.",
    steps: [
      { title: "Discuss the deal and deadline.", body: "On a free 30-minute intro, tell us what you need the analysis to answer and when you need it." },
      { title: "Agree the work.", body: "We define the deliverables, the materials needed and the paid scope. That can be a focused question or a broader underwriting assignment." },
      { title: "Work through the analysis.", body: "We build or review the model, work through the assumptions and discuss the findings with your team." },
    ],
    note: "Bring the question your team needs answered.",
    noteBody: "I’m Edward Sapp. We can start with the deal, the work already done and the next decision. You can work through the analysis with us or delegate a defined scope.",
    closing: "Let’s discuss what needs doing.",
  },
  ownership: {
    eyebrow: "OWNERSHIP WATERFALL ANALYSIS",
    heading: "Check how the deal proceeds split.",
    description: "Work through the GP/LP waterfall and the terms behind the allocation. We model ownership distributions and review how the workbook reflects the agreed structure.",
    processHeading: "Start with the terms and the question.",
    steps: [
      { title: "Discuss the structure.", body: "On a free 30-minute intro, tell us which allocation or deal term you need to work through." },
      { title: "Agree the analysis.", body: "We define the paid scope before requesting your model, ownership agreement and other supporting materials." },
      { title: "Trace the distributions.", body: "We work through the distribution tiers, preferred return and promote, then review the allocation and findings with you." },
    ],
    note: "Bring the terms you need to work through.",
    noteBody: "I’m Edward Sapp. We can start with an existing waterfall or a structure you need to model. The intro defines the question and what further analysis would involve.",
    closing: "Let’s work through your structure.",
  },
};

export function CampaignReview({ angle }: { angle: keyof typeof content }) {
  const page = content[angle];
  return <main className={styles.watchMain}>
      <header className={styles.watchIntro}>
        <p className={styles.eyebrow}>{page.eyebrow}</p>
        <h1>{page.heading}</h1>
        <p>{page.description}</p>
        <BookingCTA placement="top" label="Book a free 30-minute intro" />
        <p className={styles.smallPrint}>The intro defines the work. Underwriting and waterfall analysis are scoped separately.</p>
      </header>
      <section className={styles.reviewSteps} aria-labelledby="engagement-steps">
        <p className={styles.eyebrow}>HOW AN ENGAGEMENT WORKS</p>
        <h2 id="engagement-steps">{page.processHeading}</h2>
        <ol>{page.steps.map((step, index) => <li key={step.title}><span>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol>
      </section>
      {angle === "ownership" && <section aria-labelledby="waterfall-example">
        <div className={styles.examplesIntro}><p className={styles.eyebrow}>EXAMPLE FROM A MODEL REVIEW</p><h2 id="waterfall-example">An old hurdle changed the allocation.</h2></div>
        <article className={styles.caseCard}>
          <div className={styles.caseMetric}><strong>+21%</strong><span>in the sponsor’s modeled profit allocation</span></div>
          <p>A reused workbook still carried a preferred-return hurdle from an earlier deal. Removing that term increased the sponsor’s modeled allocation by about 21%, bringing it back to the agreed split. Total project profit stayed the same.</p>
          <p className={styles.reviewCheck}>A corrected allocation, not new profit or cash recovered. This anonymized example describes one review, not a promised result.</p>
        </article>
      </section>}
      <section className={styles.salesProof} aria-label="What clients say"><TestimonialCarousel testimonials={acquisitionTestimonials} compact tone="dark" /></section>
      <section className={styles.personalNote}>
        <Image src="/images/edward-linkedin.jpeg" alt="Edward Sapp" width={72} height={72} />
        <div><h2>{page.note}</h2><p>{page.noteBody}</p></div>
      </section>
      <section className={styles.bookingClose}>
        <p className={styles.eyebrow}>YOUR NEXT STEP</p>
        <h2>{page.closing}</h2>
        <p>Choose a time to discuss the question, the deadline and the scope of a potential engagement.</p>
        <BookingCTA placement="bottom" label="Book a free 30-minute intro" />
        <p className={styles.smallPrint}>No presentation needed. We agree paid scope before requesting files or starting the analysis.</p>
      </section>
    </main>;
}
