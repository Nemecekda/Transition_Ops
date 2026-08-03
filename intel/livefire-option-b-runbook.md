# LIVE-FIRE RUNBOOK — OPTION B TWOFER

**Purpose.** Prove two things in one flight:
1. **The scan path works for real** — repo secret reaches the runner, headless
   `claude` executes, the prompt file loads, JSON comes back.
2. **The notification path works** — a *bot-created* issue reaches
   `dean@veteranbridgesolutions.com`.

**Status:** ready to execute. **Prerequisite: `ops/j1-findings-filing` must be
merged first.** See the ordering note below — this is the one thing that changed
from the original plan.

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
1. Merge ops/j3-weekly-sitrep        (J3, independent)
2. Merge ops/j1-findings-filing      (Option A — REQUIRED for step 4 below)
3. Corrupt one hash in the BASELINE issue body   ← the edit is in the next section
4. Actions -> J1 federal source diff-scan -> Run workflow (workflow_dispatch)
5. Observe
```

Running step 4 before step 2 proves the scan only, and files no issue.

---

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
