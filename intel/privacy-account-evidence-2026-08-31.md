# Transition OPS Privacy Account Evidence

- Date: 31 AUG 2026
- Status: READ-ONLY EVIDENCE RECORD - NO SETTINGS CHANGED
- Authority: `APPROVE TRANSITION OPS PRIVACY ACCOUNT EVIDENCE COLLECTION`
- Account owner and attestor: Dean Nemecek
- Executor: Codex Orchestrator
- Artifact: `intel/privacy-account-evidence-2026-08-31.md`
- Parent design: `TRANSITION_OPS_PRIVACY_TRUTH_REMEDIATION_DESIGN.md`

Inspected scope: OpenAI organization and clone project; Netlify team,
production site, and clone site; GA4 production property; OneSignal app
configuration; Kit account, form, and automation configuration; and the
CareerOneStop signed-in data-request surface.

Drift trigger: revalidate affected findings before claim release and whenever a
provider setting or term, administrator, key, SDK, endpoint, deployment, data
field, user control, retention rule, or integration changes.

## Open questions

1. OneSignal did not expose an explicit account-level user-privacy-consent
   requirement, account-level tag schema, or retention, export, and deletion
   controls on the inspected surfaces. Runtime consent and decline behavior and
   provider retention remain unverified.
2. Kit did not expose a reliable administrator count, account-wide tag
   inventory, connected-app inventory, or retention, export, and deletion
   controls on the inspected surfaces. Two builder-preview text inputs had null
   field bindings; live-form behavior was not tested.
3. The signed-in CareerOneStop data-request page exposed new-request and renewal
   options but no existing request history, approval status, license identifier,
   or API token. Provider approval ownership, logging, retention, and deletion
   remain unverified.
4. OpenAI showed no custom project retention value and showed API logging
   controlled per call. Whether the organization has any separately approved
   Zero Data Retention or Modified Abuse Monitoring treatment is not proven by
   the inspected screens.
5. Netlify function-log retention, platform-support access, and deletion
   mechanics remain unverified. Function logs were not opened because this pass
   excluded member content.
6. GA4 property-level access was not separately enumerated, and runtime consent
   behavior was not tested in this account-only pass.

## Scope and safeguards

This pass inspected account and project configuration only. It did not change a
provider setting, create or revoke a key, alter access, open a form submission,
inspect an individual analytics record, inspect a push subscriber, inspect a Kit
subscriber, run a live member request, deploy, stage, commit, push, or merge.

The record excludes personal names, email addresses, organization and project
IDs, site IDs, API-key identifiers, secret values, form submissions, subscriber
records, prompt or resume content, analytics event values, and exact member
locations. Counts and configuration states are retained only where needed to
evaluate a privacy or security claim.

Evidence classes follow `privacy-truth-to-implementation` v0.1:

- `ACCOUNT-VERIFIED`: observed in the authenticated provider account.
- `PROVIDER-DOCUMENTED`: supported by current provider documentation, not by an
  account-specific control.
- `CODE-OBSERVED`: observed in the repository.
- `UNVERIFIED`: not established by accessible evidence.

## Executive verdict

The universal claims that Transition OPS "collects no user data," "stores
nothing," or that all planning data "stays on your device" are not supportable.
The account evidence confirms provider-side configuration and
storage/retention boundaries in OpenAI, Netlify, and Google Analytics.
Selected OneSignal and Kit controls are now account-verified. CareerOneStop
account access is verified, but no current API grant was displayed. Provider
retention and deletion boundaries, OneSignal runtime consent behavior, Kit
account-wide integration state, and CareerOneStop API approval remain
unverified and therefore cannot be represented as absent.

### Claim dispositions

| Exact claim | Verdict | Disposition | Account-evidence basis |
|---|---|---|---|
| `Transition OPS collects no user data.` | `CONTRADICTED` | `REMOVE` | GA4 retention and collection settings are active; repository flows also reach AI, push, email, and job providers. |
| `All planning data stays on your device; we never see it.` | `CONTRADICTED` | `REPLACE` | Some core state is local, but transition context and optional feature inputs cross browser, host, and provider boundaries. |
| `OpenAI stores nothing.` | `UNVERIFIED` | `HOLD FOR EVIDENCE` | Per-call logging and no custom project retention value were observed; `store=false` is not ZDR, and approved ZDR scope was not established. |
| `The employer can never see what a member does.` | `PARTIALLY SUPPORTED` | `NARROW` | The proposed VBS package has no member dashboard, but managed devices, networks, client tracking, and destination providers remain separate boundaries. |
| `The inspected OpenAI organization has API input/output sharing disabled.` | `SUPPORTED` | `KEEP` | The account showed API input/output sharing disabled on 31 AUG 2026; revalidate on any setting or project change. |

## Provider evidence

### OpenAI API organization and clone project

Evidence class: `ACCOUNT-VERIFIED`, with provider interpretation bounded by
`PROVIDER-DOCUMENTED` material.

Observed configuration:

- One human organization owner and one service account were visible.
- The Transition OPS clone project uses global residency and has user-based API
  keys disabled at the project level.
- One active project API key was visible. It had no expiration configured. No
  key value was opened or recorded.
- Sharing of Playground feedback, evaluation/fine-tuning data, and API inputs
  and outputs with OpenAI was disabled.
- API call logging was set to `Enabled per call`. The account UI stated that
  Responses API calls are logged by default unless the request uses
  `store=false`.
- The Logs page was visible only to organization owners. The usage dashboard was
  visible to everyone in the organization.
- Audit logging was not enabled in the inspected UI; an `Enable audit logging`
  action was presented.
- The project inventory displayed `Data retention: None`. This is recorded only
  as the absence of a custom project retention value, not as proof of zero
  provider retention.
- A $5 monthly project spend limit and a 100 percent alert were configured. The
  UI warned that actual costs can exceed the displayed limit based on usage
  timing.
- Only the two approved clone models were listed as allowed.
- No uploaded files or vector stores were displayed.

Interpretation:

- Training/data-sharing opt-ins are off: `SUPPORTED` for the narrow statement
  that the organization has not opted in to those three sharing programs.
- Zero retention: `UNVERIFIED`. `store=false` and per-call logging do not prove
  Zero Data Retention.
- "OpenAI stores nothing": `UNVERIFIED` as an unqualified claim and `HOLD FOR
  EVIDENCE` until account-approved retention treatment and endpoint coverage are
  established.
- Budget controls: `SUPPORTED`, with the provider warning that the project limit
  is not guaranteed to stop every overage in real time.

Current official references:

- [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data)
- [Retrieve organization data retention](https://developers.openai.com/api/reference/python/resources/admin/subresources/organization/subresources/data_retention/methods/retrieve)

### Netlify team, production site, and clone site

Evidence class: `ACCOUNT-VERIFIED`.

Observed configuration:

- The team is on a paid plan, has one owner, and does not have account MFA
  enabled.
- The production site and OpenAI clone are separate Netlify projects.
- Production is deployed from `main`; the clone is deployed from
  `ops/openai-parallel-clone`.
- Both projects reported Forms disabled and returned zero configured forms. No
  form submissions were requested or viewed.
- Production has separate Anthropic and CareerOneStop environment variables.
  The clone has only the OpenAI provider key among the inspected AI/provider
  variables.
- The clone OpenAI key is marked secret and is scoped to functions/runtime.
- The production CareerOneStop token is present but is not marked secret and is
  scoped broadly across all contexts and build/function/runtime surfaces. Its
  value was not opened or recorded.
- Production and clone deploys were ready and pointed at different branches and
  provider configurations.

Interpretation:

- Parallel-site isolation: `SUPPORTED` for branch, site, and provider-key
  separation.
- "Netlify Forms stores member submissions": `CONTRADICTED` for the two
  inspected projects because Forms is disabled and no forms are configured.
- "Netlify stores no member data": `UNVERIFIED`; function execution and logging
  boundaries were not inspected.
- Account security hardening: `PARTIALLY SUPPORTED`; secret marking exists for
  AI keys, but MFA is off and the CareerOneStop token is not marked secret and
  is over-scoped.

### Google Analytics 4

Evidence class: `ACCOUNT-VERIFIED`.

Observed configuration:

- One named human administrator was displayed at account level. Additional
  lower-level Google Ads role entries were present; property-level access was
  not separately enumerated.
- Event-data retention was 2 months.
- User-data retention was 14 months, with reset on new user activity enabled.
- Google signals was off.
- User-provided data collection was off.
- Granular location and device data collection was on.
- Ads personalization was allowed in all regions shown by the property.
- Analytics-cookie, ads-cookie, ads-measurement, and ads-personalization consent
  signals were inactive for the production stream.
- One internal-traffic exclusion filter existed in `Testing`, not `Active`.
- No Google Ads property link and no BigQuery link were configured.

Interpretation:

- "We collect no analytics data": `CONTRADICTED`.
- "GA4 receives no location/device data": `CONTRADICTED`.
- "Consent mode governs GA4 collection": `CONTRADICTED` for the current
  production stream because the account reports consent signals inactive.
- Google signals and user-provided data collection being off: `SUPPORTED` as
  narrow account-setting statements.
- No advertising use: `UNVERIFIED`; ads personalization is allowed even though
  no Google Ads property link is configured.

### OneSignal

Evidence class: `ACCOUNT-VERIFIED` for the inspected app controls,
`CODE-OBSERVED` for the repository boundary, and `UNVERIFIED` for provider
retention and unexposed controls.

Observed configuration:

- Web push was configured as a typical site. The settings overview displayed
  `Push & In-App` as active and presented setup actions for Email and SMS/RCS.
- Auto resubscribe was enabled.
- One push slide prompt was configured for all pages after 1 pageview and 10
  seconds.
- The welcome notification was enabled; opening a link from that notification
  was disabled.
- Custom service-worker paths and filenames and advanced persistence were
  enabled. Advanced webhooks and the advanced Safari certificate option were
  disabled.
- No explicit user-privacy-consent-required control was displayed on the
  inspected account pages.
- The Team Members page contained one roster table row and displayed an Admin
  role label, with no pending-invite indicator. Names and account identifiers
  were not recorded.
- The Keys & IDs page contained one key row with a `Disable` action and a
  separate App ID copy control. No identifier or key value was opened or
  recorded.
- The Integrations `Connections` view displayed its empty-state message and an
  `Add Integration` action; no configured connection was displayed.
- Attribution windows were 60 minutes after a web-push click, 15 minutes after
  an in-app click, 3 days after an email open or click, and 24 hours after an
  SMS click. These settings do not prove that an otherwise unconfigured channel
  is active.
- The Manage App page exposed `Disable App`. No account-specific retention,
  export, or deletion control was displayed on the inspected surfaces.
- No subscriber, user, message, audit-log, or delivery record was opened. The
  account-level tag schema and current tag values therefore remain unverified.

Repository boundary:

- The app initializes the OneSignal SDK without declaring
  `requiresUserPrivacyConsent`.
- About 1.5 seconds after app load, repository code attempts to write
  `last_active`; when a separation date exists it also attempts to write
  `ets_date`, `ets_epoch_day`, `days_out`, `months_out`, and `status` tags.
- The account-configured permission prompt occurs after those repository tag
  writes are scheduled. A controlled runtime test is still required to prove
  exactly what is transmitted before permission or after a decline.

Interpretation:

- "OneSignal receives no transition data": `CONTRADICTED` at the code boundary.
- A real pre-collection consent gate: `UNVERIFIED`; the inspected account and
  code do not establish one.
- No configured OneSignal integration connection: `SUPPORTED` as a narrow
  account-state statement on 31 AUG 2026.
- Provider retention, export, deletion, and subscriber-tag state: `UNVERIFIED`.

### Kit

Evidence class: `ACCOUNT-VERIFIED` for the inspected account, form, and
automation controls, `CODE-OBSERVED` for the repository boundary, and
`UNVERIFIED` for unexposed account controls.

Observed configuration:

- The inspected form had `Send confirmation email` enabled and `Auto-confirm
  new subscribers` disabled.
- After subscription, the form was configured to show a success message rather
  than redirect to an external page.
- Return visitors were configured to continue seeing the form.
- Sending subscriber data to a thank-you page was disabled, and invisible
  reCAPTCHA was disabled.
- The builder preview displayed one email-address input and two text inputs
  whose generated names were `fields[null]`. This is a configuration anomaly,
  not proof that either null-bound field reaches Kit; live submission was not
  tested.
- Subscriber ID URL parameters, automatic UTM parameters, and the SHA-256
  hashed-email link parameter were all disabled in Advanced Tracking.
- Bot-click and bot-open filtering were disabled.
- The Developer page exposed V4 and V3 API-key surfaces, one populated key
  field, and reveal/copy controls. No credential value was opened or recorded.
- The Team page exposed Owner and Member role terms, but no reliable
  administrator count was established without recording identities.
- One visual automation was listed and active, as shown by its available
  `Pause` action. Its configuration contained subscriber and sequence step
  types. No subscriber record or subscriber count was opened.
- The Apps page exposed the app catalog but did not provide a reliable
  account-specific connected-app inventory. Connected integrations remain
  `UNVERIFIED`.
- No account-specific retention, export, or deletion control was displayed on
  the inspected surfaces. Account-wide tags were not opened because that path
  shares the subscriber area.
- No subscriber, broadcast, report, or individual automation-run record was
  opened.

Repository boundary:

- The browser code posts directly to the Kit/ConvertKit v3 form API using a
  client-embedded form API key. The value is excluded from this record.
- The submitted payload contains email address plus `branch` and
  `military_status`; missing branch or status selections are replaced with
  `Not specified`.
- Optional entry is still provider collection when a member uses the form.

Interpretation:

- Confirmation email on plus auto-confirm off: `SUPPORTED` as the narrow
  account configuration observed on 31 AUG 2026. Delivery and confirmation
  behavior were not runtime-tested.
- "Kit receives only an email address": `CONTRADICTED` by repository code.
- "No external post-subscribe redirect or thank-you-page subscriber-data
  transfer is configured": `SUPPORTED` for the inspected form.
- Account-wide tags, connected integrations, administrator count, retention,
  export, and deletion behavior: `UNVERIFIED`.

### CareerOneStop

Evidence class: `ACCOUNT-VERIFIED` for the Netlify boundary and signed-in
CareerOneStop request surface, `PROVIDER-DOCUMENTED` for the public API surface,
and `UNVERIFIED` for the CareerOneStop backend and current API grant.

Observed configuration:

- Production Netlify contains both a CareerOneStop user identifier and API
  token. Values were not opened or recorded.
- The token is not marked secret and is broadly scoped in Netlify.
- The CareerOneStop site displayed an authenticated profile and logout action.
  No profile value was recorded.
- The signed-in Data Requests page offered `New Request` and `Renewal` and
  presented fields for the current user identifier, organization, website,
  email address, intended data use, and license acceptance.
- The page displayed no existing request-history row, approval status, license
  identifier, or API token. Hidden API-key and license fields had no surfaced
  value. The request form was not populated or submitted.
- The repository function sends bounded keyword and location values to the
  CareerOneStop job-search API when invoked.
- The function places the provider user identifier, keyword, and location in
  the API URL path and sends the token in an Authorization header. On a failed
  provider response, it logs the response status and up to 200 characters of
  the provider response body.

Interpretation:

- Netlify credential presence and the possible provider route: `SUPPORTED`.
- Current CareerOneStop grant ownership and approval status: `UNVERIFIED`; the
  authenticated account page did not reconcile the Netlify token with an
  approved, pending, renewed, or expired request.
- Current provider-side logging, retention, access, and deletion behavior:
  `UNVERIFIED`.
- "Job-search input never leaves Transition OPS": `CONTRADICTED` if the server
  route is enabled and invoked.

## Commander-lane remediation candidates

No item below was executed. Each changes product behavior, provider settings,
security posture, spend controls, or public claims and therefore requires a
separate Commander approval.

1. Implement a real pre-collection consent gate for GA4 and OneSignal, then test
   the decline path at runtime.
2. Minimize or eliminate exact transition-timing tags sent to OneSignal.
3. Mark the CareerOneStop token secret and restrict it to the minimum production
   function/runtime context after confirming the jobs feature decision.
4. Enable MFA for the Netlify owner account and review recovery controls.
5. Rotate the OpenAI project key to an expiring credential or workload identity
   design after confirming Netlify support and rollback.
6. Replace universal privacy statements with flow-specific, evidence-bounded
   language from the approved remediation design.
7. Run a controlled OneSignal consent-and-decline test with synthetic data to
   determine whether tags are transmitted before permission or after decline.
8. Correct or explain the two Kit null-bound builder fields, then test the live
   form and confirmation path using synthetic non-member data.
9. Reconcile the CareerOneStop token in Netlify with an approved, pending,
   renewed, or expired provider request before describing in-app job search as
   available.

## No-change attestation

The authenticated pass was read-only. No provider setting, permission, key,
credential, project, form, automation, subscriber, message, audit log, delivery
record, analytics property, retention control, consent control, deploy, branch,
or production asset was changed. No subscriber or member record, form
submission, message content, credential value, or analytics event value was
opened or recorded.
