# Native application SMS consent and GHL intake

Status: code prepared November 12, 2026. GHL production activation requires a private integration and the dedicated contact fields below. The default remains Mailchimp until activation is explicitly configured and verified.

## Public form and notices

- Opt-in form: https://www.sapp.capital/apply
- Privacy: https://www.sapp.capital/privacy
- Terms: https://www.sapp.capital/terms
- Sender: Sapp Capital Advisors LLC
- Contact: help@sapp.capital; +1 336-568-6359
- Mailing address: 447 Broadway, 2nd Floor Suite #2133, New York, NY 10013, United States

The form has separate service and marketing SMS checkboxes, both optional and initially unchecked. Providing a phone number alone grants neither permission. Email subscription notice remains separate. Disclosure text/version is in lib/sms-consent.ts.

The server records each choice, normalized phone, server timestamp, canonical form URL, submission ID, disclosure wording and version. Legacy cached forms grant no SMS consent. A receipt means the intake has been retained; it does not mean messaging is enabled.

## GHL connection

Location: UvUCM4UI3ZetyqQK5Pia.

Create a private integration named SCA website intake, restricted to contacts.readonly and contacts.write. These scopes allow access to contacts and notes within the location; GHL does not offer a credential restricted to website-origin contacts. Do not grant conversation, campaign, payment, calendar, or account-management scopes. Creating the credential requires action-time confirmation.

Create four dedicated contact fields in GHL:
- SCA website service SMS requested — TEXT, values yes/no
- SCA website marketing SMS requested — TEXT, values yes/no
- SCA website SMS consent evidence — LARGE_TEXT, JSON
- SCA website email notice version — TEXT

Store the API token as a sensitive, server-only Vercel environment variable GHL_PRIVATE_INTEGRATION_TOKEN. Never put it in a NEXT_PUBLIC variable, source file, screenshot, or documentation. Set GHL_LOCATION_ID and the four field IDs via GHL_SMS_SERVICE_FIELD_ID, GHL_SMS_MARKETING_FIELD_ID, GHL_SMS_EVIDENCE_FIELD_ID, and GHL_EMAIL_NOTICE_FIELD_ID. Enable APPLICATION_INTAKE_PROVIDER=ghl only after verification. APPLICATION_FUNNEL_LIVE must also remain true in production.

For an isolated connection test, use a branch-specific preview with a controlled test mode or a mock provider; ordinary hosted previews do not save data. Do not send actual test email/SMS or enroll arbitrary people.

## Storage and suppression behavior

The GHL adapter first looks up email and phone independently. It refuses conflicting or ambiguous contacts rather than merging people. It stores the entire application and consent evidence in a contact note, plus dedicated preference fields. Notes are escaped before HTML rendering. A stable marker avoids duplicate notes on a sequential retry and preserves the first recorded consent time. The provider API has no transactional idempotency guarantee; simultaneous duplicate requests can still race.

Existing DND settings, email opt-outs, tags, and primary emails are never overwritten. New contacts start with SMS DND active. This release adds no message sends, tags, or workflow enrollments. Email-only intake does not modify SMS fields. Provider failure does not claim success or silently fall back to Mailchimp when GHL is selected.

SMS preference fields describe the submitted form; they do not override an unsubscribe. Before enabling any SMS workflow, require the matching purpose field yes, a valid matching evidence record/phone, and no provider/carrier or global DND. Handle STOP and HELP through GHL and verify category-specific workflow gates. Do not automatically clear DND based on a new form submission. Activate messaging only after A2P approval and deliberate suppression review.

This change routes new website intake when enabled. It does not migrate historical Mailchimp contacts, rebuild email sequences, or replace the existing Cal.com-to-Mailchimp booking-suppression workflow. Complete those separately before retiring Mailchimp.

## Verification

Production build and 74 automated checks passed. Eleven new checks cover four choice combinations, optional phone handling, forged/stale disclosures, server-generated evidence, GHL storage, preserved DND, new-contact SMS blocking, sequential retry evidence, identity collisions, provider failure, and email-only intake. Browser local-review submission with neither SMS option and no phone was saved successfully without any email, SMS, or booking.

Official references:
- https://help.gohighlevel.com/support/solutions/articles/155000007237
- https://marketplace.gohighlevel.com/docs/ghl/contacts/lookup-contact/
- https://marketplace.gohighlevel.com/docs/ghl/contacts/create-contact/
- https://marketplace.gohighlevel.com/docs/ghl/contacts/create-note/
