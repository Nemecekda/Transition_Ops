# SW-PRIVACY-01 Clone-Only Implementation Packet

Status: DRAFT FOR COMMANDER IMPLEMENTATION APPROVAL
Prepared: 31 AUG 2026
Target: `ops/openai-parallel-clone` and its separate Netlify clone only
Production authority: NONE

## Open decisions - required before implementation

1. **Transition-timing mode sent to OneSignal**
   - `A - BROAD BAND`: send only a reviewed transition range. This reveals
     less, but reliable date-specific threshold alerts cannot be promised
     unless the member returns often enough for the band to be refreshed.
   - `B - EXACT DAY`: send only `ets_epoch_day` after informed consent and
     browser permission. This is equivalent to disclosing the exact separation
     date, but it preserves reliable date-timed remote alerts.
   - Recommendation: `B - EXACT DAY` if date-timed push remains a mission
     requirement. Remove `last_active`, `ets_date`, `days_out`, `months_out`,
     and `status`; disclose the exact-date transfer plainly. Select `A` if
     privacy minimization is more important than date-specific push delivery.
2. **Clone provider isolation**
   - Recommendation: create and approve a separate OneSignal app for the clone.
     The production OneSignal App ID must not be used for clone validation.
   - Record the exact clone origin and clone App ID before provider-backed code
     is enabled. An unknown origin or missing clone App ID fails closed.
   - Until that separate provider action is approved, clone push remains
     disabled and testing stops at deterministic local stubs and request
     blocking.
3. **Privacy and deletion contact**
   - Recommendation: `dean@veteranbridgesolutions.com`, which is already a
     public Transition Ops contact. Dean must explicitly approve its privacy
     and deletion role before member copy uses it for that purpose.
4. **OneSignal clone settings**
   - Required for provider-backed clone validation: automatic slide prompt off,
     welcome notification off, auto-resubscribe off, custom worker path and
     scope set to `/push/onesignal/`, and no unreviewed integrations.
   - These are provider-account changes and are not authorized by this packet.
5. **Production dates**
   - `PRODUCTION_CUTOVER_UTC` remains unset until a separately approved
     production deployment.
   - `EARLIEST_LEGACY_SUNSET_UTC` will be cutover plus 366 days. A later date
     may be selected from migration evidence; an earlier date is prohibited.

No implementation starts until decisions 1-3 are recorded. Decision 4 is
required before provider-backed clone validation. Decision 5 is set only in a
future production approval.

## BLUF

Current code cannot meet SW-PRIVACY-01. It loads the OneSignal page SDK in the
document head, initializes OneSignal without a collection-consent gate,
registers `/sw.js` at root scope, imports the OneSignal worker from `/sw.js`,
and writes transition-timing tags after app load.

The clone implementation will separate the worker roles:

- `/pwa-sw.js` becomes the OneSignal-free root PWA worker for new and migrated
  browsers.
- `/sw.js` remains available, unchanged, only for legacy registrations.
- `/push/onesignal/OneSignalSDKWorker.js` becomes the dedicated push worker and
  is registered only after informed affirmative push consent.

The current page must contain no OneSignal network-loading element before a
valid local consent record or a fresh affirmative action. Browser notification
permission remains a second, separate choice. A decline, dismissal, browser
denial, or withdrawal must fail closed.

## Authority and hard limits

The exact authorization for this packet is:

`APPROVE SW-PRIVACY-01 IMPLEMENTATION PACKET - CLONE ONLY; NO PROVIDER OR PRODUCTION CHANGES`

Authorized now:

- inspect repository state;
- define exact files, order, data boundaries, copy, tests, rollback, and future
  approvals; and
- write and validate this design document.

Not authorized now:

- edit `index.html`, any service worker, `_headers`, `package.json`, or scripts;
- inspect or change OneSignal, Netlify, browser subscriber, or other provider
  state;
- run a hosted clone test that creates a push subscription or provider record;
- stage, commit, push, merge, deploy, or modify production; or
- publish member-facing privacy claims or consent copy.

## Baseline and evidence

Repository baseline inspected on 31 AUG 2026:

- branch: `ops/openai-parallel-clone`;
- HEAD: `797580e`;
- production `main`: `be12334`;
- branch cache: `transition-ops-v130`;
- highest cache value in this branch history: `transition-ops-v140`;
- production-main cache: `transition-ops-v129`;
- `sw.js` SHA-256:
  `45a4f093d7a19d4403cdaa5da0e6d6ae0a7ae497080fe92694046be789108d32`;
- root `OneSignalSDKWorker.js` SHA-256:
  `2f213985d10e5c5117acfde4f0cab00ad2c13035577ef38c7f0d86d2dd722fbc`.

### Current-state findings

| Path and anchor | Observed behavior | Evidence | Disposition |
|---|---|---|---|
| `index.html:129` | Loads `OneSignalSDK.page.js` from the OneSignal CDN during normal page parsing | CODE-OBSERVED | REMOVE from static page |
| `index.html:131-139` | Initializes OneSignal without `requiresUserPrivacyConsent` and points it to `sw.js` at `/` | CODE-OBSERVED | REPLACE with post-consent loader |
| `index.html:478-481` | Registers `/sw.js` as the app worker at root scope | CODE-OBSERVED | REPLACE with `/pwa-sw.js` |
| `sw.js:17-20` | Imports the OneSignal service-worker SDK into the root PWA worker | CODE-OBSERVED | Preserve only as legacy file; never register from current code |
| `sw.js:22-71` | Uses cache v130 and network-first app caching | CODE-OBSERVED | Extract and tighten in new PWA worker |
| `index.html:5475-5535` | Writes `last_active`, exact date, epoch day, days/months out, and status tags | CODE-OBSERVED | Remove; add only the selected timing mode after consent and permission |
| `index.html:5842-5878` | Uses native notification permission without an app data-consent step | CODE-OBSERVED | Replace with two-step consent and OneSignal subscription flow |
| `OneSignalSDKWorker.js:1` | Root compatibility file imports the OneSignal worker; before commit `d7d1d70`, OneSignal used its default worker path while this file existed, so historical root registration is possible | CODE-OBSERVED plus repository-history inference | Retain pending legacy-path evidence; do not reference from current code |
| OneSignal account evidence, 31 AUG 2026 | Auto-resubscribe on; slide prompt after one pageview and ten seconds; welcome notification on | ACCOUNT-VERIFIED for inspected surfaces | Separate clone-account action required |

Current verdict: `CONTRADICTED` for any claim that new browsers make zero
OneSignal requests before consent. No universal claim is releasable.

## Binding worker-role record

| Role | Repo path | Public URL | Registration scope | Registration rule | Retirement rule |
|---|---|---|---|---|---|
| `ACTIVE_PWA_WORKER` | `pwa-sw.js` | `/pwa-sw.js` | `/` | Registered on every non-iframe app load; contains no OneSignal URL, import, or API | Normal app worker; not retired by this project |
| `LEGACY_ROOT_WORKER` | `sw.js` | `/sw.js` | Existing `/` registrations only | Current app code must never register it after cutover | Retain through separately approved sunset at least 366 days after production cutover |
| `DEDICATED_PUSH_WORKER` | `push/onesignal/OneSignalSDKWorker.js` | `/push/onesignal/OneSignalSDKWorker.js` | `/push/onesignal/` | Registered only by post-consent OneSignal initialization | Unregister on decline cleanup, browser denial cleanup, or withdrawal; file remains available until separately retired |
| `UNKNOWN_ROOT_COMPATIBILITY_WORKER` | `OneSignalSDKWorker.js` | `/OneSignalSDKWorker.js` | Unknown historical state | No current app reference; do not create a new registration | Retain until account/runtime evidence proves it is not a legacy dependency |

Binding value:

`TOPS_PWA_WORKER_FILE=pwa-sw.js`

Candidate first active-worker cache on the present clone branch:
`transition-ops-v141`. Recalculate immediately before implementation and again
before handoff. The selected integer must be greater than every cache number in
production-main history and the current clone line; it may never be reused.

## Target data and state model

### Local push-choice record

Use one browser-local key:

`tops_push_choice_v1`

Allowed JSON shape:

```json
{
  "state": "accepted",
  "noticeVersion": "sw-privacy-01-v1",
  "timingMode": "exact-day"
}
```

Closed values:

- `state`: `accepted`, `declined`, `withdrawn`, or `browser-denied`;
- `noticeVersion`: exact current notice version only;
- `timingMode`: `exact-day` or `broad-band`, matching the Commander decision.

Do not store a name, email, OneSignal ID, subscription ID, IP address,
timestamp, free text, or exact date in this record. Invalid JSON, unknown fields,
an old notice version, or a missing record is treated as no consent.

The record is device/browser-local. It does not establish consent on another
browser. A material change to fields, purpose, provider, worker scope, or copy
requires a new notice version and a fresh choice.

### Provider transfer after acceptance

No OneSignal field is authorized before acceptance. After acceptance, the
permitted transfer is:

- OneSignal SDK-required browser, device, network, session, permission, and
  push-subscription data, subject to provider/runtime verification.

Only after browser permission and subscription opt-in succeed may the app add
exactly one approved timing representation:

  - `ets_epoch_day` under `EXACT DAY`; or
  - one closed reviewed range under `BROAD BAND`.

Prohibited tags and identity calls:

- `last_active`;
- `ets_date`;
- `days_out`;
- `months_out`;
- `status`;
- name, email, phone, branch, rank, component, concern, checklist state,
  readiness data, or AI content;
- OneSignal `login`, `addEmail`, or `addSms`.

The exact-day option must be treated and disclosed as the exact separation date,
even though the wire field is an epoch-day integer.

## Exact file packet and change order

Implementation is intentionally split so the push feature can be disabled
without restoring pre-consent OneSignal behavior.

### Commit 1 - inert worker assets and deterministic tests

1. Add `pwa-sw.js`.
   - Copy only the app-cache responsibilities from current `sw.js`.
   - Include `CACHE_NAME`, the current ten-entry `ASSETS` list, install,
     activate, and fetch handling. The list includes the exact existing Google
     Fonts URL; removing it requires the same-change deploy-discipline mapping
     update.
   - Preserve the `tops-intent` cache during activation because the dedicated
     push worker may write a cold-launch destination there.
   - Contain zero `onesignal`, `importScripts`, `push`, `notificationclick`,
     `SHOW_NOTIFICATION`, or remote-SDK references.
   - Dynamically cache only same-origin navigation and exact reviewed static
     assets. Never dynamically cache Netlify Function routes, API responses,
     arbitrary third-party requests, query-bearing non-navigation requests, or
     member-generated content.
   - Record the current remote-font `cache.addAll()` dependency as an open
     install-reliability risk. Do not silently remove it from the mapping.
   - Use the recalculated monotonic cache number; candidate v141.
2. Add `push/onesignal/OneSignalSDKWorker.js`.
   - Keep the existing cold-launch intent recorder before the OneSignal import
     so supported `tool=` destinations continue to reach `tops-intent`.
   - Import the OneSignal v16 worker exactly once.
   - Do not add app caching, a second generic click opener, local scheduling,
     or message handling.
3. Add `scripts/sw-privacy-regression.js`.
   - Assert every static invariant in the acceptance section below.
   - Read source only; create no browser, provider, or network state.
4. Add `test:sw-privacy` to `package.json`.
5. Add `_headers` entries for `/pwa-sw.js`, `/sw.js`,
   `/OneSignalSDKWorker.js`, and
   `/push/onesignal/OneSignalSDKWorker.js` with JavaScript content type and
   `Cache-Control: no-cache`.
6. Do not edit `sw.js` or root `OneSignalSDKWorker.js`; verify both hashes after
   the commit.

Commit 1 has no application registration or provider effect by itself.

### Commit 2 - privacy cutover with push disabled

Modify `index.html` only:

1. Remove the static OneSignal CDN script tag and the head initialization block.
2. Replace current registration of `/sw.js` with registration of
   `/pwa-sw.js` at scope `/`.
3. Before registration, inventory the prior root registration script URL in
   memory for the current test evidence. Do not persist a cohort marker and do
   not execute or fetch the old script for classification.
4. Register `/pwa-sw.js` with
   `{ scope: "/", updateViaCache: "none" }`. This updates the existing
   root-scope registration rather than creating an overlapping root scope.
5. Remove mount-time OneSignal reads, the 1.5-second tag refresh, ETS-change tag
   writes, and push-choice analytics events.
6. Keep push controls in a truthful disabled state:
   `Push setup is being updated on this test site.`
7. Keep iframe mode free of PWA registration, OneSignal script loading, and
   push controls.

Commit 2 is the privacy-safe fallback. From this point forward, no rollback may
restore static SDK loading or current registration of `/sw.js`.

### Commit 3 - consent-gated push

Modify `index.html` and the deterministic regression only:

Implementation gate: set `TOPS_PUSH_ENABLED=false` and provide no fallback App
ID until the exact clone origin and clone OneSignal App ID are separately
approved. While the gate is false, do not load the SDK or expose an action that
can start provider processing. Enabling the gate is a later configuration
change with its own provider and hosted-validation authority.

1. Add a push-choice state separate from browser `Notification.permission` and
   OneSignal subscription state.
2. Route both current alert entry points - `ENABLE ALERTS` near
   `index.html:7511` and `REMIND ME` near `index.html:14063` - through one
   shared flow with the approved app-owned pre-permission notice and
   equal-prominence continue/decline actions.
3. On decline:
   - write `declined` locally;
   - do not create or load a OneSignal script element;
   - remove any stale dedicated worker registration without touching the root
     PWA registration; and
   - leave the rest of the app usable.
4. On affirmative choice:
   - write the accepted notice version and timing mode;
   - require an exact match to the separately approved clone origin and clone
     OneSignal App ID; do not embed or fall back to the production App ID on
     this clone-only implementation;
   - dynamically create the OneSignal page-SDK element only after the user
     action;
   - call `setConsentRequired(true)` before `init`;
   - initialize with the clone app ID, `requiresUserPrivacyConsent: true`,
     `serviceWorkerPath: "push/onesignal/OneSignalSDKWorker.js"`,
     `serviceWorkerParam: { scope: "/push/onesignal/" }`,
     `welcomeNotification: { disable: true }`, and
     `autoResubscribe: false`;
   - call `setConsentGiven(true)` only after consent-required initialization;
   - request/restore push through `User.PushSubscription.optIn()` so an earlier
     SDK opt-out is cleared; and
   - treat the browser permission prompt as the second control.
5. Mark alerts enabled only when all three facts are true:
   - local data choice is accepted for the current notice;
   - browser notification permission is granted; and
   - OneSignal `User.PushSubscription.optedIn` is true.
6. Write the one approved timing tag only after the enabled state is proved.
7. On native prompt dismissal or denial:
   - remove any timing tag if one exists;
   - call `PushSubscription.optOut()`;
   - call `setConsentGiven(false)`;
   - unregister only the dedicated `/push/onesignal/` worker;
   - store `browser-denied`; and
   - show the browser-settings recovery state.
8. On withdrawal:
   - remove the approved timing tag while consent is still active;
   - call `PushSubscription.optOut()` before revoking consent;
   - call `setConsentGiven(false)`;
   - unregister only the dedicated push worker;
   - store `withdrawn`;
   - remove the in-page SDK element and reload after cleanup; and
   - state that browser permission and existing provider records are not
     deleted by this action.
9. On a returning browser with a valid accepted record, SDK loading may resume
   without a new prompt because the local record proves the prior choice for
   that notice version. A missing, stale, malformed, declined, withdrawn, or
   browser-denied record fails closed.
10. `CLEAR MY LOCAL DATA`, when implemented by the broader privacy project,
    must run push withdrawal cleanup before deleting the push-choice key. It may
    not leave a dedicated worker registered with no consent record.
11. Update the existing privacy surface near `index.html:4071` with the
    approved cohort-bounded OneSignal disclosure. It must not make a universal
    pre-consent or provider-deletion claim.

## Cohort transition algorithm

### NEW

Starting state: no root service-worker registration and no valid push choice.

1. Load app without any OneSignal element or request.
2. Register `/pwa-sw.js` at `/`.
3. Keep dedicated push worker absent until an affirmative choice.
4. Decline and reload must remain OneSignal-free.

### MIGRATED

Starting state: prior root registration is `/sw.js` or another approved legacy
root artifact; member revisits after cutover.

1. Capture the old script URL in the current in-memory test record only. Do not
   persist a cohort marker.
2. Accept that the old worker may contact OneSignal before the page completes
   migration; this is the bounded legacy exception.
3. Register `/pwa-sw.js` at the same `/` scope.
4. Wait for install/activate and `controllerchange`; prove the active root
   script URL is `/pwa-sw.js`.
5. Do not directly unregister the root registration and do not delete
   `/sw.js`.
6. If the member declines, do not create the dedicated worker. Existing push
   may stop; that consequence is disclosed and accepted.
7. If the member accepts, initialize OneSignal against the dedicated path only.

### LEGACY

Starting state: a browser retains an old root registration and has not completed
migration.

- Keep `/sw.js` and the root compatibility file available.
- Do not describe this cohort as pre-consent clean.
- Do not force provider migration or deletion without separate approval.
- A pre-choice OneSignal request and loss of push after decline are accepted
  only for this cohort.

### RETIRED

This state is unavailable until the production sunset has elapsed and a
separately approved evidence run proves the retirement criteria below. Clone
testing cannot retire the production legacy cohort.

## Draft member copy - held for final approval

The selected timing mode determines one sentence. All copy remains design-only
until implementation evidence, privacy/legal review, and Dean's final wording
approval.

### Pre-permission title

`Choose whether to use push alerts`

### Pre-permission explanation - exact-day option

`Transition Ops can send time-sensitive transition alerts to this browser. If
you continue, Transition Ops will connect this browser to OneSignal. OneSignal
will receive browser, device, network, session, notification-permission, and
push-subscription data, plus your exact separation date, so alerts can be timed
to your transition.`

`You can decline and keep using Transition Ops. You can turn alerts off later.
Your choice to let Transition Ops use OneSignal is separate from your browser's
notification permission; your browser will ask next whether notifications may
appear.`

### Pre-permission explanation - broad-band option

`Transition Ops can send transition alerts to this browser. If you continue,
Transition Ops will connect this browser to OneSignal. OneSignal will receive
browser, device, network, session, notification-permission, and
push-subscription data, plus a broad transition-timing range - not your exact
separation date - to select relevant alerts.`

`You can decline and keep using Transition Ops. You can turn alerts off later.
Your choice to let Transition Ops use OneSignal is separate from your browser's
notification permission; your browser will ask next whether notifications may
appear.`

### Actions

- Affirmative: `AGREE AND CONTINUE TO BROWSER PERMISSION`
- Decline: `DECLINE PUSH ALERTS`

### Declined state

`Push alerts are off for this browser. You can keep using Transition Ops and
enable alerts later from the alerts control.`

### Enabled state

`Push alerts are on for this browser. Transition Ops uses OneSignal to deliver
them. Your Transition Ops push choice and browser notification permission can
be changed separately.`

### Withdrawal action

`TURN OFF TRANSITION OPS ALERTS`

Supporting line:

`Stops Transition Ops from using OneSignal for alerts on this browser. Browser
notification permission is managed separately.`

### Withdrawal confirmation

`Transition Ops alerts are off for this browser. Transition Ops will not restart
OneSignal push processing unless you enable alerts again. Your browser
notification permission has not changed. This action does not confirm deletion
of records OneSignal may already hold.`

### Browser permission denied

`Your browser blocked notifications, so alerts are off for this device.
Transition Ops has also stopped OneSignal push processing for this browser.
Browser notification permission is separate; change it in browser settings
before trying again.`

### Legacy-browser disclosure

Show only when the pre-cutover root registration is reliably detected:

`Earlier push setup detected`

`This browser previously used an older Transition Ops push setup that may have
contacted OneSignal before the current choice was available. Declining or
turning alerts off may stop existing alerts. This choice does not confirm
deletion of records OneSignal may already hold.`

### Copy prohibitions during legacy period

Do not publish:

- `OneSignal never loads before consent.`
- `No push data leaves your browser unless you opt in.`
- `Turning off alerts deletes your OneSignal data.`
- `Transition Ops stores no user data.`
- any equivalent universal statement.

## Validation and evidence matrix

Use synthetic dates and fresh test-browser profiles. Do not use a real member,
subscriber, resume, email, or other sensitive record.

| ID | Scenario | Required pass condition | Authority |
|---|---|---|---|
| SWP-01 | Static source | No static OneSignal page-SDK tag; no current `/sw.js` registration; active PWA worker contains zero OneSignal references | Clone implementation |
| SWP-02 | Worker files | Exact paths/scopes exist; JavaScript MIME; no redirect; active worker and dedicated worker parse | Clone implementation |
| SWP-03 | Fresh first visit | Root worker is `/pwa-sw.js`; zero request to any OneSignal host; no dedicated registration; core app and offline shell work | Hosted clone approval required for runtime |
| SWP-04 | Fresh decline and reload | Choice persists; zero OneSignal request or registration on both loads; app remains usable | Hosted clone approval required |
| SWP-05 | Fresh accept | First OneSignal request occurs strictly after affirmative click; app notice precedes native browser prompt | Provider-backed clone approval required |
| SWP-06 | Browser grant | Dedicated worker URL and scope exact; subscription opted in; only selected timing field present | Provider-backed clone approval required |
| SWP-07 | Browser dismiss/deny | Cleanup completes; dedicated registration absent; no tag; accurate recovery copy; reload makes no OneSignal request | Provider-backed clone approval required |
| SWP-08 | Returning accepted | Current notice record permits post-choice SDK load; no duplicate root worker; status requires permission and opt-in | Provider-backed clone approval required |
| SWP-09 | Withdrawal | Tag removal, opt-out, consent revocation, dedicated-worker unregister, local state, reload, and provider state match copy | Provider-backed clone approval required |
| SWP-10 | Legacy migration | Seeded `/sw.js` registration updates to `/pwa-sw.js`; bounded pre-migration request reported separately | Provider-backed clone approval required |
| SWP-11 | Legacy decline | Root migration completes; no dedicated worker; existing push may stop; legacy disclosure shown | Provider-backed clone approval required |
| SWP-12 | Iframe | No PWA registration, OneSignal script, push UI, storage, or request | Hosted clone approval required |
| SWP-13 | Offline and reconnect | Offline shell works; no queued consent or tag action transmits after a decline; accepted setup failure is visible and retryable | Hosted clone approval required |
| SWP-14 | Notification tap | Synthetic push opens the correct supported tool, including iOS cold-launch path; `tops-intent` expires as designed | Provider-backed clone approval required |
| SWP-15 | Cache migration | Candidate cache is monotonic; current app assets update; legacy cache does not delete `tops-intent`; no API/member content cached | Hosted clone approval required |
| SWP-16 | Clear local data seam | Clear action invokes withdrawal first and leaves no consent key or dedicated registration; copy makes no provider-deletion promise | Broader privacy implementation approval required |
| SWP-17 | Regression | Navigator, Resume Drafter, install flow, in-app alerts, and no-login/free-use controls remain functional | Hosted clone approval required |
| SWP-18 | Universal-language scan | Every push/privacy absolute is absent or has complete cohort, runtime, provider, account, retention, and deletion evidence | Claim-release approval required |

### Deterministic source assertions

The future `scripts/sw-privacy-regression.js` must fail unless all are true:

1. `index.html` contains zero static references to
   `cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js`.
2. `index.html` contains zero registrations of `/sw.js` and exactly one current
   registration path for `/pwa-sw.js`.
3. `pwa-sw.js` contains zero case-insensitive matches for `onesignal` and
   `importScripts`.
4. `push/onesignal/OneSignalSDKWorker.js` contains exactly one OneSignal worker
   import and no app-cache code.
5. OneSignal initialization is reachable only through the accepted-choice
   branch and names the exact dedicated path and scope.
6. Declined, withdrawn, denied, stale, malformed, and missing records cannot
   call the SDK loader.
7. The only transition timing field is the selected Commander-approved field.
8. `last_active`, `ets_date`, `days_out`, `months_out`, and `status` are absent
   from OneSignal tag writes.
9. `sw.js` and root `OneSignalSDKWorker.js` match their frozen hashes unless a
   later Commander decision explicitly changes the legacy boundary.
10. Cache version proof has the exact allowed first-path shape and a forward,
    never-used integer.

### Runtime evidence record

Every runtime case records:

- UTC timestamp and operator;
- clone origin and deploy identifier;
- browser, version, operating system, and fresh/seeded profile state;
- starting and ending worker script URLs and scopes;
- starting notification permission and local push-choice state;
- sanitized network export listing request time, host, path, method, and status;
- localStorage, IndexedDB, Cache Storage, cookie, and worker-registration
  inventory without member content;
- synthetic provider subscription and tag result where separately authorized;
- screenshot of the displayed notice/state; and
- PASS/FAIL against one stated condition.

One unknown or unexplained OneSignal request fails new/migrated, decline,
withdrawal, iframe, and denied-path tests.

## Clone cutover and production sunset record

Clone implementation does not start the production legacy clock.

| Field | Required value |
|---|---|
| Clone branch | `ops/openai-parallel-clone` unless Dean names a new branch |
| Clone site | Exact Netlify site ID and origin recorded at hosted-validation approval |
| Clone deploy | Deploy ID and UTC timestamp recorded after Dean publishes it |
| Production cutover | UNSET; separate approval required |
| Earliest production sunset | Production cutover plus 366 days |
| Legacy URLs | `/sw.js` and `/OneSignalSDKWorker.js` |
| Active URL | `/pwa-sw.js` |
| Dedicated push URL/scope | `/push/onesignal/OneSignalSDKWorker.js`; `/push/onesignal/` |
| Retirement approval | Dean Nemecek |
| Retirement evidence owner | s3-devops |
| Claim-release owner | privacy/product owner plus PAO, privacy/legal, validation, and Dean |

### Retirement evidence required

Retirement is blocked until all are true:

1. the sunset timestamp has passed;
2. current app code has registered only `/pwa-sw.js` for at least the full
   sunset interval;
3. new, migrated, decline, withdrawal, iframe, offline, and rollback cases pass
   on supported browser families;
4. OneSignal subscriber-age and worker-path evidence has been inspected under
   separate authority;
5. no tested current browser uses `/sw.js` or root
   `/OneSignalSDKWorker.js` as an active registration;
6. a removal preview proves no migration or push regression;
7. privacy/legal clears the proposed universal wording, if any; and
8. Dean separately approves the retirement ship.

## Rollback design

### Commit-level rollback boundary

- Commit 3 may be reverted by itself. Commit 2 remains, leaving push disabled,
  `/pwa-sw.js` active, and no static OneSignal load.
- Commit 2 must never be raw-reverted after cutover because that would restore
  static OneSignal loading and current registration of `/sw.js`.
- Commit 1 assets may remain inert. Their presence alone creates no registration
  or provider request.

### Prepared privacy-safe emergency patch

Before any production approval, prepare and validate a patch that:

1. keeps the static OneSignal page-SDK tag absent;
2. keeps current registration on `/pwa-sw.js` at `/`;
3. removes or disables the consent-time SDK loader and push controls;
4. leaves `/sw.js` and both compatibility worker files available;
5. updates `pwa-sw.js` at the same URL to a minimal network-pass-through worker
   if app caching is the defect;
6. advances `CACHE_NAME` to highest-ever-shipped plus one if caching remains;
7. creates no new worker path or scope; and
8. states plainly that push is temporarily unavailable on the affected build.

This is the rollback for a cutover defect. Re-registering `/sw.js`, restoring
the old head script, or loading the dedicated worker before consent is not a
rollback; it is a privacy regression and requires a new Commander ruling.

## Preview and release order

1. Apply the three commits only after exact clone-implementation approval.
2. Run the full validation gate after the cache decision and all edits.
3. Run deterministic local tests with OneSignal blocked.
4. Stop for separate provider-account and hosted-clone validation approval.
5. Dean publishes the branch to the separate Netlify clone.
6. Run the synthetic cohort matrix against the clone and separate OneSignal
   app.
7. Obtain accessibility, privacy/legal, PAO, validation, and Commander review.
8. Prepare the privacy-safe emergency patch and prove its cache sequence.
9. Stop for a separate production merge/deploy decision.

Preview call: **PREVIEW REQUIRED** for implementation. It changes app startup,
offline control, push consent, worker scope, notification delivery, and
member-facing copy. This packet itself is documentation-only and does not need
a preview.

## Claim-release ledger

| Candidate claim | Current verdict | Release condition |
|---|---|---|
| `On browsers using the new app worker, Transition Ops loads OneSignal only after you choose push alerts.` | UNVERIFIED target | New and migrated runtime cases, provider/account evidence, privacy/legal, PAO, and Dean approval |
| `You can decline push and keep using the rest of Transition Ops.` | UNVERIFIED target | Decline and core-function regression pass |
| `Turning off alerts stops future OneSignal push processing on this browser.` | UNVERIFIED target | Opt-out, consent-revoke, worker-unregister, reload, and provider-state tests pass |
| `Turning off alerts deletes OneSignal records.` | CONTRADICTED/unsupported | Do not release; provider deletion is separate |
| `OneSignal never contacts a browser before consent.` | CONTRADICTED during legacy interval | Withhold until legacy retirement and full universal-language gate |

## Separate approvals still required

1. Clone implementation with decisions 1-3 resolved and the exact file packet
   accepted.
2. Creation/configuration or inspection of a clone-specific OneSignal app.
3. Final member consent and status copy.
4. Hosted clone publication and synthetic runtime/provider testing.
5. Privacy/legal disposition.
6. Staging and commit authority if not included in the implementation order.
7. Production merge/deployment.
8. Legacy retirement after sunset.
9. Any universal pre-consent claim.

Recommended next authorization, using the recommended defaults:

`APPROVE SW-PRIVACY-01 CLONE IMPLEMENTATION v1.0 - TAG MODE EXACT DAY; PUSH FEATURE GATE OFF; NO PRODUCTION APP ID; SEPARATE CLONE ONESIGNAL APP REQUIRED; PRIVACY CONTACT dean@veteranbridgesolutions.com; APPLY COMMITS 1-3; VALIDATE LOCALLY; STAGE ONLY; NO PROVIDER ACTION, PUSH, MERGE, DEPLOY, OR PRODUCTION CHANGE`

If broad-band timing is selected, replace `TAG MODE EXACT DAY` with
`TAG MODE BROAD BAND` and accept that date-specific push timing is not promised.

## Primary technical references

- OneSignal, service-worker paths, scopes, PWA separation, and migration:
  https://documentation.onesignal.com/docs/en/onesignal-service-worker
- OneSignal Web SDK v16 consent, permission, opt-in, and opt-out methods:
  https://documentation.onesignal.com/docs/en/web-sdk-reference
- OneSignal permission-prompt controls:
  https://documentation.onesignal.com/docs/en/permission-requests
- OneSignal personal-data and withdrawal guidance:
  https://documentation.onesignal.com/docs/en/handling-personal-data
- Service Worker registration and same-scope update behavior:
  https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register

Documentation establishes available behavior, not Transition Ops account or
runtime state. Account and runtime findings remain independently required.
