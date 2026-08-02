# PATCH PROPOSAL — 2026 POLICY INTEL, STAGE ACCURACY

**Date staged:** 2 AUG 2026
**Lane:** COMMANDER — user-facing policy claims.
**Status:** APPROVED by Dean 2 AUG 2026. All three items applied on branch
`s2-policy-intel-stage-accuracy`. Retained as the record of what changed and why.
**Basis:** Verification log V-2026-002 (CONFIRMED) and V-2026-001 (CONFIRMED).
**Target:** `index.html`, 2026 POLICY INTEL card.

The card is rendered in **two places**. Every edit below must be applied at
**both** line numbers or the two views will disagree.

---

## ITEM 1 — "GI Bill modernization" understates how stalled the package is

**Lines:** 13306 and 13531
**Why:** Two problems. "Six-bill package" reads as a discrete package; it was 6
majority-highlighted bills out of 12 on the agenda. And "marked up FEB 2026"
reads as forward progress when the chairman said on the record that none of the
bills carry offsets and therefore none can go to a Full Committee markup.

FIND (exact):
```
": six-bill package marked up FEB 2026."
```

REPLACE WITH:
```
": 12 bills marked up in the Economic Opportunity Subcommittee 24 FEB 2026, 6 of them highlighted by the majority. None carry offsets, and the chairman stated no bill advances to full committee without one. Stalled at subcommittee — do not plan around these."
```

---

## ITEM 2 — "VA Home Loan reform" overstates the stage outright

**Lines:** 13307 and 13532
**Why:** This is the sharpest overstatement. "Moving in committee" describes
bills with momentum. These are the same 24 FEB 2026 subcommittee bills, held at
subcommittee for lack of offsets. Nothing is moving.

FIND (exact):
```
": affordability and red-tape bills moving in committee."
```

REPLACE WITH:
```
": affordability and red-tape bills were in that same 24 FEB 2026 subcommittee markup. Same offset problem, same hold. Still at subcommittee, not at full committee."
```

---

## ITEM 3 — Pay raise is misattributed to the NDAA (incidental finding)

**Lines:** 13285 and 13510
**Why:** Surfaced while confirming V-2026-001. **Dean did not ask for this one** —
flagging it because the confirmation is what exposed it.

The 3.8% raise is currently appended to the TRICARE bullet inside the block
headed "FY26 NDAA — ENACTED 18 DEC 2025." Two defects: a pay raise is not a
TRICARE item, and placing it under the NDAA implies the NDAA granted it. It did
not. Per Dean's own verification, the FY2026 NDAA authorized **no** alternate
pay adjustment, which is precisely why the automatic ECI formula under
37 U.S.C. 1009 governed.

This is a structural edit, not a string swap — it splits one bullet into two.
The TRICARE bullet is the last child of its container, so note the added comma.

FIND (exact):
```
": Prime travel benefit threshold cut to 75 miles for active-duty family members (retirees remain at 100 miles); 3.8% military pay raise.")
```

REPLACE WITH:
```
": Prime travel benefit threshold cut to 75 miles for active-duty family members (retirees remain at 100 miles)."),
              React.createElement("div", null, "• ", React.createElement("strong", { style: { color: C.textPrimary } }, "Pay raise"), ": 3.8% basic pay increase effective 1 JAN 2026. This is the automatic ECI formula under 37 U.S.C. 1009 — the FY26 NDAA authorized no alternate figure.")
```

---

## IF APPROVED — EXECUTION ORDER

1. Apply items at both locations (6 edit sites total if all three approved).
2. `grep -c` each replaced string — expect 2 hits per new string, 0 for each old.
3. Real-parse structural check per `validation-gate` INTEGRITY mode. The card is
   hand-built `React.createElement` calls; item 3 changes the argument list, so
   a broken comma is a white-screen risk, not a cosmetic one.
4. **Mandatory** per `deploy-discipline` v1.1: bump `sw.js:22`
   `CACHE_NAME = 'transition-ops-v103'` → `'transition-ops-v104'`.
5. Feature branch + PR. No merge to `main` without Dean.

## NOT IN THIS PATCH

- `index.html:13304/13529` (H.R. 1458) and `13303/13528` (H.R. 980) stage claims
  were re-verified against Congress.gov and are **accurate**. No change.
- H.R. 980's *description* has an unsupported clause — see verification log
  O-2026-001. Needs the engrossed text read before any wording change. Separate
  task, not bundled here.
