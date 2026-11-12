import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = { title: "Privacy Policy | Sapp Capital Advisors", alternates: { canonical: "https://www.sapp.capital/privacy" } };
export default function Page() { return <LegalPage slug="privacy" />; }
