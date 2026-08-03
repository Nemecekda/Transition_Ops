# LIVE-FIRE RUNBOOK — OPTION B TWOFER

**Purpose.** Prove two things in one flight:
1. **The scan path works for real** — repo secret reaches the runner, headless
   `claude` executes, the prompt file loads, JSON comes back.
2. **The notification path works** — a *bot-created* issue reaches
   `dean@veteranbridgesolutions.com`.

**Status:** BLOCKED on pre-flight baseline repair. Two prerequisites must merge
first — `ops/j1-findings-filing` (so an issue is filed at all) and
`ops/j1-baseline-hardening` (so the baseline lookup is deterministic). Both are
staged. See PRE-FLIGHT and ORDERING below.

---

## PRE-FLIGHT — BASELINE REPAIR (added 3 AUG 2026, do this first)

A pre-flight check found **two** baseline issues, #1 and #2, with **#2 empty**
(`sources: {}`). Diagnosis and fix are on `ops/j1-baseline-hardening`. The
flight cannot proceed until the baseline is repaired, because with two open
baselines the old lookup picked one non-deterministically — a coin-flip test
result proves nothing.

### Disposition — one canonical baseline

**#1 survives as canonical. #2 is closed.** The fix pins the baseline to
**issue #1** as an in-file constant (`BASELINE_ISSUE: '1'`), so #1 must be the
one that remains open and correctly populated.

**Before closing anything, confirm #1 is healthy.** Its fenced JSON must contain
**both** sources — `federal-register-va` and `federal-register-dod` — each with a
64-character `sha256`. If #1 is *also* degraded, stop and say so; the pin target
changes and the bootstrap path below applies instead.

**Close #2 with this comment.** The title says DO NOT CLOSE; this is the
documented exception Dean authorised, and the comment is what makes it
documented rather than arbitrary:

```
Closed by Commander order, 3 AUG 2026.

This issue is a DUPLICATE baseline, created by a defect in J1's baseline
lookup. The lookup searched by title and treated an empty result as "no
baseline exists" — which is indistinguishable from a lookup that FAILED. One
transient API error caused the workflow to invent this second baseline.

Its source table is empty ({}), because the same run also failed to fetch
either source. It never held valid state and nothing is lost by closing it.

#1 is the canonical baseline. J1 is now PINNED to #1 by number and can no
longer create a baseline issue at all — see ops/j1-baseline-hardening.

Retained rather than deleted, as the evidence for that defect.
```

**Do not delete #2.** It is the evidence.

### If #1 turns out to be degraded too

Then there is no healthy baseline and one must be bootstrapped by hand — the
workflow can no longer create one, deliberately. Edit #1's body to contain a
fenced ```json block holding exactly `{"normalization_version": "1", "sources":
{}}`, then run J1 once. The guard will **refuse** to write over it and file a
FLASH, which is correct: it proves the guard works. Then fix whatever broke the
fetch, and re-run — the first run with both sources fetched populates it.

---

## ORDERING — READ THIS FIRST

The twofer as originally specified could not work, for a mechanical reason:

**J1 had no step that files an issue when a diff is found.** Its only
issue-creating paths were the first-run baseline creation (already spent on
Issue #1) and the `if: failure()` FLASH report. A corrupted hash would have
fired the scan — proving half — and then filed nothing, proving nothing about
notification. The flight would have been a half-twofer with no way to tell which
half had failed.

That gap is exactly what Option A closes. So the order is:

```
1. Confirm #1 healthy, close #2          (pre-flight section above)
2. Merge ops/j3-weekly-sitrep            (J3, independent)
3. Merge ops/j1-findings-filing          (Option A — REQUIRED for the issue to be filed)
4. Merge ops/j1-baseline-hardening       (pinned lookup + guarded write — REQUIRED before any dispatch)
5. Corrupt one hash in #1                ← the edit is in the next section
6. Actions -> J1 federal source diff-scan -> Run workflow (workflow_dispatch)
7. Observe
```

Dispatching (step 6) before the findings merge (step 3) proves the scan only and
files no issue. Dispatching before the hardening merge (step 4) risks the
non-deterministic lookup picking the wrong baseline — a coin-flip result.

---

## MY CALL: CORRUPT ANYWAY, DO NOT RELY ON A NATURAL DIFF

Dean asked whether the repaired baseline makes a natural diff sufficient.
**No — corrupt anyway.** Three reasons:

1. **A natural diff is likely but not guaranteed.** The Federal Register
   endpoints return the newest 20 documents and do change often, but "often" is
   not "on demand." If no diff appears, the scan is skipped and the flight
   proves nothing — and you dispatch again tomorrow having learned nothing.
2. **The corruption tests a different thing, and the better thing.** A natural
   diff and a corrupted hash both produce `count >= 1`, but only the corruption
   proves detection against *known prior state you chose*. If the run reports
   exactly the source you corrupted, the compare logic is confirmed end to end.
3. **It costs nothing and self-heals.** The guarded write rewrites the baseline
   with real hashes at the end of the same flight.

**If the count comes back 2 instead of 1, that is a natural diff riding along.**
Not a problem, not a failure — note it and read the scan output for both.

## THE CORRUPTION EDIT

Open the pinned issue titled **`BASELINE — DO NOT CLOSE`** and edit the body.
Inside the fenced ```json block you will find a structure like this:

```json
{
  "normalization_version": "1",
  "sources": {
    "federal-register-dod": {
      "bytes": 48213,
      "sha256": "9f2b1c...<64 hex chars>...a7e4"
    },
    "federal-register-va": {
      "bytes": 51044,
      "sha256": "3c8d40...<64 hex chars>...11bf"
    }
  }
}
```

**Change exactly one character** in **one** `sha256` value — the first character
of `federal-register-va` is ideal. For example if it begins `3c8d40`, make it
`0c8d40`.

Do not change `bytes`. Do not change `normalization_version`. Do not add or
remove a source. Do not reformat the JSON.

**Why one character in one hash:**
- The diff step compares `sha256` values only, so a single altered character is
  sufficient to register exactly one changed source.
- Leaving `bytes` alone keeps the record obviously hand-edited and easy to
  recognise later.
- Changing `normalization_version` would invalidate **every** stored hash at
  once and flag both sources — a bigger, noisier test than needed.
- Corrupting the JSON *structure* would instead throw in the diff step, fail the
  job, and fire the FLASH path. That is a different test — see Variant C.

**Self-healing:** the run rewrites the baseline at the end of the same flight,
so the corrupted hash is replaced with the real one automatically. **No cleanup
is required.** The corruption survives exactly one run by design.

---

## WHAT SHOULD HAPPEN

| Step | Expected | What it proves |
|---|---|---|
| Diff | `changed sources: 1` | Baseline read/compare loop works against real stored state |
| Scan | Step runs (not skipped); `out/scan-result.json` produced | Secret reached the runner, headless `claude` executed, prompt file loaded, `--output-format json` returned |
| File findings | New issue **`J1 findings <date>`**, label ROUTINE | **The bot-created-issue path** |
| Notification | Email at `dean@veteranbridgesolutions.com` | **V-4 closed on live-fire evidence** |
| Update baseline | Issue #1 body rewritten, corrupted hash gone | Baseline write-back works; test self-cleans |
| Artifact | `j1-evidence-<run id>` uploaded | Evidence retained regardless of outcome |

---

## HOW TO READ THE OUTCOMES

**Both halves pass.** V-4 closes on live-fire evidence. W-1's detection rating
stops being provisional — absence of email becomes a trustworthy signal.

**Scan runs, no issue filed.** Option A was not merged, or the findings step
errored. Check the run log for the `File findings` step; if it is greyed out the
gate condition did not fire, if it is red read the error.

**Issue filed, no email.** *This* is the meaningful negative. The watch fix did
not take, or notification routing is going somewhere unexpected. Check
GitHub -> Settings -> Notifications, and confirm the repo is set to **All
activity** rather than Participating.

**Scan step skipped entirely.** The diff count was 0 — the edit did not land in
the fenced JSON block, or a stray character broke the fence. Re-check the issue
body renders as JSON inside triple backticks.

**Job fails at Read baseline or Diff.** The JSON was structurally broken by the
edit, not just altered. Not a disaster: the FLASH path fires and proves
bot-issue creation anyway, but the scan is not exercised. Restore valid JSON and
re-run.

---

## WHY NOT THE OTHER VARIANTS

- **Variant C — Dean opens an issue himself.** Does not work. GitHub does not
  notify you about your own actions, so it would false-negative and, worse,
  would look like the same failure as a broken watch setting.
- **Variant D — wait for a real diff.** Valid but unbounded. Federal Register
  endpoints may change daily or sit still for a week; the test would not be on a
  schedule you control.
- **Deliberately failing the job to fire FLASH.** Proves notification without
  proving the scan, and leaves a FAILED issue in the record that a future reader
  has to interpret. Kept as a fallback only, above.

---

## AFTERWARDS

If both halves pass, the following change status and should be recorded:

- **V-4** — CLOSED on live-fire evidence (currently FIX APPLIED, PROOF PENDING).
- **W-1** — detection rating upgraded from provisional to confirmed.
- **§8.6** — the "no producer" gap is closed by Option A; note the live-fire
  result against it.

Hand me the run outcome and I will stage those updates.
