# FLEET READINESS — PHASE 0 BASELINE AUDIT

Branch `ops/fleet-readiness-2026-09`. 5 SEP 2026. Measure only — no agent,
workflow, function or schedule was modified in this phase.

## HOW EVIDENCE WAS OBTAINED

`gh` is not installed on this machine and there is no git credential for
github.com. The repository is **public**, so the GitHub REST API answered
unauthenticated. Every EXECUTION and FAIL-LOUD cell below is backed by real run
records and issue records pulled from:

    GET /repos/Nemecekda/Transition_Ops/actions/runs?per_page=100   -> 58 runs
    GET /repos/Nemecekda/Transition_Ops/issues?state=all&per_page=100 -> 55 issues

Cells that could not be evidenced are scored **FAIL and labelled unverifiable**,
per the mission rule. They are not scored on the code looking correct.

## FLEET COMPOSITE: 34 / 96

| Agent | 1 EXEC | 2 LOUD | 3 COST | 4 RESIL | 5 CONTRACT+DRY | 6 EFFIC | Total |
|---|---|---|---|---|---|---|---|
| J1 federal scanner | 2 | 1 | 0 | 0 | 1 | 1 | **5** |
| J2 Sunday triage | 2 | 2 | 0 | 0 | 1 | 1 | **6** |
| J3 SITREP | 2 | 2 | 0 | 0 | 1 | 1 | **6** |
| J4 link audit | 1 | 2 | 0 | 0 | 1 | 0 | **4** |
| J5 metering/spend | 1 | 2 | 1 | 0 | 1 | 1 | **6** |
| **Navigator (LIVE)** | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| PAO weekly packet | 1 | 2 | 0 | 0 | 0 | 0 | **3** |
| s2-intel | 2 | 1 | 0 | 0 | 1 | 0 | **4** |

Zero agents reach the 10/12 goal. **28 of 48 cells are FAIL.**

## CELL EVIDENCE

### J1 federal regulatory scanner — daily `0 9 * * 1` (`j1-federal-scan.yml:9`)
1. **EXEC 2** — last 4 scheduled runs all `success`: 2026-09-04 (33876077525),
   09-03, 09-02, 09-01. 32 scheduled runs total, 35 success / 2 failure.
2. **LOUD 1** — failures are loud: `J1 FAILED 2026-08-21` and `2026-08-03`, both
   FLASH-labelled. But **6 of 32 scheduled runs emitted nothing at all**:
   2026-08-09, 08-10, 08-16, 08-17, 08-24, 08-30. Cause: `File findings` is
   gated `if: steps.diff.outputs.count != '0'` (`j1-federal-scan.yml:194`), so a
   no-change day produces no artifact. Silence is not auditable — a no-change
   day and a sweep that never ran are indistinguishable from outside.
3. **COST 0** — no run emits a labeled metering record. J5 *infers* J1 cost by
   counting findings issues (`j5-spend-check.yml`, "FIRING EVENTS (model
   invocations inferred from findings issues)"). Inference, not a record.
4. **RESIL 0** — single-shot: `j1-federal-scan.yml:66` `curl -sS --fail
   --globoff --max-time 30` with no `--retry` and no attempt loop. 10 further
   unretried `gh issue` calls.
5. **CONTRACT+DRY 1** — output matches contract. **No dry-run mode exists.**
6. **EFFIC 1** — per-firing cost is recorded by J5 ($0.0650/run observed) so a
   median is derivable, but nothing flags a >2x run and no agent computes one.

### J2 Sunday triage — weekly `0 12 * * 0` (`j2-weekly-analysis.yml:34`)
1. **EXEC 2** — 4 scheduled runs, all `success`: 08-30, 08-23, 08-16, 08-09.
2. **LOUD 2** — 6 `J2 analysis` issues for 6 runs; `if: failure()` reporter at
   `j2-weekly-analysis.yml:827`.
3. **COST 0** — no metering record emitted.
4. **RESIL 0** — 12 unretried `gh issue` calls; no retry construct in file.
5. **CONTRACT+DRY 1** — contract met; no dry-run mode.
6. **EFFIC 1** — inside J5's metering loop; no >2x flagging.

### J3 SITREP — weekly `0 13 * * 1` (`j3-weekly-sitrep.yml:19`)
1. **EXEC 2** — last 4 scheduled all `success`: 08-31, 08-24, 08-17, 08-10.
2. **LOUD 2** — 6 `SITREP` issues for 6 runs; `if: failure()` at `:373`.
3. **COST 0** — no metering record emitted.
4. **RESIL 0** — 1 `gh api` (`:125`) + 8 `gh issue`, none retried.
5. **CONTRACT+DRY 1** — contract met; no dry-run mode.
6. **EFFIC 1** — inside J5's loop; no >2x flagging.

### J4 link audit — monthly `0 11 1 * *` (`j4-link-audit.yml:49`)
1. **EXEC 1** — only **one** scheduled cycle has ever run (2026-09-01,
   `success`, 33525170132). 1/1 succeeded but a 4-cycle window does not exist.
   Scored PARTIAL on an incomplete window, not on failure.
2. **LOUD 2** — that run emitted both `J4 link audit 2026-09-01` and
   `J4 SYSTEMIC link failure 2026-09-01`. Thin window (n=1).
3. **COST 0** — **J4 is not metered at all.** `j5-spend-check.yml:131` loops
   `for W in j1-federal-scan j2-weekly-analysis j3-weekly-sitrep j5-spend-check`
   — j4 is absent.
4. **RESIL 0** — two single-shot crawls, `j4-link-audit.yml:177` and `:184`,
   neither retried. This is the agent whose entire job is network fetching.
5. **CONTRACT+DRY 1** — contract met; no dry-run mode.
6. **EFFIC 0** — unmetered, so there is no cost series and no median to compare
   against. Unverifiable.

### J5 metering / spend — monthly `0 12 28 * *` (`j5-spend-check.yml:34`)
1. **EXEC 1** — one scheduled run (2026-08-28, `success`) plus one dispatch.
   4-cycle window does not exist.
2. **LOUD 2** — 2 spend-check issues for 2 runs; `if: failure()` at `:580`.
3. **COST 1** — model-free by assertion (`:88`), and it does count itself in the
   loop, but it emits no per-run labeled metering record in the rubric's sense.
4. **RESIL 0** — 11 unretried `gh` calls.
5. **CONTRACT+DRY 1** — contract met; no dry-run mode.
6. **EFFIC 1** — cheap and self-metered; no >2x flagging.

### Navigator — LIVE, member-facing (`netlify/functions/navigator.js`)
1. **EXEC 0 — UNVERIFIABLE.** Netlify function invocations appear in neither
   this repository nor the GitHub API. No run record of any kind is reachable
   from here. Scored FAIL as unverifiable, not as failed.
2. **LOUD 0 — UNVERIFIABLE.** 8 `console.*` lines exist, almost all `[gap-log]`.
   Failures return a generic 502 (`:445`, `:458`). Whether any given invocation
   emitted a status line cannot be checked without Netlify log access.
3. **COST 0** — no token or usage accounting anywhere in the function, and it is
   outside J5's loop. **The one LIVE member-facing agent has no cost visibility.**
4. **RESIL 0** — `netlify/functions/navigator.js:400` is a single `fetch` to
   `api.anthropic.com/v1/messages` with **no retry, no timeout and no
   AbortController**. One transient upstream blip is one member getting "The
   Navigator is briefly unavailable."
5. **CONTRACT+DRY 0** — no dry-run mode, and this is the agent where one matters
   most: it is live to members.
6. **EFFIC 0** — nothing measured.

### PAO weekly packet — weekly `0 12 * * 1` (`pao-weekly-packet.yml:30`)
1. **EXEC 1** — 3 scheduled runs, all reporting `success`. But the 2026-08-17
   run reported `success` while emitting
   `PAO PACKET FAILED — inputs unread 2026-08-17` (FLASH). **A green run whose
   own output says it failed.** 2 of 3 genuinely completed; the window is 3, not 4.
2. **LOUD 2** — every run emitted an artifact; two `if: failure()` reporters.
3. **COST 0** — **PAO is not metered.** Absent from `j5-spend-check.yml:131`.
4. **RESIL 0** — 7 unretried `gh issue` calls.
5. **CONTRACT+DRY 0** — contract violated on 2026-08-17 (run status disagreed
   with output status), and **no dry-run mode on the one agent in the fleet that
   drafts outward-facing content**.
6. **EFFIC 0** — unmetered. Unverifiable.

### s2-intel — on-demand subagent (`.claude/agents/s2-intel.md`)
1. **EXEC 2** — last 4 invocations evidenced in `intel/verification-log.md`:
   V-2026-016 (`:903`), V-2026-017 (`:967`), V-2026-017 amendment (`:1028`),
   V-2026-018 (`:1099`), most recent 4 SEP 2026. 33 records total.
2. **LOUD 1** — a completed rating always leaves a log entry, but an invocation
   that produces nothing leaves no trace at all. There is no status-line
   mechanism, so a silent no-op is indistinguishable from never running.
3. **COST 0** — subagent invocations are metered nowhere.
4. **RESIL 0 — UNVERIFIABLE.** Tools are `WebFetch`/`WebSearch`; any retry is
   harness-side and is not stated in the agent definition. No agent-side policy.
5. **CONTRACT+DRY 1** — output contract is defined and followed. It holds no
   send path at all, so "sends suppressed" is structurally true, but no
   dry-run mode exists as such.
6. **EFFIC 0** — no token measurement.

## RANKED DEFECT LIST

| # | Defect | Cells moved | Max gain |
|---|---|---|---|
| D1 | **No dry-run mode anywhere in the fleet.** Blocks check 5 for all 8 and, per the fence, blocks safe testing of PAO and Navigator entirely. | 8 x check5 | +8 |
| D2 | **No per-run metering record.** Cost is inferred from issue counts; failed runs and unmetered agents are invisible. | 8 x check3 | +13 |
| D3 | **Zero retry logic fleet-wide.** 3 raw `curl` single-shots (`j1:66`, `j4:177`, `j4:184`), 1 `fetch` (`navigator.js:400`), ~60 unretried `gh` calls. | 8 x check4 | +16 |
| D4 | **J4 and PAO are outside J5's metering loop** (`j5-spend-check.yml:131`). | J4/PAO check3+6 | +6 |
| D5 | **Navigator is unobservable.** No reachable execution or status evidence; scores 0/12 and is the only LIVE member-facing agent. | Navigator 1,2,6 | +6 |
| D6 | **J1 emits nothing on no-change days** (6 of 32 runs). | J1 check2 | +1 |
| D7 | **PAO green-run/failed-output contradiction** on 2026-08-17. | PAO check1,5 | +3 |

## PROPOSED FIX ORDER

1. **D1 dry-run** first — the fence forbids live sends during testing, so
   without it PAO and Navigator cannot be exercised at all. It is the
   prerequisite for verifying every later fix.
2. **D3 retries** — largest single gain (+16) and the defect most likely to be
   causing real, unattributed failures today.
3. **D2 + D4 metering** — one coherent change: emit a labeled per-run record and
   widen J5's loop to all eight agents.
4. **D5 Navigator observability** — mechanism only (structured status line, cost
   log); no corpus or answer-behaviour change.
5. **D6** and **D7** — small, cheap, well-understood.

## STAGED PATCHES — VERIFY-THEN-HOLD

The mission names J1 retry and J4/J5 metering integrity as existing staged
patches, to be checked for clean application rather than re-derived. **I could
not locate either as a staged artifact.** `intel/` holds ten `patch-*.md` files;
none covers J1 retry or J4/J5 metering. No branch name matches. Searched
`intel/`, `git branch -a`, and the workflow files themselves.

Stated plainly rather than reconstructed: **if these patches exist, they are not
on this machine.** Point me at them and I will verify-and-hold as instructed. I
have deliberately not re-derived them.

## SECURITY APPENDIX — EDGE EXPOSURE

**The repository is PUBLIC. This is measured, not assumed:**

    GET /repos/Nemecekda/Transition_Ops  ->  "private": false, "visibility": "public"

and unauthenticated raw fetches all return **200**:

    raw.githubusercontent.com/.../main/intel/verification-log.md      200
    raw.githubusercontent.com/.../main/netlify/functions/navigator.js 200
    raw.githubusercontent.com/.../main/.github/j1-sources.txt         200
    raw.githubusercontent.com/.../main/CLAUDE.md                      200

**That answers the intel/ + navigator.js world-readability question: yes, both
are world-readable to anyone, with no account required.**

What that means per agent:

- **Navigator** — `navigator.js` carries the entire system prompt, all 19
  behavioural rules, the full benefits corpus, the tool manifest and the crisis
  routing logic. Anyone can read exactly how it is steered, including the
  suppression rules and the `[[GAP: ...]]` tag contract. This is prompt
  disclosure, not credential disclosure.
- **intel/** — the verification log, every staged patch, and the sourcing
  standard are public. Content is benefits research intended for members; the
  exposure is process detail, not member data.
- **Issues** — 55 issues, 54 open, all public: every J1 finding, SITREP, spend
  check and PAO packet draft. `J5 spend check` publishes estimated spend, credit
  floor and run counts.
- **CLAUDE.md / .claude/** — full staff structure, delegation doctrine, hard
  gates and skills are public.

**No credential exposure found.** A scan for `sk-ant-*`, inline
`ANTHROPIC_API_KEY=`, `AKIA*` and `ghp_*` across all tracked files returned
nothing. Secrets are referenced correctly and only as
`${{ secrets.ANTHROPIC_API_KEY }}` in workflows and `process.env.ANTHROPIC_API_KEY`
at `navigator.js:404`. The OneSignal app ID is present but is public by design
in any web PWA.

**Residual risk worth Dean's ruling, not mine:** the fleet's prompts are public,
so the Navigator's guardrails can be read by anyone wanting to work around them.
That is a product decision about an open-source posture, not a defect, and it is
outside this loop's fence. Recording it because an audit that noticed and stayed
quiet would be the wrong kind of audit.

## HOLDING FOR COMMANDER RULING

Per mission, no fix iteration begins until Dean rules on:
1. **The fix order above** — accept, or reorder.
2. **The staged patches** — they are not on this machine; supply them or
   authorise deriving the J1 retry and J4/J5 metering fixes as normal iterations.
3. **Dry-run scope** — building dry-run for 8 agents is the single largest piece
   of work here. Confirm all eight, or name a subset (Navigator and PAO are the
   two where the fence makes it mandatory).
