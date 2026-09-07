# Alert hardening loop - iterations 1 and 2

Current handoff: final iteration 2 below. Iteration 1 notes are historical;
iteration 1 was committed by the parent as `ca7411f`.

Iteration 1 handoff snapshot, recorded before its local commit: implemented and tested; not deployed.
Branch: `codex/alert-verification-followup`.
Baseline: `e073af5212d1147b096e3e90a5747e84216135b9`.
Iteration 1 commit scope: `index.html`, `scratchpad/alert-persistence-test.cjs`,
`scratchpad/alert-verification-synthetic.cjs` (parent edit), and this log.
Exclude force-mod's `scratchpad/alert-browser-test.cjs`; it awaits iteration 2.
No service-worker bump yet, per explicit instruction. Not deployment-ready.
No network requests, real notifications, production changes, or iOS proof.

## Expected metric stated before editing; measured result

- Baseline failed storage: six reloads produce six stub notification requests.
- Target and result: denied reservation reads/writes produce zero requests in
  six loads. A fulfilled show followed by a thrown/no-op final write produces
  one request total, retains pending, and suppresses six subsequent reloads.
- Normal fulfilled delivery: one request; verified delivered state; six same-day
  reloads produce no additional request.
- Definite show rejection: verified cleanup permits retry. Thrown/no-op cleanup
  leaves pending and blocks both same-load retry and reload.
- Dedicated regression: **32/32 PASS**. Counts refer to stub calls, not OS display.

## Implementation and decisions

The new local-only `tops_rung_ledger_v1` JSON record contains version, delivered
history, lastFired local day, and a distinct pending `{id, day}` reservation.
Strict validation rejects malformed JSON, wrong schemas, invalid history values,
and invalid date markers. Direct storage access exposes failures without changing
the global safe wrappers. Every authoritative write compares the expected prior
value, writes once, then requires exact read-back. This is NOT an atomic lock.

The per-load flag is acquired before worker readiness. Selection, eligibility,
and daily key are evaluated after readiness. Before calling showNotification,
the pending reservation must be persisted and verified. Unknown completion,
synchronous show exceptions, or non-Promise results retain pending indefinitely;
there is no expiry-based retry. Fulfilled show moves pending into delivered and
sets the completion-day cap only after a verified final write. Analytics runs
only afterward and cannot undo delivery or release the slot.

Definite Promise rejection clears pending through the same verified-write path.
Failed cleanup does not release the current load's guard. Failed final writes
leave the previously durable pending record if the write did not land. If a
write landed but read-back was denied, the result remains explicitly unverified;
the current load stays blocked. A subsequent reload reads the actual durable
state, which may already contain committed delivery rather than pending.

`notifyDueRung` now returns a Promise resolving `{status, id}` instead of an
immediate attempt ID. Both existing callers ignore the return. Only status
`delivered` claims fulfilled show plus verified persistence. Console statuses
identify blocked reads/validation, reservation, uncertain show, final persistence,
and rejection cleanup. Ordinary statuses currently use the same console warning
sink; changing severity was optional and deferred to keep this iteration bounded.

Legacy delivered history and daily caps remain read-only migration inputs on each
evaluation. Legacy history is merged into the single authoritative reservation.
No legacy mirrors are written: tests configure either legacy key's writes to
throw and assert that only the new ledger is written. This avoids a second
authoritative write path and does not claim backward coordination. Old v135
contexts neither consult this ledger nor participate in future locks. There is
no blanket cross-version duplicate guarantee. No old contexts were modified.

S2 reminders, triggers, ceilings, ranking, OneSignal, global wrappers, and all
other index regions remain byte-identical to baseline. The unsupported touched
comment claiming the reported incident's cause was removed.

## Reproduce current regression

From repository root, Node built-ins only:

```sh
TZ=America/Chicago node scratchpad/alert-persistence-test.cjs
```

The harness extracts current reminder data, local engine and date helpers into
Node VM contexts, stubs storage/worker/show/analytics/console, and uses a mutable
clock initially fixed at Chicago noon on 2026-09-07. It never executes the full
page or accesses real member storage. Tests cover normal delivery, denied reads
and writes, silent no-op writes, read-back denial, final persistence failures,
same-load/reload guards, rejection and cleanup, indefinite ambiguous completion,
malformed current/legacy state, migration caps/history, either legacy write
being denied, permission denial, midnight worker/show delays, and analytics errors.
No cross-context atomicity, old-version interoperability, browser UI, iOS,
OneSignal transport, OS notification presentation, or incident root cause is
certified. Parent's independent Chromium stub harness is separate evidence.

Actual concluding output:

```text
32/32 PASS; synthetic persistence only. Cross-context atomicity, old-version contexts and iOS NOT certified.
```

## Historical baseline harness - not a current regression

The parent changed `scratchpad/alert-verification-synthetic.cjs` to load
`git show e073af5:index.html` directly, preserving the old mechanism's expected
outputs. This parent-owned internal test edit belongs in the iteration 1 commit.
It now runs from the repository root independently of the changed current index:

```sh
TZ=America/Chicago node scratchpad/alert-verification-synthetic.cjs
```

Its PASS means historical reproduction only. The dedicated persistence harness
is authoritative for current behavior. The earlier baseline output below was
obtained against the same pinned source before the parent updated the loader.

Executed baseline output included:

```text
same-load six calls: 1
six sequential loads total: 1
two concurrent loads: 2
failed storage six loads: 6
show reject: {"store":{},"guard":false}
```

## Validation evidence

EDIT mode selected. Initial porcelain output (pre-existing, untouched):

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

One app-block replacement; script displayed before execution. Unique full old
text assertion and its SHA-256 passed before replacement:
`0e486d0e71ccb9a60af74e10c5332861ba9a7b4f6b2dfb57c31099899721122b`.
Post-replacement old count 0/new count 1. The complete index diff was displayed.
An independent baseline comparison verified that substituting only that block
exactly reproduces the current index. Dedicated tests are UNPRESCRIBED behavioral
regressions supplementing the validation skill; no new skill or registry change.

Actual structural output:

```text
Presence/absence PASS: old block 0; new block 1; untouched index regions byte-identical
Removed local legacy writes and unsupported incident claim: PASS
Added/changed encoding PASS
Inline JSON 46-102: 2276 bytes PASS
Inline JS 106-127: 739 bytes PASS
Inline JS 130-148: 734 bytes PASS
Inline JS 480-14499: 818919 bytes PASS
Inline inventory: 4; src-only: 3
Standalone JS: 6 PASS; manifest JSON PASS
4S N/A - no workflow files in diff
YAML OK .github/workflows/j1-federal-scan.yml 20703 bytes 1 documents
YAML OK .github/workflows/j2-weekly-analysis.yml 49560 bytes 1 documents
YAML OK .github/workflows/j3-weekly-sitrep.yml 20981 bytes 1 documents
YAML OK .github/workflows/j4-link-audit.yml 39875 bytes 1 documents
YAML OK .github/workflows/j5-spend-check.yml 37182 bytes 1 documents
YAML OK .github/workflows/pao-weekly-packet.yml 14715 bytes 1 documents
YAML inventory: 6 tracked files; none changed
```

`git diff --check` returned no output. App diff: 123 insertions, 47 deletions,
confined to the local notification block. New persistence harness and log are additional
untracked files pending parent staging. The parent independently reproduced
32/32 persistence tests and full inline/standalone JS plus JSON parse PASS.
The parent baseline-harness edit adds two lines and removes one; it changes only
the source loader/comment. The force-mod browser harness is excluded from this commit. No cache bump or deploy clearance claimed.

## Handoff / unresolved iteration 2

Parent reviews and commits iteration 1 before authorizing iteration 2. The parent
supplied Web Locks research proposes an exclusive origin-wide lock wrapping fresh
read/select/reserve/show/finalize, failing closed with a log if unavailable. That
mechanism is NOT implemented or certified here. Storage compare/read-back still
has cross-context race windows; locks will not coordinate already-running old
versions. Pending recovery after ambiguous completion remains an explicit future
decision, never an automatic expiry. No further scope added in this iteration.

## Final iteration 2 - native exclusive lock and cache v136

Status: implemented locally on `codex/alert-verification-followup`, no commit or
push by S3. Baseline `ca7411f`. S3 edit scope: `index.html`, `sw.js`,
`scratchpad/alert-persistence-test.cjs`, and this log. The parent owns concurrent
manual-guide/final-report edits and the browser harness rerun; those are not S3
changes or S3 test claims. Final handoff also includes the parent-owned
`scratchpad/alert-channel-manual-test.md` and force-mod-owned
`scratchpad/alert-browser-test.cjs`; the parent created the final report at
`scratchpad/alert-hardening-sitrep.md`.
No real sends or network requests were performed by S3.

Expected metric stated before edits: native exclusive request absent -> present;
original 32 persistence cases remain passing, plus absent/rejected lock cases;
parent browser goal 4/5 -> 5/5. Actual S3 evidence: one native exclusive request
present, **35/35 persistence cases PASS**, independently reproduced by the parent.
The original browser goal was 5/5 from 4/5. The parent now reports force-mod's
expanded browser suite **7/7 PASS**, including context loss and absent locks.
This is attributed force-mod evidence, not an S3 browser execution. The parent
independently confirmed browser 7/7 and persistence 35/35 PASS, inline JS
819540 bytes plus all standalone JS and manifest parsers PASS, protected app
regions identical to `e073af5`, and sw.js changed exactly v135 -> v136.

`navigator.locks.request("tops-local-rung-v1", { mode: "exclusive" }, callback)`
runs after worker readiness. The callback holds the complete original fresh
read/select/reserve/show/finalize transaction, including cleanup on definite
rejection. Eligibility and calendar day are computed inside the lock after any
lock wait. Awaiting its Promise holds the lock through show completion and final
persistence. Missing locks return/log `blocked-lock-unavailable`; request failure
returns/logs `blocked-lock-rejected`. Neither path has an unlocked fallback.
Pending remains durable on lost context or ambiguous completion, with no expiry.

Only participating contexts on the same origin using this lock are coordinated.
Old versions do not participate or consult the new ledger: no cross-version
coordination guarantee. Permission/worker gates, ledger semantics, S2 content and
values, OneSignal, global wrappers and call sites are unchanged. No iOS proof.

The dedicated harness adds a native-lock-shaped stub and requires it to be held
for every storage access and every show. All original 32 test bodies remain.
New cases cover absent locks, rejected requests, and acquisition after readiness
with release only after show/finalization. The stub checks lifecycle, not actual
browser concurrency. Reproduce from repository root:

```sh
TZ=America/Chicago node scratchpad/alert-persistence-test.cjs
```

Actual new-case output and total:

```text
PASS absent native locks: explicit failure, no storage writes or notification
PASS rejected native lock: explicit failure, no fallback or notification
PASS lock acquired only after readiness, held until show and finalization finish
35/35 PASS; stubbed locks and persistence only. Native browser concurrency, old-version contexts and iOS NOT certified.
```

Each replacement script was displayed before execution; every old text matched
exactly once before replacement. New full-block counts each equal one. For two
insertions retaining their old anchor (harness setup/comment), the expected old
anchor count remains one; other replaced old blocks are absent. App diff shown
in full. Independent comparison proved the original transaction is byte-identical
apart from indentation inside the lock; unrelated index regions are unchanged.

Cache declaration changed exactly once from `transition-ops-v135` to
`transition-ops-v136`. Local main history's highest cache number is 135. The rest
of sw.js, including ASSETS and OneSignal imports, is byte-identical. No cosmetic
app version or other cache counter changed.

Full local validation output:

```text
Presence PASS: native exclusive request 0 -> 1; original transaction preserved inside lock
Untouched index regions PASS: S2/OneSignal/global wrappers/callers byte-identical
Cache PASS: v135 -> v136 exactly once; remaining sw.js bytes unchanged
Local main cache-history max: 135
Inline JSON 46-102: 2276 bytes PASS
Inline JS 106-127: 739 bytes PASS
Inline JS 130-148: 734 bytes PASS
Inline JS 480-14509: 819540 bytes PASS
Inline inventory: 4; src-only: 3
Standalone JS: 6 PASS; manifest JSON PASS
Changed-line encoding PASS; 4S N/A - no workflow edits
YAML OK .github/workflows/j1-federal-scan.yml 20703 bytes 1 documents
YAML OK .github/workflows/j2-weekly-analysis.yml 49560 bytes 1 documents
YAML OK .github/workflows/j3-weekly-sitrep.yml 20981 bytes 1 documents
YAML OK .github/workflows/j4-link-audit.yml 39875 bytes 1 documents
YAML OK .github/workflows/j5-spend-check.yml 37182 bytes 1 documents
YAML OK .github/workflows/pao-weekly-packet.yml 14715 bytes 1 documents
YAML inventory: 6 tracked files; none changed
```

`git diff --check` returned no output. Parent-owned manual-guide changes were
visible during scope verification and left untouched. Behavioral tests are
UNPRESCRIBED supplements to validation-gate; no skill/registry changes. No live
worker registration or OneSignal initialization is claimed from parse checks.
Parent reviews browser results and stages/commits; no further S3 iteration is
planned. Preview recommendation: exercise supported installed-device behavior
before production; unsupported Web Locks intentionally disable this local channel.
