"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { consumeApplicationEmail } from "@/lib/application-handoff";
import { DEAL_SIZE_OPTIONS, validateApplication, type ApplicationFields, type ApplicationErrors } from "@/lib/application-schema";
import { readAttribution, ATTRIBUTION_STORAGE_KEY } from "@/lib/acquisition-review-config";
import type { ApplicationMode } from "@/lib/application-experience";
import styles from "./application-form.module.css";
const empty: ApplicationFields = { name: "", email: "", company: "", dealSize: "", completedDeals: "", targetDeals: "", goals: "", marketingConsent: false };
export function ApplicationForm({ mode, year }: { mode: ApplicationMode; year: number }) {
  const [fields, setFields] = useState<ApplicationFields>(empty);
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [busy, setBusy] = useState(false); const [failure, setFailure] = useState(""); const [receipt, setReceipt] = useState("");
  const [website, setWebsite] = useState("");
  const id = useRef(""); const initialized = useRef(false);
  useEffect(() => { if (initialized.current) return; initialized.current = true; id.current = crypto.randomUUID(); const email = consumeApplicationEmail(); if (email) setFields(current => ({ ...current, email })); }, []);
  function update(key: keyof ApplicationFields, value: string | boolean) { setFields(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: undefined })); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const next = validateApplication(fields); setErrors(next); setFailure("");
    if (Object.keys(next).length) { document.getElementById(`apply-${Object.keys(next)[0]}`)?.focus(); return; }
    setBusy(true);
    try {
      let source = {};
      try { source = JSON.parse(sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || "{}"); } catch { /* Attribution must not block an application. */ }
      const attribution = { ...readAttribution(new URLSearchParams(source)), ...readAttribution(new URLSearchParams(window.location.search)) };
      const result = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(12000), body: JSON.stringify({ ...fields, id: id.current, website, attribution }) });
      const body = await result.json();
      if (!result.ok || !body.accepted) { if (body.errors) setErrors(body.errors); throw new Error("not saved"); }
      setReceipt(body.id);
    } catch { setFailure("Your application wasn't saved. Please try again. Your answers are still here."); }
    finally { setBusy(false); }
  }
  const textField = (key: "name" | "email" | "company", label: string, autoComplete: string) => <div className={styles.field}><label htmlFor={`apply-${key}`}>{label}</label><input id={`apply-${key}`} name={key} type={key === "email" ? "email" : "text"} autoComplete={autoComplete} value={fields[key]} onChange={e => update(key, e.target.value)} required maxLength={key === "email" ? 254 : key === "name" ? 120 : 160} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} /><p id={`error-${key}`} className={styles.error}>{errors[key]}</p></div>;
  if (receipt) return <section className={styles.result} aria-live="polite"><p className={styles.kicker}>REVIEW COMPLETE</p><h2>{mode === "local-review" ? "Your application is saved locally." : "You've completed the preview."}</h2><p>{mode === "local-review" ? "You can inspect the captured application in the local review inbox. Nothing was emailed, booked or enrolled in marketing." : "This staging preview does not save applications or send emails. The production intake has not been activated."}</p><dl><dt>Name</dt><dd>{fields.name}</dd><dt>Email</dt><dd>{fields.email}</dd><dt>Company</dt><dd>{fields.company}</dd></dl><div className={styles.links}>{mode === "local-review" && <Link href="/review-inbox">Open local review inbox</Link>}<Link href="/">Back to homepage</Link></div></section>;
  return <form className={styles.form} onSubmit={submit} noValidate>
    <div className={styles.hidden} aria-hidden="true"><label htmlFor="apply-website">Leave empty</label><input id="apply-website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></div>
    <section className={styles.section}><h2>01 / Your business</h2><div className={styles.grid}>{textField("name", "Your name", "name")}{textField("email", "Email", "email")}<div className={styles.full}>{textField("company", "Company", "organization")}</div></div></section>
    <section className={styles.section}><h2>02 / Your deal pipeline</h2><div className={styles.grid}><div className={`${styles.field} ${styles.full}`}><label htmlFor="apply-dealSize">Typical deal size</label><select id="apply-dealSize" value={fields.dealSize} onChange={e => update("dealSize", e.target.value)} required aria-invalid={!!errors.dealSize} aria-describedby="error-dealSize"><option value="">Select a range</option>{DEAL_SIZE_OPTIONS.map(size => <option key={size}>{size}</option>)}</select><p id="error-dealSize" className={styles.error}>{errors.dealSize}</p></div>{([['completedDeals', `Deals completed in ${year}`], ['targetDeals', 'Target deals in the next 12 months']] as const).map(([key,label]) => <div className={styles.field} key={key}><label htmlFor={`apply-${key}`}>{label}</label><input id={`apply-${key}`} inputMode="numeric" type="number" min="0" max="10000" step="1" placeholder="Leave blank if unsure" value={fields[key]} onChange={e => update(key,e.target.value)} aria-invalid={!!errors[key]} aria-describedby={`error-${key}`} /><p id={`error-${key}`} className={styles.error}>{errors[key]}</p></div>)}</div></section>
    <section className={styles.section}><h2>03 / What you're working toward</h2><div className={styles.field}><label htmlFor="apply-goals">Tell me about your business, your goals and where you need support.</label><textarea id="apply-goals" value={fields.goals} onChange={e => update("goals", e.target.value)} placeholder="What are you looking to accomplish, and what would help your team move faster?" maxLength={2500} required aria-invalid={!!errors.goals} aria-describedby="error-goals" /><p id="error-goals" className={styles.error}>{errors.goals}</p></div></section>
    <label className={styles.check}><input type="checkbox" checked={fields.marketingConsent} onChange={e => update("marketingConsent", e.target.checked)} /><span>I'd also like occasional emails from Edward about CRE underwriting and SCA. Optional. Unsubscribe anytime.</span></label>
    <button className={styles.button} disabled={busy} type="submit">{busy ? "Submitting…" : "Submit application"}</button><p role="alert" className={styles.error}>{failure}</p>
    <p className={styles.fine}>Edward reviews the business and the work you have in mind before recommending a next step. Submitting an application does not commit you to paid work. <Link href="/privacy">Privacy</Link></p>
  </form>;
}
