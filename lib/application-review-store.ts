import { appendFile, mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { applicationMode } from "./application-experience";

// Review-only local journal, never a Vercel persistence strategy or public file.
const filename = () => path.join(process.cwd(), ".local-data", "funnel-review.jsonl");
export async function readReviewInbox(): Promise<Record<string, unknown>[]> {
  if (applicationMode() !== "local-review") return [];
  try { return (await readFile(filename(), "utf8")).trim().split("\n").filter(Boolean).map(line => JSON.parse(line)); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; }
}
let writes = Promise.resolve();
export async function saveReviewRecord(record: Record<string, unknown>) {
  if (applicationMode() !== "local-review") throw new Error("Local persistence unavailable");
  const write = writes.then(async () => {
    const existing = await readReviewInbox();
    if (existing.some(row => row.id === record.id && row.kind === record.kind)) return;
    try { if ((await stat(filename())).size > 10_000_000) throw new Error("Review inbox full"); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
    await mkdir(path.dirname(filename()), { recursive: true, mode: 0o700 });
    await appendFile(filename(), JSON.stringify({ ...record, receivedAt: new Date().toISOString(), emailSent: false }) + "\n", { encoding: "utf8", mode: 0o600 });
  });
  writes = write.catch(() => undefined);
  await write;
}
