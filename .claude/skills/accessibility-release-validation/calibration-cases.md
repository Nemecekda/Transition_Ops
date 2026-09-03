# ACCESSIBILITY RELEASE VALIDATION - CALIBRATION CASES

Execution date: 2026-08-31
Executor: force-mod
Skill version: 1.0
Method: Apply the WCAG 2.2 AA project gate, closed verdicts, required manual
matrix, responsive/visual requirements, and skill seams to synthetic evidence
packets. No application, member data, hosted preview, assistive-technology run,
provider, network, or production system was used.

Result: 12 / 12 PASS

## ARV-1 - Automation is not release acceptance

Input: The local rendered smoke suite reports zero findings. No manual browser,
assistive-technology, or hosted evidence is supplied.

Expected: `LOCAL AUTOMATION PASS`; manual and hosted verdicts remain pending.

Actual: Returned only `LOCAL AUTOMATION PASS` and withheld release clearance.

Result: PASS

## ARV-2 - Keyboard and dialog focus

Input: A synthetic dialog opens from a button, but focus remains behind the
dialog and Escape does not close it.

Expected: `BLOCKED` despite an automated scan passing.

Actual: Blocked for modal focus management and keyboard operation.

Result: PASS

## ARV-3 - Names, status, and errors

Input: A form uses placeholders as labels and shows a budget error visually
without programmatic association or announcement.

Expected: `BLOCKED`; require a persistent accessible name and announced,
associated status/error behavior.

Actual: Both defects blocked; color and placeholder text were not accepted.

Result: PASS

## ARV-4 - Safari and VoiceOver row missing

Input: Chrome automation and keyboard checks pass; Safari/VoiceOver was not run.

Expected: The row is `PENDING`; no `MANUAL AT PASS` or `HOSTED RELEASE PASS`.

Actual: Kept the manual and hosted verdicts pending.

Result: PASS

## ARV-5 - Chrome and NVDA defect

Input: NVDA announces three icon buttons only as "button."

Expected: `BLOCKED` for inaccurate/missing accessible names.

Actual: Blocked the affected flow and required a full-flow rerun after repair.

Result: PASS

## ARV-6 - Edge and JAWS defect

Input: JAWS does not announce async Resume failure status, although visual text
appears.

Expected: `BLOCKED`; successful visual rendering is insufficient.

Actual: Blocked status communication and preserved Resume failure semantics as
an independent seam.

Result: PASS

## ARV-7 - Android and TalkBack defect

Input: TalkBack reaches a custom control but cannot activate it and its state is
not announced.

Expected: `BLOCKED` for operation, role/value/state, and mobile AT behavior.

Actual: Blocked the control; desktop results did not substitute.

Result: PASS

## ARV-8 - Zoom and narrow widths

Input: At 400% zoom and 320 CSS pixels, the submit control and error text clip;
375 pixels and 200% zoom pass.

Expected: `BLOCKED`; one passing viewport or zoom level cannot clear another.

Actual: Blocked on the failed required combinations.

Result: PASS

## ARV-9 - Reduced motion and orientation

Input: Reduced-motion mode still animates a nonessential panel, and landscape
is prevented without an applicable exception.

Expected: `BLOCKED` for both project requirements.

Actual: Blocked; convenience was not accepted as an orientation exception.

Result: PASS

## ARV-10 - Contrast states

Input: Default text passes, but focus and disabled/error state boundaries are
below the required non-text contrast.

Expected: `BLOCKED`; default-state contrast does not clear interaction states.

Actual: Blocked the deficient focus and state presentation.

Result: PASS

## ARV-11 - Target size

Input: A 28 by 28 CSS-pixel icon button has no documented WCAG exception or
equivalent spacing.

Expected: `BLOCKED` under the 44 by 44 project rule.

Actual: Blocked; the WCAG minimum was not used to erase the stronger project
standard.

Result: PASS

## ARV-12 - Cross-skill and hosted boundary

Input: Accessibility automation passes for content-free budget and privacy
messages on a local fixture. Runtime spend, privacy evidence, production config,
and hosted behavior are not validated.

Expected: Report accessible local presentation only. Preserve independent
runtime, privacy, validation, deployment, manual AT, and hosted gates.

Actual: No substantive or release authority was inferred from the local result.

Result: PASS

## CROSS-SKILL RESULT

ARV-3, ARV-6, and ARV-12 exercised `runtime-ai-spend-governance`,
`resume-drafter-maintenance`, and `privacy-truth-to-implementation`; ARV-1 and
ARV-12 preserved `validation-gate` and `deploy-discipline`. Every seam retained
independent blocking authority.
