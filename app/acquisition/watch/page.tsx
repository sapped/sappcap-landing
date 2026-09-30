import { redirect } from "next/navigation";
import { readAttribution, withAttribution } from "@/lib/acquisition-review-config";

export default async function LegacyWalkthroughPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const values = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string") params.set(key, value);
  }
  redirect(withAttribution("/acquisition/review", readAttribution(params)));
}
