# Mac/iPhone verification for the Resume feedback fix

Use the new immutable Netlify preview generated after publishing
`codex/resume-error-accessibility`. No new preview URL exists at the time this
script is written. The older f63 preview does not include this fix.

Record the preview URL, deploy ID, commit, date, tester, OS version, Safari
version, and VoiceOver version or OS-bundled version. Do not enter real member
records. A successful visual phone opening does not count as VoiceOver testing.

## First short test: empty Resume submission

1. On Mac, open the new preview in Safari. Turn on VoiceOver using Command-F5,
   or System Settings > Accessibility > VoiceOver. Apple documents the controls
   in [Turn VoiceOver on or off on Mac](https://support.apple.com/guide/voiceover/turn-voiceover-on-or-off-vo2682/mac).
2. Use keyboard/VoiceOver navigation to reach CAREER, then AI RESUME DRAFTER.
   Confirm the disclosure announces whether it is expanded.
3. Select CIVILIAN RESUME. Leave all fields empty. Activate BUILD MY FACT SHEET
   once. Expect the existing checking label and unavailable state, then the
   spoken error: Tell us what you actually did - at least a sentence or two.
   The app's existing punctuation remains unchanged.
4. Confirm focus remains on the button and the error can be reached/read again.
   Activate once more after completion: the same error should be announced
   again. This checks recovery without requesting an AI generation.
5. Repeat in FEDERAL (USAJOBS). Confirm no surprise page jump or lost focus.
6. Repeat while moving focus to another control during the request. Completion
   should announce the error without taking focus away from that control.

On iPhone, use Settings > Accessibility > VoiceOver. A tap selects an item and
a double tap activates it; use VoiceOver Practice if these gestures are new.
Apple's [iPhone VoiceOver guide](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios)
describes setup and practice. Repeat the same six steps in Safari, using
VoiceOver navigation. Record the words spoken and where focus lands.

## Complete Safari/VoiceOver row

The short test above clears only the changed Resume error flow. The full row
also needs the following on the same candidate:

- Initial page title/orientation, headings, landmarks, and primary navigation.
- Resume format, field names, input/editing, disclosure states, existing
  request progress, success, failure, and recovery announcements. A separately
  bounded synthetic generation/export run is needed for success; do not
  repeatedly generate just to explore the controls.
- Navigator input and SEND name/state, request progress, response, failure,
  and recovery. Do not induce a live quota exhaustion or provider outage;
  missing controlled hosted coverage stays PENDING.
- Privacy dialog opening focus, contained navigation, close action, and return
  to the invoking control. Use Escape on the Mac keyboard.
- Notifications remain OFF, with no enable prompt or live send.
- Portrait and landscape; readable labels/errors and reachable buttons at
  enlarged text/zoom. Record any clipping, two-dimensional scrolling, obscured
  focus, or unlabeled control.
- Export opening and all-page content/pagination, using only the approved
  synthetic fixture. Record which phone application opens the file.

## Result sheet

| Device / browser / AT | Flow | Expected | Actual speech and focus | Result |
| --- | --- | --- | --- | --- |
| Mac Safari / VoiceOver | Civilian empty submission | Spoken error; focus retained | Not run | PENDING |
| Mac Safari / VoiceOver | Federal empty submission | Spoken error; focus retained | Not run | PENDING |
| iPhone Safari / VoiceOver | Both formats; repeat and moved-focus cases | Same error; no focus theft | Not run | PENDING |
| Mac/iPhone Safari / VoiceOver | Remaining full-row flows above | Names, state, operation, status, recovery | Not run | PENDING |
| Chrome / NVDA | Full required matrix | Same candidate | No Windows tester available today | PENDING |
| Edge / JAWS | Full required matrix | Same candidate | No Windows tester available today | PENDING |
| Android Chrome / TalkBack | Full required matrix | Same candidate | No Android tester available today | PENDING |

Record a failure as a failure, with exact steps. Do not count an unrun row as
passed or substitute an emulated mobile viewport for TalkBack.
