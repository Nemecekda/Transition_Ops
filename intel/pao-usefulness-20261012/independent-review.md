# Independent PAO usefulness review - October 12, 2026

Disposition: **PASS for the bounded correction. No unresolved blocking finding.** This is an independent code, contract and offline test review, not approval to merge, dispatch a paid run or distribute the draft.

Reviewed branch `codex/pao-useful-packets` against base `959c99e480eb3c5931069eabb5c7110f343df1b0`. The exact seven implementation/input/fixture hashes are bound in `evidence/independent-review/receipt.json`. The builder manifest matches all seven independently calculated hashes. No candidate byte changed during the final test run.

## Findings resolved during review

1. Deeply nested JSON could raise an uncaught recursion exception, and malformed SDK error flags/error subtypes could still supply apparently usable copy. The final candidate contains both outer and inner parse failures and rejects these error envelopes. Independent tests use a valid handout inside the bad envelope to ensure it cannot be promoted.
2. The generic workflow failure body could claim no drafts existed and artifacts were retained even when a later upload failed after an issue was filed. It now names S3, directs inspection of any existing packet and the failed step, and asks the reader to check artifact upload status. The renderer-failure body also keeps raw output out of the primary message.
3. Reusing a dated observation solely within a new reporting week would discard the current handout before next Monday. Reuse is now explicitly bounded to the accepted record's valid-through date, no more than 14 days from observation, with a matching checked app-index hash. The primary body states that the drafting run did not recheck production. A verified-change draft still needs its release date inside the actual reporting window.

## Independent acceptance evidence

- Re-ran the complete scoped author harness: **30/30 tests passed**, including the existing card self-test, actual October 12 envelope, direct voice/citation checks and real shell fallback boundary. No model invocation occurred.
- Added and ran **13 independent tests**, including **484 field-type substitutions**, next-Monday reuse, inclusive October 26 expiry and October 27 rejection, future/unbounded dates, changed app hash, release-window separation, missing clean copy, malformed/error SDK envelopes, deeply nested outer/inner JSON, and model-provided owner/link/flag/raw-content isolation.
- Exercised the actual renderer-failure shell branch with a local stub returning an error. It produced a concise owner task and trusted run link, without copying a raw canary into the issue body. No GitHub command or external send was executed.
- Confirmed the supplied historical packet becomes a failed/current-evidence-gap response with an S3 next task. Its three changelog entries are explicitly not weekly shipping counts. Raw SDK content and unqualified historical STAGED text do not appear in the primary body.
- Confirmed an empty delta can still render the accepted existing-feature handout; missing or invalid task evidence gives a concrete next owner action. Partial or malformed source coverage cannot become a usable draft.
- Confirmed the amendment exists in the source: the September 4 V-2026-017 record explicitly supersedes the original STAGED/not-production statements. The prompt requires dated topic/amendment reconciliation and correct newest-first WHATS_NEW orientation. The renderer does not assert those historical statuses as current.
- Confirmed all seven prompt paths match renderer source coverage, the task record and referenced live-task document exist in this worktree, and workflow context/evidence copies occur before the model step. New files must be included with the implementation when staged.
- Reviewed the workflow diff and independently compared cadence, model, Read-only tool limit, budget cap, timeout, permissions, concurrency and artifact retention to HEAD. These controls are unchanged. `git diff --check` passed. The tracked diff is limited to the five intended PAO guidance/renderer/workflow/test files, plus the new evidence/input/fixture files.

## Evidence and practical limits

The current product statement comes from root's dated synthetic desktop observation and public asset receipt, not from this review. Its observed app hash matches the worktree index. The handout describes preparing a role/area search; it does not verify job availability, role fit, applications, phone usability, persistent save, eligibility, employment outcomes or retention. The renderer binds exact reviewed wording to the record and only removes allowed citation markers when checking annotated/clean equality. Markdown is fenced safely and unknown model structures are not dumped into the primary body.

The retained observation can be reused on October 19 and through October 26 only while its accepted shape and app-index binding remain valid. It is not a fresh weekly product check. After expiry or an app-index change, a new reviewed task observation is required. No live scheduled run, delivery or reader-usefulness result is established by these tests.

This review made no network requests, paid calls, credential access, scheduling changes, app edits, baseline changes, sends, push, merge or deployment. Raw payloads remain evidence only. Distribution still requires Dean's decision.

Independent receipt SHA-256: `23d08d873615e10bdad72bff77a075540776f457356236b268bfb5b6c02f8b3d`.
