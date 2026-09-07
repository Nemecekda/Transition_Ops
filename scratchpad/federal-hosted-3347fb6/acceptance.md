# Federal hosted acceptance — PR #59

Verdict: **FAIL — stopped without retry or export. Keep PR #59 unmerged.** The two approved fixes remain locally verified, but this hosted run does not clear federal readiness.

## Candidate and execution

- Commit: `3347fb69dd56fff2577adc40d5eccae714234bb5`; tree: `daa04ba3a0b840a40c711771685f7b86e978b4ae`.
- Immutable Netlify deploy: `6a9ee8f1aabda600081f8bf3`, site `veteranbridge-tools`, context `deploy-preview`, state `ready`, published_at null.
- Preview: https://6a9ee8f1aabda600081f8bf3--veteranbridge-tools.netlify.app/
- PR #59: two commits from `codex/federal-resume-readiness` into `ops/openai-parallel-clone`, open and unmerged when read.
- Both Netlify deployment status contexts report success. The GitHub connector returned no PR-triggered Actions runs on its first page; this is not an assertion that every possible check ran.
- Browser: Codex In-app Browser, fresh immutable origin, Federal (USAJOBS). No real member data or personal header. Only the already documented fictional fixture was used.
- Facts activated once at 2026-09-07T16:44:57.601Z: HTTP 200, 8,592 ms, one request attempt and one handler response.
- Draft activated once at 2026-09-07T16:48:59.961Z: HTTP 502, 16,706 ms, one request attempt and one handler response.
- No replay, retry, export, or download. No download controls were present after withholding. Captured browser console errors: zero; HTTP 502 is nevertheless a failed application result.
- Actual provider call count and optional fact repair are UNVERIFIED. Browser request counts cannot establish them. The deployed handler has generation and audit stages; no provider logs or private output were collected to count them. The approved plan remains at most four calls.

## Independent acceptance rows

| Row | Result | Evidence / limit |
| --- | --- | --- |
| Fact extraction and identity | PASS at facts stage | All six titles/employers, six dates, six locations, twelve duties under their owning roles, three education entries, and two certifications match the source; no fact-sheet edit |
| Posting isolation | PASS at facts stage only | Posting-only credential excluded from the confirmed sheet; draft/gaps unavailable |
| Federal generation, grounding, and ownership | FAIL | `global_quantity_owner_mismatch`; draft withheld |
| Exact federal output identities and dates | UNVERIFIED | No candidate released; fact-stage accuracy and local admission tests cannot clear output |
| Missing-field truth and honest gaps | UNVERIFIED | No candidate or gaps returned |
| Specialized experience / non-filler detail | UNVERIFIED | No candidate returned |
| Artifact and rendering | NOT RUN after terminal stop | No file generated, downloaded, opened, or rendered |
| Terminal stop / export protection | PASS | Withheld screen, no download controls, zero further activations |
| Manual assistive technology | PENDING | Safari/VoiceOver, Chrome/NVDA, Edge/JAWS, Android Chrome/TalkBack remain separate acceptance |

All ten score dimensions are **UNVERIFIED**, because the rejected reference structure returns an empty scorecard: grounding_and_claim_trace, exact_identity_preservation, role_separation, date_completeness, quantified_impact, job_posting_alignment, military_jargon_translation, filler, length_and_readability, format_compliance. Do not recast the reference failure as ten model-scored failures, or use an earlier civilian PASS to fill them.

## Diagnosis with evidence

`netlify/functions/resume.mjs:815` builds section/role ownership. At line 1045, validation checks a global claim that shares a quantity with a cited role-owned fact; line 1048 emits this blocker when neither the exact role title nor employer is named. Lines 1062–1071 classify invalid references as malformed; lines 1265–1267 return the observed HTTP 502 with no draft or scorecard. This is deliberate withholding, not proof of an OpenAI connectivity outage.

The federal reviewer already gives the ownership rule at line 699. Federal generation's number instruction at line 88 only requires scoped/exact numbers, and its summary instruction at lines 100–101 does not explicitly state global quantity attribution. This is a concrete prompt-alignment gap. It is a plausible contributor, not a proven reconstruction of the withheld sentence: the safe response does not reveal candidate or trace text. A global section other than Summary, a role-parser mismatch, or a redundant role reference with a coincident number cannot be excluded from this diagnostic alone. An earlier progress update said "summary"; the precise observed classification is **global claim**.

## Proposed next iteration — not applied

The adjacent `proposed-quantity-ownership.patch` changes one federal generation instruction. It explicitly requires each role-owned quantity to stay in its role entry, or to name that exact title/employer in the same global claim. It prohibits unattributed aggregation. The existing reviewer, validator, withholding, civilian implementation, models, caps, retries, logging, privacy, cache, and export remain unchanged.

Expected observable movement: the actual federal generation request explicitly carries the same attribution rule as audit/validation (currently absent, proposed present). A fresh immutable hosted test after local verification must release a correctly grounded federal candidate without this blocker, then independently clear the remaining rows; a prompt change alone does not prove this outcome.

Required local verification after approval: inspect the actual federal request; exercise federal quantified-claim fixtures with unnamed global ownership (502 and no draft), explicitly named global ownership (allowed only with same-role support), role-local quantities (allowed), wrong-role references (withheld), and coincident-number/education references. Preserve all ten dimensions, existing missing-field/date/TIP fixtures, and generation-plus-audit/no-retry boundary. Run the existing five regression gates and package/scope checks; update only the approved federal prompt identity expectation. No live retest of the current failed candidate.

The proposed old string occurs exactly once in the candidate. The patch was generated but **not applied or tested**. No application file changed. The two-fix approval is recorded in `scratchpad/federal-resume-readiness-log.md`; this newly exposed generation-instruction change is a third iteration requiring Dean's ruling under `.claude/skills/resume-drafter-maintenance/SKILL.md:30`: "Obtain Dean's approval before writing app code."

## State

No agent push, merge, production publication, secret inspection, dependency addition, or application edit. The published two-commit candidate remains fixed. This directory contains untracked local acceptance evidence and a review proposal; it is not staged for deployment. The earlier failed hosted run at base 7948cac remains a separate historical failure. Resume governance v0.25 and federal hosted clearance remain PENDING.
