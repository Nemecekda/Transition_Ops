# ALERT CHANNEL — FIX LOOP LOG

Branch `ops/deep-loop-alert-channel`. Design ruled SHIP by Commander 4 SEP 2026;
BP-2 trigger values S2-supplied (r-1-fedvip ETS-31d, r-p1-fedvip ETS+30d,
r-1-gar month-granular).

| # | Defect | Files | Observable before -> after | Verdict |
|---|---|---|---|---|
| 1 | B-5 `daysToETSDate` parses UTC midnight then snaps to previous local day west of UTC | index.html:3051 | US zones 13/13 wrong -> 0/13; UTC/Berlin/Tokyo 0/13 both sides | PASS |
