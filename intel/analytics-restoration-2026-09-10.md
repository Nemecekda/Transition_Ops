# Google Analytics restoration - 2026-09-10

Authority: Dean requested "restore it now" after the missing Google tag was diagnosed. This narrowly replaces the prior zero-GA state; Kit removal, production push OFF, and Resume protections remain in force. No skill or registry change.

Branch: `codex/restore-google-analytics`; isolated worktree `/private/tmp/tops-ga-restore-20260910`, based on refreshed published main `b863083ceee96f8a88231213aaf0d7a78fa3849a`. Shared checkout untracked work was preserved. No merge, push, or production publication performed by this implementation task.

## Change and privacy boundary

One asynchronous Google tag for `G-RE7CRR2ZBB`, top-level HTTPS production root/index only. Explicit page view has fixed canonical location, fixed title, empty referrer; existing custom event callsites remain inert. Preview, local, and iframe contexts do not load the tag. Ads consent denied; Google signals and ad personalization disabled. No form, search, Resume, or member-derived parameters are supplied. Google still receives browser/device/network metadata and uses analytics cookies; no anonymity claim is made.

About notice added with PAO review: "Transition OPS uses Google Analytics to measure site visits. Google uses cookies and receives page-view information, browser and device details, and network request metadata."

`pwa-sw.js` cache v159 -> v160. Read-only live fetch and all-ref worker history both showed highest v159 before edit. Other worker bytes, install behavior, JOBS_LIVE, functions, dependencies, and vendored React are unchanged. PRODUCTION PUSH: OFF; dedicated worker dormant; legacy exception preserved. Existing new/migrated privacy tests retain zero OneSignal/Kit requests.

## Account and provider evidence

ACCOUNT-VERIFIED by parent agent in the authorized Google Analytics UI on 2026-09-10 before 13:27 UTC: account391851707, property533627814, stream14393253380, Transition OPS Production, `G-RE7CRR2ZBB`. Enhanced measurement master switched OFF and verified, leaving standard page views. Google tag user-provided data capabilities master switched OFF, saved, and verified persisted on reopening. No connected site tags (0). Account tag `GT-PLTT3GCW`, configuration account6350595697/container249819852. Account setting drift or SDK changes require retesting.

PROVIDER-DOCUMENTED (checked by parent 2026-09-10):

- https://developers.google.com/analytics/devguides/collection/ga4/reference/config
- https://support.google.com/analytics/answer/9216061?hl=en
- https://developers.google.com/analytics/devguides/collection/ga4/views?hl=en

Retention, account access/deletion policies, legal compliance, and production ingestion are not established by these local tests. Notice makes no promises about them. Production ingestion belongs to post-publication verification.

## Validation evidence

EDIT MODE, initial porcelain:

```text
 M index.html
 M pwa-sw.js
 M scripts/privacy-network-regression.js
```

Discrete apply_patch edits and per-edit counts: bootstrap 1; notice 1; new v160 declaration 1 / old v159 declaration 0; bounded GA source assertion 1 / old zero-GA assertion 0; analytics runtime function 1. Diff hunks reviewed before commit. `git diff --check` exit 0; added curly quotes/NBSP scan empty. All tracked JS/MJS parsed; all tracked JSON parsed; all six tracked YAML parsed. Inline JS blocks: line16 1336 bytes, line468 913135 bytes; JSON-LD 2276 bytes. Structural parse PASS. Workflow schema and function packaging gates N/A: no workflow, package, config, or function changes.

Actual test output excerpts:

```text
SW-PRIVACY REGRESSION PASS
PASS analytics disabled on http://localhost
PASS analytics disabled on https://preview.netlify.app
PASS production loads one Google tag and leaves custom events inert
PASS one explicit page view contains only canonical location, empty referrer, and fixed title
PASS analytics queue excludes synthetic URL, campaign, title, referrer, and form values
PASS real Google SDK attempted collection (all requests blocked)
PASS Google transport excludes synthetic sensitive values
PASS Google transport uses canonical location, fixed title, and empty referrer
PASS Google transport contains no form, search, or custom events
PASS analytics disabled inside iframe
RUNTIME NEW: 14 local/browser requests observed; provider count 0
RUNTIME MIGRATED: 16 local/browser requests observed; provider count 0
PRIVACY-NETWORK REGRESSION PASS
LOCAL AUTOMATION PASS
PASS: synthetic RDM-1..RDM-263 integration paths; all prior grounding, DOCX, federal, adaptive-length, guarded-stage, transport, browser-only civilian header, and federal hosted-preparation fixtures verified locally
```

`test:runtime-ai-spend` PASS; includes RSG-15 through RSG-25 diagnostic-origin coverage, concurrent accounting, exact byte limits and stubbed provider boundaries. `test:openai-migration`, `test:sw-privacy`, `test:privacy-network`, `test:runtime-ai-spend`, and `test:accessibility-release` completed successfully. Local accessibility only; manual AT/hosted acceptance untested.

Real SDK downloaded separately from the official public tag endpoint and supplied as `TOPS_GA_SDK_FILE=/private/tmp/tops-ga-sdk.js`. SHA256 `ac5fb8f850b4ae9febd761928788cf09e43f725a5e6c5cfe72953312e2f3081b`. Test runs a synthetic page using the exact app bootstrap on a locally fulfilled production origin. Every other request is intercepted/aborted and a blocking proxy prevents network escape. Synthetic URL, UTM source/campaign/term, gclid, fragment, external referrer, title, email, search and history values excluded from captured collection URL/body/headers. Page-view payload contained `dl=https://transitionops.org/`, `dt=Transition OPS`, empty `dr`, `en=page_view`, `npa=1`, `ngs=1`, `pscdl=denied`. No synthetic member data was sent to Google. A separate run without SDK file proves bootstrap/render continuation when the tag is blocked.

Full local logs: `/private/tmp/tops-ga-{openai,sw,privacy,privacy-blocked,spend,a11y}.log`. Initial dependency/sandbox failures were resolved with locked `npm ci --ignore-scripts` in the isolated worktree and authorized local-browser permissions, then tests rerun. No application failure was waived.

Next action: parent handles authorized publication and verifies live v160 plus real GA ingestion. Preview warranted for changed app behavior and About notice; preview itself intentionally sends no Analytics traffic.
