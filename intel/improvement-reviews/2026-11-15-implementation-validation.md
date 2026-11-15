EDIT MODE. Candidate tests performed against the approved return-review update.

Initial candidate status for final validation:

```text
 M index.html
 M scripts/first-visit-journey-browser-regression.js
 M scripts/policy-content-regression.js
 M scripts/reminder-count-regression.js
?? intel/improvement-reviews/2026-11-15-implementation.md
?? scripts/member-return-browser-regression.js
```

## Artifact and conditions

- Base: `a78cfb3a509a4bd856d634258f6871f8f3a9b9e8` (published PR #242, cache 339).
- Branch: `codex/member-return-20261115` in an isolated checkout.
- Final app SHA-256: `539055571811e6930ebddc934c9cc071c0b43a467911385f37014e726b32d0c1`.
- macOS 26.5.2 (25F84), Node 24.18.1; installed Chrome 157.0.8103.52. Browser fixtures use fresh isolated profiles, local servers, synthetic data and blocked external requests. Existing local dependencies reused; no package download or paid provider call.
- This is laboratory and synthetic evidence. No field performance, first-time member success rate, sharing conversion or return rate was measured.
- Full output is retained in [implementation evidence](2026-11-15-implementation-evidence/). Each command below completed with exit 0 on the final app bytes.

## Required gates

| Command | Final result |
| --- | --- |
| `npm run test:openai-migration` | PASS. Existing grounding, transport, privacy, spend and local DOCX-rendering regressions retained. |
| `npm run test:sw-privacy` | PASS. Worker privacy and exact public-build boundary retained. |
| `npm run test:privacy-network` | PASS. Fresh/migrated synthetic browser flows retained; provider requests blocked. |
| `npm run test:runtime-ai-spend` | PASS. Stubbed accounting and call-boundary suite; zero paid provider calls. |
| `npm run test:accessibility-release` | LOCAL AUTOMATION PASS. Required twelve viewport/orientation/zoom scenarios, keyboard and dialog checks. |
| `npm run test:policy-content` | PASS, 205 assertions and 1,110 parity vectors. |

Actual final output excerpts:

```text
PASS: synthetic RDM-1..RDM-263 integration paths; all prior grounding, DOCX, federal, adaptive-length, guarded-stage, transport, browser-only civilian header, and federal hosted-preparation fixtures verified locally
SW-PRIVACY REGRESSION PASS
PRIVACY-NETWORK REGRESSION PASS
PASS rendered automation has no uncaught browser exceptions
PASS rendered app attempts no external provider network
NETWORK target external attempts=0; blocking proxy contacts=299
SCOPE local browser automation only; manual assistive-technology and hosted release acceptance remain untested
LOCAL AUTOMATION PASS
Policy content regression: PASS (205 assertions; 1110 parity vectors)
```

## Targeted regressions

| Command | Final result |
| --- | --- |
| `node scripts/member-return-browser-regression.js` | PASS. New four-change coverage, including no/invalid date, unsupported profile, due/stale/completed reminders, ZIP-only search, exact saved-job continuation, custom-step precedence, completed-job exclusion, generic share URL, failed saves and both mobile themes. |
| `node scripts/reminder-count-regression.js` | PASS. Real completion, matching count/list, full-library access, saved follow-up after its window, return focus, invalid dates and profile context. |
| `node scripts/first-visit-journey-browser-regression.js` | PASS. Twelve mobile/theme/situation journeys; direct search entry, optional experience/exploration, saved work, conflict recovery, browser Back and zero provider POSTs. |
| `node scripts/my-jobs-backup-regression.js` | PASS. Exact backup/restore, provenance, corruption/quota/stale-write protections and unrelated data preservation. |
| `node scripts/my-jobs-application-review-browser-regression.js` | PASS. Job identity, protected task handoff, source context, replacement/cancel and unrelated message preservation. |

Existing fixtures changed only to reflect the intended behavior: welcome now exposes the role/area form before optional exploration; reminder count uses the same real profile/date helper as the UI. The policy fixture now counts the one additional neutral-title mapping and one additional fixed Career share invocation, with explicit assertions for both. Earlier date-window, policy-source and share-privacy assertions remain intact.

One isolated reminder-browser startup failed with an invalid debugging port; no app assertion ran in that attempt. A standalone rerun passed, followed by the final frozen-artifact run above. An initial default-execution attempt could not start a local server; authorized local-only test execution resolved that environment restriction.

## Structure and scope

```text
INLINE JS 1 lines 6-12, 246 bytes PASS
INLINE JS 2 lines 23-50, 1336 bytes PASS
INLINE JSON 3 lines 83-139, 2276 bytes PASS
INLINE JS 4 lines 987-20206, 1700544 bytes PASS
ADDED ENCODING PASS
STRUCTURE PASS: 4 inline, 199 JS, 322 JSON; 6 YAML inventory
```

All tracked JavaScript/JSON plus the intended new regression script parsed. Added-line encoding and `git diff --check` passed. Workflow/schema and Netlify package gates are not triggered: no workflow, configuration, package, worker, function or spend implementation changed. The build owner recorded per-edit presence/absence counts and reviewed the app diff. Changes to test fixtures were reviewed by the builder before commit.

## Limits and baseline defects

- Accessibility verdict is **LOCAL AUTOMATION PASS**, not hosted release clearance. Safari/VoiceOver, Chrome/NVDA, Edge/JAWS and Android/TalkBack manual rows remain PENDING. Parent visual observations are recorded separately in the implementation record.
- The unchanged `my-jobs-browser-regression.js` fails on untouched `a78cfb3a` at the removed `Return to my draft` control. That baseline reproduction is retained; it is not treated as a new app defect or silently suppressed. The current main build-loop record also reports older Career selector failures. This was a bounded affected-flow validation, not a claim that all 124 historical scripts pass.
- No actual device installation, native share-sheet completion, hosted preview acceptance or production deployment was performed by this validation task. No member data, accounts, telemetry, schedule or J1/S2 changes were made.
- No skill or registry changes. No retention claim is supported by these tests.
