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

### R7 — J2 MAY CORRELATE, NEVER RATE; AND ITS FLASH POWER SHIPS WITH ITS GOVERNORS
**COMMANDER, 3 AUG 2026.** Resolves the tension between §C.2 ("a scheduled job
never rates, and its vocabulary makes that impossible") and the §1 roster, which
gives J2 the `policy-verification` skill and a Finding-issues output.

The two were never in conflict. §C.2's six words are an **observation** vocabulary
about a *fetch*. `policy-verification`'s CONFIRMED / PROBABLE / BLOCKED /
UNVERIFIED are **verdicts** about a *claim*, and a verdict is a ship license.
Between them sits a third thing neither section named — **description without
adjudication** — which J1 already performs under Haiku (`what_changed`,
`quoted_excerpt`) without breaching §C.2.

The ban on rating is **structural, not stylistic**: `policy-verification` line 63
holds that a claim may be rated below CONFIRMED only after ladder tiers 1–3 fail,
and CI has only tier 1. Every rating a runner could emit is premature by
construction. That is why it is enforced at the type level (W7) rather than left
to analyst discipline — there is no analyst in the runner.

**J2 emits, and only these four:**

| Verdict | Meaning |
|---|---|
| `CORRELATED` | Changed source names a figure also live in `index.html`; both sides quoted, values agree |
| `NO-APP-EXPOSURE` | Changed source touches nothing the app currently claims |
| `DIVERGENT` | Correlated **and** the values differ — the §D.1 F2 trigger, and the only J2 output that can reach FLASH |
| `NEEDS-LADDER` | Not settleable at rung 1; routes to Dean's desk. **Replaces** what would have been a rating. Not `BLOCKED` — that is a rating, and per `policy-verification` line 47 it is not a resting state |

**Reserved to interactive sessions and the Commander's desk:** all four rating
words; AMENDED-BILL adjudication (J2 may *report* the trigger — "as amended" in
actions, or a changed title — but never conclude what a bill does); ship/no-ship
recommendations; user-facing copy; writes to `intel/verification-log.md`;
`DATA_VERIFIED` bumps; HUMAN VERIFICATION RECORDs.

**The verbatim bar on DIVERGENT.** A DIVERGENT finding requires the source's own
words *and* the app's own words, quoted exactly, with the `index.html` line
number — and the workflow **checks the app-side quote against the actual file**.
If either side cannot be quoted verbatim, the finding is `NEEDS-LADDER`. This is
the control that would have caught the H.R. 980 failure of record: nobody lied
there, somebody paraphrased.

**Why J2 exists at all:** J1 diffs sources against a hash table and never reads
the app. J2 is the only job that sees both sides, which is the entire reason it
costs Sonnet money. Without it §D.1 **F2 is unimplemented** and the FLASH
criterion that is "the reason the system exists" is decorative.

**Condition attached by the Commander:** J2 is the first job able to FLASH on
**content** rather than on its own failure. The §D.3 **N1 (2 FLASH per rolling 7
days) and N2 (72h dedupe) governors therefore ship in the same merge as the
FLASH power**, or J2's cron stays off. A manual test-fire may precede the
governors; the schedule may not. Governors are enforced in the shell, never by
the model — a model that can talk itself past its own rate limiter is not rate
limited. **Tracked as V-16.**

**Budget:** `--max-budget-usd 3.00` per run. Arithmetic at §4 and in the workflow
header. Hard stop, not advisory: exceeding it fails the run and fires the FLASH
failure reporter.

**Worth noting what R1 bought:** choosing the Issues sink removes **V-1 off the
critical path entirely.** Netlify branch-deploy status no longer gates anything
here, because nothing in this design writes a ref. V-1 remains urgent on its own
merits as a live production exposure — it is simply no longer this design's
blocker.

---

## 0.6 COVERAGE CHARTER — COMMANDER, 5 AUG 2026

**Standing doctrine. Binding on every source decision from this date forward.**

### The aim

Transition OPS is to be the **FIRST LINE of awareness** for every new policy
materially affecting transitioning service members and their families. Not a
mirror of what the advocacy press already covered. The origination point.

**Core value: IMPACT.** A source earns its place by changing what a service
member does, not by adding a row to a coverage table.

**The fleet's sector of fire grows to match the mission — deliberately, and
source by source.** Every addition is a one-line diff to `.github/j1-sources.txt`
that the Commander rules on individually. There is no bulk enrollment.

### The audience, stated so it can be applied

Transitioning service members of all branches, **Guard and Reserve**, and
**military spouses and families**. Sources are judged against that population,
not against "veterans" as a category. A feed rich in general veteran news and
thin on separation, relocation, licensure, hiring, and family benefits scores
poorly here regardless of how official its publisher is.

### The three tests — every source, no exceptions

1. **Complexity.** What does it add to a system that must stay comprehensible?
2. **Maintenance.** Who notices when it silently breaks, and how?
3. **Genuine user need.** What does a service member do differently because we
   caught this?

A source failing any one test is declined. Recording *why* it was declined is
mandatory, so it is assessed once rather than re-litigated every quarter.

### The governing constraint

**Coverage growth never outpaces verification capacity.** J1 detects; it does
not verify. Every detection that touches a benefits, policy, or dollar figure
still lands on a human at rung 2 or 3 of the `policy-verification` ladder, and
that human is Dean. Doubling intake without doubling that capacity does not
double awareness — it manufactures a backlog and calls it coverage.

**Being first with something WRONG is the one outcome worse than being second.**
Where speed and accuracy conflict in this system, accuracy wins, and it is not a
close call. Wrong transition information causes direct harm to service members.

### The live-verification rule — the slug lesson

**No URL enters `j1-sources.txt` until it has been fetched live and its response
observed.** Status code, content type, body size, and the newest item's own
timestamp are recorded in the assessment before the Commander rules.

This is not ceremony. J1 shipped a defect from a Federal Register agency slug
that was plausible, well-formed, and wrong — it returned a body, so nothing
failed loudly, and the source was structurally dark while appearing green. A
source that cannot be shown to have returned real content is **UNVERIFIED** and
is not eligible for any tier.

### The tier model

| Tier | Meaning |
|---|---|
| **Tier 1 — ADD NOW** | High signal, transition-central, verified live. Enters the scan on the Commander's ruling. |
| **Tier 2 — OBSERVE 30 DAYS** | Plausible value, unproven churn or signal ratio. Assessed against real behaviour before it costs anything, then re-ruled. |
| **Tier 3 — ASSESSED AND DEFERRED** | Declined, **with the reason recorded.** Deferred is a decision, not a backlog. |

A tier-2 source that reaches its 30-day mark without an assessment does not get
promoted by default. Silence is not consent; it is an unfinished assessment.

### What this charter does not change

Never-push (R1a). The Issues sink and `contents: read` (R1). J2 correlates and
never rates (R7). The two-tier severity model and its N1–N6 governors (§D). The
walled roster and the dark ledger (§C.4, §C.5). **Growth in intake is not a
licence to relax any control that exists to keep intake honest** — and the
anti-noise governors get *more* load-bearing as volume rises, not less.

---

## 0.65 THE MOBILE LANE — COMMANDER RULING, 5 AUG 2026

**AUTHORIZED. Standing lane definition.** Cloud sessions may run against this
repository for **verification, analysis, and documentation work**.

### 0.65.1 What the lane permits

| | |
|---|---|
| **Permitted work** | Verification, analysis, documentation. Reading, research, drafting, gating. |
| **Push rights** | **Branches only, from cloud sandboxes.** |
| **`main`** | **Never.** No agent pushes `main` from any environment, ever. |
| **Merge authority** | **Unchanged — Dean's, exercised via GitHub mobile.** The lane changes who may create a remote branch. It changes nothing about who merges. |
| **Secrets-requiring work** | **Desk-only.** Does not enter this lane. |

### 0.65.2 The standing-up condition

**The first mobile session must verify that the validation gate actually runs in
the sandbox, and report the result.** Until that report exists,
**mobile-staged branches re-gate on the Mac before merge.**

That condition is not ceremony. `validation-gate` 1.4 now depends on tools the
sandbox may not have: **step 4** needs Ruby with Psych, **step 4S** needs the
pinned `actionlint` binary at `~/.local/bin/actionlint` — installed on the Mac,
almost certainly absent from a fresh sandbox — and step 4 needs `node`. A gate
that silently degrades to its FALLBACK path in a new environment produces
**weaker evidence wearing the same word**, which is the failure mode the skill's
own labelling rules exist to prevent. The first mobile session reports, per step
6, which steps ran as prescribed and which fell back.

### 0.65.3 This amends never-push, and the amendment is narrow

`deploy-discipline` **PROHIBITED** currently reads:

> "Pushing to `origin` — any branch, any circumstance. Agents never push… **'Branches but not main' is not the rule and never was:** `main` auto-publishes, so a rule that depends on correctly classifying the target every time is one mistake from a deploy."

**The Commander has ruled that carve-out in, scoped to cloud sandboxes.** The
clause's stated reasoning is the thing that must be answered, so it is answered
here rather than deleted:

**The risk named is misclassification** — pushing `main` while meaning to push a
branch. A rule that depends on getting the target right every time is discipline,
and discipline is the weaker control. **The structural answer is branch
protection on `main`.** With `main` protected against direct pushes, a
misclassified push is **rejected by the server**, not caught by agent care. That
converts the ruling from "trust the classification" to "the classification cannot
be got wrong," which is the same substitution R1 already made for scheduled jobs
when it removed the ref-write credential entirely.

**PRECONDITION — CURRENT STATE, 5 AUG 2026: PARTIALLY MET, DELIBERATELY.**

Dean enabled ruleset **"main protection"** on `main`: **restrict deletions** and
**block force pushes**. The **pull-request requirement is deliberately NOT
enabled** — it would break the GitHub Desktop merge-and-push rhythm the whole
workflow runs on. **Ruled: the misclassification risk stays governed by the
never-push rule until the mobile lane carries real traffic.**

**Read what that does and does not buy, because "branch protection is active" is
easy to over-read.**

*It does not close the misclassification hole.* Neither enabled rule blocks an
ordinary push to `main`. Without the PR requirement, `git push origin main`
still succeeds. The structural substitution proposed above is **not** in place,
and discipline remains the operative control — as the Commander has explicitly
ruled, with the cost named.

*What it does buy is worth more than it first appears:* it converts an
irreversible mistake into a **recoverable** one. Deletion is blocked, and history
cannot be rewritten. So a wrong-target push lands as an ordinary commit that is
**visible in history and revertible** — which is precisely what the standing
rollback discipline depends on (*"production problems get `git revert` within
seconds, not live debugging"*). The ruleset does not stop the error; it
guarantees the remedy always works and can never be covered up.

**Standing review trigger:** revisit when the mobile lane carries real traffic,
per the ruling. If a PR requirement is ever judged too costly, the equivalent
structural control is a sandbox credential that cannot write `main` at all —
push rights scoped to non-default branches — which achieves R1's substitution
without touching Dean's Desktop rhythm.

**What is NOT amended.** R1 and R1a stand untouched. **Scheduled jobs still hold
no credential that can write a ref** and still reach the repository only through
the Issues sink with `contents: read`. This lane governs **interactive cloud
sessions with the Commander present**, which is a different actor with a
different failure mode. Do not read this section as loosening anything about CI.

**Live contradiction, and it fails safe.** Until `deploy-discipline` is patched,
its PROHIBITED list still forbids by name what this lane permits. An agent
reading the skill will therefore **decline to push** — the conservative outcome,
costing only mobile-lane convenience and risking nothing. The patch is proposed,
not applied: amending a skill is versioned, registry-tracked, and
regression-gated work, and this ruling ordered a lane definition rather than a
skill revision. **Flagged for a separate ruling.**

### 0.65.4 Re-gate discipline until verified

A branch pushed from a sandbox before the gate is verified there is **staged
evidence, not gated evidence.** It re-runs the full gate on the Mac before merge,
and the mobile run is reported as what it was. `GATE PASS` claimed from an
unverified environment is the same defect class as a piped exit code: a true
statement about the wrong thing.

---

## 0.7 PROPOSED SOURCE EXPANSION — AWAITING COMMANDER RULING, 5 AUG 2026

**Nothing here is enrolled.** `.github/j1-sources.txt` is unchanged at two
sources. Evidence and live-verification records are in
`intel/coverage-charter-landscape.md`. Dean rules per source.

### 0.7.0 ENROLLMENT RECORD — TIER 1 APPLIED 5 AUG 2026

**Ruled in §0.7 and now applied.** `.github/j1-sources.txt` goes from **2 sources
to 5**. Issue #12 confirmed the file still held only the original two before this
change.

**Live re-verification, performed immediately before the lines were written**,
per the §0.6 rule that enrollment is verified at enrollment — not inherited from
a survey three days old. That is the slug lesson exactly: a plausible,
well-formed, wrong URL returns a body and fails silently.

| id | HTTP | Content-Type | Bytes | Newest item / marker |
|---|---|---|---|---|
| `federal-register-opm` | **200** | `application/json; charset=utf-8` | 30,542 | count 4,010; newest **2026-08-04** |
| `federal-register-dolvets` | **200** | `application/json; charset=utf-8` | 42,255 | count 153; newest **2026-03-10** |
| `ecfr-title-versioner` | **200** | `application/json; charset=utf-8` | 8,033 | 50 titles; Title 38 `latest_amended_on` **2026-07-28**, `up_to_date_as_of` **2026-08-03** |

Verified 2026-08-05T17:02Z. All three returned real bodies, not just status
codes.

**DOL-VETS is still silent** — newest item unchanged at 2026-03-10, five months
stale, exactly as the survey found. That is the low-churn profile it was selected
for, confirmed a second time rather than assumed.

**A header correction shipped with it.** `j1-sources.txt` lists eCFR among the
bot-walled hosts. That refers to the **HTML front end**; the `api/versioner`
surface is a different thing and is reachable. The header now says so, so an
enrolled eCFR source does not read as contradicting the walled roster.

**`federal-register-presdocu` is NOT enrolled** — it remains Tier 1-CONDITIONAL
pending the V-9 ruling. See §0.7.5.

**The first scheduled run over the expanded sector is the live test.** J1 fires
`0 9 * * *` (observed ~2h19m late). Tomorrow's run is the first to scan five
sources, and the first to exercise a compare against a baseline that does not yet
contain three of them — so expect all three to report as new on first contact,
the same first-run behaviour §8.12 records for run #4.

### 0.7.1 The tiers

**TIER 1 — ADD NOW.** High signal, low churn, compact JSON, no new governor
required. These three barely move the daily email, because most days they
hash-match and produce nothing.

| ID | Why |
|---|---|
| `federal-register-opm` | Regulatory text on RIF appeals, probationary/trial-period appeals, suitability appeals — the family containing veterans' preference, VRA, Schedule A. 4 of 8 sampled items on-mission in one week. |
| `federal-register-dolvets` | 153 documents total, silent since 2026-03-10. Near-zero noise, high relevance when it fires. Slug is `veterans-employment-and-training-service` — **not** the general ETA slug, which was tested and rejected. |
| `ecfr-title-versioner` | Cheapest source in the set. Reports *that* Title 38/5/37 was amended, never *what* — a trip-wire for program amendment and termination, which nothing else in the fleet detects. |

**TIER 1-CONDITIONAL — mission-central, but it churns daily.**

| ID | Why | Condition |
|---|---|---|
| `federal-register-presdocu` | This is the charter's thesis in one feed: presidential action is where transition policy originates, and it is the day-zero capture point. It is where the 3 AUG military spouse commission EO appears first. Peak value 1–3 items/month, very high each. | The body changes most days regardless of relevance. **Enroll only with the §3.5 churn-damping threshold (V-9) tuned in the same merge**, or accept a guaranteed-daily J1 email through a stated 14-day tuning window. |

**TIER 2 — OBSERVE 30 DAYS.**

| ID | What the observation must answer |
|---|---|
| `federal-register-veteran-term` | Closes a real gap — a veteran-relevant clause inside an HHS or TSA rule is invisible to every single-agency feed. But it overlaps the VA and OPM feeds and carries keyword noise. Measure the **de-duplicated** hit rate before paying for it. |
| `va-news-rss` | 10–20% names a program or benefit change; the rest is features and wellness series. Its unique value is administrative launches that never generate a Federal Register notice. Measure whether that value survives the noise. |

**TIER 3 — ASSESSED AND DEFERRED, with reasons.**

| Source | Reason declined |
|---|---|
| `war-gov-press-rss` | **Echo, not origination.** ~12% audience-relevant, and the one relevant item sampled was the spouse EO, which `presdocu` carries first. Fails test 3 — the need is already served upstream. |
| FR general `labor-department` | Near-zero audience signal; H-2A/H-2B wage rules, WIOA allotments, Job Corps. Fails test 3. |
| DFAS.mil, congress.gov direct, dol.gov RSS | **403 at rung 1.** Declined on reachability, not merit. Stay on the walled roster and the dark ledger per §C.4/§C.5. |

**NOT DEFERRED — A DECISION IS OWED.** `api.congress.gov` and
`api.govinfo.gov` are live, correctly-formed APIs behind free registered keys.
They are the highest-value blocked candidates in the set: they close
bill-text-at-origination, which is the exact gap behind the H.R. 980 failure of
record, and they make the AMENDED-BILL RULE executable without a browser. This
is not a merit question — it is whether the program holds an API credential,
deliberately deferred at §8.3. **COMMANDER lane. See §0.7.4.**

### 0.7.2 Cost — and a correction to the analyst's arithmetic

s2-intel projected **$7.46/month** at 8 sources by dividing observed run cost by
source count. **That overstates it roughly threefold**, because it treats a
per-run fixed cost as if it were marginal.

Recorded telemetry: run #4 **$0.065**, run #5 **$0.0596**, both at 2 sources.
The §4 model puts a source at ~2,000 input / ~200 output tokens after
truncation, which at Haiku 4.5 ($1/$5 per MTok) is **~$0.003 per source per
scan**. Two sources is therefore ~$0.006 of marginal cost inside a ~$0.062 run —
**roughly 90% of J1's cost is fixed per-run overhead** (system prompt, tool
schemas, agent turns, baseline read and write), not per-source.

| Sources | Per run | Per month (30 runs) |
|---|---|---|
| 2 (today) | ~$0.062 | ~$1.87 |
| 5 (Tier 1 + conditional) | ~$0.071 | ~$2.13 |
| 8 (through Tier 2) | ~$0.080 | ~$2.40 |
| 15 (the §4 assumption) | ~$0.101 | ~$3.03 |

**A source costs about nine cents a month.** Against a $60 target, cost is not a
constraint on this decision and should not be argued as one in either direction.

Two caveats that keep this honest. The arithmetic holds **only while bodies stay
compact JSON and truncation works** — the RSS candidates are larger, and any
HTML source breaks the model by an order of magnitude (§4's stated variance
driver #2). And it models token volume only, not the re-sent system prompt, so
treat it as a floor.

**The real conclusion: token spend is not the limiter. Triage and human
verification throughput is.** That is the §0.6 constraint, and it is the only
argument that should decide this expansion.

### 0.7.3 Alarm budget — does N1 hold?

**Yes. N1 does not need revisiting at the proposed intake rate**, and the reason
is structural rather than lucky.

**Added sources load detection, not alarm.** J1 cannot FLASH on content at all —
it files findings and never rates (§C.2, R7). The only content-driven FLASH is
**F2**, which requires all three of: the source is on the **citation-of-record**
list, the fetch succeeded, and the figure is **live in `index.html`**. Every
source proposed here is a *detection* feed; none is a citation of record backing
a shipped figure. **F5** likewise requires a monitored bill already cited in the
app, and nothing proposed here carries bill actions. So six new sources add
approximately **zero** FLASH pressure against the 2-per-7-days budget.

**Where the load actually lands is ROUTINE, and ROUTINE has no governor.** Every
rule N1 through N6 protects the FLASH channel. Nothing rate-limits the daily
findings email. Two things keep that from being alarming:

1. **Volume is bounded by construction.** J1 files **one** findings issue per
   run, listing all changed sources. The ceiling is one email per day no matter
   how many sources are enrolled. Expansion changes the *content* of that email,
   not its count.
2. **The BLUF triage works, and it is proven.** Run #5's issue #11 opened with
   `NO ACTION NEEDED — informational: J1 detected changes in 1 source(s)`. Line
   one carries the decision. That control was verified in live fire, not assumed.

**The residual risk is habituation, not volume.** Today J1 emails only when
something changed, so an email means something. Adding daily-churning feeds
(`presdocu`, both RSS candidates) makes the email arrive *every* day and almost
always say NO ACTION NEEDED — which trains the Commander not to open it. That is
the muted-alarm failure in §D.3's own words, one channel down from where the
governors are pointed.

**This is why the tiering above is shaped the way it is.** All three Tier 1
sources are low-churn: they mostly hash-match, the email stays intermittent, and
its arrival keeps meaning something. Every daily-churning candidate is held at
Tier 1-CONDITIONAL or Tier 2 behind observation. The alarm analysis produced the
tiers; the tiers were not chosen first and justified afterward.

**J2's correlation layer holds, with one live dependency.** J2 is gated on a
non-empty J1 manifest, and §4 already assumed the pessimistic 4-of-4-weeks case,
so there is no cost surprise. But **§3.5 churn damping is still
`PLACEHOLDER-N` — V-9, untuned.** Until a threshold is set, a chatty source
escalates on raw-hash change forever and buys a Sonnet pass every week. That is
the sequencing dependency behind `presdocu`'s condition, and it is the one piece
of this expansion that requires work rather than a ruling.

**The trigger that would change this answer:** ruling YES on the congress.gov
key. Bill actions feed **F5**, which is a genuine FLASH criterion, and enactment
events cluster around session calendars rather than arriving smoothly.
**Re-run this analysis before that key is enrolled, not after.**

### 0.7.4 What is actually being asked

1. **Rule on Tier 1** — three sources, `+$0.009/run`, no governor changes, no
   new triage load. Recommend APPROVE.
2. **Rule on `presdocu`** — approve with V-9 tuned in the same merge, approve
   with a stated 14-day daily-email window, or hold to Tier 2.
3. **Rule on the api.congress.gov key** — the largest coverage gap in the fleet,
   and a program dependency change. Recommend a separate tasking, not a fold-in.
4. **Note the war.gov redirect** — `index.html` carries 2 `defense.gov` links
   (lines 2604, 2610) that resolve only via a 301. Routed to J4 link-liveness;
   not fixed inside an unrelated ship.

### 0.7.5 `presdocu` HELD — COMMANDER RULING, 5 AUG 2026. REVIEW **19 AUG 2026**

**Ruled: option (c). `federal-register-presdocu` is NOT enrolled and will not be
until V-9 is tuned from observation.**

| | |
|---|---|
| **Review date** | **19 AUG 2026** — ~14 days of five-source churn data |
| **What happens then** | Tune V-9 from observed per-source diff rates, then enroll `presdocu` **in the same ship** |
| **Hard precondition** | **N7 written into §D.3 first** — see below |

**Why the third option was the only honest one.** The choice was framed as
enroll-now-and-accept-a-daily-email-window versus tune-V-9-in-the-same-ship. The
second does not survive contact with V-9's own terms: it says *"tune on two weeks
of real data, do not guess,"* and the fleet held **n=2** scan-firing runs, both
against the old two-source set. There was no churn data for any source. "Tune it
in the same ship" would have meant inventing a threshold — the precise failure
the §0.6 slug lesson records, applied to a number instead of a URL.

**Today's enrollment is what makes 19 AUG possible.** Five sources scanning daily
produce exactly the per-source diff rates V-9 needs — OPM's especially, as the
closest available proxy for how a Federal Register feed really churns. The wait
is not idle; it is the measurement.

#### THE COVERAGE COST — STATED, ACCEPTED, NOT AN OVERSIGHT

**Until 19 AUG, a presidential action reaches us second.** `presdocu` is the
Coverage Charter's thesis in one feed: the day-zero capture point for executive
orders, proclamations, and the establishment of bodies. It is where the 3 AUG
military spouse commission EO surfaced first, ahead of every echo.

For roughly two weeks we will learn about an EO from a downstream source, or from
Dean, rather than from the scan. **That is a known, accepted gap and it is
recorded here so nobody later reads it as something the fleet missed.** If an EO
lands in that window and we are late to it, the answer is "we chose this, on
5 AUG, for these reasons" — not an investigation.

The charter's own constraint is what makes the trade correct: *coverage growth
never outpaces verification capacity*. Enrolling the chattiest source into a
fleet with neither churn damping nor an arrival-rate trigger is that constraint
being violated, not served.

#### N7 IS QUEUED, AND IT GATES ENROLLMENT

**N7 — ROUTINE ARRIVAL RATE, PER PRODUCER** was **ruled and approved** in the
daily-ops-pulse decision and has **not been written into §D.3.** It does not
exist in this document. It must exist **before** `presdocu` enrolls, so the
arrival-rate trigger is in place before the source most likely to trip it.

Its substance as ruled: if a single producer files more than **5 ROUTINE issues
in a rolling 7 days for 2 consecutive weeks**, the weekly SITREP header reads
`ROUTINE ARRIVAL HIGH — <producer> n/wk — force-mod review`. The response is a
**review**, never an automatic suppression — a governor that silently drops
ROUTINE traffic reintroduces the silent-failure mode the design exists to
prevent. **Both numbers are judgment, not derived**, and are themselves due for
tuning after 60 days of real arrival data.

Note the interlock: force-mod's analysis predicted that enrolling `presdocu`
without a tuned churn threshold would **trip N7 inside two weeks.** That is the
alarm working as designed — but only if N7 exists to trip. Shipping the source
before the governor would mean the one predicted failure has nothing watching
for it.

**Sequence, in order, none of it optional:**

1. **N7 written into §D.3** — ruled, drafted, awaiting application.
2. **19 AUG: tune V-9** from the five-source churn record.
3. **Enroll `presdocu`** in the same ship as the V-9 tuning.

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

**PROHIBITED — NEVER A REPOSITORY SECRET:**

| Secret | Why it is banned |
|---|---|
| `ONESIGNAL_REST_API_KEY` (or any push-send credential, under any name) | Per §F0.2 the machine never sends a push. A runner holding this key could interrupt every subscribed service member, which is the one failure §D.4 already forbids for operator traffic and §F forbids for everything else. Dean sends from the dashboard. **Verified absent 5 AUG 2026: zero OneSignal references across all five workflow files.** |

A recorded prohibition survives where an absence does not — an empty inventory
row looks identical to an oversight, and the next agent to need a push channel
will read silence as permission.

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

## F. USER NOTIFICATION — THE PUSH-WORTHY TIER

**Status: PROPOSED, 5 AUG 2026. Awaiting Commander ruling.** Drafted by
force-mod on Commander tasking; corrected and staged by the Orchestrator, with
three deviations from the tasking flagged at §F8.

### F0 — THIS IS NOT A THIRD TIER

§D opens "Two tiers. Hard… There is no third tier and none may be added," and
N5 restates it. **This section does not add one.** FLASH and ROUTINE are
unchanged and N5 is unamended.

PUSH-WORTHY sits on a **different axis**. §D grades how loudly the machine
reaches **Dean**. §F grades whether Dean reaches **users**. **F-criteria and
P-criteria are independent, and neither implies the other.** An F2 or F5 FLASH
is not evidence of push-worthiness, and most push-worthy findings are not FLASH
at all.

F5 (ENACTMENT) is the criterion most likely to be misread as a push trigger.
**Enactment alone never pushes.** The enacted law must independently produce a
P1–P4 match.

### F0.1 — WHY THIS CHANNEL IS STRICTER THAN FLASH, NOT LOOSER

OneSignal push reaches every subscribed service member. It spends the **users'**
alarm budget. Three properties make it the scarcest channel we manage:

1. **No consent to be an operator.** Dean opted into a 0300 SMS. A user opted
   into an app.
2. **No canary is possible.** N6 proves the FLASH channel is alive by firing a
   test into it. There is no equivalent for user attention — a test push proves
   *delivery* and cannot prove the channel still commands attention. Attrition
   here is invisible until it is total.
3. **The failure is one-way.** A muted FLASH channel is repaired by fixing the
   criteria. A muted push channel is repaired by nothing: the user has already
   swiped it away or turned notifications off, and there is no path back.

**Therefore: err narrow.** A checklist that approves everything worth writing
about is miscalibrated. Most verified findings are card-worthy and **not**
push-worthy. That is the expected outcome, not a failure of the checklist.

### F0.2 — THE MACHINE NEVER SENDS

Structural, not procedural.

- **No OneSignal credential enters any runner, ever.** Recorded as a prohibited
  line in the §6 secrets inventory, because a written prohibition survives where
  an absence does not. **Verified 5 AUG 2026:** zero OneSignal references exist
  across all five workflow files.
- A scheduled job may attach the GitHub label **`push-candidate`** to a findings
  issue and do nothing else. The label carries **zero authority**. R7's
  four-verdict enumeration is a closed set and is **unamended**.
- A push **recommendation** requires an interactive session, a CONFIRMED rating
  of record, and every gate and criterion below. CI holds ladder rung 1 only, so
  every rating a runner could emit is premature by construction.
- The output is a **packet** handed to Dean under an ACTING ON THIS footer.
  **Dean sends from the OneSignal dashboard, or declines.** Either way it is
  logged.

### F1 — GATES: ALL FOUR REQUIRED BEFORE ANY CRITERION IS EVALUATED

Fail any gate and evaluation **stops**. Do not proceed to F2 to see whether a
criterion would have matched.

**G1 — CONFIRMED, INTERACTIVE, WITH AN ENTRY OF RECORD.** A
`policy-verification` rating of CONFIRMED exists in `intel/verification-log.md`
with an entry ID. PROBABLE, BLOCKED, UNVERIFIED and all four J2 verdict words
are ineligible. No entry, no evaluation.

**G2 — THE CONTENT IS LIVE IN PRODUCTION.** The card, note, or timeline item is
merged to `main`, cache-bumped, and serving. The push **follows** the app
content; it never precedes it and never ships alongside it. A push whose
destination does not exist yet is a broken promise at the moment of maximum
attention.

**G3 — A NAMED ACT, IN ONE IMPERATIVE SENTENCE.** There is a specific thing the
recipient does, writable in one sentence naming the form, portal, office, or
election. "Be aware of," "keep an eye on," "this could affect you," and "talk to
your VSO" are not acts. If the sentence cannot be written, it is a card.

**G4 — THE AUDIENCE IS THE AUDIENCE.** The finding applies to the subscriber
population nationwide, **or** a verified OneSignal segment matches the affected
population and resolves to a non-empty audience. State-specific,
installation-specific, and single-MOS findings are card-only until segmentation
exists. Spending fifty states' attention on one state's change is the clearest
form of the failure this section prevents.

**G5 — THE DEEP LINK RESOLVES.** *(Orchestrator addition, §F8 item 3.)* The
`tool=` target is on the app's `validTabs` list **and** round-trips through
`sw.js`'s notification-tap handler. Verified by test, not by reading.
**`dd214` currently FAILS this gate** — see §F7.

### F2 — CRITERIA: OBJECTIVE, ENUMERATED, ANY ONE SUFFICIENT

Evaluated only after all gates pass. A criterion matches **literally or not at
all**. No agent may reason a finding into a criterion by analogy, and none may
reason one out. Altering a P-criterion or an X-disqualifier is a COMMANDER-lane
doctrine change (mirrors R3).

**P1 — ELIGIBILITY OR ENTITLEMENT CHANGE, IN FORCE.** A final, effective change
to who qualifies, what they receive, or how much — **and** the recipient must do
something to obtain, preserve, or recalculate it. A rate or cost change the user
cannot act on is P1-shaped and fails at G3. That is correct, not a loophole.

**P2 — APPLICATION WINDOW OPEN AND RIVALROUS OR CLOSING.** Applications are open
now, **and** either (a) a stated capacity cap or first-come allocation exists, or
(b) a stated close date falls within 180 days. A permanently open application
with no cap is a card — delay costs the applicant nothing and the timeline
surfaces it at the right month.

**P3 — DATED WINDOW IN WHICH THE USER'S OWN RIGHT IS LOST OR REDUCED.** A
published date within 90 days after which the recipient's own eligibility,
rating, entitlement, or election is permanently lost or reduced. Three binding
qualifiers: the date is **published by the authority**, never inferred by us; the
loss is the **recipient's own** (comment periods, advocacy windows, and hearing
dates do not qualify); and **one push per window, at discovery** — the timeline
engine owns reminders and "last chance" follow-ups are prohibited under U2.

**P4 — CORRECTION OF A HARMFUL CLAIM WE SHIPPED.** All three required: (a) we
carried a claim now shown wrong; (b) it was action-guiding; (c) a user who relied
on it could have **lost or forgone a benefit, or missed a deadline**. P4 is the
only criterion where *not* pushing carries a harm cost attributable to us. It is
a duty, exempt from the U1 budget. Condition (c) is load-bearing and keeps P4
from becoming a general errata channel — most of our errors embarrass us without
costing a user anything, and those get a card.

**There is no P5, and in particular there is no criterion for topic importance.**

### F3 — DISQUALIFIERS: ANY ONE VETOES, EVEN WITH A CRITERION MATCHED

This is what §D.1 lacks, and it is where the checklist gets its ability to say no
to good news.

**X1 — NOT FINAL, AND NOT DATED.** Proposed rules, NPRMs, interim rules under
reconsideration, draft policy, and bills at any stage before enactment.
**Narrow exception:** a non-final action that itself publishes a date after which
the *user's own* option is lost is governed by P3 and is not vetoed. The
disqualifier is not the word "proposed" — it is the **absence of a date**. A
proposal with no date has no window, and a push with no window is an anxiety
broadcast.

**X2 — NOTHING TO DO.** Commissions, councils, task forces, working groups,
advisory bodies, studies, reports, RFIs, listening sessions, appointments,
reorganizations, and funding authorizations with no application path. Vetoes
regardless of significance and regardless of how good the news is. **Structure is
not a benefit.**

**X3 — THE APP ALREADY REACHES THEM IN TIME.** The timeline, reminders, or an
existing card already surfaces this to the **entire** affected population before
the deadline or cap bites. Applies only when coverage is complete: if users
outside the timeline window are exposed, or a cap can exhaust before a user's
card fires, X3 does not veto.

**X4 — LATE BY OUR OWN CLOCK.** More than **7 days** between the first CONFIRMED
entry of record and the proposed send. The clock starts at the **first**
confirmation; re-verifying to reset it is prohibited. We do not control when the
world acts, but we control how fast we act, and urgency we sat on for a week was
not urgency. Age of the underlying **event** does not veto on its own — a
still-open, still-rivalrous window is new information to a user who never heard
of it.

**X5 — CANNOT BE WRITTEN HONESTLY IN THE SPACE.** The notification cannot be
written to `brand-voice` standard inside the platform's character limits without
overstating, implying urgency the facts do not carry, or dropping a qualifier
that changes what a reader would do. **If the honest version does not fit, it is
not a push.** pao-content owns this and may veto unilaterally.

### F4 — EXPLICITLY NOT PUSH-WORTHY, ENUMERATED SO IT IS NOT RE-LITIGATED

Mirrors §D.2. Settled; re-argument requires a Commander ruling, not a fresh
analysis.

A new commission, council, task force, or advisory body. A study, report, GAO or
IG finding. A hearing, markup, committee vote, or bill at any stage before
enactment. An NPRM, proposed rule, or comment period — **including its comment
deadline**, because submitting a comment changes nothing about the sender's own
entitlement. An executive order that directs a study or creates a body. An
appropriation or authorization with no application path. An agency reorganization
or leadership appointment. A rate, copay, or cost change the user cannot act on.
Good news with no act. A new resource, partner, or directory entry. An app
feature, update, redesign, or `DATA_VERIFIED` refresh. A dead-link fix. An
awareness date or observance. **Anything about Transition OPS itself being down
or degraded** — a user who cannot reach the app already knows, and F0.2 forbids
operator traffic on this channel. A state- or installation-specific change with
no verified segment.

**Two arguments pre-rejected by name, because they will recur:**

- **"It is important to our audience."** Topic importance is not a criterion.
  Spouses and families are already inside the §0.6 audience definition, and P1–P4
  are written audience-neutral, so a spouse-facing eligibility change clears P1 on
  its own merits. Being *about* the right people adds no weight.
- **"It is genuinely good news."** The user's attention is spent identically
  whether the news is good or bad. Good news with no act is a card.

### F5 — THE PACKET AND THE DECISION STATES

States: `PUSH-RECOMMENDED` · `PUSH-DEFERRED (budget)` · `PUSH-DECLINED (<ID>)`.
Every declination records the gate, criterion, or disqualifier ID that produced
it, so it is assessed once rather than re-litigated. **Silence is not a state.**

The packet carries, in order: the verification-log entry ID; G1–G5 results; the
matching criterion with the literal fact that matched it; the X1–X5 sweep each
explicitly cleared; the exact title (≤50 chars) and body (≤120 chars); the deep
link with its G5 test result; the U1 budget state; the recommended send window;
and the ACTING ON THIS footer with dashboard steps.

**Digest integration.** When a flag is present the BLUF reads:

```
N item(s) may need your eyes — 1 PUSH RECOMMENDATION.
```

The PUSH RECOMMENDATION section carries the case (which criterion matched), the
draft notification, and — required, not optional — **the honest counter-case if
one exists.** A recommendation with no counter-case must say so explicitly rather
than omit the heading, so a missing counter-case is a claim rather than an
oversight.

### F6 — GOVERNORS (U1–U5), ON THE USER AXIS

**U1 — PUSH BUDGET. Maximum 1 per rolling 30 days, and 6 per rolling 12
months.** An additional qualifying finding inside the window becomes
PUSH-DEFERRED, ships its card normally, and is named in the next SITREP. **The
governor governs the recommendation, not the Commander** — Dean always overrides;
the control exists so the staff cannot recommend frequently. If the 12-month
ceiling ever binds, the criteria are wrong: force-mod patch trigger, not a reason
to raise the budget. P4 corrections are exempt.

**U2 — DEDUPE: ONE PUSH PER SUBJECT, EVER.** A subject is the program, rule, or
deadline. No reminders, no "last chance," no anniversaries — the timeline engine
owns reminders. Sole exception: a P4 correction to a push already sent.

**U3 — SEND WINDOW.** Recommended 1000–1600 US Central, Tuesday–Thursday. No
weekend or federal-holiday send unless a P3 date falls inside it. This is a
coarse instrument that treats CONUS reasonably and OCONUS badly; per-timezone
delivery availability is **UNVERIFIED (V-17)** and must not be assumed.

**U4 — THE CARD IS CHECKED AGAINST THE PUSH, VERBATIM.** Before handoff, title
and body are checked word-for-word against the live card text in `index.html`
with the line number cited. Any claim in the push not present in the card is
removed, or the card is corrected first. This is the user-side mirror of R7's
verbatim bar and it addresses the H.R. 980 failure mode: nobody lied there,
somebody paraphrased.

**U5 — MEASURE, DO NOT GUESS.** After every send the next SITREP records
delivered count, open rate, and opt-out delta at 72 hours. **No threshold is set
and none may be invented: n = 0.** After three sends, force-mod sets a review
trigger from the observed baseline (**V-18**). Channel liveness testing belongs
to `push-ops`, not here.

**Numbers, marked honestly.** `6/12 months` is derived from a small sample —
eight POLICY INTEL / WHATS_NEW entries across Jan–Aug 2026, of which two clear
this checklist, a rate near 3/year; six is 2× headroom on n=8. `1/30 days`,
`X4=7 days`, `P3=90 days`, `P2=180 days` are judgment calls, the last two
anchored to framing already in the app. U3 and U5's threshold are **not set** and
depend on V-17/V-18. Inventing a percentage here would be exactly the plausible,
well-formed, wrong failure the §0.6 slug lesson records.

### F7 — RETROACTIVE TEST: THE MILITARY SPOUSE COMMISSION

**Commander tasking item 4. Verdict: NO — and it fails twice, independently.**

| Step | Result |
|---|---|
| G1 CONFIRMED with entry of record | **PASS** — V-2026-003, 5 AUG 2026 |
| G2 live in production | **PASS** — shipped to both renders, cache v106 |
| **G3 a named act** | **FAIL — evaluation stops here** |
| G4 audience | not reached |
| P1–P4 | not reached |
| X2 nothing to do | **would veto independently** — advisory body, enumerated in F4 |

**Reasoning.** The verification log already contains the sentence that decides
it: *"NOTHING is actionable for a spouse today. No application, no funding, no
eligibility change, no program stood up."* G3 asks for one imperative sentence
naming a form, portal, office, or election. None can be written, because none
exists. The honest push body would be "a commission now exists," which is
precisely the anxiety-free, action-free content F0.1 says the channel cannot
afford.

**The calibration signal is *how* it reached NO.** The checklist never considered
that the subject is military spouses. Had the tasking's fourth candidate
criterion — "major family/spouse development" — survived into doctrine, it would
have matched, and a feel-good finding with nothing for a user to do would have
spent the scarcest channel we manage. **That criterion is deleted for exactly
this reason**, and F4's pre-rejection line replaces it. Coverage does not shrink:
a spouse-facing *eligibility* change clears P1 on its own merits without any
special provision.

**This is the right answer and it should feel slightly unsatisfying.** The EO is
real, verified, spouse-central, and genuinely good news. It earned a card, and it
earned nothing more.

### F8 — DEVIATIONS FROM THE TASKING, FLAGGED FOR RULING

**1. `PUSH-WORTHY-PENDING-VERIFICATION` is proposed as a LABEL, not a verdict
word.** The tasking said a scheduled job may flag
`PUSH-WORTHY-PENDING-VERIFICATION`. R7's verdict table is a **closed enumeration
of four**, so a fifth word amends R7 and puts push vocabulary inside what a
runner emits. **Proposed instead: the GitHub label `push-candidate`**, which
preserves the tasking's intent exactly — the machine may flag provisionally, only
an interactive session may recommend — while leaving R7 untouched. Labels are
already this system's severity carrier (§2's `--label FLASH`). **Rule.**

**2. force-mod's label-attachment rule is wrong, and I corrected it.** Its draft
attached `push-candidate` "only alongside a CORRELATED or DIVERGENT verdict."
That is backwards and self-defeating:

- **CORRELATED** means the source and the app agree. Nothing is new to tell
  users. It is the **least** push-worthy verdict.
- **NO-APP-EXPOSURE** means a changed source touches nothing the app claims —
  which is exactly what a **brand-new program** looks like. That is P2, the
  criterion carrying force-mod's own VET TEC 2.0 YES case. Its rule would have
  made its own regression case unreachable.

**Corrected: `push-candidate` attaches to NO-APP-EXPOSURE, DIVERGENT, or
NEEDS-LADDER — never to CORRELATED.**

**A dependency follows, and it is real work rather than a ruling.** J2 currently
routes only DIVERGENT, NEEDS-LADDER, and control failures to Dean's eyes;
`.github/workflows/j2-weekly-analysis.yml` treats CORRELATED and NO-APP-EXPOSURE
as "the machine agreeing with itself." **NO-APP-EXPOSURE is therefore discarded
today, so the highest-value push class is invisible to the digest.** Surfacing it
is a J2 workflow change, COMMANDER lane, not folded into this ruling.

**3. G5 added — the deep link must be proven to resolve.** The tasking requires
the draft to carry a deep-link target. Verifying that requirement surfaced a live
defect, so it became a gate. See §F7 note and the finding below.

### F9 — LIVE DEFECT FOUND WHILE SPECIFYING G5

`sw.js` records a notification tap by extracting `tool=` with the regex
`/tool=([a-z]+)/` — **lowercase letters only**. The app's `validTabs` list
contains **`dd214`**, which has digits.

Tested against all 14 valid tabs: **13 round-trip cleanly; `dd214` captures
`"dd"`, fails the `validTabs` check, and silently falls back to `dashboard`.**

Impact is confined to the notification-tap path that exists for iOS cold launch,
where URL params are dropped — the ordinary `?tool=` query path is unaffected.
But that is the push path, which makes it directly load-bearing here: **an
approved push deep-linked to the DD-214 tool would land users on the dashboard**,
at the exact moment of maximum attention that G2 exists to protect.

One-character fix (`[a-z]` → `[a-z0-9]`). **Not applied** — it changes
notification routing for every user, which is COMMANDER lane by blast radius, and
it is outside this tasking. Recorded as **V-19**.

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
| V-4 | No | **CLOSED 3 AUG 2026 — LIVE-FIRE PROVEN** | Dean | **Live-fire run #4 proved the bot-created-issue path** (findings #6, ROUTINE); run #3 proved the FLASH path (#5). The only unproven leg was whether those issues generated mail — **closed the same day: five emails delivered, incl. the #6 findings mail at 08:49.** The cron was never needed as the witness; it fired 4 AUG and filed #11 as a second data point regardless (§8.12). *Original finding, retained:* Issue #1 generated no notification; repo watch sat at the default Participating and @mentions, which a bot-filed issue does not satisfy. Fix: watch set to All activity; destination amended same day to `dean@veteranbridgesolutions.com` (primary), `dean.nemecek01@gmail.com` (fallback). |
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

| **V-16** | **YES — for J2's schedule only** | **CLOSED 3 AUG 2026 — GOVERNORS IMPLEMENTED AND REGRESSION-TESTED** | Orchestrator | Raised as the gap that J2's FLASH power would otherwise open: §D.3 **N1 and N2 existed as doctrine with no implementation anywhere** — J1 and J3 FLASH only on their own failure, so no job had ever exercised them. Commander condition, 3 AUG 2026: governors ship in J2's merge or J2's cron stays off. **Implemented in `.github/workflows/j2-weekly-analysis.yml`, step "Apply governors", in shell/python — never model-side.** N1 counts FLASH issues system-wide (not per job) in a rolling 7-day window from the Issues API, so the FLASH issues *are* the ledger and no new state store exists. N2 keys on `F2\|<source-id>\|L<line>` carried in the issue title, suppresses only on a still-**OPEN** match inside 72h — a CLOSED match means the condition was resolved and has recurred, which per N2 resets the clock. **Regression Y1–Y7 executed 3 AUG 2026, 7/7 pass — see §8.9** |

| **V-17** | No | **OPEN — raised 5 AUG 2026** | s3-watch-officer | **OneSignal capability facts, none of which this repo has verified.** Title and body character limits; per-timezone delivery availability; segment availability and how a segment's size is read; delivery, open, and opt-out telemetry export. §F's U3 and X5 both depend on these. Per the §0.6 live-verification rule they are **not asserted from memory** — U3's send window and X5's character budget stay provisional until this closes. Owner is `push-ops` (registry #7), mechanics only |
| **V-18** | No | **OPEN — raised 5 AUG 2026** | force-mod | **§F U5 threshold, deliberately unset at n = 0.** Record delivered count, open rate, and opt-out delta at 72 hours for the first three pushes ever sent, then set the criteria-review trigger from the observed baseline. **No percentage may be invented before that data exists** — a plausible, well-formed, wrong number here is the §0.6 slug lesson repeated on the user channel |
| **V-19** | No | **CLOSED 5 AUG 2026 — FIXED, REGRESSION 14/14. STAGED on `ops/v19-deeplink-fix`, awaiting merge** | Dean / Orchestrator | **RULED by Dean 5 AUG 2026: apply as its own small ship — a defect repair, not a feature.** Fix applied (`[a-z]` → `[a-z0-9]`), cache **v106 → v107**, full gate PASS, regression evidence at **§8.13**. *Original finding:* **`sw.js` deep-link regex drops digits.** The notification-tap handler extracts `tool=` with `/tool=([a-z]+)/`; the app's `validTabs` contains **`dd214`**. Tested across all 14 tabs: 13 round-trip, **`dd214` captures `"dd"`, fails validation, and silently falls back to `dashboard`.** Confined to the iOS cold-launch intent path — which is the push path, making it load-bearing for §F. One-character fix (`[a-z]` → `[a-z0-9]`). **NOT APPLIED:** it changes notification routing for every user, COMMANDER lane by blast radius, and it sits outside the tasking that found it. §F's **G5** gate exists so this class of defect cannot reach a send again |

**Standup-gating status, 3 AUG 2026: 0 of 8 open. ALL CLOSED.**
V-2, V-3, V-6, V-7 closed 2 AUG. V-11, V-13, V-14, V-15 closed 3 AUG.

**R6 is therefore satisfied and the authoring ban lifts.** J1 may be authored,
on a branch, gated, staged, and merged by Dean — in that order and no other.

**JOB STATUS, 3 AUG 2026** (J1 line updated 4 AUG). J1 **LIVE AND SELF-FIRING** —
run #4 green by dispatch, **run #5 green on the cron, 4 AUG, diff path executed**
(§8.8, §8.12). J3 **LIVE**
(model-free dead-man's switch). **J2 LIVE AND COMPLETE** — run #3 green with the
sandbox proven in flight, first Sonnet telemetry recorded at **§8.11**. J4, J5
not authored. J6 dormant pending ship 1. **Three of six jobs are running, and
§D.1 F2 has an implementation for the first time.**

### 8.9 V-16 REGRESSION EVIDENCE — J2 GOVERNORS, Y1–Y7 EXECUTED 3 AUG 2026

Run against the **actual governor code extracted from the workflow**, not a
reimplementation of it. Synthetic inputs; the logic under test is the shipped
logic. Harness and fixtures are session scratch, deliberately not committed —
the evidence that matters is the result table and it lives here.

| # | Case | Expected | Result |
|---|------|----------|--------|
| Y1 | Clean DIVERGENT, both sides verbatim, budget free | label FLASH | **PASS** |
| Y2 | DIVERGENT whose `app_excerpt` is **not present at the cited line** (model paraphrased) | demoted to NEEDS-LADDER | **PASS** |
| Y3 | Model emits the rating word `CONFIRMED` | vocabulary violation, demoted, surfaced | **PASS** |
| Y4 | N1 budget already spent (2 FLASH in window) | DIVERGENT downgraded to ROUTINE, header reads FLASH BUDGET EXCEEDED | **PASS** |
| Y5 | N2 — identical finding key **OPEN** inside 72h | suppressed to ROUTINE | **PASS** |
| Y6 | N2 — identical finding key **CLOSED** inside 72h | **not** suppressed; clock reset per N2 | **PASS** |
| Y7 | Model output unparseable | zero findings, parse failure reported, nothing inferred | **PASS** |

**7 of 7 pass.** Y2 is the H.R. 980 control and the reason the verbatim bar
exists. Y6 is the one most likely to be got wrong by a naive dedupe: a condition
that was fixed and broke again is new information and must be allowed to FLASH.

Additionally verified end to end: the assembled issue title
`J2 DIVERGENT federal-register-dod L4100 2026-08-03 [k:F2|federal-register-dod|L4100]`
passes the shell-side character whitelist, carries the N2 dedupe key, and
contains no model prose — model free text reaches the body file only.

**Not run, and stated rather than omitted:** `shellcheck` is not installed on
this machine, so the shell steps have not been statically analysed. The four
embedded Python blocks compile (`py_compile`, 4/4) and the workflow YAML parses.

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

### 8.8 LIVE-FIRE OUTCOME — RUN #4 GREEN 3 AUG 2026; RUN #5 SCHEDULED-TRIGGER GREEN 4 AUG 2026

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
| Scheduled trigger | Run **30904317784**, `event: schedule`, green — the cron is the thing that fired, not a dispatch | **PROVEN 4 AUG 2026** |
| Diff against a populated baseline | Same run: `sources_changed: 1` of 2. `federal-register-va` compared **equal** to a real prior hash and was excluded | **PROVEN 4 AUG 2026** |

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

> **CLOSED 4 AUG 2026 — EXECUTED.** That cron fired and the compare logic ran
> against a populated #1, returning `sources_changed: 1` of 2. **Reading (a) was
> the correct one** — run #4 was the first-run path, as suspected here. See §8.12.

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

> **CLOSED 4 AUG 2026 — NO LONGER INFERRED.** Issue #1 was read directly via the
> GitHub REST API on 4 AUG 2026: `normalization_version: "1"`, two source
> entries, `federal-register-dod` 35762 bytes and `federal-register-va` 31229
> bytes, both carrying full sha256 values, `Last run: 2026-08-04T11:19:52Z`. The
> control-flow inference above was correct and is now superseded by observation.

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
  **EXECUTED 4 AUG 2026; this qualification is withdrawn. See §8.12.**

#### SCHEDULED FOR 4 AUG 09:00 UTC — THE LAST UNTESTED PATH (**FLOWN 4 AUG 2026 — see §8.12**)

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

### 8.12 RUN #5 — THE DIFF PATH AND THE CRON, BOTH FLOWN, 4 AUG 2026

**Run 30904317784: `event: schedule`, green.** The last untested path in §8.8
executed. Verified 4 AUG 2026 by the Orchestrator against the GitHub REST API —
the run record, issue #11, and baseline issue #1 read directly, not reported
secondhand. `gh` is not installed on this machine; the API was read over HTTPS.

| Claim | Evidence | Verdict |
|---|---|---|
| The cron is the trigger | `"event": "schedule"`, `run_attempt: 1`, `head_branch: main`, conclusion `success` | **PROVEN** |
| Compare against a populated baseline | `sources_total: 2`, `sources_fetched: 2`, `sources_changed: 1`, `sources_failed: []` | **PROVEN** |
| The compare-EQUAL branch | `federal-register-va` held a real prior hash, matched, and was excluded from `changed` | **PROVEN** |
| Findings names the expected source | `"id": "federal-register-dod"` — the corrupted one | **PROVEN** |
| BLUF renders as line 1 | `NO ACTION NEEDED — informational: J1 detected changes in 1 source(s) ...` | **PROVEN** |
| ACTING ON THIS footer, self-numbered | Footer present, resolved to `(#11)`; no `::warning::` fallback fired | **PROVEN** |
| Guarded baseline update | #1 rewritten, `Last run: 2026-08-04T11:19:52Z`, both sources present with sha256 | **PROVEN** |

**Why the compare-equal branch is the load-bearing evidence.** A first-run pass
returns everything as new — that is what run #4 did, and it exercises no
comparison at all. Run #5 returned a **mixed** result: one source differed, one
matched and was dropped. `base[s].get("sha256") != v["sha256"]` therefore
evaluated both ways for the first time. That is the diff path, executed.

#### THE MAIL LEG — WITNESSED END TO END, 5 AUG 2026

**Dean confirms issue #11's notification email reached his inbox at ~06:19 local
(CDT), 4 AUG 2026.** The API records J1 filing #11 at **11:19:50Z** — 06:19:50
CDT. Observed arrival and recorded creation fall in the same minute, so the mail
fired on issue creation with no meaningful lag.

This closes the last open leg named in §8.6: *"the one leg still unwitnessed is
whether #11 itself generated mail."* It is witnessed. **The scheduled path is now
proven end to end** — cron fires, sources fetch, diff computes against a
populated baseline, findings issue files, email lands in the Commander's inbox.
Every link observed rather than inferred, and the human leg confirmed by the
human.

Two limits on what this proves, stated so it is not over-read. It exercises the
**ROUTINE** path only — GitHub's watcher notification, the free day-one channel
of §D.4. It says nothing about **FLASH**, which still has no transport built
(§5.2 remains PROPOSED). And it is one observation, not a rate: N6's canary
exists precisely because a single delivered message does not establish a channel
that keeps delivering.

#### WHAT RUN #5 DID NOT PROVE — read before drawing conclusions

**1. The planted corruption is not isolable as the cause of the DoD diff.** The
Federal Register DoD feed **also changed naturally that morning** — the scanner
reports 35,060 to 35,762 bytes and a newest entry published 2026-08-04. Either
the corruption or the genuine update, alone, produces `changed: 1` on that
source. GitHub does not expose issue-body edit history to an unauthenticated
read, so #1's pre-run state could not be observed. **The corruption experiment
is confounded; the diff path is proven anyway**, because `federal-register-va`
carries that proof independently and does not depend on what was planted.

**2. The instruction-boundary pass is still weak** (§8.8 item 2, unchanged).
Run #5 returned `contains_instruction_like_text: false` on a benign Federal
Register feed — a second clean sample, not an adversarial one. Upgrading this
still needs an injection-shaped page. **This item stays open.**

#### CRON LATENCY — A NEW OBSERVATION, NOT A FAILURE

J1's cron is `0 9 * * *`. The run started **11:19:10Z — 2h19m late.** This is
not isolated: J3's 3 AUG scheduled run (`0 13 * * 1`) started **15:48:56Z, 2h49m
late.** Two scheduled runs, two delays near 2.5 hours. GitHub does not guarantee
cron punctuality and sheds scheduled load under contention, so this is expected
platform behaviour rather than a defect.

**It does bear on two things already written down.** §5.3's dead-man's switch
reads a missing Monday email as the alarm — that reading needs a tolerance of
hours, not minutes, or a late SITREP will be misread as a dead system. And the
`0 9 * * *` comment describing the run as 04:00 CDT is accurate about intent and
wrong about observed behaviour. **Recommend a W-3 watch item; not drafted, since
adding one is a design change and this entry is an evidence record.**

#### COST — SECOND DATA POINT

**$0.0596** for run #5 against $0.065 for run #4. Two scan-firing runs within
10% of each other, both far under the `--max-budget-usd 0.50` cap. The §4 cost
model holds shape at n=2.

---

### 8.13 V-19 REGRESSION EVIDENCE — DEEP-LINK ROUND-TRIP, 14/14, 5 AUG 2026

**The defect.** `sw.js`'s notification-tap handler parked the tap's target with
`/tool=([a-z]+)/` — lowercase letters only. The app's `validTabs` list contains
**`dd214`**, which carries digits. The regex captured `"dd"`, the app's
`validTabs` check rejected it, and the tap **silently fell back to
`dashboard`.**

Confined to the notification-tap intent path, which exists because iOS drops URL
params on cold launch. The ordinary `?tool=` query path was never affected. But
that path *is* the push path, which is why a one-character bug mattered enough to
gate a feature on: an approved push deep-linked to the DD-214 tool would have
landed users on the dashboard at the moment of maximum attention.

**The fix.** `[a-z]` → `[a-z0-9]`. One character. Cache **v106 → v107**.

**The test, and why it is evidence rather than assertion.** The harness reads the
regex **out of the shipped `sw.js`** and the tab list **out of the shipped
`index.html`**, then round-trips every tab. Nothing is retyped, so the test
cannot pass against a fix that was never applied, and it will fail if a future
edit narrows either the regex or the tab list.

```
regex extracted from sw.js:  /tool=([a-z0-9]+)/
validTabs extracted from index.html: 14 tabs

  PASS  dashboard  PASS  vamath     PASS  vapay      PASS  pathway
  PASS  resources  PASS  taxes      PASS  timeline   PASS  critical
  PASS  reminders  PASS  readiness  PASS  vethub     PASS  dd214
  PASS  finalpcs   PASS  navigator

RESULT: 14/14 round-trip
REGRESSION PASS — every deep-link target resolves
```

**Before the fix, the same harness returned 13/14** with `dd214 -> captured "dd"
-> lands on: dashboard (FALLBACK)`. That is the pre/post pair, not a single
green run.

**Gate: PASS.** Presence 1/1 both strings, absence 0/0 both old strings, encoding
0 offending added lines, `node --check` clean on `sw.js` and
`OneSignalSDKWorker.js`, `manifest.json` parses, diff scoped to `sw.js` alone
(2 insertions, 2 deletions).

**This closes §F's G5 for every current target.** G5 stays in doctrine regardless
— it is what keeps the next tab with a digit, or the next regex narrowing, from
reaching a send.

---

### 8.14 W-2 EXECUTION — actionlint INSTALLED, R0–R11 RUN, 5 AUG 2026

**Registry advanced on this evidence, not on the approval.** `validation-gate`
**1.3 → 1.4**, validated 2026-08-05.

#### Install and pin

| Step | Result |
|---|---|
| Asset | `actionlint_1.7.12_darwin_arm64.tar.gz`, 2,164,202 bytes |
| Expected SHA-256 | `aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f` |
| Actual SHA-256 | `aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f` |
| Verdict | **MATCH — verified BEFORE extraction**, character for character |
| Release `checksums.txt` cross-check | agrees (secondary evidence only, per §1 of the package) |
| `actionlint -version` | `1.7.12`, built with go1.26.1 for darwin/arm64 |
| Binary fingerprint | `8db11704dc296f096216db4db65d86cd7f0ebfdf4c38453a1da276b137b88388` — **LOCAL FIRST-USE, derived from the verified tarball, NOT an independently published value** |
| Location | `~/.local/bin/actionlint` — outside the repo tree, so MODE SELECT stays clean |

#### Regression table

| # | Case | Expected | Actual | Verdict |
|---|---|---|---|---|
| **R0** | Pin enforced, not decorative | MISMATCH declared, full stop | Altered value rejected; halt declared, no extraction | **PASS** |
| **R1** | **MANDATORY** — §8.10 empty-expression replay | **FAIL** | `13:40: unexpected end of input while parsing … [expression]`, exit 1 | **PASS** |
| **R1b** | Reported even though inside a comment | finding on the comment line | line 13 **is** the comment line | **PASS** |
| **R2** | All live workflows clean | PASS | 5 files, zero findings, exit 0 | **PASS** |
| **R3** | Malformed `cron` | FAIL, field named | `invalid CRON format "0 12 * * 8" … end of range (8) above maximum (6)` | **PASS** |
| **R4** | `pull_request` context on `schedule`-only | FAIL | **exit 0 — NOT flagged** | **FAIL — see below** |
| **R5** | Unpinned `uses:` floating tag | PASS (honest result) | exit 0, not flagged — exactly as predicted | **PASS** |
| **R6** | Shell layer live? | settle it | **exit 0, `shellcheck` not on PATH — INERT** | **INERT — clause struck** |
| **R7** | Bad runner label + misspelled `with:` key | FAIL both | runner label **caught**; `with:` key **NOT caught** | **PARTIAL** |
| **R8** | Non-workflow diff | `4S N/A` | 0 workflow paths in diff → N/A, actionlint not invoked | **PASS** |
| **R9** | Valid YAML, garbage as a workflow | step 4 PASS, 4S FAIL | 4S: missing `on:`, missing `jobs:`, 3 unexpected keys, exit 1 | **PASS** |
| **R10** | `deploy-discipline` non-interference | no bump obligation | zero `.github` paths in `sw.js` ASSETS | **PASS** |
| **R11** | Unpinned `uses:` must FAIL | FAIL | `4S-PIN FAIL`, offending line printed, exit 1 | **PASS** |
| **R11b** | Negative control, live files | PASS | `4S-PIN PASS`, **10** `uses:` lines | **PASS** |
| **R11c** | Self-certifying `@v7.0.1  # pinned` | FAIL | `4S-PIN FAIL` — the comment did not rescue it | **PASS** |

**R1 is the case that justified the whole adoption, and it passes.** actionlint
reports the empty expression **at the comment line**. The defect that took J2 down
with zero steps executed is caught locally, before staging, in milliseconds.

#### Three coverage claims did not survive execution, and were struck before the text was applied

The package's own disposition rule required this for R6. The same standard was
applied to R4 and R7 — a claim the evidence does not support does not ship in a
gate, because a gate that overstates its coverage is how the next defect gets
cleared.

**1. Shell analysis is INERT (R6).** `shellcheck` is **not on PATH** — §8.9
recorded this and it is still true. actionlint **delegates** to a separate
`shellcheck` executable rather than embedding one, so the shell layer reports
nothing. A `run:` body containing `for f in $(ls out); do echo $f; done` passes
clean. **§8.9's gap is NOT closed.** Installing a pinned, hashed `shellcheck` is a
follow-on Commander decision. This was the precise "worst of all outcomes" the
package warned about — inert while everyone believes it is running — and the case
existed to catch it. It did.

**2. `github.event.*` is not validated against the trigger (R4).** The context
layer is genuinely strong: an undefined context name, a misspelled `github.shaa`,
and a `needs.build` with no `needs:` declared are **all** caught, each with a
precise type error. But `github.event` is typed as a **bare object**, so
`github.event.pull_request.number` on a `schedule`-only workflow passes — and so
does a wholly invented `github.event.nonexistent_field.foo`. Context **names** are
checked; event **payload shape** is not. The drafted "context validity against the
trigger" claim was narrowed to what the tool actually does.

**3. `with:` input names are not checked on SHA-pinned refs (R7) — and this one is
a control interaction worth reading twice.** The misspelled `persist-credential:`
on `actions/checkout` was **not** flagged when the ref was the full SHA V-6
mandates. The same file with `actions/checkout@v5` **was** flagged, naming every
valid input. actionlint resolves inputs from a **tag-keyed** dataset, so a SHA ref
matches nothing and input validation is silently skipped.

> **Pinning a SHA disables actionlint's input checking.** The package called
> `persist-credentials: false` "especially worth proving" because it is a security
> property of J2 and a misspelling silently restores a usable token. That is
> exactly the case that cannot be checked — *because* we pin.

**This is not an argument against pinning.** V-6's control is the stronger of the
two and it stays. It is an argument against believing 4S covers `with:` keys, and
the non-coverage list now says so.

#### One correction to the package's own record

The addendum states "all 8 `uses:` lines across `j1`, `j2`, `j3`, `j5`." There are
now **10**, across five workflow files — **J4 landed after the package was
drafted** (`ops/j4-link-audit`, merged). The assertion passes on all 10. The count
is corrected here so a future reader does not treat 8 as the expected total and
conclude two refs went missing.

#### J4 IS THE STEP'S FIRST CUSTOMER — RE-GATED 5 AUG 2026

J4 merged carrying an explicit caveat in its own commit message: **"NOT gated by
actionlint."** It was authored and merged in the window between W-2 being raised
and W-2 being executed, so it is the one live workflow that never passed the check
that now exists. It is therefore the first file put through 4S, and the re-gate is
retroactive validation rather than a formality.

| Step | Result |
|---|---|
| Branch vs `main` | identical — `ops/j4-link-audit` carries no drift from the merged file |
| Step 4, Ruby/Psych `parse_stream` | `YAML OK .github/workflows/j4-link-audit.yml 38911 bytes`, exit 0 |
| **Step 4S, actionlint 1.7.12** | **zero findings, exit 0 — 4S PASS** |
| **4S SHA-pin assertion** | **`4S-PIN PASS`**, 2 of 2 `uses:` pinned to full 40-hex SHAs |

**The caveat in J4's commit message is now discharged.** A 38,911-byte workflow —
the largest in the fleet — passes the schema and expression layer clean on first
contact. That is a real result and not a foregone one: R1 proves the tool fails
files when it should, so a clean pass here carries information.

**What it does not mean.** Per the non-coverage list, J4's `run:` bodies were
**not** shell-analysed (R6, inert), and its `with:` inputs were **not** validated
because its refs are SHA-pinned (R7). J4 is gated to the standard 4S actually
provides, which is now written down honestly, and not to the standard the drafted
text claimed.

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
  **WRONG — CORRECTED 4 AUG 2026.** The slot had *not* passed. GitHub fired J3's
  cron **2h49m late**, at 15:48:56Z on 3 AUG, and the run went green. The error
  was assuming a scheduled run either fires on time or not at all. See §8.12.
- **Issue #6 already is a bot-created issue.** If it generated mail to
  `dean@veteranbridgesolutions.com`, the email leg is proven *now* and W-1 can be
  upgraded today. If it did not, that is the finding — and it is a finding we
  already have in hand rather than one waiting on a coin flip.

**Recommended: check whether #6 (and FLASH #5) produced email, and close V-4 on
that.** Tomorrow's cron is then a useful second data point rather than the sole
witness.

> **RESOLVED 4 AUG 2026 — and the coin flip landed heads.** V-4 closed on #6 as
> recommended, so nothing rested on the cron. The cron then produced a diff
> anyway: the DoD feed published on 4 AUG, J1 filed **findings issue #11**
> (ROUTINE, `github-actions[bot]`, 11:19:50Z), and the second data point exists.
> **The one leg still unwitnessed is whether #11 itself generated mail** — that
> is Dean's inbox to check, not something the API record can answer. V-4 does not
> reopen either way; #6 already closed it.
> **CHECKED AND CLOSED 5 AUG 2026 — Dean received it, ~06:19 CDT. See §8.12.**

---

### 8.11 J2 BUILD COMPLETE — FIRST SONNET TELEMETRY, RUN #3 GREEN, 3 AUG 2026

**Verified by Dean directly** on the run page and the run artifact for J2 #3.
Same closure standard as V-1, V-3 and V-11: the Commander read the primary
record himself. The figures below are his, not inferred here.

#### The overage, and why the first fix was the wrong layer

J2 #2 concluded `success` but tripped the >150k input-token instrumentation.
Root cause, visible in the run log: **`--allowed-tools "Read"` grants
whole-workspace read.** The prompt's DO-NOT-READ-`index.html` rule was
**request-level** while the tool permission was **allow-level**, so the model
read the 803 KB file whole exactly as the instrumentation was built to detect.

The instrumentation worked. The control did not exist. Those are different
things and §8.10's lesson repeats here in a new costume: *a rule stated to a
model is not a control*. `--max-budget-usd` bounded the damage and the warning
surfaced it, but nothing prevented it.

**Fix, per Dean: enforce at the tool/filesystem layer, not the prompt layer.**
The prompt rule stays as belt; the filesystem became suspenders. The analysis
step now runs against only its declared inputs, so the app source is not merely
forbidden — it is **absent**. Positive control, not negative: the sandbox admits
what is allowed rather than removing one known file, which also covers
`vendor/`, `intel/`, and `.claude/` without enumerating them.

#### Run #3 telemetry — the first real Sonnet numbers this project has

| Measure | Value |
|---|---|
| Total run | **45 s** |
| Analysis pass | **28 s** — against **70 s** unsandboxed, a **60% reduction** |
| Token warning | **did not fire** — grep-first discipline held |
| `total_cost_usd` | **$0.19762445** (from the run artifact) |

**Arithmetic against the design.**

- vs the §4 estimate of **$0.30/run**: actual is **66% of estimate**, 34% under.
- vs the **$3.00** cap: actual is **6.6% of cap**; the cap carries **15.2×**
  headroom over observed. The 10× multiplier borrowed from J1 was, if anything,
  conservative — and it should stay that way until more than one run exists.
- Monthly at weekly cadence: **4 × $0.1976 ≈ $0.79**. Five-Sunday month: **$0.99**.
- Against the **$60** target: **~1.3%**. Added to J1's ~$1.44/mo, scheduled ops
  runs at roughly **$2.23/month all-in**.

**One caveat that must not be lost.** This run priced at Sonnet 5's **intro rate
($2/$10 per MTok), which lapses 31 AUG 2026.** Standard rates are $3/$15 — a
flat **1.5×** on both columns. Projected from observed:

> $0.19762445 × 1.5 = **$0.2964/run** from 1 SEP 2026 → **~$1.19/month**.

Note what that lands on: **$0.296 against a $0.30 estimate.** §4's arithmetic was
essentially exact at standard rates, and the apparent 34% "saving" is the intro
discount, not a modelling win. Do not re-baseline the cap on the intro number.

#### Status

**J2 BUILD IS COMPLETE.** Authored, gated, staged, merged, and proven in flight
across three runs: #1 startup failure (§8.10, fixed), #2 success with the
token overage (root-caused above, fixed), **#3 green with the sandbox proven in
flight.** Section D.1 **F2 is now implemented** — the criterion that is "the
reason the system exists" has a job behind it for the first time.

Remaining J2 watch item: the governors have never fired in production. Y1–Y7
prove the logic (§8.9); no live DIVERGENT finding has yet exercised N1 or N2
against real issues. That is expected — a clean week is the common case — but
until it happens the FLASH path is proven only by regression, not in flight.

### 8.10 J2 STARTUP FAILURE — DEFECT RECORD, 3 AUG 2026

**J2 failed GitHub's workflow validation on first push. Startup failure, zero
steps executed.** Not a runtime bug; the file never became a runnable workflow.

**The defect.** A shell comment inside a `run:` block contained an Actions
expression with an empty body. GitHub substitutes expressions **textually, before
any shell exists**, so the leading `#` protected nothing — the parser saw an
empty expression and rejected the file.

**Why every local gate missed it.** The YAML was valid, so `psych` parsed it. The
Python blocks compiled. The governor regression passed 7/7. **None of those
layers evaluate Actions expression syntax**, because none of them is GitHub's
schema. The local gate proved the file was well-formed YAML containing
well-formed Python — which it was, and which was never the question.

**The compounding error, recorded because it is the reusable lesson.** The
pre-push sweep *did* flag this exact line. It was classified **"COMMENT
(inert)"** and cleared. That classification was wrong, and it was wrong for the
reason `deploy-discipline` v1.4 already states in writing: *"`${{ }}` is textual
substitution into the script body performed BEFORE any shell sees it."* The
scanner found the defect and the analyst reasoned it away using a shell mental
model on a pre-shell mechanism. **A gate that surfaces a hit is only as good as
the rule for dispositioning it** — "it's in a comment" is not a valid
disposition for anything Actions interpolates.

Sharper still: the broken line was the comment *explaining that very mechanism*.
The text describing the hazard was destroyed by the hazard it described.

**Blast radius.** J2 only. J1 and J3 were checked and carry zero empty
expressions; both remain live and unaffected.

**Fix.** The comment refers to the mechanism in prose and no longer spells an
expression, with an inline prohibition against reintroducing one. Re-gated:
0 empty expressions across all three workflows, all 10 remaining expressions
non-empty and well-formed, YAML parses, 4/4 Python blocks compile, governor
regression Y1–Y7 still 7/7.

**New standing gate, effective immediately.** Every workflow file is scanned for
empty and malformed Actions expressions before staging — comments included, with
no comment exemption. See W-2 for the tool question this raises.

### 8.5 WATCH ITEMS

Standing hazards that are not V-items: nothing to verify and close, only
something to keep watching. Added 3 AUG 2026.

#### W-2 — GITHUB'S SCHEMA LAYER IS UNCHECKED LOCALLY; `actionlint` ADOPTED

**Raised by Dean 3 AUG 2026 after the J2 startup failure (§8.10).**

The local validation stack has a structural blind spot: it can prove a workflow
is valid YAML and that its embedded code compiles, but **nothing on this machine
evaluates GitHub's own workflow schema or its expression grammar.** That entire
class of defect is currently caught only by pushing and watching a run fail —
which is the most expensive possible place to catch it, and on a scheduled job
it can mean a silent week.

The ad-hoc expression scan added in §8.10 closes the *one* case that bit us. It
does not close the class. Defects it would still miss: unknown or misspelled
`with:` keys, invalid `needs:` references, bad `runs-on` labels, context access
that is invalid for the trigger (`github.event.pull_request` on a `schedule`
run), malformed `cron`, deprecated syntax, and shell defects inside `run:`
blocks.

**`actionlint` evaluated — recommend adoption, as a local gate only.**

| Consideration | Assessment |
|---|---|
| Coverage | Validates the workflow schema, expression syntax and context validity, `cron` fields, and action inputs. Directly covers §8.10's defect and the class around it |
| Shell coverage | Bundles `shellcheck` for `run:` blocks — which also closes the gap §8.9 recorded as *not run*. Two gaps, one tool |
| Install | Single static Go binary, no runtime. `brew install actionlint`, or a pinned release binary |
| Cost | Zero. Free, open source, runs offline |
| Risk | It is a third-party binary in the validation path. Pin the version and record its hash, exactly as action SHAs are pinned per V-6 — a linter that silently changes behaviour is the same class of problem as a floating tag |

**Deliberately NOT proposed as a CI job.** Adding a workflow whose purpose is to
validate workflows puts the check downstream of the very push it exists to
prevent, and spends Actions minutes to learn what a local binary answers in
milliseconds. This belongs in `validation-gate` EDIT mode, run before staging.

**Status: APPROVED — COMMANDER, 3 AUG 2026.** `actionlint` is adopted into
`validation-gate` **EDIT mode**, **hash-pinned per the V-6 discipline** — the
binary's version and hash are recorded and pinned exactly as action SHAs are, so
a linter cannot silently change behaviour underneath the gate. Adoption confirmed
as a local gate, **not** a CI job, per the reasoning above.

**Tasking: force-mod drafts the package to Dean's desk next session.** Scope:
the `validation-gate` 1.3 → 1.4 patch text, the pinned version and hash, the
install path, where in EDIT mode the check sits relative to the existing YAML
parse, and regression cases — including a case that reproduces §8.10's empty
expression and must FAIL the gate. Registry entry updates on Dean's approval of
that package, not on this ruling.

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
