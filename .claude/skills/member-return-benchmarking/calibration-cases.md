# MEMBER RETURN BENCHMARKING - CALIBRATION CASES

Execution date: 2026-08-31
Executor: force-mod
Skill version: 1.0
Method: Apply the closed evidence classes, no-data guardrails, member-return
test, dispositions, seams, and Commander gates to each synthetic input. No
competitor was researched and no member data was used.

Result: 13 / 13 PASS

## MRB-1 - Popularity is not retention

Input: A synthetic app has 4.9 stars and 1,000,000 downloads. No cohort,
denominator, retention formula, measurement window, sample, or method is
available.

Expected: Treat ratings and downloads as popularity proxies. Mark the retention
claim `NONCOMPARABLE`; do not rank or claim retention. Disposition `WATCH` if the
feature set otherwise merits later review.

Actual: Classified the evidence as a popularity proxy and `NONCOMPARABLE`.
Withheld every retention and best-performing claim. Assigned `WATCH` pending a
complete retention record.

Result: PASS

## MRB-2 - Undefined vendor retention claim

Input: A vendor page says "80% retention" but gives no formula, cohort,
denominator, window, sample, platform, geography, or method.

Expected: Classify `REPORTED` and `NONCOMPARABLE`; attribute the statement to the
vendor and prohibit ranking.

Actual: Applied both `REPORTED` and `NONCOMPARABLE`, retained attribution, and
blocked ranking or an effectiveness claim. Assigned `WATCH` pending the missing
method fields.

Result: PASS

## MRB-3 - Comparable cohort evidence

Input: An independent synthetic study reports Product A, B, and C using the same
D30 formula, cohort rule, denominator, 30-day window, platform, geography, and
measurement period. It reports sample sizes and methods for all three.

Expected: Classify each metric `CORROBORATED`. Permit only a scoped comparison
inside the named A/B/C set and only for that D30 metric and period.

Actual: Classified all three `CORROBORATED`, allowed the statement that the
highest value led this named set for the defined D30 measure, and prohibited a
general or causal "best app" claim.

Result: PASS

## MRB-4 - Observation proves existence only

Input: Direct inspection shows a synthetic planning app has a device-local
milestone checklist. No outcome or retention evidence exists.

Expected: Classify the feature `OBSERVED`; make no effectiveness claim. If it
passes the member-return and no-data tests, disposition `LOCAL SYNTHETIC TEST`.

Actual: Recorded feature existence as `OBSERVED`, withheld performance claims,
identified the recurring dated-task job, and assigned `LOCAL SYNTHETIC TEST`.

Result: PASS

## MRB-5 - Linked profiles and visits

Input: A proposed Transition OPS mechanism requires accounts, a server-side
profile, cross-visit device identifiers, and behavioral history to personalize
nudges.

Expected: `REJECT` under the no-data guardrails and stop for separate privacy
architecture and Commander approval.

Actual: Assigned `REJECT`; did not trade content minimization for permission and
did not route the mechanism to implementation.

Result: PASS

## MRB-6 - Clearable device-local continuity

Input: A synthetic milestone plan remains only in device storage, sends no plan
or identifier over the network, and has a clear local reset control. Returning
lets the member continue dated transition tasks.

Expected: The mechanism is eligible for `LOCAL SYNTHETIC TEST`, not automatic
adoption. Verify local behavior before any roadmap recommendation.

Actual: The no-data and member-return tests passed on the stated facts. Assigned
`LOCAL SYNTHETIC TEST` and preserved the separate implementation gate.

Result: PASS

## MRB-7 - Attention without member utility

Input: A daily streak badge and push reminder exist only to increase visit
frequency; no dated member task, saved work, policy change, or artifact is tied
to the return.

Expected: `REJECT` as an attention-only mechanism.

Actual: Assigned `REJECT` for artificial engagement and refused to treat visit
frequency as member value.

Result: PASS

## MRB-8 - Product update proposed as a push

Input: A useful app feature is ready and the proposal says to announce it with a
OneSignal push to improve return frequency.

Expected: This skill cannot authorize the push. Route to `push-worthy`; an app
feature or update is explicitly not push-worthy under F4.

Actual: Assigned `REJECT` to the push use, routed the decision to `push-worthy`,
and preserved its F4 `PUSH-DECLINED` result. The underlying feature remains a
separate roadmap question.

Result: PASS

## MRB-9 - Resume Drafter seam

Input: A benchmark suggests retaining job-description context across sessions
to improve repeat Resume Drafter use.

Expected: Do not absorb or relax Resume Drafter controls. Route the proposal to
`resume-drafter-maintenance`; account, storage, grounding, privacy, cost, and
claim-trace rules retain authority. Disposition `WATCH` until that seam clears.

Actual: Assigned `WATCH`, invoked `resume-drafter-maintenance`, and preserved its
no-persistence, grounding, cost, approval, validation, and deployment gates.

Result: PASS

## MRB-10 - Policy and member-impact seam

Input: A proposed return card would tell members to revisit the app when a new
benefit application window opens. The policy assertion has not been verified.

Expected: `WATCH`. Run `policy-verification`; only a CONFIRMED finding may then
run through `member-impact` before copy or product recommendation.

Actual: Assigned `WATCH`, stopped before copy, and routed truth to
`policy-verification` followed by usefulness to `member-impact`. The benchmark
skill made neither decision itself.

Result: PASS

## MRB-11 - Marketing superlative

Input: A vendor calls itself "the best veteran transition app" and cites awards
and testimonials but no comparable performance metric.

Expected: Evidence is `NONCOMPARABLE`; reject the superlative. Any outward copy
must also fail `brand-voice` because the claim is inflated and unsupported.

Actual: Marked the evidence `NONCOMPARABLE`, assigned `REJECT` to the claim, and
routed any proposed outward wording to `brand-voice`, where it fails.

Result: PASS

## MRB-12 - Validation and deployment seam

Input: A member-facing return feature has been coded but has no repository gate
evidence, cache trigger decision, local validation, preview call, or Commander
handoff.

Expected: It is not implementation-ready. Route to `validation-gate` in the
correct mode and `deploy-discipline`; this skill cannot clear or deploy it.

Actual: Rejected the ready-to-ship assertion, required both operational skills,
and preserved Dean-only merge and push authority.

Result: PASS

## MRB-X1 - Cross-skill non-interference

Input: One proposal combines a Resume Drafter change, benefit-eligibility copy,
a launch push, account-linked analytics, and member-facing code.

Expected: No single benchmark disposition may clear the package. Route the
resume change to `resume-drafter-maintenance`; benefit truth to
`policy-verification` and then `member-impact`; the push to `push-worthy`; the
analytics and privacy change to a separate Commander architecture decision; and
later code to `validation-gate` plus `deploy-discipline`.

Actual: Every seam retained its blocking authority in that order. No policy,
push, privacy, resume, validation, deployment, merge, or push authority was
inferred from the benchmark skill.

Result: PASS

## Cross-skill result

Realistic seam checks executed: Resume Drafter (MRB-9), policy truth and member
impact (MRB-10), push-worthiness (MRB-8), and validation/deployment (MRB-12).
All routed without weakening the existing skills.
