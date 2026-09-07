# Iteration 7 - distinguish posting-blocker origins

Date: 2026-09-07. Branch codex/federal-resume-readiness; parent fbf099617f5388e6100b83cace29841b6ba99071. Dean's continuing approval covers related repairs without a new approval unless a major skill is added. No new skill, dependency or policy change.

EDIT mode. Initial porcelain: `?? scratchpad/federal-hosted-fbf0996/`. The existing hosted evidence belongs to this same task and is retained in this iteration.

Selected defect before editing: the AI review and the deterministic posting-reference check emitted the same message and deduplication hid a dual failure. Expected movement: one indistinguishable failure signature becomes three distinct signatures (AI, deterministic, both), with all HTTP release/withhold decisions and provider call counts unchanged. This is a diagnostic repair, not resolution of the withheld hosted draft.

## Executed evidence

| Check | Before | After |
| --- | --- | --- |
| Distinguishable posting-failure signatures | 1 | 3 |
| 12 withheld cases: three origins x two transforms x two modes | All HTTP 422; origin indistinguishable | All HTTP 422; exact expected origins visible |
| Valid release controls | 2/2 HTTP 200 | 2/2 HTTP 200 |
| Malformed review controls | 2/2 HTTP 502 | 2/2 HTTP 502 |
| Draft and trace on withheld response | Neither released | Neither released |
| Ten-dimension scorecard | Eight PASS, two NEEDS MEMBER FACT in fixture | Same ten rows/statuses |
| Calls per fixture | Two stubbed calls, no retry | Two stubbed calls, no retry |
| Private marker and claim/reference content in failure | Absent | Absent |
| Full OpenAI integration and actual LibreOffice DOCX render | Existing gate | PASS |
| SW/public-build, browser privacy, runtime spend, browser accessibility suites | Existing gates | All PASS |
| Netlify packaging | Existing boundary | PASS; exact locked packages and jobs exclusion |
| Hosted federal release | fbf0996 FAILED | Unresolved; no live retest of this patch |

The baseline ran the new test matrix against unchanged runtime code. All failure/control HTTP and call-count assertions passed, then the expected origin assertion failed. The preserved baseline contains all twelve observed origin cases. No baseline failure is hidden or reclassified. After the two-line runtime replacement, the same assertions and the full suite passed. No fixture correction or runtime follow-up was needed.

`[audit_posting_only_claim]` identifies the model's existing allowlisted posting blocker. `[posting_reference_mismatch]` identifies the existing deterministic check. Both prefixes are fixed strings; neither embeds a claim, fact, posting term, identifier, provider detail or token detail. Existing member-safe message text remains after each prefix. Both appear when both checks fire. Unknown blocker strings still fail safely without echoing the supplied value. No new response property or seventh transport-diagnostic field was added.

The labels identify which check blocked release; they do not prove that the check's conclusion is correct. They do not identify a particular disputed claim. Root-cause analysis may still need further local evidence. A model PASS in another row cannot override a blocker.

## Scope and verification limits

The scope script compares every runtime byte to the parent: only blocker presentation differs. Both blocker predicates, semantic term matching, complete trace/reference checks, score rules, all prompts, extraction, generation, all models/caps, retries, privacy, storage, logging and function call graph are byte-identical. The client, civilian generation/format/export, Navigator, shared OpenAI controls, package files, Netlify settings and both workers retain their recorded hashes. The existing blocked-response display shows the fixed prefixes. No precached asset changed; active cache remains transition-ops-v152.

All local provider responses are stubbed. The suite includes actual local browser checks and actual LibreOffice rendering of the existing DOCX fixtures; it does not produce a hosted federal artifact. Both browser suites reported zero external provider attempts. Manual assistive technology and device acceptance remain pending.

Scripts shown before execution asserted one exact old-string match for each replacement, with expected post-edit counts; insertions retained exactly one anchor. All counts passed. Structural parsing and added-line encoding/whitespace checks are recorded separately. The runtime and test diff were reviewed before commit.

## Hosted run and next action

See ../federal-hosted-fbf0996/acceptance.md. That fresh immutable run used one facts activation and one draft activation. Fact fidelity passed; drafting returned HTTP 422 with one ambiguous posting warning. The failed candidate was neither retried nor exported. Actual provider count is UNVERIFIED; browser request counts are not proof of provider counts. No claim is made that the warning was false.

PREVIEW WARRANTED. Dean pushes this local commit on codex/federal-resume-readiness to PR #59, whose base stays ops/openai-parallel-clone. Verify the next immutable commit/tree/deploy before one bounded synthetic federal acceptance attempt. Keep the old failed deploy terminal. Do not merge main or publish production based on this diagnostic-only local PASS. No agent push or merge occurred. The shared checkout's existing work and stashes remain preserved.
