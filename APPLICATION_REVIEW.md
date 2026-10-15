# Shared application funnel implementation

Updated October 15, 2026. The homepage and shared application are live. Earlier review-only implementation notes are retained in `old/`; they are not current release instructions.

## Routes and operating modes

- `/`: Main homepage. Hero and footer reuse `CampaignEmailCapture`; nav jumps to footer capture.
- `/acquisition`, `/underwriting-support`, `/ownership-waterfall`: Idle legacy landers. Their shared `WalkthroughSignup` uses `CampaignEmailCapture` when the application funnel is active. Ads remain paused.
- `/apply`: One application and schema for everyone. Email stays editable; direct visits start blank. The form requires name, email and a sponsor-equity range (including Not sure yet). Company, phone and deal counts are optional.
- `/templates`: Review-only template request concept, unavailable in production until fulfillment/access is implemented. Production homepage library links lead to the existing underwriting portal. This release grants no template access.
- `/review-inbox`: Local-only journal viewer. Never expose it on hosted previews or production.

`applicationMode()` permits production intake only with `APPLICATION_FUNNEL_LIVE=true`. Hosted previews simulate; local `LOCAL_REVIEW=true` writes `.local-data/funnel-review.jsonl` and sends nothing. Keep preview/local provider writes disabled.

## Canonical fields and complete receipts

`lib/application-schema.ts` owns validation, the sponsor-equity ranges and the answer labels used by BOTH the confirmation screen and Formspree message. The label map is type checked against every application answer field. New fields must be represented there, not independently added to one receipt.

`sponsorEquity` means the firm's own equity investment per deal, excluding outside LP/co-GP capital. It is distinct from the historical `dealSize` metric; never relabel old total-deal-size records as sponsor equity. Cell phone is optional for application follow-up; this does not subscribe anyone to SMS. Confirmation renders the exact submitted snapshot, including zero counts, blank-option labels and multiline goals.

## Automatic source handoff for new landers

Reuse `CampaignEmailCapture` for landing-page capture. It reads the actual pathname automatically, saves source context with the email, and continues to `/apply` without email in the URL. Its direct application link preserves source even when no email is supplied. Do not add campaign-specific application pages or remember source paths in a hand-maintained allowlist.

`lib/application-handoff.ts` uses a single-use, same-tab, 30-minute handoff. Absent/expired context gives a blank email and direct-application source. `lib/application-source.ts` normalizes safe relative paths, supplies known names such as Homepage and Acquisition lander, and derives a readable fallback for future route names. Queries, external URLs and email-bearing paths are not stored as landing paths. Source/UTMs are visitor supplied evidence, not trusted identity or permissions.

Notification source labels say Entry page and Email collected on with named paths, rather than an unhelpful yes/no or Campaign: application. The submission reference is a website/browser UUID used for correlation and retries, not a Mailchimp ID.

## Production delivery

`/api/funnel/capture` handles email capture; `/api/applications` validates and accepts completed applications. Both use `lib/application-delivery.ts`. Mailchimp stores the contact and full answers/consent/source snapshot in member notes. It preserves opt-outs and applies separate application-funnel tags, without restarting the legacy acquisition welcome flow. Application answers are notes, not audience merge-field columns.

Formspree reuses the existing contact form: email plus ONE readable message containing all answers, source, allowed attribution and consent wording/version. Its configured notification recipient remains help@sapp.capital. Edward approved CAPTCHA off on that shared form; Formshield remains on. No paid upgrade or native Mailchimp plugin is required. The shared free account quota was 50 submissions/month when inspected; a signup and completed application use separate submissions.

Either provider can retain a request if the other is unavailable. Both failing returns an error for visitor retry. This is not an automatic durable retry queue; an accepted notification is not proof of inbox delivery. Server logs omit emails, application answers and provider response bodies. No server credentials belong in public variables or commits.

## Verification and release

Run `node --test tests/application-policy.test.cjs` and the Next build (includes lint/types). Use local or simulated hosted submissions for field/source/receipt checks, including company/phone omitted, zero counts, multiline goals, homepage/acquisition/direct arrival and a future route. Local QA fixtures are excluded from leads. No extra real signup/send/appointment is implied by a copy or schema change.

Work on staging, verify its hosted build, then merge the reviewed commit to main when authorized; retain staging. Keep `APPLICATION_FUNNEL_LIVE` and `FORMSPREE_NOTIFICATIONS_ENABLED` scoped to production. Mailchimp credentials are server-only existing Vercel settings. No ads, automatic template entitlements, public pricing, new nurture sequence or booking-suppression activation is part of this release.
