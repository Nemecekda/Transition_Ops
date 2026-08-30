---
name: resume-drafter-maintenance
description: Govern changes to the in-app Resume Drafter's prompts, fact ledger, quality scorecard, claim trace, formats, privacy controls, and cost controls. Owner - force-mod.
metadata:
  version: "0.9"
  status: PENDING
---

# RESUME DRAFTER MAINTENANCE

Purpose: keep civilian and federal resume drafts useful without turning a
member's source material or a job posting into invented qualifications. This
skill governs the Resume Drafter only. It does not authorize app changes,
deployment, or changes to account-level infrastructure.

Version 0.9 is PENDING until the RDM regression suite
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
   Missing dates remain `MISSING` only in the internal/member-reviewed ledger.
   Civilian output omits an unknown date segment; federal output may bracket it.
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
- Date completeness: explicit dates are retained; missing civilian dates are
  recorded as `NEEDS MEMBER FACT` gaps without rendering unsupported content.
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

The model may omit `claim_text` only when the server first creates a closed,
request-local inventory of every exact traceable draft clause, identified
`C1` through `Cn`. The server must require exact set equality between that
inventory and the returned trace: exactly one record per ID, with no unknown,
duplicate, or omitted ID. Any mismatch is a blocking `missing_trace` failure.
Only after that check passes may the server reattach the byte-exact `claim_text`
for each ID before the UI response. IDs are request-local, carry no member
identifier, and may not enter logs, persistence, or analytics. This optimization
may not remove trace fields, any of the ten score dimensions, or evidence.
An empty clause inventory must fail closed before the audit call: return a safe
`quality_gate` response with blocking `missing_trace`, make zero audit calls,
and never construct a structured-output `claim_id` enum with an empty list.

Before drafting or auditing, build a request-local canonical fact catalog from
the confirmed ledger. Give every role-scoped and global fact a closed ID. Role
claims may cite only facts owned by that role. A global unlinked number cannot
support a role bullet or an ambiguous summary claim. Audit `fact_refs` must be
drawn from the closed catalog; unknown IDs and cross-role references fail closed
as `missing_trace` or `unsupported_claim`. Catalog IDs carry no member identifier
and may not enter logs, persistence, or analytics.

## SCOPED GENERATION CONTRACT

Build the canonical fact catalog before draft generation, then derive a separate
draft-eligible view. Send the generator only that view, never the raw confirmed
ledger. The eligible view contains exact role identities, confirmed optional
role fields, role-owned duties/outcomes/numbers, exact education and credentials,
confirmed skills, and the explicit target. Exclude `MISSING` fields, the raw
`NUMBERS AND SCALE` line, and every global unlinked number.

The generator may use only draft-eligible scoped numbers and must preserve each
used value exactly. It must not be instructed to use every number in the ledger.
Role-owned numbers remain attached to their owner. Global unlinked numbers are
unavailable to generation and cannot support a role bullet or ambiguous summary.
The full closed catalog remains available only to the audit under its existing
fact-reference restrictions.

For global Summary and Core Skills claims, apply role attribution restrictions
only when a quantified value is shared between the claim and a referenced
role-owned fact. Do not treat an incidental number elsewhere in the supporting
fact line as proof that a nonnumeric global claim is numeric. A nonnumeric global
claim may cite a mixed duty/metric role fact when the audit supports that claim.
An explicit numeric global claim must name the exact owning role title or
employer before it may cite that role's fact. Unlinked numbers, unknown fact
references, cross-role experience references, wrong-role numeric collisions,
and unsupported audit verdicts remain fail-closed.

One-page length is a formatting target; complete role inventory is a blocking
safety requirement. Reduce bullets before omitting, merging, or rewriting a
role. Deterministic filler checks apply only to generated summary and
duty/accomplishment prose, never byte-exact title, employer/unit, degree, school,
certification, or license fields.

Pre-audit deterministic failures remain fail-closed but use distinct,
content-free categories: `civilian_format`, `filler_language`,
`unsupported_number`, `role_structure`, and `unlinked_global_number`. Return
approved actionable wording only. Never return member text, the rejected draft,
fact values, IDs, provider details, or raw internal issue labels.

## FORMAT RULES

Civilian mode is candidate-ready and one-page-oriented: concise summary,
concrete skills, distinct roles, short evidence-bearing bullets, and exact
credentials. Unknown name/contact/header fields, role location/date segments,
and education years are omitted. `MISSING` remains explicit only in the
internal/member-reviewed ledger. Missing optional civilian fields are `NEEDS
MEMBER FACT` audit gaps, not blockers when the draft makes no unsupported claim.
Civilian output contains no brackets, literal `MISSING`, `TIP:`, or federal-only
fields. Improvement guidance belongs in the response's gaps, outside the resume.

Federal mode may be longer and retain more military specificity. It uses
specialized-experience detail and bracketed USAJOBS fields. Never invent hours,
salary, supervisor details, series, grade, citizenship, or veterans' preference.
Federal bracket behavior is unchanged.

Job title, employer or unit, degree, school, certification, and license are
byte-exact identities. Civilian translation is allowed only in summaries and
duty/accomplishment language, never in an identity field. Runtime prompts must
not contain unrelated numeric exemplars: no example headcounts, budgets,
percentages, states, locations, or outcomes may become candidate facts.

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

Repeated generation-stage `output_limit` evidence at 1600 authorizes the
civilian hard ceiling of 2200: +600 tokens or 37.50% over 1600, with maximum
added exposure of $0.0072 per draft and $0.0216 per three-draft browser day at
verified Terra pricing of $12 per million output tokens. From the original 1300
cap, the increase is +900 tokens or 69.23%, with maximum added exposure of
$0.0108 per draft and $0.0324 per three-draft browser day. Federal stays 1900
and audit stays 4000. Fact and repair behavior and caps, zero retries, call
count, `store: false`, no logging or persistence, and the `UNVERIFIED` external
monthly cap are unchanged. A further civilian increase above 2200 requires a
new architecture review; another cap ratchet is not authorized.

## FACT-STAGE CONTRACT

Stage caps are distinct and must not be inferred from the selected resume mode:
initial Luna fact extraction is 3500, Terra structural repair is 3500, civilian
draft generation is 2200, federal draft generation is 1900, and structured
audit is 4000. The fact extraction and repair cap is mode-independent and is a
hard stop; any increase above 3500 requires a new architecture review.

Fact extraction and repair may receive the bounded experience source, role,
years, explicit target, skills, and certifications. Exclude the full job posting
from both fact-stage inputs. The explicit target stays, but posting content is
never evidence about the member and may not create a ledger fact.

A fact-stage `output_limit` must return stage-specific member-safe wording and
withhold the partial fact sheet. Never let a member confirm or draft from a
truncated ledger, describe the failure as a draft failure, or tell the member to
shorten confirmed facts. The initial extraction and existing conditional repair
remain the only fact-stage calls; add no retry or call.

At verified output prices of $1.20 per million Luna tokens and $12 per million
Terra tokens, maximum output exposure is $0.00420 for initial extraction,
$0.04200 for repair, and $0.04620 worst case when repair occurs. Added worst-case
exposure over the prior 1300 cap is $0.02904. The local three-draft limit counts
completed drafts only and is not a fact-request cap; do not represent it as
fact-stage abuse protection or a daily fact-stage ceiling. External monthly cap
remains `UNVERIFIED`. Preserve `store: false`, no logging or persistence, and
all existing hard input bounds.

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
- **RDM-30 Civilian cap:** reproduced generation-stage `output_limit` evidence
  must support a civilian draft cap of exactly 1600, increased by 300 or 23.08%.
- **RDM-31 Civilian exposure:** maximum added exposure must be $0.0036 per draft
  and $0.0108 per three-draft browser day at $12 per million output tokens.
- **RDM-32 Unchanged controls:** federal must remain 1900, audit 4000, and fact
  and repair behavior and caps unchanged; retries remain zero, no call is added,
  every model call retains `store: false`, no logging or persistence is added,
  and the external monthly cap remains `UNVERIFIED`.
- **RDM-33 Civilian completion:** the reproduced complex case must complete at
  the civilian hard ceiling of exactly 2200.
- **RDM-34 Closed inventory:** the auditor must return exactly one record for
  every request-local `C1` through `Cn`, no more and no fewer.
- **RDM-35 ID mismatch:** missing, duplicate, and unknown IDs must each cause a
  blocking `missing_trace` failure.
- **RDM-36 Exact reattachment:** server-reattached `claim_text` must be
  byte-exact, including duplicate textual clauses assigned different IDs.
- **RDM-37 UI trace:** the returned UI trace must retain every current field and
  exact claim text.
- **RDM-38 Scorecard:** all ten score dimensions and their evidence must remain
  complete.
- **RDM-39 Audit capacity:** the complex structured audit must complete within
  the unchanged 4000 cap after model-output claim text is omitted.
- **RDM-40 Unchanged controls:** federal remains 1900, audit remains 4000, and
  fact/repair caps, call count, zero retries, `store: false`, and no logging or
  persistence remain unchanged.
- **RDM-41 Request-local IDs:** clause IDs must carry no member identifier and
  appear in neither logs, persistence, nor analytics.
- **RDM-42 Hard stop:** any civilian cap increase above 2200 must fail governance
  without a new architecture review.
- **RDM-43 Empty inventory:** an empty clause inventory must return safe
  `quality_gate` with blocking `missing_trace`, make zero audit calls, and never
  construct `claim_id` with `enum: []`.
- **RDM-44 Fact completion:** the reproduced complex source must produce a
  complete fact sheet at the hard cap of 3500.
- **RDM-45 Initial cap:** the initial Luna fact cap must be exactly 3500 in both
  civilian and federal modes.
- **RDM-46 Repair cap:** the Terra structural repair cap must be exactly 3500 and
  return the complete corrected fact sheet.
- **RDM-47 Fact input:** the full posting must be absent from extraction and
  repair input while the explicit target remains.
- **RDM-48 Posting isolation:** a posting-only employer, credential, tool, date,
  number, or outcome must never enter the fact ledger.
- **RDM-49 Fact failure:** fact-stage `output_limit` wording must be safe and
  stage-specific, and a partial fact sheet must never be released.
- **RDM-50 Other stages:** civilian remains 2200, federal 1900, audit 4000, and
  call count, zero retries, `store: false`, and no logging or persistence remain
  unchanged.
- **RDM-51 Fact costs:** evidence must show $0.00420 initial Luna maximum,
  $0.04200 Terra repair maximum, $0.04620 repaired worst case, and $0.02904
  added worst case over 1300.
- **RDM-52 Usage truth:** the local three-draft limit must not be represented as
  a fact-request cap; the external monthly cap remains `UNVERIFIED`.
- **RDM-53 Fact hard stop:** any fact extraction or repair cap above 3500 must
  fail governance without a new architecture review.
- **RDM-54 Civilian header:** missing civilian name, email, phone, or location
  must produce no header placeholder, brackets, or literal `MISSING`.
- **RDM-55 Optional role fields:** missing civilian role location and dates must
  be omitted; when no claim is made, audit must return `NEEDS MEMBER FACT`, not
  `FAIL`.
- **RDM-56 Education year:** education without a year must render the byte-exact
  degree and school while omitting the year and any placeholder.
- **RDM-57 Federal behavior:** federal required-field brackets must remain
  unchanged.
- **RDM-58 Exact identities:** every title, employer or unit, degree, school,
  certification, and license must remain byte-exact.
- **RDM-59 Civilian guidance:** civilian output must contain no `TIP:`;
  improvement advice must appear only in response gaps.
- **RDM-60 Prompt isolation:** runtime prompts must contain no unrelated numeric
  exemplar capable of becoming a candidate claim.
- **RDM-61 Global numbers:** global `1,200 employees` and `18 states` without
  role linkage must appear in neither a role bullet nor an ambiguous summary.
- **RDM-62 Role numbers:** a role-linked number may support only that role.
- **RDM-63 Closed fact refs:** audit `fact_refs` must be closed request-local
  catalog IDs; unknown or cross-role references must fail closed.
- **RDM-64 Live-shape reproduction:** a synthetic, structurally equivalent
  six-role reproduction of the supplied live ledger must produce a releasable
  civilian draft with exact synthetic identities, unknown optional fields
  omitted, and no unsupported `1,200 employees` or `18 states` claim. Never
  persist the member's verbatim ledger or depend on an attachment path.
- **RDM-65 Civilian contamination:** civilian brackets, literal `MISSING`, or
  embedded `TIP:` must cause withholding.
- **RDM-66 UI guidance:** civilian UI must not instruct members to fill brackets;
  federal guidance remains mode-specific.
- **RDM-67 Unchanged controls:** facts/repair remain 3500, civilian 2200,
  federal 1900, audit 4000, with unchanged call count, zero retries, draft limit,
  posting isolation, `store: false`, and no logging or persistence.
- **RDM-68 Cost and external cap:** the architecture adds no API call or cap, so
  maximum incremental API exposure is $0; external monthly cap remains
  `UNVERIFIED`.
- **RDM-69 Scoped input:** the draft request must contain the draft-eligible fact
  view and must not contain the raw confirmed ledger.
- **RDM-70 Unlinked exclusion:** synthetic unlinked tenure, recruiter-count,
  employee-count, and state-count facts must be absent from generator input.
- **RDM-71 Role ownership:** synthetic role-linked plant, hiring-volume,
  headcount, budget, personnel, and location-count facts must remain attached
  only to their owning roles.
- **RDM-72 Number instruction:** the prompt must authorize only draft-eligible
  scoped numbers and must not instruct the model to use every ledger number.
- **RDM-73 Six-role pressure:** a synthetic six-role live-shape fixture must
  preserve six exact title/employer identity lines within the civilian 2200 cap.
- **RDM-74 Failure categories:** civilian-format, filler, unsupported-number,
  role-structure, and unlinked-global failures must return distinct content-free
  categories with no member text, fact values, IDs, or raw internal labels.
- **RDM-75 Filler scope:** banned filler in summary or duty prose must fail; the
  same token inside an exact identity or credential must not.
- **RDM-76 Date punctuation:** confirmed synthetic en-dash date ranges must
  survive without false rejection.
- **RDM-77 Number punctuation:** supported number values must remain valid across
  harmless range punctuation while invented values fail.
- **RDM-78 Unlinked variants:** exact, paraphrased, and numerically colliding
  unlinked-global claims must never be released; deterministic checks or audit
  must withhold them.
- **RDM-79 Role completeness:** one-page pressure may reduce bullets but must not
  merge, omit, or rewrite any confirmed role.
- **RDM-80 Unchanged controls:** facts/repair remain 3500, civilian 2200,
  federal 1900, audit 4000, with unchanged call count, zero retries, draft limit,
  posting isolation, `store: false`, no logging or persistence, and the external
  monthly cap `UNVERIFIED`.
- **RDM-81 Synthetic portability:** regression fixtures must be synthetic and
  structurally equivalent; they must contain no member source or absolute
  attachment path.
- **RDM-82 Nonnumeric Summary duty:** a synthetic nonnumeric Summary claim may
  cite a role-owned duty fact whose same line also contains `110-person`.
- **RDM-83 Nonnumeric Core Skills duty:** a synthetic nonnumeric Core Skills
  claim may cite a mixed duty/metric role fact without naming the role.
- **RDM-84 Multiple incidental metrics:** a synthetic nonnumeric global claim
  may cite a supported role fact containing multiple incidental quantities.
- **RDM-85 Unattributed quantity:** a global claim that states `110-person`
  without the exact owning title or employer must FAIL.
- **RDM-86 Exact-title attribution:** the same supported quantified global claim
  must PASS when it names the exact owning role title.
- **RDM-87 Exact-employer attribution:** the same supported quantified global
  claim must PASS when it names the exact owning employer.
- **RDM-88 Wrong-role collision:** a global quantity matching values in more than
  one role must FAIL when attributed to the wrong role.
- **RDM-89 Cross-role experience:** an experience claim may not cite another
  role's fact, whether or not either line contains a quantity.
- **RDM-90 Unlinked global quantity:** an unlinked global number remains
  unavailable to claims and must FAIL.
- **RDM-91 Unsupported nonnumeric claim:** a nonnumeric global claim marked
  unsupported by the audit must be WITHHELD even when its reference shape is
  valid.
- **RDM-92 Unchanged controls:** facts/repair remain 3500, civilian 2200,
  federal 1900, audit 4000, with unchanged call count, zero retries, draft limit,
  posting isolation, `store: false`, no logging or persistence, and the external
  monthly cap `UNVERIFIED`.
- **RDM-X1 Validation seam:** run `validation-gate`; this skill's semantic PASS
  does not replace structural validation.
- **RDM-X2 Deployment seam:** run `deploy-discipline` for app changes and keep
  private-clone isolation; no production modification, merge, or push.
- **RDM-X3 Privacy-claim seam:** compare every user-facing privacy statement to
  observed code paths. Any unsupported `never stored` or `never logged` claim
  must FAIL even when generation quality passes.

## REGISTRATION

Keep registry item #6 PENDING at version 0.9 until all cases execute and evidence
is reviewed. After successful execution, force-mod proposes the smallest
evidence-supported revision and Commander rules on promotion to CODIFIED 1.0.
