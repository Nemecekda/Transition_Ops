# ISSUE-CLOSE POLICY — PROPOSAL, AWAITING COMMANDER RATIFICATION

**Status:** PROPOSED, 10 AUG 2026. **Nothing has been closed.** No mass-close
runs, and no job is wired to close anything, until Dean ratifies this document.

**Tasked by Dean, 10 AUG 2026,** alongside the J3 template defect repairs:
close on merge citing the commit, close on DECLINE citing the log entry, and he
ratifies before any mass-close.

This document proposes the two closes he named, adds the third case that is
actually the volume, names what must never be closed, and — the part that
changes the design — records a **measured hazard** that makes "close the
backlog" unsafe to run as a blanket sweep.

---

## 1. THE HAZARD, FIRST, BECAUSE IT CONSTRAINS EVERYTHING BELOW

**Closing an OPEN FLASH issue can cause the same condition to FLASH again.**

This is not a prediction. It is what the code does:

- `.github/workflows/j4-link-audit.yml:445-446` — the N2 dedupe governor
  matches a prior finding only when
  `str(i.get("state", "")).upper() == "OPEN"`.
- J2 (`j2-weekly-analysis.yml`) and J5 (`j5-spend-check.yml`) carry the same
  governor with the same semantics.
- The dedupe window is `DEDUPE_WINDOW_HOURS: '72'` in all three.

So: a persisting condition files FLASH once, and for the next 72 hours N2
downgrades the repeat to ROUTINE because the original is **still open**. Close
that original inside the window and N2 finds no duplicate. The condition has
not changed. The alarm fires again at full severity.

**The good half, also measured.** The N1 FLASH budget counts
`--state all` (`j4-link-audit.yml:330`, `:447` — `used = len(hist)`), so
closing never refunds budget. And **all three** J3 queries are `--state all`
(`j3-weekly-sitrep.yml:62, :89, :168`), so closing an issue does not distort
the weekly SITREP totals, the N7 arrival rate, or the canary check.

**Therefore the rule below is time-based, not taste-based:** an OPEN FLASH
issue is not closed until the condition that produced it is actually resolved,
and never inside 72 hours merely to tidy the list. Tidying the list is exactly
how you re-arm an alarm you already answered.

---

## 2. THE FOUR DISPOSITIONS

Every issue in this repo closes for one of four reasons, or does not close.
The citation is not optional — a close with no citation destroys the record
that made the issue worth filing.

### D1 — CLOSED: FIXED (as tasked)
The work merged to `main`.

    Closing: fixed by <40-hex commit SHA> on main.
    <one line on what the commit actually changed>

Cite the **merge commit on main**, not the branch commit — the branch commit
may never have shipped, and the whole point of the citation is that a reader
can confirm the fix is serving.

### D2 — CLOSED: DECLINED (as tasked)
Verified, and deliberately not acted on.

    Closing: DECLINED. Record: <intel/verification-log.md entry, or
    intel/scheduled-ops-design.md section>.
    <one line on the reason>

DECLINE is a first-class outcome, not a failure — `member-impact` already
treats it that way, and its "none is a verdict" rule is the same principle.
A DECLINE with no log entry is not a decline; it is an issue someone got tired
of. **If the log entry does not exist, write it first, then close.**

### D3 — CLOSED: RECORD FILED (not in the tasking; this is the volume)
The routine informational issues — `J1 findings`, `J4 link audit`,
`J5 spend check`, `SITREP` — are **records, not work items.** They arrive
already complete. Nobody ever "finishes" them, so under D1/D2 alone they
accumulate forever, and J1 files daily.

    Closing: record filed, no action required. Content preserved in the issue.

Closing does not delete anything, and per section 1 it does not perturb any
governor or metric. Proposed cadence: close on a **30-day lag**, so the
current window stays open and browsable, and a genuinely actionable finding
inside a routine issue has been surfaced by J2/J3 long before the lag expires.

**This is the case worth Dean's scrutiny,** because it is the one that
proposes closing issues nobody explicitly resolved. If he does not want it,
D1/D2 still stand and the backlog keeps growing — that is a legitimate choice,
and it should be a stated one rather than a default.

### D4 — NEVER CLOSED
- `BASELINE — DO NOT CLOSE` — says so in the title, and J3 excludes it by
  title from every count (`j3-weekly-sitrep.yml` `BASELINE_TITLE`).
- `ROUTINE CHANNEL TEST` (N6a canary) — the standing channel witness. J3 reads
  the **latest** one for the CHANNEL HEALTH line; closing prior canaries is
  harmless to that read, but they are cheap and their history is the evidence.
  Leave them.
- Any OPEN FLASH whose condition is unresolved — see section 1.

---

## 3. WHO CLOSES

Closing mutates the durable record. Proposed, consistent with standing
doctrine that agents prepare and Dean pulls the trigger:

- **Agents propose closes.** A close list is staged as a file — issue number,
  disposition, citation — exactly like a branch is staged.
- **Dean executes, or explicitly authorizes a specific staged list.**
- **No job closes anything.** No producer workflow gets `issues: write` for the
  purpose of closing, and J3 does not gain a close step. A machine that files
  and closes its own records is a machine that can erase its own evidence at
  0300 with nobody watching.

---

## 4. THE MASS-CLOSE — HOW IT RUNS ONCE RATIFIED

Dean ratifies **a named list, not a rule that sweeps.** The distinction is the
whole safeguard: a ratified rule executed later against a changed backlog is
not the thing he approved.

1. Generate the candidate list: every issue, with number, title, labels, state,
   age, and proposed disposition D1/D2/D3/D4 with its citation.
2. **FLASH issues are held out of the bulk list entirely** and dispositioned
   one at a time, each with the condition-resolved question answered
   explicitly. Section 1 is why.
3. Dean reviews the list itself and strikes what he wants kept open.
4. Execute only the surviving list, by number.
5. Record the run — date, count, list file — in this document.

**This list cannot be generated from this session:** `gh` is not on PATH on
this machine (`which -a gh` returns nothing), so the live backlog was never
enumerated here. The evidence in this document is all repo-resident code, and
is stated as such. Generating the candidate list is the first step of
execution, and it happens after ratification, not before.

---

## 5. WHAT THIS DOES NOT PROPOSE

- No change to any workflow file. This document is doctrine; the J3 repairs it
  ships beside are separate and independently gated.
- No auto-close automation, now or later, without its own approval.
- No relabeling of existing issues.
- No change to the N2 dedupe window or the N1 budget. Section 1 documents their
  behavior; tuning them is a separate decision with its own evidence.

---

## 6. OPEN QUESTION FOR THE COMMANDER

**Q1 — D3 cadence.** 30 days is judgment, not derived. It is one J3 window plus
margin. If Dean wants routine records to stay open longer, or to never close,
say which and this section becomes the record of that ruling.

**Q2 — does this become a skill?** It is a repeatable procedure with a hazard
that a future agent will not rediscover on its own, which is the usual argument
for codifying. Recommend force-mod runs a coverage test against
`skills-registry.md` **after** ratification, so the skill encodes the ratified
policy rather than the proposed one.
