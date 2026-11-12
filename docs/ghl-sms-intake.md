# Public SMS opt-in for GHL A2P review

Updated November 12, 2026.

Priority: publish the native website form and legal disclosures for A2P review. Edward explicitly deferred the GoHighLevel transfer from Mailchimp. No GHL integration credential was created and no GHL contact migration or workflow activation is included.

## Public addresses

- Opt-in form: https://www.sapp.capital/apply
- Privacy Policy: https://www.sapp.capital/privacy
- Terms of Use: https://www.sapp.capital/terms
- Sender: Sapp Capital Advisors LLC
- Contact: help@sapp.capital; +1 336-568-6359
- Mailing address: 447 Broadway, 2nd Floor Suite #2133, New York, NY 10013, United States

The form presents two separate, optional, initially unchecked SMS choices: appointment/service messages and marketing messages. Visitors may choose either, both, or neither. Providing a phone number or subscribing by email grants no SMS consent. Each notice identifies SCA, message purposes, variable frequency, potential message/data charges, and HELP/STOP instructions. Marketing consent is not a condition of purchase. Privacy and terms are linked beside the choices.

## Consent records and existing intake

The server validates explicit Boolean choices and the current disclosure version. It records the normalized phone, purpose choices, server timestamp, canonical form URL, submission reference, and exact disclosure wording/version. Legacy cached forms grant no SMS consent.

Existing Mailchimp intake continues. Its application notes retain the full application and SMS evidence. If existing Formspree fallback/notifications are enabled, those also retain the evidence. These records do not enroll a person in an SMS workflow or authorize unrelated messages. Existing email opt-outs are preserved.

Before enabling future GHL SMS workflows, map the stored purpose-specific evidence, honor STOP/provider suppression, and send only the selected message types. No text or email was sent during local verification.

## Legal source and archive

Canonical Privacy Policy - Live.md and Terms of Use - Live.md are synchronized with content/legal/privacy.md and terms.md. Prior native versions are archived in old/ with filenames ending before native SMS consent - 2026.11.12.md. The original Termly baseline archives remain intact.

The policy now covers SMS consent and mobile-data nonsharing; terms cover message types, frequency/rates, STOP/HELP, support, carrier delivery limitations, and privacy. Closers.io remains absent from the public privacy policy.

## Verification and release

Production build passed. All 69 automated checks passed, including independent choice combinations, optional phone handling, invalid/stale disclosures, server-generated evidence, and live-route Mailchimp evidence storage. A local browser submission with no phone and neither option selected was retained without email, SMS, or booking. Hosting preview showed the two unchecked choices, legal links, and business contact details.

A2P approval remains GHL/carrier-controlled. Confirm campaign descriptions and samples match the actual form, and use the public addresses above rather than a preview URL. Website changes do not submit the registration or guarantee approval.
