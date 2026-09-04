# QUALITY LOOP — ITERATION LOG

Branch `ops/quality-loop-2026-09`. Composite = sum of 5 Lighthouse v11
category medians (max 500), median of 5 runs each.

| # | Defect | Files | Metric before -> after | Composite | Verdict |
|---|---|---|---|---|---|
| 0 | baseline, measure only | — | — | 444 | BASELINE |
| 1 | D-02 Google Fonts render-blocking, no preconnect | index.html | perf 70 -> 90; FCP 3568 -> 2371 ms; LCP 5830 -> 3300 ms | 464 (+20) | IMPROVED |
