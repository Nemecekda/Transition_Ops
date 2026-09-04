# QUALITY LOOP — ITERATION LOG

Branch `ops/quality-loop-2026-09`. Composite = sum of 5 Lighthouse v11
category medians (max 500), median of 5 runs each.

| # | Defect | Files | Metric before -> after | Composite | Verdict |
|---|---|---|---|---|---|
| 0 | baseline, measure only | — | — | 444 | BASELINE |
| 1 | D-02 Google Fonts render-blocking, no preconnect | index.html | perf 70 -> 90; FCP 3568 -> 2371 ms; LCP 5830 -> 3300 ms | 464 (+20) | IMPROVED |
| 2 | D-02b fonts stylesheet still render-blocking (869 ms) | index.html | perf 90 -> 98; FCP 2371 -> 1954 ms; LCP 3300 -> 2104 ms; TBT 44 -> 4 ms; CLS 0.029 -> 0 | 472 (+8) | IMPROVED |
| 3 | D-01 OneSignal init rejection escapes as a console error on non-production hosts | index.html | best-practices 74 -> 78; console errors 1 -> 0; perf 98 -> 97 (noise, runs now flat at 97) | 475 (+3) | IMPROVED |
