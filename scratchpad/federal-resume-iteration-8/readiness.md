# Iteration 8 - preserve supported words across hyphens

Date: 2026-09-07. Branch codex/federal-resume-readiness. Parent 9f3903467d3407b8b31f4185f18430a9f30773d2. Continuing Dean approval covers these related fixes; no major skill addition. EDIT mode began with `?? scratchpad/federal-hosted-9f39034/` and no application changes.

Selected defect before the runtime edit: the deterministic posting-reference matcher rejects `Tracked work-orders.` when the cited fact says `Tracked work orders.`, and also rejects the reverse direction. Expected movement: twelve false withholds become releases, with the four existing civilian-translation controls remaining released and unsupported claims still withheld. Candidate content must not be rewritten.

## Result

| Measure | Parent | Final local |
| --- | --- | --- |
| Supported space/hyphen cases released | 4/16 | 16/16 |
| Posting-only named tool controls withheld | 8/8 | 8/8 |
| Added unsupported duty controls withheld | 6/6 | 6/6 |
| Short-prefix meaning-change controls | Original matcher rejects both tested forms | 12/12 handler cases withheld; direct parent/current rejection verified |
| Calls per tested draft | Two stubbed calls | Two; no retry |
| Released candidate and trace | Existing exact-byte contract | Original candidate spelling retained in body and trace |
| Existing diagnostic-origin cases | 12/12 plus release/malformed controls | Retained and PASS |
| Full required local suites | Existing gates | All five PASS |
| Actual DOCX rendering / Netlify packaging | Existing boundaries | PASS |
| Hosted federal release | 9f39034 FAILED | Pending on a fresh candidate |

The final change adds a selective split before the existing stemming and filtering. A compound is split only when every component has at least three letters. `work-orders` therefore compares as the same words as `work orders`. Compounds containing short components, such as `un-paid`, `de-icing`, `X-ray`, `e-mail`, and `end-to-end`, keep the original treatment. The underlying text, identity fields and rendered candidate are never normalized by this helper.

This lexical check is not proof of semantic grounding. All existing same-role references, model review, identity, numeric, trace and quality gates remain required. The change adds no synonym inference or automatic approval for a model FAIL.

## Fail-loud record

The baseline matrix executed against unchanged runtime code and recorded all sixteen results: twelve false HTTP 422 responses and four HTTP 200 controls. It then failed the expected release assertion. `iteration-8-baseline-openai.txt` preserves that result.

An initial broader tokenizer passed the existing suite and the first new cases. Before commit, additional short-prefix controls demonstrated an unsafe regression: `un-paid work` could match `paid work`, and `de-icing` could match `icing`. All twelve HTTP 200 counterexamples are preserved in `iteration-8-prefix-counterexample.txt`. That broad implementation was not committed. The final selective split restores the parent's short-prefix treatment, and all forty-two added handler cases pass. The earlier successful run is retained as intermediate evidence, not the final verdict.

Final evidence is `iteration-8-openai-final.txt`, plus SW, privacy, spend, accessibility, package, scope and structural files. Provider responses are stubbed locally. Browser privacy/accessibility checks suppress external providers. Word verification includes actual LibreOffice rendering of the existing DOCX fixtures; it is not evidence of a released hosted federal artifact.

Each old-string edit asserted exactly one occurrence before writing and checked expected post-edit counts. The reviewed scripts are included. The scope check uses the actual parent and current functions and proves every other runtime byte unchanged. No source/test edit followed the final successful suites.

## Scope and handoff

Generation and audit prompts, response schema, fixed diagnostic codes, release predicates outside this token comparison, call graph, models, caps, retries, privacy/logging/storage, civilian formatting/export, Navigator, dependencies, Netlify configuration, policy and rung content are unchanged. The public app and worker files retain their hashes. No precached asset changed; active cache stays transition-ops-v152. No skill or registry addition.

The 9f39034 hosted run proved the deterministic matcher blocked the draft. It did not expose the disputed candidate or cited facts. The local hyphen defect is real and occurs in that same matcher; it remains a hypothesis for the exact historical failure. Do not mark the earlier failed run passed or claim its root cause conclusively established.

PREVIEW WARRANTED. Dean pushes this local commit to codex/federal-resume-readiness and PR #59, base ops/openai-parallel-clone. Verify the fresh immutable commit/tree/deploy and run the existing bounded synthetic federal acceptance once. Do not retry the failed candidate. Federal artifact, phone, manual accessibility and production acceptance remain pending. No agent push, merge or new live request followed the failed hosted test.
