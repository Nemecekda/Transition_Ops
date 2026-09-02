---
name: resume-drafter-maintenance
description: Govern changes to the in-app Resume Drafter's prompts, fact ledger, quality scorecard, claim trace, formats, privacy controls, and cost controls. Owner - force-mod.
metadata:
  version: "0.21"
  status: PENDING
---

# RESUME DRAFTER MAINTENANCE

Purpose: keep civilian and federal resume drafts useful without turning a
member's source material or a job posting into invented qualifications. This
skill governs the Resume Drafter only. It does not authorize app changes,
deployment, or changes to account-level infrastructure.

Version 0.21 is PENDING until the synthetic RDM regression suite and live-clone
validation execute against the app. Specification approval and governance
calibration are not v0.21 application execution evidence.

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
  detailed, while neither truncates identities or fabricates compression. For
  civilian downloads, the final rendered artifact and its page balance are the
  controlling evidence.
- Format compliance: civilian and federal requirements are evaluated against
  separate closed checklists. Civilian downloadable format is scored against
  the final exported and rendered artifact, not model text alone.

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

In civilian generation, keep quantities out of global Summary and Core Skills
claims. Preserve any used supported metric in a bullet under its exact owning role.
A role bullet may use only that role's facts. A global skill remains in Core
Skills unless the confirmed ledger explicitly repeats it in that role's facts.
The auditor must cite the minimum necessary fact references: role claims cite
same-role facts only, and redundant references are prohibited.

Generation, clause inventory, and reference validation must use one shared
section and role-header recognition contract. It must recognize approved safe
heading punctuation and variants consistently, preserve role numbering, and
handle an explicitly `MISSING` employer without assigning later claims to the
wrong role. A role header accepted by the deterministic structure check must be
assigned the same owner by the clause inventory.

A reference-validation failure may return only an allowlisted content-free code
and approved message, such as `global_fact_on_role_claim`,
`role_cross_reference`, `claim_owner_unresolved`,
`global_quantity_owner_mismatch`, `unavailable_fact_reference`, or
`trace_reference_shape`. Never return claim or fact text, catalog or claim IDs,
member identities, provider or token details, or raw internal labels. Do not log
or persist the diagnostic. Diagnostics do not relax fail-closed grounding.

## OWNER-AWARE UNLINKED-NUMBER COLLISIONS

Unlinked `NUMBERS AND SCALE` entries remain excluded from generation, audit
support IDs, and the returned trace. They can never ground a claim. Detect an
output collision with an unlinked entry using the same escaped
alphanumeric-boundary exact-occurrence contract used for catalog ownership,
never a raw substring search. A bare unlinked `26` must not collide with
`2026`.

Build request-local numeric provenance only from non-unlinked catalog facts
owned by a specific role. A colliding claim in global content, Summary, Core
Skills, or an ambiguous or unresolved-owner section must fail before audit. A
role-owned colliding claim may proceed to the existing audit only when every
exact quantity token in the claim is independently present in one or more
non-unlinked catalog facts owned by that exact role. This check is only a
prerequisite for audit and never automatic approval.

Same-role audit references and a `supported` verdict remain mandatory.
Unsupported wording around a valid quantity still withholds the draft. Do not
normalize numeric forms: `26` is not `Twenty-six`; `$9M` is not `$9 million` or
`9 million`. Preserve currency, magnitude, percent, plus signs, commas, decimal
form, and endpoints exactly. Harmless range punctuation remains governed by
RDM-77.

An absent token, a token found only in another role, an unknown, cross-role, or
unlinked reference, an unsupported audit verdict, or a global claim remains
fail-closed under the existing content-free categories. Federal behavior is
unchanged. Add no calls or retries and change no model, cap, privacy control,
storage, logging, persistence, analytics, or usage limit. A qualifying request
may consume the already-authorized audit call instead of stopping early;
configured maximum exposure is unchanged and the external monthly cap remains
`UNVERIFIED`.

## CIVILIAN CANONICAL SUMMARY

In civilian mode only, after `normalizePlainText` and before role metadata
completion, deterministic checks, clause inventory, or audit, replace any
model-generated Summary with a server-owned canonical Summary. Derive it only
from exact semicolon-delimited atoms in the confirmed global `SKILLS AND TOOLS
(EXACT OR MISSING)` field. Apply structural edge trimming only and preserve each
atom's internal bytes. Keep stable source order and select at most four safe
atoms. Exclude empty atoms, literal `MISSING`, exact duplicates, and atoms
containing digits, currency, percentages, dates, durations, or quantified number
words. Join selected atoms with `; ` and add terminal punctuation only when the
last selected atom lacks it.

Never rewrite, translate, rank, semantically deduplicate, aggregate, or broaden
an atom. Never source Summary content from role facts, duties, quantities,
posting, target title, adjacent roles, raw source, or inferred career span. If
no safe global atom exists, omit both Summary heading and body; audit format must
permit that safe omission. If the model omitted Summary and safe atoms exist,
insert the canonical Summary before the first recognized civilian section.
Preserve every non-Summary byte. Canonicalization must be idempotent. Federal
output is unchanged.

The canonical Summary is deterministically grounded and server-owned. Exclude
its claim from model-adjudicated claim IDs and pre-map it only to the closed
global Skills fact. The model may attach neither role nor posting references to
it. After every remaining audit check passes, merge exactly one deterministic
Summary trace into the returned trace. Unsupported non-Summary claims remain
fail-closed. Add no call or retry and change no model, cap, `store: false`,
privacy control, usage limit, logging, persistence, analytics, or cost ceiling.
Maximum incremental API exposure is $0.

## CIVILIAN CANONICAL CORE SKILLS

In civilian mode only, replace any model-generated Core Skills section with a
server-owned canonical section derived only from exact semicolon-delimited atoms
in the confirmed global `SKILLS AND TOOLS (EXACT OR MISSING)` field. Preserve
stable source order. Before selection, exclude every atom already selected for
the canonical Summary by exact atom bytes, then select at most nine remaining
safe atoms. Exclude empty atoms, literal `MISSING`, exact duplicates, and atoms
containing quantities, numeric forms, dates, or durations. Preserve every
selected atom's internal bytes. The server may generate only the `CORE SKILLS`
heading and comma-space separators.

Replace the generated Core Skills heading and body completely. If no safe atom
exists, omit both heading and body. Preserve every non-Core-Skills byte, and
make canonicalization idempotent. Posting text, target title, role facts, duties,
adjacent roles, and raw source cannot contribute canonical skills.

The canonical Core Skills claim is deterministically grounded and server-owned.
Exclude it from model-adjudicated claim IDs and pre-map it only to the closed
global Skills fact. The model may attach neither role nor posting references to
it. Merge exactly one deterministic Core Skills trace only after every remaining
audit check passes. Unsupported noncanonical claims remain audit-mediated and
fail closed.

Civilian translation may change terminology but must preserve the confirmed
activity, object, beneficiary or audience, purpose, domain, scope, scale, level,
and outcome. Same-role facts must support the entire translated claim; posting
references never cure partial support. Unsupported translations remain
audit-mediated and fail closed. Add no call or retry and change no model, cap,
cost ceiling, `store: false`, privacy control, usage limit, logging, persistence,
or analytics. Federal behavior is unchanged, maximum incremental API exposure
is $0, and the external monthly cap remains `UNVERIFIED`.

## FINAL CIVILIAN ARTIFACT GATE

This gate applies only to civilian candidate text and its downloadable artifact.
It does not change the federal path.

Before clause inventory and audit, canonicalize member identity sections from
the closed confirmed ledger. Include every confirmed personal-header value
exactly once and byte-exact. Include every confirmed education,
certification, and license item exactly once and byte-exact. An education item
retains each confirmed degree, school, and date component; an unknown component
is omitted without changing the confirmed components. Replace generated copies
of these sections rather than appending to them, and make the operation
idempotent. Never infer, translate, abbreviate, merge, split, or source these
values from duties, roles, the posting, target title, adjacent facts, or raw
source.

An essential civilian personal header consists of a confirmed member name and
at least one confirmed direct contact method: email or phone. Confirmed location
is included exactly once but is not a substitute for a direct contact method.
When any essential header element is unavailable, omit the unknown value and
all placeholders, score Format Compliance `NEEDS MEMBER FACT`, and give
member-safe guidance outside the resume identifying the missing header fact.
Never invent or reconstruct a header value. A missing essential header does not
turn a truthful, otherwise grounded draft into `PASS` for Format Compliance.

After all deterministic and audit checks pass, the released audited candidate
text is the sole content source for export. The exported artifact must be
content-equivalent: it preserves every released section, identity, claim,
value, order, and list relationship with no added, omitted, changed, or
duplicated candidate content. Presentation-only document structure is allowed;
it may not alter meaning or hide content. Verify equivalence against the actual
exported file, not an intended template or pre-export string.

A Word download must be a real Office Open XML document with the `.docx`
extension and MIME type
`application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
HTML, rich text, or another payload renamed `.doc` or `.docx` fails Format
Compliance. The filename, extension, MIME declaration, and file signature must
agree.

Render the final exported artifact before release. Length and Readability and
Format Compliance may both be `PASS` only when that render is readable and
balanced: no clipping, overlap, hidden text, orphaned heading or role header,
unreadable compression, avoidable sparse trailing page, or large blank region
created while resume content is stranded on another page. Page count is
selected by the adaptive civilian length contract; neither page count is an
unconditional target. A readable, balanced second page is preferable to
deleted roles, credentials, education, or supported substance. The rendered
export, not the unaudited model response or browser preview, controls these two
dimensions.

This gate adds no model call or retry and changes no model, input bound, output
cap, usage limit, budget or cost ceiling, `store: false`, privacy control,
logging, storage, persistence, or analytics. Maximum incremental API exposure
is $0, and the external monthly cap remains `UNVERIFIED`.

## CIVILIAN WORD PAGINATION CONTRACT

This contract extends the final civilian artifact gate without weakening any
v0.15 content, grounding, identity, export, or render requirement.

DOCX styling and rendered-layout validation must classify the already-audited
released candidate text by structural sequence; the browser must not reparse or
re-resolve role identities against the closed ledger. Within PROFESSIONAL
EXPERIENCE, the first eligible nonblank content line after the section heading,
and the first eligible nonblank content line after each completed bullet block,
is the role header. Optional nonbullet content after that role and before its
first bullet is metadata. `Title | Employer`, `Title - Employer`, and
`Title — Employer` are presentation variants that classify as role headers only
in that structural role position. A location/date line or standalone date line
in the metadata position remains metadata. Separator alone is insufficient;
classification and styling must not split, rewrite, or otherwise change any
role identity, separator, or surrounding candidate-content byte.

Execute the browser layout estimator in a layout-capable browser as a
conservative preflight. Static source inspection, function-presence checks,
regular-expression assertions, OOXML structure checks, and extracted-text
checks remain useful supporting evidence but cannot substitute for executed
browser layout behavior. Browser preflight is not proof of final DOCX
pagination or compatibility. Regression evidence must render the actual
exported `.docx` through Microsoft Word or another Word-compatible renderer;
only that rendered artifact can prove final compatibility and page behavior.

Outside the v0.18 selected two-page `B >= 10` contract, second-page occupancy
alone is not proof that a trailing page is avoidably sparse. A numeric
occupancy threshold, including the prior 25% heuristic, may flag those other
layouts for review but may not withhold the artifact by itself. Call a trailing
page avoidable only when the renderer demonstrates a safe, content-equivalent
layout alternative that removes the avoidable sparsity while preserving
readability. Rebalancing may change presentation-only properties, including
safe spacing, pagination, and page-break placement; it may not add, remove,
rewrite, merge, split, reorder, duplicate, conceal, or compress candidate
content. When no safe content-equivalent alternative exists in those other
layouts, preserve the supported content rather than delete it solely to satisfy
an occupancy threshold. For a v0.18 selected two-page candidate with `B >= 10`,
the fixed substantive-page rule controls instead: use a non-sparse semantic
role-boundary result or withhold the unresolved sparse artifact without
compacting it.

Keep-with-next behavior is transitive across each logical opening chain: a
section heading, its role header, optional role metadata, and the first role
bullet must remain together across a page boundary. A page break introduced for
balance must preserve that full chain and every released content byte exactly
once and in order.

Never apply automatic `pageBreakBefore` to `ResumeSpacer`; a spacer may not act
as an implicit or hidden page break. Any explicit pagination break must attach
to a semantic content boundary and pass both browser preflight and actual DOCX
render checks.

Withhold the Word artifact when executed layout evidence shows clipping,
overlap, hidden text, an orphaned section heading or role header, more than two
pages, or unreadable compression. These negative controls remain blocking; the
sparse-page correction does not turn a genuinely defective layout into PASS.
Federal output and behavior remain unchanged. This contract adds no model call,
retry, cap, storage, logging, analytics, privacy change, usage-limit change, or
cost exposure. Maximum incremental API exposure is $0.

## ADAPTIVE CIVILIAN LENGTH CONTRACT

This contract extends the v0.16 civilian artifact and pagination protections.
It changes only civilian length planning, the approved page profile, and how
much already-confirmed draft-eligible role evidence the generator retains. It
weakens no grounding, identity, role, content-equivalence, readability, privacy,
cost, or federal requirement.

Present exactly three preferences in this order: `Adaptive (recommended)`,
`Prefer one page`, and `Prefer two pages`. Select `Adaptive (recommended)` by
default. The preference, pre-generation plan, its inputs and rationale, and the
post-audit validation result are request-local and must not be logged,
persisted, stored, or sent to analytics.

Compute the deterministic length plan after building the confirmed
draft-eligible fact catalog and before calling the existing generator. The plan
and guarded preference may guide how much grounded, role-owned evidence the
generator retains and which approved one- or two-page presentation profile is
used. They may not alter the confirmed ledger or draft-eligible catalog, relax
grounding or same-role ownership, add a model call or retry, increase a cap, or
exceed an existing cap. Use these closed request-local planning inputs:

- `Y`: an explicit member-confirmed count of target-relevant years. If no such
  value is confirmed, `Y` is unavailable. Never calculate, infer, substitute,
  or increase `Y` from age, total service, title, or prose.
- `R`: the count of distinct roles the member selects as target-relevant for
  this request, preserving the existing employer/title/date role-separation
  invariant. Count a selected role only when it contains at least one
  draft-eligible duty or outcome atom. If no role is selected, `R = 0`. Never
  infer role relevance from a title, target, job posting, keyword overlap, or
  model output.
- `A`: the count of distinct draft-eligible, same-role duty or outcome evidence
  atoms owned by the member-selected roles and available to target-aligned
  generation. Count each closed catalog atom once under its exact role owner.
  Global skills, unlinked numbers, unselected roles, and posting terms do not
  count.

Under `Adaptive (recommended)`, recommend two pages only when `A >= 10` and one
applicable branch is true:

1. `Y` is available and ((`Y >= 10` and `R >= 3`) or (`Y >= 15` and
   `R >= 2`)).
2. `Y` is unavailable and `R >= 4`.

Recommend one page in every other case. `A >= 10` is the pre-generation evidence
sufficiency gate, not proof that a final two-page artifact is substantive. The
unavailable-years branch is not an alternative when `Y` is available. Produce a
content-free request-local rationale containing `Y` or `unavailable`, `R`, `A`,
the branch evaluated, and the resulting recommendation. The member-facing UI
must summarize the confirmed counts and recommendation in plain language; it
must not expose internal variable or branch codes. Identical inputs must produce
identical recommendations and rationales. Total service may be displayed
elsewhere only as a confirmed fact; it never enters or substitutes for this
decision.

Preferences are guarded overrides and do not rewrite the recommendation.
Report the adaptive recommendation and applied plan separately. A one-page plan
may direct the existing generator to retain a concise subset of grounded,
role-owned evidence; a two-page plan may retain more grounded role detail from
the same draft-eligible catalog. This profile-specific difference is expected.
Neither plan may omit a confirmed role, education item, certification, or
license; mutate an identity; invent, duplicate, fill, or pad; use posting text as
member evidence; or relax audit, trace, or grounding requirements. `Prefer one
page` cannot force unreadable compression and must use two pages when required
content cannot fit safely. `Prefer two pages` cannot select two pages when
`A < 10` or insert an artificial break merely to reach page two.

After audit, set `B` to the count of distinct supported role bullets in the
audited candidate, counting each bullet once under its exact role owner. A
selected two-page output is release-eligible only when `B >= 10` and the actual
exported DOCX renders as two substantive, readable, balanced pages in a
Word-compatible renderer. Browser estimation remains conservative preflight,
not proof. If `B < 10`, apply only the approved one-page presentation profile
to the same audited candidate and re-render, preserving every released
candidate-content byte. If that content cannot render safely on one page,
withhold the artifact.

For a selected two-page plan with `B >= 10`, keep one fixed senior-readable
profile through preflight and export; do not compact it merely because the
render is not exactly two pages. If that fixed profile already renders as two
pages but leaves an avoidably sparse trailing page, a single
presentation-only `pageBreakBefore` may be attached to the best semantic role
boundary only when the unmodified candidate already rendered as two pages and
the executed check demonstrates a more balanced, non-sparse two-page result.
If no eligible semantic role boundary produces two substantive pages, withhold
the artifact; never release the unresolved sparse result or compact it. Never
attach the break to `ResumeSpacer`, separate PROFESSIONAL EXPERIENCE from its
first role, alter candidate content, or manufacture a second page from a
natural one-page result. If the fixed profile safely renders one
natural page, release that readable one-page exception, mark Length and
Readability `NEEDS MEMBER FACT`, and request additional confirmed,
role-specific accomplishments outside the resume. Do not add filler, padding,
or a forced second page, and do not report the exception as satisfying the
two-page plan. Unsafe or more-than-two-page results remain withheld. Never make
another model call, delete or rewrite audited content, conceal content, or
weaken a blocking gate during fallback or rebalancing.

Content exactness compares each export to its own released audited candidate,
not a one-page candidate to a two-page candidate. A valid two-page candidate may
contain more grounded role detail than a valid one-page candidate generated from
the same catalog, while every retained claim remains fully grounded and traced.

Every result remains subject to the v0.16 maximum of two pages, complete-chain
pagination, content exactness, and actual DOCX render gates. Federal behavior,
models, API calls, retries, input bounds, facts/repair 3500, civilian 2200,
federal 1900, audit 4000, usage limits, budget and cost ceilings, `store: false`,
privacy, logging, storage, persistence, and analytics remain unchanged. Maximum
incremental API exposure is $0, and the external monthly cap remains
`UNVERIFIED`.

## CIVILIAN ROLE METADATA COMPLETION

In civilian mode only, after `normalizePlainText` and before
`draftQualityIssues`, clause inventory, or audit, deterministically complete
confirmed role `LOCATION` and `DATES` from the closed role ledger or catalog.
Use the shared role-header matcher and exact role identity. Values equal to the
literal `MISSING` are absent. When both values are confirmed, emit one dedicated
line immediately after the exact role header as `location | dates`. When only
one is confirmed, emit only that exact value. When neither is confirmed, emit no
metadata line. Preserve metadata bytes exactly, including punctuation,
capitalization, and en dashes; only the separator is generated.

Completion must be idempotent and must not duplicate exact metadata. Existing
exact combined or separate metadata may be canonicalized safely. Never infer,
translate, abbreviate, or source metadata from duties, the posting, target title,
adjacent roles, or raw source. Never alter, remove, combine, reorder, or reword
any bullet. Unknown or conflicting generated metadata must not be removed or
silently blessed; it remains visible to the fail-closed audit.

Duplicate exact title/employer roles must never cross-populate metadata. Use a
safe first-unmatched role assignment or fail closed when ownership is ambiguous.
The completed candidate text must reach deterministic checks, inventory, audit,
same-role trace validation, and the UI. Federal output is unchanged. Add no
model call or retry and change no token cap, model, `store: false`, logging,
persistence, analytics, usage limit, privacy control, or cost ceiling. Maximum
incremental API exposure is $0.

Page-count planning may vary how many draft-eligible, same-role evidence atoms
the generator retains before audit. Complete role inventory, credentials, and
education remain blocking safety requirements. After audit, presentation and
fallback may not delete or rewrite released supported content. Deterministic
filler checks apply only to generated summary and duty/accomplishment prose,
never byte-exact title, employer/unit, degree, school, certification, or license
fields.

Pre-audit deterministic failures remain fail-closed but use distinct,
content-free categories: `civilian_format`, `filler_language`,
`unsupported_number`, `role_structure`, and `unlinked_global_number`. Return
approved actionable wording only. Never return member text, the rejected draft,
fact values, IDs, provider details, or raw internal issue labels.

## FORMAT RULES

Civilian mode is candidate-ready, with one or two pages selected adaptively:
concise summary, concrete skills, distinct roles, short evidence-bearing
bullets, and exact credentials. Unknown name/contact/header fields, role
location/date segments, and education years are omitted. `MISSING` remains
explicit only in the internal/member-reviewed ledger. Missing optional civilian
fields are `NEEDS MEMBER FACT` audit gaps, not blockers when the draft makes no
unsupported claim. Civilian output contains no brackets, literal `MISSING`,
`TIP:`, or federal-only fields. Improvement guidance belongs in the response's
gaps, outside the resume.

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
- **External provider project control: ACCOUNT-VERIFIED on 2026-08-31.** The
  dated `intel/privacy-account-evidence-2026-08-31.md` artifact records a
  configured USD 5 monthly project spend limit and 100 percent alert. The
  provider warned that timing can allow actual cost to exceed the displayed
  limit, so this is not a guaranteed real-time hard stop or a statement about
  another project, key, endpoint, or account.
- Account evidence does not authorize inspection or mutation of external
  settings. Any account, model, price, key, project, endpoint, or provider
  change places the current status on hold for revalidation.

## SHARED RUNTIME SPEND GUARD - VERSION 0.19

Every Resume provider call must pass through `runtime-ai-spend-governance`
immediately before the call. This includes initial Luna fact extraction,
conditional Terra fact repair, civilian generation, federal generation, and
structured audit. There is no direct-client or unguarded fallback.

The Resume call graph remains unchanged. The maximum repair path is exactly four
calls: initial facts, one conditional repair, one civilian or federal generation,
and one audit. The exact output caps remain initial 3500, repair 3500, civilian
2200, federal 1900, and audit 4000. Provider retries remain zero. The shared
guard may deny a call; it may not add, repeat, reorder, substitute, or combine a
Resume stage.

A valid cutoff denial is `budget_limit` and returns only the approved
content-free member wording. Denial before initial extraction releases no fact
sheet. Denial before a required repair withholds the partial fact sheet. Denial
before generation releases no draft. Denial before audit withholds the draft,
artifact, trace, and scorecard. An accounting or pricing fault follows the
shared content-free `upstream_unavailable` contract. No path exposes or stores
the resume, source, header, confirmed ledger, posting, target, draft, trace,
scorecard, provider error, request/response ID, token detail, identity, or IP in
the spend ledger, logs, analytics, or failure response.

The repository guard is a USD 4.00 internal UTC-month aggregate for requests
that pass through it after activation. It is distinct from the dated
`ACCOUNT-VERIFIED` provider project control and does not prove full-project or
full-account spend. Navigator shares the aggregate budget but remains an
independent route: Navigator evidence cannot clear any Resume stage, and Resume
evidence cannot clear Navigator.

Version 0.19 changes no model, Resume output cap, provider retry, grounding,
trace, score, export, privacy, or call-count rule. Historical version statements
remain records of their own approved boundaries; this section is the controlling
current-version spend contract.

## CLIENT-TO-FUNCTION TRANSPORT CONTRACT - VERSION 0.21

One Resume button activation makes at most one request to the fixed
`/.netlify/functions/resume` path. After the required deadline capability
preflight succeeds, the activation makes exactly one request. If
`AbortController` is missing, non-callable, non-constructible, or lacks the
required signal and abort API shape, fail closed before fetch with zero request
attempts. This is the sole zero-request exception. The client must not replay,
retry, redirect, or issue a second request automatically after rejection,
timeout, invalid JSON, or any other transport result. A member may choose a
later button activation; that is a new request and not an automatic replay.

Construct one `AbortController`, arm one request-wide 35,000-millisecond timer,
and pass the controller signal to the sole fetch. The same deadline covers
fetch, handler-marker inspection, and JSON parsing. Deadline expiration aborts
the controller once and settles `client_timeout` directly; classification must
not depend on a later fetch or body-read rejection. The first terminal result
wins. Every terminal path clears its timer exactly once, and any late fetch or
body completion must not overwrite the result or memory-local diagnostic.

Every response produced by the Resume handler carries the fixed, content-free
`X-Transition-Ops-Resume-Handler: 1` marker through the existing shared response
header object. The marker identifies only that the response crossed the Resume
handler response boundary. It does not prove provider, model, stage, budget,
ledger, or generation execution. A response without the exact marker is not a
handler response and its body must not be read.

Classify each request locally into exactly one closed outcome:

- `handler_json`: the fixed marker is present, the declared media type is JSON,
  and JSON parsing succeeds. Preserve the existing success and failure HTTP
  handling and member-safe response copy.
- `fetch_rejected`: the single fetch rejects before a response is available.
- `non_handler_response`: a response is available without the exact fixed
  handler marker. Do not read its body.
- `handler_non_json`: the marker is present but the declared media type is not
  JSON. Do not read its body.
- `handler_json_parse`: the marker and JSON media type are present but JSON
  parsing fails.
- `client_timeout`: the request-wide client deadline expires before another
  terminal outcome wins. A timeout before a marked response has
  `httpStatus: null` and `handlerResponseCount: 0`; a timeout after the marker
  is accepted retains the captured integer status and
  `handlerResponseCount: 1`. This browser transport outcome is distinct from
  the server/provider failure category `timeout`.

The request-local transport diagnostic may expose only these six fields: the
fixed function `path`; `httpStatus` as an integer or `null`; nonnegative integer
`elapsedMs`; integer `requestAttemptCount`; integer `handlerResponseCount`; and
the closed `outcome`. `requestAttemptCount` is 1 after the sole fetch is invoked
and 0 only for the pre-fetch capability failure described above.
`handlerResponseCount` is 1 only when the fixed marker is present and otherwise
0; it is not a total function invocation count. The diagnostic is memory-only,
is replaced by the next Resume request, and must not enter a log, persistence,
browser storage, analytics event, later request, response body, member-facing
copy, or download.

Never place a raw body, response-header value, caught error, message, stack,
URL or origin, cookie, secret, prompt, response content, resume, identity, IP,
provider, model, or stage in the diagnostic. Classification adds no provider
call, model call, function replay, retry, storage, logging, analytics, output
cap, request cap, or cost exposure. All grounding, fact, audit, export, budget,
privacy, and member-safe failure behavior remains unchanged.

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
- **RDM-79 Role and required-content completeness:** a one-page plan may retain
  fewer grounded, same-role duty or outcome atoms before audit than a two-page
  plan. Neither plan may merge, omit, or rewrite a confirmed role or omit a
  credential or education item; after audit, no released claim may be deleted
  or rewritten for pagination.
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
- **RDM-93 Summary quantity suppression:** a synthetic civilian generator input
  containing role-owned metrics must produce no quantity in global Summary.
- **RDM-94 Core Skills quantity suppression:** the same input must produce no
  quantity in global Core Skills.
- **RDM-95 Owning-role metric:** every used supported metric must remain in a
  bullet under its exact owning role.
- **RDM-96 Global reference diagnostic:** a role claim citing a global skill not
  explicitly repeated in that role's facts must FAIL with only the approved
  `global_fact_on_role_claim` code and content-free message.
- **RDM-97 Cross-role diagnostic:** a role claim citing another role's fact must
  FAIL with only `role_cross_reference` and its content-free message.
- **RDM-98 Heading variants:** approved punctuation and variants for Summary,
  Core Skills, and Professional Experience must produce the same section and
  owner assignments as canonical headings.
- **RDM-99 Matcher consistency:** every synthetic role header accepted by the
  deterministic structure matcher must receive the same role owner in the
  clause inventory.
- **RDM-100 Missing employer:** an explicitly `MISSING` employer must preserve
  the role, assign its claims correctly, and never shift later claims to an
  adjacent role.
- **RDM-101 Numbering consistency:** first, middle, and final roles in a
  synthetic multi-role draft must retain matching catalog, inventory, and trace
  owner numbers.
- **RDM-102 Natural numeric summary:** a naturally phrased civilian Summary
  containing a role-owned quantity must FAIL when it lacks exact owner
  attribution.
- **RDM-103 Attributed numeric summary:** the same supported quantity must PASS
  the validator when a test fixture deliberately supplies the exact owning title
  or employer, preserving the existing attributed-claim boundary.
- **RDM-104 Extra invalid reference:** a claim with one valid minimum reference
  plus an unnecessary invalid global, cross-role, unknown, or unlinked reference
  must FAIL with the corresponding content-free diagnostic.
- **RDM-105 Unchanged controls:** facts/repair remain 3500, civilian 2200,
  federal 1900, audit 4000, with unchanged call count, zero retries, draft limit,
  posting isolation, `store: false`, no logging or persistence, no diagnostic
  member content, and the external monthly cap `UNVERIFIED`.
- **RDM-106 Six-role metadata:** a synthetic six-role civilian draft must insert
  confirmed metadata correctly for first, middle, and final roles.
- **RDM-107 Both values:** confirmed location and dates must produce exactly one
  dedicated `location | dates` line immediately after the exact role header.
- **RDM-108 Location only:** confirmed location with `MISSING` dates must produce
  only the byte-exact location.
- **RDM-109 Dates only:** confirmed dates with `MISSING` location must produce
  only the byte-exact dates.
- **RDM-110 Neither value:** two literal `MISSING` values must produce no
  metadata line, placeholder, bracket, separator artifact, or `MISSING` output.
- **RDM-111 Existing combined metadata:** an existing exact combined metadata
  line must remain single after completion.
- **RDM-112 Existing separate metadata:** exact separate location and date lines
  may be safely canonicalized without duplication or byte changes to values.
- **RDM-113 Idempotence:** applying civilian metadata completion twice must be
  byte-identical to applying it once.
- **RDM-114 Exact bytes:** synthetic capitalization, punctuation, commas, and
  en-dash date ranges must survive byte-exact; only ` | ` may be generated.
- **RDM-115 Conflict handling:** unknown or conflicting generated metadata must
  remain present and cause fail-closed withholding; completion must not remove,
  replace, or silently bless it.
- **RDM-116 Duplicate and similar roles:** duplicate exact title/employer pairs
  and similar titles must use safe first-unmatched ownership or fail closed,
  never cross-assign metadata.
- **RDM-117 Bullet preservation:** completion must preserve every bullet's byte
  content, count, order, and owning role.
- **RDM-118 Audit candidate:** the completed metadata must be present in the
  candidate draft sent to audit and in the released UI text.
- **RDM-119 Trace ownership:** each completed metadata claim must cite only its
  same-role closed location or date fact.
- **RDM-120 No inference:** metadata absent from the closed role ledger must not
  be sourced from duties, posting, target title, adjacent roles, or raw source.
- **RDM-121 Mode boundary:** civilian output must leak no brackets,
  placeholders, or literal `MISSING`; federal output and federal bracket behavior
  must remain unchanged.
- **RDM-122 Unchanged controls:** facts/repair remain 3500, civilian 2200,
  federal 1900, audit 4000, with unchanged models, call count, zero retries,
  draft and usage limits, posting isolation, `store: false`, no logging,
  persistence, or analytics, unchanged privacy controls, $0 incremental API
  exposure, and the external monthly cap `UNVERIFIED`.
- **RDM-123 Four safe atoms:** four safe global Skills atoms must produce one
  canonical Summary in stable source order.
- **RDM-124 One, two, and three atoms:** each smaller safe-atom set must produce
  the corresponding deterministic Summary without padding or invention.
- **RDM-125 Bounded selection:** more than four safe atoms must use only the
  first four in source order; omitted atoms must not be invented elsewhere.
- **RDM-126 Unsafe atom exclusion:** atoms containing digits, currency,
  percentages, dates, durations, or quantified number words, plus empty,
  literal `MISSING`, and exact duplicate atoms, must be excluded.
- **RDM-127 Byte and punctuation preservation:** selected atoms must preserve
  internal capitalization and punctuation byte-exact, adding terminal
  punctuation only when absent.
- **RDM-128 Generated separators only:** canonicalization may generate only
  `; ` separators and permitted terminal punctuation.
- **RDM-129 No-safe omission:** when no safe atom remains, both Summary heading
  and body must be omitted and audit format must permit the omission.
- **RDM-130 Broad Summary replacement:** any model-generated broad or aggregated
  Summary must be removed completely and replaced only by the canonical Summary.
- **RDM-131 Source isolation:** role facts, duties, quantities, posting, target,
  adjacent roles, raw source, and inferred career span must not influence the
  canonical Summary.
- **RDM-132 Non-Summary preservation:** canonicalization must preserve every
  non-Summary candidate byte, including Core Skills, roles, bullets, metadata,
  education, and credentials.
- **RDM-133 Summary idempotence:** applying canonicalization twice must be
  byte-identical to applying it once.
- **RDM-134 Deterministic support:** the canonical Summary trace must reference
  only the closed global `SKILLS AND TOOLS` fact.
- **RDM-135 Model-adjudication exclusion:** the canonical Summary claim must not
  appear in model-adjudicated claim IDs.
- **RDM-136 Single merged trace:** exactly one deterministic canonical Summary
  trace must be merged after all remaining audit checks pass.
- **RDM-137 No model references:** the auditor must be unable to attach role or
  posting references to the canonical Summary.
- **RDM-138 Non-Summary fail closed:** an unsupported role bullet or other
  noncanonical claim must still cause withholding.
- **RDM-139 Existing quality controls:** exact identity, role separation,
  metadata, quantity, keyword, translation, filler, readability, format, and
  complete-trace controls must remain unchanged.
- **RDM-140 Federal boundary:** federal output and federal Summary behavior must
  remain byte-identical to the pre-v0.12 path.
- **RDM-141 Unchanged operational controls:** facts/repair remain 3500, civilian
  2200, federal 1900, audit 4000, with unchanged models, call count, zero
  retries, draft and usage limits, posting isolation, `store: false`, no logging,
  persistence, or analytics, unchanged privacy controls, $0 incremental API
  exposure, and the external monthly cap `UNVERIFIED`.
- **RDM-142 Alphanumeric boundary:** a bare unlinked `26` must not collide with
  `2026`; collision matching must use escaped alphanumeric boundaries rather
  than raw substring search.
- **RDM-143 Same-role shortened phrase:** a role fact containing a synthetic
  `110-person recruiting operation` must allow a colliding role-owned
  `110-person operation` claim to reach the existing audit when exact numeric
  provenance belongs to that role.
- **RDM-144 Supported release:** the RDM-143 candidate may release only after a
  supported audit verdict with valid same-role references.
- **RDM-145 Unsupported audit:** the RDM-143 candidate must be withheld when the
  audit does not support the shortened wording.
- **RDM-146 Global and unresolved collision:** a colliding claim in Summary,
  Core Skills, other global content, or an ambiguous or unresolved-owner
  section must stop before audit.
- **RDM-147 Unsupported quantities:** a role claim using synthetic `1,200` and
  `18` without exact same-role numeric provenance must stop before audit.
- **RDM-148 Mixed quantities:** a colliding role claim with one supported and
  one unsupported quantity must stop before audit.
- **RDM-149 Wrong-role quantity:** a quantity present only in another role's
  non-unlinked facts must stop before audit.
- **RDM-150 Exact numeric forms:** synthetic cases must keep `26` distinct from
  `Twenty-six`, `$9M` distinct from `$9 million` and `9 million`, and preserve
  percent signs, plus signs, commas, and decimal forms exactly.
- **RDM-151 Ranges:** harmless range punctuation must preserve RDM-77 behavior,
  while every endpoint must retain exact same-role provenance.
- **RDM-152 Duplicate quantity ownership:** when the same quantity appears in
  multiple roles, only non-unlinked facts owned by the claim's exact role may
  satisfy the prerequisite.
- **RDM-153 Unlinked reference exclusion:** unlinked IDs must be absent from the
  audit support schema and returned trace, and any returned unlinked reference
  must fail closed.
- **RDM-154 Multiple same-role facts:** exact quantities from more than one
  non-unlinked fact owned by the same role may satisfy the audit prerequisite
  but must never cause automatic approval.
- **RDM-155 Unsupported surrounding wording:** valid same-role numeric
  provenance must not rescue unsupported surrounding nonnumeric wording; an
  unsupported audit verdict withholds the draft.
- **RDM-156 Federal boundary:** federal behavior must remain unchanged.
- **RDM-157 Unchanged operational controls:** models, calls, retries,
  facts/repair 3500, civilian 2200, federal 1900, audit 4000, `store: false`,
  privacy, logging, storage, persistence, analytics, draft and usage limits
  remain unchanged. Configured maximum exposure is unchanged, and the external
  monthly cap remains `UNVERIFIED`.
- **RDM-158 Posting-only Core Skills:** synthetic posting-only `workforce
  development programs` and `onboarding strategy` phrases must never enter the
  canonical Core Skills section.
- **RDM-159 Posting-only gaps:** posting-only skill phrases must appear only as
  unmet gaps, never as member qualifications.
- **RDM-160 Canonical atom de-duplication:** one through nine confirmed safe
  Skills atoms must render byte-exact and exactly once across Summary and Core
  Skills in stable source order. Summary receives up to the first four; Core
  Skills excludes those exact atoms and receives only the remainder. Reapplying
  both canonicalizers must be idempotent.
- **RDM-161 Bounded de-duplicated skills:** with more than thirteen confirmed
  safe Skills atoms, Summary must use the first four and Core Skills only the
  next nine in stable source order; later atoms are excluded, and no exact atom
  may appear in both sections.
- **RDM-162 Unsafe atom exclusion:** empty, literal `MISSING`, exact duplicate,
  quantified, numeric, date, and duration atoms must be excluded.
- **RDM-163 Generated replacement:** broad or posting-derived model Core Skills
  must be removed completely and replaced only by canonical Skills atoms.
- **RDM-164 No-safe omission:** when no safe atom remains, both Core Skills
  heading and body must be omitted without a format failure.
- **RDM-165 Preservation and idempotence:** canonicalization must preserve every
  non-Core-Skills byte, and applying it twice must be byte-identical to applying
  it once.
- **RDM-166 Deterministic Skills support:** the canonical Core Skills trace must
  reference only the closed global `SKILLS AND TOOLS` fact.
- **RDM-167 Audit exclusion and merge:** canonical Core Skills must be excluded
  from model-adjudicated claim IDs and merged exactly once only after every
  remaining audit check passes.
- **RDM-168A Unsupported translation broadening:** attempt to turn a confirmed
  `transition-planning application` into `candidate support`; the audit must
  withhold the unsupported broader claim.
- **RDM-168B Exact-phrase positive control:** the same fixture using the exact
  confirmed `transition-planning application` phrase must remain eligible for
  release when every other gate passes.
- **RDM-169A Fully supported narrow translation:** a civilian translation may
  pass only when same-role facts support the complete activity, object,
  beneficiary or audience, purpose, domain, scope, scale, level, and outcome.
- **RDM-169B Semantic mutation failures:** starting from the RDM-169A positive
  control, mutate activity, object, beneficiary or audience, purpose, domain,
  scope, scale, level, and outcome one element at a time; every unsupported
  mutation must be withheld.
- **RDM-170A Posting-only cure rejection:** posting terminology or references
  must not cure an unsupported or partially supported role claim; an
  adversarial posting containing the missing element must still withhold it.
- **RDM-170B Member-fact positive control:** the same terminology may pass only
  when member-confirmed same-role facts independently support every semantic
  element; the posting remains targeting context, not evidence.
- **RDM-171 Unchanged controls:** federal behavior, models, calls, retries,
  facts/repair 3500, civilian 2200, federal 1900, audit 4000, `store: false`,
  privacy, logging, storage, persistence, analytics, draft and usage limits
  remain unchanged. Maximum incremental API exposure is $0, and the external
  monthly cap remains `UNVERIFIED`.
- **RDM-172 Cross-section uniqueness and idempotence:** exact Summary atoms must
  be absent from Core Skills, all retained atoms must remain in stable order,
  and repeated final civilian canonicalization must be byte-identical.
- **RDM-173 Identity-section completeness:** every confirmed personal-header,
  education, certification, and license item must survive byte-exact and exactly
  once. An unknown education component must be omitted without losing confirmed
  components. Missing member name or both direct contact methods must produce no
  invention or placeholder, must score Format Compliance `NEEDS MEMBER FACT`,
  and must return member guidance outside the resume.
- **RDM-174 Export equivalence and truthful DOCX:** extracted content from the
  final download must be structurally equivalent to the released audited
  candidate text with no added, omitted, changed, reordered, or duplicated
  content. The payload must be genuine Office Open XML with `.docx`, the exact
  DOCX MIME type, and a matching file signature; renamed HTML or `.doc` fails.
- **RDM-175 Six-role render balance:** a synthetic six-role civilian fixture
  must retain all roles, education, and credentials and must not render a second
  page containing only two roles with most of that page blank. It must use a
  readable balanced second page when adaptive selection or preservation of all
  supported content requires it.
- **RDM-176 Render-governed scoring:** clipping, overlap, hidden text, orphaned
  headings or role headers, unreadable compression, or avoidable sparse trailing
  pages must prevent simultaneous `PASS` for Length and Readability and Format
  Compliance, even when model text and grounding checks pass.
- **RDM-177 Federal artifact boundary:** federal generation, brackets, content,
  audit, export behavior, and score rules must remain unchanged from v0.14.
- **RDM-178 Unchanged operational controls:** models, calls, retries,
  facts/repair 3500, civilian 2200, federal 1900, audit 4000, input bounds,
  draft and usage limits, budget and cost ceilings, `store: false`, privacy,
  logging, storage, persistence, and analytics remain unchanged. Maximum
  incremental API exposure is $0, and the external monthly cap remains
  `UNVERIFIED`.
- **RDM-179 Live-shaped Word positive control:** a synthetic civilian fixture
  with exactly six roles, 16 bullets, four certifications, and four education
  items, including mixed confirmed and missing optional metadata, must produce
  a downloadable genuine DOCX of one or two readable pages while preserving
  every required item.
- **RDM-180 Role-header grammar:** in otherwise identical already-audited
  released candidate fixtures, `Title | Employer`, `Title - Employer`, and
  `Title — Employer` must each classify as a role header when placed after the
  PROFESSIONAL EXPERIENCE heading or a completed bullet block. Location/date
  lines and standalone date lines in the following metadata position must
  classify as metadata. Separator alone is insufficient, the browser must not
  reparse the closed ledger, and classification and styling must preserve every
  identity and candidate-content byte.
- **RDM-181 Executed browser preflight:** the regression must execute the
  layout estimator in a layout-capable browser as conservative preflight. A
  static source match, function-presence assertion, OOXML byte check, or
  extracted-text check alone cannot satisfy this case, and browser execution
  cannot satisfy the actual-DOCX render case.
- **RDM-182A Low occupancy is not avoidability:** occupancy alone remains
  insufficient proof for general layout decisions. Version 0.18 narrows this
  rule for a selected two-page candidate with `B >= 10`: release eligibility
  requires two substantive fixed-profile pages, so an unresolved sparse result
  is withheld rather than released or compacted when no non-sparse semantic
  role-boundary candidate exists.
- **RDM-182B Demonstrated avoidability:** a trailing page made sparse only by
  presentation spacing must be safely rebalanced or withheld when an executed
  render demonstrates a readable content-equivalent alternative; occupancy
  alone remains insufficient evidence.
- **RDM-183 Transitive keep-with-next:** force a page boundary through the
  complete section-heading, role-header, optional-metadata, and first-bullet
  chain. The entire chain must remain together with no orphaned heading or role
  header.
- **RDM-184 Rebalancing equivalence:** any inserted page break, spacing change,
  or other pagination adjustment must be presentation-only. Extracted sections,
  order, six roles, 16 bullets, four certifications, four education items, and
  every released candidate-content byte must remain exact, complete, and
  represented once.
- **RDM-185 Negative layout controls:** clipping, overlap, hidden text, an
  orphaned section heading or role header, more than two pages, and unreadable
  compression must each withhold the artifact with the correct member-safe
  reason.
- **RDM-186 Unchanged operational boundary:** federal generation, content,
  brackets, audit, export, and scoring remain unchanged. Models, API calls,
  retries, facts/repair 3500, civilian 2200, federal 1900, audit 4000, input
  bounds, budget and cost ceilings, draft and usage limits, `store: false`,
  privacy, logging, storage, persistence, and analytics remain unchanged.
  Maximum incremental API exposure is $0, and the external monthly cap remains
  `UNVERIFIED`.
- **RDM-187 Short-career adaptive one page:** a synthetic civilian candidate
  with pre-generation inputs `Y = 6`, `R = 2`, and `A = 6` must default to
  `Adaptive (recommended)`, select the one-page plan before generation, retain
  a concise grounded subset of same-role evidence while preserving every role,
  education item, and credential, and render one readable audited page.
- **RDM-188 Senior or broad adaptive two pages:** synthetic positive controls
  at `Y = 10`, `R = 3`, `A = 10` and at `Y = 15`, `R = 2`, `A = 10` must
  select the two-page plan before generation. Against a paired one-page
  preference using the same catalog, each two-page candidate may retain more
  grounded same-role detail without filler, padding, duplication, invention,
  or an artificial break; after audit it must have `B >= 10` and render as two
  substantive, balanced pages in a Word-compatible renderer.
- **RDM-189 Deterministic boundaries and unavailable years:** table-driven
  cases must return two pages at the exact `10/3` and `15/2` boundaries only
  when `A >= 10`; `9/3`, `10/2`, `14/2`, or `A = 9` returns one page.
  Confirmed total service of 20 years with `Y = 4` must use `Y = 4`, never 20.
  When `Y` is unavailable, only `R >= 4` and `A >= 10` together recommend two
  pages; `R = 3`, `A = 10` or `R = 4`, `A = 9` recommends one. The request-local
  role selector must count only member-selected roles containing
  draft-eligible atoms; an unselected role, posting-only term, target, keyword
  overlap, or role title must add neither a role nor an atom. Repeated identical
  catalog and selection inputs must expose identical `Y`, `R`, `A`, branch,
  plan, and rationale. A newly extracted or edited fact sheet must start with no
  relevant roles selected; the member must actively select each role counted in
  `R`.
- **RDM-190 Guarded and request-local preferences:** present exactly these
  labels: `Adaptive (recommended)`, `Prefer one page`, and `Prefer two pages`,
  in that order with Adaptive selected by default. From one adequate catalog, a
  one-page preference may retain fewer grounded same-role atoms and a two-page
  preference may retain more, while both preserve every role, education item,
  credential, exact identity, and grounding rule. A one-page preference that
  cannot fit required content readably must use two pages; a two-page preference
  with `A < 10` must use one page rather than add filler, duplicate or invent
  claims, pad, or force a break. Report the unchanged adaptive recommendation
  and applied plan separately, and place neither preference nor rationale in
  logs, storage, persistence, or analytics.
- **RDM-191 No spacer page breaks:** `ResumeSpacer` must never receive automatic
  `pageBreakBefore` or act as an implicit break in one- or two-page fixtures.
  Any explicit break must attach to a semantic content boundary and preserve
  the complete keep-with-next chain.
- **RDM-192 Actual DOCX compatibility:** export the one- and two-page fixtures
  as genuine DOCX files and open and render those actual files in Microsoft
  Word or another Word-compatible renderer. A selected two-page output must
  have post-audit `B >= 10` and two substantive, readable, balanced rendered
  pages with no clipping, overlap, hidden text, orphaned chain, or compatibility
  error. A `B = 9` fixture must apply the one-page presentation profile to the
  same audited content and re-render with no model call or model retry; if that
  content cannot fit safely, the artifact is withheld. A `B >= 10` sparse
  two-page fixture must retain the fixed senior-readable profile and either
  rebalance to two substantive pages at an eligible semantic role boundary or
  be withheld; it must never compact. The conservative browser estimator must
  execute as preflight, but its result alone cannot satisfy this case.
- **RDM-193 Per-output content exactness:** one- and two-page candidates from the
  same catalog need not contain the same number of grounded role bullets. Each
  extracted DOCX and Word-compatible render must match its own released audited
  candidate exactly, preserving every released section, order, role, identity,
  metadata value, supported bullet, credential, education item, and list
  relationship once, with no added, omitted, changed, reordered, duplicated,
  or concealed candidate content. A fallback changes presentation only.
- **RDM-194 Unchanged federal and operational boundary:** federal generation,
  content, brackets, audit, export, pagination, and scoring remain unchanged.
  Models, API calls, retries, facts/repair 3500, civilian 2200, federal 1900,
  audit 4000, input bounds, budget and cost ceilings, draft and usage limits,
  `store: false`, privacy, logging, storage, persistence, and analytics remain
  unchanged. Planning, profile selection, post-audit validation, and fallback
  add no model call or retry and exceed no cap. Maximum incremental API exposure
  is $0, and the external monthly cap remains `UNVERIFIED`.
- **RDM-195 Senior live-shape substantive pages:** a synthetic civilian
  candidate with exactly six roles, 14 supported role bullets, four
  certifications, and four education items must keep the fixed
  senior-readable profile and render as two substantive, balanced pages in the
  browser preflight and an actual Word-compatible renderer. When natural
  pagination leaves the trailing page sparse, one deterministic
  presentation-only break may rebalance at a semantic role boundary only; the
  extracted candidate content must remain byte-exact. The break may not
  separate PROFESSIONAL EXPERIENCE from its first role, and an unresolved
  sparse result must be withheld.
- **RDM-196 Fallback separation:** a selected two-page candidate with `B = 9`
  must use the existing one-page fallback and be withheld if the unchanged
  audited content cannot fit safely. A selected two-page candidate with
  `B >= 10` must never fall back to the compact profile solely because the
  fixed senior-readable render is not exactly two pages; it must use an honest
  one-page exception, two substantive fixed-profile pages, or a withheld
  disposition as applicable.
- **RDM-197 Honest one-page evidence exception:** when a selected two-page
  candidate with `B >= 10` safely renders as one natural page under the fixed
  senior-readable profile, release that one readable page without filler,
  padding, compression, or a forced break. Mark Length and Readability
  `NEEDS MEMBER FACT`, preserve any existing failure, and request more
  confirmed role detail outside the resume.
- **RDM-198 Unchanged operational boundary:** federal generation, content,
  brackets, audit, export, pagination, and scoring remain unchanged. Models,
  API calls, retries, facts/repair 3500, civilian 2200, federal 1900, audit
  4000, input bounds, budget and cost ceilings, draft and usage limits,
  `store: false`, privacy, logging, storage, persistence, and analytics remain
  unchanged. Version 0.18 adds no model call or retry, exceeds no cap, and has
  maximum incremental API exposure of $0; the external monthly cap remains
  `UNVERIFIED`.
- **RDM-199 Guard coverage:** initial facts, conditional repair, civilian,
  federal, and audit must each enter the shared guard immediately before the
  provider call; a direct provider-client path must fail.
- **RDM-200 Exact operational limits:** initial/repair/civilian/federal/audit
  caps remain 3500/3500/2200/1900/4000, provider retries remain zero, and the
  guard adds no stage or call.
- **RDM-201 Four-call repair worst case:** the maximum conditional-repair path
  must remain exactly initial facts, one repair, one selected-mode generation,
  and one audit, with a distinct reservation before each actual call.
- **RDM-202 Budget denial:** a synthetic cutoff denial before any stage must
  return only `budget_limit` and approved safe wording and must make zero calls
  for the denied stage.
- **RDM-203 Partial withholding:** denial before repair must withhold a partial
  fact sheet; denial before generation must release no draft; denial before
  audit must release no draft, artifact, trace, or scorecard.
- **RDM-204 Spend privacy:** synthetic resume, header, ledger, posting, target,
  trace, identity, IP, and request/response-ID sentinels must appear in neither
  the aggregate spend record, application logs, analytics, nor failure output.
- **RDM-205 Navigator independence:** Navigator and Resume must share aggregate
  spend, but Navigator success or denial must not satisfy any Resume guard case
  or alter the Resume call graph.
- **RDM-206 Control truth:** the dated USD 5 provider project control remains
  `ACCOUNT-VERIFIED` only for its recorded 2026-08-31 scope and warning; the USD
  4 repository guard remains a distinct post-activation internal control and
  never becomes full-account proof.
- **RDM-207 Governance-only execution:** RDM-199 through RDM-206 may pass
  synthetic governance calibration without implying application wiring,
  provider execution, hosted validation, or promotion of this PENDING skill.
- **RDM-208 One activation, one request:** every synthetic Resume button
  activation must make at most one HTTP request and exactly one after deadline
  capability preflight succeeds. Missing or invalid `AbortController` is the
  sole zero-request exception. Fetch rejection, timeout, a response without the
  handler marker, marked non-JSON, and marked invalid JSON must make no
  automatic replay, delay, or retry.
- **RDM-209 Fixed handler marker:** every synthetic Resume handler response,
  including validation and failure status responses, must carry exactly
  `X-Transition-Ops-Resume-Handler: 1` through the shared header object.
- **RDM-210 Closed outcomes:** executable transport fixtures must produce only
  `handler_json`, `fetch_rejected`, `non_handler_response`,
  `handler_non_json`, `handler_json_parse`, or `client_timeout`, and each
  boundary must select its exact outcome.
- **RDM-211 Existing JSON behavior:** marked valid JSON must preserve the
  existing `ok` status and parsed payload for both success and failure HTTP
  responses so current app handling and member-safe copy remain unchanged.
- **RDM-212 Unmarked-body embargo:** a response without the exact handler
  marker must classify `non_handler_response` without reading or parsing its
  body. A marked non-JSON response must likewise leave its body unread.
- **RDM-213 Diagnostic shape:** every outcome must expose exactly fixed `path`,
  integer-or-null `httpStatus`, nonnegative integer `elapsedMs`, integer
  `requestAttemptCount`, integer `handlerResponseCount`, and closed `outcome`.
  Request attempts must equal 1 after fetch invocation and 0 only on the
  pre-fetch capability failure. Handler responses must equal 0 or 1 from the
  fixed marker and must not be described as total function invocations.
- **RDM-214 Content and lifetime boundary:** synthetic sentinels for raw body,
  header value, error, stack, URL/origin, cookie, secret, prompt, response
  content, resume, identity, IP, provider, model, and stage must enter neither
  the diagnostic nor console, storage, analytics, a later request, response
  body, member-facing copy, or download. The next request replaces the prior
  memory-only diagnostic.
- **RDM-215 Stub-only execution:** all transport cases must execute against
  synthetic fetch and handler-response stubs with zero provider calls, zero
  hosted function calls, and no real member data.
- **RDM-216 Unchanged operational boundary:** Resume models, provider calls,
  stage order, zero provider retries, facts/repair 3500, civilian 2200, federal
  1900, audit 4000, request bounds, shared budget guard, `store: false`,
  grounding, audit, export, privacy, logging, persistence, analytics, usage
  limits, public response bodies, and member-safe copy remain unchanged.
- **RDM-217 One terminal deadline:** the transport source must contain exactly
  one literal 35000 deadline, one `AbortController` construction, one deadline
  timer, one timer-clear site, and the controller signal on the sole fetch.
- **RDM-218 First result wins:** one request-local settlement guard must allow
  only the first terminal path to publish a result and diagnostic. Every first
  terminal path clears the timer exactly once; late fetch or body completion is
  inert.
- **RDM-219 Capability failure:** missing, non-callable, non-constructible, or
  malformed `AbortController` must select `fetch_rejected` before timer, fetch,
  function, budget guard, or provider activity, with request and handler counts
  both 0.
- **RDM-220 Timeout precedence:** deadline expiration must abort exactly once
  and select `client_timeout` before any resulting abort rejection can select
  `fetch_rejected` or `handler_json_parse`.
- **RDM-221 Timeout boundary:** a pre-header timeout must expose null status and
  handler count 0. A post-marker JSON-body timeout must expose its captured
  integer status and handler count 1. Add no seventh diagnostic field.
- **RDM-222 Required matrix:** executable synthetic cases must cover normal
  marked JSON, pre-header timeout, post-marker JSON timeout, ordinary fetch
  rejection, marked JSON-parse failure, and missing `AbortController`, with the
  exact outcomes, statuses, request counts, and handler counts required above.
- **RDM-223 Cleanup and late completion:** handler JSON failure, non-handler,
  marked non-JSON, and every RDM-222 terminal case must verify timer cleanup.
  Timeout fixtures must also prove late resolution or rejection cannot replace
  the frozen diagnostic.
- **RDM-224 Validation and scope:** run all five local gates and real-artifact
  4N. Scope is exactly the five Commander-authorized packet files; no hosted
  function, model, provider, deploy, merge, or production action is authorized.
- **RDM-X1 Validation seam:** run `validation-gate`; this skill's semantic PASS
  does not replace structural validation.
- **RDM-X2 Deployment seam:** run `deploy-discipline` for app changes and keep
  private-clone isolation; no production modification, merge, or push.
- **RDM-X3 Privacy-claim seam:** compare every user-facing privacy statement to
  observed code paths. Any unsupported `never stored` or `never logged` claim
  must FAIL even when generation quality passes.

## REGISTRATION

Keep registry item #6 PENDING at version 0.21 until all synthetic application
cases execute and live-clone evidence, including actual DOCX rendering in a
Word-compatible renderer, passes. RDM-199 through RDM-207 governance calibration
executed 9/9 PASS on 2026-08-31; no application, provider, hosted, or Word
execution is claimed by that result. RDM-208 through RDM-224 require executable
local transport stubs plus the prescribed repository and artifact gates; those
results do not substitute for live-clone or Word-compatible-renderer evidence.
After successful application execution and live evidence, force-mod proposes
the smallest evidence-supported revision and Commander rules on promotion to
CODIFIED 1.0.
