# ALERT CHANNEL — PHASE 0 FORENSICS

Branch: `ops/deep-loop-alert-channel`
Date: 4 SEP 2026
Measure-only. No application file was modified in this phase.

## BOTTOM LINE

The local ETS-anchored channel is inert for exactly **two** reasons, and the
delivery stack underneath them is **fully functional** — proven executably, not
by inspection.

1. The firing loop is **deliberately disabled** with `slice(0, 0)`.
2. Even re-enabled, it reads the **wrong array**. The six gated rungs are not
   in the array it iterates.

Everything below that line — permission, service-worker control, `postMessage`,
the `SHOW_NOTIFICATION` handler, `showNotification` — works today.

## 1. THE INTENDED PATH, HOP BY HOP

| # | Hop | Location | State |
|---|---|---|---|
| 1 | Member enters ETS date (onboarding step 3) | `index.html:5596`, `:5630-5633` | WORKS |
| 2 | Persisted to `localStorage` under two keys, `etsDate` and `tops_sep_date` | `index.html:5632-5633` via `__safeSet` (`:486`) | WORKS |
| 3 | Read back on mount | `index.html:4820`, `:4915`, `:4436` | WORKS |
| 4 | Converted to months-to-ETS | `moToETS()` `index.html:3354` | WORKS, with a defect — see B-5 |
| 5 | Rungs evaluated against that offset | **DOES NOT EXIST** for the notification path | **BREAK — B-4** |
| 6 | Notification requested | `index.html:4988` | **BREAK — B-1, B-2** |
| 7 | `postMessage` to service worker | `index.html:4990-4995` | WORKS (proven) |
| 8 | SW `SHOW_NOTIFICATION` handler | `sw.js:88-101` | WORKS (proven) |
| 9 | `registration.showNotification()` | `sw.js:92` | WORKS (proven) |
| 10 | Tap routing / intent recorder | `sw.js:3-18`, `sw.js:103-111` | Present, not exercised here |

Permission acquisition is a separate, working path: `index.html:5293-5307`
(`Notification.requestPermission()`), reachable from the ALERTS button at
`index.html:6945`, with an iOS install precondition at `index.html:5282-5290`.

## 2. BREAK POINTS

### B-1 — PRIMARY: the firing loop is hard-disabled
`index.html:4988`

    alerts.slice(0, 0).forEach((n, i) => { // v72: on-open OS notification burst disabled ...

`slice(0, 0)` returns an empty array, so the body never executes. The inline
comment shows this was **deliberate in v72**, not an accident: "on-open OS
notification burst disabled — the in-app ALERTS panel carries these; push is
reserved for real threshold crossings."

This matters for the fix design. The original behavior was a *burst* of up to
several notifications on app open, spaced 2 s apart (`:4996`). It was removed
because bursting is hostile, not because notifying is wrong. Restoring the
channel must not restore the burst.

### B-2 — STRUCTURAL: the loop reads the wrong array
`index.html:4975` filters `NOTIFICATIONS` (`index.html:797`) on `monthsOut`.
The six gated rungs live in `SMART_REMINDERS` (`index.html:2857`) keyed on `mo`.

    NOTIFICATIONS   88 entries, ids n1..n38 + career-field records, field: monthsOut
    SMART_REMINDERS 34 entries, ids r-*,                            field: mo

Verified: `r-1-fedvip`, `r-1-gar`, `r-p1-fedvip` are **not present** in
`NOTIFICATIONS`. Fixing B-1 alone therefore fires **zero** of the six rungs. Any
fix that stops at "delete the `slice(0,0)`" is cosmetic.

### B-3 — dedupe is global, not per-rung
`index.html:4979-4986`. `lastNotifDate` is a single date string, written before
the loop. One notification of any kind suppresses every other rung for the rest
of the calendar day. Acceptable for a burst; wrong for per-rung delivery.

### B-4 — no scheduling logic exists at all
`SMART_REMINDERS` is consumed in only five places, all of them display:
search indexing (`:6066`), dashboard urgent list (`:6418`), due count
(`:6533`), reminders tab (`:13316`, `:13317`). **No code path anywhere
evaluates a rung for the purpose of notifying.** The channel was never wired,
as distinct from wired-then-broken.

### B-5 — day math is off by one across the entire US member base
**CORRECTED 4 SEP 2026 after empirical test — the original entry overstated the
blast radius by including `moToETS`.**

`daysToETSDate()` (`:3051`) does `new Date("YYYY-MM-DD")`, which parses as **UTC
midnight**. West of UTC that instant is the *previous* local day, and the
following `ets.setHours(0,0,0,0)` snaps it there permanently. Measured against
a UTC-arithmetic reference across 13 offsets:

    America/Chicago      13/13 wrong    America/Los_Angeles  13/13 wrong
    America/New_York     13/13 wrong    UTC / Berlin / Tokyo  0/13

Every US timezone is wrong by exactly one day, in the conservative direction —
a member 32 days out is told 31.

`moToETS()` (`:3354`) is **NOT affected** and must not be changed. It has no
`setHours` call, and dividing by 30.44 before rounding absorbs the sub-day
error; it measured 0 mismatches in every zone tested. The original B-5 entry
named both functions. That was wrong, and fixing `moToETS` would have been an
unnecessary edit with display blast radius.

The codebase already knew the fix — the dashboard clock uses
`new Date(separationDate + "T12:00:00")` at `:6144`.

This is a prerequisite for the day-accurate triggers, not a nicety: ETS-31 and
ETS+30 both read `daysToETSDate`.

### B-6 — first-load gate
`index.html:4971` requires `navigator.serviceWorker.controller`, which is
`null` on the very first page load before the worker takes control. A member
who grants permission and never returns gets nothing. Needs a
`navigator.serviceWorker.ready` path.

### Non-break, worth recording
`index.html:4831-4838` reads permission from OneSignal when `window.OneSignal`
is truthy, else from the native API. The OneSignal script is `defer`, so at
mount it is usually undefined and the native branch runs. Works today, but it
is a race, not a design.

## 3. EXECUTABLE EVIDENCE — the stack below the break is intact

Headless Chrome, CDP, against the real app on a Netlify-faithful local server.
Permission granted at the browser level, then the SW handler driven directly
exactly as `index.html:4990` would drive it:

    grantPermissions          : {}
    Notification.permission   : granted
    SW controller present     : true
    notifications displayed   : [{"title":"TEST RUNG","tag":"ets-test","body":"synthetic"}]

The notification was actually created and readable back via
`registration.getNotifications()`. **The plumbing works.** This is the single
most important finding in this report: the fix is upstream logic, not
infrastructure.

## 4. PLATFORM REALITY CHECK

The original design implies a background scheduler. **No such thing exists on
the web platform, on any browser, today.**

- **Notification Triggers API (`TimestampTrigger`) — ABANDONED.** Google ended
  development. Their stated reason: they could not provide consistent behavior
  across platforms, and there was no way to prune stale scheduled notifications
  without the tab being open. It was never shipped beyond origin trial.
- **Service-worker `setTimeout` — already tried and removed here.** `sw.js:73-75`
  records it: SCHEDULE_NOTIFICATION was removed in v72 because "browsers
  terminate idle workers, so delayed timers silently never fired." That lesson
  is already paid for; do not re-learn it.
- **Therefore the only mechanism that fires while the app is closed is a real
  server push.** That is OneSignal, which is already functional and already
  receives `ets_date` / `months_out` / `status` tags at `index.html:4962-4968`.

| Platform | App OPEN (evaluate-on-open) | App CLOSED | Verdict |
|---|---|---|---|
| Chrome desktop | OS notification via SW — **proven working above** | server push only | FIRES |
| Android / Chrome | same path, same API | server push only | FIRES |
| iOS/iPadOS installed PWA (16.4+) | OS notification, requires Home Screen install + user gesture for permission; `manifest.json` `display:"standalone"` prerequisite is satisfied | server push only (APNs via Web Push) | FIRES, with install precondition already enforced at `index.html:5282` |
| iOS Safari **not** installed | none — permission cannot even be requested | none | UNSUPPORTED, already handled with a toast at `:5288` |

No platform supports local background scheduling. The honest design is
**evaluate-on-open**, exactly as the mission anticipated.

## 5. PROPOSED MINIMAL FIX DESIGN

One engine, on app open, no new dependencies, no build step.

1. **Fix the date math first** (B-5). Add the `T12:00:00` guard to `moToETS()`
   and `daysToETSDate()`. Everything downstream depends on it. Own iteration,
   own test.
2. **Add a rung evaluator** that reads `SMART_REMINDERS` (B-2/B-4): select rungs
   where `r.mo === moToETS(etsDate)`, excluding dismissed. Handles negative `mo`
   (post-separation) with no special-casing since the comparison is symmetric.
3. **Per-rung dedupe** (B-3): replace the single `lastNotifDate` with a set of
   already-notified rung ids in `localStorage`. A rung notifies once, ever.
4. **Fire at most one notification per open**, highest priority first
   (`pri: "CRITICAL"` before `"HIGH"`). This restores the channel without
   restoring the v72 burst that got it disabled.
5. **Gate on `navigator.serviceWorker.ready`**, not `.controller` (B-6).
6. **Always render the in-app surface** regardless of permission state, so a
   member who declines notifications still sees due rungs. This is the graceful
   degradation path and it is the only thing that works on uninstalled iOS.

Nothing above touches rung wording. The evaluator reads `id`, `mo`, and `pri`
only, and passes `title` through unmodified to the notification.

## 6. FENCE COLLISIONS — BLOCKED-POLICY

**BP-1 — `index.html:7006` makes a claim that is currently false.** When
permission is granted the UI renders "ALERTS ACTIVE" / "Notifications synced to
your ETS date." The local channel has never fired. Members with permission
granted are being told a channel is live that is inert. Fixing the channel
makes the claim true, which is the clean resolution — but if this loop stalls,
the copy is making a promise the app does not keep. **Copy is S2 lane. Flagged,
not touched.**

**BP-2 — rung timing granularity.** `r-1-fedvip` says the FEDVIP window opens
"31 days before your retirement date," but `mo` is month-granular, so
`Math.round(days/30.44) === 1` spans roughly day 16 through day 46. The
scheduling machinery can be made day-accurate, but choosing the trigger day for
a specific benefits deadline is a content decision. **Flagged, not touched.**

## 7. MISSION PREMISES THAT DID NOT SURVIVE CONTACT

- **`ops/vgli-tail-reminders` does not exist.** No local ref, no remote ref, no
  ref matching `vgli` anywhere in the repository. Verified with
  `git for-each-ref` and `git branch -a`.
- **All six rungs are already on `main`.** Nothing is staged on a branch and
  nothing is waiting to be unblocked. Reconciling to six:
  `r-1-fedvip`, `r-1-gar`, `r-p1-fedvip` (named in the mission) plus the VGLI
  tail `r-p4` (SGLI→VGLI), `r-p6` (TAMP), `r-p12` (one-year AAR). `r-p1` is a
  seventh post-separation rung that predates the set.
- Consequence: the stated sequencing ("this branch unblocks
  `ops/vgli-tail-reminders`") has nothing to sequence against. If that branch
  exists somewhere off this machine, it must be produced before that dependency
  can be honored.

## 8. HOLDING FOR COMMANDER DECISION

Per mission, no fix iteration begins until Dean rules on the section 5 design.

Specific decisions requested:

1. **SHIP or DECLINE the evaluate-on-open design.** It is the only design that
   works on real member devices; a background scheduler is not available to
   build.
2. **One notification per app open, highest priority first** — confirm. This is
   the deliberate reversal of the v72 burst removal, and v72 is the reason the
   channel is off.
3. **BP-1**: fix the channel and leave the "synced to your ETS date" copy alone,
   or route the copy to S2 now in case this stalls?
4. **`ops/vgli-tail-reminders`**: does it exist elsewhere, or is the dependency
   dropped?
