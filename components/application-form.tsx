"use client";
import { ConsentNotice } from "./consent-notice";
import { CONSENT_NOTICE_VERSION } from "@/lib/consent-notice";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type FormEvent } from "react";
import { consumeApplicationHandoff } from "@/lib/application-handoff";
import { SPONSOR_EQUITY_OPTIONS, SPONSOR_EQUITY_LABEL, SPONSOR_EQUITY_HELP, applicationAnswerRows, validateApplication, type ApplicationFields, type ApplicationErrors } from "@/lib/application-schema";
import { readAttribution, ATTRIBUTION_STORAGE_KEY } from "@/lib/acquisition-review-config";
import type { ApplicationMode } from "@/lib/application-experience";
import styles from "./application-form.module.css";
const empty: ApplicationFields = { name: "", email: "", company: "", phone: "", sponsorEquity: "", completedDeals: "", targetDeals: "", goals: "", marketingConsent: true };
export function ApplicationForm({ mode }: { mode: ApplicationMode }) {
  const [fields, setFields] = useState<ApplicationFields>(empty);
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [busy, setBusy] = useState(false); const [failure, setFailure] = useState(""); const [receipt, setReceipt] = useState<{id:string;fields:ApplicationFields} | null>(null);
  const [website, setWebsite] = useState("");
  const entry = useRef({landingPage:"/apply",emailPrefilled:false});
  const id = useRef(""); const initialized = useRef(false);
  useEffect(() => { if (initialized.current) return; initialized.current = true; id.current = crypto.randomUUID(); const handoff = consumeApplicationHandoff(); entry.current={landingPage:handoff.landingPage,emailPrefilled:!!handoff.email}; if (handoff.email) setFields(current => ({ ...current, email:handoff.email })); }, []);
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
      const result = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(25000), body: JSON.stringify({ ...fields, marketingConsent: true, consentNoticeVersion: CONSENT_NOTICE_VERSION, id: id.current, website, attribution, ...entry.current }) });
      const body = await result.json();
      if (!result.ok || !body.accepted) { if (body.errors) setErrors(body.errors); throw new Error("not saved"); }
      setReceipt({id:body.id,fields:{...fields}});
    } catch { setFailure("Your application wasn't saved. Please try again. Your answers are still here."); }
    finally { setBusy(false); }
  }
  const textField = (key: "name" | "email" | "company" | "phone", label: string, autoComplete: string) => <div className={styles.field}><label htmlFor={`apply-${key}`}>{label}</label><input id={`apply-${key}`} name={key} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} autoComplete={autoComplete} value={fields[key]} onChange={e => update(key, e.target.value)} required={key === "name" || key === "email"} disabled={busy} maxLength={key === "email" ? 254 : key === "name" ? 120 : key === "phone" ? 40 : 160} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} /><p id={`error-${key}`} className={styles.error}>{errors[key]}</p></div>;
  if (receipt) return <section className={styles.result} aria-live="polite"><p className={styles.kicker}>{mode === "live" ? "APPLICATION RECEIVED" : "REVIEW COMPLETE"}</p><h2>{mode === "live" ? "Thank you. I’ve received your application." : mode === "local-review" ? "Your application is saved locally." : "You've completed the preview."}</h2><p>{mode === "live" ? "I’ll review your business and goals, then follow up with the next step. Edward Sapp, Principal." : mode === "local-review" ? "You can inspect the captured application in the local review inbox. Nothing was emailed, booked or enrolled in marketing." : "This staging preview does not save applications or send emails. The production intake has not been activated."}</p><dl>{applicationAnswerRows(receipt.fields).map(([label,value]) => <Fragment key={label}><dt>{label}</dt><dd>{value}</dd></Fragment>)}</dl><div className={styles.links}>{mode === "local-review" && <Link href="/review-inbox">Open local review inbox</Link>}<Link href="/">Back to homepage</Link></div></section>;
  return <form className={styles.form} onSubmit={submit} noValidate>
    <div className={styles.hidden} aria-hidden="true"><label htmlFor="apply-website">Leave empty</label><input id="apply-website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></div>
    <section className={styles.section}><h2>01 / Your business</h2><div className={styles.grid}>{textField("name", "Your name", "name")}{textField("email", "Email", "email")}{textField("company", "Company (optional)", "organization")}{textField("phone", "Cell phone (optional)", "tel")}</div></section>
    <section className={styles.section}><h2>02 / Your deal pipeline</h2><div className={styles.grid}><div className={`${styles.field} ${styles.full}`}><label htmlFor="apply-sponsorEquity">{SPONSOR_EQUITY_LABEL}</label><select id="apply-sponsorEquity" value={fields.sponsorEquity} onChange={e => update("sponsorEquity", e.target.value)} required aria-invalid={!!errors.sponsorEquity} aria-describedby="equity-help error-sponsorEquity" disabled={busy}><option value="">Select a range</option>{SPONSOR_EQUITY_OPTIONS.map(size => <option key={size}>{size}</option>)}</select><p id="equity-help" className={styles.help}>{SPONSOR_EQUITY_HELP}</p><p id="error-sponsorEquity" className={styles.error}>{errors.sponsorEquity}</p></div>{([['completedDeals', "Deals completed in the last 12 months"], ['targetDeals', 'Target deals in the next 12 months']] as const).map(([key,label]) => <div className={styles.field} key={key}><label htmlFor={`apply-${key}`}>{label}</label><input id={`apply-${key}`} inputMode="numeric" type="number" disabled={busy} min="0" max="10000" step="1" placeholder="Leave blank if unsure" value={fields[key]} onChange={e => update(key,e.target.value)} aria-invalid={!!errors[key]} aria-describedby={`error-${key}`} /><p id={`error-${key}`} className={styles.error}>{errors[key]}</p></div>)}</div></section>
    <section className={styles.section}><h2>03 / What you're working toward</h2><div className={styles.field}><label htmlFor="apply-goals">What single business goal would make the biggest difference over the next 12 months?</label><textarea disabled={busy} id="apply-goals" value={fields.goals} onChange={e => update("goals", e.target.value)} placeholder="Where are you today, what's the target, and what's holding you back?" maxLength={2500} required aria-invalid={!!errors.goals} aria-describedby="error-goals" /><p id="error-goals" className={styles.error}>{errors.goals}</p></div></section>
    <button className={styles.button} disabled={busy} type="submit">{busy ? "Submitting…" : "Submit application"}</button><ConsentNotice /><p role="alert" className={styles.error}>{failure}</p>
    <p className={styles.fine}>Edward reviews the business and the work you have in mind before recommending a next step. Submitting an application does not commit you to paid work. <Link href="/privacy">Privacy</Link></p>
  </form>;
}
