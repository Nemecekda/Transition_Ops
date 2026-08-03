# SCHEDULED OPERATIONS — BUILD STEP 3 DESIGN

**Status: DESIGN ONLY. AWAITING COMMANDER APPROVAL.**
No workflow file exists. None may be created before Dean approves a specific
diff. Every YAML block in this document is a quotation of a proposal, not a file.

Drafted jointly: force-mod owns PART II (write boundary, doctrine amendment,
blocked-source problem, severity model). s3-devops was tasked with PART I and
was halted mid-reconnaissance by the Commander; the Orchestrator drafted PART I
from established ground truth under that order.

**Reconnaissance is halted by order.** No further fetches without Dean's
explicit approval. Consequently every unit price, every plan-dependent GitHub
feature, and every Netlify setting in this document is a PLACEHOLDER carrying a
V-item number in Section 8. Nothing is asserted from memory. The tax-model
standard applies: a marked placeholder is acceptable, an invented figure is not.

---

## 0. BLUF

- **Findings sink:** GitHub Issues plus a pinned `BASELINE — DO NOT CLOSE` issue
  holding the source-hash table. The workflow holds **no credential that can
  write a ref**. See PART II §A.
- **Doctrine:** never-push survives as a *restatement*, not an exception. No
  agent chooses a write target at runtime. See PART II §B.
- **The hard constraint:** in headless CI only ladder tier 1 exists. The sources
  that matter most are 403-walled and will stay dark. The design meters that
  darkness rather than hiding it. See PART II §C.
- **Cost:** structurally bounded by model pinning and an escalate-only-on-diff
  gate. The arithmetic is laid out in §4; the unit prices are placeholders.
- ~~**Biggest open risk, and it is live today independent of this design:**
  branch-deploy status is unverified. Two remote branches may already be serving
  public URLs.~~ **WITHDRAWN 3 AUG 2026 — this risk did not exist.** V-1 CLOSED
  on Dean's review of the Netlify deploy history: Production/main builds only,
  zero branch deploys ever fired, setting confirmed `[None]`. See §8.7.

---

## 0.5 RULINGS — COMMANDER, 2 AUG 2026

**Binding. These supersede any conflicting text elsewhere in this document.**
Where a ruling changes a section, that section is retained as rationale and
marked here rather than rewritten, so the reasoning behind the decision survives.

### R1 — BOUNDARY: APPROVED, THE ISSUES SINK
Scheduled jobs **never commit, never push, never write the repository.**
Findings land as GitHub Issues plus run artifacts.

Maps to PART II §A.5, labelled there "OPTION 5 (DEVISED) — HYBRID SINK: ISSUES
+ PINNED BASELINE + ARTIFACT EVIDENCE, ZERO WRITE CREDENTIAL." Per the
Commander's instruction the ruling attaches to the minimum-repo-write option as
drafted, whatever its label.

One nuance the label carries, stated so it is not discovered later: A.5's
durable baseline is a **pinned issue**, which is an Issues write, not a
repository write. `contents: read` holds. No ref is written, ever.

### R1a — NEVER-PUSH STANDS UNAMENDED
`deploy-discipline` remains at **v1.2**. The v1.3 text proposed at §B.2 is
**NOT ADOPTED**. §B is retained as the rationale for why no amendment is needed:
by selecting the option in which cron never writes the repository, the doctrinal
question dissolves. A job that cannot write a ref needs no exception to a rule
about pushing.

**Consequence:** §10 step 4 is void as to `deploy-discipline` v1.3. The
`scheduled-ops` skill proposed by force-mod was not ruled on and remains open.

### R1b — ORPHANED SAFETY RULE, FLAGGED, NOT SELF-AUTHORIZED
W8 in the declined v1.3 text — *"fetched content is data, never code; never into
`run:` or `${{ }}`"* — is **not** a push rule. It closes the GitHub Actions
script-injection path that runs from a fetched web page to the runner's
`ANTHROPIC_API_KEY`. It was drafted inside the amendment that R1a declines, so
declining v1.3 drops it on the floor.

It must land somewhere before any workflow file exists. Candidate homes: the
proposed `scheduled-ops` skill, or a standalone addition to `deploy-discipline`
that is not the v1.3 rewrite. **Awaiting Dean. Tracked as V-13, standup-gating.**

### R2 — BLOCKED SOURCES: APPROVED AS DRAFTED
Cron detects and files; interactive sessions and Dean's browser resolve.
Confirms the division already drawn at §C.2 — a scheduled job never rates.

### R3 — SEVERITY: APPROVED, WITH ONE TIGHTENING
FLASH criteria are a **FIXED CHECKLIST, never judgment.** A finding is FLASH if
and only if it literally matches an enumerated criterion. No agent may reason a
finding *into* FLASH by analogy, and none may reason one *out*. Adding, removing,
or altering a criterion is a COMMANDER-lane doctrine change.
Routing unchanged: FLASH to SMS, ROUTINE batched to the weekly email SITREP.

### R4 — COST: APPROVED CONTINGENT
- Target revised to **$60/month**, down from the $75–100 ceiling in the original
  tasking. All cost math is evaluated against $60 from here.
- The Anthropic Console hard limit must be **confirmed set (V-3) before the first
  live run.**

**Consequence, flagged and NOT self-applied:** §D.1 criterion F3 was written
against the old number — "≥ 90% of the $100 ceiling, or any single day's
estimated spend > $15." Under a $60 target both are wrong. 90% of $60 is $54,
and $15 in a single day is a quarter of the entire monthly target. F3 needs
restatement. A mechanical restatement would be $54 MTD with a single-day figure
scaled to the new target — but **F3 is a FLASH criterion, and R3 makes FLASH
criteria COMMANDER-lane**, so I am not applying it. **Tracked as V-14,
standup-gating.**

### R5 — V-11 IS DEAN'S
Repository settings check. He reports back.

### R6 — SEQUENCING, PLUS A STANDING RULE
Per §10, with this binding addition:

> **No workflow file exists until every standup-gating V-item is CLOSED in the
> log.**

**Standup-gating:** V-2, V-3, V-6, V-7, V-11, V-13, V-14.
**Not standup-gating:** V-1, V-4, V-5, V-8, V-9, V-10, V-12.

Closure is recorded in **§8.1 STATUS LEDGER**, which is the log of record for
operational V-items. `intel/verification-log.md` stays scoped to benefits and
policy claims per its own header; these are operational, not policy. Say if you
want them consolidated into one log.

**Worth noting what R1 bought:** choosing the Issues sink removes **V-1 off the
critical path entirely.** Netlify branch-deploy status no longer gates anything
here, because nothing in this design writes a ref. V-1 remains urgent on its own
merits as a live production exposure — it is simply no longer this design's
blocker.

---

## 1. JOB SET AND CADENCE

GitHub Actions `schedule` is **UTC and does not observe DST**. Dean is US
Central. Every local time below therefore drifts one hour between CST and CDT.
That drift is accepted deliberately rather than papered over; the alternative is
two cron lines per job and a seasonal edit nobody will remember to make.

| # | Job | Cadence | Cron (UTC) | Local (CST/CDT) | Agent | Model (pinned) | Skill | Writes |
|---|-----|---------|-----------|-----------------|-------|----------------|-------|--------|
| J1 | Federal source diff-scan | Daily | `0 9 * * *` | 0300 / 0400 | s2-scanner | `claude-haiku-4-5-20251001` | policy-verification (detect only) | BASELINE issue + diff manifest artifact |
| J2 | Analysis pass | Weekly, **gated on J1 diff** | `0 12 * * 0` | Sun 0600 / 0700 | s2-intel | `claude-sonnet-5` | policy-verification | Finding issues |
| J3 | Weekly SITREP send | Weekly | `0 13 * * 1` | Mon 0700 / 0800 | — (no model) | — | — | Email only |
| J4 | Link-liveness audit | Monthly | `0 11 1 * *` | 1st, 0500 / 0600 | s3-watch-officer | `claude-haiku-4-5-20251001` | — | Finding issues |
| J5 | Spend check | Monthly | `0 12 28 * *` | 28th, 0600 / 0700 | s3-watch-officer | `claude-haiku-4-5-20251001` | Issue + FLASH on F3 | Issue |
| J6 | State-tax sweep | **DORMANT** | — | — | s2-intel | `claude-sonnet-5` | policy-verification | Finding issues |

**J3 is deliberately model-free.** The weekly SITREP is assembly and send, not
inference. It reads issues opened since the last send and formats them. Paying
for a model to concatenate a list is waste, and a model in that path can
hallucinate a finding into a report Dean acts on.

**J6 stays dormant until ship 1 merges.** The state-tax sweep depends on two
things that do not exist yet: the per-jurisdiction `verification` block and the
diffability contract, both defined in `intel/state-tax-model-design.md`. Its
workflow file must not be created until that model is implemented. Proposed
trigger once live: monthly for jurisdictions carrying an active `watch` entry,
quarterly otherwise, plus an unconditional run when any record's verification
date ages past the re-verification interval (open question in PART II §E).

**J1 → J2 ordering.** J1 runs daily and writes a diff manifest. J2 runs weekly
and consumes whatever J1 accumulated. J2 is skipped entirely when the manifest
is empty — see §3.

---

## 2. HEADLESS INVOCATION

Proposed shape, quoted not created. Action SHAs and the CLI version are **pinned
as of 2 AUG 2026** (V-6, V-7 CLOSED) — pinning to a floating tag would make a
scheduled job non-reproducible and silently mutable by a third party. The one
remaining placeholder in this block is `retention-days` (V-8, plan-dependent).

```yaml
# PROPOSED ONLY — .github/workflows/j1-federal-scan.yml
# DO NOT CREATE WITHOUT COMMANDER APPROVAL OF THIS EXACT DIFF.
name: J1 federal source diff-scan

on:
  schedule:
    - cron: '0 9 * * *'
  workflow_dispatch:          # manual re-run for testing; see PART II W-rules

permissions:                  # least privilege, explicit, not inherited
  contents: read              # CANNOT write a ref. This is the safety property.
  issues: write               # the findings sink and the baseline
  actions: read

concurrency:                  # a slow run must never stack on itself
  group: j1-federal-scan
  cancel-in-progress: false

jobs:
  scan:
    runs-on: ubuntu-latest
    timeout-minutes: 20       # hard stop; an unbounded agent loop is a spend event
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1  # v7.0.1
        with:
          persist-credentials: false                    # do not leave a token in .git/config

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code@2.1.220

      - name: Assert model tier                         # see section 3
        run: |
          test "${MODEL}" = "claude-haiku-4-5-20251001" || { echo "::error::model tier violation"; exit 1; }
        env:
          MODEL: claude-haiku-4-5-20251001

      - name: Run scan
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          MODEL: claude-haiku-4-5-20251001
        run: |
          claude -p "$(cat .claude/prompts/j1-federal-scan.txt)" \
            --model "$MODEL" \
            --max-budget-usd 0.50 \
            --output-format json > scan-result.json

      - name: Upload evidence
        if: always()
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a  # v7.0.1
        with:
          name: j1-evidence-${{ github.run_id }}
          path: |
            scan-result.json
            fetched/
          retention-days: PLACEHOLDER   # V-8: retention ceiling is plan-dependent

      - name: Report failure loudly        # a silent cron failure is the classic defect
        if: failure()
        run: gh issue create --label FLASH --title "J1 FAILED $(date -u +%F)" --body "Run ${RUN_ID} failed."
        env:
          GH_TOKEN: ${{ github.token }}
          RUN_ID: ${{ github.run_id }}     # env indirection, not run: interpolation — see V-13
```

**Two corrections to this block, both found after the first draft:**

- **`--max-turns` does not exist** on CLI 2.1.220 (V-7). The draft invented it.
  The real per-run cost control is **`--max-budget-usd`** — "Maximum dollar
  amount to spend on API calls (only works with `--print`)" — which is a hard
  dollar cap on the exact headless path this design uses. Strictly better than
  a turn count: it bounds the thing being budgeted.
- **The failure step originally interpolated `${{ github.run_id }}` directly
  inside `run:`** — the precise pattern V-13's proposed rule prohibits. Rewritten
  to `env:` indirection. `github.run_id` is not attacker-controlled, so this was
  not exploitable, but it is the shape that becomes an injection the moment
  someone substitutes fetched content. Caught by force-mod against this
  document's own draft.

**Three properties worth naming.**
1. `contents: read` is the whole safety argument. The job cannot write a ref
   because it holds no credential that can. That is a structural property, not a
   policy an agent must remember.
2. `persist-credentials: false` matters specifically because the default leaves
   a usable token in `.git/config` for the rest of the job.
3. `if: failure()` exists because **a job that never reports is
   indistinguishable from a job that found nothing.** Silence must never be
   readable as "all clear" — see the dead-man's switch in §5.

---

## 3. MODEL TIERING AND ESCALATE-ONLY-ON-DIFF

### 3.1 Pinning, enforced not conventional
Agent frontmatter (`model: haiku`) is a *default*, not a guarantee, and a
scheduled job must not depend on a default. Every workflow passes `--model`
explicitly and asserts the value in a preceding step (§2). A tier violation
fails the run rather than silently spending at a higher rate. Opus is not
reachable from any scheduled job in this design; force-mod runs interactively
under Dean only.

### 3.2 The baseline — where memory lives
An ephemeral runner has no memory, and this is the crux of the whole diff
design. Prior state lives in the pinned `BASELINE — DO NOT CLOSE` issue body as
JSON, per PART II §A.3. J1 reads it at start, rewrites it at end. Durable,
unlimited retention, human-readable, human-correctable, and reachable with
`issues: write` alone — no ref, no push, no Netlify build.

Rejected alternatives and why: `actions/cache` is evicted after 7 days without a
read and is explicitly not a durability guarantee; artifacts expire and are not
queryable as state. A scanner whose baseline can vanish will one day report
UNCHANGED against an empty baseline — the exact silent-failure mode this system
exists to prevent.

### 3.3 The diff signal
Per source: fetch → **normalize** → SHA-256 → compare to baseline.

Normalization is load-bearing. Raw-hashing a live page produces a diff every run
from timestamps, session IDs, nonces, rotating banners, and ad slots, which
destroys the gate immediately. Normalize by stripping script/style, collapsing
whitespace, and removing known-volatile selectors before hashing. The
normalization ruleset is itself versioned in the baseline issue, because
changing it invalidates every stored hash at once and that must be visible.

### 3.4 The gate
J2 (Sonnet) runs **only** when J1's accumulated manifest is non-empty:

```yaml
# PROPOSED ONLY
- name: Gate on diff
  id: gate
  run: |
    COUNT=$(jq '[.sources[] | select(.changed)] | length' manifest.json)
    echo "count=$COUNT" >> "$GITHUB_OUTPUT"
    [ "$COUNT" -gt 0 ] || echo "::notice::no diffs; Sonnet pass skipped"
- name: Analysis pass
  if: steps.gate.outputs.count != '0'
  run: claude -p "$(cat .claude/prompts/j2-analysis.txt)" --model claude-sonnet-5 ...
```

A week with no changes costs one `jq` invocation and nothing else. That is where
the money is actually saved.

### 3.5 Churn damping
A source that diffs on more than **PLACEHOLDER-N of the last 14 runs** (V-9,
tune after two weeks of real data) is marked `CHURN` in the baseline. A CHURN
source stops triggering J2 on raw-hash change alone and escalates only on a
**figure-level** diff — a change to a number, a date, or a dollar amount in the
normalized text. This prevents one chatty source from buying a Sonnet pass every
week forever.

---

## 4. COST — ARITHMETIC NOW, PRICES PENDING

**Unit prices are NOT stated.** Reconnaissance is halted, and I will not assert
per-token pricing or confirm current model IDs from memory — pricing is exactly
the class of fact the `claude-api` skill exists to source. Every price cell is
V-2. The arithmetic below is complete, so filling in four numbers completes the
table.

**Token assumptions — ESTIMATES, stated so they can be challenged:**
- J1: ~15 federal sources; ~2,000 input tokens each after truncation to the
  changed region, ~200 output each → **~33k in / ~3k out per run**, ~30 runs/mo
  → **~990k in / ~90k out per month**, Haiku.
- J2: gated; assume **4 of 4 weeks fire** (deliberately pessimistic — the gate's
  whole purpose is that this is often lower) → ~60k in / ~8k out per run →
  **~240k in / ~32k out per month**, Sonnet.
- J4: ~1 run, ~40k in / ~5k out, Haiku.
- J5: ~1 run, negligible, Haiku.
- J6: dormant. **Zero until ship 1.** Its steady-state cost is unestimated
  because the record count and re-verification interval are undecided — V-10.

**Prices sourced 2 AUG 2026** (V-2 CLOSED), platform.claude.com models overview:
Haiku 4.5 **$1 / $5** per MTok; Sonnet 5 **$3 / $15**, with **introductory
$2 / $10 through 31 AUG 2026**. Both columns are shown because the intro rate
expires four weeks from now.

| Job | Model | Monthly in | Monthly out | Cost @ intro | Cost @ standard |
|-----|-------|-----------|-------------|--------------|-----------------|
| J1 | Haiku 4.5 | ~990k | ~90k | $1.44 | $1.44 |
| J2 | Sonnet 5 | ~240k | ~32k | $0.80 | $1.20 |
| J4 | Haiku 4.5 | ~40k | ~5k | $0.07 | $0.07 |
| J5 | Haiku 4.5 | ~5k | ~1k | $0.01 | $0.01 |
| J6 | Sonnet 5 | dormant | dormant | $0 | $0 |
| **Total** | | **~1.28M** | **~128k** | **~$2.32** | **~$2.72** |

**Against the $60 target that is roughly 4%.** Two honest caveats before anyone
banks that number:

1. **It models only the token volumes estimated above.** A Claude Code agent run
   re-sends its system prompt and tool schemas every turn, which this table does
   **not** model. Prompt caching offsets much of that, but the real figure will
   be higher — treat ~$2.32 as a floor, not a forecast. Even at **10×** the
   estimate the design lands near $27/month, still inside $60.
2. **Sonnet's rate rises 50% on 1 SEP 2026** when the intro pricing lapses. That
   only moves the total by ~$0.40 here because J2 is gated and small, but the
   same lapse hits any future Sonnet-heavy job — J6 in particular. Re-run this
   table when J6 activates.

The binding constraint is therefore **not** the $60 target. It is the prepaid
balance — see the corrected B-1 in §8.2.

**What drives variance, in order:** (1) whether J2's gate actually holds — an
un-damped churning source converts J2 from 4 runs to 30; (2) page size, since
fetching whole pages instead of changed regions multiplies J1's input by an
order of magnitude; (3) J6's steady-state once 51 jurisdictions are live; (4)
retry storms against walled sources, which cost tokens and return nothing.

**Behaviour approaching the ceiling.** J5 computes month-to-date estimate.
At **75%** → ROUTINE note in the weekly SITREP. At **90%** → FLASH (PART II
§D.1 F3). At **100%** → the hard limit set by Dean in the Anthropic Console
stops spend at the vendor. Console-side limits are the only real enforcement;
everything in this repository is advisory metering and must be described that
way. Setting that limit is a Dean action, V-3.

---

## 5. NOTIFICATION TRANSPORT

force-mod defines severity CRITERIA in PART II §D. This section is transport only.

### 5.1 ROUTINE — weekly email SITREP
**Destination: `dean@veteranbridgesolutions.com`** (primary).
**Fallback: `dean.nemecek01@gmail.com`.** Ruled by Dean 3 AUG 2026, amending the
earlier same-day ruling below.

**Evidence:** GitHub's address-verification email was delivered to
`dean@veteranbridgesolutions.com` and confirmed by Dean on 3 AUG 2026. That
delivery *is* the inbound-mail proof the earlier ruling required, so the
condition it set is satisfied rather than waived. GitHub's default notification
email is now set to the business address.

The evidence is well matched to the claim, which is what makes it sufficient:
the question was whether **GitHub** can deliver to that domain, and the proof is
a **GitHub-sent** message arriving there. It does not generalise to arbitrary
senders — an SMTP-action or SendGrid path (options 2 and 3 below) would be a
different sender and is not covered by this evidence.

**Superseded, retained per the correction standard:** the earlier 3 AUG ruling
made Gmail the ops destination "until business-domain inbound mail is proven."
That condition has now been met. Gmail drops to fallback; it is not removed,
because a single-destination alert path has no continuity if the primary fails.

GitHub Actions has no built-in mailer. Options:

| Option | Secrets needed | Cost | Note |
|---|---|---|---|
| **GitHub Issues native notification** | none | free | Works day one, zero setup. Delivers to the **GitHub account email**, which may not be `dean@veteranbridgesolutions.com` — V-4. Not a formatted SITREP. |
| **SMTP action** (e.g. `dawidd6/action-send-mail`) | host, port, user, pass | free w/ existing mailbox | Full control of format. Needs an app password on a real mailbox. |
| **SendGrid / SES API** | one API key | free tier PLACEHOLDER V-5 | Best deliverability; another vendor account. |

**Recommendation:** ship on Issues-native notification immediately so the system
is never silent while email is being wired, then add the SMTP action for the
formatted weekly SITREP. Do not block standup on mail plumbing.

### 5.2 FLASH — SMS via Twilio
A Twilio REST call from the workflow. **Setup is Dean's to perform — I do not
create accounts and do not handle credentials.** Steps:

1. Create a Twilio account at twilio.com. Verify Dean's mobile as a caller ID.
2. Buy an SMS-capable phone number. Cost is Twilio-side, **separate from the
   $60 Anthropic target (R4)** — number rental plus per-message. V-5.
3. From the Twilio Console collect three values: **Account SID**, **Auth
   Token**, **the purchased From number**.
4. In GitHub: Settings → Secrets and variables → Actions → New repository
   secret. Create `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`,
   `TWILIO_FROM_NUMBER`, `TWILIO_TO_NUMBER`. Paste each value into GitHub
   directly. **Do not paste any of them into a chat with me, a file, or a
   commit.**
5. End-to-end test via `workflow_dispatch` on a test workflow that sends one
   message. Confirm receipt on the handset before trusting the path.

```yaml
# PROPOSED ONLY — FLASH send step
- name: FLASH SMS
  if: steps.severity.outputs.flash == 'true'
  run: |
    curl -sS --fail-with-body -X POST \
      "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json" \
      --data-urlencode "To=${TWILIO_TO_NUMBER}" \
      --data-urlencode "From=${TWILIO_FROM_NUMBER}" \
      --data-urlencode "Body=FLASH ${{ steps.severity.outputs.code }}: ${{ steps.severity.outputs.summary }}" \
      -u "${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}"
  env:
    TWILIO_ACCOUNT_SID: ${{ secrets.TWILIO_ACCOUNT_SID }}
    TWILIO_AUTH_TOKEN: ${{ secrets.TWILIO_AUTH_TOKEN }}
    TWILIO_FROM_NUMBER: ${{ secrets.TWILIO_FROM_NUMBER }}
    TWILIO_TO_NUMBER: ${{ secrets.TWILIO_TO_NUMBER }}
```

`TWILIO_TO_NUMBER` is Dean's personal mobile. It is PII and belongs in secrets,
never in a workflow file, never in a log line.

### 5.3 When the transport itself fails — the dead-man's switch
**This is the requirement most alerting systems get wrong.** If the notifier
fails, the system goes quiet, and quiet is indistinguishable from "nothing to
report."

- Any send failure (`--fail-with-body` non-zero) opens a FLASH-labelled issue,
  which triggers GitHub's own notification path. The backup channel is not the
  channel that just failed.
- **The weekly SITREP sends every week without exception**, including weeks with
  nothing to report, stating "NO FINDINGS — N sources scanned, M dark." A
  missing Monday email is then itself the alarm. Silence becomes diagnostic
  rather than ambiguous.
- If two consecutive weekly sends fail, that is an F4-class integrity event.

---

## 6. SECRETS INVENTORY

| Secret | Purpose | Set by | Notes |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Claude Code auth in all model jobs | Dean, repo secrets | Console spend limit is the real ceiling (V-3) |
| `TWILIO_ACCOUNT_SID` | FLASH SMS | Dean, repo secrets | |
| `TWILIO_AUTH_TOKEN` | FLASH SMS | Dean, repo secrets | Rotate if ever echoed to a log |
| `TWILIO_FROM_NUMBER` | FLASH SMS | Dean, repo secrets | |
| `TWILIO_TO_NUMBER` | FLASH SMS | Dean, repo secrets | PII |
| `SMTP_*` **or** `SENDGRID_API_KEY` | Weekly SITREP | Dean, repo secrets | Only if §5.1 option 2 or 3 chosen |
| `GITHUB_TOKEN` | Issues + baseline | built-in | Never a PAT. Declared per workflow as `contents: read, issues: write` |

**No PAT anywhere in this design.** The moment a PAT appears, the structural
safety argument in PART II §A collapses, because a PAT's scope is not bounded by
the workflow's `permissions:` block.

Repository default workflow permissions should be set to read-only, and "Allow
GitHub Actions to create and approve pull requests" disabled. Both are Dean
actions in repo settings. V-11.

---

# PART II — THE WRITE BOUNDARY AND THE ALERT PATH

Authored by force-mod. Sections A-E below are its draft, incorporated verbatim.


## A. THE BOUNDARY — WHAT A SCHEDULED JOB MAY DO WITH FINDINGS

### A.0 The actual question

A runner is ephemeral. It has no local branch to hand anybody, so the v1.2
handoff model does not apply to it. But "it must therefore push" is a false
step. A runner has four exits, not one: a ref in a repository, an Actions
artifact, the GitHub API (issues, comments), and an outbound network call
(mail, SMS). Only the first touches Netlify. The design problem is to move
durable findings out of an ephemeral box without using the one exit that can
publish.

Second constraint, and it is the sharper one: **a change detector needs a
durable baseline.** Findings-out is half the problem. If the job cannot
remember what a source looked like yesterday, it either re-reports everything
every day (noise, then muting) or silently resets its memory and reports
UNCHANGED against a baseline it just invented. Any option that solves output
but not baseline is not a solution.

Third constraint, from ground truth 3: commit `21e25e3` on
`resource-directory-may2026` is titled "Trigger Netlify branch deploy."
Branch deploys have been active for this site. Until the Netlify dashboard is
read, **every ref in this repository is presumed to publish a public URL.**
Treat "it's only a feature branch" as a claim requiring evidence, not a default.

---

### A.1 OPTION 1 — RESTRICTED BRANCH NAMESPACE

The job commits findings to `intel/` and pushes to a reserved prefix, e.g.
`bot/intel/<date>`. Dean reviews and cherry-picks anything worth keeping.

**Can do.** Everything. Full file series, real diffs, native `intel/` format,
git history as the baseline. Strictly the most capable option.

**Blast radius.** The largest available. Production is two characters of ref
string away.

**Netlify interaction.** Direct and adverse. If branch deploys are on, every
bot push publishes unreviewed, unverified, machine-written intel to a public
URL under the site's domain. That is a policy-content publication with no human
in the loop — the exact failure `policy-verification` exists to prevent.

**Controls, and where each one falls short.**

- `permissions: contents: write` — **this is the defect.** The token scope is
  repository-wide. There is no way to grant "write only refs matching
  `bot/intel/*`" through the `permissions:` block. The workflow's restraint is
  a convention inside the file, not an enforced boundary.
- Repository ruleset restricting ref creation/update — this IS the enforced
  boundary, and it is the only thing that makes Option 1 defensible. Ruleset
  and branch-protection availability depends on repository visibility and
  GitHub plan; on private repositories these are paid features. **Availability
  is unconfirmed. Do not assume it.**
- `netlify.toml` with `[context.branch-deploy] ignore = "exit 0"` — cancels
  branch builds at build time and is version-controlled, which the dashboard
  setting is not. Real control. Carries its own hazard: a `netlify.toml`
  `[build]` block **overrides the dashboard build settings**, so it must
  reproduce the current build command and publish directory exactly or the next
  production deploy breaks. It cannot be authored from the repo — the values
  live only in the dashboard.
- CODEOWNERS — reviewer routing only. Does not stop a push.

**Failure mode.** A malformed ref expression, a compromised third-party action,
or a future edit that "just parameterizes the branch name" reaches `main`. The
loud version is a bad deploy. The quiet version is worse: a public branch URL
serving machine-drafted benefits text that nobody knows is live.

**Verdict.** Reject for initial standup. Revisit only after branch-deploy
status is confirmed constrained AND a ruleset enforces the namespace. Capability
is not the binding constraint here; nothing else on this list fails to a deploy.

---

### A.2 OPTION 2 — NO REPO WRITE: NOTIFICATIONS PLUS ARTIFACTS

`permissions: contents: read`. Findings leave as the alert body; raw fetched
pages and a `digest.json` upload as an Actions artifact for evidence.

**Can do.** Detect, evaluate, alert, and attach proof. Cannot remember.

**Blast radius.** Effectively zero repository-side. The token cannot write a
ref. Outbound is a mail or SMS call carrying a credential.

**Netlify interaction.** None. No ref is written, so no build is triggered.
Immune to ground truth 3 by construction — it does not need the dashboard
question answered before it can run safely.

**Controls.** Explicit `permissions:` block; repository default workflow
permissions set to read-only; third-party actions pinned to full commit SHA;
artifact retention set deliberately.

**Failure mode — and it is disqualifying on its own.** No durable baseline.
Artifacts expire (retention capped at 90 days, shorter by policy, and they are
not queryable as state). `actions/cache` is evicted after 7 days without a
read and is explicitly not a durability guarantee. A scanner whose baseline can
vanish without notice will one day report UNCHANGED against an empty baseline.
That is the precise failure ground truth 7 warns about, arriving through the
storage layer instead of the network layer.

Secondary failure: artifacts require an authenticated download from a browser.
Useless at 0300 from a phone.

**Verdict.** Correct as an *evidence* mechanism. Insufficient as the whole
answer. Keep the artifact leg; it must be paired with a durable sink.

---

### A.3 OPTION 3 — GITHUB ISSUES AS THE FINDINGS SINK

`permissions: contents: read, issues: write`. Each finding becomes an issue or
a comment on a rolling daily issue. Labels carry severity and category.

**Can do.** Durable, unlimited-retention, timestamped, full-text searchable,
API-readable, mobile-readable, and assignable. Issue close/reopen is a native
state machine for "resolved" and "regressed."

**Blast radius.** Issue spam. That is the entire list. There is no code path
from `issues: write` to a ref write, a merge, or a Netlify build.

**Netlify interaction.** None. Nothing publishes.

**Controls.** Explicit `permissions:` with `contents: read`; repository default
workflow permissions read-only; "Allow GitHub Actions to create and approve
pull requests" disabled; actions pinned by SHA; a hard cap on issues created
per run (proposed: 5, then one rollup comment) so a scanner bug cannot open
four hundred issues overnight.

**The baseline solution, and it is the reason this option wins.** One pinned
issue titled `BASELINE — DO NOT CLOSE` holds the source-hash table as JSON in
its body. The job reads it at start and rewrites it at end. That is durable,
versioned (issue edit history is retained), human-readable, human-correctable,
and **it is reached with `issues: write` alone — no ref, no push, no Netlify
build, ever.** The amnesia problem is solved without acquiring write access to
a single byte of the repository.

Size ceiling on an issue body is 65,536 characters. A hash table over a few
dozen sources is nowhere near it; overflow is handled by sharding into a second
pinned issue, and the run asserts it fits.

**Notification, free of charge.** Issue creation notifies repository watchers
by email and by GitHub Mobile push immediately, with no vendor and no secret.
That is a working ROUTINE channel on day one. FLASH still needs a dedicated
path (Section D).

**Failure mode.** Volume fatigue if severity discipline slips — governed by the
anti-noise rules in D. Requires Issues enabled on the repository. And findings
live in GitHub rather than in `intel/`.

**On that last point: it is a feature, not a gap.** The repository record —
`intel/verification-log.md` — is the record of *decision*, and a scheduled
scanner has no authority to make decisions. An issue is a tip. Its promotion
into `intel/` is done later by an interactive agent under normal
`deploy-discipline`, with Dean merging. The seam falls exactly where authority
changes hands.

**Verdict.** Strongest single option. Safe by construction rather than by
configuration, which is what makes it hold up under a future edit by an agent
that has not read this document.

---

### A.4 OPTION 4 — SEPARATE INTEL REPOSITORY

Findings live in `Nemecekda/Transition_Ops_Intel`, which no Netlify site is
connected to.

**Design note that changes its cost profile.** Do not run the workflow in the
app repository and push across. That requires a write-scoped PAT stored as a
secret in the app repo, which reintroduces the credential you were trying to
eliminate. **Run the workflow inside the intel repository**, where its own
`GITHUB_TOKEN` writes freely and no cross-repo write credential exists at all.
If it needs app content — an index of outbound links, the shipped dollar
figures — it reads `raw.githubusercontent.com` if the repo is public, or uses a
fine-grained PAT scoped **read-only** to the app repo if it is private.

The asymmetry is the point: the credential that can write has no dangerous
destination, and the credential that touches production has no write bit.

**Can do.** Everything Option 1 can, with none of its blast radius. Full file
series, real git history, native `intel/` formatting, arbitrary size.

**Blast radius.** Zero against production, conditional on the intel repository
never being connected to a Netlify site. That condition must be stated as
standing doctrine, because "just point Netlify at it to preview the reports" is
exactly the convenient future decision that would silently undo it.

**Netlify interaction.** None, given that condition.

**Failure modes.**
1. **Scheduled-workflow deactivation.** GitHub disables `schedule` triggers in
   repositories that go inactive for 60 days. A bot-only repository with no
   human commits is the population this rule targets. Whether the bot's own
   commits reset the clock must be verified empirically, not assumed. This
   risk lands harder on Option 4 than on the app repo, where Dean commits often.
2. **Split brain.** Two homes for verification records. The moment `intel/` in
   the app repo and the intel repo disagree, neither is authoritative.
3. Two repositories, two settings pages, two permission models, for one person.

**Verdict.** The correct destination if intel volume outgrows issues, or if
findings genuinely need to be a versioned file series. Not the right place to
start — it costs the most setup and carries the silent-deactivation risk, to
buy capability that is not yet needed.

---

### A.5 OPTION 5 (DEVISED) — HYBRID SINK: ISSUES + PINNED BASELINE + ARTIFACT EVIDENCE, ZERO WRITE CREDENTIAL

Fuse 2 and 3 and take the strong half of each.

- **Sink:** GitHub Issues, labelled by severity and category.
- **Memory:** one pinned `BASELINE — DO NOT CLOSE` issue, JSON body, rewritten
  each run.
- **Evidence:** `actions/upload-artifact` carrying raw fetched pages, HTTP
  status codes, and `digest.json`, so any finding can be audited against exactly
  what the runner saw rather than against what it said it saw.
- **Notification:** issue creation for ROUTINE; a dedicated FLASH channel per
  Section D.
- **Token:** `contents: read`, `issues: write`. Nothing in this repository is
  writable by any workflow. There is no PAT.

**Why this is the recommendation.** It is the only option on the list whose
safety does not depend on a setting being correct, a ruleset being available on
the current plan, a dashboard value being transcribed accurately, or a future
agent choosing the right branch prefix. The workflow **cannot** write a ref
because it holds no credential that can. Ground truth 3 becomes irrelevant to
whether this is safe to run — it stays a live question for the site generally,
but it stops gating this system.

It also degrades honestly. If the notification vendor fails, findings still
accumulate in issues. If the artifact expires, the finding text remains. If the
job fails entirely, the baseline is untouched and the next run resumes.

**Failure mode.** Issue volume. Governed entirely by Section D, which is why
the severity model is a load-bearing part of this design and not documentation.

---

### A.6 CONSIDERED AND SET ASIDE — NETLIFY SCHEDULED FUNCTIONS

`netlify/functions/` already exists (`jobs.js`, `resume.js`, `navigator.js`),
so a scheduled Netlify Function will be proposed by someone. It has one real
advantage: no GitHub token, so the repo-write question never arises.

Set aside, because it trades a repository risk for a worse one: **a scheduled
function's code ships with the site.** It becomes production code on `main`,
under the full deploy pipeline, subject to the cache-bump and gate discipline,
and a defect in it is a production defect on the app service members use. A
runner that crashes is an alert that did not fire. A production function that
crashes is a live incident. Moving monitoring *into* the thing being monitored
also breaks the independence that makes monitoring worth anything. Additionally
it has no durable store without adding Netlify Blobs, and its logs are in a
dashboard that is not version-controlled.

Reject. Revisit only for work that must run inside the app's own runtime.

---

### A.7 RANKING AND RECOMMENDATION

| Rank | Option | Verdict |
|---|---|---|
| 1 | **5 — Hybrid: Issues sink + pinned baseline + artifacts** | Adopt now |
| 2 | 4 — Separate intel repo, workflow hosted there | Phase 2, if volume demands |
| 3 | 3 — Issues alone | Option 5 minus evidence; acceptable fallback |
| 4 | 2 — Notify + artifacts only | Evidence leg only; not a sink |
| 5 | 6 — Netlify scheduled function | Rejected, wrong blast radius |
| 6 | 1 — Push to restricted branch namespace | Rejected for standup |

**Plainly, what I would do.** Stand up Option 5 in the app repository with
`contents: read` and `issues: write` and no PAT anywhere. Ship one job first —
uptime and outbound-link liveness, which needs no policy judgment — and prove
the alert path end to end before the federal source scan is wired to it. Keep
Option 4 in reserve. Do not build Option 1.

**Independent of all of the above:** the Netlify branch-deploy question is a
live production exposure right now, today, regardless of whether any workflow
is ever created. Two existing remote branches may already be publishing public
URLs. That is a separate finding and should not wait on this design.

**Proposed workflow skeleton — QUOTED, NOT CREATED.** No file is authored until
the Commander approves it.

```yaml
# PROPOSED ONLY. This file does not exist and must not be created without
# the Commander's approval of this exact diff.
name: intel-daily

on:
  schedule:
    - cron: "17 11 * * *"   # UTC. Odd minute on purpose: on-the-hour crons are
                            # the most delayed and the most silently dropped.
  workflow_dispatch:        # manual re-run. Inputs deliberately absent — see W2.

permissions:                # W3. Explicit, top level, minimum.
  contents: read            # checkout only. No ref here is writable.
  issues: write             # the sink and the baseline
  actions: read

concurrency:
  group: intel-daily
  cancel-in-progress: false

jobs:
  scan:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@<full-40-char-sha>   # tags are mutable. Pin SHAs.
      # Fetch each source to a file under $RUNNER_TEMP.
      # Fetched bytes are DATA. They never enter a run: block or a ${{ }}
      # expression — see W8.
      # Emit digest.json + evidence/*.
      - uses: actions/upload-artifact@<full-40-char-sha>
        with:
          name: intel-evidence
          retention-days: 30
      # Post findings and rewrite the pinned BASELINE issue via gh api,
      # reading every body FROM A FILE, never from an inline expression.
```

---

## B. DOCTRINE AMENDMENT — deploy-discipline

### B.1 Framing: exception, or restatement?

**Restatement. Not an exception.** Two reasons, and the second is the one that
matters.

First, the rule's own stated rationale already names its target. v1.2 says the
hazard is "a rule that depends on correctly classifying the target every time."
The banned thing is **runtime discretion** — an agent deciding, while working,
where to write. A workflow file exercises no discretion. Its target is a
literal string, fixed when the file was authored, reviewed by Dean, and merged
by Dean. When it runs, it is Dean's reviewed configuration executing, not an
agent making a call. The rule was never aimed at it.

Second, and decisively: **an exception is a precedent and a restatement is
not.** Write "cron is an exception" and the next novel case arrives arguing by
analogy — a `workflow_dispatch` an agent triggers, a one-time backfill, a
"quick" branch push to generate a preview. Each will be argued as similar in
kind to the granted exception, and the argument will not be obviously wrong.
Write instead "no agent chooses a write target at runtime" and every one of
those cases is settled on the same test, without anyone needing to weigh
similarity. The restatement is strictly more robust because it converts a
judgment call into a mechanical check.

Corollary that must be written down or the restatement leaks: a fixed target is
only fixed if it is *literal*. A workflow that computes its ref from an input,
an environment variable, a job output, or fetched content has moved the
decision back to runtime and is prohibited by the same principle it appeared to
satisfy.

The interactive-agent rule survives verbatim. It gets stronger — it now has a
stated principle instead of a bare prohibition, and a principle is what an
agent reasons from correctly when it meets a case the list did not enumerate.

---

### B.2 PROPOSED TEXT — deploy-discipline v1.3

**PROPOSAL. Not applied. COMMANDER lane — deploy pipeline.**

**Amendment 1 — replace the first PROHIBITED entry:**

> - Pushing to `origin` — any branch, any circumstance. Agents never push. Work
>   is staged as local commits; Dean merges and pushes. "Branches but not main"
>   is not the rule and never was: `main` auto-publishes, so a rule that depends
>   on correctly classifying the target every time is one mistake from a deploy.
>   What this bans is RUNTIME DISCRETION — an agent choosing a write target
>   while it works. It is not a claim that bytes may never reach `origin` by any
>   mechanism. A scheduled workflow whose write target is a literal string,
>   fixed when the file was authored and merged by Dean, exercises no discretion
>   and is governed by SCHEDULED OPERATIONS below. That section is a narrower
>   rule, not a loophole. An agent that finds itself reasoning about whether its
>   own push might qualify has already violated this entry — the test is not
>   whether the push is safe, it is whether an agent is choosing.

**Amendment 2 — new section, placed immediately before PROHIBITED:**

> ## SCHEDULED OPERATIONS — MACHINE WRITES
>
> Interactive agents never push. Scheduled workflows are not agents. A workflow
> is Dean's reviewed configuration; its authority comes from his merge, not from
> its own judgment at runtime. These rules keep that true.
>
> **W1 — AUTHORING IS COMMANDER LANE.** Every file under `.github/workflows/`
> is a deploy-pipeline change. No agent creates, edits, renames, or deletes one
> without Dean's prior approval of the specific diff. Approval of a workflow's
> purpose is not approval of its text.
>
> **W2 — LITERAL TARGETS.** Any ref, repository, or path a workflow writes MUST
> appear as a literal string in the workflow file. Targets derived from
> expressions, job outputs, `workflow_dispatch` inputs, environment variables,
> or fetched content are PROHIBITED. Test: read the file cold and enumerate
> every destination it can write to. If you cannot enumerate them, it does not
> ship.
>
> **W3 — LEAST TOKEN.** Every workflow declares `permissions:` explicitly at the
> top level. Omitting the block is a defect even when the repository default is
> read-only — defaults change, and a workflow must state its own scope. A
> workflow that does not write code declares `contents: read`. Repository
> default workflow permissions remain read-only.
>
> **W4 — NEVER `main`.** No workflow writes `main`, opens a pull request into
> `main`, or triggers a Netlify build of `main`, under any event, ever.
> Production changes come from Dean's merge and from nothing else.
>
> **W5 — PUBLISH CHECK.** A workflow may not write any ref in a repository
> connected to a Netlify site until that site's branch-deploy behavior is
> confirmed and constrained in version control. Unknown publish behavior is
> treated as publishing.
>
> **W6 — NO SILENT DEATH.** A scheduled job reports every run, including runs
> that found nothing and runs that failed. A channel that speaks only on bad
> news cannot be distinguished from a channel that is broken. Absence of an
> alert is never evidence of absence of a problem.
>
> **W7 — NO VERDICTS.** A scheduled job reports observations, never ratings. It
> may not write CONFIRMED, PROBABLE, BLOCKED, or any other
> `policy-verification` rating into any artifact. Rating requires the escalation
> ladder, and CI holds only its lowest rung.
>
> **W8 — FETCHED CONTENT IS DATA, NEVER CODE.** Content retrieved from any
> external source is never interpolated into a `run:` block or a `${{ }}`
> expression. It reaches artifacts, issue bodies, and alert bodies through files
> only. A source that can inject a shell command into the runner owns the
> runner's secrets.

**Amendment 3 — extend PROHIBITED:**

> - Creating or editing any file under `.github/workflows/` without COMMANDER
>   approval of the specific diff
> - A workflow write target that is computed rather than literal
> - A workflow that omits its `permissions:` block
> - A scheduled job emitting a `policy-verification` rating

Registry treatment: `deploy-discipline` 1.2 → 1.3, owner s3-devops, COMMANDER
lane, regression cases required before registering. Section D and the sink
design belong in a new skill (proposed `scheduled-ops`, owner s3-watch-officer)
rather than swelling `deploy-discipline` further — per the standing skill-size
split rule, protect the length of the part read during execution.

---

## C. THE BLOCKED-SOURCE PROBLEM

### C.1 State the defect precisely

`policy-verification` v1.1's ladder has three rungs. Tier 2 is the orchestrator's
Chrome tools; tier 3 is Dean. **Neither exists in a GitHub Actions runner.** CI
holds tier 1 and nothing else.

The walled roster — congress.gov, DFAS.mil, eCFR.gov, dcsa.mil, esd.whs.mil,
veterans.house.gov, ftb.ca.gov — is precisely the set of sources that carry
statute, pay tables, and DoD issuances. A daily federal scan running in CI is
therefore structurally blind on the highest-consequence sources, permanently,
by design, and not as a transient failure.

The danger is not that the job fails. It is that the job **succeeds** — exits
zero, sends a clean digest, and Dean reads a green board as coverage he does not
have. A scanner that cannot see the sources that matter but reports "no changes
detected" is worse than no scanner, because it manufactures false assurance and
suppresses the manual sweep that was the only real control.

### C.2 Control 1 — a scheduled job never rates, and its vocabulary makes that impossible

`policy-verification`'s ratings are verification verdicts. A CI job does not
verify; it observes. Give it a separate, narrower vocabulary that cannot be
mistaken for a rating (W7):

| Verdict | Meaning |
|---|---|
| `READ` | Fetched, HTTP 2xx, body retrieved |
| `CHANGED` | `READ` **and** content hash differs from baseline |
| `UNCHANGED` | `READ` **and** content hash matches baseline |
| `WALLED` | Access refused — 403, bot interstitial, challenge page |
| `ERROR` | Timeout, DNS failure, 5xx, malformed response |
| `NO-BASELINE` | First observation, or baseline lost |

`CHANGED` and `UNCHANGED` are **only** emissible when the source is `READ`.
There is no path in the vocabulary from "could not see it" to "nothing
happened." The distinction `policy-verification` v1.1 drew between ACCESS
failure and EVIDENCE failure is enforced here at the type level rather than by
analyst discipline, because there is no analyst in the runner.

### C.3 Control 2 — the headline is coverage, never a verdict

Every digest opens with the same line, in the same position:

```
COVERAGE 6/14 READ · 7 WALLED · 1 ERROR · 0 NO-BASELINE
```

Rules, binding:

- **The string "no changes detected" is PROHIBITED unless coverage is
  14/14.** Below full coverage the only permissible summary is the fraction.
- The run asserts `read + walled + error + no_baseline == total`. If it does not
  sum, the run emits `RUN INVALID` and that is a finding in its own right.
- Zero findings is never reported as reassurance. "0 changes across 6 of 14
  sources" is the honest sentence and it is the required one.

This is the whole anti-silence mechanism: Dean cannot glance at a digest and
absorb a false green, because the first thing on it is how much of the board was
dark.

### C.4 Control 3 — the WALLED ROSTER, so expected darkness is not an alarm

Known-walled hosts are declared in the workflow's configuration with their
expected status. Then:

- **`WALLED` + on roster** = expected. Counts toward dark coverage. **Does not
  alert.** congress.gov 403s every night; paging on that would mute the channel
  inside a week.
- **`WALLED` + NOT on roster** = a source that used to work and stopped. New
  information. ROUTINE on first occurrence; escalates on persistence per D.
- **`READ` + on roster** = a wall opened. Genuine state change, genuinely useful
  — a scan window exists that did not before. ROUTINE.
- The roster is reviewed quarterly. A roster that only grows is a system going
  blind on a schedule nobody is watching.

### C.5 Control 4 — DARK LEDGER, which converts an invisible gap into a countdown with a name on it

The job cannot verify walled sources. It can meter their decay and demand the
human sweep. The weekly SITREP carries a mandatory block:

```
DARK SOURCES — TIER 2/3 REQUIRED
host                  backs shipped figure?   last human/browser read   age
congress.gov          yes (H.R. 980 status)   2026-08-02                 12d
DFAS.mil              yes (FY26 pay tables)   2026-08-02                 12d
esd.whs.mil           no                      2026-06-14                 61d  AMBER
```

Escalation, time-based and predictable:

| Age since last tier-2/3 read | Backs a shipped figure | Action |
|---|---|---|
| any | no | Listed weekly. No escalation. |
| ≤ 60 days | yes | Listed weekly. |
| 61–89 days | yes | Weekly, AMBER, named with the figure it backs. |
| ≥ 90 days | yes | Weekly RED **and** a standing issue that stays open until Dean files a tier-3 HUMAN VERIFICATION RECORD. |

**Staleness never FLASHes.** It is predictable by construction — the date is
known 90 days in advance. A predictable 0300 alarm is the definition of noise,
and see N4.

This block should be reconciled against the app's `DATA_VERIFIED` stamp so the
date shown to service members and the date in the ledger cannot drift apart.
Where that stamp lives and who owns bumping it is an open question for the
Commander (E7).

### C.6 Control 5 — widen tier 1, which is the only fix that adds actual coverage

Everything above is honest accounting for blindness. This one removes some of
it. Several walled hosts publish **official machine interfaces from the same
agency** that are not bot-walled:

- **api.congress.gov** — bill actions, status, text versions. Free API key.
  Covers the highest-value dark source on the roster.
- **api.govinfo.gov** — package text including engrossed bills
  (`BILLS-119hr980eh`). Free API key. This is the exact artifact the
  AMENDED-BILL RULE requires, reachable without a browser.
- **federalregister.gov** public JSON API — no key.
- **ecfr.gov** API — machine access where the HTML front end walls.

Left dark with no known machine interface: DFAS.mil, esd.whs.mil, dcsa.mil,
veterans.house.gov, ftb.ca.gov. Those stay on the ledger and stay Dean's sweep.

**Proposed `policy-verification` patch — flagged, not drafted here.** Insert a
rung between tiers 1 and 2:

> **1B. AGENCY MACHINE INTERFACE.** An official API operated by the same agency
> as the primary source IS that primary source and is admissible as citation of
> record. Cite the request URL, the access date, and the document identifier the
> response returns (package ID, bill version code, CFR node). An API response
> that does not identify the document it describes is not a citation. Any
> analyst may run this rung. Third-party mirrors, aggregators, and unofficial
> wrappers are NOT this rung and remain secondary sources.

That is `policy-verification` 1.1 → 1.2, owner s2-intel, **COMMANDER lane**
(benefits/policy content), regression cases required. It materially converts
the single most consequential dark source to lit and it makes the
AMENDED-BILL RULE executable without a browser. Recommend it be taken up as its
own tasking rather than folded into this one.

### C.7 Does this change the severity model?

Yes, in three specific ways.

1. It introduces a third state that is neither finding nor non-finding: **DARK**.
   Severity rules that assume every source resolves to changed-or-unchanged are
   wrong and would either spam or lie.
2. Darkness escalates on **elapsed time**, not on events. That is a different
   trigger shape from every other rule in D, and it is why staleness routes to
   the weekly and never to SMS.
3. It makes "0 findings" permanently unreportable as reassurance. The reassuring
   number is the coverage fraction. That constraint propagates into the digest
   format, which is why D's ROUTINE template leads with COVERAGE.

---

## D. SEVERITY MODEL — FLASH AND ROUTINE

Two tiers. Hard.

**FLASH** — dedicated alert channel, any hour, expects to wake him.
**ROUTINE** — accumulates; one weekly email SITREP at a fixed time.

There is no third tier and none may be added. A "FLASH but hold until morning"
category is ROUTINE wearing a costume, and inventing it is how a two-state model
rots into a five-state model nobody trusts.

### D.1 FLASH — objective criteria, any one sufficient

**F1 — PRODUCTION DOWN.** `transitionops.org` returns non-2xx, or fails to
return a body, on **three consecutive probes at least five minutes apart**.
Single-probe failures are network weather and never FLASH.

**F2 — SHIPPED FIGURE CONTRADICTED.** A source on the citation-of-record list
was `READ` this run and states a value that differs from a figure currently
present in `index.html`. All three conditions required: the fetch succeeded, the
source is a citation of record, and the figure is live in the app. This is the
service-member-gets-wrong-information case and it is the reason the system
exists.

**F3 — SPEND.** Estimated month-to-date spend ≥ **$54** (90% of the $60 target),
or any single day's estimated spend > **$6**. **Restated on the $60 basis by
Dean 3 AUG 2026 (V-14 CLOSED).** The retired "$100 ceiling / $15 per day"
figures were written against the original $75–100 target and are void. The 75%
threshold ($45, which is also the Console email notification) stays ROUTINE — it
is a heads-up, not an emergency.

**F4 — INTEGRITY.** Any write to any ref that Dean did not perform; any push to
`main` not attributable to Dean; a secret-scanning alert; a workflow run
observed holding a credential broader than its declared `permissions:`.

**F5 — ENACTMENT.** A monitored bill referenced in `index.html` reaches
"Became Public Law" or "Passed Senate." Both conditions required: enacted-or-
Senate-passed **and** already cited in the app.

**F6 — CREDIT FLOOR.** Prepaid balance below one month of estimated run rate,
or below $10, whichever is higher. **APPROVED by Dean 2 AUG 2026** per R4/B-1.
Rationale: F3 measures consumption against a ceiling and cannot see a low float.
With auto reload OFF the balance is the binding constraint, so a run can sit at
20% of target and still fail tomorrow on an empty account — taking every model
job with it. Checked by J5; see §8.2.

### D.2 Explicitly ROUTINE — enumerated so it is not re-litigated

A bill introduced. A hearing scheduled. A markup held or noticed. A bill
reported out of committee. A source's page layout or wording changing without a
figure changing. A dead outbound link. A rostered walled source still walled. A
single failed job run. Spend at 75%. A new resource candidate found. A dark
source aging past 60 or 90 days. A wall opening.

Note what F5 excludes: introduction, referral, hearing, markup, and committee
reporting are all ROUTINE. Under `policy-verification`'s AMENDED-BILL RULE, a
pre-passage bill version is not evidence about what will become law. Waking the
Commander over a bill that will be amended eleven more times is noise with a
serious face on it.

### D.3 ANTI-NOISE RULES — binding, not advisory

An alerting system that cries wolf gets muted, and a muted alarm is worse than
no alarm, because a muted alarm still looks like coverage on paper.

**N1 — FLASH BUDGET.** Maximum **2 FLASH per rolling 7 days**. The third and
beyond inside that window are downgraded to ROUTINE and the weekly header reads
`FLASH BUDGET EXCEEDED — n downgraded`. If the budget is hit twice in a quarter,
the criteria are wrong. That is a force-mod patch trigger, not a reason to raise
the budget.

**N2 — DEDUPE.** An identical finding key (rule ID + source host + subject) does
not re-FLASH for 72 hours. A state transition — resolved, then broken again —
resets the clock. A condition that persists is not new information.

**N3 — CONFIRM BEFORE WAKING.** No FLASH from a single observation. Every rule
in D.1 requires either N consecutive confirming observations (F1) or a fetch
that demonstrably succeeded (F2, F5). Transient failure never wakes anybody.

**N4 — NO FLASH FOR ABSENCE.** Inability to check is never FLASH. The walled
roster guarantees daily unreachability; treating that as an emergency destroys
the channel in under a week. Coverage gaps escalate on the schedule in C.5, in
the weekly, in daylight.

**N5 — TWO TIERS, HARD.** If a condition does not justify 0300, it is not
FLASH. Do not create a middle tier. Do not add quiet hours to FLASH — quiet
hours are a confession that the criteria are wrong, applied at the wrong layer.

**N6 — CANARY, because a dead channel is indistinguishable from a quiet week.**
On a fixed monthly date, a test message fires down the FLASH path with the
subject `FLASH CHANNEL TEST`. It does not count against N1. If Dean does not
receive it, the channel is dead and every silent night since that point carries
no information. The weekly ROUTINE carries a channel-health block:

```
CHANNEL HEALTH
last FLASH sent      2026-07-19 (F1, resolved 41m)
last canary          2026-08-01  RECEIVED
daily runs this week 6 / 7  ← MISSED RUN 2026-07-30
```

**The missed-run count is not decoration.** GitHub Actions drops and delays
scheduled runs under load, and disables `schedule` triggers entirely in
repositories inactive for 60 days. A job that has quietly stopped running looks
exactly like a job reporting good news. The weekly asserts the expected count
and any shortfall is itself a finding.

### D.4 Delivery paths

**ROUTINE** — one weekly email, fixed send window (proposed Monday 0700 local;
cron is UTC, so the UTC value must be chosen deliberately and re-checked at DST
transitions, or accept a one-hour seasonal drift and say so). Free fallback
that works on day one with no vendor and no secret: GitHub emails repository
watchers on issue creation, so the Issues sink is already a working ROUTINE
channel.

**FLASH** — needs a path that penetrates Do Not Disturb. Options, with honest
costs:

| Path | Delivers | Cost | Risk |
|---|---|---|---|
| **Pushover, Emergency priority** | Phone push that repeats until acknowledged, with an ACK receipt back to the job | ~$5 one-time per platform | Not SMS. Requires the app installed. |
| **Twilio SMS** | True SMS with delivery status callbacks | ~$1.15/mo number + per-message; **US A2P 10DLC brand and campaign registration required**, days-to-weeks of friction and registration fees | Recurring spend, which is COMMANDER lane; onboarding delay |
| **Carrier email-to-SMS gateway** | SMS, via `number@vtext.com` and similar | Free | **Fails silently.** Carriers have been deprecating these. A gateway that stops delivering is exactly the failure mode N6 exists to catch, and it is the one path that gives no delivery signal at all. |
| **GitHub Mobile push** | Notification | Free, already authenticated | No severity routing, does not break DND |

Recommendation: **Pushover Emergency as the primary FLASH path plus a
simultaneous email.** The acknowledgment receipt is the deciding feature — it is
the only listed option where the job learns whether the human actually got it,
which is what makes N6 measurable rather than ceremonial. If the Commander
requires literal SMS, Twilio, and budget the 10DLC onboarding as real calendar
time. The carrier gateway may serve as a secondary duplicate, never as the sole
FLASH path.

**Do not route operator alerts through OneSignal.** It is the production push
channel to service members. A misconfigured segment sends an internal ops alert
to every user of the app. That is a user-facing incident caused by the
monitoring system, and it is not a hypothetical risk — it is the default failure
mode of reusing a broadcast channel for narrowcast traffic.

### D.5 ROUTINE weekly SITREP — required shape

Mirrors the standing SITREP format so it reads without translation.

```
TRANSITION OPS — WEEKLY WATCH SITREP
COVERAGE 42/98 READ · 49 WALLED · 6 ERROR · 1 NO-BASELINE   (7 daily runs, 6 completed)

CHANGES          findings this week, by severity, with issue links
DARK SOURCES     per C.5 — the ledger, with ages and AMBER/RED
WATCH            open items carried forward
CHANNEL HEALTH   per N6
BURN             estimated spend MTD vs the $60 target (ROUTINE at $45 / 75%)
```

---

## E. OPEN QUESTIONS FOR THE COMMANDER

These are decisions, not research tasks. Each one changes the design.

> **ANSWERED 3 AUG 2026 — V-1 CLOSED, and the premise was wrong.** Branch
> deploys are `[None]`; the deploy history shows Production/main builds only and
> zero branch deploys ever fired. The "live production exposure" asserted below
> **never existed**. Commit `21e25e3` evidenced an author's *intent* to trigger a
> branch deploy, not that branch deploys were enabled — the attempt produced no
> build. Question retained per the correction standard; see §8.7 for the full
> correction. Deploy Previews and plan-level password protection remain
> unconfirmed but are now idle curiosities rather than risks.

**E1 — NETLIFY BRANCH DEPLOYS.** In the Netlify dashboard: are branch deploys
set to all branches, individual branches, or none? Are Deploy Previews on? Is
password protection available on this plan? Commit `21e25e3` is direct evidence
branch deploys have been used. **This is a live production exposure today,
independent of any workflow** — two remote branches may currently be serving
public URLs. Blocks Option 1 entirely; the recommended Option 5 does not depend
on it, but the answer is needed regardless.

**E2 — `netlify.toml`.** Add one, or leave configuration in the dashboard? It is
the only version-controlled control over branch-deploy behavior. It also
**overrides dashboard build settings**, so it must reproduce the current build
command and publish directory exactly — values that exist only in the dashboard
and that only you can read. COMMANDER lane, deploy pipeline.

**E3 — REPOSITORY VISIBILITY AND PLAN.** Public or private, and which GitHub
plan? Determines whether rulesets and branch protection are available (they are
paid features on private repositories) and what artifact retention ceiling
applies.

**E4 — FLASH CHANNEL.** Pushover Emergency (ACK receipt, ~$5 one-time, not SMS),
Twilio (true SMS, recurring spend, 10DLC registration friction), or carrier
gateway (free, silent-failure risk)? Note Twilio spend is **separate from the
$60 Anthropic target** (V-5) — is any recurring vendor spend authorized, and
against what budget?

> **RULED 3 AUG 2026 (SUPERSEDED SAME DAY — retained, see below):**
> `dean.nemecek01@gmail.com` is the ops destination until business-domain
> inbound mail is proven. `dean@veteranbridgesolutions.com` is superseded for
> ops traffic and must not be used until it is demonstrated to receive mail.
>
> **AMENDED 3 AUG 2026 — the condition above was met, not waived.** GitHub's
> address-verification email was delivered to `dean@veteranbridgesolutions.com`
> and confirmed by Dean; that delivery is itself the inbound-mail proof the
> ruling demanded. GitHub's default notification email is now the business
> address.
>
> **Standing ruling: `dean@veteranbridgesolutions.com` is the ops destination.
> `dean.nemecek01@gmail.com` is the fallback.** Gmail is retained rather than
> removed — a single-destination alert path has no continuity if the primary
> fails, which is the same continuity gap this question already raises below.
>
> Scope of the evidence: it proves **GitHub** can deliver to that domain. It does
> not cover a different sender, so an SMTP-action or SendGrid path (§5.1 options
> 2 and 3) remains unproven for that address.
>
> **Record gap:** the exact confirmation time was not supplied — the report read
> "confirmed at [time]" with the placeholder unfilled. Recorded at date
> granularity, which matches the `HUMAN-VERIFIED` record format used elsewhere
> (verifier, date, what was read). No timestamp has been invented. Fill it in if
> you want minute-level precision in the record.
>
> The continuity question below (a second recipient for when Dean is
> unavailable) remains open, and the fallback address does not close it —
> a fallback inbox Dean also owns is not a second person.

**E5 — ALERT ADDRESSES.** Confirm `dean.nemecek01@gmail.com` as the ops
destination, or split ops mail from personal. Confirm the phone number if SMS.
Is there a second recipient for continuity when you are unavailable, or is a
missed FLASH simply a missed FLASH?

**E6 — AGENCY APIs.** Authorize obtaining free api.congress.gov and
api.govinfo.gov keys, and installing them as repository secrets. Separately and
more importantly: **do you accept an agency's own API as a tier-1 citation of
record** (the proposed `policy-verification` 1B rung, C.6)? That is a
benefits-content decision, COMMANDER lane, and it is the single change that most
reduces CI blindness.

**E7 — DARK-SOURCE CADENCE AND `DATA_VERIFIED`.** Is 90 days the right staleness
threshold for a walled source backing a shipped figure? And should the DARK
LEDGER drive the app's `DATA_VERIFIED` stamp, so the date service members see
cannot drift from the date the ledger holds? If yes, who bumps it.

**E8 — FLASH THRESHOLDS.** Confirm or adjust: 90% of ceiling and $15/day (F3);
"Passed Senate" as a FLASH bar, or restrict F5 to "Became Public Law" only; three
probes five minutes apart for production-down (F1).

**E9 — SCOPE OF THE FIRST JOB.** Recommendation is to stand up uptime and
outbound-link liveness first — no policy judgment required — and prove the alert
path end to end before wiring the federal source scan to it. Confirm, or direct
otherwise.

**E10 — OWNERSHIP AND REGISTRY.** Proposed: s3-devops owns the workflow file,
s3-watch-officer owns the new `scheduled-ops` skill, force-mod owns the
`deploy-discipline` 1.3 amendment. Registry entries and regression cases to
follow your approval, not precede it.
---

# PART III — VERIFICATION ITEMS AND SEQUENCING

## 8. VERIFICATION ITEMS

Every unverified fact in this document, itemized. Reconnaissance was halted by
order mid-draft; nothing below was guessed to fill a gap. Tax-model standard:
a marked placeholder is acceptable, an invented figure is not.

| # | Item | Why it matters | Owner | Blocks |
|---|------|----------------|-------|--------|
| **V-1** | **Netlify branch-deploy status for `transitionops.org`.** Are branch deploys enabled? Are `apr2026-policy-refresh` and `resource-directory-may2026` serving public URLs right now? | **Live production exposure today, independent of this design.** Also decides whether PART II Option 1 is ever revisitable. | Dean, Netlify dashboard | Nothing here — but should not wait on this design |
| **V-2** | Current per-token pricing and confirmed model IDs for Haiku 4.5 and Sonnet 5 | Completes §4. Four numbers finish the cost table | s3-devops via `claude-api` skill | Cost sign-off |
| **V-3** | Hard monthly spend limit set in Anthropic Console | The only real enforcement; repo-side metering is advisory | Dean, Console | Standup |
| **V-4** | Which email address GitHub Issues notifications actually reach | Decides whether Issues-native is sufficient for ROUTINE or SMTP is required | Dean, GitHub notification settings | §5.1 choice |
| **V-5** | Twilio number rental + per-message cost; SendGrid/SES free-tier limits | Separate from the Anthropic ceiling; Dean's total monthly spend is the sum | Dean at signup | Budget total |
| **V-6** | Full commit SHAs for `actions/checkout`, `actions/upload-artifact` | Floating tags make a scheduled job non-reproducible and third-party mutable | s3-devops | Workflow authoring |
| **V-7** | Pinned Claude Code CLI version and its headless flag surface (`-p`, `--model`, `--max-turns`, `--output-format`) | §2 YAML assumes a flag set that must be confirmed against the pinned version | s3-devops | Workflow authoring |
| **V-8** | Actions artifact retention ceiling on this repo's plan | §2 sets `retention-days` | Dean/s3-devops | Minor |
| **V-9** | Churn threshold N over 14 runs | §3.5 damping; tune on two weeks of real data, do not guess up front | s3-devops after standup | Post-standup |
| **V-10** | J6 steady-state token cost | Depends on record count and re-verification interval, both undecided in the tax model | s2-intel after ship 1 | J6 activation |
| **V-11** | Repo settings: default workflow permissions read-only; Actions PR creation disabled; Issues enabled; repo visibility and GitHub plan | Decides ruleset/branch-protection availability and confirms the Issues sink is even available | Dean, repo settings | Standup |
| **V-12** | Whether a bot's own commits reset GitHub's 60-day scheduled-workflow deactivation clock | Main hidden cost of PART II Option 4; asserted by nobody | s3-devops, empirical | Option 4 only |

**PLACEHOLDER count: 23 occurrences across 15 lines, spanning §2, §4 and §5.**
None was load-bearing for the boundary ruling — that turned on blast radius, not
price, and R1 has now been made.

### 8.1 STATUS LEDGER

**Log of record for operational V-items.** Per R6, no workflow file may exist
until every standup-gating item below reads CLOSED. Closure requires evidence
recorded in the Result column — not an assertion that it was checked.

| # | Gating? | Status | Owner | Result / evidence |
|---|---------|--------|-------|-------------------|
| V-1 | No | **CLOSED 3 AUG 2026 — NO EXPOSURE EXISTED** | Dean | Deploy history reviewed 3 AUG 2026: **Production/main builds only, zero branch deploys ever fired** despite branches pushed to origin; setting confirms branch deploys `[None]`. The exposure this item asserted was never real. Setting and behavioural record agree, which is stronger than either alone. See §8.7 |
| V-2 | **YES** | **CLOSED 2 AUG 2026** | Orchestrator | Sourced from platform.claude.com models overview, accessed 2 AUG 2026. Sonnet 5 `claude-sonnet-5` $3/$15 per MTok (**intro $2/$10 through 31 AUG 2026**); Haiku 4.5 `claude-haiku-4-5-20251001` (alias `claude-haiku-4-5`) $1/$5, 200K context, 64k max output. See §4 |
| V-3 | **YES** | **CLOSED 2 AUG 2026** | Dean | Verified by Dean directly on the Console billing page. Monthly spend limit **$200,000 default → $100**. Auto reload **OFF**, retained deliberately as a second circuit breaker. Balance **$19.52 prepaid**, card on file. Email notification at **$45** (75% of the $60 operating target). See §8.2 |
| V-4 | No | **CLOSED 3 AUG 2026 — LIVE-FIRE PROVEN** | Dean | **Live-fire run #4 proved the bot-created-issue path** (findings #6, ROUTINE); run #3 proved the FLASH path (#5). The only unproven leg is whether those issues generated mail — per §8.8/§8.6, #6 is the witness, not tomorrow's cron, which emails only if a diff happens to occur. *Original finding, retained:* Issue #1 generated no notification; repo watch sat at the default Participating and @mentions, which a bot-filed issue does not satisfy. Fix: watch set to All activity; destination amended same day to `dean@veteranbridgesolutions.com` (primary), `dean.nemecek01@gmail.com` (fallback). |
| V-5 | No | OPEN | Dean | Twilio + mail vendor costs, separate from the $60 |
| V-6 | **YES** | **CLOSED 2 AUG 2026** | Orchestrator | `actions/checkout` v7.0.1 → `3d3c42e5aac5ba805825da76410c181273ba90b1`; `actions/upload-artifact` v7.0.1 → `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a`. Both refs resolve to type `commit` — no tag dereference needed. Source: api.github.com git/ref, 2 AUG 2026 |
| V-7 | **YES** | **CLOSED 2 AUG 2026** | Orchestrator | CLI **2.1.220** (local `claude --version`, matches `npm view @anthropic-ai/claude-code version`). Flag surface verified against that build: `-p/--print`, `--model`, `--output-format`, `--permission-mode`, `--allowed-tools`, `--effort`, `--fallback-model`, `--max-budget-usd` all exist. **`--max-turns` does NOT exist** — the §2 draft was wrong; corrected |
| V-8 | No | OPEN | Dean/s3-devops | Artifact retention ceiling, plan-dependent |
| V-9 | No | DEFERRED | s3-devops | Churn threshold; tune on two weeks of real data, do not guess |
| V-10 | No | BLOCKED on ship 1 | s2-intel | J6 steady-state cost; model not implemented |
| V-11 | **YES** | **CLOSED 3 AUG 2026** | **Dean** | Verified by Dean directly in repo settings: default workflow permissions **read-only**, "Allow GitHub Actions to create and approve pull requests" **unchecked**, Issues **enabled**. The Issues sink (R1) is therefore available and the token default is least-privilege |
| V-12 | No | **OPEN — RESCOPED 3 AUG 2026** | s3-devops | **The earlier note ("only relevant if Option 4 is ever revisited") is withdrawn.** It scoped this to the separate-intel-repo option, which R1 rejected — but the 60-day deactivation mechanism applies to any repo carrying a `schedule` trigger, and J1 is now live on `main` here. The open question is unchanged and now load-bearing: does the Issue activity J1 generates reset the clock, or only commits? See **W-1** in §8.5 |
| **V-13** | **YES** | **CLOSED 3 AUG 2026** | Dean | APPROVED as drafted with two corrections, both applied: safe example now uses `--max-budget-usd` (per V-7, `--max-turns` does not exist), and the tool flag is `--allowed-tools` — **verified on CLI 2.1.220, where `--allowedTools` and `--allowed-tools` are accepted aliases**; kebab-case chosen for consistency. `deploy-discipline` **1.2 → 1.4**, integer 1.3 burned |
| **V-14** | **YES** | **CLOSED 3 AUG 2026** | Dean | F3 restated on the $60 basis: FLASH at **$54** month-to-date (90%) or any single day over **$6**. F6 credit floor already applied 2 AUG |
| **V-15** | **YES** | **CLOSED 3 AUG 2026** | Dean / Orchestrator | `validation-gate` **1.2 → 1.3** applied. Regression cases **Y1–Y5 EXECUTED, not merely specified** — see §8.4. force-mod argued this item must close on execution rather than on the text landing, because it is the gate standing between this repo and its first workflow commit. Agreed and done |

**Standup-gating status, 3 AUG 2026: 0 of 8 open. ALL CLOSED.**
V-2, V-3, V-6, V-7 closed 2 AUG. V-11, V-13, V-14, V-15 closed 3 AUG.

**R6 is therefore satisfied and the authoring ban lifts.** J1 may be authored,
on a branch, gated, staged, and merged by Dean — in that order and no other.

### 8.4 V-15 REGRESSION EVIDENCE — Y1–Y5 EXECUTED 3 AUG 2026

Run against Psych 3.1.0 / Ruby 2.6.10 with the prescribed command.

| Case | Fixture | Expected | Actual | Verdict |
|---|---|---|---|---|
| Y1 | Valid workflow YAML | PASS | `YAML OK`, exit 0 | PASS |
| Y2 | **Valid YAML, semantically garbage** (`runs-on: ubuntu-latest-does-not-exist`, `actions/checkout@v999`) | **PASS** — proves the scope boundary is deliberate | `YAML OK`, exit 0 | PASS |
| Y3 | Malformed (unclosed flow sequence) | FAIL | `Psych::SyntaxError ... line 5 column 8`, exit 1 | PASS |
| Y4 | Tab in indentation | FAIL | `Psych::SyntaxError ... line 3 column 1`, exit 1 | PASS |
| Y5 | Multi-document | PASS, both docs seen | `parse_stream` → 2 docs; `YAML.load` → 1 | PASS |

Two facts established by execution that the draft could only assert:

- **The YAML 1.1 trap is real.** A workflow's top-level keys parse as
  `["name", true, "jobs"]` — the bare token `on` really does become boolean
  `true`. Recorded in the skill so nobody burns a run on it.
- **A mixed invocation fails correctly.** One malformed file passed alongside a
  valid one exits 1, so the step cannot half-pass.

**Defect found while executing, now written into the skill:** piping the parse
command (`ruby ... | head`) makes `$?` report the pipe's last command, so a
`Psych::SyntaxError` prints and the step still exits 0. Caught because the first
harness did exactly that and showed `exit=0` on the two cases that must fail.
The command is correct; the invocation pattern is the hazard, and step 4 now
says so explicitly.

**Baseline confirmed authoritatively.** force-mod flagged its "repo tracks zero
YAML" claim as a glob observation. `git ls-files '*.yml' '*.yaml'` returns zero
files at `87d9f48` — the claim holds, and the skill now cites the command rather
than the observation.

### 8.2 BUDGET INSTRUMENTATION — as verified 2 AUG 2026

Recorded from Dean's direct Console review (V-3 evidence).

| Control | Value | Type |
|---|---|---|
| Operating target (R4) | **$60/mo** | Doctrine — this design's budget |
| Console email notification | **$45** (75% of target) | Advisory, vendor-sent |
| Console monthly spend limit | **$100** | Hard stop, vendor-enforced |
| Auto reload | **OFF** | Second circuit breaker, deliberate |
| Prepaid balance | **$19.52**, card on file | See the finding below |

**The Console limit is not the budget.** $100 is a catastrophe stop sitting 67%
above the $60 operating target. Nobody reading this later should treat $100 as
the spend allowance — R4 governs, and the gap between them is deliberate
headroom, not permission.

**FINDING B-1 — the effective ceiling today is $19.52, not $100.**
With auto reload OFF, the binding constraint is the prepaid balance, not the
spend limit. The $100 limit cannot bind before the balance is exhausted, because
the balance is a fifth of it.

> **CORRECTION, 2 AUG 2026 (V-2 closed).** The first draft of this finding said
> $19.52 was "plausibly under one month of operation." **That was wrong** — it
> was written before pricing was sourced. At the §4 run rate of ~$2.32–2.72/month
> the balance covers roughly **seven months**, and even at 10× the estimate it
> covers two. B-1 stands as a structural finding — balance, not the spend limit,
> is what actually stops the system — but it is **not** the near-term emergency
> the original wording implied. The credit floor (F6) is the right control at
> the right urgency; nothing here needs doing this week.

That is not an argument for turning auto reload on — keeping it off is a sound
second breaker and Dean retained it deliberately. It is an argument for naming
the consequence: **balance exhaustion stops every model job.** J1 fails, J2
never fires, J4 and J5 stop. The monitoring system dies quietly at exactly the
moment nobody is watching it.

Two things already in the design blunt this, and one gap remains:
- **Already covered:** J1's `if: failure()` step opens a FLASH issue through
  `GITHUB_TOKEN`, which has no dependency on Anthropic credit. The failure path
  survives an exhausted balance.
- **Already covered, by accident worth keeping:** J3 (weekly SITREP) was made
  **model-free** in §1 because paying a model to concatenate a list is waste.
  That decision means the dead-man's switch in §5.3 keeps firing even with zero
  Anthropic balance. Do not "improve" J3 by adding a model to it.
- **GAP:** nothing monitors the balance itself. Spend-based criterion F3 measures
  consumption against a ceiling; it does not detect a low float. A run could sit
  at 20% of target and still fail tomorrow on an empty balance.

**Proposed, NOT self-applied** — a balance floor belongs in J5 and, if it is to
wake Dean, as a FLASH criterion. R3 makes FLASH criteria a fixed checklist and
COMMANDER lane, so this folds into the **V-14** ruling rather than being written
in. Candidate: *F6 — CREDIT FLOOR. Prepaid balance below one month of estimated
run rate, or below $10, whichever is higher.*

**Derived spend ladder, for the V-14 ruling.** Dean's $45 notification is 75% of
$60 and matches §D.1's existing "75% stays ROUTINE" line exactly. Restating F3
on the $60 basis therefore produces a coherent three-tier ladder with no
invention required:

| Trigger | Value | Severity | Enforced by |
|---|---|---|---|
| 75% of target | $45 | ROUTINE — weekly SITREP | Console email + J5 |
| 90% of target | $54 | **FLASH** — SMS | J5 |
| Hard stop | $100 | Spend halts | Anthropic Console |
| Credit floor | proposed F6 | **FLASH** — SMS | J5 |

Still Dean's ruling under R3. Recorded here so V-14 is a yes/no, not a redesign.

### 8.3 API KEY — DEFERRED DELIBERATELY

The account is funded and live. **API key generation is deliberately deferred to
the workflow-standup step** (Dean, 2 AUG 2026). Correct sequencing: a key that
exists before anything can use it is only an exposure window.

Nothing currently blocked by this. V-2, V-6 and V-7 are reconnaissance items
needing no key. The key is required only for the first live run, at which point
it goes directly into GitHub repository secrets as `ANTHROPIC_API_KEY` — pasted
by Dean into GitHub, never into a chat, a file, or a commit.

---

### 8.7 V-1 CLOSED — THE EXPOSURE DID NOT EXIST, 3 AUG 2026

**Evidence (Dean, direct review, 3 AUG 2026).** Netlify deploy history shows
**Production/main builds only. Zero branch deploys have ever fired**, despite
branches having been pushed to origin. The dashboard setting confirms branch
deploys are **`[None]`**.

**This is stronger evidence than a setting alone.** The configuration says
branch deploys are off, and the behavioural record says none ever ran even when
branches existed to trigger them. Setting and history agree. A setting can be
misread or recently changed; a deploy history covering the period when those
branches were pushed cannot be. Together they close the question rather than
merely answering it.

#### CORRECTION — I asserted an exposure that never existed

I raised V-1 across several SITREPs as *"a live production exposure today"* and
wrote that `apr2026-policy-refresh` and `resource-directory-may2026` **"may
currently be serving public URLs."** **That was wrong, and it was the strongest
claim in the document.**

The inference came from commit `21e25e3`, titled *"Trigger Netlify branch
deploy."* I read a commit title as evidence that branch deploys were **enabled**.
It is only evidence that someone once **intended** to trigger one — the deploy
history now shows the attempt never produced a build. A commit message records
what an author meant to happen, not what the platform did. I treated authorial
intent as platform state.

The error was compounded by being unfalsifiable from where I sat: `netlify.toml`
does not exist in the repo, the Netlify MCP tool was unavailable, and I said so
each time. Flagging an unverifiable risk is legitimate. Repeatedly escalating it
as *live* while unable to test it was not proportionate, and it consumed
attention that had a real cost — V-1 was carried as urgent through four
SITREPs.

Per the correction standard the original wording is struck rather than deleted:
see the withdrawn BLUF bullet in §0 and the E1 open question in PART II §E.

#### THIS DOES NOT REOPEN OPTION 1

Anticipating the obvious next question. PART II §A.1 rejected the restricted
branch-namespace option for **two** independent reasons:

1. **`permissions:` cannot scope writes to a ref prefix.** The token grant is
   repository-wide, so the workflow's restraint is a convention inside the file
   rather than an enforced boundary. The only real enforcement is a repository
   ruleset, whose availability on this plan is still unconfirmed.
2. Netlify branch deploys might publish unreviewed content.

**V-1 removes reason 2 only.** Reason 1 was the decisive one and is untouched.
Option 1 stays rejected, R1 stands, and J1 is already live on the Issues sink —
nothing here is reopened. Recorded explicitly so a future reader does not treat
"V-1 closed" as grounds to revisit a settled ruling.

**One control worth keeping in view.** §A.1 noted that a `netlify.toml` with
`[context.branch-deploy] ignore = "exit 0"` would be the only
**version-controlled** control over branch-deploy behaviour. Today's state is
correct but lives entirely in the dashboard, where it is invisible to review and
changeable without a diff. Not a recommendation — the risk is now known to be
nil — but if branch deploys are ever turned on, that file is how it should be
governed.

---

### 8.8 LIVE-FIRE OUTCOME — RUN #4 GREEN, 3 AUG 2026

**Run #4: green, 50 seconds.** The first end-to-end success.

| Leg | Evidence | Verdict |
|---|---|---|
| Secret → runner → headless `claude` | Haiku, 7 turns | **PROVEN** |
| Cost cap | **$0.065** against the `--max-budget-usd 0.50` cap | **PROVEN** |
| Prompt + JSON contract | coverage `2/2/2/0`, schema honoured | **PROVEN** |
| Instruction-source boundary | `contains_instruction_like_text: false` on both sources | **PROVEN** (see caveat) |
| ROUTINE producer | **Issue #6**, ROUTINE label, first intelligence product | **PROVEN** |
| Guard / failure path | Run #3: guard refused, **FLASH #5** filed with reason folded in | **PROVEN** |
| Email leg | **5 notification emails delivered** to `dean@veteranbridgesolutions.com`, incl. "J1 findings 2026-08-03 (Issue #6)" at 08:49 with the full findings body, plus FLASH and SITREP traffic | **PROVEN 3 AUG 2026** |

**First intelligence product.** Issue #6 carries the Dole Act §403 homeless-veteran
implementation plan and the Veterans Choice rescission. The system produced
something a service member's caseworker would want to know. That is the point of
all of this.

**§8.6 PRODUCER GAP: CLOSED.** Option A shipped and fired. The ROUTINE channel
now has a recurring bot-created-issue producer, evidenced by #6.

#### WHAT RUN #4 DID NOT PROVE — read before drawing conclusions

**1. Change detection against a populated baseline is still untested.**
Coverage reported **2 changed of 2**. Two readings fit:
- **(a)** #1 was empty going in, so both sources registered as new — the
  **first-run** path, not the diff path.
- **(b)** #1 held two real hashes, one was corrupted, and a natural diff supplied
  the second.

Given runs #1–#3 all fetched zero bytes, **(a) is much the likelier**: there was
never a successful fetch to populate #1 with. If so, run #4 exercised
"everything is new" — the same code path as a first run — and the compare logic
against known prior hashes has still never executed. **Tomorrow's 09:00 UTC cron
is the first genuine test of it.**

**2. The instruction-boundary result is a weak pass, not a strong one.** Both
sources returned `false`, which is the correct answer for two benign Federal
Register feeds. It confirms the field is wired and the model answers it. It does
**not** demonstrate the boundary holds against a page that actually contains
injection-shaped text, because no such page was in the sample.

**3. Issue #1's post-run contents were not independently confirmed** — the
report's `[confirm after checking]` bracket arrived unfilled, so nothing is
asserted from it. **But run #4's green status is itself strong evidence:** the
guarded write refuses and fails the job unless the manifest holds at least as
many sources as `j1-sources.txt` defines. A green run means the guard passed with
`actual >= 2`, and the write targets pinned issue #1. **#1 therefore holds two
real hashes** — inferred from the workflow's own control flow, not from the
unfilled bracket.

#### EVERY LEG IN THE TABLE ABOVE IS NOW PROVEN BY LIVE FIRE — 3 AUG 2026

With the email leg closed, every row in the §8.8 table reads PROVEN. Secret to
runner, headless model execution, cost cap, prompt and JSON contract, ROUTINE
producer, guard and failure path, and notification delivery have all executed for
real and been observed. **The system works end to end.**

Two honest qualifications on "every leg," both already recorded above and neither
a reason to withhold the claim:

- **The instruction-boundary pass remains weak** (§8.8 item 2). It is proven
  *wired*, not proven *load-bearing under attack*, because no injection-shaped
  page was in the sample. Upgrading that needs an adversarial input, not another
  clean run.
- **The true-diff path is still unexecuted** (§8.8 item 1) — see below.

#### SCHEDULED FOR 4 AUG 09:00 UTC — THE LAST UNTESTED PATH

Dean is planting the corruption in #1 so the scheduled run exercises
change-detection against a **populated** baseline. Worth naming what that flight
actually covers, because it is two things, not one:

1. **The true diff path.** Every run so far compared against an empty or absent
   baseline — the first-run path, where everything is new. Comparing a real hash
   against a *different* real hash has never executed.
2. **The scheduled trigger itself.** Run #4 was a `workflow_dispatch`. Manual
   dispatch proves the *job*; it does not prove the *trigger*, which is a
   different code path. Tomorrow is the first time the cron is the thing under
   test.

**Expected: `changed sources: 1`** — exactly the corrupted source — and a findings
issue naming it. A count of 2 means a natural diff rode along, which is fine.
A count of 0 means the corruption did not land in the fenced JSON block. A job
that never runs at all is the interesting failure, and points at the trigger
rather than the logic.

#### FIRST REAL COST TELEMETRY — against the §4 estimate

$0.065 for one scan-firing run. If a diff occurs daily, J1 costs ≈ **$1.95/month**
against the §4 estimate of $1.44 for the whole job. Same order of magnitude, mildly
above — and §4 explicitly called itself a floor because it did not model Claude
Code's per-turn system-prompt and tool-schema overhead. First evidence the cost
model is sound in shape. Nowhere near the $60 target.

---

### 8.6 NOTIFICATION PATH — V-4 FINDING, 3 AUG 2026

**What happened.** J1's manual dispatch created Issue #1 successfully. **No
notification was generated.** Repo watch sat at GitHub's default, *Participating
and @mentions*, and a bot-filed issue does not qualify — Dean is not a
participant in something the runner opened, and the runner cannot @mention him
into one. Fixed by setting watch to **All activity**. Destination was first
ruled to Gmail, then amended the same day to
`dean@veteranbridgesolutions.com` once GitHub's verification email proved
inbound delivery to that domain; Gmail is retained as fallback. See E5.

**Why this matters beyond the setting.** §5.1 rated GitHub Issues native
notification as *"works day one, zero setup."* **That was wrong.** It carried an
unstated prerequisite, and the prerequisite failed silently. The issue was filed
correctly, the job succeeded, and the channel was dead — which is precisely the
class of failure this design exists to prevent, occurring on the very first
issue the system ever produced. §5.1's table is left as written with this
correction attached, because the mis-rating is part of the record.

#### THE PLANNED LIVE-FIRE WILL NOT PROVE THIS — flagged before the run, not after

Dean's stated proof is *"tomorrow's scheduled run's baseline update must generate
email."* It will not, for a mechanical reason:

Issue #1 already exists, so `BASELINE_ISSUE` is non-empty and J1 takes the
`gh issue edit` branch, not `gh issue create`. **GitHub's notification model
fires on issue creation, comments, state changes, assignment, and mentions — not
on body edits.** A baseline update rewrites the body of an existing issue and is
expected to be silent. If tomorrow produces no email, that is the *expected*
result of an edit and says nothing about whether the watch fix worked. Reading it
as "still broken" would be a false negative.

**A second, larger gap found while checking this.** J1 as authored **files no
findings issues at all.** Its only issue-creating paths are the first-run
baseline creation (already spent on Issue #1) and the `if: failure()` FLASH
report. Scan output goes to `out/scan-result.json` inside an artifact and stops
there. So the ROUTINE notification channel currently has **no producer** — there
> **CLOSED 3 AUG 2026.** Option A shipped; run #4 filed findings issue #6 with
> the ROUTINE label. The channel has a producer. See §8.8.

is no recurring event that would notify Dean even with the watch fixed. That was
arguably outside "author J1 per the pinned template," since the template did not
include a findings-filing step, but it means the channel cannot be exercised by
normal operation today.

**Options for an actual live-fire — Dean's ruling required, nothing applied:**

| # | Approach | Proves it? | Cost |
|---|---|---|---|
| A | Add a findings-filing step to J1 so a real diff creates an issue | Yes, and it closes the producer gap | A change to a live workflow, COMMANDER lane |
| B | One-off: temporarily have the next `workflow_dispatch` create a throwaway test issue, then close and delete it | Yes — bot-created, same path as the real thing | Small, reversible, but a deliberate test artifact in the repo |
| C | Dean opens an issue himself | **No.** GitHub does not notify you about your own actions — this false-negatives too | Zero, and misleading |
| D | Wait for the failure path to fire naturally | Yes, but only on a failure, and it may not come for weeks | Zero, unbounded latency |

**Recommendation: B now, A next.** B proves the channel cheaply and immediately;
A is the real fix and belongs in the next J1 increment alongside the findings
format. Option C is listed only so it is not tried — self-generated activity
never notifies, and it would produce a second false negative on top of the first.

**Cross-reference W-1.** W-1 rates the §5.3 dead-man's switch as covering the
60-day deactivation risk because "a missing Monday email is itself the alarm."
That rating **depends on the email path being proven**. An unproven channel makes
absence-of-email meaningless as a signal. Until V-4 closes on live-fire evidence,
W-1's detection claim is provisional.

**RESOLVED 3 AUG 2026 — W-1 detection rating upgraded to CONFIRMED.** Five
GitHub notification emails were delivered to `dean@veteranbridgesolutions.com`,
including "J1 findings 2026-08-03 (Issue #6)" at 08:49 carrying the full findings
body, plus FLASH and SITREP traffic. The email path is proven end to end, so
**absence of email is now a trustworthy signal** and the §5.3 dead-man's switch
does what W-1 relies on it to do. V-4 CLOSED.

**One precision point, because it protects a future decision.** The report frames
this as disproving "own-activity suppression" for bot-created issues. Strictly,
that theory was never applied to bot-created issues: Issue #1's silence was
diagnosed as a **watch-level** problem — the default *Participating and @mentions*
does not cover an issue a runner opened — and that diagnosis is now **confirmed**,
not overturned. Own-activity suppression was raised only against **Option C, where
Dean opens an issue himself**, and `github-actions[bot]` is a different actor
entirely.

**So Option C's warning still stands and is still untested.** Nobody should read
this result as licence to prove a future notification question by filing an issue
by hand — that path remains capable of false-negating for a different reason than
the one just cleared.

**UPDATED 3 AUG 2026 — the witness is #6, not tomorrow's cron.** The email leg is
still the only unproven leg, but the plan to prove it via tomorrow's 09:00 UTC run
is unreliable:

- **J1 only files an issue when a diff occurs.** With #1 now holding real hashes,
  tomorrow emails only if the Federal Register actually publishes something in the
  intervening ~19 hours. Likely on a business day, not guaranteed. **No diff means
  no issue, means no email — which would look identical to a broken email leg.**
- **J3 cannot cover for it.** Its cron is Mondays 13:00 UTC; that slot passed at
  13:00 today, so the first SITREP fires **10 AUG**, a week out.
- **Issue #6 already is a bot-created issue.** If it generated mail to
  `dean@veteranbridgesolutions.com`, the email leg is proven *now* and W-1 can be
  upgraded today. If it did not, that is the finding — and it is a finding we
  already have in hand rather than one waiting on a coin flip.

**Recommended: check whether #6 (and FLASH #5) produced email, and close V-4 on
that.** Tomorrow's cron is then a useful second data point rather than the sole
witness.

---

### 8.5 WATCH ITEMS

Standing hazards that are not V-items: nothing to verify and close, only
something to keep watching. Added 3 AUG 2026.

#### W-1 — GITHUB DISABLES SCHEDULED WORKFLOWS AFTER ~60 DAYS OF REPOSITORY INACTIVITY

**Cross-reference: V-12.** GitHub disables `schedule` triggers in repositories
that go inactive for roughly 60 days. J1 is live on `main` as of 3 AUG 2026, so
this now applies to **this** repository — not to a hypothetical one.

**The tension worth naming.** Ruling R1 makes J1 deliberately never commit; that
is the safety property, and it is structural — the job holds no credential that
can write a ref. But "never commits" is precisely the condition that lets the
inactivity clock run. **The safety property and the liveness property pull
against each other**, and nothing in this design resolves that. It is accepted,
watched, and written down here so a future reader does not rediscover it as a
surprise.

J1 writes GitHub Issues, not commits. Whether Issue activity resets the clock is
exactly what V-12 asks — and V-12 is no longer hypothetical or Option-4-only.

**Detection rating: CONFIRMED as of 3 AUG 2026** (was provisional). V-4 closed on
live-fire evidence — five notification emails delivered, including the findings
issue for run #4. The email path is proven, so absence of email is a trustworthy
signal and the reasoning below now rests on demonstrated behaviour rather than an
assumption.

**Detection, honestly rated.** The §5.3 dead-man's switch does cover this, but
weakly. If GitHub disables scheduled workflows, it disables **all** of them — J3,
the weekly SITREP, dies with J1. No Monday email arrives, and per §5.3 a missing
Monday email is itself the alarm. So the failure is detectable. But:

- Latency is up to **seven days**.
- It depends on Dean noticing a **non-event**, which is the weakest kind of
  alarm there is.
- Every model job is dark for that entire window.

**Mitigations, none chosen.** Dean's merge cadence has kept the repo active well
inside 60 days and probably will continue to. GitHub also emails before
disabling. A deliberate periodic commit would reset the clock, but agents cannot
push (deploy-discipline 1.4 PROHIBITED), so that would be a Dean action, not an
automated one. Doing nothing and relying on the weekly SITREP is a legitimate
choice given the merge cadence — it is just a choice, and this entry exists so it
is made rather than defaulted into.

**Review trigger:** any stretch where Dean expects to be away from the repo for
more than a month — deployment, extended travel, a quiet period between ships.

---

## 9. WHAT DEAN IS ACTUALLY BEING ASKED

Three rulings. Everything else is downstream.

1. **The boundary.** Approve the findings sink. force-mod recommends PART II
   Option 5 — Issues + pinned baseline + artifact evidence, `contents: read`,
   no PAT, no ref write possible. Alternatives ranked in PART II §A.7.
2. **The doctrine framing.** Restatement or exception? force-mod argues
   restatement — "no agent chooses a write target at runtime" — because an
   exception is a precedent that invites argument-by-analogy from the next case.
   Proposed `deploy-discipline` v1.3 text is in PART II §B.2.
3. **Scope of the first standup.** Recommend J1 + J3 + the baseline issue only.
   Prove the loop end to end — detect, remember, report, and notice its own
   failure — before adding J2, J4, J5. J6 stays dormant regardless.

Plus one that is not this design's to decide but should not wait: **V-1**.

---

## 10. SEQUENCING, ON APPROVAL

1. Dean rules on §9 items 1–3 and answers PART II §E.
2. Dean sets V-3 (Console limit) and V-11 (repo settings). Nothing runs first.
3. s3-devops closes V-2, V-6, V-7 — the only remaining fetch-dependent items —
   under explicit fetch approval.
4. `deploy-discipline` v1.3 and the proposed `scheduled-ops` skill are drafted
   and gated as doctrine ships. COMMANDER lane.
5. Workflow files authored for the approved standup scope only, on one branch,
   validation-gate EDIT MODE, staged local. Dean merges and pushes.
6. First run observed under `workflow_dispatch` before any `schedule` line is
   allowed to fire unattended.
7. Two weeks of real data, then tune V-9 and revisit J2 gate assumptions.

**Note on step 5, and it is the reason PART II §B matters:** authoring these
files is itself the first act governed by the amended doctrine. Under v1.2 as
written, an agent cannot hand Dean a workflow that pushes, because an agent
cannot push at all. The doctrine has to land before or with the workflows, not
after them.
