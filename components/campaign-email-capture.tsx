"use client";
import { ConsentNotice } from "./consent-notice";
import { CONSENT_NOTICE_VERSION } from "@/lib/consent-notice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";
import { storeApplicationEmail, storeApplicationEntry } from "@/lib/application-handoff";
import { isEmail } from "@/lib/application-schema";
import { normalizeLandingPath } from "@/lib/application-source";
import { withAttribution } from "@/lib/acquisition-review-config";
import { useAcquisition } from "./acquisition-shell";
import styles from "./acquisition.module.css";
import formStyles from "./application-form.module.css";
export function CampaignEmailCapture({ campaign = "home", id = "email-signup" }: { campaign?: "home" | "acquisition" | "capacity" | "ownership" | "templates" | "website-starter"; id?: string }) {
  const fieldId = useId();
  const capture = useRef({email:"",id:""});
  const { email, setEmail, attribution } = useAcquisition(); const router = useRouter();
  const [pending,setPending] = useState(false); const [error,setError] = useState(""); const [website,setWebsite] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if(pending) return;
    if(!isEmail(email.trim())) { setError("Enter a valid email address."); return; }
    setPending(true);setError("");
    try {
      // The shared capture carries every lander's actual path, including future routes.
      const landingPage = normalizeLandingPath(window.location.pathname);
      if(capture.current.email!==email.trim().toLowerCase())capture.current={email:email.trim().toLowerCase(),id:crypto.randomUUID()};
      const result=await fetch("/api/funnel/capture",{method:"POST",headers:{"Content-Type":"application/json"},signal:AbortSignal.timeout(25000),body:JSON.stringify({id:capture.current.id,email:email.trim(),campaign,marketingConsent:true,consentNoticeVersion:CONSENT_NOTICE_VERSION,website,attribution,landingPage,emailPrefilled:false})});
      const body=await result.json();if(!result.ok||!body.accepted)throw new Error("capture failed");
      storeApplicationEmail(email,landingPage); router.push(withAttribution("/apply",attribution));
    } catch {setError("We couldn't save your email. Please try again.");setPending(false);}
  }
  return <form className={styles.emailForm} id={id} onSubmit={submit} noValidate><div className={styles.botField} aria-hidden="true"><label htmlFor={fieldId + "-website"}>Leave empty</label><input id={fieldId + "-website"} tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} /></div><label htmlFor={fieldId + "-email"}>Email</label><div className={styles.emailRow}><input id={fieldId + "-email"} type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" maxLength={254} required aria-invalid={!!error} aria-describedby={campaign === "home" ? fieldId + "-error" : fieldId + "-error " + fieldId + "-disclosure"} /><button disabled={pending} type="submit">{pending ? "Continuing…" : campaign === "website-starter" ? "Email me the website starter" : campaign === "templates" ? "Get template access" : "Continue to application"}</button></div><ConsentNotice /><p id={fieldId + "-error"} role="alert" className={styles.error}>{error}</p>{campaign !== "home" && <p id={fieldId + "-disclosure"} className={formStyles.captureNote}>{campaign === "website-starter" ? "We’ll email the starter files, then continue to the same application if you’d like help with your commercial real estate business. Completing it is optional. You’ll also receive Edward’s investment-work emails." : campaign === "templates" ? "Request template access, then tell us about your business on the next page. Access won't depend on completing the application. Preview: email delivery is not enabled." : "Tell us about your business and the work you have in mind on the next page. Your email will be filled in for you."}</p>}{campaign !== "home" && <p className={formStyles.captureNote}><Link onClick={() => storeApplicationEntry(window.location.pathname)} href={withAttribution("/apply",attribution)}>{campaign === "templates" ? "Looking for support? Apply directly" : "Go straight to the application"}</Link> · <Link href="/privacy">Privacy</Link></p>}</form>;
}
