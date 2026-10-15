export const DEAL_SIZE_OPTIONS = ["Under $5M", "$5M to under $10M", "$10M to under $20M", "$20M to under $50M", "$50M or more", "Not sure yet"] as const;
export const isEmail = (value: string) => value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export type ApplicationFields = { name: string; email: string; company: string; dealSize: string; completedDeals: string; targetDeals: string; goals: string; marketingConsent: boolean };
export type ApplicationErrors = Partial<Record<keyof ApplicationFields, string>>;
export function validateApplication(value: ApplicationFields): ApplicationErrors {
  const errors: ApplicationErrors = {};
  if (!value.name.trim() || value.name.length > 120) errors.name = "Enter your name.";
  if (!isEmail(value.email.trim())) errors.email = "Enter a valid email address.";
  if (!value.company.trim() || value.company.length > 160) errors.company = "Enter your company name.";
  if (!(DEAL_SIZE_OPTIONS as readonly string[]).includes(value.dealSize)) errors.dealSize = "Choose a typical deal size, or not sure yet.";
  for (const field of ["completedDeals", "targetDeals"] as const) {
    if (value[field] !== "" && (!/^\d{1,5}$/.test(value[field]) || Number(value[field]) > 10000)) errors[field] = "Enter a whole number, or leave blank if unsure.";
  }
  if (value.goals.trim().length < 10 || value.goals.length > 2500) errors.goals = "Tell us a little about your business and goals (10–2,500 characters).";
  if (typeof value.marketingConsent !== "boolean") errors.marketingConsent = "Choose whether to receive updates.";
  return errors;
}
