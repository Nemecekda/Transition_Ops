---
name: runtime-ai-spend-governance
description: Govern Transition OPS server-side OpenAI admission, aggregate monthly spend accounting, model and request limits, and content-free failure diagnostics. Use for changes to shared AI calls, pricing, the cutoff, the spend ledger, request options, model/output caps, or diagnostic origins; this skill authorizes no provider-account or deployment action.
metadata:
  version: "1.3"
  status: CODIFIED
  owner: force-mod
  validated: "2026-09-01"
---

# RUNTIME AI SPEND GOVERNANCE

This skill governs the shared server-side boundary for every Transition OPS
OpenAI request. Its purpose is to fail closed before spend, keep the accounting
record aggregate-only, and prevent one feature from bypassing controls owned by
the site as a whole.

It is a COMMANDER-lane governance skill. It authorizes no application edit,
provider or account inspection, credential or setting change, live model call,
staging, commit, push, merge, deployment, or production action.

## FIXED PHASE 1 CONTRACT

- The internal cutoff is exactly `4,000,000` micro-USD, equal to USD 4.00, per
  UTC calendar month.
- The cutoff is site-wide and aggregate. Navigator, every Resume Drafter stage,
  and any future member-facing OpenAI route share one ledger and one cutoff.
- The guard accounts only for requests that pass through it after its production
  activation. It is not a reconstruction of earlier spend or spend from another
  key, project, script, endpoint, or provider surface.
- This repository cutoff is distinct from every provider-side project or
  organization limit. It is not proof of a full-account hard cap.
- Server UTC determines the month. Client clocks, browser state, identity, IP,
  cookies, headers, and local usage counters never select or partition a bucket.

## CLOSED MODEL, PRICE, AND STAGE TABLE

Only these models and official current per-token prices are allowed. Price
units are micro-USD per token and must be represented as fixed-point integers,
never binary floating point.

| Model | Input | Cached input | Cache write | Output |
|---|---:|---:|---:|---:|
| `gpt-5.6-luna` | 0.20 | 0.02 | 0.25 | 1.20 |
| `gpt-5.6-terra` | 2.00 | 0.20 | 2.50 | 12.00 |

Implement the table in hundredths of a micro-USD per token: Luna
`20/2/25/120`; Terra `200/20/250/1200`. Round every final charge upward to a
whole micro-USD. A model, price, billing unit, or token-category change is a
STOP and Commander revalidation trigger. Missing, stale, ambiguous, or
unverified pricing denies admission with zero provider calls.

The stage registry is closed:

| Stage | Model | Maximum output tokens |
|---|---|---:|
| `navigator` | `gpt-5.6-luna` | 800 |
| `resume_facts` | `gpt-5.6-luna` | 3500 |
| `resume_fact_repair` | `gpt-5.6-terra` | 3500 |
| `resume_civilian` | `gpt-5.6-terra` | 2200 |
| `resume_federal` | `gpt-5.6-terra` | 1900 |
| `resume_audit` | `gpt-5.6-terra` | 4000 |

An unknown stage, wrong model, missing cap, or cap above the exact stage value
fails before a provider call. Luna's model ceiling is 3500 and Terra's is 4000;
the lower stage ceiling still controls.

## REQUEST BOUNDARY

- Reject a Navigator request body above `32,768` serialized UTF-8 bytes and a
  Resume request body above `65,536` serialized UTF-8 bytes before JSON parsing,
  reservation, or provider access.
- Compute the provider-request byte count from the complete serialized request,
  including instructions, input, and any response schema. Keep that count only
  in request memory. It may influence the reservation but may not enter the
  ledger, logs, analytics, response, or another request.
- The shared provider wrapper, not a caller, forces `store: false`,
  `reasoning: { effort: "none" }`, `stream: false`, `background: false`, SDK
  `maxRetries: 0`, and the approved timeout.
- Requests must contain no tools or tool choice, conversation or previous
  response link, metadata, `user`, `safety_identifier`, `prompt_cache_key`,
  file/vector-store attachment, or caller-supplied persistence option.
- The wrapper must not export or expose a raw provider client that permits a
  caller to bypass stage validation, reservation, settlement, or option
  enforcement.

## AGGREGATE LEDGER

The site has one current-month record. Its application-owned payload contains
exactly these fields:

```text
schema_version
month_utc
cutoff_micro_usd
reserved_micro_usd
settled_micro_usd
admitted_call_count
settled_call_count
price_version
halted
```

No other field is permitted. In particular, the key, payload, storage metadata,
logs, and errors contain no prompt, resume, header, ledger, trace, job posting,
target, identity, IP address, request or response ID, model input or output,
client or device ID, cookie, header, endpoint partition, stage partition,
per-user counter, or exact event timestamp.

The backing primitive must provide a shared atomic conditional update or
transaction across concurrent function instances. Process memory and ordinary
read-modify-write Blob operations are nonconforming. Compare-and-set retries are
bounded at three; exhausting them is an accounting failure and denies the call.
Provider retries remain zero and are unrelated to these ledger retries.

## ADMISSION AND SETTLEMENT

1. Build and validate the closed stage request in memory. For reservation,
   charge every possible input token conservatively at that model's cache-write
   rate and every permitted output token at its output rate. The serialized
   request byte count is the conservative upper bound for possible input tokens.
2. In one atomic operation, initialize a zeroed record when `month_utc` differs
   from the current server UTC month; reject a corrupt schema or unexpected
   field; and admit only when
   `settled_micro_usd + reserved_micro_usd + reservation <= 4,000,000`.
   Equality is allowed. On admission, add the reservation and increment the
   aggregate admitted-call count.
3. Begin the provider call only after the reservation commits. Denial, storage
   unavailability, schema error, month-rollover error, pricing error, or
   exhausted CAS retries produces zero provider calls.
4. Settle in one atomic operation. When complete authoritative usage contains a
   valid regular-input, cached-input, cache-write, and output breakdown, compute
   the actual fixed-point charge, remove the reservation, add the actual charge,
   and increment the settled-call count. Never refund from an inferred or
   partial breakdown.
5. On provider error, incomplete response, missing or malformed usage, usage
   above the reservation, or post-call settlement uncertainty, retain the full
   conservative charge. A caught failure converts the reservation to settled;
   a crash leaves it reserved. Neither path releases capacity in that month.
   Usage above reservation or an impossible ledger transition sets `halted` and
   blocks later admissions pending revalidation.
6. A settlement from the prior month must not mutate the new month. Its prior
   reservation was already retained against the month in which it was admitted.

A post-call settlement fault cannot undo the call already made; it must withhold
the model output, retain the reservation, and make no additional provider call.

## FAILURE AND PRIVACY CONTRACT

- A valid cutoff denial maps to the endpoint's content-free `budget_limit`
  response. An accounting, price, or ledger fault maps to a content-free
  `upstream_unavailable` response. Neither response exposes amounts, usage,
  identifiers, member content, or internals.
- Outside the closed diagnostic-origin marker below, do not application-log the
  request, response, usage object, ledger mutation, denial details, raw error,
  or reason category. Platform and provider handling remains a separate evidence
  question under `privacy-truth-to-implementation`.
- `store: false` is mandatory but is not Zero Data Retention and does not prove
  that platform or provider logs do not exist.
- Changing the cutoff, month definition, models, prices, stage table, request
  ceilings, options, ledger fields, atomic primitive, retry bound, rounding,
  reservation, settlement, or public failure semantics requires Commander
  approval and complete revalidation.

## CLOSED CONTENT-FREE DIAGNOSTIC-ORIGIN CONTRACT

Every execution origin that maps to an endpoint's `upstream_unavailable`
response emits exactly one server-side diagnostic marker. The phase set is
closed:

| Phase | Boundary |
|---|---|
| `prepare` | Closed-request and admission preparation |
| `blob_store_load` | Blob module, API, and store construction |
| `ledger_read` | Strong ledger read and record intake |
| `ledger_write` | Conditional ledger mutation |
| `client_init` | Provider-client initialization |
| `provider_call` | Admitted provider invocation |
| `provider_result` | Validation of the returned provider result before settlement |
| `settlement` | Non-ledger settlement processing after a provider result |

Existing subphases under `prepare`, `blob_store_load`, `ledger_read`, and
`ledger_write` remain unchanged. `client_init` has this closed subphase set:

| `client_init` subphase | Boundary |
|---|---|
| `module_load_resolution_code` | The static provider SDK load threw with exactly `MODULE_NOT_FOUND` or `ERR_MODULE_NOT_FOUND` |
| `module_load_other` | The static provider SDK load threw without an allowlisted resolution code |
| `api_shape` | Validating the loaded SDK export and constructor interface |
| `key_lookup` | Reading and validating server-side credential presence |
| `client_construct` | Constructing the provider client without invoking it |
| `guard_construct` | Constructing the shared guarded wrapper |

`provider_call`, `provider_result`, and `settlement` have no subphases. Every
`client_init` failure emits exactly one of these complete fixed literals:

- `runtime-ai-spend phase=client_init subphase=module_load_resolution_code`
- `runtime-ai-spend phase=client_init subphase=module_load_other`
- `runtime-ai-spend phase=client_init subphase=api_shape`
- `runtime-ai-spend phase=client_init subphase=key_lookup`
- `runtime-ai-spend phase=client_init subphase=client_construct`
- `runtime-ai-spend phase=client_init subphase=guard_construct`

`key_lookup` covers an accessor failure and an absent or blank credential. It
identifies only that boundary; the credential value is never logged, persisted,
returned, normalized into a marker, or used to construct a diagnostic. No
`client_init` failure may begin a provider call.

The module-load classifier preserves exactly one static `require("openai")` and
does not add `require.resolve`, dynamic `require`, dynamic `import`, or package
externalization. It reads only the caught value's `code` property. Exact string
equality with `MODULE_NOT_FOUND` or `ERR_MODULE_NOT_FOUND` selects
`module_load_resolution_code`; a missing, inaccessible, non-string, throwing,
or other value selects `module_load_other`. Neither marker may contain or pass
that code or any other caught-error property.

`module_load_resolution_code` proves only that a resolution-coded failure
escaped the static load boundary. It does not prove that the root `openai`
package was absent, identify a transitive dependency, or establish whether
`openai@7.8.0` was inlined. `module_load_other` is a residual load/evaluation
bucket; it does not prove that SDK evaluation began or that the SDK was
physically present. Neither marker is an artifact inventory or provider-state
claim.

Each marker emission is one application-log call with exactly one compile-time
string-literal argument. It contains only the fixed phase marker and, where a
closed subphase applies, its fixed subphase marker. The marker
literal and call must never log, interpolate, or pass the caught error, stack,
message, code, status, request, response, usage, ledger, secret, cookie,
identity, IP, provider identifier, model, stage, amount, URL, or timestamp.

Terminal precedence is mandatory. When handling continues after an initial
failure, do not emit that initial marker. If a later failure determines the
`upstream_unavailable` response, emit only the later terminal phase. A terminal
ledger read or write failure remains `ledger_read` or `ledger_write`, including
during settlement; `settlement` identifies only a non-ledger settlement origin.

Success and a valid internal-cutoff `budget_limit` denial emit no
diagnostic-origin marker. A
marker identifies only the application execution location; it is not an error
reason and makes no provider- or account-observability claim. A missing,
duplicate, dynamic, nonliteral, out-of-set, subphase-invalid, or prohibited-data
marker is a regression failure and force-mod STOP. For `client_init`, a missing,
unknown, duplicated, computed, concatenated, interpolated, or otherwise dynamic
subphase is also a regression failure and force-mod STOP.

## SKILL SEAMS

- `resume-drafter-maintenance` owns the Resume call graph, grounding, stage
  meaning, partial-artifact withholding, and exact five Resume caps. This skill
  owns only shared admission, accounting, and enforcement.
- Navigator remains an independent route. A Navigator test cannot clear a
  Resume path, and a Resume test cannot clear Navigator.
- `privacy-truth-to-implementation` owns claims about storage, logging,
  retention, provider behavior, and account evidence.
- `validation-gate` owns repository evidence and required commands;
  `deploy-discipline` owns production configuration, preview, rollback, and
  handoff. Each seam may block independently.

## REGRESSION CONTRACT

Execute [calibration-cases.md](calibration-cases.md) after any change. All cases
must pass. These synthetic governance cases do not prove application wiring,
atomic behavior in a hosted store, provider billing, provider-account limits,
or production behavior. Version 1.3 requires an independent case for each of the
six `client_init` subphases and a drift case that rejects the retired
`module_load` subphase plus missing, invalid, or dynamic `client_init`
subphases. Module-load fixtures must cover both allowlisted resolution codes and
missing, unknown, non-string, throwing, package-export, and module-format code
variants. Every initialization-failure fixture must retain the unchanged public
response and record zero provider calls.
