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
  { number: "01", title: "Keep senior judgment where it matters.", body: "Give your investment committee work that has been thought through. Edward stays involved in the analysis and review, with our analysts moving the work forward." },
  { number: "02", title: "Bring institutional discipline to the work.", body: "We work with the urgency and rigor of an institutional real estate private equity team: responsive communication, thorough analysis and a focus on your investment goals." },
  { number: "03", title: "Build a team that knows your business.", body: "We learn your firm, your standards and where you want to go. That context carries from one deal to the next, so you spend less time bringing outside help up to speed." },
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
        <p className={styles.kicker}>PRINCIPAL-LED UNDERWRITING</p>
        <h1>More capacity.<br /><span>For the deals ahead.</span></h1>
        <p className={styles.lede}>You have commercial real estate opportunities ready to move. When your senior team’s capacity is constrained, work directly with Edward and our analysts to move deals through investment committee.</p>
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
        <p className={styles.kicker}>WORKING ALONGSIDE YOUR TEAM</p>
        <h2>Experienced capacity behind your investment goals.</h2>
        <p>You need people who understand how your firm invests and what success looks like for you. We get to know your business and its goals, then work alongside your team as deals and priorities develop.</p>
      </div>
      <div className={styles.outcomes}>{benefits.map(item => <article key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div>
    </section>

    <section className={`${styles.expertise} ${styles.capacityExpertise}`} aria-label="Work we can support">
      {["Acquisition & development underwriting", "Existing models & new builds", "Debt & ownership structures", "Scenario analysis & investment review"].map(label => <p key={label}>{label}</p>)}
    </section>

    <section className={styles.capacityProcess} aria-labelledby="capacity-process-title">
      <header><p className={styles.kicker}>HOW WE START</p><h2 id="capacity-process-title">Five working sessions.<br />A chance to build trust through the work.</h2></header>
      <ol>{steps.map((step,index) => <li key={step.title}><span>0{index+1}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
      <p className={styles.capacityFit}>The sessions are for qualified commercial real estate investment teams. Applying does not commit you to paid work.</p>
    </section>

    <section className={styles.principal}>
      <Image src="/images/edward-linkedin.jpeg" alt="Edward Sapp" width={160} height={160} />
      <div><p className={styles.kicker}>YOUR PRINCIPAL CONTACT</p><h2>Work with Edward.<br />Backed by a team.</h2><p>I get to know your firm, your goals and the decisions on your desk. I stay close to the work, challenge the assumptions and help your team move toward those goals. Our analysts support that relationship with the capacity to carry the work forward.</p><p className={styles.credential}><a href="https://linkedin.com/in/edwardsapp" target="_blank" rel="noopener noreferrer">Edward Sapp · Principal</a><br />10+ years of experience · $40B+ in transaction experience</p></div>
    </section>

    <section id="talk" className={styles.close}>
      <p className={styles.kicker}>START A WORKING RELATIONSHIP</p>
      <h2>Bring your goals.<br />Let’s get to work.</h2>
      <p className={styles.capacityOffer}>Start with five free, one-hour working sessions.</p>
      <BookingCTA placement="bottom" />
      <p className={styles.note}>Tell me about your business and the capacity you need. I’ll review your application and follow up on the next step.</p>
    </section>
    <nav className={styles.links} aria-label="More from Sapp Capital"><a href="https://underwriting.sapp.capital">Client Underwriting Portal</a><a href="https://blog.sapp.capital">Writing</a><Link href="/templates">Template library</Link></nav>
  </main>;
}
