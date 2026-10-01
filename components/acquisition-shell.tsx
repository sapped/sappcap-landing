"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RotateCcw, ChevronDown } from "lucide-react";
import { ACQUISITION_EXPERIMENT, ATTRIBUTION_STORAGE_KEY, readAttribution, type Attribution } from "@/lib/acquisition-review-config";
import styles from "./acquisition.module.css";
import { Navbar } from "./navbar";

type PreviewEvent = { name: string; time: string; metadata: Record<string, string | number> };
type FunnelState = {
  preview: boolean;
  attribution: Attribution;
  email: string; setEmail: (email: string) => void;
  failSubmit: boolean; setFailSubmit: (fail: boolean) => void;
  record: (name: string, metadata?: Record<string, string | number>) => void;
};
const FunnelContext = createContext<FunnelState | null>(null);
export function useAcquisition() {
  const state = useContext(FunnelContext);
  if (!state) throw new Error("Acquisition preview provider missing");
  return state;
}

export function AcquisitionShell({ children, preview = true, navigation = false }: { children: ReactNode; preview?: boolean; navigation?: boolean }) {
  const [email, setEmail] = useState("");
  const [failSubmit, setFailSubmit] = useState(false);
  const [events, setEvents] = useState<PreviewEvent[]>([]);
  const [attribution, setAttribution] = useState<Attribution>({});
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const incoming = readAttribution(new URLSearchParams(window.location.search));
    let saved: Attribution = {};
    try { saved = readAttribution(new URLSearchParams(JSON.parse(sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || "{}"))); } catch { /* Storage can be unavailable. URL forwarding still works. */ }
    // A tagged arrival replaces the previous visit's campaign as a whole, without mixing campaigns.
    const next = Object.keys(incoming).length ? incoming : saved;
    setAttribution(next);
    try { sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(next)); } catch { /* Optional persistence. */ }
  }, [pathname]);
  function record(name: string, metadata: Record<string, string | number> = {}) {
    setEvents((current) => [...current.slice(-19), { name, metadata, time: new Date().toLocaleTimeString() }]);
  }
  function reset() {
    setEmail(""); setEvents([]); setFailSubmit(false); setAttribution({});
    try { sessionStorage.removeItem(ATTRIBUTION_STORAGE_KEY); } catch { /* Optional persistence. */ }
    router.push(pathname.startsWith("/acquisition") ? "/acquisition" : "/"); router.refresh();
  }
  return (
    <FunnelContext.Provider value={{ preview, attribution, email, setEmail, failSubmit, setFailSubmit, record }}>
      <div className={styles.shell}>
        {preview && <div className={styles.previewBar}><span><span className={styles.previewDot} /> LOCAL PREVIEW <span className={styles.previewDetail}> · Email signup is simulated</span></span><button type="button" onClick={reset}><RotateCcw size={12} /> Start over</button></div>}
        {navigation ? <Navbar funnel /> : <header className={styles.header}>
          <Link href="/" className={styles.brand} aria-label="Sapp Capital Advisors home"><Image src="/images/SCA Logo - Black BG Square no Text.png" alt="" width={42} height={42} /><span>Sapp Capital<span className={styles.brandSecond}> Advisors</span></span></Link>

        </header>}
        {children}
        <footer className={styles.footer}><span>© {new Date().getFullYear()} Sapp Capital Advisors</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></footer>
        {preview && <details className={styles.inspector}>
          <summary>Preview controls & activity <ChevronDown size={14} /></summary>
          <div className={styles.inspectorBody}>
            <label><input type="checkbox" checked={failSubmit} onChange={(event) => setFailSubmit(event.target.checked)} /> Simulate an email-submission error</label>
            <p>Experiment: {ACQUISITION_EXPERIMENT}. Events below stay in memory and are never sent to analytics.</p>
            <p>Allowed campaign values retained: {Object.keys(attribution).join(", ") || "none on this visit"}.</p>
            <ol>{events.length ? events.map((event, index) => <li key={index}><time>{event.time}</time> <code>{event.name}</code>{Object.keys(event.metadata).length > 0 && <span> {JSON.stringify(event.metadata)}</span>}</li>) : <li>No simulated actions yet.</li>}</ol>
          </div>
        </details>}
      </div>
    </FunnelContext.Provider>
  );
}
