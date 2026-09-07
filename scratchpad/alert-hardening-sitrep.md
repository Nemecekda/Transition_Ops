# Local alert hardening - final handoff

Date: 2026-09-07. Branch: `codex/alert-verification-followup`.
Baseline: `e073af5`. Iteration 1: `ca7411f`. This report accompanies the final
iteration 2 commit. Nothing pushed, merged, or deployed by this work.

## Results

| Check | Before | Final |
|---|---|---|
| Six reloads with storage writes denied, stub requests | 6 | 0 |
| Normal delivery followed by six same-day reloads | 1 request total | 1 request total |
| Concurrent contexts, original synthetic reproduction | 2 requests | Chromium overlapping pages: 1 request |
| Native exclusive lock observed spanning delivery | Absent; browser suite 4/5 after iteration 1 | Present; expanded browser suite 7/7 |
| Persistence/failure suite | New coverage | 35/35 |
| Browser page errors / unhandled rejections in tested cases | Not established by this task | 0 |
| Phone notification presentation | Unverified | Unverified |
| Cache | v135 | v136, one change in final iteration |

The concurrent results use different test contexts; the native lock observation,
not the numerical comparison alone, establishes coordination in the browser test.
The historical reproduction remains pinned to `e073af5`; it is not a current
regression. Commands and complete iteration evidence are in
`alert-hardening-loop-log.md`.

## Changed behavior

The local channel requires a verified durable pending reservation before asking
the notification API to display a rung. Confirmed delivery is recorded only after
the API promise fulfills and final persistence is verified. Definite rejection
permits retry only after verified cleanup. Storage failures produce an explicit
console status and suppress delivery. The global storage wrappers are unchanged.

A native exclusive Web Lock surrounds fresh selection, reservation, delivery,
and final persistence. Missing or rejected locks suppress the local attempt.
The in-app reminder surfaces remain available; no member-facing wording changed.
S2 values, all reminder content, priority selection, and OneSignal code are unchanged.

WebKit documents Web Locks support in Safari 15.4:
[WebKit release notes](https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/).
The [Web Locks specification](https://www.w3.org/TR/web-locks/) defines coordination
within shared browser storage and lock release when a document unloads. These
sources support the mechanism choice, not a claim of testing Dean's iPhone.

## Limits and next verification

- An uncertain delivery or failed cleanup leaves pending indefinitely. This can
  suppress later local alerts even if the original alert never appeared. No
  automatic recovery is implemented because uncertain delivery cannot safely be
  classified as non-delivery. Do not clear real member state to force a retry.
- Old v135 pages do not participate in the new ledger or lock. Separate devices,
  profiles, origins, and storage partitions are outside the shared daily cap.
- Clearing or losing browser storage loses local history. This is not a
  server-backed delivery guarantee.
- Chromium 152.0.7977.82 tests used the extracted current engine, real localStorage
  and Web Locks, and stubbed notification APIs. No actual notification was sent.
  Full React UI, real worker delivery, OneSignal initialization, iOS presentation,
  Lighthouse and production deployment were not tested in this task.
- No incident root cause is claimed. Device/channel evidence is still needed.

PREVIEW WARRANTED: delivery behavior changed. Dean publishes the branch and runs
`alert-channel-manual-test.md` on an isolated preview, including installed iPhone
delivery and the +44/+45 boundary, before deciding on merge. The guide now names
the authoritative ledger and separates pending from confirmed delivery.

BLOCKED-POLICY: none. BLOCKED-TECHNICAL: no failing automated checks remain;
uncertain-pending recovery and old-version coordination remain explicit limits.
Termination: the two authorized mechanism fixes and local verification are
complete; no broader historical mission score is claimed. Registry unchanged.
Burn not reliably measured. Pre-existing untracked staff configuration preserved.
