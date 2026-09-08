# OpenAI release status - 2026-09-08

Readiness record for the current `ops/openai-parallel-clone` tip. This is not
production clearance and not a merge or deploy authorization.

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
- Branch: `ops/openai-parallel-clone`
- Commit: `1803e511ff3d7001e15d41ff35465a1786657882`
- Tree: `b015baa4b44fe19472326b980a824ca9bbae7936`
- Authored: 2026-09-08T10:04:39-05:00
- Position vs published main `d82516389ed5906febad467cfe57887acda97053`:
  83 commits ahead, 0 behind.

Remote freshness: `git ls-remote origin` at 2026-09-08T15:49Z returned
`1803e51...` for `refs/heads/ops/openai-parallel-clone` and `d825163...` for
`refs/heads/main`. Local refs equal origin at that moment. This is a
point-in-time read, not a guarantee against later pushes.

File digests at the candidate (SHA-256):

| Path | SHA-256 |
| --- | --- |
| `index.html` | `b8b653776e7182afa9c09f7909869752a8c8a2a887ee2393d3148eec41cef27e` |
| `pwa-sw.js` | `fdbab32cb6e0e8ab009c1ff35e2046acf90b8c4d80b659676204f270eea8a8dc` |
| `sw.js` (legacy, unregistered) | `45a4f093d7a19d4403cdaa5da0e6d6ae0a7ae497080fe92694046be789108d32` |
| `netlify/functions/resume.mjs` | `9f14ef2c219fb856682d832f4225759d8e098d5ad12f9e3dfde131f12f3f8085` |

## Corrections to the 2026-09-07 record

1. **The federal Resume blocker is resolved, with hosted evidence.** The 09-07
   record lists a hosted federal HTTP 422 with four failed quality dimensions,
   a reproduced eligibility-filter defect dropping all 12 supplied role
   date/location facts, and two fixes "awaiting Dean's approval". Both fixes
   landed and were hosted-tested. See "Federal Resume" below.
2. **The candidate has advanced.** `7948cac` is an ancestor of the current tip;
   19 further commits have landed since.
3. **The cache and served-origin picture is now measured on both origins.** The
   09-07 line "Current active worker pwa-sw.js is v152, SHA-256 0f2499c3..."
   is confirmed to describe the *preview* origin, not production. See
   "Service worker and cache ledger".

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

Consequence, stated plainly: the server-side Resume implementation that produced
the hosted federal PASS is byte-identical at this candidate, so that evidence
carries forward for the function. The browser-side code does **not** carry
forward unchanged - three accessibility/layout commits have since touched
`index.html`, two of them in the Resume and Privacy surfaces. The hosted federal
run has not been repeated at `1803e51`.

## Service worker and cache ledger

Measured 2026-09-08T15:49Z by direct HTTP read.

| Origin | Path | HTTP | Cache constant | SHA-256 (first 16) |
| --- | --- | --- | --- | --- |
| transitionops.org (production) | `/sw.js` | 200 | `transition-ops-v135` | `f2df1564491dea3d` |
| transitionops.org (production) | `/pwa-sw.js` | 404 | n/a | n/a |
| `6a9f25af9495300009430de3--veteranbridge-tools.netlify.app` (preview) | `/pwa-sw.js` | 200 | `transition-ops-v152` | `0f2499c307702a35` |

Findings:

- The production origin's served `/sw.js` is **byte-identical to `main:sw.js`**
  (`f2df1564491dea3d61a8ff6458e925bb11b677038f321c1e594388db47279572`). The
  production served-origin high-water is therefore `v135`, matching main.
- The preview digest `0f2499c3...` matches the value recorded on 2026-09-07,
  and matches `7c79057:pwa-sw.js` at `v152`. That record's worker line
  describes the preview origin.
- The candidate registers `/pwa-sw.js` (scope `/`, `updateViaCache: "none"`) at
  `index.html:454`; nothing in `index.html` references `/sw.js`. Main registers
  `/sw.js`.
- The candidate still ships a legacy root `sw.js` whose constant is
  `transition-ops-v130`, i.e. *lower* than the `v135` currently active in
  production browsers. Registering `/pwa-sw.js` at scope `/` replaces the prior
  root registration, so this file is expected to be unreferenced after a
  migrated load. Recorded as an observation to resolve before production
  cutover, not as a demonstrated failure; no cutover behavior was executed.

Cache constants across the candidate's recent history, for the ledger:
`7c79057` v152 -> `01ecad8` v153 -> `2808d8f` v155 -> `117dd58` v156. `v154` is
not used by any commit on this branch. Monotonic increase holds; the skipped
number is noted for completeness.

No cache bump is triggered by this record, which changes no shipped asset.

## Still pending before production release

Unchanged from the 09-07 record except where noted:

- Manual assistive-technology matrix: Safari/VoiceOver, Chrome/NVDA, Edge/JAWS,
  Android Chrome/TalkBack. PENDING. Ordinary phone use does not substitute.
- Hosted acceptance re-run at the candidate `1803e51`, covering at minimum the
  three `index.html` changes made since `7c79057` in the Resume and Privacy
  surfaces. NEW requirement, created by those commits.
- Actual provider-call telemetry. UNVERIFIED; no provider telemetry is
  reachable through the enabled read connector.
- Independent effective hosted build-configuration evidence.
- Broader hosted failure-path coverage beyond the one observed 422 and the one
  observed 200.
- Legacy root `sw.js` v130 disposition at cutover (see above).
- Final release and origin review, and Dean's merge decision.

## What this record does not claim

It does not claim production clearance, a ten-PASS federal result, hosted
evidence at the candidate commit, manual AT clearance, an exhaustive historical
cache ledger, or that any preview URL cited here will remain live. It does not
relabel prior local suite evidence as hosted or manual evidence. Deploy
identities recorded here are the ones read at the times stated.
