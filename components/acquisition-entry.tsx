"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { acquisitionTestimonials } from "@/lib/testimonials";
import { submitPreviewLead, withAttribution } from "@/lib/acquisition-review-config";
import { getAnalyticsAttribution, logGAEvent } from "@/lib/analytics";
import { useAcquisition } from "./acquisition-shell";
import styles from "./acquisition.module.css";

export function AcquisitionEntry() {
  const { preview, email, setEmail, failSubmit, record, attribution } = useAcquisition();
  const [captureId] = useState(() => crypto.randomUUID());
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError("Enter a valid email address."); document.getElementById("work-email")?.focus(); return; }
    setError(""); setPending(true);
    try {
      const capturedAttribution = { ...attribution, ...await getAnalyticsAttribution() };
      if (preview) {
        await submitPreviewLead(failSubmit);
      } else {
        const response = await fetch("/api/acquisition/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(25000),
          body: JSON.stringify({ email: value, attribution: capturedAttribution, consent: true, website, captureId }),
        });
        const result = await response.json();
        if (result.code === "confirmation_required") {
          setError("This address needs subscription confirmation. Please contact Edward or use another email.");
          setPending(false);
          return;
        }
        if (!response.ok || !result.accepted) throw new Error("Subscription unavailable");
        logGAEvent("walkthrough_opt_in", { experiment_id: "acquisition_review_v1" });
      }
      setEmail(value); record("walkthrough_opt_in", { simulated: String(preview) });
      router.push(withAttribution("/acquisition/review", capturedAttribution));
    } catch {
      setError("We couldn't save your email. Please try again.");
      setPending(false);
    }
  }
  return (
    <main className={styles.entryMain}>
      <section className={styles.entryHero}>
        <p className={styles.eyebrow}>FOR ACQUISITION DEAL TEAMS</p>
        <h1>Inherited a model?<br /><span>Know what’s in it before IC.</span></h1>
        <p className={styles.heroDescription}>See the hidden assumptions and formula problems we look for, so you can explain the numbers even when the person who built it has moved on.</p>
        <form id="email-signup" className={styles.emailForm} onSubmit={submit} noValidate>
          <div className={styles.botField} aria-hidden="true"><label htmlFor="company-website">Leave this field empty</label><input id="company-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
          <label htmlFor="work-email">Work email</label>
          <div className={styles.emailRow}>
            <input id="work-email" type="email" autoComplete="email" inputMode="email" maxLength={254} placeholder="you@company.com" value={email} onChange={(event) => { setEmail(event.target.value); if (error) setError(""); }} aria-required="true" aria-invalid={!!error} aria-describedby={error ? "email-error" : "email-disclosure"} disabled={pending} />
            <button type="submit" disabled={pending}>{pending ? <><Loader2 size={17} className={styles.spin} /> Opening walkthrough…</> : <>Continue to walkthrough <ArrowRight size={17} /></>}</button>
          </div>
          <p id="email-error" role="alert" className={styles.error}>{error}</p>
          <p id="email-disclosure" className={styles.disclosure}>Get the walkthrough and follow-up emails from Edward. Unsubscribe anytime. <Link href="/privacy">Privacy</Link></p>
        </form>
      </section>
      <section className={styles.entryProof} aria-label="What clients say">
        <TestimonialCarousel testimonials={acquisitionTestimonials} compact tone="dark" />
      </section>
    </main>
  );
}
