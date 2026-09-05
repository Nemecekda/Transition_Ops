# STALENESS TIERS — S2 VALUES APPLIED

Branch `ops/staleness-tiers`, from `main` @ v134. Cache v134 -> v135.
Values S2-fixed; mechanism ours.

## MEASURED EFFECTIVE WINDOWS (days past trigger; negative = before trigger)

| Rung class | Priority | n | Window | Class ceiling binds? |
|---|---|---|---|---|
| DAY | CRITICAL | 1 | **0 .. 14** | no |
| DAY | HIGH | 1 | **0 .. 14** | no |
| MONTH | CRITICAL | 9 | **-16 .. 30** | no |
| MONTH | HIGH | 18 | **-16 .. 30** | no |
| MONTH | MEDIUM | 1 | **-16 .. 30** | no |
| MONTH | ADVISORY | 4 | **-15 .. 30** | no |

Day-anchored rungs: 14 days past trigger, then dark — down from 31 under v134.
Month-granular rungs: exact-month window plus a 15-day tail = 30 days past
trigger, then dark.

## FINDING 1 — THE CLASS TABLE IS INERT, INCLUDING ADVISORY: 60

`RUNG_STALENESS_CEILING_DAYS = { CRITICAL: 31, HIGH: 31, MEDIUM: 31, ADVISORY: 60 }`
never changes an outcome, for any rung, at any offset.

Why:
- **Day-anchored rungs** take their own 14-day ceiling, which overrides the
  class table by instruction. The table cannot apply to them at all.
- **Month-granular rungs** go dark at 30 days past trigger under the
  "exact month + 15-day tail" rule. That is tighter than 31 by one day, and
  tighter than 60 by thirty days. The tail always governs first.

So every rung in the ladder is bounded by a rule other than the class table.
**ADVISORY: 60 in particular can never take effect** — an ADVISORY month rung
goes dark at 30, not 60.

Two readings of the ruling, and I implemented the tighter one:

- **(A) Intersection — implemented.** A rung fires only if BOTH its window rule
  and its class ceiling allow it. Matches "then dark" as written. Consequence:
  the class table is dead configuration.
- **(B) Class ceiling extends the tail for ADVISORY.** ADVISORY month rungs
  would stay live to 60 days past trigger — double the others. This is the only
  reading in which ADVISORY: 60 does anything.

I took (A) because the failure being guarded is a stale claim to a member, and
(A) is the conservative direction. **If you meant (B), say so and it is a
two-line change.** Flagging rather than choosing silently, because the two
differ by a month of exposure on four ADVISORY rungs.

## FINDING 2 — DAILY-CAP DRAIN ORDER: ALREADY CORRECT, NO PATCH NEEDED

Confirmed against shipped v134 before changing anything. Simulated the daily
cap across seven ETS start points, one rung per day, re-evaluating as
days-to-ETS decreases:

    ETS +365d  CRITICAL CRITICAL CRITICAL HIGH HIGH HIGH ADVISORY   0 inversions
    ETS +545d / +200d / +92d / +45d / +31d / +15d / -20d           0 inversions

Zero priority inversions anywhere, including clusters mixing day-anchored and
month-granular rungs. The queue already drains highest-priority-first per the
shipped ruling. Re-verified after the tier change: still 0 inversions.

## FINDING 3 — PRE-EXISTING ONE-DAY BOUNDARY FUZZ (not introduced here)

The upper edge of the exact-month window moves by one day with timezone and
time of day, because `moToETS` divides a raw millisecond difference that
includes the current clock time:

    r-1-gar at ETS+46d   Chicago/LA: due    UTC/Tokyo/Auckland: not due
    r-1-gar at ETS+45d   due in all five zones

This predates this branch and this loop — it is how `moToETS` has always
behaved. Effect is cosmetic: a month rung may become due one day earlier or
later depending on where the member is. It cannot cause a stale fire (the
30-day ceiling is unaffected) and cannot cause a burst. Logged, not fixed:
changing `moToETS` would shift every month rung's window for every member and
belongs in its own change with its own evidence.

## VERIFICATION

    Engine regression      24/24 in Chicago, Los_Angeles, UTC, Tokyo, Auckland
    Drain order            0 inversions at 4 start points, after the change
    Burst repro            6 opens -> 1 notification (v134 fix intact)
    Cold open ETS+31       fires r-1-fedvip
    Cold open ETS+20       fires r-1-fedvip (past=11, inside the 14d ceiling)
    Cold open ETS-40       fires r-p1 CRITICAL ahead of r-p1-fedvip HIGH
    Inline JS parse        4/4
    Console errors         0

Test expectations for the day ceiling and the month tail were rewritten to the
new spec. That is a spec change, not a failing test edited away — the old
assertions encoded the superseded 31-day grace and exact-month-only rule, and
the new ones assert the S2 boundaries directly.
