import { notFound } from "next/navigation";
import Link from "next/link";
import { applicationMode } from "@/lib/application-experience";
import { readReviewInbox } from "@/lib/application-review-store";
import { AcquisitionShell } from "@/components/acquisition-shell";
import styles from "@/components/application-form.module.css";
export const dynamic="force-dynamic";
export const metadata={title:"Local funnel review inbox",robots:{index:false,follow:false}};
export default async function ReviewInbox(){
  if(applicationMode()!=="local-review")notFound();
  const records=await readReviewInbox();
  return <AcquisitionShell preview={false} applicationFunnel><main className={styles.inbox}><h1>Local review inbox</h1><p>Saved on this computer only. No emails sent, no file access granted and no live marketing enrollment.</p><div className={styles.links}><Link href="/apply">Application</Link><Link href="/templates">Template lander</Link><Link href="/">Main homepage</Link></div>{!records.length&&<p>No local submissions yet.</p>}{records.slice().reverse().map((row,index)=><article className={styles.record} key={String(row.id)+index}><h2>{String(row.kind)} · {String(row.receivedAt)}</h2><pre>{JSON.stringify(row,null,2)}</pre></article>)}</main></AcquisitionShell>;
}
