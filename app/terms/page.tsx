import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = { title: "Terms of Use | Sapp Capital Advisors", alternates: { canonical: "https://www.sapp.capital/terms" } };
export default function Page() { return <LegalPage slug="terms" />; }
