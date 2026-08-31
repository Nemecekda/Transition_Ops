---
name: accessibility-release-validation
description: Validate Transition OPS user-facing changes against the project WCAG 2.2 AA release gate. Use for changes to pages, navigation, forms, dialogs, status or error behavior, responsive layout, motion, or accessibility tests; local automation alone cannot approve hosted release.
metadata:
  version: "1.0"
  status: CODIFIED
  owner: s3-devops
  validated: "2026-08-31"
---

# ACCESSIBILITY RELEASE VALIDATION

This skill owns the Transition OPS project release verdict for accessibility.
The baseline is WCAG 2.2 Level AA plus the stronger project target-size rule
below. An automated scan is evidence, not the verdict.

This skill authorizes testing and reporting only within the approved scope. It
does not authorize app copy or code, member data, a hosted preview, account or
provider action, staging, commit, push, merge, deployment, or production use.

## TRIGGERS

Run this gate for any change to rendered content, navigation, focus behavior,
keyboard interaction, controls, forms, validation, status or error messages,
dialogs, notification or push state, AI request/failure UI, responsive layout,
colors, typography, motion, orientation, icons, images, or accessibility test
infrastructure. A removed feature must also be tested for orphaned labels,
controls, focus stops, instructions, and status text.

## CLOSED VERDICTS

- `LOCAL AUTOMATION PASS`: the approved local automated smoke suite passed.
  Manual assistive-technology and hosted behavior remain untested.
- `MANUAL AT PASS`: every required manual browser/assistive-technology row
  passed on the recorded build.
- `HOSTED RELEASE PASS`: automation, manual rows, responsive/visual checks, and
  the approved hosted artifact all passed on the same release candidate.
- `BLOCKED`: any applicable WCAG 2.2 AA or project requirement failed, required
  evidence is missing, or tested artifacts/builds do not match.

Local synthetic Phase 1 work may report only `LOCAL AUTOMATION PASS`. It must
not claim manual AT acceptance, hosted acceptance, WCAG certification, legal
compliance, or release clearance.

## AUTOMATED SMOKE

The repository command prescribed by `validation-gate` must exercise the
rendered app with synthetic data and fail on at least:

- missing document language or title, invalid landmark/heading structure,
  duplicate IDs, invalid ARIA, unnamed controls, missing programmatic labels,
  and image alternatives that do not match purpose;
- controls that are not keyboard operable, hidden focusable content, dialog
  wiring errors, and status/error containers lacking an appropriate accessible
  announcement mechanism;
- obvious text/non-text contrast failures, focus-indicator failures, target-size
  regressions, viewport overflow, and content loss at required widths/zoom;
- motion that ignores `prefers-reduced-motion`, forced orientation, flashing,
  or unexpected autoplay; and
- orphaned email-signup or push controls, labels, help text, status, or focus
  targets after a feature is removed or held off.

The runner, browser build, viewport, fixture, checks, findings, exit status, and
artifact identity must be recorded. A static source scan cannot substitute for
executed rendered behavior.

## MANUAL KEYBOARD, FOCUS, NAMES, STATUS, AND ERRORS

Using keyboard only, traverse every critical flow and every changed surface.
All functions must be reachable and operable with expected keys; focus order
must follow meaning; focus must be visible and not obscured; no keyboard trap is
allowed. A dialog must place focus meaningfully, contain it while modal, close
with the documented keyboard action, and restore focus to the invoker. Skip and
landmark navigation must work where applicable.

Every control needs an accurate accessible name, role, value, state, and
instruction. Required fields, formats, errors, corrections, async progress,
success, budget denial, request-size denial, and provider unavailability must be
programmatically associated and announced without moving focus unexpectedly.
Color, position, icon shape, or placeholder text alone cannot carry meaning.

## REQUIRED ASSISTIVE-TECHNOLOGY MATRIX

Run each row manually against the same hosted release candidate and record OS,
browser, browser version, assistive technology/version, input method, flow,
announcements, focus result, errors, and disposition:

1. Safari with VoiceOver.
2. Chrome with NVDA.
3. Edge with JAWS.
4. Android Chrome with TalkBack.

Each row must cover initial page orientation, landmark and heading navigation,
primary navigation, one representative form, validation/error recovery, status
updates, dialog behavior if present, Navigator request/failure behavior, Resume
request/failure behavior, and the production push-off state. An unavailable row
is `PENDING`, never an inferred PASS.

## REFLOW, VISUAL, MOTION, AND ORIENTATION

- Test browser zoom at 200% and 400% and viewports at 320 and 375 CSS pixels.
  Preserve content, order, operation, labels, errors, and focus visibility with
  no clipping or two-dimensional scrolling for ordinary vertical content.
- Test portrait and landscape. Do not require one orientation unless an
  applicable WCAG exception is documented and approved.
- Honor reduced-motion preferences. Essential information and completion must
  remain available with nonessential animation removed.
- Normal text contrast must be at least 4.5:1; large text at least 3:1;
  meaningful non-text UI and focus indicators at least 3:1 against adjacent
  colors.
- Interactive targets must be at least 44 by 44 CSS pixels. A smaller target is
  allowed only under a documented WCAG exception with equivalent spacing and
  no loss of operability; convenience is not an exception.
- Test default, hover, focus, active, disabled, error, success, high-contrast or
  forced-colors where supported, and reduced-motion states.

## PASS AND EVIDENCE RULES

Every applicable WCAG 2.2 AA failure blocks. The project target-size rule also
blocks unless its specific exception is documented. Automated suppression
requires the exact rule, element, reason, human reviewer, and evidence; a broad
ignore or unexplained baseline is prohibited.

Evidence must identify the exact artifact or commit, date, tester, environment,
fixture, steps, expected result, actual result, screenshots or recordings when
useful, finding severity, correction, and rerun. Retest the complete affected
flow after a fix, not only the failed element. Use synthetic identities and
content; never place member data in evidence.

## SKILL SEAMS

- The general `accessibility-review` skill may help identify issues but cannot
  issue this project's release verdict.
- `validation-gate` owns the required repository command and structural
  evidence. Its automation PASS does not satisfy manual or hosted rows.
- `deploy-discipline` owns preview, artifact identity, handoff, rollback, and
  production. It cannot waive an accessibility failure.
- `privacy-truth-to-implementation`, `runtime-ai-spend-governance`, and
  `resume-drafter-maintenance` own the truth and behavior of privacy, budget,
  and Resume failure states. Accessible presentation does not validate their
  substance.

## REGRESSION CONTRACT

Execute [calibration-cases.md](calibration-cases.md) after any change. Passing
the synthetic calibration validates governance decisions only. Application
automation, manual AT, hosted release, and production remain separate evidence.
