# INCIDENT — SIX SIMULTANEOUS NOTIFICATIONS, iOS INSTALLED PWA

Shipped state at time of incident: `origin/main` = `4750986`, SW cache v133.
That is my code, deployed. Branch: `ops/alert-burst-hotfix`.

## REPRODUCED

Six app opens, notifications never dismissed, ETS set one year out:

    open #1 -> 1  [ets-r-12-bdd]
    open #2 -> 2  [+ ets-r-12-tax]
    open #3 -> 3  [+ ets-r-12-sbp]
    open #4 -> 4  [+ ets-r-12-tsp]
    open #5 -> 5  [+ ets-r-12-sb365]
    open #6 -> 6  [+ ets-r-12-gib48]

That is the incident, exactly.

## ANSWERS, IN THE ORDER ASKED

### 1. Was the one-per-open gate in the shipped code path?

It was in the shipped path, but it was never a **per-open** gate. It is a
**per-invocation** gate: `notifyDueRung()` takes `due[0]` and returns. One call,
one notification. Nothing limited how many times it was called, and nothing
carried state across calls.

The harness only ever measured a single cold open, so it could not see this. My
iteration-3 evidence actually contained the bug in miniature — I recorded
`second call returned r-1-fedvip` and read it as proof that dedupe worked. It
was proof that consecutive calls walk down the ladder. I had the failure in hand
and misread it.

### 2. Delivered-state before or after the show? Does it loop all dues?

**No loop.** `var rung = due[0]` — a single rung per call. Six dues did not
produce six fires in one call. That hypothesis is wrong.

**Written before**, synchronously, ahead of the async `showNotification`. That
was deliberate for race safety, and it is the mechanism of the burst: each call
re-reads the delivered map, filters out everything already marked, and takes the
next one. Dedupe advanced a cursor instead of blocking. So the shape is
N invocations x 1 rung, not 1 invocation x N rungs.

### 3. Staleness — did every negative-offset rung evaluate as due?

**No, and the reported premise does not reproduce.** Measured:

    ETS  -400d  N_DUE=0      ETS -1095d  N_DUE=0
    ETS  -500d  N_DUE=0      ETS -1825d  N_DUE=0
    ETS  -730d  N_DUE=0      ETS -3650d  N_DUE=0

An ETS far in the past yields **zero** due rungs. Month-granular rungs fire only
in their exact month (`r.mo === moToETS`), and day-anchored rungs carry a 31-day
grace. Nothing can fire years late; a years-old "30 Days Left on the Window"
alert was not possible in v133 and is not possible now.

The burst signature points the other way. The largest simultaneous-due cluster
is **seven rungs at ETS +365d** (`mo:12` — bdd, tax, sbp, tsp, sb365, gib48,
rso), and the six tags observed are six of exactly that cluster.

**This matters operationally**: the stored `etsDate` behind the incident looks
like roughly one year in the FUTURE, not the past. Worth confirming what is
actually in `localStorage.etsDate` on your device, because if it disagrees with
what you believe it is, that is a second defect and it is not this one.

## WHAT SHIPPED IN THE HOTFIX

1. **Structural one-per-open.** `__rungFiredThisOpen`, a module flag claimed
   before the async show and released only if the show fails. Enforced inside
   `notifyDueRung`, not at the call sites, so no future caller can bypass it.
2. **A daily cap — NOT in your list, and the fix does not work without it.**
   One-per-open alone does not prevent this incident: six opens is still six
   notifications, which is what happened. `tops_rung_last_fired` holds a date
   string and permits at most one rung notification per calendar day across
   opens. Flagging it explicitly because it is a behaviour decision you did not
   ask for: a member at a 7-rung cluster now receives them one per day over a
   week rather than one per app open.
3. **Delivered-state written ON FIRE**, inside the `showNotification` promise,
   not before it. A rung that fails to show is no longer burned. The per-open
   flag removes the race that the old ordering was defending against.
4. **Staleness ceiling.** `RUNG_STALENESS_CEILING_DAYS` per priority class,
   currently 31 across the board, PENDING S2 values. `rungTriggerDay()` derives
   the trigger point for both rung classes; `rungIsStale()` suppresses anything
   further past it than the ceiling.

   **Stated plainly: this guard changes nothing today.** Swept all 34 rungs
   across 1,601 ETS offsets — 54,434 combinations, 1,030 of them due — and the
   ceiling suppressed **0**. It is defence in depth that stays correct if a
   window is ever widened. It is not what fixes the incident. The throttle is.

## VERIFICATION

    Burst repro, ETS+365, 6 opens : 6 notifications -> 1
    Cold open ETS+31              : fires r-1-fedvip
    Cold open ETS-45              : fires r-p1-fedvip (negative offset intact)
    Engine regression             : 24/24 in Chicago / UTC / Tokyo
    Staleness sweep               : 0 of 1,030 due cases suppressed
    Inline JS parse               : 4/4
    Console errors                : 0

## STILL OPEN

- **S2 owes the per-class ceiling values.** The table is live with a uniform 31
  and marked PENDING.
- **Latent, not fixed here, not incident-related.** `daysToETSDate` appends
  `"T12:00:00"` to its argument. If a caller ever passes a full ISO timestamp
  instead of `YYYY-MM-DD`, the parse yields `Invalid Date` and day-anchored
  rungs silently stop firing. Every current caller passes `YYYY-MM-DD`, so this
  is dormant. It produces silence, never a burst. Logged rather than fixed
  because a hotfix should carry one concern.
