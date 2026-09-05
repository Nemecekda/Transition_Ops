# FLEET READINESS — FIX LOOP LOG

Branch `ops/fleet-readiness-2026-09`. Baseline composite **34/96**.
Fix order ruled by Commander 5 SEP 2026: dry-run → PAO run-status truthfulness
→ retries → metering → Navigator observability → small items.
Dry-run scope ruled: Navigator and PAO only (the send-capable two).

| # | Defect | Cells | Score before → after | Composite | Verdict |
|---|---|---|---|---|---|
| 1 | D1 no dry-run mode on the two send-capable agents | PAO c5, Navigator c5 | Navigator 0→2; PAO 0→**1** | 34 → **37** (+3) | PASS |
| 2A | D7 PAO exits green while emitting FAILED; filing failure also silent | PAO c5 | 1→2 | 37 → **38** (+1) | PASS |

**Scoring correction, iteration 1.** I first logged PAO check 5 as 0→2. That
was wrong. Check 5 scores contract AND dry-run, and it was 0 for both
reasons: no dry-run mode, and the 2026-08-17 green-run/FAILED-output
contradiction. Iteration 1 fixed only the dry-run half, so PAO check 5 went
0→1 and iteration 1's real delta was +3, composite 37. Iteration 2A closes
the contract half and takes it to 2.

PAO check 1 (EXECUTION) stays at 1 and cannot move here: it measures whether
the last four cycles ran to completion, and no edit changes runs that have
already happened. What 2A buys is that the column means something from now
on, which is what every later verification leans on.
| 3 | D3a unretried network edge: J1 fetch, Navigator upstream call | J1 c4, Navigator c4 | J1 0→1; Navigator 0→2 | 39 → **42** (+3) | PASS |

**Baseline correction, iteration 3.** The baseline claimed three single-shot
curls. A multi-line-aware scan shows only `j1:66` was single-shot — J4's two
crawls at `:178` and `:185` already carry `--retry "$CRAWL_RETRIES"` (=1), on a
continuation line the original grep could not see. J4 check 4 is 1, not 0, so
the true baseline composite is **35, not 34**, and the running composite after
iterations 1 and 2A is **39, not 38**.
| 4 | D3b ~60 unretried `gh` calls across all six workflows | J1–J5 + PAO c4 | J1 1→2, J2 0→2, J3 0→2, J4 1→2, J5 0→2, PAO 0→2 | 42 → **52** (+10) | PASS |
