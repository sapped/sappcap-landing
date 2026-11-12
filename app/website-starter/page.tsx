import Link from "next/link";
import { AcquisitionShell } from "@/components/acquisition-shell";
import { CampaignEmailCapture } from "@/components/campaign-email-capture";
import { applicationMode } from "@/lib/application-experience";
import type { Metadata } from "next";
import styles from "./website-starter.module.css";
export const metadata: Metadata = {title:"Website Agent Starter | Sapp Capital Advisors",description:"An original prompt and practical guide for building and maintaining a website with an AI agent, GitHub and preview deployments."};
export default function WebsiteStarterPage() {
 return <AcquisitionShell preview={applicationMode() !== "live"} applicationFunnel>
  <main className={styles.main}><section className={styles.hero}>
   <p className={styles.eyebrow}>A PRACTICAL RESOURCE FROM EDWARD SAPP</p>
   <h1>A website you can change<br/><span>by describing what you want.</span></h1>
   <p className={styles.lead}>Give your AI agent a clear starting point: an original website, a preview before every release, and accounts you control.</p>
   <CampaignEmailCapture campaign="website-starter" />
  </section><aside className={styles.card}><p className={styles.eyebrow}>INSIDE THE FREE STARTER</p>
   <h2>The plan, not another platform.</h2><ol><li><strong>A prompt to give your agent.</strong><p>Describe your business, build an original site, and review it before publication.</p></li><li><strong>A simple release path.</strong><p>Local build → GitHub → Vercel preview → your approval → live website.</p></li><li><strong>A guide to keeping it yours.</strong><p>Shared components, a route map, sensible form delivery and domain setup without disturbing your email.</p></li></ol>
   <p className={styles.note}>Vercel Hobby is a good starting tier for personal, noncommercial projects. Business sites need an eligible plan. Domains, AI tools and other services can have separate costs. <a href="https://vercel.com/docs/plans/hobby">Check current terms.</a></p>
  </aside><section className={styles.context}><h2>Useful systems free up time for the work that matters.</h2><p>My main work is with commercial real estate investment teams. My analysts and I add underwriting capacity and senior judgment, with me personally involved. If that’s the constraint in your business, <Link href="/apply">tell me what you’re working toward</Link>.</p><p className={styles.note}>The starter contains original instructions, not SCA’s source code or a promise of technical support.</p></section></main>
 </AcquisitionShell>;
}
