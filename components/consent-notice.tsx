import Link from "next/link";
import { CONSENT_NOTICE_TEXT } from "@/lib/consent-notice";
import styles from "./application-form.module.css";
export function ConsentNotice() {
  return <p className={styles.fine} data-consent-notice>{CONSENT_NOTICE_TEXT} <Link href="/privacy">Privacy</Link></p>;
}
