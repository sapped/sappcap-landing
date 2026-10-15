import { isEmail } from "./application-schema";
const KEY = "sca_application_email_handoff_v1";
const MAX_AGE = 30 * 60 * 1000;
export function storeApplicationEmail(email: string) {
  if (!isEmail(email.trim())) return;
  try { sessionStorage.setItem(KEY, JSON.stringify({ email: email.trim(), createdAt: Date.now() })); } catch { /* The application still works with a blank email. */ }
}
export function consumeApplicationEmail(): string {
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!raw) return "";
    const data = JSON.parse(raw);
    const age = Date.now() - data.createdAt;
    return typeof data.email === "string" && isEmail(data.email) && Number.isFinite(age) && age >= 0 && age <= MAX_AGE ? data.email : "";
  } catch { return ""; }
}
