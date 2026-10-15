import { NextResponse } from "next/server";
export const response = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function readApplicationRequest(request: Request): Promise<Record<string, unknown> | null> {
  // Next can expose an internal localhost URL even when the browser uses 127.0.0.1.
  // The browser's Host and exact Origin must agree; never accept arbitrary origins.
  const origin = request.headers.get("origin");
  if (!origin) return null;
  try {
    const parsed = new URL(origin);
    if (!["http:", "https:"].includes(parsed.protocol) || parsed.origin !== origin || parsed.host !== (request.headers.get("host") || new URL(request.url).host)) return null;
  } catch { return null; }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const part = await reader.read(); if (part.done) break; size += part.value.length; if (size > 16384) { await reader.cancel(); return null; } chunks.push(part.value); }
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || Array.isArray(data) || typeof data !== "object" || data.website !== "" || typeof data.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(data.id)) return null;
    return data;
  } catch { return null; }
}
