# Intro-booking suppression

Prepared October 13, 2026. Disabled by default. This endpoint does not itself
change the active Mailchimp flow, create a Cal webhook, or send an email.

## Behavior

`POST /api/cal/booking` checks the exact raw-body HMAC-SHA256 signature before
parsing the version `2021-10-20` payload. Only an accepted `BOOKING_CREATED`
event for the configured `client-intro` event type qualifies. The booker's
response email must also be in the attendee list. Additional guests do not get
tagged merely because they appear in the booking.

The Mailchimp member lookup must find a subscribed contact already tagged
`acquisition-review-v1`. It sets `intro-booked-ever` active. It never creates a
member, changes subscription status or reapplies the welcome trigger. Unknown
contacts and opt-outs are ignored. Existing suppression makes repeat delivery a
read-only no-op; a repeated active-tag write is also idempotent. Provider errors
return 503 for retry, without logging a payload or email address.

The permanent tag means a cancellation does not resume sales invitations.
Rescheduling does not remove it. This is an intentional first-pass policy, not a
ledger of current appointments or a qualified-conversion counter.

## Deployment and activation gates

1. Keep `CAL_BOOKING_SUPPRESSION_LIVE=false` or unset. Run tests, lint and build;
   deploy staging and verify the hosted route returns 503 while unconfigured.
   Existing main/case routes must continue to work. Production merge remains
   subject to the normal staging/build/hosted-review workflow.
2. Review the actual Mailchimp flow before editing. Proposed shape:
   welcome -> existing two-day delay -> IF tag `intro-booked-ever` ->
   YES exit / NO existing follow-up -> exit. Preserve re-entry off, consent and
   both existing email IDs. A tag alone does not suppress the existing flow.
3. Do not edit/pause the queued QA flow before the October14 delivery check just
   to test this feature. Mailchimp says time in a pause can affect delay progress.
   Any pause/resume must be a concrete reviewed change, with queue/timing readback;
   no historical enrollment or welcome restart.
4. After specific connection/signing approval, create a **separate event-scoped**
   signed Cal webhook for the intro, subscriber
   `https://www.sapp.capital/api/cal/booking`, version `2021-10-20`, trigger
   Booking created. Existing global Cal -> Make -> Stripe webhook stays intact.
   Use a new random >=32-character signing secret, stored server-side in Vercel
   and the dedicated Cal webhook only; never put it in a URL, repository or docs.
5. Configure `CAL_INTRO_EVENT_TYPE_ID=5775130` and existing Mailchimp server
   credentials. Enable only after the flow branch and hosted checks are verified.
   Do not infer activation from a successful build.
6. Prove signed event receipt and booked/unbooked branches with approved test
   evidence. No new appointment without a specifically approved slot. Do not
   replay the existing Make scenario: it creates Stripe customers. Synthetic
   signed tests use mocked providers and do not count as live end-to-end proof.

Rollback: disable the new webhook and live flag; retain records/history. Do not
unsubscribe contacts, clear the permanent tag, restart the welcome, or change the
Stripe scenario to roll this back. Inspect any contacts already queued at the
branch before a flow rollback.

## Checks

Using Node24 in the task workspace:

```text
node --test tests/cal-booking-webhook.test.mjs
```

Checks cover tampering/missing signatures, streamed size limits, wrong scope,
pending/canceled events, guest mismatch, unknown and opted-out contacts,
duplicate suppression and retryable provider failure. They use synthetic
addresses, test-only credentials and mocked Mailchimp calls.

References: [Cal webhook payloads](https://cal.com/docs/developing/guides/automation/webhooks),
[Cal signature guidance](https://calcom.gitbook.io/docs/core-features/webhooks),
[Mailchimp flow edits](https://mailchimp.com/help/edit-customer-journey-map/).
