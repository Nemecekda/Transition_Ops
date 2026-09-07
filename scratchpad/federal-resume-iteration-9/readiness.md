# Iteration 9 - canonical provider fact-section headings

Date: 2026-09-07. Parent 964a93e7712e2b89075cbad803fac583503f04de. Branch codex/federal-resume-readiness. Continuing Dean approval covers the related fix; no major skill addition. EDIT mode began with only `?? scratchpad/federal-hosted-964a93e/` and no application changes.

Selected before editing: the actual hosted fact sheet preserves every tested fact but uses two bare section headers that the closed parser rejects. Expected movement: warning-free extraction cases 0/16 to 16/16, with exact payloads, existing malformed-input withholding and current call limits preserved.

| Measure | Parent | Final local |
| --- | --- | --- |
| Actual hosted sheet: structural warnings | 2 | 0 after only two label corrections |
| Supported provider heading cases, both modes and initial/repair paths | 0/16 warning-free | 16/16 warning-free |
| Initial extraction calls for these aliases | 2 stubbed calls | 1; redundant repair avoided |
| Cases requiring a separate structural repair | 2 stubbed calls | 2; no extra retry |
| Malformed extracted sheets | 16/16 remain marked with warnings | 16/16; exact original text retained |
| Malformed direct draft submissions | 16/16 HTTP 400, zero provider calls | 16/16 unchanged |
| Invented-number extraction controls | 2/2 withheld | 2/2 withheld before repair |
| Bare-header direct draft submissions | 2/2 HTTP 400, zero provider calls | 2/2 unchanged |
| Required local suites | Existing gates | All five PASS |
| Actual Word rendering and function packaging | Existing boundaries | PASS |
| Hosted federal release | 964a93e FAILED at fact structure | Pending on a fresh candidate |

The new helper applies only to initial or repaired provider extraction output, before the existing number and fact checks. It recognizes exactly bare uppercase EDUCATION or CERTIFICATIONS followed immediately by the matching numbered item 1. It substitutes only the canonical field label. The complete resulting sheet must pass the existing fact checks or the original text is returned unchanged. Payloads, numbering, order and CRLF bytes are preserved. This is not permission to split or normalize member facts or to infer missing fields.

The confirmed-fact parser is unchanged: a malformed direct draft request still stops before every provider call. Generation, audit, trace, numeric ownership, identity, posting checks and all release decisions remain unchanged. The canonical result passes even the unmodified parent parser. The fixture tests replay the actual synthetic hosted fact sheet across both modes, both paths, each individual header and CRLF variants; they do not rely on a prompt-text assertion alone.

## Fail-loud evidence

The first baseline test had a fixture expectation error: its unknown numeric label was rejected by the number guard with HTTP 502 before the intended structural-warning path. That result is preserved in iteration-9-baseline-openai.txt. The negative fixture was changed to an empty known item to isolate the grammar check; the runtime remained unchanged. The completed baseline then recorded all sixteen positive cases with warnings and failed the expected 0-versus-16 assertion in iteration-9-baseline-openai-final.txt.

After the runtime fix, all sixteen new positive cases and all thirty-six negative handler checks passed. The first full run then encountered the known sandbox Chrome SIGABRT during Word/browser rendering; iteration-9-openai.txt preserves it. The unchanged suite passed with approved browser execution in iteration-9-openai-final.txt. No failed local or hosted result is relabeled as PASS.

Each source/test edit pre-counted its exact old string as one, checked the new and old post-counts, and displayed the edit script before execution. All edit assertions passed. Full application/test hunks were reviewed. Final evidence includes OpenAI, SW, browser privacy, spend, accessibility, function packaging, scope and structural checks. No application or test edit followed the successful final suites.

## Handoff and scope

PREVIEW WARRANTED. Dean pushes the next local commit to codex/federal-resume-readiness, PR #59, base ops/openai-parallel-clone. Verify its immutable deployment and run the existing bounded fictional acceptance once. Stop immediately if extraction returns unresolved warnings. Only after exact, warning-free facts may the single federal draft activation proceed. At most one structural repair and four provider calls; no retry seeking a PASS. Actual provider counts require evidence, not inference from browser diagnostics.

No public UI wording, benefits/rung content, generation or audit prompt, model, output/input cap, transport, privacy logging/storage, civilian formatting/export, Navigator, dependency, configuration or skill changed. Active cache stays transition-ops-v152 because no precached asset changed. All runtime bytes outside the helper and two extraction call sites match the parent.

The former posting-reference failure is still historically unresolved at the exact-claim level. This iteration addresses the later, directly reproduced fact-heading failure. Federal artifact, phone, manual assistive-technology and production acceptance remain pending. Nothing was pushed or merged by the agent; Dean owns merge and release.
