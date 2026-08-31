# Transition Ops Privacy Truth Remediation Design

Status: DESIGN ONLY - NOT APPROVED FOR IMPLEMENTATION OR PUBLICATION

Research and code review date: 31 August 2026

Authorization: `APPROVE TRANSITION OPS PRIVACY TRUTH REMEDIATION DESIGN`

## Open questions - decisions or evidence required

1. Will Transition Ops adopt the recommended `PRIVACY-MINIMAL` target, or a
   stricter `NO BEHAVIORAL ANALYTICS` target?
2. Is the OpenAI organization/project approved for Zero Data Retention or
   Modified Abuse Monitoring? Who can view project usage and logs?
3. What Netlify plan is active, who can view function and form records, are log
   drains configured, and what deletion schedule is actually followed?
4. What Google Analytics property settings, retention period, consent mode,
   linked products, signals, administrator roles, filters and exports are
   active?
5. Does OneSignal currently require consent before collection? Who can view or
   export subscriptions and tags, and what retention/deletion controls apply?
6. What Kit fields, tags, cookies, automations, integrations, exports,
   administrator roles and deletion practices are active?
7. Should optional email signup collect email only, or is branch and military
   status still necessary for a defined member purpose?
8. Should push segmentation keep an exact separation date, use a coarser local
   timing category, or move reminder calculation entirely to the member's
   device?
9. Should the member-derived Navigator gap-topic store be removed, replaced by
   a closed non-sensitive enum, or retained under a separately approved notice
   and retention rule?
10. What is the approved privacy contact, deletion-request route and response
    process?
11. What legal jurisdictions and qualified reviews apply to the public service,
    email list, push service and future employer distribution?
12. Which browser data must the proposed `CLEAR MY LOCAL DATA` control remove:
    local storage, Cache Storage, service worker, push subscription and email
    subscription, and which of those require separate provider actions?

No open question is answered by assumption in this design.

## BLUF

The current blanket privacy sentence is not supportable as written. Some core
planning entries are stored in the browser, but the app also:

- loads Google Analytics 4 before a member is offered a consent choice;
- initializes OneSignal and writes activity and separation-timing tags;
- sends optional email and segmentation fields to Kit;
- sends optional feedback fields to Netlify Forms;
- sends Navigator conversation and transition context to a Netlify Function and
  the OpenAI API;
- stores member-derived Navigator gap-topic counts in Netlify Blobs for 90 days;
- sends resume facts, job postings, contact-header fields and drafts to a
  Netlify Function and the OpenAI API; and
- sends job-search keywords and locations through Netlify to CareerOneStop.

The correct response is not a cosmetic disclaimer. Transition Ops should:

1. inventory and verify every data path;
2. remove or hold unsupported absolute claims;
3. choose a target privacy posture;
4. minimize and consent-gate the underlying flows;
5. provide feature-specific notices and controls;
6. validate code, browser traffic, storage and provider accounts with synthetic
   data; and
7. publish only claims supported by all four evidence layers.

This design recommends `PRIVACY-MINIMAL`: core planning remains device-local;
analytics does not load before an affirmative choice; optional push, email,
feedback, Navigator, Resume Drafter and job search each receive a just-in-time
notice; provider settings are verified; member-derived telemetry is removed or
strictly bounded; and members receive clear local-data and opt-out controls.

## Authority and hard limits

This file is a remediation design, not code, legal advice, a compliance
certification, provider configuration, privacy notice, client promise or deploy
approval. It authorizes no edit to `index.html`, `sw.js`, Netlify Functions,
provider accounts, environment variables, analytics, email, push, DNS, Netlify,
GitHub, contracts, pricing, client systems or production.

All implementation, account inspection, legal review, clone deployment,
production publication and employer use require separate authority.

## Evidence and verdict model

### Evidence classes

- `CODE-OBSERVED`: directly present in this repository.
- `RUNTIME-OBSERVED`: demonstrated in a controlled browser/network/storage test.
- `PROVIDER-DOCUMENTED`: supported by current first-party provider material.
- `ACCOUNT-VERIFIED`: demonstrated in the actual Transition Ops account or
  project by an authorized owner.
- `UNVERIFIED`: not established at the required layer.

### Claim verdicts

- `SUPPORTED`: every material part is supported at all applicable layers.
- `PARTIALLY SUPPORTED`: a narrower statement is supported, but the full claim
  is not.
- `CONTRADICTED`: observed behavior conflicts with the claim.
- `UNVERIFIED`: evidence is missing and the claim cannot ship.

### Remediation dispositions

- `KEEP`
- `NARROW`
- `REPLACE`
- `REMOVE`
- `HOLD FOR EVIDENCE`

A universal term such as `never`, `nothing`, `anonymous`, `only`, `no data` or
`not stored` requires evidence across every applicable code, runtime, provider
and account path. Absence of application logging code is not proof that the
host or provider has no logs.

## Current outward-claim review

| ID | Current claim or implication | Evidence | Verdict | Disposition |
|---|---|---|---|---|
| PC-01 | `Your planning data - dates, ratings, checklists - stays on your device; we never see it.` | The browser does store planning values locally, but the separation date is sent as Navigator context and written to OneSignal tags. Optional online features transmit additional member input. See `index.html:474-475`, `4823-4833`, `5382-5428`, `5473-5535`, `7927`; `netlify/functions/navigator.js:389-437`. | CONTRADICTED as a universal statement | REPLACE |
| PC-02 | `Anonymous usage analytics only.` | GA4 loads on a normal top-level visit and receives page views, feature events and event parameters. No consent gate or account evidence establishes anonymity. See `index.html:104-126`, `5096-5137` and the event calls listed below. | UNVERIFIED and unsafe | REPLACE |
| PC-03 | `Optional email signup is used solely for update alerts and never sold.` | Code sends email, branch and military status to Kit for signup. Code supports the immediate alert purpose but cannot prove provider/account use, sharing, export, integrations, sale status or retention. See `index.html:5173-5201`. | PARTIALLY SUPPORTED | NARROW; HOLD `never sold` pending evidence/review |
| PC-04 | Feedback notice: `Only what you type here is sent - nothing else.` | The submission includes category, optional name, optional email, service status and message; the app also emits a GA event. Ordinary request metadata may exist outside code. See `index.html:3540-3569`, `3780-3864`. | CONTRADICTED | REPLACE |
| PC-05 | OpenAI calls use `store: false`. | Every observed Navigator and Resume API request sets `store: false`. See `netlify/functions/navigator.js:402-437` and `netlify/functions/resume.js:1052-1058`, `1070-1076`, `1134-1141`. | SUPPORTED as a request-setting claim only | KEEP internally; do not translate to `zero retention` |
| PC-06 | No prompt, response or member content is stored at module scope. | The shared client has no module-scope member payload. See `netlify/functions/openai-client.js:1-17`. Hosting and provider logs remain separate. | SUPPORTED narrowly in code | KEEP internally; do not broaden |
| PC-07 | Navigator gap diagnostics `carry no member data`. | A topic is derived from a model response to a member conversation, counted in `navigator-gaps` and logged operationally. The intended 90-day limit is best-effort prune-on-write, so old records may remain if no later write triggers pruning. It may be sanitized and identifier-free, but it is still member-derived information. See `netlify/functions/navigator.js:266-369`. | CONTRADICTED as `no member data` | REPLACE classification; minimize or remove |
| PC-08 | Outreach materials repeating the live privacy sentence are accurate because they quote the app. | A verbatim quote can still be inaccurate. Draft outreach files repeat the unsupported sentence. | CONTRADICTED until remediation | HOLD all reuse and downstream claims |
| PC-09 | The proposed ERG package creates no employer data path. | The synthetic design uses static content and a direct untagged top-level link only. The public app's own flows and employer-managed device/network records remain outside that boundary. | DESIGN-ELIGIBLE, not yet runtime-proven | HOLD FOR SYNTHETIC VALIDATION |
| PC-10 | Navigator: `Nothing stored.` | Browser use counters and intent cache exist; a member-derived gap category can enter Netlify Blobs; host/provider logs are unresolved. See `index.html:6563`; `netlify/functions/navigator.js:266-369`. | CONTRADICTED | REPLACE |
| PC-11 | Navigator pilot: `Nothing stored, nothing logged.` | The pilot uses the same function path; gap records and operational logs exist; provider/runtime logging is unresolved. See `navigator-pilot.html:41`, `59-95`. | CONTRADICTED | REPLACE |
| PC-12 | Resume content `is never stored or logged.` | OpenAI requests use `store:false`, but Netlify/OpenAI operational and abuse-monitoring logs are not disproved. The optional header is excluded from OpenAI prompts but still transits Netlify. See `index.html:7892-7894`, `8027`; `netlify/functions/resume.js:1052-1058`, `1134-1141`. | UNVERIFIED ABSOLUTE | REPLACE with exact flow |
| PC-13 | Email: `No marketing. No spam. Unsubscribe anytime.` | The observed submit is to Kit, but account automations, tracking, message program and unsubscribe/deletion operation are not verified. See `index.html:5173-5201`, `5379`. | UNVERIFIED | HOLD FOR ACCOUNT EVIDENCE |
| PC-14 | `Deadline alerts are timed to your date.` | The observed Kit request sends email, branch and status, not separation date. The statement may refer to another alert mechanism but is not supported for this email path. See `index.html:5173-5201`, `5819`. | CODE MISMATCH | NARROW or align behavior under separate approval |

The current sentence appears at `index.html:4081`. A persistent `Privacy` link
at `index.html:14924-14935` opens the About modal; the repository does not
provide a complete dedicated privacy notice for the flows inventoried here.

## Code-observed data inventory

### Browser-local state

The independent code audit found 28 local-storage keys. They include:

- theme and onboarding state;
- military status, branch, concern and separation date;
- milestone, document and notification progress;
- dismissed reminders and readiness answers;
- install and capture-card state;
- email-signup completion state;
- Navigator pilot counters;
- Resume Drafter daily-use counters; and
- release/SITREP dismissal state.

Exact code-observed key inventory:

`dismissedNotifs`, `docProgress`, `emailSubscribed`, `etsDate`,
`ga_email_signup_fired`, `install_banner_dismissed_at`, `lastNotifDate`,
`taskProgress`, `tops_air_uses`, `tops_capture_dismiss_count`,
`tops_capture_dismissed_at`, `tops_capture_done`,
`tops_dismissed_reminders`, `tops_install_strip_x`, `tops_last_snapshot`,
`tops_nav_beta`, `tops_nav_pilot`, `tops_onboarded`, `tops_readiness`,
`tops_sep_date`, `tops_sitrep_jul2026`, `tops_status`, `tops_theme`,
`tops_tracked_onboarding`, `tops_user_branch`, `tops_user_concern`,
`tops_user_status`, `tops_whatsnew_seen`.

Representative code: `index.html:474-475`, `4704-4731`, `4791-4832`,
`4875-5005`, `5139-5167`, `5382-5428`, `5515-5520`, `6142-6201`,
`7922-7937`.

The service worker uses two Cache Storage areas: current app cache
`transition-ops-v130` and `tops-intent`. Its dynamic path can cache successful
qualifying GET responses, not only a fixed static list. See `sw.js:1-67`.
Local storage and Cache Storage are data stores even when VBS cannot directly
inspect them. No app-authored cookie, `sessionStorage`, IndexedDB,
`localStorage.removeItem` or `localStorage.clear` use was found; third-party SDK
storage remains unverified.

### Full processing map

| Flow | Trigger | Data elements observed in code | Destination/processor | Storage or logs visible in code | Member control today | Evidence gap |
|---|---|---|---|---|---|---|
| Core planning | Onboarding and feature use | Status, branch, concern, separation date, checklist/document progress, readiness answers, dismissals, settings | Browser local storage | Persistent until browser/user/app clearing behavior removes it | Some fields can be changed; no unified clear control found | Runtime clearing completeness |
| PWA/offline | App load and navigation | Static assets; Navigator intent response cache | Browser Cache Storage/service worker | `tops-intent` plus versioned app cache | Browser controls only | Cache content, expiry and clear behavior |
| GA4 | Normal top-level page load and feature events | Page view, tab, status and interaction/event parameters | Google Analytics 4 | Provider-side behavior not represented in repo | No app consent/decline control found | Account settings, retention, exports, linked products, runtime requests |
| OneSignal | SDK initialization; app open; date change; alert permission | SDK/device/session data; `last_active`; exact `ets_date`; epoch day; days/months out; active/post-separation status; notification permission | OneSignal | Provider-side subscriptions and tags | Browser permission is requested later, but SDK initializes and tag code runs earlier. The SDK also initializes in iframe mode because its loader is outside the iframe guard. | Consent gate, pre-permission collection, access, export, deletion, retention |
| Email alerts | Optional signup | Email, branch, military status | Kit API | Provider subscriber record; browser stores signup-complete flag | Optional submission; unsubscribe mentioned | Account fields, cookies, integrations, purpose, deletion, retention |
| Feedback | Optional submit | Message, category, optional name/email, service status; submission timestamp/source in mail fallback | Netlify Forms; member email client on fallback; GA event | Netlify Forms stores submissions; email creates sender/recipient records | Optional; cancel; no in-app delete path | Netlify account access, notifications, retention, deletion process |
| Navigator | Member sends a question | Last 12 user/assistant turns clipped to 1,500 characters each; app context up to 400 characters; computed days out | Netlify Function; OpenAI Responses API | `store:false`; host/provider logs unverified; browser caches intent response | Member initiates send; no just-in-time provider notice found | OpenAI account control; Netlify logs; runtime network; deletion |
| Navigator gap count | Model emits a gap tag | Sanitized topic derived from member/model content; daily bucket count | Netlify Blobs | `navigator-gaps`; intended 90-day best-effort prune-on-write; operational console messages | No member choice found | Old data may remain if writes stop; actual blob/account access, physical expiry and re-identification risk |
| Resume Drafter | Facts review or draft | Role, years, target, skills, certifications, experience, job posting, confirmed facts; for civilian drafts optional name/location/email/phone and length inputs; generated draft and audit material | Netlify Function; OpenAI Responses API | `store:false`; host/provider logs unverified; local output in page state | Member initiates; no just-in-time provider/retention notice found | OpenAI account control; Netlify logs; runtime network; deletion |
| Job search | Member runs search | Keyword and location | Netlify Function; CareerOneStop API | Error status/body snippet may enter Netlify function logs; successful user query logging not in app code | UI is currently disabled by `JOBS_LIVE=false`, but the function has no matching server-side feature gate | Deployment/reachability, provider/host logging and retention |
| Outbound partners | Member opens external link | Browser request and ordinary referrer/device/network data; selected clicks may also create GA events | External site plus GA4 for tracked actions | Outside repository | Member initiates | Destination privacy terms and runtime referrer behavior |

## Analytics and event inventory

GA4 is created at `index.html:104-126` with page-view sending enabled. The
independent audit counted 35 custom event names. Observed events include:

- tab and deep-link activity;
- onboarding status;
- feedback submission categories and presence flags;
- email signup branch/status;
- app sharing method;
- install prompts, outcomes and dismissals;
- capture-card exposure, branch and dismiss counts;
- notification actions and permission outcomes;
- Resume Drafter open, facts review, generation, copy and download;
- job-search open, run and result clicks;
- partner/resource link actions; and
- privacy-modal opens.

Representative locations: `index.html:3548-3554`, `3914-3919`,
`5096-5137`, `5454-5466`, `5577-5862`, `7346`, `7848-8064`,
`14599`, `14933`.

`anonymize_ip: true` at `index.html:118-121` is one configuration parameter. It
does not prove that all event data is anonymous, that no identifier exists, or
that account exports and linked products cannot create linkage.

## Provider evidence matrix

| Provider/system | First-party documented fact | Account evidence required before a public claim | Current status |
|---|---|---|---|
| OpenAI | API data is not used to train models by default unless the customer opts in. Default abuse-monitoring logs may include prompts/responses and may be retained up to 30 days. Approved Zero Data Retention and Modified Abuse Monitoring are separate controls. `store:false` is not the same as ZDR. [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data) | Organization/project identity; training-sharing setting; ZDR/MAM approval and scope; endpoint eligibility; data residency; admin roles; usage/log visibility; retention attestation | UNVERIFIED |
| OneSignal | SDK collection begins after initialization; consent gating can delay collection. Documented SDK data includes session/use, device/browser, permission, timezone/country, IP and browser storage data. [Handling personal data](https://documentation.onesignal.com/docs/en/handling-personal-data); [SDK data inventory](https://documentation.onesignal.com/docs/en/data-collected-by-the-onesignal-sdk) | Consent-required setting; current tags; subscription fields; exports; admin roles; integrations; retention; deletion; actual pre-consent network behavior | UNVERIFIED |
| Google Analytics | Basic consent mode can block tags until a choice; advanced consent mode may still send cookieless pings when analytics storage is denied. [Google consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode) | Basic vs advanced mode; default consent state; property retention; linked products; Google signals; user-provided data; admin roles; exports; filters; actual decline-path requests | UNVERIFIED |
| Netlify Functions | Function logs can cover up to seven days depending on plan. [Netlify logs](https://docs.netlify.com/manage/monitoring/logs/) | Plan; log window; log drains; access roles; request metadata; redaction; function logging; incident and deletion procedure | UNVERIFIED |
| Netlify Forms | Submissions are stored in Netlify's database and can be permanently deleted; Netlify recommends active deletion management for PII. [Netlify form submissions](https://docs.netlify.com/manage/forms/submissions/) | Form fields; email notifications; exports; integrations; access roles; actual retention and deletion cadence; backup behavior | UNVERIFIED |
| Kit | Forms can hold fields/tags, expose visitor/subscriber reports, export subscribers, use cookies and optionally expose subscriber identity in redirect URLs. [Kit Form builder](https://help.kit.com/en/articles/2502640-the-kit-form-builder) | Form fields/tags; cookies; reports; redirects; integrations; exports; admin roles; consent evidence; unsubscribe/deletion; retention | UNVERIFIED |
| Netlify Blobs | Repository code writes a dated aggregate topic object and attempts 90-day prune-on-write | Live store inventory; access roles; replication/backups; deletion result; prune test; logging; incident process | UNVERIFIED |
| CareerOneStop | Repository code sends bounded keyword/location to its job-search endpoint | Current API privacy/logging/retention terms; host logs; account access; runtime request inspection | UNVERIFIED |

Provider documentation establishes general product behavior and available
controls. It does not establish how the actual Transition Ops account is
configured.

## Contradiction and unknown register

| Risk ID | Condition | Impact | Required disposition |
|---|---|---|---|
| R-01 | Blanket `we never see it` conflicts with online features and provider flows | Member trust and outward truth risk | Replace immediately in remediation implementation; do not reuse meanwhile |
| R-02 | `Anonymous analytics only` lacks an app choice and account/runtime proof | Overstates anonymity and control | Stop phrase; choose consent architecture; validate |
| R-03 | OneSignal initializes and tags timing data without a demonstrated collection-consent gate | Exact separation timing leaves device | Delay initialization/tagging or prove lawful, informed gating; minimize tags |
| R-04 | `store:false` may be mistaken for zero provider retention | Misleading AI privacy promise | State only the narrow setting until account evidence proves more |
| R-05 | Feedback notice omits selected fields, analytics and provider storage | Incomplete just-in-time disclosure | Replace notice and add retention/contact route |
| R-06 | Kit purpose/`never sold` statement exceeds code evidence | Unsupported downstream-use claim | Narrow to observed purpose; verify account/contract/legal basis |
| R-07 | Member-derived gap topics are classified as no member data | Data inventory and notice are incomplete | Reclassify; remove or use closed enum and strict retention |
| R-08 | No single member-facing privacy center or clear-data control | Choices are fragmented or absent | Add layered notice and control surface |
| R-09 | Provider/account state is unknown | No defensible retention/access claim | Complete authorized account evidence packet |
| R-10 | Outreach repeats the defective sentence | Defect propagates to partners and future ERG clients | Quarantine and revise only after validated app truth exists |
| R-11 | Employer-managed technology can observe ordinary browsing outside the package | `Employer cannot see` could be overbroad | Limit promise to data received through the package; disclose caveat |
| R-12 | Clearing browser state may not clear push/email/provider records | False `delete everything` promise | Separate local clear, unsubscribe and provider request controls |

## NIST Privacy Framework current and target profile

This design uses NIST Privacy Framework 1.1 as a voluntary risk-management
structure, not as certification. NIST recommends understanding current
processing, defining a target profile and prioritizing gap actions. [NIST PF
1.1](https://www.nist.gov/privacy-framework/using-privacy-framework-11)

| Function | Current profile | Target profile | Priority action |
|---|---|---|---|
| Identify-P | Several code paths are visible, but no complete code/runtime/provider/account inventory governs outward claims | One versioned system, data, purpose, destination, access, retention and control inventory | Build and sign evidence packet before copy approval |
| Govern-P | Privacy self-claims have no dedicated truth-to-implementation owner; registry coverage is absent | Named product, privacy, engineering, provider-account, legal and validation owners with independent gates | Approve/codify proposed governance skill after regression review |
| Control-P | Core local state coexists with pre-consent analytics, early OneSignal initialization and fragmented optional flows | Data minimization, affirmative choices, feature-level notices, local clear, unsubscribe and deletion routes | Implement recommended controls in isolated clone |
| Communicate-P | One broad sentence compresses materially different flows | Layered short notice, full notice, feature notices, provider list, retention/access status and change date | Replace unsupported copy only after implementation evidence |
| Protect-P | Input clipping and `store:false` exist; provider/account access and logging remain unknown | Least privilege, bounded logs, no sensitive debug output, tested deletion, incident route and periodic review | Verify accounts and execute synthetic security/privacy tests |

FTC business guidance also emphasizes making privacy statements match actual
practices and communicating clearly. This design does not make a legal
determination. [FTC consumer privacy guidance](https://www.ftc.gov/business-guidance/privacy-security/consumer-privacy)

## Target-posture options

| Option | Design | Benefits | Costs/limits | Verdict |
|---|---|---|---|---|
| A. Copy-only correction | Replace absolute statements with a current-flow notice; keep behavior unchanged | Fastest truth correction | Leaves pre-consent analytics, early push SDK and unnecessary fields; weakest member control | Necessary interim action, insufficient end state |
| B. Privacy-minimal | Core local by default; basic-consent analytics; push initialized only after choice; minimize tags; field-level optional flows; verified provider settings; bounded or removed derived telemetry; clear controls | Strong balance of member trust, free operation and useful optional services | Requires code, provider, account, UX and validation work | RECOMMENDED |
| C. No behavioral analytics | Remove GA4 and member-derived product telemetry; retain only essential security/cost counters without member content; optional features still get notices and controls | Strongest simple public promise and lowest analytics risk | Less product insight; push/email/AI still create provider flows when chosen | Preferred if analytics value cannot justify governance cost |
| D. Current behavior with broad consent banner | Keep all providers and add one consent interface | Superficially easy | A single banner cannot explain feature-specific content, provider retention or employer boundary; advanced consent can still transmit pings | NOT RECOMMENDED |

## Recommended target architecture

### 1. Core local mission data

- Keep separation date, branch/status, concern, checklist/document progress,
  readiness answers, calculators and settings in browser storage by default.
- Do not send these values to any provider merely because the app opened.
- Add a plain-language inventory showing which fields are local.
- Add `CLEAR MY LOCAL DATA` with a preview of exactly what will be removed.
- Validate local storage, Cache Storage, service-worker state and in-memory state
  after clearing and restart.

### 2. Analytics

- Do not create or load GA4 before an affirmative analytics choice.
- Use Basic consent behavior if GA4 remains; a decline path must create no
  Google tag request, not merely a denied-storage ping.
- Remove member status, branch, concern, dismiss counts and other member
  attributes from analytics unless each field has an approved purpose and
  necessity decision.
- Prefer a small closed event list with no free text, dates, calculator inputs,
  job terms, resume content, prompts, results or stable member identifier.
- Provide a persistent change/withdraw control.

### 3. Push alerts

- Do not initialize OneSignal or write tags until the member asks for alerts,
  sees a provider/data notice and affirmatively continues.
- Remove `last_active` and exact `ets_date` unless necessity is documented.
- Prefer local scheduling. If remote segmentation is necessary, use the least
  precise timing bucket that performs the approved purpose.
- Explain browser permission separately from OneSignal data processing.
- Provide turn-off and unsubscribe instructions; test provider-side deletion.

### 4. Email alerts

- Collect email only by default. Treat branch/status as optional only if a
  documented message purpose needs them.
- Show destination, purpose, unsubscribe route and verified retention/access
  statement before submission.
- Remove language that cannot be proved from account, contract and legal
  evidence.

### 5. Feedback

- State every submitted field and that Netlify Forms stores the submission.
- Do not emit a feedback analytics event before analytics consent.
- Define owner, access, notification, retention, deletion and member request
  route.
- Keep the mail-client fallback clearly separate because sending email creates
  records in the member's and recipient's email systems.

### 6. Transition Navigator and Resume Drafter

- Present a just-in-time notice before first use and keep it available beside
  the input.
- Name the data categories sent to Netlify and OpenAI.
- Keep `store:false`, input clipping, zero SDK retries and cost caps.
- Prohibit classified, controlled, medical-record, financial-account,
  personnel-record and other highly sensitive submissions.
- Minimize app context; do not automatically attach a separation date when a
  coarser local window can serve the response.
- Obtain and record OpenAI account-level retention evidence. Until then, say
  provider retention is being verified rather than claiming zero retention.
- Keep conversation/draft state request-local and browser-local unless the
  member deliberately exports it.
- Assemble optional resume header identity in the browser after the draft
  returns so name, location, email and phone do not transit Netlify merely to be
  appended server-side.

### 7. Navigator gap learning

Preferred order:

1. remove it if the product decision can be made without member-derived data;
2. otherwise map model output to a small reviewed enum before storage, reject
   every unknown value, store counts only, suppress low-volume cells and shorten
   retention; or
3. if free-text/derived topics remain, disclose them and govern them as member-
   derived product data rather than calling them no data.

Never log the source question, prompt, response or rejected topic. A crisis or
safety turn remains completely excluded from product learning.

### 8. Job search and outbound resources

- Show that keyword/location leaves Transition Ops for the government job API.
- Verify CareerOneStop and Netlify log/retention behavior before a narrow claim.
- Add an explicit server-side feature gate so a disabled UI is not the only
  control on the endpoint.
- Use `referrerpolicy` and link design appropriate to the chosen privacy target.
- Do not add client or member identifiers to outbound URLs.

### 9. Browser, cache and transport boundary

- Restrict service-worker dynamic caching to an explicit same-origin static
  asset allowlist. Do not cache API routes, query-bearing requests, third-party
  responses or member-generated content.
- Ensure iframe mode prevents OneSignal as well as GA4, local mission storage
  and service-worker registration.
- Add and validate an explicit `Referrer-Policy`, `Permissions-Policy`, HSTS,
  `X-Content-Type-Options` and fit-for-purpose Content Security Policy.
- Replace wildcard framing with an explicit deny or approved-domain policy.
- Treat CORS as a browser control, not authentication or a server usage cap.

### 10. Privacy center

Create one persistent, readable surface containing:

- a short summary;
- a feature-by-feature table;
- local data inventory;
- provider and purpose list;
- verified retention/access statements and clearly labeled unknowns;
- analytics choice and withdrawal;
- push and email unsubscribe guidance;
- local clear control;
- privacy/deletion contact;
- effective date, version and change summary; and
- a statement that no employer receives individual activity through the
  approved data-free ERG package, with the managed-device/network caveat.

## Proposed member copy - design language only

These drafts must be reconciled to implemented and validated behavior, then
reviewed by the proper legal/privacy authority. They are not approved app copy.

### Short privacy summary

> Your core planning entries are saved in this browser. Optional online
> features send only the information described at the point of use to the
> service providers named in our full privacy notice. You choose whether to use
> analytics, alerts, email, feedback and AI tools, and you can review or change
> those choices from Privacy.

### Analytics choice

> Help improve Transition Ops by sharing limited feature-use events with Google
> Analytics. We do not send your dates, calculator entries, resume, job-search
> terms or Navigator messages as analytics events. Choose `ALLOW ANALYTICS` or
> `NO ANALYTICS`. You can change this later.

This wording is valid only if the implementation and network tests prove every
exclusion.

### Push-alert notice

> If you enable alerts, OneSignal receives the browser and subscription data
> needed to deliver them plus the minimum timing category described here. Do
> not continue if you do not want that information sent to OneSignal. Browser
> notification permission and Transition Ops alert processing are separate
> choices.

The final notice must name the validated timing fields and retention/control
facts.

### Email notice

> If you sign up, your email address [and the optional fields shown here] are
> sent to Kit so Transition Ops can send the updates described here. You can
> unsubscribe from any message. See Privacy for verified retention and contact
> details.

### Feedback notice

> When you submit, Netlify Forms receives your message, category and any
> optional name, email or service status you provide. The submission is stored
> for the period stated in Privacy and is available only to the approved roles
> listed there. If delivery fails and you choose the email fallback, your email
> providers also process the message.

### Navigator notice

> The Navigator sends your question, recent conversation and the transition
> context listed here through a Netlify Function to OpenAI to produce a reply.
> Do not include classified, controlled or highly sensitive records. The
> request uses `store:false`; see Privacy for the separately verified provider
> retention statement.

### Resume Drafter notice

> The Resume Drafter sends the facts, experience, target role, job posting,
> optional contact header and review material you provide through a Netlify
> Function to OpenAI. Do not include classified, controlled or highly sensitive
> records. The request uses `store:false`; see Privacy for the separately
> verified provider retention statement.

### Job-search notice

> Job searches send the keyword and location you enter through a Netlify
> Function to the CareerOneStop job-search service.

### Local clear control

> `CLEAR MY LOCAL DATA` removes the browser data listed here from this device.
> It does not unsubscribe email or push, erase provider records or remove data
> from another device. Those controls are listed separately.

## Implementation sequence - separate authority required

### Phase 0 - freeze unsupported claims

1. Identify every copy surface and partner artifact that repeats PC-01 through
   PC-04 or broadens them.
2. Mark those claims `HOLD FOR EVIDENCE` in change control.
3. Do not distribute new ERG/client material until the public-app notice is
   reconciled.

### Phase 1 - account and runtime evidence packet

1. Authorized owners inspect OpenAI, Netlify, GA4, OneSignal and Kit.
2. Capture dated screenshots/exports of the exact settings in the provider
   matrix without collecting member content.
3. Run synthetic first-visit, decline, accept, return, iframe, offline, feature,
   clear and unsubscribe tests.
4. Record every request, cookie/storage item, provider destination and result.

### Phase 2 - target decision and approved copy

1. Dean selects Option B or C.
2. Product, privacy/legal and engineering owners sign the target data map.
3. PAO adapts the proposed copy to the proven target.
4. Privacy/legal reviews the final notice and choices.

### Phase 3 - isolated implementation

1. Create a dedicated feature branch from the approved base.
2. Work only against the separate OpenAI clone Netlify site.
3. Implement consent gating, initialization changes, minimization, notices,
   controls and data-clearing behavior.
4. Preserve API cost ceilings, daily-use caps, `store:false`, zero SDK retries,
   safety controls and no-login/no-ad/free access.
5. Bump the service-worker cache version only when implementation is approved.

### Phase 4 - validation and adversarial review

1. Run unit/static checks plus browser network and storage inspection.
2. Inspect actual provider dashboards using synthetic records only.
3. Validate every public claim against code, runtime, provider documentation
   and account evidence.
4. Run accessibility, mobile, offline, error, withdrawal and clearing tests.
5. Obtain privacy/legal and Commander go/no-go.

### Phase 5 - staged release and rollback readiness

1. Validate on the separate Netlify site with no production credentials or
   traffic.
2. Prepare a one-commit revert plan and pre-change evidence.
3. Publish to production only after explicit merge/deploy approval.
4. Re-test production and revert immediately if claims and behavior diverge.

### Phase 6 - ERG fixture eligibility

Only after the public-app privacy gate passes may the synthetic ERG fixtures be
customized for a real client. Client privacy, legal, security, accessibility,
procurement, content, support and contract reviews remain independent.

## Acceptance and regression suite

Use synthetic identities, `.invalid` email domains, fictional resumes and test
dates. Never use a real member, employee, client or sensitive record.

| ID | Scenario | Pass condition |
|---|---|---|
| PTI-01 | First visit before any choice | No GA4 or OneSignal collection request; core app remains usable |
| PTI-02 | Decline analytics | No Google tag request, cookie, event or cookieless ping; choice persists locally |
| PTI-03 | Accept then withdraw analytics | Events begin only after acceptance and stop after withdrawal; no prohibited parameters |
| PTI-04 | Core planning | Dates, ratings, checklist/readiness and calculator entries remain local and absent from network traffic |
| PTI-05 | Enable push | Notice precedes SDK initialization/tagging; only approved minimized fields appear |
| PTI-06 | Decline push | No subscription or tags are created; app remains usable |
| PTI-07 | Unsubscribe push | Browser and provider subscription outcomes match the notice and evidence record |
| PTI-08 | Email signup | Only approved fields go to Kit after notice; unsubscribe and deletion paths work as stated |
| PTI-09 | Feedback | Notice lists every field/destination; no analytics event fires without consent; retention/deletion test passes |
| PTI-10 | Navigator | Network payload matches notice and bounds; `store:false` present; no prompt/response in app logs; account evidence matches claim |
| PTI-11 | Resume facts and draft | Every transmitted field is listed; `store:false` on generation, repair and audit calls; no content logging |
| PTI-12 | Job search | Only bounded keyword/location leaves; notice and provider behavior match evidence |
| PTI-13 | Gap learning | Removed, or only closed approved enum counts appear; no free text, source content or low-volume disclosure |
| PTI-14 | Clear local data | All listed local-storage keys, Cache Storage and service-worker-controlled state clear and stay cleared after reload |
| PTI-15 | Clear-data copy | Does not imply push/email/provider deletion; separate controls are accurate |
| PTI-16 | Iframe mode | No analytics, push initialization, service-worker registration or local mission persistence outside the approved design |
| PTI-17 | Offline/reconnect | Cached data does not cause undeclared transmission when connection returns |
| PTI-18 | Error paths | Errors contain no prompt, resume, email, date, search term or member-derived topic in browser/function logs |
| PTI-19 | Universal-language scan | Every `never`, `nothing`, `anonymous`, `only`, `no data`, `stored` and `retained` statement has complete evidence |
| PTI-20 | Provider/account drift | A changed setting or provider behavior fails the gate and blocks outward claim reuse |
| PTI-21 | ERG direct link | No client/member identifier, tracking parameter, redirect, embed or client telemetry |
| PTI-22 | Employer-managed device caveat | Member-facing package does not promise invisibility from client-controlled infrastructure |
| PTI-X1 | Attempt classified or highly sensitive AI input | Warning is visible; no design or test requires real sensitive data |
| PTI-X2 | Attempt to treat `store:false` as ZDR | Claim validation fails unless account-approved ZDR evidence exists and covers the endpoint |

## Claim-release gate

A claim ships only when its row contains:

- exact proposed wording;
- every material data element and destination;
- code reference;
- runtime test ID and result;
- provider documentation and retrieval date;
- account setting evidence and owner;
- retention/access/deletion basis;
- member choice/control;
- privacy/legal disposition where required;
- validation owner and date; and
- next review trigger/date.

If any required cell is blank, the claim is `UNVERIFIED` and is withheld.

## Roles and accountability

| Work | Dean/Commander | Product/privacy owner | S3 engineering | S2/policy | PAO | Provider-account owner | Privacy/legal | Validation |
|---|---|---|---|---|---|---|---|---|
| Select target posture | A | R | C | C | C | C | C | C |
| Inventory code/data | I | A | R | C | I | C | C | C |
| Verify accounts | I | A | C | I | I | R | C | C |
| Draft final copy | A | C | C | C | R | C | C | C |
| Implement isolated change | I | A | R | I | C | C | C | C |
| Execute validation | I | A | C | C | C | C | C | R |
| Approve legal/privacy disposition | I | C | I | I | I | C | A/R | C |
| Approve merge/deploy | A/R | C | C | I | I | I | C | C |
| Maintain evidence and drift review | I | A | R | C | C | R | C | R |

`A` accountable, `R` responsible, `C` consulted, `I` informed. Named people
must replace role labels before implementation.

## Risks and rollback design

- If copy changes before behavior, the notice may still be incomplete. Treat
  copy-only correction as an interim risk reduction, not completion.
- If behavior changes before copy, members may not receive accurate choices.
  Release code and matching notice as one validated unit.
- Consent failure must fail closed: no analytics or push SDK load.
- AI/privacy controls must not bypass cost caps, safety gates or daily limits.
- A service-worker release can preserve stale code or copy. Cache-version and
  update tests are mandatory during implementation.
- Provider-account drift can invalidate a claim without a code diff. Schedule
  evidence review and trigger immediate hold on affected statements.
- Production defects require a prepared `git revert`, not live debugging.
- ERG/client copy is downstream. If public-app privacy truth fails, pull the
  client link/copy without changing or debugging production through the client.

## Separate approvals required

The following are not authorized by this design:

1. `APPROVE PRIVACY-TRUTH-TO-IMPLEMENTATION v0.1 CODIFICATION`
   - permits force-mod to create and register the missing governance skill and
     run its regression suite; no product change.
2. `APPROVE TRANSITION OPS PRIVACY ACCOUNT EVIDENCE COLLECTION`
   - permits authorized read-only inspection of OpenAI, Netlify, GA4,
     OneSignal and Kit settings with synthetic/no-content evidence capture.
3. `APPROVE TRANSITION OPS PRIVACY TARGET: PRIVACY-MINIMAL`
   - or the exact alternate target Dean selects.
4. `APPROVE TRANSITION OPS PRIVACY REMEDIATION IMPLEMENTATION`
   - permits code and copy work on an isolated branch/clone only, with an exact
     file/change order and rollback plan.
5. `APPROVE TRANSITION OPS PRIVACY CLONE VALIDATION`
   - permits synthetic browser/provider testing on the separate Netlify site.
6. `APPROVE TRANSITION OPS PRIVACY PRODUCTION MERGE`
   - permits the separately validated change to enter the normal production
     approval path; it does not waive deployment discipline.
7. A client-specific ERG package approval naming the client, scope, contract,
   reviewers, publication surface, price/spend, support and validation plan.

## Research sources

- [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data)
- [OneSignal handling personal data](https://documentation.onesignal.com/docs/en/handling-personal-data)
- [OneSignal SDK data inventory](https://documentation.onesignal.com/docs/en/data-collected-by-the-onesignal-sdk)
- [Google consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode)
- [Netlify logs](https://docs.netlify.com/manage/monitoring/logs/)
- [Netlify form submissions](https://docs.netlify.com/manage/forms/submissions/)
- [Kit Form builder](https://help.kit.com/en/articles/2502640-the-kit-form-builder)
- [NIST Privacy Framework 1.1](https://www.nist.gov/privacy-framework/using-privacy-framework-11)
- [FTC consumer privacy guidance](https://www.ftc.gov/business-guidance/privacy-security/consumer-privacy)

All provider facts are current documentation findings as of the research date.
Actual Transition Ops provider/account settings remain `UNVERIFIED` until an
authorized account review closes the corresponding evidence gaps.
