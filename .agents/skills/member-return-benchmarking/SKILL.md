---
name: member-return-benchmarking
description: Benchmark veteran-transition and adjacent planning products, evaluate performance and retention evidence, and recommend privacy-compatible mechanisms that give Transition OPS members a real reason to return. Does not authorize competitor claims, data collection, implementation, or deployment.
metadata:
  version: "1.0"
  status: CODIFIED
  owner: force-mod
  validated: "2026-08-31"
---

# MEMBER RETURN BENCHMARKING

Use this skill when asked to compare Transition OPS with veteran-transition or
adjacent planning products, identify high-retention mechanisms, make a
performance comparison, define return or engagement measures, or recommend a
feature because another product appears successful.

The objective is recurring member utility, not attention for its own sake. This
skill produces evidence-bounded roadmap recommendations. It authorizes no
external account, public claim, code, data collection, integration, spend,
deployment, push, merge, or upload of member material.

## OWNERSHIP AND SCOPE FENCES

`force-mod` owns the comparison method and disposition. `s2-vetting` may collect
legitimacy and product evidence for commercial services; its vetting result does
not establish product performance.

This skill does not replace or amend:

- `policy-verification`, which establishes benefits and policy truth.
- `member-impact`, which assesses confirmed findings about the world, not our
  own product.
- `brand-voice`, which governs outward-facing language.
- `push-worthy`, which alone decides whether a user push is justified. App
  features, updates, and redesigns remain explicitly not push-worthy.
- `resume-drafter-maintenance`, which governs every Resume Drafter change,
  including its grounding, privacy, quality, and cost controls.
- `validation-gate` or `deploy-discipline`, which govern implementation and
  handoff. A benchmark disposition is never validation or deploy clearance.

General truth-to-implementation review for privacy statements and other claims
about Transition OPS remains a separate, currently unowned subject. Do not
absorb it here. A proposal that needs a changed privacy claim stops at the
Commander gate.

## EVIDENCE RECORD

For each product and claim record: product and version or observed date,
audience, source URL or artifact, access date, exact claim, evidence class, and
known limitation. Marketing pages may establish what a vendor says; they do not
establish that the product causes an outcome.

Apply these evidence classes literally:

- `OBSERVED`: current behavior was directly inspected. Proves feature existence
  only, not effectiveness or retention.
- `REPORTED`: the product owner reports a metric. Attribute it as self-reported.
- `CORROBORATED`: an independent source reports the metric and discloses enough
  method to evaluate it.
- `NONCOMPARABLE`: cohort, denominator, formula, window, sample, platform,
  geography, or method is missing or materially different. It blocks ranking.

The labels are not mutually exclusive: a self-reported metric can also be
`NONCOMPARABLE`.

### Performance and retention claims

A retention or performance record is complete only when it states:

1. Metric name and formula.
2. Cohort and denominator.
3. Measurement window.
4. Sample size.
5. Platform and geography.
6. Product version or measurement date.
7. Measurement method and source independence.

Missing any material field makes the metric `NONCOMPARABLE`. App-store ratings,
download counts, traffic estimates, search rank, awards, testimonials, and
press coverage are popularity or discovery proxies only. They never prove
retention, task completion, member outcomes, or causal impact.

"Best-performing," "highest-retention," and equivalent superlatives are
prohibited unless a named comparison set is complete and every ranked product
has `CORROBORATED`, directly comparable evidence using the same material metric
definition, cohort basis, and window. Otherwise report observed patterns and
limitations without ranking.

Under the current no-user-data posture, Transition OPS retention is
`UNMEASURED`. Do not introduce linked-visit measurement or claim that retention
improved in order to prove a recommendation.

## NO-DATA AND MEMBER-ATTENTION GUARDRAILS

- Use synthetic profiles when inspecting another product. Never upload member
  resumes, plans, prompts, contact details, identifiers, or transition history.
- A paid trial, new account with non-synthetic data, or unseen infrastructure
  requires Commander approval before access.
- Do not recommend Transition OPS accounts, member identifiers, server-side
  profiles, behavioral histories, fingerprinting, session replay, advertising
  IDs, push tags, cross-visit identifiers, or third-party behavioral analytics.
- Do not use production A/B testing or any retention measurement that links a
  person or device across visits.
- Device-local continuity is eligible only when the data never leaves the
  device and the member can clear it.
- No ads, data sale, commercial lead generation, or hidden monetization.
- Reject streaks, artificial urgency, nagging notifications, variable rewards,
  and similar mechanisms when their purpose is return frequency rather than a
  member task.
- A proposal needing new telemetry, storage, collection, an integration, or a
  changed privacy statement stops for separate architecture and Commander
  approval. Do not reason around the stop with content minimization.

## MEMBER-RETURN TEST

A mechanism is eligible only when it supports a recurring transition job such
as completing a dated task, updating a local plan, revisiting a verified policy
change, improving a member-owned artifact, or recovering saved local progress.
State the member job, why it recurs, the benefit of returning, and what happens
if the member does not return. "Engagement" alone is not a member benefit.

Extract the mechanism, not another product's protected copy, visual design, or
identity. Record every data dependency and reject any mechanism that cannot
operate inside the no-data guardrails.

## DISPOSITIONS - CLOSED SET

- `ADOPT`: evidence supports the mechanism, the member-return test passes, and
  no privacy or ownership gate is open. This recommends roadmap consideration;
  it does not authorize implementation.
- `LOCAL SYNTHETIC TEST`: plausible and privacy-compatible, but local behavior
  or member utility still needs proof using synthetic scenarios.
- `WATCH`: evidence is incomplete or noncomparable, or a required seam has not
  cleared. State the exact evidence or decision that would reopen it.
- `REJECT`: unsupported claim, no recurring member job, manipulative attention
  mechanism, privacy conflict, prohibited monetization, or unresolvable seam.

Silence is not a disposition. Do not upgrade `WATCH` because a product is
popular or downgrade `REJECT` because a feature is common.

## PROCEDURE

1. Define the member job and the reason a return would help.
2. Name the comparison set and inclusion logic without ranking in advance.
3. Route commercial or veteran-serving products through `s2-vetting` when
   legitimacy or member referral is in scope.
4. Build the evidence record and classify each feature and metric.
5. Apply the comparability gate before any ranking or superlative.
6. Extract each candidate mechanism and run the member-return and no-data tests.
7. Assign one closed disposition and list every required skill seam.
8. Present the evidence, counter-case, and exact Commander decision needed.
9. Stop. Implementation is a separate Commander-approved task.

If a recommendation includes benefits or policy content, run
`policy-verification` and then `member-impact` before copy. If it touches the
Resume Drafter, run `resume-drafter-maintenance`. Any outward claim runs through
`brand-voice`. Any approved code later runs through `validation-gate` and
`deploy-discipline`; Dean alone merges and pushes.

## COMMANDER GATES

Stop for Dean's explicit approval before:

- Purchasing access, creating a paid account, or assuming infrastructure not
  visible in the repository.
- Adding an integration, account system, analytics, storage, telemetry, data
  collection, or changed privacy representation.
- Publishing a comparative, performance, retention, or Transition OPS
  capability claim.
- Designing or implementing a member-facing feature.
- Changing spend, model/API usage, the deployment pipeline, or push behavior.
- Merging or pushing. This skill never grants either authority.

## OUTPUT

Return a concise packet:

1. Named comparison set and member job.
2. Evidence matrix with classes and limitations.
3. Mechanism-to-member-value map with data dependencies.
4. Privacy/no-data verdict.
5. One closed disposition per mechanism.
6. Required skill seams and open Commander decisions.

## REGRESSION CONTRACT

Detailed inputs, expected decisions, executed actual decisions, and results are
in [calibration-cases.md](calibration-cases.md).

- MRB-1: ratings and downloads do not prove retention.
- MRB-2: an undefined vendor retention claim is reported and noncomparable.
- MRB-3: method-disclosed comparable cohort evidence permits only a scoped
  comparison.
- MRB-4: direct feature observation proves existence, not outcome.
- MRB-5: linked profiles or visits trigger privacy rejection.
- MRB-6: clearable device-local continuity may enter local synthetic testing.
- MRB-7: attention-only streaks or pushes are rejected.
- MRB-8: an app update cannot become push-worthy through this skill.
- MRB-9: Resume Drafter work routes through its maintenance skill unchanged.
- MRB-10: benefits and policy work routes through truth, then member impact.
- MRB-11: marketing superlatives fail evidence and brand voice.
- MRB-12: implementation without validation and deploy evidence is not ready.
- MRB-X1: all named seams retain their scope and blocking authority.
