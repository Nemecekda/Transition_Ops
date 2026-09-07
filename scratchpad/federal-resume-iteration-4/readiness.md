# Federal Resume readiness - iteration 4

Date: 2026-09-07. Branch: codex/federal-resume-readiness. Parent: c40625c5161491195f3c75a182939372355c6edd. PR #59 base: ops/openai-parallel-clone. Dean explicitly approved the previously prepared two-line shared quantity-comparison patch with "approved".

LOCAL GATE PASS. The reproduced punctuation bypass is closed. Fresh hosted federal acceptance and manual accessibility remain PENDING. Historical hosted failures remain failures, and this report does not approve production release.

## Defect and result

The tokenizer preserves a trailing period or comma in some numeric tokens. A global education claim ending in `2020.` could cite a role-owned date containing `2020` without triggering the ownership check. The approved fix removes terminal periods/commas only from comparison values in validateAudit. It changes neither raw tokens nor source, candidate, trace, or exported text.

| Measure | Before | After |
| --- | --- | --- |
| Period-ended education claim incorrectly citing a role date | Actual handler HTTP 200; incorrect draft released despite expected 502 | Same fixture HTTP 502; no draft, empty scorecard, content-free ownership blocker |
| Period/comma shared ownership through both formats | Newly added coverage; no retroactive baseline score | 16/16 actual-handler cases: eight unsafe references withheld, eight explicitly attributed claims retained |
| Existing eight federal ownership fixtures | Passed only with unpunctuated education year | 8/8 with the period restored, including redundant/wrong-role reference rejection |
| Numeric comparison isolation | Newly added coverage | 15/15 actual-validator cases: periods/commas ignored only at token end; decimals, grouping, currency, percent and plus remain distinct |
| Required local suites | Baseline counterexample intentionally fails | All five pass after the final app/test edit |
| Calls in targeted handler fixtures | Existing generation plus audit | Exactly two stubbed calls, zero retries |
| Hosted federal generation/download | Historical 3347fb6 preview failed and stopped | No live request on this local candidate; fresh immutable preview required |

Provider responses were stubbed. The actual handler, inventory and reference validator executed. The direct comparison fixtures exercise actual extracted validator functions with synthetic score/trace inputs; they do not prove semantic support for different quantities. No hosted model quality, live provider behavior, or manual phone acceptance is inferred from those fixtures.

## Verification

The original failing output is preserved as iteration-4-baseline-openai.txt: exit 1, `education year cites role date`, actual 200 versus expected 502. After the approved fix, the complete OpenAI regression exits 0 with the same expectation, plus all added cases. No expectation was weakened.

The remaining required suites each exited 0: service-worker/privacy, browser privacy/network, runtime AI spending, and browser accessibility. OpenAI regression includes actual LibreOffice DOCX rendering, page/content checks and prior civilian/federal fixtures. Accessibility automation reports zero uncaught browser exceptions and zero external provider attempts; manual assistive technology remains untested.

Actual Netlify packaging passed using installed CLI 26.1.0 and packager 14.7.1. Both AI functions include and resolve OpenAI 7.8.0, Blobs 10.7.13, OTel 6.0.6 and runtime-utils 2.3.0; jobs excludes all four. No dependency installation or provider construction was performed by the package smoke check.

Structural parsing before evidence staging passed 24 tracked JavaScript modules/scripts, 18 JSON files, six YAML files, one inline JavaScript block and one JSON-LD block. The new manifest is parsed and all staged files checked before commit. Original command outputs and byte/SHA-256 records are in manifest.json. No gate failure occurred after the app/test fix. The initial failure was the intentional pre-fix reproduction, not a grep assertion failure.

## Scope and edit discipline

Every replacement was prechecked for exactly one old_str. The baseline test replacement and approved application replacement each ended old=0/new=1. The added test block's insertion anchor remained once and the inserted block occurs once. The implementation equals parent c40625c plus precisely the approved two-line replacement; source/test hunks were reviewed.

Both modes share this validator, so both receive the ownership correction. Civilian and federal generation prompts, extraction/eligibility, canonical sections, browser header, dates, formatting/export, models, request/response limits, retries, privacy, spending, notifications and dependencies remain unchanged from the parent. Federal prompt SHA-256 remains 726e8f5bec24bd629730986f7cd9f9f62e1f6c30c11ade1078805e2141ba5313. Protected-file hashes are recorded in iteration-4-scope.txt.

No precached asset changed; no cache bump. Active cache remains transition-ops-v152. No policy text change or new dependency. No BLOCKED-POLICY item. The iteration-3 punctuation BLOCKED-TECHNICAL item is resolved locally by this approval and fix; fresh hosted federal acceptance remains outstanding.

## Handoff

PREVIEW WARRANTED. Dean should push codex/federal-resume-readiness to update existing PR #59. The current remote at 3347fb6 lacks both local fixes, iteration 3 and iteration 4. Keep the base ops/openai-parallel-clone. Main is not the merge target for this step.

After that push, bind testing to the fresh deploy's exact commit, tree, site and immutable deploy ID. Follow the existing six-role fictional fixture and federal acceptance procedure in federal-resume-readiness-handoff.md: one facts activation, one federal draft activation, at most the existing optional repair, maximum four provider calls, no repeat generation to seek PASS. Confirm known identities/dates, role ownership, missing fields, posting isolation and all ten dimensions. On release, inspect the actual downloaded federal artifact on desktop and Dean's phone. On failure, stop and withhold export.

This fixes a local comparison weakness; it does not establish the cause of every previous hosted review failure or prove the next hosted run will pass. Hosted federal and manual accessibility rows remain individually PENDING. The existing civilian phone download is separate evidence.

Nothing was pushed, merged or deployed by the agent. Main and origin/main remain d82516389ed5906febad467cfe57887acda97053. The shared checkout, its release scratch files and four stashes were preserved. Dean owns push, merge and production release. The enclosing commit records this iteration; no commit hash is invented inside its own contents.
