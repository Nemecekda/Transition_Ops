# OpenAI release status - 2026-09-08

Readiness record for published runtime `1803e51` and the subsequent local
documentation wrapper `6a59611`. This is not production clearance and not a
merge or deploy authorization. The local wrapper preserves the exact runtime.
The dated identities below are snapshots; fetch the latest published clone
before future edits and preserve any concurrent local work.

This record supersedes the local untracked file
`scratchpad/openai-release-status-2026-09-07.md`, which describes the earlier
candidate `7948cac` and is stale in three respects listed under "Corrections to
the 2026-09-07 record". That file is left in place unmodified; it remains a
true account of what was known on 2026-09-07.

Prepared as documentation only. No application code, prompt, validator, policy
content, cache constant, dependency, secret, deployment or account setting was
changed to write it. No push, no merge to `main`, no deploy.

## Candidate identity

- Repository: https://github.com/Nemecekda/Transition_Ops
- Published clone/runtime: `1803e511ff3d7001e15d41ff35465a1786657882`;
  tree `b015baa4b44fe19472326b980a824ca9bbae7936`, active PWA cache v156.
- PR65 merged at 2026-09-08T15:04:40Z; its commit timestamp is 15:04:39Z.
- Local clone documentation wrapper at review:
  `6a596112d769b4ecdd1d24afb76583f8b8b36920`, tree
  `73b9a9ae0e31d6adfb8f4b2e03b0a2352a99805b`. It retains Claude's documentation
  commit `8e149936e20ed2a750d045a8ba8534a64bea78ee` and local no-ff merge.
- Measured against main `d82516389ed5906febad467cfe57887acda97053`:
  published runtime 83 ahead / 0 behind; local wrapper 85 ahead / 0 behind.
  Local wrapper is 2 ahead / 0 behind the published clone, unpublished at review.
- Full `1803..6a59611` diff contains only this record and the dated header in
  `intel/weekend-preview-handoff.md`. Runtime, functions, worker, packages,
  tests and deployment configuration are byte-identical; full Git trees differ
  because of the documentation. No new cache integer is needed for these records.

Claude's original `git ls-remote` read at 2026-09-08T15:49Z reported published
clone 1803/main d825. This review independently refreshed all published heads
through the authenticated GitHub connector and an isolated read-only fetch;
both still agree. Shared refs/index/stashes were not changed by this review.
See [durable evidence summary](openai-release-evidence-2026-09-08.md).

File digests at the candidate (SHA-256):

| Path | SHA-256 |
| --- | --- |
| `index.html` | `b8b653776e7182afa9c09f7909869752a8c8a2a887ee2393d3148eec41cef27e` |
| `pwa-sw.js` | `fdbab32cb6e0e8ab009c1ff35e2046acf90b8c4d80b659676204f270eea8a8dc` |
| `sw.js` (legacy; not registered by current app) | `45a4f093d7a19d4403cdaa5da0e6d6ae0a7ae497080fe92694046be789108d32` |
| `netlify/functions/resume.mjs` | `9f14ef2c219fb856682d832f4225759d8e098d5ad12f9e3dfde131f12f3f8085` |

## Corrections to the 2026-09-07 record

1. **The federal Resume blocker is resolved, with hosted evidence.** The 09-07
   record lists a hosted federal HTTP 422 with four failed quality dimensions,
   a reproduced eligibility-filter defect dropping all 12 supplied role
   date/location facts, and two fixes "awaiting Dean's approval". Both fixes
   landed and were hosted-tested. See "Federal Resume" below.
2. **The candidate has advanced.** From `7948cac`, measured `git rev-list`
   counts are 19 commits to published runtime `1803e51` and 21 to local
   documentation wrapper `6a59611`. The final two commits are local and
   unpublished; they are not additional published runtime work.
3. **The older v152 preview is historical.** The 09-07 worker line matches
   immutable `7c79057` preview `6a9f25af9495300009430de3`; it is not current
   PR65/PR46 preview evidence. The exact current runtime is v156, with complete
   manifests and operational publish logs on all three named 1803 deployments.
   See "Service worker and cache ledger".

## Federal Resume - blocker resolved

Both approved fixes are present in `netlify/functions/resume.mjs` at the
candidate, and each matches the scope proposed in
`scratchpad/openai-release-7948cac/federal-hosted-acceptance.md`.

| Proposed fix | Commit | Implementation at candidate |
| --- | --- | --- |
| Federal metadata admission | `96dea57` | `draftEligibleFacts(catalog, mode)` now takes the mode. For `mode === "federal"` and a role-owned fact (`^R[1-9]\d*$`), a `DATES`/`LOCATION (EXACT OR MISSING)` line is admitted on its *value*, excluded only when the value is literally `MISSING`. The civilian path is unchanged. |
| Federal instruction consistency | `3347fb6` | Both federal TIP directives removed. `systemFederal` now ends "Never include TIP, advice, instructions, or a gaps section in the resume." Unmet requirements and next-best additions move to the audit's structured `unmet_gaps` / `supported_keywords`. The federal audit instruction adds explicit bracket-versus-claim rules and requires FAIL/withhold when a bracket replaces a confirmed value. |

Hosted acceptance at commit `7c79057801f7430c082fdc8009ded1fe307ba76b`
(tree `0f83c5c3f20f81effbc0678bbf856ee93919a4b7`, veteranbridge-tools deploy
`6a9f25af9495300009430de3`, context deploy-preview) returned:

- Fact transport 200; draft transport 200 (previously 422).
- Returned scorecard 8 PASS / 0 FAIL / 2 NEEDS MEMBER FACT.
- Candidate released, 30/30 claim-trace references checked, one desktop export,
  zero console errors, zero browser retries.
- Word-compatible render to two pages; all six role blocks intact.

Full evidence: `scratchpad/federal-hosted-7c79057/acceptance.md` and its
sibling artifacts, which are tracked on this branch.

Limits that remain, stated in that record and not weakened here: the two
NEEDS MEMBER FACT dimensions are retained and this is not a ten-PASS result;
actual provider-call count is UNVERIFIED; the fixture is synthetic and bounded;
Microsoft Word itself is unverified; Dean confirmed the file opens on his phone
but did not report complete phone pagination or content.

## Runtime delta between the hosted-tested commit and this candidate

This is the single most important qualifier on the evidence above. The hosted
federal PASS was executed at `7c79057`, which is **not** the candidate.

`git diff 7c79057 1803e51` touches exactly three non-scratchpad paths:

| Path | Change |
| --- | --- |
| `netlify/functions/**` | **No change.** Byte-identical. |
| `index.html` | 26 insertions, 19 deletions across three fixes: Resume error announcement (`01ecad8`), Privacy kept above bottom navigation (`2808d8f`), About dialog keyboard focus in Safari (`117dd58`). |
| `pwa-sw.js` | Cache constant only, `transition-ops-v152` -> `transition-ops-v156`. |
| `scripts/accessibility-release-regression.js` | Test-side changes accompanying all three of `01ecad8`, `2808d8f`, `117dd58`. |

The Resume function source is unchanged, while the browser changes listed
above are real. The federal generation/trace/export PASS remains evidence of
the specific7c79057 run; it is not relabeled as a new1803 generation. The later
Resume function-bundle digest differs from the older tested bundle, with cause
unestablished. Source identity alone does not prove package/execution identity
or actual provider/repair counts.

The three frontend changes already have their relevant local/hosted checks and
the explicitly scoped user AT results recorded below. Their existence does not
create a new mandatory federal generation rerun. No already passed test is
repeated for these documentation-only commits. Full AT and backend/package
evidence limits remain separate.

## Service worker and cache ledger
Current evidence is bound to runtime 1803; the local 6a59611 documentation
wrapper is not represented as a hosted deployment. Authenticated exact-deploy
API manifests each contain **22 runtime records plus one separate netlify.toml
control-plane record**, all path/size/SHA-1 matched to 1803. Parent Codex/XO
independently observed each exact Netlify UI log resolving effective publish
directory `dist`, `/opt/build/repo`, `/opt/build/repo/netlify.toml`, and
`PUBLIC BUILD PASS: 22 files -> dist`. The subordinate did not view that UI.

| Deployment at 1803 | Exact deploy ID | Result |
| --- | --- | --- |
| Clone published | `6aa0240afb7cab0008ec684a` | Complete22+1 manifest and operational dist PASS |
| Clone PR46 preview | `6aa0240dfb7cab0008ec684f` | Complete22+1 manifest and operational dist PASS |
| Veteranbridge PR46 preview | `6aa0240c6ac17c0008850ed5` | Complete22+1 manifest and operational dist PASS |

Use the [exact veteranbridge preview](https://6aa0240c6ac17c0008850ed5--veteranbridge-tools.netlify.app/).
Its public index and active `/pwa-sw.js` bytes match1803, with v156 and the
digests above. The clone canonical public worker request returned401; the
authenticated manifest passed. Do not hide that access limit. Real production
remains deploy `6a9c073e97694a000737014e` at main d825 with active `/sw.js` v135.

The full available-history ledger plus final metadata delta found no unresolved
new owner or differing-byte cache156 reuse: main origin high135, clone 156,
all recorded relevant contexts156. Deleted/unreturned history is unobservable.
The older immutable7c79057 preview still serving v152 is expected historical
evidence, not the current preview or the clone high-water mark.

Current app registers only `/pwa-sw.js`, scope `/`, `updateViaCache: "none"`.
Retained `/sw.js` v130 is the approved legacy compatibility file for existing
registrations; current app does not register it. Its integer is not the active
candidate integer. Preserve it byte-identically under the existing migration
rules; no new v130 rewrite/decision gate follows from comparing it to main 135.
Production cohort/cutover/sunset requirements remain as already specified by
deploy-discipline, not newly demonstrated legacy-device behavior.

Active history: 7c79057 v152 -> 01ecad8 v153 -> 2808d8f v155 -> 117dd58/1803 v156.
Emergency 154 was prepared only for 1822 and never applied. A new **v157 recovery
artifact bound exactly to 1803** now passed applicability/result-tree, protected
hashes, required local gates and cleanup; it remains unapplied. It intentionally
removes app offline caching if separately used.157 is proposed, not reserved.
Its 1803 binding does not certify the later6a59611 documentation tree or any
future candidate: rebind after the eventual release candidate is frozen per the
existing rule. No recovery rework/application is part of this documentation fix.

## Completed scoped accessibility and shared-work accounting

- Parent hosted native Safari on the exact 1803 veteranbridge preview: footer
  visible; pointer opens About with Close focused; Tab/Shift/Option variants
  contained; Escape returns Privacy. Parent UI observation, not speech evidence.
- Dean's exact Mac Safari/VoiceOver Privacy reply: **"Yes, all of those work."**
  **USER-REPORTED PASS** for the named About/Close announcements, Tab/Shift+Tab
  containment, Escape closure and return to footer Privacy. macOS Tahoe 26.5.2;
  Safari 26.5.2 (21624.2.5.11.8); separately identified VoiceOver version unknown.
- Prior Resume **USER-REPORTED PASS**: Mac both formats initial empty-submission
  speech/focus, repeat announcement and moved-focus retention. iPhone both
  formats initial spoken empty-submission error only; iOS 26.6.1 reported.
  No iPhone focus/repeat/moved-focus or Privacy result is inferred.
- The full manual AT matrix remains incomplete. These exact completed flows
  need no repeat without relevant change; they do not pass a whole browser row.
- `codex/alert-verification-followup` c395 is nonancestor but already selectively
  preserved inactive: seven exact helpers, notifier with explicit push-OFF guard,
  seven evidence/test files with two test-only fixture adaptations. It is not
  missing work merely because its tip was not merged. The older April branch
  is also accounted for by preservation/supersession; no new policy import.
- **Row29 accounting resolved by parent disposition, 2026-09-08:** retain the
  approved closed literal-marker logging. Former dynamic per-invocation
  Navigator telemetry is intentionally superseded, not ported. Parent cites
  PR58's approved description excluding detailed logging. Historical records
  remain unchanged; this is not a privacy waiver or runtime/governance change.

Durable provenance, deployment URLs, source hashes and evidence limits are in
[openai-release-evidence-2026-09-08.md](openai-release-evidence-2026-09-08.md).

## Still pending before production release
- Remaining full manual AT coverage: Safari/VoiceOver, Chrome/NVDA, Edge/JAWS,
  Android Chrome/TalkBack. Preserve the narrow passes above; unavailable is not PASS.
- Actual hosted provider-timeout/budget-denial/status coverage and provider/repair
  counts remain unverified, as does the older-vs-later Resume package difference.
  **12/12 pre-provider hosted rejection cases already passed** for Navigator and
  Resume; do not reduce that history to the old422/200 generation pair.
- Full phone export layout/content and named phone app remain unverified;
  phone opening is confirmed. Microsoft Word itself was not the desktop renderer.
  Inspect the existing artifact rather than regenerate it solely for this check.
- Release-specific source currency, existing cohort/cutover requirements, final
  origin review and Dean's explicit main/release decision remain separate.
- Rebind the prepared recovery only when the eventual release candidate is
  frozen if it differs from 1803; its current applicability PASS is exact to 1803.

An optional page-level synthetic failure helper is not a new gate or prerequisite.
It requires a separately supported test harness: available CUA browser evaluate
is read-only DOM only and cannot install or invoke a fetch override. It remains
unexecuted and would not prove actual backend/provider behavior.

## What this record does not claim

No production clearance, ten-PASS federal result, new federal generation at 1803,
full manual AT clearance, actual provider/repair counts, or observed execution of
unavailable historical deployments is claimed. Existing exact 1803 hosted
identity, operational logs and narrow user-reported flows remain valid evidence
of their stated scope. Local6a59611 has the same runtime but a different full
documentation tree; it is not falsely identified as a hosted deploy or as the
candidate bound by the 1803 recovery patch. No push/main merge/deployment or
runtime/skill/account change is authorized by this record.
