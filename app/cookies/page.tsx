import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = { title: "Cookie Policy | Sapp Capital Advisors", alternates: { canonical: "https://www.sapp.capital/cookies" } };
export default function Page() { return <LegalPage slug="cookies" />; }
