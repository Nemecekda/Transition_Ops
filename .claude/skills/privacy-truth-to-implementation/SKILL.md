---
name: privacy-truth-to-implementation
description: Govern Transition OPS and VBS claims about their own privacy, data handling, storage, logging, retention, analytics, AI, and member controls. Use before drafting, approving, or reusing a self-claim such as local-only, anonymous, no data, not stored, never logged, or delete all; this skill evaluates evidence and designs truthful remediation but authorizes no product or external action.
metadata:
  version: "0.2"
  status: CODIFIED
  owner: force-mod
  validated: "2026-08-31"
---

# PRIVACY TRUTH TO IMPLEMENTATION

Use this skill when Transition OPS or VBS describes what its own app, service,
client package, providers, or operators collect, transmit, store, log, retain,
use, disclose, delete, or allow a member to control. It governs the seam from
an outward claim to the implementation and evidence needed to make that claim
true.

This is evidence and design governance, not legal advice or compliance
certification. It authorizes no app copy, code, account inspection, provider
setting, contract, outreach, data collection, spend, staging, commit, push,
merge, deployment, or production change. Each such action needs its own scope
and approval.

## EVIDENCE CLASSES

Classify every material fact. Do not let one class stand in for another.

- `CODE-OBSERVED`: directly established in the repository.
- `RUNTIME-OBSERVED`: demonstrated in controlled network, storage, browser,
  function, or provider-path testing with synthetic data.
- `PROVIDER-DOCUMENTED`: supported by current first-party provider material.
- `ACCOUNT-VERIFIED`: demonstrated in the actual authorized account or project
  by a named owner, with date and scope.
- `UNVERIFIED`: not established at the layer the claim requires.

Provider documentation proves general product behavior or available controls;
it does not prove the Transition OPS account uses them. Account settings do not
prove the running app invokes them correctly. A code scan does not prove that a
host, SDK, subprocessor, browser, or provider creates no record.

## VERDICTS AND DISPOSITIONS

Assign exactly one claim verdict:

- `SUPPORTED`: every material part is supported at every applicable layer.
- `PARTIALLY SUPPORTED`: a narrower statement is supported, but the full claim
  is not.
- `CONTRADICTED`: observed behavior conflicts with the claim.
- `UNVERIFIED`: material evidence is missing.

Then assign one disposition: `KEEP`, `NARROW`, `REPLACE`, `REMOVE`, or
`HOLD FOR EVIDENCE`. A favorable design verdict is not publication or
implementation authority.

## UNIVERSAL-LANGUAGE BURDEN

Treat `never`, `nothing`, `anonymous`, `only`, `no data`, `not stored`, `not
logged`, `not retained`, `delete all`, `we cannot see`, and equivalent language
as universal claims. Release one only when evidence covers every applicable:

1. field, event, derived value, identifier, and metadata item;
2. normal, error, retry, offline, cache, iframe, export, support, and deletion
   path;
3. browser, app, function, log, analytics, AI, email, push, form, storage,
   subprocessor, and administrator boundary; and
4. code, runtime, provider-documentation, and account-setting layer.

One unknown path defeats a universal claim. Narrow language to the proven
boundary or withhold it. The absence of app-authored logging is not evidence
that platform or provider logs do not exist. `store:false` proves only that the
request set that option; it is not Zero Data Retention, no logging, or no
provider record. A provider-approved ZDR claim also requires account scope,
endpoint coverage, runtime use, and drift controls.

## PROCESSING AND CLAIM MAP

For each claim, inventory all implicated fields and flows, including optional,
derived, aggregated, hashed, pseudonymous, and operational data. Local storage,
Cache Storage, service-worker state, generated files, logs, presence flags,
counts, and model-derived topics are data even when no name is attached.

Record for each item:

- source, trigger, purpose, necessity, and data subject;
- destination, processor, subprocessor, and protocol boundary;
- local, server, provider, log, backup, cache, analytics, AI, support, export,
  and sponsor-report handling;
- readers, writers, administrators, retention, deletion, correction, and drift
  owner;
- notice, choice, withdrawal, clear, unsubscribe, or request control; and
- evidence class, artifact, date, owner, limitation, and next review trigger.

Optional submission is still collection. Aggregation does not erase source
processing or small-group inference. Hashing does not make a stable identifier
anonymous. Do not call data anonymous without a documented linkage and
re-identification assessment covering provider and account behavior.

## USER-CONTROL TRUTH

- A choice must occur before the collection it purports to control. A browser
  permission prompt does not automatically govern SDK initialization, tags,
  analytics, or provider records.
- A decline and later withdrawal must be tested for network requests, local
  state, provider state, and future behavior. A visual toggle alone is not
  evidence.
- A local clear control may promise only the exact local keys, caches, service
  worker state, and in-memory values it demonstrably removes. It must not imply
  email unsubscribe, push deletion, provider deletion, backup deletion, or
  another-device clearing.
- Feature-specific notices must name the material fields, purposes,
  destinations, storage/retention basis, and available controls. Calling a
  feature optional does not cure an incomplete notice.
- A no-data or no-employer-data package claim is bounded to the proved package
  flow. It cannot silently certify the public app, an employer-managed device,
  network monitoring, destination providers, or client-added link tracking.

## SERVICE-WORKER PRIVACY COHORTS

A service-worker migration creates four evidence states that must be recorded
and tested separately:

- `NEW`: no prior merged root-worker registration.
- `MIGRATED`: the OneSignal-free PWA worker controls the app and the prior
  root registration no longer controls it.
- `LEGACY`: a previously registered root worker remains under an explicitly
  approved, time-bounded migration exception.
- `RETIRED`: the sunset has elapsed and evidence proves the legacy worker no
  longer controls any tested browser or receives new registrations.

Under SW-PRIVACY-01, new and migrated browsers must make zero OneSignal requests
before an informed affirmative push-data choice. The dedicated OneSignal worker
may register only after that choice and only under `/push/onesignal/`. Browser
notification permission remains a separate control.

The legacy exception permits the existing root-worker URL and OneSignal import
only for previously registered browsers through a named sunset no earlier than
one year after production cutover. A pre-choice OneSignal request and loss of
push after decline are accepted only for that cohort. They do not establish
consent, permit new legacy registrations, or expand the exception.

Do not collapse the cohorts into a universal claim. No statement equivalent to
"OneSignal makes no request before consent" may ship until the legacy worker is
retired and clean, new, migrated, decline, withdrawal, rollback, and provider
paths are validated. Before then, any supported statement must identify the
new-or-migrated cohort and tested release.

Every evidence packet using this exception must record the cutover date, legacy
URL and scope, active PWA worker, dedicated push scope, migration behavior,
sunset date, rollback boundary, owner, and retirement evidence. The ruling
authorizes none of the implementation, provider, validation, staging, commit,
push, merge, or deployment actions governed elsewhere.

## PROVIDER AND ACCOUNT UNKNOWNS

Keep provider and account facts `UNVERIFIED` until an explicitly authorized
owner records current evidence. Required evidence may include account/project
identity, administrators, enabled products, consent mode, fields/tags/events,
logs and log drains, training/data-sharing choices, retention, export,
deletion, residency, integrations, backups, incident controls, key scope, and
spend caps. Do not infer these from environment-variable names, public IDs,
marketing pages, default documentation, or an uninspected dashboard.

Account evidence must name its retrieval date, owner, exact scope, artifact,
and drift trigger. A changed setting, provider term, endpoint, SDK, deployment,
or data path places affected outward claims on `HOLD FOR EVIDENCE` until
revalidated.

## INDEPENDENT SCOPE SEAMS

This skill does not absorb or clear another owner:

- `policy-verification` decides whether benefits and policy claims about the
  outside world are true; `member-impact` then decides whether a CONFIRMED
  finding is useful.
- `brand-voice` governs final outward wording after the evidence verdict.
- `erg-client-plugin-governance` governs employer delivery models, client data
  boundaries, sponsor reporting, isolation, and offboarding.
- `member-return-benchmarking` governs evidence for return mechanisms and
  product comparisons.
- `resume-drafter-maintenance` retains all Resume Drafter grounding, privacy,
  model, cap, cost, and export controls.
- `resource-vetting` governs third-party legitimacy; an unavailable or pending
  seam stays open.
- Qualified privacy/legal reviewers decide legal duties and compliance.
- `validation-gate` governs repository implementation evidence, and
  `deploy-discipline` governs preview, handoff, merge, push, rollback, and
  production.

Every owner may block its subject. Privacy evidence cannot validate policy,
approve client access, certify legal compliance, clear code, or authorize a
release.

## PROCEDURE

1. Capture the exact claim, audience, surface, jurisdiction, feature, and
   proposed release context. Separate current-state fact from target design.
2. Build the processing and claim map across normal and adverse paths.
3. Classify each material fact by evidence layer; record contradictions and
   unknowns instead of smoothing them.
4. Apply the universal-language burden and user-control tests.
5. Assign the claim verdict and disposition. Draft a narrower replacement only
   inside the supported boundary and send final wording to `brand-voice`.
6. Identify the implementation, runtime, provider-account, privacy/legal,
   client, validation, and deployment seams that remain independently open.
7. Produce the exact next Commander decisions. Stop before any action not
   covered by the current written authority.

## REQUIRED OUTPUT

Return a concise evidence packet containing:

1. scope, authority, exact claim inventory, and audiences;
2. field/data/provider/access map;
3. evidence-layer matrix with dated artifacts, owners, limits, and unknowns;
4. verdict and disposition for each claim;
5. user-control, worker-cohort, sunset, and clear/delete boundary;
6. contradiction, drift, and open-evidence register;
7. target design options and acceptance tests using synthetic data;
8. independent skill/human seams; and
9. exact Commander approvals still required.

A claim-release row must contain the exact wording, every material field and
destination, code reference, runtime test and result, provider documentation,
account evidence, retention/access/deletion basis, user control, required
privacy/legal disposition, validation owner/date, and next review trigger. A
blank required cell makes the claim `UNVERIFIED` and withholds it.

## COMMANDER GATES

This skill is in the COMMANDER lane. Explicit design authority permits only
the named evidence packet or synthetic fixture. Separate written authority is
required for account inspection, final member/client copy, app or function
code, provider configuration, a new data flow or control, legal review,
client-specific work, contracts, outreach, spend, validation against a hosted
clone, staging, commit, push, merge, deployment, or production publication.

## REGRESSION CONTRACT

Detailed synthetic inputs, expected decisions, executed actual decisions, and
results are in [calibration-cases.md](calibration-cases.md).

- PTI-1 through PTI-16 cover first-visit collection, analytics choice and
  withdrawal, local core data, push, email, feedback, AI, jobs, derived gap
  data, clear controls, and iframe behavior.
- PTI-SW1 through PTI-SW4 cover new, migrated, legacy, and retired
  service-worker cohorts under SW-PRIVACY-01.
- PTI-X1 prohibits real classified or highly sensitive test data.
- PTI-X2 prevents `store:false` from being treated as ZDR.
- PTI-S1 and PTI-S2 prove the policy/voice and ERG/validation/deployment seams
  retain independent authority.

Passing this synthetic suite validates governance decisions only. It does not
validate the current app, any provider account, legal compliance, or production
behavior.
