# RUNTIME AI SPEND GOVERNANCE - CALIBRATION CASES

Execution date: 2026-09-01
Executor: force-mod
Skill version: 1.1
Method: Apply the closed model/stage table, fixed-point price table, aggregate
ledger schema, atomic admission/settlement rules, closed diagnostic-origin
contract, privacy exclusions, and skill seams to synthetic state transitions.
No application code, provider, account, credential, member data, network, or
production system was used.

Result: 18 / 18 PASS

## RSG-1 - Below-cutoff admission

Input: A valid allowlisted stage has a conservative reservation below the
remaining current-month capacity and a valid ledger.

Expected: Atomically reserve, increment the aggregate admitted count, then
permit exactly one provider call.

Actual: `ADMIT`; no identity or stage partition entered the ledger.

Result: PASS

## RSG-2 - Exact boundary and first overage

Input: One reservation makes settled plus reserved exactly `4,000,000`; the
next reservation would exceed it by one micro-USD.

Expected: Admit equality; deny the next request before provider access.

Actual: First `ADMIT`, second `budget_limit`; provider-call counts were one and
zero respectively.

Result: PASS

## RSG-3 - Concurrent contenders

Input: Synthetic concurrent admissions each read enough apparent capacity, but
their combined reservations exceed the cutoff.

Expected: Shared atomic conditional updates admit only the subset that keeps
settled plus reserved at or below the cutoff.

Actual: Required CAS/transaction serialization; rejected process memory and
ordinary Blob read-modify-write.

Result: PASS

## RSG-4 - Accounting unavailable

Input: Store unavailable, malformed schema, unexpected field, or three
exhausted CAS retries before admission.

Expected: `upstream_unavailable`, no provider call, no permissive fallback.

Actual: `DENY`; zero provider calls in every variant.

Result: PASS

## RSG-5 - Crash after reservation

Input: Admission commits, then the function terminates before provider result or
settlement.

Expected: Reservation remains charged for the rest of that UTC month.

Actual: No stale-reservation release was allowed.

Result: PASS

## RSG-6 - Provider failure

Input: A provider call fails after valid admission.

Expected: Convert the full reservation to settled when possible; otherwise
leave it reserved; make no provider retry.

Actual: Full conservative charge retained and `maxRetries: 0` preserved.

Result: PASS

## RSG-7 - Missing or malformed usage

Input: Completed output lacks a complete valid usage breakdown, or usage
exceeds the reservation.

Expected: Never infer a refund. Retain the full reservation; halt on an
impossible over-reservation result.

Actual: No capacity was released; over-reservation selected `halted`.

Result: PASS

## RSG-8 - Closed models and options

Input: Unknown model, wrong stage/model pair, streaming, background mode, tool,
conversation link, metadata, user, safety identifier, or prompt cache key.

Expected: Deny before reservation/provider access.

Actual: Every variant was rejected by the closed request contract.

Result: PASS

## RSG-9 - Price arithmetic and drift

Input: Luna and Terra synthetic token counts use the approved four price
categories; a second fixture changes one rate.

Expected: Fixed-point upward-rounded charges for the approved table; changed
rate is a STOP/revalidation event.

Actual: Approved table calculated without binary float; drift was not absorbed.

Result: PASS

## RSG-10 - Ledger sentinel exclusion

Input: Synthetic prompt, resume, header, trace, target, IP, request ID, response
ID, client ID, model input, and output sentinels accompany one request.

Expected: None may enter the aggregate key, record, storage metadata, logs, or
failure response.

Actual: Only the nine allowlisted aggregate fields were eligible.

Result: PASS

## RSG-11 - UTC month rollover

Input: A current-month record receives a first admission after UTC month
changes; a late settlement carries the prior month.

Expected: Atomically initialize the new month; do not let the old settlement
mutate it; never use client time.

Actual: New aggregate started at zero and prior-month settlement was isolated.

Result: PASS

## RSG-12 - Request and output boundaries

Input: Navigator and Resume bodies one byte over 32,768 and 65,536 respectively,
plus stage caps above 800/3500/3500/2200/1900/4000.

Expected: Body rejection before parse/reservation/provider; cap rejection
before provider.

Actual: Every over-limit case denied; exact limits remained eligible.

Result: PASS

## RSG-13 - Resume and Navigator seams

Input: Resume facts, conditional repair, civilian, federal, and audit calls plus
an independent Navigator call share the ledger.

Expected: Every call is guarded; Resume retains call-graph/cap authority;
Navigator requires its own regression and cannot clear Resume.

Actual: Shared accounting and independent semantic ownership were preserved.

Result: PASS

## RSG-14 - Provider-cap truth

Input: Dated account evidence shows a provider project limit while repository
code implements a USD 4.00 guard after activation.

Expected: Keep the two controls distinct; do not claim full-account coverage,
real-time provider enforcement, pre-activation accounting, or zero overage.

Actual: Repository verdict remained internal and bounded; provider evidence
remained with `privacy-truth-to-implementation`.

Result: PASS

## RSG-15 - Diagnostic phase completeness

Input: Eight synthetic `upstream_unavailable` paths terminate once at
`prepare`, `blob_store_load`, `ledger_read`, `ledger_write`, `client_init`,
`provider_call`, `provider_result`, and `settlement`. Each fixture carries its
pre-established zero- or one-provider-call state.

Expected: Emit exactly one approved compile-time-literal marker, preserve the
fixture's provider-call count with no retry, keep the public response unchanged,
and attach no subphase to any of the four new phases.

Actual: The closed phase matrix mapped every synthetic origin exactly once;
none was unmarked or outside the set, and the four new phases remained
subphase-free.

Result: PASS

## RSG-16 - Diagnostic sentinel exclusion

Input: Synthetic failures seed the caught error, stack, message, code, status,
request, response, usage, ledger, secret, cookie, identity, IP, provider
identifier, model, stage, amount, URL, and timestamp with distinct sentinels.

Expected: The application-log call receives one compile-time phase literal;
none of the sentinels appears in any marker argument or public response.

Actual: Only the approved fixed phase literal, or an unchanged approved
phase-plus-subphase literal, was eligible; every seeded value remained excluded.

Result: PASS

## RSG-17 - Terminal diagnostic precedence

Input: A provider call fails after reservation and the conservative settlement
path then fails on a ledger write; a second synthetic path reaches a non-ledger
settlement failure.

Expected: Suppress the initial `provider_call` marker. Emit only
`ledger_write` for the terminal ledger failure and only `settlement` for the
terminal non-ledger failure; retain the conservative charge, withhold output,
and make no retry or additional provider call.

Actual: Each path selected its one terminal phase; no initial or duplicate
marker was eligible, and no capacity-release or provider-retry path opened.

Result: PASS

## RSG-18 - Diagnostic silence and drift

Input: A successful request, a valid cutoff denial, and a new synthetic
`upstream_unavailable` branch lacking an approved fixed marker are evaluated.

Expected: Success and `budget_limit` remain silent. The unmarked branch is a
regression failure and force-mod STOP; no diagnostic result is treated as
provider- or account-observability evidence.

Actual: The first two fixtures emitted no diagnostic-origin marker, while the
unmarked branch failed the closed contract without creating an observability
claim.

Result: PASS

## CROSS-SKILL RESULT

RSG-13 exercised `resume-drafter-maintenance`; RSG-10 and RSG-14 exercised
`privacy-truth-to-implementation`; RSG-12 preserved the `validation-gate` and
`deploy-discipline` seams. RSG-15 through RSG-18 added no provider-account,
runtime-wiring, or deployment claim. Each retained independent blocking
authority.
