import { isEmail } from "./application-schema";
const KEY = "sca_application_email_handoff_v1";
const MAX_AGE = 30 * 60 * 1000;
export function storeApplicationEmail(email: string, landingPage = "/") {
  if (!isEmail(email.trim())) return;
  try { sessionStorage.setItem(KEY, JSON.stringify({ email: email.trim(), landingPage, createdAt: Date.now() })); } catch { /* The application still works with a blank email. */ }
}
export function consumeApplicationEmail(): string {
  return consumeApplicationHandoff().email;
}
export function consumeApplicationHandoff(): {email:string;landingPage:string} {
  const empty={email:"",landingPage:"/apply"};
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!raw) return empty;
    const data = JSON.parse(raw);
    const age = Date.now() - data.createdAt;
    return typeof data.email === "string" && isEmail(data.email) && Number.isFinite(age) && age >= 0 && age <= MAX_AGE ? {email:data.email,landingPage:typeof data.landingPage === "string" ? data.landingPage : "/"} : empty;
  } catch { return empty; }
}
