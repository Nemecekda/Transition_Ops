---
name: resume-drafter-maintenance
description: Govern changes to the in-app Resume Drafter's prompts, fact ledger, quality scorecard, claim trace, formats, privacy controls, and cost controls. Owner - force-mod.
metadata:
  version: "0.3"
  status: PENDING
---

# RESUME DRAFTER MAINTENANCE

Purpose: keep civilian and federal resume drafts useful without turning a
member's source material or a job posting into invented qualifications. This
skill governs the Resume Drafter only. It does not authorize app changes,
deployment, or changes to account-level infrastructure.

Version 0.3 is PENDING until the RDM regression suite
executes against the app. Specification approval is not execution evidence.

## TRIGGERS AND GATE

Run this skill for any change to Resume Drafter prompts, models, fact-sheet or
trace schemas, score calculations, validators, input/output bounds, civilian or
federal formatting, privacy behavior, logging, storage, usage limits, budget
controls, or user-facing claims about those subjects.

All such changes are COMMANDER lane because they affect member-facing
employment claims, privacy representations, or spend. Obtain Dean's approval
before writing app code. Then use `validation-gate`; if app or deployment files
change, also use `deploy-discipline`. Never merge or push.

## BLOCKING INVARIANTS

Any violation below fails the draft regardless of its aggregate score:

1. Every factual resume claim traces to the member-confirmed fact ledger.
2. The job posting supplies targeting language only, never facts about the
   member. Unsupported qualifications, tools, credentials, scope, metrics, and
   outcomes are prohibited.
3. Identity fields are byte-exact: member-supplied job title, employer or unit,
   location, degree, school, certification, and license. Civilian translation
   belongs in descriptive content, not silent identity rewrites.
4. Every distinct employer/title/date combination remains a distinct role.
5. Calendar dates come only from explicit calendar dates. Tenure is not a date.
   Missing dates remain `MISSING` in the ledger and bracketed in a draft.
6. Every number and dollar figure is preserved exactly; no number, percentage,
   headcount, budget, duration, or scale may be inferred from military structure.
7. A missing quantified result lowers the score or becomes an improvement
   prompt. It never licenses invented scale.
8. Untraced claims, identity mutation, role merging, and invented facts cannot
   be offset by strengths in another score dimension.

## PROCEDURE

1. Bound the member input and job posting under the app's approved input limits.
2. Extract a closed fact ledger. Preserve exact source values and mark missing
   fields; do not draft, translate, infer, or improve during extraction.
3. Require member confirmation before drafting. The confirmed ledger controls
   the draft even when raw input or the posting would suggest something else.
4. Draft in the selected mode from the confirmed ledger. Use posting terms only
   where a confirmed fact establishes genuine equivalence; report unmet terms
   as gaps.
5. Build the claim trace and scorecard from the same confirmed ledger used for
   drafting. Run blocking invariants before computing or displaying a total.
6. If a blocker fires, withhold the draft and identify the failed invariant in
   member-safe language. Do not repair a failure by adding facts.
7. Verify privacy and cost controls on every initial, repair, scoring, and trace
   model call. Record actual evidence; absence of evidence is not PASS.

## SCORECARD

Score each dimension separately and attach evidence. Do not let a numeric total
hide a blocker.

- Grounding and claim trace: every factual clause has ledger support.
- Exact identity preservation: identity fields remain byte-exact.
- Role separation: distinct roles are not merged or omitted.
- Date completeness: explicit dates are retained and missing dates are visible.
- Quantified impact: supplied scale and outcomes are used exactly; missing
  quantification is identified without invention.
- Job-posting alignment: supported keywords are used; unsupported requirements
  are reported as gaps.
- Military-jargon translation: occupational meaning is made civilian-readable
  without changing official identities or adding scale.
- Filler: generic adjectives, empty ownership language, and banned filler are
  removed without deleting supported substance.
- Length and readability: civilian output is concise and federal output is
  detailed, while neither truncates identities or fabricates compression.
- Format compliance: civilian and federal requirements are evaluated against
  separate closed checklists.

Use `PASS`, `NEEDS MEMBER FACT`, or `FAIL` per dimension. `FAIL` is mandatory
for a blocking invariant. `NEEDS MEMBER FACT` is not permission to infer.

## CLAIM-TRACE CONTRACT

The trace is internal structured data. Each independently checkable factual
clause in the summary, skills, experience, education, certifications, and tip
must have one record:

```text
claim_id: stable identifier within this result
section: resume section
claim_text: exact output clause
fact_refs: one or more confirmed-ledger field identifiers
posting_refs: optional posting terms used only for alignment
transform: exact | reordered | civilian_translation | format_only
verdict: supported | unsupported | identity_mismatch | needs_member_fact
```

`supported` requires at least one `fact_ref`. A `posting_ref` cannot substitute
for one. `civilian_translation` may change terminology but not identity, scale,
qualification level, or outcome. Do not send the trace or ledger to analytics,
logs, or durable storage.

## FORMAT RULES

Civilian mode is one-page-oriented: concise summary, concrete skills, distinct
roles, short evidence-bearing bullets, exact credentials, and visible brackets
for missing essentials. No federal-only fields.

Federal mode may be longer and retain more military specificity. It uses
specialized-experience detail and bracketed USAJOBS fields. Never invent hours,
salary, supervisor details, series, grade, citizenship, or veterans' preference.

## PRIVACY AND COST

- The app remains no-user-data: no prompt, response, ledger, scorecard, trace,
  resume, job posting, or member identifier may be logged or persisted.
- Every OpenAI Responses API path, including repair, scoring, and trace calls,
  must set `store: false` explicitly.
- Analytics may record only approved content-free event names and counts; never
  include member text, trace data, target role, or posting terms.
- Preserve hard input bounds, output-token caps, retry limits, member-facing
  usage limits, and provider/account spending controls. A new model call must be
  included in the worst-case cost calculation before approval.
- **External monthly budget cap: UNVERIFIED.** Repository code and friendly
  limit copy do not prove an account-level cap. It remains UNVERIFIED until
  Dean supplies direct account evidence. Do not represent it as active or PASS.
- A missing or unverified cap blocks any claim that budget-cap equivalence has
  been proven. It does not authorize inspection or mutation of external account
  settings without Dean's approval.

## CONTENT-FREE FAILURE CONTRACT

Classify incomplete model responses and caught provider errors into exactly one
allowlisted reason: `output_limit`, `timeout`, `rate_limit`, `budget_limit`,
`upstream_unavailable`, `quality_gate`, or `incomplete_unknown`.

- Return only the reason category and approved member-safe wording. Never expose
  raw errors, provider messages, member content, request or response IDs, token
  details, prompts, facts, drafts, scorecards, or traces through an error path.
- Do not log or persist the raw failure, category, or member content. Preserve
  `store: false` on every model call.
- A deterministic grounding or audit rejection is `quality_gate`; do not
  misclassify it as provider failure.
- Unknown or unrecognized incomplete states are `incomplete_unknown`. Never
  infer a more specific category without evidence.
- Classification must not add retries, repair calls, or any other model call.
  Retry limits and output-token caps remain unchanged unless separately approved.
- Any proposed cap increase requires reproduced `output_limit` evidence, the
  exact old and new cap, percentage growth in maximum output exposure, verified
  model pricing, and a worst-case cost calculation before Commander approval.

Generation-stage and audit-stage `output_limit` failures are separate. A
generation-stage limit may address draft length. An audit-stage limit means the
draft was created but its structured quality review did not finish; member-safe
wording must say that the review needed more room and must not tell the member to
shorten confirmed facts.

The approved audit-only capacity is `AUDIT_MAX_OUTPUT_TOKENS = 4000`, increased
from 3000 by 1000 tokens or 33.33%. At verified Terra pricing of $12 per million
output tokens, maximum added exposure is $0.012 per audit and $0.036 per
three-draft browser day. Conservative ceilings are $0.08 per audit and $0.24 per
browser day. Civilian, federal, fact, and repair caps remain unchanged; retries
remain zero. The increase adds no call and may not compact or weaken the schema,
complete claim trace, ten score dimensions, or evidence. The external monthly
cap remains `UNVERIFIED`.

## REGRESSION CASES

- **RDM-1 Unsupported claim:** add an unprovided nonnumeric outcome. Must FAIL
  grounding and trace.
- **RDM-2 Unsupported number:** convert `Battalion` to `600-person organization`
  without supplied headcount. Must FAIL.
- **RDM-3 Exact identity:** punctuation and capitalization in employer, title,
  certification, and degree must survive byte-exact.
- **RDM-4 Role separation:** three titles at one unit must yield three entries.
- **RDM-5 Dates:** tenure must not become calendar dates; missing dates remain
  visible.
- **RDM-6 Quantified impact positive:** supplied `$2M`, `15 personnel`, and
  `95%` must be retained exactly and used appropriately.
- **RDM-7 Quantified impact negative:** source with no metric must produce no
  invented scale and must score `NEEDS MEMBER FACT` for quantification.
- **RDM-8 Keyword alignment positive:** a posting keyword supported by confirmed
  duties may be used and must trace to those duties.
- **RDM-9 Keyword invention:** a posting-only tool, credential, or qualification
  must be excluded and reported as a gap.
- **RDM-10 Jargon:** translate `PMCS` and `NCOIC` while preserving official
  identity fields and adding no scale.
- **RDM-11 Filler:** reject banned filler without deleting supported substance.
- **RDM-12 Civilian format:** require concise civilian structure and exclude
  federal-only fields.
- **RDM-13 Federal format:** require detailed specialized experience and
  bracketed USAJOBS fields; invent none of those fields.
- **RDM-14 Trace completeness:** every factual clause must have a fact reference;
  one deliberately untraced clause must FAIL.
- **RDM-15 Privacy:** every initial, repair, score, and trace path must use
  `store: false`, and member content must reach neither logs nor analytics.
- **RDM-16 Budget:** preserve input, output, retry, and usage limits. Require
  direct evidence for the external monthly cap; current expected verdict is
  `UNVERIFIED` until that evidence exists.
- **RDM-17 Readability and length:** long input must produce mode-appropriate
  output without truncating identities or inventing facts to compress it.
- **RDM-17A Complex generation:** a live-shaped long civilian input must either
  complete or return `output_limit`, never a generic failure.
- **RDM-17B Output limit:** a non-completed response with a confirmed
  max-output-token reason must return only `output_limit` and safe wording.
- **RDM-17C Unknown incomplete:** an unrecognized incomplete reason must return
  only `incomplete_unknown` and safe wording.
- **RDM-18 Timeout:** a timeout must return `timeout` and make no retry.
- **RDM-19 Provider limits:** rate limiting and billing or quota exhaustion must
  map separately to `rate_limit` and `budget_limit`.
- **RDM-20 Sanitization:** raw errors containing member text, provider messages,
  IDs, or token details must appear in neither the response nor logs.
- **RDM-21 Quality gate:** deterministic grounding and audit rejection must
  remain `quality_gate`, not a provider or incomplete category.
- **RDM-22 Privacy paths:** initial, repair, draft, audit, and every error path
  must retain `store: false` with no logging or persistence.
- **RDM-23 Cap discipline:** failure classification must leave output caps and
  retries unchanged. A future cap proposal must supply reproduced evidence,
  exact cap delta, percentage exposure, verified pricing, and worst-case cost.
- **RDM-24 Audit completion:** the complex structured audit must complete at
  4000 with all ten score dimensions and a complete claim trace.
- **RDM-25 Audit wording:** audit-stage `output_limit` must say the draft was
  created but its quality review needed more room; it must not tell the member
  to shorten confirmed facts.
- **RDM-26 Other limits:** civilian, federal, fact, and repair caps remain
  unchanged; retries remain zero and no call is added.
- **RDM-27 Exact exposure:** the audit cap must be exactly 4000, with maximum
  added exposure of $0.012 per audit and $0.036 per three-draft browser day.
- **RDM-28 Conservative ceilings:** audit and browser-day ceilings must be
  exactly $0.08 and $0.24; the external monthly cap remains `UNVERIFIED`.
- **RDM-29 No weakening:** no prompt or schema compaction may remove claims,
  trace fields, score dimensions, or evidence requirements.
- **RDM-X1 Validation seam:** run `validation-gate`; this skill's semantic PASS
  does not replace structural validation.
- **RDM-X2 Deployment seam:** run `deploy-discipline` for app changes and keep
  private-clone isolation; no production modification, merge, or push.
- **RDM-X3 Privacy-claim seam:** compare every user-facing privacy statement to
  observed code paths. Any unsupported `never stored` or `never logged` claim
  must FAIL even when generation quality passes.

## REGISTRATION

Keep registry item #6 PENDING at version 0.3 until all cases execute and evidence
is reviewed. After successful execution, force-mod proposes the smallest
evidence-supported revision and Commander rules on promotion to CODIFIED 1.0.
