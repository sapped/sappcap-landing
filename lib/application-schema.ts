export const SPONSOR_EQUITY_OPTIONS = ["Under $100,000", "$100,000 to under $250,000", "$250,000 to under $500,000", "$500,000 to under $1M", "$1M to under $2.5M", "$2.5M to under $5M", "$5M or more", "Not sure yet"] as const;
export const SPONSOR_EQUITY_LABEL = "Typical equity your firm invests per deal";
export const SPONSOR_EQUITY_HELP = "Your firm’s own equity contribution. Exclude capital from outside LPs and co-GPs.";
export const isEmail = (value: string) => value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
// sponsorEquity is a new metric; historical dealSize answers keep their original meaning.
export type ApplicationFields = { name: string; email: string; company: string; phone: string; sponsorEquity: string; completedDeals: string; targetDeals: string; goals: string; marketingConsent: boolean };
export type ApplicationErrors = Partial<Record<keyof ApplicationFields, string>>;
// Adding a field requires a label here, so receipts and notifications cannot omit it silently.
export const APPLICATION_ANSWER_LABELS = {
  name: "Name", email: "Email", company: "Company", phone: "Cell phone",
  sponsorEquity: SPONSOR_EQUITY_LABEL, completedDeals: "Deals completed in the last 12 months",
  targetDeals: "Target deals in the next 12 months", goals: "Business goal",
} satisfies Record<Exclude<keyof ApplicationFields, "marketingConsent">, string>;
export function applicationAnswerRows(fields: Partial<ApplicationFields>): [string, string][] {
  return Object.entries(APPLICATION_ANSWER_LABELS).map(([key, label]) => [label, fields[key as keyof typeof APPLICATION_ANSWER_LABELS] || "Not provided"]);
}
export function validateApplication(value: ApplicationFields): ApplicationErrors {
  const errors: ApplicationErrors = {};
  if (!value.name.trim() || value.name.length > 120) errors.name = "Enter your name.";
  if (!isEmail(value.email.trim())) errors.email = "Enter a valid email address.";
  if (value.company.length > 160) errors.company = "Keep your company name to 160 characters or fewer.";
  if (value.phone && (value.phone.length > 40 || !/^[+\d\s().-]+$/.test(value.phone) || value.phone.replace(/\D/g, "").length < 7 || value.phone.replace(/\D/g, "").length > 15)) errors.phone = "Enter a valid phone number, or leave blank.";
  if (!(SPONSOR_EQUITY_OPTIONS as readonly string[]).includes(value.sponsorEquity)) errors.sponsorEquity = "Choose your firm's typical equity contribution, or not sure yet.";
  for (const field of ["completedDeals", "targetDeals"] as const) {
    if (value[field] !== "" && (!/^\d{1,5}$/.test(value[field]) || Number(value[field]) > 10000)) errors[field] = "Enter a whole number, or leave blank if unsure.";
  }
  if (value.goals.trim().length < 10 || value.goals.length > 2500) errors.goals = "Tell us a little about your business and goals (10–2,500 characters).";
  if (typeof value.marketingConsent !== "boolean") errors.marketingConsent = "Choose whether to receive updates.";
  return errors;
}
