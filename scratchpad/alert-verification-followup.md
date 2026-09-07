# ALERT VERIFICATION FOLLOW-UP - INTERNAL PROPOSAL

Reviewed 2026-09-07. Branch: `codex/alert-verification-followup`.
Baseline HEAD: `d825163`. Review and tests made no app changes, network requests, or real sends. Documentation and the synthetic harness are prepared for a local commit.
Current S2 values are preserved: day ceiling 14; month half-window 15 plus
15-day tail; class ceilings CRITICAL/HIGH/MEDIUM 31, ADVISORY 60.
Phone execution belongs to Dean. This report makes no iOS validation claim and
does not establish the incident's channel or root cause.

## Existing evidence captured before edits

The manual-test document had no initial diff. Its SHA-256 was
`52316201205b1ce0492ad92357c946c2536ed6ec7ba4a7a1a5f548ca2bdb8fb3`.
Initial status contained only pre-existing untracked `.agents/`, `.codex/`, and
`AGENTS.md`. Those were not changed by this work.
The old procedure expected the post-separation target at 45 days, assumed the
alert would wait for reopening after an ETS edit, and suggested clearing site
data or deleting/reinstalling. The replacement removes those assumptions.
Its full old content was read before replacement; baseline hash and unique
old-text assertions passed before writing. No device evidence was collected.

## Four findings

1. **Proven mechanism limitation: daily cap is not coordinated across contexts.**
   `index.html:2995-3018` claims a per-load flag before asynchronous delivery,
   but the daily marker is read before delivery and written only at
   `index.html:3036`. Two fresh VM contexts sharing one storage object both
   passed the check before their promises settled, causing two stub API calls.
   Same-load repetition and sequential same-day reloads each produced one call.
   Whether real OS presentation stacks, replaces equal tags, or suppresses them
   is untested. This is not evidence of the reported incident's cause.

2. **Proven defect under failed storage writes: persistence protection fails.**
   `index.html:486` swallows storage write failures. Successful stub delivery
   followed by failed writes at `index.html:3033-3037` loses both the delivered
   map and daily marker. Six fresh loads with failing storage yielded six API
   calls. In contrast, rejected `showNotification` left the map empty and reset
   the flag through `index.html:3040`, preserving retry eligibility. The return
   at `index.html:3042` identifies the attempt before async success; it does not
   prove delivery. Actual member storage failures have not been demonstrated.

3. **Confirmed effective windows: ADVISORY 60 is currently a nonbinding backstop.**
   `index.html:2937-2964` admits day rungs at 0 through 14 days past trigger,
   inclusive. Month rungs use the rounded exact-month match plus a tail through
   30 days past trigger. The existing class table does not extend that tail.
   The 2,201-offset sweep found zero due cases suppressed by the stale check.
   At fixed Chicago noon, observed aggregate month ranges were CRITICAL/HIGH/
   ADVISORY -16..30 and MEDIUM -15..30 days past trigger. These are observations
   for this clock and dataset, not universal per-rung early boundaries.
   `moToETS` at `index.html:3508-3511` depends on raw time, unlike the calendar-day
   helper at `index.html:3202-3212`. The table in `staleness-tiers.md:10-15`
   should not be treated as a timezone-independent specification. No S2 change
   is proposed here. Isolated post-separation +44 includes `r-p1-fedvip`; +45
   excludes it. In both unisolated fixtures `r-p1` takes priority.

4. **Confirmed ordering and local entry points; no priority inversion found.**
   `index.html:2969-2985` sorts CRITICAL, HIGH, MEDIUM, ADVISORY, then puts
   day-anchored rungs first within equal priority; remaining ties retain source
   order. The sweep counted zero adjacent priority inversions within each
   evaluation. It did not test a multi-day queue drain or eventual delivery.
   `index.html:5110-5119` schedules permission-dependent evaluation after a
   two-second delay; `index.html:5120-5145` evaluates directly on settings ETS
   changes. The settings input commits on blur at `index.html:7035`.
   These entry-point conclusions are static code evidence, not UI timing tests.
   Local display uses the worker's `showNotification`, `ets-<id>` tags, and `/`
   destination at `index.html:3022-3029`. This code schedules no closed-app local
   alert. No OneSignal behavior was executed or verified in this review.

## Reproducible synthetic evidence

Artifact: `scratchpad/alert-verification-synthetic.cjs`.
From the repository root, run exactly:

```sh
TZ=America/Chicago node scratchpad/alert-verification-synthetic.cjs
```

Node built-ins only, no packages, browser, network, real storage, or actual
notifications. The harness reads current `index.html` and extracts the reminder
data, local engine, two date helpers, and storage wrappers using asserted unique
anchors. It does not execute the rest of the page. It runs in isolated Node VM
contexts with notification permission granted, resolved fake worker readiness,
stubbed `showNotification`, and in-memory storage. Tracking is absent.
The clock is fixed at 2026-09-07 12:00 America/Chicago (-05:00).

Exact cases: six synchronous calls in one context; five additional sequential
contexts using the first case's persisted storage; two concurrent fresh contexts
sharing storage before microtasks settle; six fresh contexts with all writes
throwing; one rejected show promise; and an inclusive -1100..+1100 calendar-day
ETS sweep over the current reminder dataset with an empty delivered map.
The saved harness adds isolated and unisolated -44/-45 ETS eligibility checks
to the original review cases. Isolation marks all other reminder IDs delivered.
The positive/negative boundary checks call `dueRungs`, not the notification API.

Actual output (Node v24.18.1):

```text
same-load six calls: 1
six sequential loads total: 1
two concurrent loads: 2
failed storage six loads: 6
show reject: {"store":{},"guard":false}
Chicago frozen-noon sweep: {"groups":{"MONTH HIGH":{"min":-16,"max":30},"MONTH CRITICAL":{"min":-16,"max":30},"DAY HIGH":{"min":0,"max":14},"DAY CRITICAL":{"min":0,"max":14},"MONTH MEDIUM":{"min":-15,"max":30},"MONTH ADVISORY":{"min":-16,"max":30}},"suppressed":0,"inversions":0,"isolated44":["r-p1-fedvip"],"isolated45":[],"unisolated44":["r-p1","r-p1-fedvip"],"unisolated45":["r-p1"]}
PASS: synthetic checks only; no browser, iOS, or incident attribution tested.
```

Counts are stub API invocations, not displayed notifications. Not covered:
real iOS/Android, installation, permission UX, React effects, actual ETS input
events, worker lifecycle or readiness stalls, real quota behavior, partial writes,
storage corruption/read failures, cross-midnight behavior, OS tag replacement,
multiple timezones, OneSignal, incident device state, or policy/title accuracy.

## Proposed fix order - internal, not implemented

1. **Storage-write fail-loud / persistence protection.** Give the local alert
   caller an explicit write-success/failure result and protect against repeat
   delivery when durable state cannot be trusted. Decide and document behavior
   for partial writes and failed persistence; do not merely add a log while
   leaving reloads unprotected. Keep success reporting distinct from a returned
   attempt ID. Regression cases should include both writes failing, either write
   failing alone, reload after failure, and rejected show without burning a rung.
   Do not silently change the global storage wrapper for unrelated app modules.
2. **Cross-context cap coordination.** After persistence behavior is defined,
   coordinate the daily slot across simultaneous contexts with explicit failure
   and recovery semantics. Two contexts must not both pass an unreserved daily
   check. Test shared storage, delayed delivery, rejection, and context loss.
   Select a coordination mechanism only after evaluating supported platforms;
   this report does not prescribe a browser API or authorize an implementation.

Preserve all S2 values in either proposal. Extending ADVISORY eligibility to 60
days is a separate Commander decision. No new skill is added. Dean's device
evidence must distinguish local alerts from other channels before anyone claims
an incident root cause. Use `alert-channel-manual-test.md` for that handoff.
