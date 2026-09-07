# QUALITY LOOP — BASELINE (Iteration 0)

Branch: `ops/quality-loop-2026-09`
Date: 4 SEP 2026
Measure-only pass. No files changed.

## HARNESS

| Item | Value |
|---|---|
| Server | `netlify-sim.js` (scratchpad tool) — gzip/brotli on text types, `_headers` rule application, Netlify default `Cache-Control` |
| URL | `http://localhost:8765/index.html` |
| Lighthouse | `lighthouse@11` (headless Chrome, default mobile throttling) |
| Runs per measurement | 5, median taken per category |

### Harness deviations from the mission spec, and why

1. **Lighthouse pinned to v11, not latest.** Lighthouse 12 removed the PWA
   category entirely. The spec calls for five categories and a composite out of
   500. v11 is the last version that scores PWA, so it is pinned to keep the
   composite comparable to the stated goal.
2. **Custom server instead of `npx serve` / `python3 -m http.server`.** Neither
   compresses. Against a bare python server the app reads as 828 KB of HTML and
   Lighthouse charges 709 KiB to `uses-text-compression` — a penalty that does
   not exist in production, where Netlify gzips. Tuning against that number
   would be chasing a phantom. `netlify-sim.js` serves gzip/brotli and applies
   `_headers`, so local scores track production and `_headers` changes are
   actually verifiable.
3. **Median of 5 runs, not 3.** Performance is bimodal across runs
   (69,70,70,87,94) because the render-blocking Google Fonts request lands
   either warm or cold. Three runs leave roughly +/-25 points of noise, which
   would make the loop's improve-or-revert gate meaningless. Five runs put three
   samples in the low cluster and give a stable median.

## LIGHTHOUSE — MEDIAN OF 5

| Category | Median | Runs |
|---|---|---|
| Performance | **70** | 70, 94, 69, 70, 87 |
| Accessibility | **100** | 100 x5 |
| Best Practices | **74** | 74 x5 |
| SEO | **100** | 100 x5 |
| PWA | **100** | 100 x5 |
| **BASELINE COMPOSITE** | **444 / 500** | |

## METRICS — MEDIAN OF 5

| Metric | Median |
|---|---|
| First Contentful Paint | 3568 ms |
| Largest Contentful Paint | 5830 ms |
| Time to Interactive | 3568 ms |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 3919 ms |
| Total byte weight (LH, incl. third party) | 518,439 B |
| Main-thread work | 479 ms |
| JS bootup time | 193 ms |

## PHASE 0 REQUIRED CHECKS

| Check | Result |
|---|---|
| Console errors on load | **1** (expected 0) — see defect D-01 |
| Transfer size, `index.html` | 828,602 B raw / **197,613 B** gzip |
| Time to Interactive | 3568 ms |
| Internal link check | **PASS** — 6 internal refs, 0 broken |
| Service worker offline test | **PASS** — SW active at scope `/`, offline reload renders (title correct, `#root` populated, 952 chars body text, 0 exceptions) |
| JS parse check, inline blocks | **PASS** — 4 blocks (3 JS + 1 JSON-LD), 0 parse failures |

## DEFECT BOARD (from baseline audit)

| ID | Defect | Category | Weight | In scope? |
|---|---|---|---|---|
| D-01 | OneSignal SDK throws `Can only be used on: https://transitionops.org` on every non-production host | Best Practices `errors-in-console` | 1 | Yes — tech |
| D-02 | Google Fonts stylesheet is render-blocking in `<head>`; no `preconnect`. Drives FCP and the 70/94 bimodal split | Performance FCP/LCP/SI | 45 | Yes — tech |
| D-03 | GTM ships 174 KiB, the largest single resource, competing for bandwidth during the critical path | Performance | — | Yes — tech |
| D-04 | `/vendor/*` and icons served with Netlify default `max-age=0`; `uses-long-cache-ttl` fails on 4 resources | Performance (diagnostic) | 0 | Yes — `_headers` |
| D-05 | `icon-192.png` requested twice per load | Performance | — | Yes — tech |
| D-06 | OneSignal CDN sets third-party cookie `__cf_bm`; also raises a Chrome Issues-panel entry | Best Practices `third-party-cookies` (5) + `inspector-issues` (1) | 6 | Third-party controlled |
| D-07 | `unminified-javascript` — 145 KiB; `unused-javascript` — 517 KiB | Performance (0 weight) | 0 | Deferred — no build step by design |

Best Practices is capped at 74 by D-01 (w=1), D-06 (w=5+1), and
`valid-source-maps` (w=0). D-06 is the dominant term and is set by OneSignal's
CDN, not by this repo.
