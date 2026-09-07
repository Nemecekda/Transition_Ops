# Federal Resume readiness loop - 2026-09-07

Dean approved both federal-only fixes by replying "lets keep going" to the two-fix proposal. Base: 7948cac172529e0a2c07b7ee0882b86dfd9cf9d2. Branch: codex/federal-resume-readiness. No push or main merge is authorized.

| Iteration | Defect | Files | Observable result | Verdict |
| --- | --- | --- | --- | --- |
| 1 | MISSING in metadata labels excluded confirmed federal dates and locations | netlify/functions/resume.mjs; scripts/openai-migration-regression.js | Six-role fixture: known metadata admitted 0/12 -> 12/12; missing/malformed/global/unlinked exclusions retained; actual handler sends identical generation/audit metadata; stubbed draft HTTP 200 with two calls | LOCAL PASS |
| 2 | Federal writer requested TIP content that review rejected; missing-field instructions conflicted | netlify/functions/resume.mjs; scripts/openai-migration-regression.js; readiness records/evidence | TIP-producing directives 2 -> 0; real request instructions verified; honest missing-field fixture HTTP 200 with structured gaps; four simulated audit failures produce HTTP 422 and no draft; two calls per draft, no retries | LOCAL PASS after approved resume |
| 3 | Federal generation omitted explicit global quantity ownership rule | netlify/functions/resume.mjs; scripts/openai-migration-regression.js; hosted/iteration evidence | Explicit rule absent -> present in real requests; 8/8 exact-token ownership cases; five local suites pass | APPROVED FIX LOCAL PASS; separate punctuation counterexample BLOCKED-TECHNICAL; hosted pending |
| 4 | Terminal period/comma bypassed shared numeric ownership comparison | netlify/functions/resume.mjs; scripts/openai-migration-regression.js; readiness/evidence records | Original education counterexample HTTP 200 -> 502; 16/16 both-mode handler cases, 15/15 comparison cases, prior 8/8 federal fixtures, all five local suites pass | APPROVED FIX LOCAL PASS; punctuation blocker resolved locally; fresh hosted/manual acceptance pending |
| 5 | Extraction released numbers absent from member source, including invented tenure | resume.mjs; OpenAI regression; hosted/iteration evidence | Counterexample HTTP 200 -> 502; 40/40 extraction cases; all five local suites and packaging pass | LOCAL PASS; multiline catalog fix next; hosted/manual pending |
| 6 | Multiline NUMBERS AND SCALE bypassed ownership classification | resume.mjs; OpenAI regression; iteration evidence | Unassigned eligible 1 -> 0 in each mode; exact owned scale global -> R1; 16/16 handler cases and five local suites pass | LOCAL PASS; fresh hosted/manual acceptance pending |
| 7 | AI and deterministic posting blockers were indistinguishable | resume.mjs; OpenAI regression; hosted/iteration evidence | Distinguishable failure-origin signatures 1 -> 3; 12/12 withheld responses identified, 2/2 valid drafts release, 2/2 malformed reviews reject; all five local suites and packaging pass | DIAGNOSTIC FIX LOCAL PASS; hosted draft failure remains unresolved |
| 8 | Space/hyphen compounds caused false posting-reference mismatches | resume.mjs; OpenAI regression; hosted/iteration evidence | Supported cases released 4/16 -> 16/16; 26 negative cases withheld; all five local suites and packaging pass | LOCAL PASS; exact historical claim unresolved; fresh hosted/manual acceptance pending |
| 9 | Provider returned bare education/certification section labels rejected by the closed parser | resume.mjs; OpenAI regression; hosted/iteration evidence | Warning-free provider header cases 0/16 -> 16/16; 36 negative handler checks retained; five local suites and packaging pass | LOCAL PASS; fresh hosted/manual acceptance pending |
| 10 | Federal writer imposed prose expansion on sparse confirmed facts | resume.mjs; OpenAI regression; hosted/iteration evidence | Actual writer minimum-expansion directives 2 -> 0; 2 brief releases and 4 simulated withholds preserved; live effectiveness pending | LOCAL PASS; five final suites and packaging pass; hosted/manual pending |

Iteration 1 validation: all five Phase 1 suites passed (OpenAI migration with actual LibreOffice DOCX rendering, service worker/privacy, browser privacy/network, runtime AI spend, browser accessibility). Actual Netlify packaging passed with installed CLI 26.1.0 and packager 14.7.1: both AI functions resolve openai 7.8.0, @netlify/blobs 10.7.13, @netlify/otel 6.0.6, and @netlify/runtime-utils 2.3.0; jobs excludes those packages. Structural checks passed: 24 JavaScript modules/scripts, 15 JSON files, six YAML files, one inline JavaScript block, one inline JSON-LD block. Added-line encoding and whitespace checks passed. Each edit asserted one old match before writing and verified its replacement. Hunks reviewed before commit.

Environment notes: the initial copied dependency directory lacked an already-declared package. Reusing the existing complete locked installation resolved that environment failure, with no manifest/lockfile changes or new dependency. Default-sandbox Chrome exited SIGABRT; the approved browser execution passed. Neither environment failure is presented as the defect's baseline test. Provider calls were stubbed; external browser traffic was blocked. No live sends or hosted generation were performed in this iteration.

Civilian eligibility is compared directly with its previous behavior in the regression fixture. Civilian generation/formatting/export, Navigator, models, budgets, caps, retries, transport, notifications, index.html and service workers are unchanged. No precached asset changed; no cache bump is required.

Local success does not replace the failed federal hosted acceptance recorded for base 7948cac. A fresh preview and the existing federal acceptance matrix remain required after both fixes; manual assistive-technology acceptance remains pending.

## Iteration 2 completion

Dean explicitly resumed the assertion stop: "approved. keep going". The diagnostic edit then passed its exact-match checks. The exposed failure was the test expecting raw double-underscore placeholders even though the unchanged markdown normalizer removes a paired set on one line. The expected candidate now explicitly reflects that existing normalization; missing fields remain unfilled, and the audited candidate equals the released text. No formatter, validator, error handler, score computation, or civilian implementation was changed to obtain a PASS.

All five Phase 1 suites passed after the final source/test edit. The first accessibility run failed during Chrome startup with "Chrome wrote an invalid CDP port" and left its test browser running. That isolated test/browser was terminated; the unchanged suite passed when rerun alone. The first failure is retained as evidence, not hidden. Netlify packaging and structural checks then passed. Source comparison proves all Resume bytes outside the four approved federal change regions match base 7948cac; protected files also match their base hashes.

The two instructions to emit TIP are removed. Advice uses existing structured audit gaps and keywords. Confirmed dates/locations must remain exact; only truly missing fields can stay bracketed. Citizenship and preference placeholders contain no suggested factual value. This approved federal change supersedes only the old federal-prompt byte-freeze expectation in RDM-177/RDM-194; exact-output and operational-boundary tests remain. Prompt SHA-256 changed from 194fad7838fa064f0c18ac24b7ecfde0d6d1e04e3507a815dec630dc5a843b92 to 5099d2ca1bfde25d32560046cbae011e68babe592d62c765239efbc0e084580c. Behavioral request assertions supplement that identity check. Resume governance v0.25 and hosted RDM-258..263 remain PENDING.

Local tests use synthetic profiles and stubbed provider responses. The four negative fixtures prove that simulated audit failures still withhold the candidate, not that the hosted model will necessarily identify those failures. Fresh hosted evidence remains required. No policy candidate, new dependency, live send, push, main merge, or deployment was introduced. No precached asset changed; active worker remains transition-ops-v152.

## Iteration 3 completion

Dean approved the third federal-only fix with "fix and approved". See federal-resume-iteration-3/readiness.md for the full result, preserved failures, separate shared-comparison blocker, and unapplied next proposal. The prior hosted failure is recorded in federal-hosted-3347fb6/acceptance.md. No live retest or push occurred.

## Iteration 4 completion

Dean approved the previously prepared two-line shared comparison patch with "approved". It is now applied, tested in both formats and recorded in federal-resume-iteration-4/readiness.md. The original period-ended counterexample and its failing baseline are retained, and the expected withholding response now passes. No new application change followed the successful final suites. The earlier iteration records are historical; the punctuation blocker is resolved locally and fresh hosted/manual acceptance remains pending. No push or main merge occurred.

## Iteration 5 completion

Dean approved extraction and related fixes without repeated approval unless a major skill addition is needed. No major skill was added. See federal-resume-iteration-5/readiness.md for original failures, fixture repairs, scope proof and final verification. Historical hosted 1b6b586 failed and stopped at extraction; no draft or export. No agent push or main merge.

## Iteration 6 completion

The related multiline catalog defect is fixed under continuing approval. See federal-resume-iteration-6/readiness.md for original failure outputs, direct parent/current comparison and all final checks. Iterations 5 and 6 are local commits awaiting Dean's push for a fresh immutable preview. Hosted federal and manual acceptance remain pending; no live retry, push, merge or major skill addition.

## Iteration 7 completion

Dean pushed through fbf0996. Fresh hosted fact extraction passed; federal draft release failed and the run stopped. The origin ambiguity was reproduced locally with all three failure paths. The diagnostic-only fix preserves release decisions, every prompt, all ten score dimensions, privacy and call limits. No claim is made that it resolves the hosted posting failure. See federal-hosted-fbf0996/acceptance.md and federal-resume-iteration-7/readiness.md. No additional live attempt, agent push, main merge or skill addition.

## Iteration 8 completion

The fresh 9f39034 hosted attempt identified the deterministic posting-reference check and stopped at HTTP 422. A separate local punctuation counterexample was reproduced and fixed. An initial broad tokenizer passed the old suite, but new short-prefix controls exposed a meaning-changing regression; that version was refined before commit. Final selective splitting preserves compounds with any component shorter than three letters. All original and added checks pass. Historical hosted failures remain failures, and the exact withheld claim is still unavailable. No further live request, push, merge or skill addition occurred.
