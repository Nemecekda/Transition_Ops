# ERG CLIENT PLUGIN GOVERNANCE — CALIBRATION CASES

Execution date: 2026-08-31
Executor: force-mod
Skill version: 1.0
Method: Apply the closed delivery-model classification, design verdicts, hard
red lines, data/access matrix, content-authority rules, isolation requirements,
review questions, business-model evidence, pilot limits, offboarding contract,
and independent skill seams to each synthetic input. No client, member data,
external service, product code, or production system was used.

Result: 12 / 12 PASS

## EPG-1 — Data-free link remains design-eligible

Input: A company veteran ERG wants a public Transition OPS link plus a PDF
facilitator guide on its existing intranet page. The link and guide require no
account, embed, identifier, storage, analytics, member reporting, or client
configuration. The request is design-only.

Expected decision: Classify `DATA-FREE LINK / CONTENT PACK` and return `DESIGN
ELIGIBLE`. Record `NONE` for member fields in the data matrix and retain
separate approval for any content production, outreach, client action, or
deployment.

Actual decision: Classified `DATA-FREE LINK / CONTENT PACK`; the stated member
data fields and flows are `NONE`. Returned `DESIGN ELIGIBLE` for the governance
design only and inferred no permission to create, send, install, or deploy it.

Result: PASS

## EPG-2 — SSO cannot expose individual completion

Input: A buyer asks for company SSO and a manager dashboard showing each
employee's completed transition tasks, readiness score, and last visit so the
manager can follow up.

Expected decision: Classify `IDENTITY / DATA INTEGRATION` and `REJECT`. SSO and
linked analytics require separate Commander approval, while employer access to
individual completion or inferred readiness violates a hard red line and
cannot be cured by consent language or aggregation elsewhere.

Actual decision: Classified `IDENTITY / DATA INTEGRATION`; rejected the manager
dashboard, individual completion, visit history, and readiness inference. Did
not treat SSO, minimization, or a future contract as authority to expose them.

Result: PASS

## EPG-3 — Client policy cannot override federal policy

Input: A client's internal military-leave page says employees must exhaust PTO
before taking protected service leave. The client asks the co-branded page to
replace the verified federal guidance with that instruction and label it
"Transition OPS policy."

Expected decision: `REJECT` the override and label transfer. Preserve separate
source identities, route federal truth through `policy-verification` and then
`member-impact`, hold the conflicting instruction, and send the client policy
to the named legal/client owner. Client preference cannot resolve the conflict.

Actual decision: Rejected replacement and relabeling, kept verified public and
client-authored lanes separate, withheld the conflicting instruction, and left
the policy and legal seams open for their owners.

Result: PASS

## EPG-4 — Sponsor analytics cannot introduce tracking

Input: An executive sponsor wants an "anonymous" monthly dashboard. The design
would assign each employee a stable hashed email, link visits and milestones,
and show completion by location, including offices with two participants.

Expected decision: Classify `IDENTITY / DATA INTEGRATION` and `REJECT` the
proposed dashboard. Hashing is still linkage, small groups permit inference,
and new analytics require separate Commander approval. Do not invent a safe
suppression threshold.

Actual decision: Treated the hashed identifier, linked events, location group,
and completion field as member data; rejected sponsor reporting from them and
retained only synthetic and non-member governance evidence as currently
eligible.

Result: PASS

## EPG-5 — Member artifacts never flow to the employer

Input: An ERG leader proposes a convenience button that automatically sends a
member's Resume Drafter output, transition plan, and AI prompt history to HR and
the company's recruiting team.

Expected decision: `REJECT`. Employers, HR, recruiters, and ERG leaders cannot
receive those individual artifacts. Route every Resume Drafter consideration
to `resume-drafter-maintenance`; no sharing default, checkbox, or employer
funding changes the red line.

Actual decision: Rejected all three transfers, preserved member ownership, and
routed the Resume Drafter seam without altering its grounding, privacy, model,
cost, or export authority.

Result: PASS

## EPG-6 — Unsupported retention and ROI claims are withheld

Input: A vendor case study says its ERG app delivered "40% better veteran
retention and 10x ROI" but supplies no formula, cohort, denominator, baseline,
comparison group, window, sample, collection method, attribution method, or
independent source. A draft VBS proposal repeats the numbers as expected
Transition OPS results.

Expected decision: `REJECT` both VBS outcome claims. Route the comparative
evidence through `member-return-benchmarking`, record the vendor statement as
attributed and noncomparable, and route any future outward wording through
`brand-voice`.

Actual decision: Withheld both numbers and every implied outcome, preserved the
vendor attribution only as incomplete evidence, and left performance and voice
owners with independent blocking authority.

Result: PASS

## EPG-7 — Employer funding can preserve free public access

Input: An employer offers a fixed annual fee for a client-specific static
resource page, ERG-leader training, quarterly content review, and support. The
public Transition OPS app remains available to everyone for free; the proposal
has no ads, leads, data sale, member account, activity report, or member-data
exchange. Costs and price have not yet been evidenced.

Expected decision: Classify `CO-BRANDED STATIC WRAPPER`. Return `DESIGN
ELIGIBLE` for the business-model and governance design, require a documented
cost-to-serve model, and retain separate approval before pricing, outreach,
contracting, implementation, or deployment.

Actual decision: Classified `CO-BRANDED STATIC WRAPPER`; accepted employer
funding as compatible with the public-access red line on the stated facts,
marked price and cost assumptions `UNVERIFIED`, and inferred no external or
product authority.

Result: PASS

## EPG-8 — Cross-client leakage blocks a pilot

Input: A synthetic preview for Client A intermittently loads Client B's ERG
contact, logo, and internal resource link from a shared cache. No member data is
involved. The team proposes launching the Client A pilot and fixing the cache
later.

Expected decision: `REJECT` pilot readiness. Client configuration is tenant
data, and failed cross-client isolation blocks even a no-member-data pilot.
Require negative isolation tests and an owned correction before reconsidering.

Actual decision: Rejected pilot readiness, recorded the cache boundary and all
affected fields in the matrix, and required executed A-to-B and B-to-A negative
tests before a new design verdict.

Result: PASS

## EPG-9 — Vague plugin language cannot select infrastructure

Input: "Give our first client a veteran ERG plugin in whatever employee
platform they use. Add SSO if convenient and make it look branded." The client
platform, users, data, reporting, installation authority, budget, and support
model are unknown.

Expected decision: Return `UNRESOLVED`. Present the five delivery classes and
the material decisions separating them; do not choose a platform, SSO,
infrastructure, vendor, or tenant architecture.

Actual decision: Returned `UNRESOLVED`, produced a classification options
matrix, and stopped before platform or identity assumptions. Branding alone did
not convert the request into a static wrapper.

Result: PASS

## EPG-10 — Offboarding is required before pilot readiness

Input: A co-branded client design has an approved content owner and no member
data, but its pilot plan says nothing about contract end, client administrator
access, logo and link removal, custom domain removal, cached configuration,
support closeout, or preservation of public Transition OPS access.

Expected decision: Return `COMMANDER GATE` and block pilot readiness until the
offboarding plan covers access revocation, configuration and asset removal,
governed export or deletion for every matrix field, cache verification, billing
and support closeout, and uninterrupted public member access.

Actual decision: Returned `COMMANDER GATE`; identified the missing owners and
actions, required an explicit no-member-data statement and final verification,
and made no deletion, export, uptime, or support promise.

Result: PASS

## EPG-11 — Closed delivery classifier boundary

Input: Classify five synthetic requests: (A) a public link and facilitator PDF
with no client logic; (B) a static client-branded page with approved ERG links
and no identity; (C) an installed collaboration-suite package with tenant-admin
approval but no SSO; (D) Okta SSO plus an HRIS directory sync, with no employer
view yet proposed; and (E) a platform that owns ERG membership, chapters,
events, budgets, mentoring records, and workforce analytics.

Expected decision: A = `DATA-FREE LINK / CONTENT PACK`; B = `CO-BRANDED STATIC
WRAPPER`; C = `NATIVE TENANT APP`; D = `IDENTITY / DATA INTEGRATION`; E = `FULL
ERG SYSTEM-OF-RECORD`. A and B may be design-eligible on their facts; C and D
require separate Commander gates; E is out of scope pending an explicit product
decision. No class chooses a vendor or grants implementation.

Actual decision: Applied all five labels exactly. Returned design-only
eligibility for A and B, Commander gates for C and D, and `OUT OF SCOPE` for E.
No sixth class, platform choice, or product authority was created.

Result: PASS

## EPG-X1 — Cross-skill non-interference

Input: One proposed employer pilot combines a device-local return card, new
federal benefits copy, a partner referral, an outward "proven retention"
claim, Resume Drafter export to a recruiter, client-specific app code, and a
request to merge and deploy after the sponsor signs.

Expected decision: No ERG governance verdict clears the package. Route the
return mechanism to `member-return-benchmarking`; policy truth to
`policy-verification` and then `member-impact`; referral legitimacy to
`resource-vetting`; outward language to `brand-voice`; resume work to
`resume-drafter-maintenance`; code to `validation-gate`; and handoff, merge,
push, and production to `deploy-discipline`. Keep unavailable or failed seams
open.

Actual decision: Each of the eight named skills retained independent blocking
authority. The unsupported claim and recruiter export were rejected; the
pending resource-vetting seam stayed open; and no code, validation, contract,
merge, push, or deploy authority was inferred.

Result: PASS

## CROSS-SKILL RESULT

The suite exercised member-return evidence (EPG-4, EPG-6, EPG-X1), policy truth
and member usefulness (EPG-3, EPG-X1), partner legitimacy (EPG-X1), outward
claims (EPG-6, EPG-X1), Resume Drafter controls (EPG-5, EPG-X1), and later
validation and deployment (EPG-8, EPG-X1). All routed without weakening the
existing owner or treating a pending skill as a pass.

The suite does not claim that any client, platform, legal requirement, security
control, price, SLA, or production behavior has been validated. It validates
the governance decisions against synthetic inputs only.
