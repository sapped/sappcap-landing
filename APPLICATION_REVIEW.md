# Application funnel review, 2026-10-15

Production release is intentionally disabled. Work is based on staging 5e219ffcace772c5b75411a044c913d8196ea294 and preserves the unrelated disabled booking-suppression work.

## Review routes

- `/`: Main homepage, explicitly a general lander.
- `/acquisition`, `/underwriting-support`, `/ownership-waterfall`: Existing angle pages, shared email capture and application CTA in review mode.
- `/templates`: Template-specific promise/capture. No template/service selector.
- `/apply`: One schema and page for everyone. Email is editable, blank on a direct visit, or prefilled via a single-use 30-minute same-tab handoff. Email never enters the URL.
- `/review-inbox`: Local-only inbox for applications, email captures and template outbox records. Never exposed on Vercel previews or production.

The application asks name, email, company, typical deal size, deals completed in the current year, target deals in the next12months, and business/goals/support context. Deal counts may be blank when unsure. Optional marketing consent is separate. Template requests are recorded at lander capture, not gated by application submission.

## Local review

Use Node20+ and the repository's existing dependencies. `LOCAL_REVIEW=true` and `ACQUISITION_LIVE=true` go in an uncommitted `.env.local`. On Windows run `node node_modules/next/dist/bin/next build`, then `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3015`. On macOS/Linux the normal npm scripts also work with their existing configured port.

Local submissions append to `.local-data/funnel-review.jsonl`, excluded from git. The inbox shows receipt evidence, including no email sent. This file is review storage only, not a production persistence strategy. Hosted Vercel previews only simulate submission and explicitly say nothing was saved. No Mailchimp enrollment/send, Cal booking, Clerk entitlement or asset permission changes.

## Before production

Wire and verify durable application intake/Edward notification plus an approved resource email/release path. The template request/outbox is not delivery. Do not put a preview success screen into live operation. Enforce marketing consent and preserve opt-outs. Review desktop/mobile, direct arrival, handoff, edited email, validation/failure, independent resource request and attribution. Approve the exact public resource set before any access expansion.

`applicationMode()` hard-disables replacement experiences whenever VERCEL_ENV=production, even if LOCAL_REVIEW is accidentally configured. Remove that hard release gate only in a separately reviewed production implementation. Existing live main behavior remains unchanged until then.

No public prices, five-call entitlement, new ad or guarantee is introduced. Native policy tests: `node --test tests/application-policy.test.cjs`.
