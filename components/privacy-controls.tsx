"use client";

import { useEffect, useRef, useState } from "react";
import { clearOptionalCookies, privacyChoices, privacySignalEnabled, savedPrivacyChoices, savePrivacyChoices } from "@/lib/privacy-consent";
import styles from "./privacy-controls.module.css";

export function PrivacyControls({ policyBase = "" }: { policyBase?: string }) {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const [signal, setSignal] = useState(false);
  const [error, setError] = useState("");
  const panel = useRef<HTMLElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const choice = privacyChoices();
    const restricted = privacySignalEnabled();
    setAnalytics(choice.analytics); setAdvertising(choice.advertising); setSignal(restricted);
    if (restricted) clearOptionalCookies();
    setOpen(!savedPrivacyChoices() && !restricted);
  }, []);
  function show() {
    const choice = privacyChoices();
    setAnalytics(choice.analytics); setAdvertising(choice.advertising);
    setSignal(privacySignalEnabled()); setError(""); setOpen(true);
  }
  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open]);
  function save(a: boolean, m: boolean) {
    if (!savePrivacyChoices(a, m)) {
      setError("Your browser could not save this choice. Optional tracking stays off. Check your browser storage settings, or close this panel to continue.");
      return;
    }
    window.location.reload();
  }
  function close() { setOpen(false); opener.current?.focus(); }
  return <>
    <nav className={styles.links} aria-label="Legal and privacy">
      <a href={policyBase + "/privacy"}>Privacy</a><a href={policyBase + "/terms"}>Terms</a><a href={policyBase + "/cookies"}>Cookies</a>
      <button ref={opener} type="button" onClick={show} aria-expanded={open} aria-controls="sca-cookie-settings">Cookie Settings</button>
    </nav>
    {open && <section ref={panel} tabIndex={-1} id="sca-cookie-settings" className={styles.panel} aria-labelledby="sca-cookie-heading" onKeyDown={event => { if (event.key === "Escape") close(); }}>
      <div className={styles.top}><h2 id="sca-cookie-heading">Your privacy choices</h2><button type="button" onClick={close} aria-label="Close cookie settings">×</button></div>
      <p>Necessary storage keeps the site working. Optional analytics measures site use; advertising tools support campaign measurement and remarketing. Optional tracking stays off until you allow it. <a href={policyBase + "/cookies"}>Read our Cookie Policy</a>.</p>
      {signal && <p className={styles.signal}>Your browser privacy signal is on. Optional analytics and advertising are disabled.</p>}
      <div className={styles.options}>
        <label><input type="checkbox" checked disabled /> Necessary (always on)</label>
        <label><input type="checkbox" checked={analytics} disabled={signal} onChange={event => setAnalytics(event.target.checked)} /> Analytics</label>
        <label><input type="checkbox" checked={advertising} disabled={signal} onChange={event => setAdvertising(event.target.checked)} /> Advertising</label>
      </div>
      <div className={styles.actions}><button type="button" onClick={() => save(false,false)}>Reject optional</button><button type="button" onClick={() => save(analytics,advertising)}>Save choices</button><button type="button" disabled={signal} onClick={() => save(true,true)}>Accept all</button></div>
      {error && <p role="alert">{error}</p>}
    </section>}
  </>;
}
