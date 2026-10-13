import { handleCalBookingWebhook } from "@/lib/cal-booking-webhook";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  return handleCalBookingWebhook(request, {
    enabled: process.env.CAL_BOOKING_SUPPRESSION_LIVE === "true",
    secret: process.env.CAL_BOOKING_WEBHOOK_SECRET,
    eventTypeId: process.env.CAL_INTRO_EVENT_TYPE_ID,
    apiKey: process.env.MAILCHIMP_API_KEY,
    audience: process.env.MAILCHIMP_AUDIENCE_ID,
  });
}
