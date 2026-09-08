# ALERT CHANNEL - MANUAL VERIFICATION ON A REAL DEVICE

Owner: Dean. Status: NOT EXECUTED on a phone by the agent.
Use a separate test origin/profile and disposable test data. This procedure
checks the current local alert implementation; it does not change S2 values.
Synthetic API tests do not prove iOS behavior or the incident root cause.

## 0. Capture evidence before changing anything

Before editing ETS, granting permission, resetting storage, or dismissing alerts,
record the existing notification titles, timestamps, and screenshots; device/OS;
Safari versus Home Screen launch; exact origin; app/build and worker version if
available; local date/time/timezone; and the sequence of opens and ETS edits.
Capture these storage values read-only if inspection is available:
`etsDate`, `tops_sep_date`, `tops_rung_notified`, `tops_rung_last_fired`,
and the authoritative `tops_rung_ledger_v1` record.
Record notification permission and any inspectable tag/payload. A local rung uses
`ets-<rung-id>`; title alone does not prove the channel. Mark unavailable evidence
as unavailable. Do not clear or overwrite real member data to obtain a test.

Use an isolated preview/test origin and separate profile where supported. On
an iPhone without profile isolation, use a separate test origin and verify the
installed icon opens that origin. Do not use production for fixture changes.
If isolation or inspection cannot be established, record BLOCKED for that case.
Do not assume uninstalling/reinstalling clears storage or notification permission.

## 1. Preconditions and timing for every case

- Keep only one test app context open; concurrent-context testing is separate.
- Record starting permission, both ETS keys, delivered map, and daily marker.
- A successful local alert consumes the current page-load slot and writes a
  local-calendar-day marker. Later ETS edits or same-day reopens normally cannot
  deliver another rung, even if the newly selected rung has higher priority.
- The settings/profile ETS control calls `handleETSChange` on blur: observe for
  a notification immediately after committing the edit. Do not force-close
  before its asynchronous delivery settles. The dashboard clock uses a different
  save path; do not substitute it in this test.
- Reopening with a stored date and granted permission schedules evaluation after
  approximately two seconds, plus worker-readiness/OS delay. This is not a hard
  delivery deadline. Granting permission can also trigger that delayed evaluation.
- If delivery already occurred during an edit or permission change, reopening
  should not deliver it again. Silence on reopen alone is not a failed alert test.
- Record successful API delivery state separately from visible OS presentation;
  a returned rung ID alone is not evidence that delivery succeeded.

## A. iPhone installed PWA: pre-separation positive and daily cap

1. Start on the isolated origin in Safari, not installed, with no saved test ETS.
   Try Enable Alerts. Expect the install-first message; record actual wording.
2. Share -> Add to Home Screen, then launch the test icon. Enable alerts and
   accept permission. Record the actual permission result.
3. With a fresh delivered map and no marker for today, set ETS in settings/profile
   to exactly 31 calendar days in the future and blur the field. Observe the edit
   before reopening. Expected target: `r-1-fedvip`, title containing
   "FEDVIP Dental/Vision Window OPEN (Retirees)". It is CRITICAL and day-anchored,
   so it wins over equal-priority month rungs. Expect one local request, no burst.
4. Once delivery/state have settled, force-close and reopen the Home Screen app.
   Expect no additional local rung notification that day. Repeat reopen once.
   Record the delivered map and daily marker after each observation.
5. For a distinct reopen-timing case, use another isolated fresh fixture: save
   the same date with permission not granted, then enable permission. An alert
   may arrive on permission change. If it does, the subsequent reopen must be
   silent. To test mount specifically, prepare a stored date and granted
   permission while the app is closed using test inspection, then launch fresh.
   Record which trigger actually ran; do not label an edit fire as a reopen fire.

## B. Post-separation boundary: +44 positive, +45 negative

Here +44/+45 mean days AFTER separation: ETS is 44/45 calendar days in the past,
so `daysToETSDate` is -44/-45. The target `r-p1-fedvip` triggers at -30 and permits
14 days past that trigger. +44 is included; +45 is excluded.

Run B1 and B2 as independent fresh fixtures, not as same-day continuations of A.
Before each fixture, in the isolated test storage only, set BOTH ETS keys to the
case date, remove `tops_rung_ledger_v1` and the legacy test daily marker, and seed
the legacy delivered map `tops_rung_notified` with every
current SMART_REMINDERS ID except `r-p1-fedvip` set to true. This isolates the
boundary by suppressing competing rungs. Prepare while the app is closed and
launch a fresh page so the in-memory per-load flag is also reset. Record exact
fixture values before launch. Fixture writes are Dean's manual test setup, not
agent sends, and must never touch real member storage. If safe fixture setup is
unavailable, mark the isolated cases BLOCKED rather than infer a boundary failure.

- **B1: isolated +44 positive.** Expect the FEDVIP Backstop target once, with
  `ets-r-p1-fedvip` if its tag is inspectable. Record the actual title unchanged;
  this is an eligibility test, not verification of the title's policy wording.
- **B2: isolated +45 negative.** Expect no target and, with all other rungs
  suppressed by the fixture, no local rung notification. The target must remain
  absent from the delivered map. A leftover daily marker invalidates this test.
- **Unisolated control:** at +44, an undelivered CRITICAL `r-p1` outranks the HIGH
  FEDVIP target. A different notification is therefore not a boundary failure.
  At +45, the FEDVIP target must be absent, but another eligible rung may fire.
  Absence of this target and complete silence are different observations. Do not
  wait until tomorrow to retest +44: the member will then be at +45.

## C. Android comparison

Dean may repeat A and B in a separate Chrome test profile/origin, installing via
Chrome's install flow. Record platform-specific permission behavior. Android
results do not certify iOS behavior.

## D. Denial and later permission

Use a separate fresh isolated fixture with ETS 31 days in the future, target
undelivered, and no daily marker for today. Decline permission. Expect no local
notification and no delivered entry or daily marker written by this attempt.
Check in-app reminder visibility separately; dismissed/UI-filtered reminders
are not the same mechanism as local notification delivery.

Grant permission using the device's supported settings path; a second button
press need not re-prompt after denial. Observe permission-change evaluation and
then reopen if needed. Expect the target once, provided the date remains eligible
and no competing successful delivery consumed the day. Record timing and state.

## Resetting test fixtures only

Capture evidence first. Never delete real member data. Reset only the named
keys on the verified disposable test origin/profile, while the test app is
closed: authoritative ledger `tops_rung_ledger_v1`, legacy delivered map
`tops_rung_notified`, legacy daily marker `tops_rung_last_fired`, and the two ETS
keys as each case requires. New deliveries update the authoritative ledger; the
legacy keys remain migration inputs. Inspect `delivered`, `lastFired`, and
`pending` in the ledger. A pending record is an uncertain attempt, not confirmed
delivery, and deliberately blocks further local alerts without automatic expiry.
Never clear a real member pending record merely to force another notification.
Verify the resulting values rather than assuming an uninstall, reinstall, or
storage-clear action worked. Relaunch
fresh to reset the per-load flag. Do not change the device clock to bypass the cap.

## Pass criteria and report back

Report each case as PASS, FAIL, BLOCKED, or NOT RUN, with the starting fixture,
local date/time/timezone, device/OS, origin/build, launch surface, permission,
edit/permission/reopen timing, observed title/tag/channel evidence, and storage
before/after. Preserve screenshots before dismissing notifications.

A passes with one eligible target and no additional same-day sequential-open
fire. B1 passes only with isolated +44 target delivery; B2 passes with isolated
+45 exclusion. An unisolated competing alert is not a failed negative boundary.
D passes when denial preserves undelivered state and later eligible permission
allows delivery. A generic title match cannot close incident channel attribution.
No phone execution or production send is authorized to the agent by this document.
