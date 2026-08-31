---
name: erg-client-plugin-governance
description: Govern design of VBS or Transition OPS employer-sponsored ERG deployments and client-plugin proposals. Use before employer sponsorship, an ERG deployment, embed, white-label or client configuration, SSO, tenant data, sponsor reporting, pricing, a pilot, an SLA, or offboarding; this skill authorizes design governance only, never product code or external action.
metadata:
  version: "1.0"
  status: CODIFIED
  owner: force-mod
  validated: "2026-08-31"
---

# ERG CLIENT PLUGIN GOVERNANCE

Use this skill before designing or describing an employer-sponsored VBS or
Transition OPS capability for a company employee resource group (ERG), business
resource group, military-affiliated workforce program, or client tenant.

"Plugin" is not a technical fact. It can mean a link, content pack, branded
wrapper, installed tenant app, identity integration, or full ERG operating
system. Classify the delivery model before assuming a platform, infrastructure,
data flow, contract, or price.

The objective is employer-funded member utility that preserves free, ad-free
public access and prevents employer access to member activity. This skill does
not certify existing privacy or data-practice claims. It produces a governed
design packet and authorizes no account, code, outreach, contract, spend,
integration, collection, deployment, merge, push, or production change.

## HARD RED LINES

- Employers, ERG leaders, executive sponsors, managers, HR, recruiters, and
  client administrators never receive or gain the ability to infer an
  individual's transition plan, resume, AI prompt, benefits activity, or
  readiness status.
- Do not sell data, sell leads, show ads, create commercial lead funnels, or
  make member data the consideration for employer funding.
- Public member access remains free. A client may fund configuration, support,
  training, or client-specific content, but may not gate the public member
  utility behind employment, sponsorship, payment, or data surrender.
- No new account, SSO, HRIS connection, linked analytics, storage, telemetry,
  integration, API use, infrastructure, spend, deployment, outreach, contract,
  or product code without a separate, explicit Commander approval covering
  that action.
- Client-authored copy cannot override, weaken, or silently replace verified
  federal policy. A conflict is displayed as a conflict and escalated; it is
  never resolved by client preference.
- Do not publish or imply retention, ROI, productivity, hiring, readiness, or
  member-outcome claims without complete, attributable evidence.
- Use synthetic profiles and synthetic client configurations during design and
  local testing. Never use a real member's resume, plan, prompt, contact data,
  benefits activity, identity, or transition history.

These red lines remain binding inside aggregated dashboards, exports, support
workflows, logs, and administrator tools. Calling data anonymous or aggregated
does not clear collection, linkage, small-group inference, or approval gates.

## INDEPENDENT BLOCKING AUTHORITY

This skill coordinates seams; it does not absorb or clear them:

- `member-return-benchmarking` governs evidence for recurring member utility,
  comparison claims, and privacy-compatible return mechanisms.
- `policy-verification` establishes whether benefits or policy content is true.
- `member-impact` assesses the usefulness of a CONFIRMED policy finding.
- `resource-vetting` governs the legitimacy of a proposed partner or resource.
  While that skill remains unavailable or pending, its seam stays open; do not
  infer a pass.
- `brand-voice` governs outward-facing VBS and Transition OPS language.
- `resume-drafter-maintenance` retains authority over every Resume Drafter
  input, output, grounding, privacy, model, cap, cost, and export control.
- `validation-gate` governs any later repository or app change.
- `deploy-discipline` governs any later handoff, preview, merge, push, and
  production action.

Every named owner may block its own subject. Approval or a favorable verdict in
this skill cannot substitute for another skill's evidence.

## PARTICIPANTS AND JOBS

Define each participant before selecting features:

1. Member populations: transitioning service members, veterans, Guard or
   Reserve members, military spouses or family, and allies. State who is in and
   out of the design; do not treat them as one interchangeable population.
2. Member job: the concrete task the member can complete more safely or easily.
3. Buyer and budget owner: who pays and which organizational result they seek.
4. Executive sponsor: what they approve and what they are not allowed to see.
5. ERG leader or administrator: what they configure, maintain, and escalate.
6. HR, legal, IT, security, accessibility, and procurement reviewers.
7. VBS operator and content owner: support, verification, maintenance, and
   incident responsibilities.
8. Vendors or subprocessors, if any. Do not invent them or assume they are
   approved.

Keep employer program administration separate from member-owned transition
work. ERG membership, employment status, or sponsorship never creates a right
to inspect member activity.

## DELIVERY-MODEL CLASSIFICATION — CLOSED SET

Assign exactly one primary class before design. If the request mixes classes,
classify the highest-data or highest-authority component and list the lower
classes as alternatives. Do not create a sixth meaning for "plugin."

### `DATA-FREE LINK / CONTENT PACK`

A public link, downloadable or intranet-posted content pack, facilitator guide,
or approved resource set with no account, embed, member identifier, member
storage, client tenant logic, or behavioral reporting.

### `CO-BRANDED STATIC WRAPPER`

A client-configured static page or embed that may display approved branding,
ERG contacts, and client-authored resources while collecting no member identity
or behavior. Client configuration, content authority, framing permissions,
cache behavior, domain controls, and cross-client separation still require
design evidence.

### `NATIVE TENANT APP`

An installed app or package inside a client platform such as an intranet,
collaboration suite, or employee portal. Installation, manifests, permissions,
tenant administration, platform policy, support, security review, and release
ownership are part of the model even when member SSO is not used. Naming a
platform does not authorize building for it.

### `IDENTITY / DATA INTEGRATION`

Any account, SSO, HRIS or directory connection, API exchange, persistent member
profile, linked visit, behavioral analytics, sponsor dashboard, or transfer of
member or employee data. Data minimization does not move it into a lower class.

### `FULL ERG SYSTEM-OF-RECORD`

A product that owns ERG membership, chapters, events, budgets, cases, mentoring
records, communications, or workforce analytics. This is a separate product
and operating model, not an implied extension of Transition OPS.

## DESIGN VERDICT — CLOSED SET

After classification, assign exactly one:

- `DESIGN ELIGIBLE`: the design can be developed inside the current written
  authorization and every red line is satisfied. This is not implementation
  approval.
- `COMMANDER GATE`: one or more named decisions, reviews, or authorizations must
  clear before design can advance to the affected layer.
- `UNRESOLVED`: the request is too vague to classify or a material fact is
  missing. Present options and ask; never make an infrastructure assumption.
- `OUT OF SCOPE`: the request is a different product or business capability
  requiring an explicit Commander product decision.
- `REJECT`: the proposal violates a hard red line or depends on a claim that
  cannot be supported.

Classification does not pre-decide a vendor or client platform. A data-free
link and a co-branded static wrapper may be `DESIGN ELIGIBLE` when their facts
support it. Native tenant apps and identity/data integrations require their
separate Commander gates. A full ERG system-of-record is `OUT OF SCOPE` unless
Dean explicitly opens that product decision. A forbidden employer view of
member activity is `REJECT` in every class.

## FIELD-LEVEL DATA AND ACCESS MATRIX

Produce the matrix even when the proposed design claims to collect no member
data. A no-data design records `NONE` for member fields and identifies how that
claim will be verified.

For every field, event, document, configuration value, log, report, and derived
value record:

1. Field or event name and data subject.
2. Purpose and necessity.
3. Source and collection point.
4. Classification: public, client-authored, VBS internal, confidential,
   personal, sensitive, credential, or derived.
5. Transmission destination and protocol boundary.
6. Storage location, environment, tenant, encryption responsibility, and
   backup behavior.
7. Every reader, writer, exporter, and administrator, with authorization basis.
8. Retention, deletion, export, correction, and legal-hold behavior.
9. Whether it enters analytics, logs, support, AI prompts, or sponsor reports.
10. Notice or consent basis and the exact approval state.

Derived readiness, risk, engagement, completion, or eligibility values count as
member data even when the source fields are discarded. Aggregate reporting is
not presumed safe: document denominator, grouping, suppression, linkage, and
re-identification risk. Do not invent a minimum group size. Under the current
authorization, new member analytics and sponsor reporting remain gated.

## CONTENT AUTHORITY SEPARATION

Keep four lanes visibly and operationally separate:

1. **Verified public benefits and policy.** Route truth through
   `policy-verification`, then route CONFIRMED findings through `member-impact`.
   Record source, jurisdiction, population, effective date, verification date,
   expiration, and owner.
2. **Client-authored internal content.** Label it as client-supplied and
   client-specific. Record the client approver, intended workforce, effective
   date, expiration or review date, and escalation contact. It may explain an
   employer program; it may not masquerade as government policy.
3. **VBS or Transition OPS guidance and product copy.** Record its evidence and
   owner, preserve scope, and route outward language through `brand-voice`.
4. **Third-party resources.** Route legitimacy through `resource-vetting` and
   retain the result and review date. An open vetting seam blocks endorsement.

Never let a client CMS field overwrite globally verified policy. When client
and verified content conflict, preserve both source identities, withhold the
conflicting instruction, and escalate to the named owners.

## TENANT AND CONFIGURATION ISOLATION

For any client-specific surface, define and test:

- Tenant and configuration identifiers, namespaces, domain allowlists, and
  ownership.
- Which configuration is public and which requires secrets; never place a
  secret in client-side configuration.
- Separation of client branding, links, contacts, policy, assets, caches,
  support records, and deployment targets.
- Who may publish, approve, roll back, expire, and remove each client value.
- Rejection of executable client-supplied HTML, script, redirects, or other
  content that can cross the trust boundary.
- Negative tests proving Client A cannot receive Client B's configuration,
  content, assets, reports, credentials, or cached response.
- Environment separation, least privilege, key rotation, and incident owner
  when the chosen model actually introduces credentials or infrastructure.

A failed or untested cross-client isolation control blocks a pilot. A design
with no tenant data must state that fact; it cannot use the phrase "single
tenant" as a substitute for evidence.

## REQUIRED REVIEW QUESTION LOG

Record each question as `ANSWERED`, `OPEN`, `NOT APPLICABLE`, or `BLOCKING`,
with owner and evidence. Do not claim legal, security, privacy, accessibility,
or procurement compliance from the design alone.

### Privacy

- What member, employee, client, administrator, and operational data exists?
- Can the service function with no member identity and no linked activity?
- What notices, choices, correction, deletion, retention, and incident duties
  apply to the selected model?
- Which vendors or subprocessors receive data, and under what authorization?

### Security

- What are the trust boundaries, abuse cases, secrets, permissions, logs,
  dependencies, update owners, backup controls, and incident procedures?
- How will tenant separation, least privilege, secure configuration, and
  recovery be independently verified?

### Accessibility

- What standard and conformance target applies, including keyboard, screen
  reader, focus, contrast, zoom, mobile, motion, document, and authentication
  behavior?
- What executed evidence, remediation owner, and client accessibility artifact
  will be required? Do not promise conformance before testing.

### Legal and policy

- Which employment, military-service, anti-discrimination, records, privacy,
  accessibility, benefits, and professional-advice issues require qualified
  review for this client and jurisdiction?
- Does the design influence an employment decision or appear to provide legal,
  medical, financial, or benefits eligibility advice? If yes, stop at the
  relevant review gate.

### Procurement, support, and SLA

- What terms, privacy documents, security evidence, insurance, accessibility
  evidence, data agreement, subprocessor list, support channel, uptime basis,
  response target, maintenance window, escalation path, and exit assistance
  will the buyer request?
- Which obligations can VBS actually operate and evidence? Unpriced or unowned
  obligations remain open; do not convert them into promises.

## BUSINESS MODEL AND PRICING EVIDENCE

Define the buyer problem separately from the member job. An employer may fund
client configuration, implementation support, training, content maintenance,
security or procurement work, and support while the public member experience
remains free and free of ads, leads, and data sale.

For every price or package, record:

- Included deliverables and exclusions.
- One-time and recurring labor by role.
- Hosting, platform, API, model, security, legal, accessibility, support,
  insurance, procurement, maintenance, and contingency assumptions.
- Usage driver, volume assumption, cost source, date, confidence, and owner.
- Margin or subsidy assumption and the condition that would change it.
- Comparable vendor evidence with attribution and material limitations.

Competitor list prices, testimonials, awards, and vendor case studies do not
prove willingness to pay, ROI, retention, or VBS cost-to-serve. Route product
performance comparisons through `member-return-benchmarking`. Do not send a
price, proposal, or claim externally without separate Commander authority and
the applicable outward-content review.

## PILOT, MEASUREMENT, AND SPONSOR REPORTING

The default artifact is a pilot design, not a live pilot. State the member job,
client problem, selected delivery class, participant boundaries, duration,
support owner, stop conditions, rollback, costs, and decisions the pilot is
meant to inform.

Inside the current no-data authorization, validation may use synthetic
scenarios and non-member operational evidence such as:

- Content-authority and expiration completeness.
- Synthetic task completion and error recovery.
- Accessibility, security, configuration, and cross-client test results.
- Support rehearsal, response ownership, implementation effort, and evidenced
  cost-to-serve.
- Client reviewer acceptance of the static configuration and governance packet.

Member surveys, attendance capture, accounts, identifiers, linked visits,
behavioral events, individual completion, retention measurement, and sponsor
dashboards are new collection or analytics and require separate Commander
approval before design or use. Sponsor reporting defaults to governance and
service evidence, not member behavior.

Before stating ROI, retention, productivity, hiring, or outcome impact, require:
metric formula, baseline, comparator, cohort and denominator, window, sample,
data source, collection method, attribution method, confounders, limitations,
owner, and independent support. Missing a material element withholds the claim.
Do not convert a pilot output, participation count, anecdote, or satisfaction
statement into a causal outcome.

## OFFBOARDING — REQUIRED BEFORE PILOT READINESS

Define offboarding even for a no-data design:

1. Trigger, effective date, decision owner, and notice responsibilities.
2. Revocation of client, VBS, vendor, administrator, domain, package, token, and
   support access.
3. Removal of client branding, contacts, links, configuration, assets, embeds,
   packages, and custom domains without interrupting public member access.
4. Governed export, return, deletion, backup expiration, and legal-hold handling
   for every client field in the data matrix. If no member data exists, say so.
5. Preservation or removal rules for verified global content and client-owned
   content.
6. Final isolation, deletion, billing, support, and public-access verification,
   with unresolved exceptions recorded rather than silently waived.

No SLA or contract term may promise deletion, export, uptime, recovery, or
support behavior that has not been designed, owned, costed, and approved.

## PROCEDURE

1. State the member job, client problem, participants, buyer, sponsor, and
   administrator boundaries.
2. Classify the proposal using the closed delivery set and assign one design
   verdict. If unresolved, present options and stop before an assumption.
3. Build the field-level data and access matrix, including explicit `NONE`
   entries for a no-member-data design.
4. Apply every hard red line to features, reports, support, logs, exports, and
   derived data.
5. Separate content authority, verification, client approval, expiration, and
   conflict handling.
6. Define tenant and configuration isolation and negative test requirements.
7. Complete the privacy, security, accessibility, legal, procurement, support,
   and SLA question log.
8. Build the evidence-based cost and business-model assumptions without
   pricing externally.
9. Design the pilot, synthetic validation, measurement limits, sponsor report,
   stop conditions, and risk register.
10. Define offboarding and public-member continuity.
11. Build a RACI and route every open subject to its independent skill or human
    owner.
12. Present the exact Commander decisions needed and stop. Product work and
    external action require new authorization.

## OUTPUT

Return a concise governance packet containing:

1. Member job, client problem, populations, buyer, sponsor, and administrators.
2. Delivery-model classification and design verdict.
3. Options matrix covering the plausible delivery classes without preselecting
   a client platform.
4. Field-level data and access matrix.
5. Content-authority map and conflict procedure.
6. Tenant/configuration isolation design and negative tests.
7. Privacy, security, accessibility, legal, procurement, support, and SLA
   question log.
8. Business-model evidence, cost model, and pricing assumptions.
9. Pilot design, allowed measures, prohibited measures, sponsor-report design,
   stop conditions, and rollback.
10. RACI, risk register, offboarding plan, independent skill seams, and exact
    open Commander decisions.

Use `UNKNOWN`, `UNVERIFIED`, or `NOT APPLICABLE` rather than smoothing an open
field. Design approval is never implementation, pilot, client, or deploy
approval.

## REGRESSION CONTRACT

Detailed realistic inputs, expected decisions, executed actual decisions, and
results are in [calibration-cases.md](calibration-cases.md).

- EPG-1: a data-free public link or content pack remains eligible for design.
- EPG-2: SSO plus manager access to individual completion is rejected.
- EPG-3: client copy cannot override verified federal policy.
- EPG-4: sponsor analytics cannot silently introduce linked member tracking.
- EPG-5: resumes and plans cannot flow to HR, recruiters, or ERG leaders.
- EPG-6: unsupported veteran-retention or ROI claims are withheld.
- EPG-7: employer funding may preserve free member access without ads, leads,
  or data sale.
- EPG-8: cross-tenant configuration or data leakage blocks a pilot.
- EPG-9: vague "plugin" language cannot become an infrastructure assumption.
- EPG-10: offboarding covers access revocation, configuration removal, and
  governed deletion or export.
- EPG-11: the closed classifier distinguishes all five delivery models.
- EPG-X1: all named seams retain independent blocking authority.
