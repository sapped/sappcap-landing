"use client";
import Image from "next/image";
import Link from "next/link";
import { HeroVideoCarousel } from "./hero-video-carousel";
import { CampaignEmailCapture } from "./campaign-email-capture";
import { PressQuote } from "./press-quote";
import { BookingCTA } from "./acquisition-watch";
import { TestimonialCarousel } from "./testimonial-carousel";
import { testimonials } from "@/lib/testimonials";
import styles from "./deal-home.module.css";

const benefits = [
  { number: "01", title: "Put more of your pipeline to work.", body: "Add underwriting and execution support when your team’s capacity is holding up the next opportunity." },
  { number: "02", title: "Work with Edward, backed by a team.", body: "Get principal involvement in the direction and review, with analysts carrying the agreed work forward." },
  { number: "03", title: "Build a working relationship first.", body: "Start with five free one-hour working sessions. Bring real priorities, make progress together and see whether we’re the right team to support you." },
];
const steps = [
  { title: "Tell me where you want to go.", body: "Apply with your business goals, deal pipeline and the work your team needs help moving forward. I’ll review the fit." },
  { title: "Work through real priorities.", body: "For teams we’re a fit for, we start with five free one-hour sessions. Work through a live underwriting question, review a model or develop your team’s approach." },
  { title: "Define the support you need.", body: "If working together makes sense, we define the assignments, responsibilities and fee before paid work begins. Add capacity as your priorities develop." },
];

export function CapacityHome() {
  return <main className={styles.main}>
    <section className={`${styles.hero} ${styles.reviewHero}`}>
      <div className={styles.cityscape} aria-hidden="true"><HeroVideoCarousel /></div>
      <div className={styles.pitch}>
        <p className={styles.kicker}>FOR CRE INVESTMENT TEAMS</p>
        <h1>More capacity.<br /><span>For the deals ahead.</span></h1>
        <p className={styles.lede}>You have the capital and opportunities. Work directly with Edward and our analyst team to move the underwriting forward.</p>
        <p className={styles.capacityOffer}>Start with five free, one-hour working sessions.</p>
        <CampaignEmailCapture campaign="home" />
      </div>
      <aside className={styles.proof}>
        <PressQuote compact />
        <p className={styles.kicker}>WHAT CLIENTS SAY</p>
        <TestimonialCarousel testimonials={testimonials} compact tone="dark" />
      </aside>
    </section>

    <section id="expertise" className={styles.work}>
      <div className={styles.sectionHeading}>
        <p className={styles.kicker}>WHAT YOU GET</p>
        <h2>Experienced capacity behind your investment goals.</h2>
        <p>Work directly with Edward and our analyst team on the deals and priorities your business needs to move forward. We learn your business, take on defined assignments and stay involved as the work develops.</p>
      </div>
      <div className={styles.outcomes}>{benefits.map(item => <article key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div>
    </section>

    <section className={`${styles.expertise} ${styles.capacityExpertise}`} aria-label="Work we can support">
      {["Acquisition & development underwriting", "Existing models & new builds", "Debt & ownership structures", "Scenario analysis & investment review"].map(label => <p key={label}>{label}</p>)}
    </section>

    <section className={styles.capacityProcess} aria-labelledby="capacity-process-title">
      <header><p className={styles.kicker}>HOW WE START</p><h2 id="capacity-process-title">Five working sessions.<br />A chance to build trust through the work.</h2></header>
      <ol>{steps.map((step,index) => <li key={step.title}><span>0{index+1}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
      <p className={styles.capacityFit}>The sessions are for qualified CRE investment teams. Applying does not commit you to paid work.</p>
    </section>

    <section className={styles.principal}>
      <Image src="/images/edward-linkedin.jpeg" alt="Edward Sapp" width={160} height={160} />
      <div><p className={styles.kicker}>YOUR PRINCIPAL CONTACT</p><h2>Work with Edward.<br />Backed by a team.</h2><p>I start with your business, your goals and how each assignment fits the broader picture. I stay involved in the direction and review; our analysts carry the agreed work forward.</p><p className={styles.credential}><a href="https://linkedin.com/in/edwardsapp" target="_blank" rel="noopener noreferrer">Edward Sapp · Principal</a><br />10+ years of experience · $40B+ in transaction experience</p></div>
    </section>

    <section id="talk" className={styles.close}>
      <p className={styles.kicker}>START A WORKING RELATIONSHIP</p>
      <h2>Bring your goals.<br />Let’s get to work.</h2>
      <BookingCTA placement="bottom" />
      <p className={styles.note}>Tell me about your business and the capacity you need. I’ll review your application and follow up on the next step.</p>
    </section>
    <nav className={styles.links} aria-label="More from Sapp Capital"><a href="https://underwriting.sapp.capital">Client Underwriting Portal</a><a href="https://blog.sapp.capital">Writing</a><Link href="/templates">Template library</Link></nav>
  </main>;
}
