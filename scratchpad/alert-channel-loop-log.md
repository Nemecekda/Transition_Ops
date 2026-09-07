# ALERT CHANNEL — FIX LOOP LOG

Branch `ops/deep-loop-alert-channel`. Design ruled SHIP by Commander 4 SEP 2026;
BP-2 trigger values S2-supplied (r-1-fedvip ETS-31d, r-p1-fedvip ETS+30d,
r-1-gar month-granular).

| # | Defect | Files | Observable before -> after | Verdict |
|---|---|---|---|---|
| 1 | B-5 `daysToETSDate` parses UTC midnight then snaps to previous local day west of UTC | index.html:3051 | US zones 13/13 wrong -> 0/13; UTC/Berlin/Tokyo 0/13 both sides | PASS |
| 2 | B-2/B-4 no evaluator exists; rungs unreachable from any notify path | index.html:2892 (+48, insertion only) | engine absent -> 24/24 assertions pass in Chicago/UTC/Tokyo; all six gated rungs schedulable | PASS |
| 3 | B-1/B-3/B-6 firing block dead (`slice(0,0)`), global daily dedupe, `.controller` gate | index.html (+35/-25) | channel silent -> real OS notification fires end-to-end in Chrome, 0 console errors; per-rung delivered state persists; second call advances to next rung | PASS |
| 4 | ladder never evaluated on app open — only on ETS edit | index.html (+17, insertion only) | cold reload silent -> fires unaided: d=+31 -> r-1-final, d=-45 -> r-p1-fedvip; 0 console errors both | PASS |
| 5 | day-anchored rung lost its named day to an equal-priority month-granular rung | index.html (+7/-1) | cold open at d=31: r-1-final -> **r-1-fedvip**; engine regression ALL PASS in 3 zones | PASS |
| 6 | verification pass — no code change | — | Android-class fires r-1-fedvip; denial degrades silently and does NOT burn the rung; in-app surface renders without permission; Lighthouse composite 475 (no regression from v132) | PASS |

**TERMINATION: criterion A (GOAL MET)**, with one honest boundary — real iOS
Safari cannot be exercised in this harness. Its fallback is implemented and
demonstrated, and `scratchpad/alert-channel-manual-test.md` closes the gap on
Dean's device.
