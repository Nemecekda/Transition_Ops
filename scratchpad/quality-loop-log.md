# QUALITY LOOP — ITERATION LOG

Branch `ops/quality-loop-2026-09`. Composite = sum of 5 Lighthouse v11
category medians (max 500), median of 5 runs each.

| # | Defect | Files | Metric before -> after | Composite | Verdict |
|---|---|---|---|---|---|
| 0 | baseline, measure only | — | — | 444 | BASELINE |
| 1 | D-02 Google Fonts render-blocking, no preconnect | index.html | perf 70 -> 90; FCP 3568 -> 2371 ms; LCP 5830 -> 3300 ms | 464 (+20) | IMPROVED |
| 2 | D-02b fonts stylesheet still render-blocking (869 ms) | index.html | perf 90 -> 98; FCP 2371 -> 1954 ms; LCP 3300 -> 2104 ms; TBT 44 -> 4 ms; CLS 0.029 -> 0 | 472 (+8) | IMPROVED |
| 3 | D-01 OneSignal init rejection escapes as a console error on non-production hosts | index.html | best-practices 74 -> 78; console errors 1 -> 0; perf 98 -> 97 (noise, runs now flat at 97) | 475 (+3) | IMPROVED |
| 4 | D-03b no connection hints for GTM (174 KiB) / OneSignal CDN | index.html | FCP 1954 -> 1954 ms (no change) | 475 (+0) | **REVERTED** — BLOCKED-TECHNICAL |
| 5 | Candidate triage — no viable in-fence defect remains | — | composite 475 -> 475 | 475 (+0) | NO-OP — plateau |

**TERMINATION: criterion B (PLATEAU)** — iterations 4 and 5 both returned
composite improvement < 2 points.

## Final state

| Category | Baseline | Final | Delta |
|---|---|---|---|
| Performance | 70 | 97 | +27 |
| Accessibility | 100 | 100 | 0 |
| Best Practices | 74 | 78 | +4 |
| SEO | 100 | 100 | 0 |
| PWA | 100 | 100 | 0 |
| **Composite** | **444** | **475** | **+31 (1.070x)** |

All five final runs scored identically (97/100/78/100/100) — the run-to-run
variance present at baseline is gone.

## BLOCKED-TECHNICAL

- **D-06 — Best Practices capped at 78.** `third-party-cookies` (weight 5 of 27)
  and `inspector-issues` (weight 1) are both the Cloudflare `__cf_bm` cookie set
  by `cdn.onesignal.com`. This is OneSignal's CDN, not this repo, and it happens
  in production too. The only fix is self-hosting the OneSignal SDK, which is a
  change to the push pipeline — Commander lane, and not worth the risk for 6
  points. **Best Practices cannot reach 95 while OneSignal is the push
  provider**, so termination criterion A was never reachable.
- **D-03b — preconnect for GTM / OneSignal CDN: no effect, reverted.** Under
  Lighthouse's simulated throttling, connection setup to those origins already
  overlaps the document transfer, and FCP is bounded by document bytes rather
  than by handshake latency. FCP was 1954 ms before and after, to the
  millisecond. Reverted per the improve-or-revert gate.
- **D-07 — `unminified-javascript` (30 KiB) and `unused-javascript` (180 KiB).**
  The inline app script is 802,710 of 823,892 characters — 97% of the file. FCP
  is now bounded purely by document bytes, so the only remaining performance
  lever is minification or code splitting. Both require a build step, which the
  project excludes by design (single `index.html`, React vendored, no build).
  Not attempted. This is what holds Performance at 97 rather than 100.
- **D-05 — `icon-192.png` fetched twice per load.** Caused by `rel="icon"` and
  `rel="apple-touch-icon"` pointing at the same URL under a `max-age=0`
  cache policy. Dropping either link changes PWA install / home-screen icon
  behavior on iOS. 7 KB, no metric impact, real install-behavior risk — not
  worth it.

## COMMANDER LANE — recommended, NOT actioned

- **D-04 — `/vendor/*` and icons revalidate on every visit.** Netlify's default
  is `max-age=0, must-revalidate`, so 41 KB of vendored React is revalidated on
  every load. A bounded `max-age` in `_headers` would be a real repeat-visit win
  on poor connections. Not shipped: `_headers` is deploy configuration, the
  vendored filenames are not content-hashed, and a wrong value strands members
  on a stale React for the length of the TTL. Dean's call.
- **Service worker is network-first with a 3.5 s timeout**, so a repeat visit
  re-downloads all 197 KB before it will use cache. Changing that strategy
  trades freshness for speed on bad connections — a deliberate product decision,
  not a defect.
