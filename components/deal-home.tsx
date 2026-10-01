"use client";
import Image from "next/image";
import { HeroVideoCarousel } from "./hero-video-carousel";
import { WalkthroughSignup } from "./walkthrough-signup";
import { PressQuote } from "./press-quote";
import { BookingCTA } from "./acquisition-watch";
import { TestimonialCarousel } from "./testimonial-carousel";
import { testimonials } from "@/lib/testimonials";
import styles from "./deal-home.module.css";

const outcomes = [
 {n:"01", title:"Know what the returns depend on.", body:"Trace the assumptions behind the headline numbers. Test what changes when rents, costs, timing or financing move."},
 {n:"02", title:"Make the model match the deal.", body:"Work through debt terms, funding schedules and ownership waterfalls against the documents they’re meant to reflect."},
 {n:"03", title:"Give your team a clear next step.", body:"Walk through the findings with us: what needs correcting, what needs more information and where your judgment matters."},
];
export function DealHome() {
 return <main className={styles.main}>
  <section className={styles.hero}>
   <div className={styles.cityscape} aria-hidden="true"><HeroVideoCarousel /></div>
   <div className={styles.pitch}>
    <p className={styles.kicker}>COMMERCIAL REAL ESTATE ADVISORY</p>
    <h1>Complex CRE deals.<br /><span>On short fuses.</span></h1>
    <p className={styles.lede}>Get the underwriting and model review your team needs to make the next decision. Acquisitions, development, portfolios and complex capital structures.</p>
    <p className={styles.offer}>See two problems we found in real model reviews, and how we worked through them.</p>
    <WalkthroughSignup destination="/deal/review" />
    <a className={styles.secondary} href="#talk">Already have a deal to discuss? Book an intro</a>
   </div>
   <aside className={styles.proof}>
    <p className={styles.kicker}>WHAT CLIENTS SAY</p>
    <TestimonialCarousel testimonials={testimonials} compact tone="dark" />
   </aside>
  </section>
  <PressQuote />
  <section id="expertise" className={styles.work}>
   <div className={styles.sectionHeading}><p className={styles.kicker}>WHAT YOU GET</p><h2>A model you can<br />explain and work with.</h2><p>Underwrite a purchase, plan a development, restructure the debt or track a portfolio. We build and review the models your team uses to make those decisions.</p></div>
   <div className={styles.outcomes}>{outcomes.map(item=><article key={item.n}><span>{item.n}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div>
  </section>
  <section className={styles.expertise} aria-label="Our expertise">
   {["Acquisition & development underwriting", "Portfolio, REIT & corporate strategy", "Model audit & review", "Asset management & reporting", "Waterfall & GP / LP structuring", "Debt, refinance & special situations"].map(label=><p key={label}>{label}</p>)}
  </section>
  <section className={styles.principal}>
   <Image src="/images/edward-linkedin.jpeg" alt="Edward Sapp" width={160} height={160} />
   <div><p className={styles.kicker}>PRINCIPAL-LED UNDERWRITING & ADVISORY</p><h2>Keep the context<br />across your decisions.</h2><p>Work with a team that can follow the model from acquisition or development through financing, investor reporting and exit. Principal involvement keeps the deal’s context in the work, with analyst support for the build and review.</p><p className={styles.credential}><a href="https://linkedin.com/in/edwardsapp" target="_blank" rel="noopener noreferrer">Edward Sapp · Principal</a><br />10+ years of experience · $40B+ in transaction experience</p></div>
  </section>
  <section id="talk" className={styles.close}><p className={styles.kicker}>LET’S LOOK AT YOUR DEAL</p><h2>What do you need<br />the model to answer?</h2><BookingCTA placement="bottom" /><p className={styles.note}>The intro is free. Underwriting, model review and corrections are scoped separately.</p><a className={styles.back} href="#email-signup">Start with the walkthrough</a></section>
  <nav className={styles.links} aria-label="More from Sapp Capital"><a href="https://underwriting.sapp.capital">Client Underwriting Portal</a><a href="https://blog.sapp.capital">Writing</a></nav>
 </main>;
}
