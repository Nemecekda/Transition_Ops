# J1 migration design and acceptance packet

Prepared by force-mod, 2026-09-08. **Design only — migration not implemented.**

Final parent scope note: `/tmp/tops-return-loop-2026-09-08/protocol-v1-recovered.md` is the authoritative recovered U1–U8 / failure-reduction v1 protocol. The intermediate v2 remains a proposal only and has no operative effect. No protocol file is revised by this handoff.

**J1 clarification pending:** this packet analyzes the existing daily J1 federal-source scanner. The user may instead mean an interactive J1 staff agent in this environment. Until that distinction and the implementation phase are resolved, this remains a conditional scanner design only; do not implement either interpretation. If the interactive agent is intended, the cron, GitHub credential and baseline design below does not automatically apply and needs a separately scoped assessment.

## Decision and scope

Recommend **J1 first, offline dry-run first, then separately authorized manual shadow evaluation**. Preserve the existing Claude J1 cron and reporting path until a candidate has passed validation and Dean expressly authorizes cutover. No new skill, live workflow change, schedule invocation, provider call, issue mutation, credential inspection/change, dependency install, or production action occurs in this task.

The parent has frozen the app loop at **U1–U8 / failure-reduction v1**, with canonical hydration, Home continuations, keyboard/exact reminder routing, and broad SITREP changes excluded. This J1 sidecar does not revise that freeze. The intermediate revision-2 proposal in the earlier report is not the parent's adopted protocol.

Coverage: **PARTIAL** for a complete J1 migration. Existing skills cover deployment/CI boundaries (#2), local validation (#1), provider/privacy claims (#15), and detection-versus-policy authority (#3). The app's shared runtime spend skill (#16) supplies relevant fail-closed principles but does not govern a ready-made J1 budget implementation. Missing work is a validated J1 adapter, independent per-run admission, credential isolation, response compatibility, and baseline/failure acceptance. This bounded packet supplies a design for those seams; it does not certify them.

Owner handoff: s3-devops builds and validates the isolated runner when authorized; s2-scanner remains detection-only; s2-intel reviews any subsequent substantive policy finding under its normal verification process. force-mod reviews uncovered governance failures. No J2/J4/PAO provider migration is included.

## Evidence basis and freshness

Repository root: `/Users/deannemecek/Documents/Documents - Dean’s MacBook Pro/GitHub/Transition_Ops`.

- Inspected HEAD: `0fd3c45233c4c21437d55d646a310e6333d6825b`, branch `ops/openai-parallel-clone`. Local main reference `e9a84fe2c94cecd4b76b70880fc3a76a36e1e469` has the same tree, `2c6fb29204e548d2351591cb91ad7ed25d316716`. No remote refresh, live Actions observation or provider/account inspection was performed.
- `OPENAI_MIGRATION_PLAN.md` is dated 2026-08-28. Treat its safety questions and phased-isolation ideas as historical context. Its six-call inventory, Netlify-file inventory, model/price claims, J4-before-J1 order and old overall coverage verdict are not current evidence or authority. The current user instruction selects J1 first.
- Local package inspection: `package.json` pins `openai` to `7.8.0` and Node to `>=22.12.0`. `package-lock.json:539–546` records that version, tarball URL, integrity and package engine requirement. No installed `node_modules/openai` or `netlify/functions/node_modules/openai` was present; no package was downloaded. This proves a declared dependency, not actual SDK runtime compatibility.
- Local integration: `netlify/functions/_shared/openai-client.cjs:5–10,13–15,58–79` reads a Netlify/process `OPENAI_API_KEY`, loads the SDK, disables SDK retries, and uses `responses.create` through the app guard. Its presence is not an authorization to reuse its credential, budget, or stage registry for staff jobs.
- Because the actual SDK package was absent, current official OpenAI documentation was inspected on 2026-09-08 to verify generic request and output handling. **No target model or price is selected.** Before implementation/live use, inspect the exact installed SDK artifact and verify the selected model's current endpoint, schema, context, output, reasoning, service-tier and billing support. Pin/version evidence is required; do not mechanically upgrade the app package.

Current official documentation confirms configurable SDK retries/timeouts; default retries must not be mistaken for a one-call limit. Set explicit zero retries and an explicit timeout in the future runner. [OpenAI JavaScript/TypeScript library](https://developers.openai.com/api/reference/typescript)

Responses exposes completion/error/incomplete state and structured output items. Output item order is not fixed; supported SDKs provide `output_text`. Validate completion and all refusal/error conditions before parsing text. Use an explicit output cap and supported non-streaming request options, not historical CLI flags. [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create)

Structured Outputs supports strict JSON schemas, but schema conformance does not establish factual truth; refusals require separate handling. Use a closed schema and deterministic semantic checks, not JSON parsing alone. [Structured Outputs guide](https://developers.openai.com/api/docs/guides/structured-outputs)

These documentation observations do not prove account availability, actual billing, retention settings, or that version 7.8.0 implements every currently documented field.

## Current J1 contract and concrete gaps

| Source | Contract to preserve / gap to test |
|---|---|
| `.github/workflows/j1-federal-scan.yml:7–24` | Current daily cron, manual trigger, contents-read/issues-write/actions-read permissions, serial concurrency and 20-minute job timeout. Preserve this live workflow during candidate work. |
| Same file:27,45–50,169–178 | Claude tier assertion and installation; model invokes only on nonzero deterministic diff; Read-only CLI; existing `--max-budget-usd 0.50` ceiling. This is repository configuration, not verified provider billing enforcement. |
| Same file:58–109,123–166 | Authored source allowlist; fetches go to files; normalization/hashing; pinned baseline issue #1; prior diff manifest contains hashes and byte counts. |
| `.claude/prompts/j1-federal-scan.txt:1–25,33–49` | Treat fetched content as untrusted data; no shell/write/network tools; detection only, no policy ratings or member-facing recommendations; JSON coverage/findings contract. |
| `.github/scripts/j1-render-findings.py:98–119,123–160,188–235,243–345` | Outer `result` must be a JSON-containing string; renderer produces findings Markdown and optional `OK`/`FAILED` status file. It preserves evidence and contains hostile Markdown. Exit 0 can still mean payload FAILED. |
| Workflow:218–221,260–283 | Renderer status controls report title/label; reporting currently writes issues. No candidate test may execute these issue operations. |
| Workflow:291–328 | Baseline update checks fetch counts but does not require `out/j1-status.txt == OK`. A valid process exit can therefore advance memory after a semantically failed scan. Candidate must require explicit scan acceptance, not reproduce this blind spot. |
| Workflow:333–349; `.github/scripts/emit-metering.sh:17–37` | Every-run record, artifact output and model-step count exist. File presence used as a proxy for model invocation is not authoritative call accounting. |
| `.github/scripts/j5-metering-median.py:18–22,25–45,60–68` | Current cost calculation is a fixed historical per-step estimate. Loader does not exclude `dry_run` records. Do not send shadow artifacts into the production J5 collection path or present its estimate as OpenAI cost. |

### Old hash is not old content

The prior manifest supports “this normalized source hash changed.” It cannot support “this sentence changed from X to Y” without a retained prior source document. Do not invent prior wording, dates, amounts, eligibility or legal effect.

For the first migration, keep hash-based detection and characterize only the supplied current source content. The existing `what_changed` field may honestly say that a source hash differs and summarize what the current source states, with an exact current-source excerpt. State that prior content is unavailable. A changed source may have no meaningful policy change; detection is not verification. Retaining historical source bodies or adding semantic-diff storage is a separate design request and not required here.

## Stages and authority

| Stage | Allowed future behavior | Hard boundary / completion evidence |
|---|---|---|
| 0 — this packet | Read local source and official docs; write this Markdown file. | Completed without implementation or calls. |
| 1 — offline candidate | After implementation authority, isolated local runner and synthetic fixtures; injected fake transport; local renderer and sinks. | No real API key, network, `gh`, issue create/edit/label, baseline issue write, workflow dispatch, cron, artifact upload or notification. All admission, adapter, renderer and baseline-gate cases below pass. |
| 2 — first live shadow | Only after separate approval: one manually initiated bounded OpenAI request against a frozen, reviewed synthetic/public-source fixture; artifacts remain local or in a specifically approved isolated artifact sink. | Claude cron remains unchanged. No fresh Claude comparison call, issue write, live baseline advancement, scheduled invocation, or member data. Unknown provider outcome ends the attempt; no retry. |
| 3 — shadow acceptance | After a bounded experiment budget is approved, evaluate the fixed representative set on the selected model and compare to reference expectations and existing sanitized Claude artifacts. | Record exact inputs, expected findings, all hard failures, usage/cost bounds and human review. No live source stream is dual-sent automatically. One successful smoke response is not parity evidence. |
| 4 — later cutover proposal | Separate PR and Commander decision for production J1 only, after offline and shadow acceptance. | This packet grants no merge, schedule enablement, issue writes, provider configuration or cutover authority. Keep one authoritative production writer; never run competing Claude/OpenAI baseline writers. |

Prefer a standalone local candidate initially. If a later GitHub-hosted shadow is wanted, use a **separate manual-only workflow** with no schedule, no issue permissions and no production baseline sink; that workflow itself needs a reviewed later change. Adding `DRY_RUN=1` to the live Claude workflow is insufficient: its issue/label/baseline steps do not honor a comprehensive side-effect guard.

Before any candidate code, record the frozen workflow, prompt, renderer and package-lock hashes. Preserve unrelated app work and use the parent's isolated development arrangement. Proposed candidate file names in this packet are planning names only; none is created here.

## Proposed isolated runner

One application-owned Node runner, with no agentic tool loop:

1. Validate explicit mode (`offline` default; `shadow` requires a separate affirmative enablement), fixed input root and reviewed run configuration. Reject unknown modes. Prohibit a production issue/baseline writer in the shadow executable, not merely behind a Boolean.
2. Read only the authored source list, reviewed instruction file, baseline/manifest/diff fixtures, fetch-failure metadata and explicitly named changed-source files. Allowlist IDs from the authored source list; require unique IDs, regular files, confined real paths, no traversal/symlink escapes and bounded sizes. Do not read arbitrary repo files, secrets, `.env`, home directories or model-requested paths.
3. Validate baseline identity/version and complete source coverage before expensive work. Validate matching source sets, hashes and counts, not just number of rows. Missing/invalid baseline is failure, not “first run”; baseline creation stays an explicit separate operation.
4. If complete valid coverage has zero changed hashes: return a local quiet/accepted result with zero SDK construction, zero key access and zero calls. If coverage is partial or invalid: local failure record, zero calls and unchanged baseline. Do not turn a failed fetch into a quiet-day success.
5. Build instructions from reviewed repository text. Supply only changed-source bodies and required deterministic metadata as clearly separated untrusted input data, read by the Node process from files. No source bytes on shell argv, environment, GitHub expressions, step outputs, commands or instruction roles. Source data cannot choose model, credentials, base URL, request options, file paths or output destinations.
6. Validate complete serialized request size, known model/schema/cap configuration, pricing record and per-run reservation. Reject over-budget/oversized input; do not silently truncate source coverage or split into additional calls. In offline mode, use only the injected mock; accidental live transport is a failing test.
7. For an authorized shadow, explicitly construct the official SDK with the J1-specific key, zero retries and one bounded timeout. Make at most one Responses generation request. Proposed timeout: 60 seconds, subordinate to a local wall-time limit and the existing future workflow ceiling; tune only through the reviewed contract. No automatic repair, fallback to Claude, polling, tools or second request.
8. Require completed response, no error/refusal/incomplete state, usable text and valid strict schema. Reject malformed, extra-key, oversized, duplicated, missing-source or inconsistent findings. Verify every quoted excerpt against the supplied current source representation; deterministic parsing/normalization must be recorded. Schema success alone is not semantic acceptance.
9. Assemble the compatibility envelope and render only to local scratch. Read the renderer's machine status separately from its exit code. Record an explicit final `accepted` Boolean only if all input, coverage, response, semantic, cost and renderer checks passed.
10. Compute a **proposed** baseline locally for inspection; preserve the original baseline bytes. Shadow never commits that proposal. Future production advancement must additionally require successful authorized findings delivery for changed sources and a final baseline identity check.

No model-generated fetch totals: host code owns `sources_total`, `sources_fetched`, `sources_changed` and `sources_failed` from validated deterministic records. The model supplies findings only; their IDs must equal the changed-source ID set exactly once each. That prevents a schema-valid response from silently skipping work or inflating coverage.

### Proposed provider request contract

Use Responses with reviewed instructions, untrusted source input, strict `text.format` JSON schema, explicit output bound, `store:false`, `stream:false`, and `background:false`, subject to exact installed-SDK/model verification. No tools, previous-response/conversation links, files/vector stores, metadata, end-user identifiers or caller-supplied persistence/base-URL options. Reasoning and service tier must be explicitly supported and included in fresh model/billing verification; do not assume `none` is universally supported.

These are proposed application restrictions. `store:false` does not prove zero provider logs or account-wide retention settings. Only public-source or synthetic data is eligible for shadow, and provider/account facts remain UNVERIFIED until separately inspected by an authorized owner.

## Renderer compatibility contract

Keep `.github/scripts/j1-render-findings.py` unchanged for the first candidate. Adapt at its input boundary rather than expose raw OpenAI Responses as if they were Claude CLI envelopes.

Successful outer object:

```
result: string containing JSON.stringify(validatedPayload)
duration_ms: optional measured nonnegative duration
total_cost_usd: optional finite, verified usage-derived charge estimate
```

The inner payload retains exactly:

```
sources_total: nonnegative integer
sources_fetched: nonnegative integer
sources_changed: nonnegative integer
sources_failed: array of {id: string, reason: string}
findings: array of {
  id: string,
  what_changed: string,
  quoted_excerpt: string,
  contains_instruction_like_text: boolean
}
```

Use `additionalProperties:false` and required fields for the candidate schema; enforce finite/count/length/set relationships in host code. Require `sources_fetched + sources_failed.length == sources_total`, distinct failed IDs, and changed count matching the deterministic diff. Success additionally requires complete fetch coverage and exactly one valid finding per changed source. Do not allow JavaScript/Python Boolean-to-integer coercion to validate counters.

Do not fabricate `num_turns`, session IDs, Claude model telemetry, usage or a dollar value of zero. `total_cost_usd` is omitted when unavailable and must not contain a reservation presented as actual usage. Store reserved/actual/unknown status in a separate local candidate evidence record. The existing renderer's historical “Full SDK envelope” label does not make the adapter envelope a native provider response; identify its provenance in the parent evidence packet.

On failed provider or adapter validation, emit a sanitized failure envelope with `result:null` and a fixed adapter failure code, then invoke the renderer if possible. Its parse-failure path must produce `FAILED`, not a friendly all-clear. Never forward raw HTTP headers, request bodies, authorization values or caught error objects into the renderer's raw-evidence block. If rendering fails too, retain a safe local failure report; never treat existence of a report file as scan success.

Known distinction: a successful renderer invocation can return exit 0 while writing `FAILED`. The orchestrator must check both the validated adapter result and the exact machine token. Renderer coverage checks are not a replacement for the adapter's stricter source-set and schema checks.

## GitHub credential and application-budget boundary

Proposed later credential: `J1_OPENAI_API_KEY` in a restricted GitHub environment dedicated to the J1 shadow/runner, backed by an explicitly identified OpenAI project/service credential with the least permissions needed. The name is a proposal, not a discovered secret. Pass it explicitly to SDK construction; do not rely on automatic `OPENAI_API_KEY` discovery.

- Leave Netlify's `OPENAI_API_KEY`, its site contexts and the app's `openai-client.cjs`/`openai-budget.cjs` untouched. Do not copy that key to GitHub or import the member-facing guard into J1. Different secret names do not prove separate provider projects or budgets; verify project/key scope without displaying secret values.
- Leave current GitHub `ANTHROPIC_API_KEY` and Claude cron unchanged. A shadow step receives neither that key nor a Netlify token.
- Offline tests receive no real credential. Future manual GitHub shadow uses only the reviewed J1 OpenAI secret; no `GH_TOKEN`, repository-write, issues-write or provider-admin key is exposed to the model/runner. No untrusted PR/fork code runs with that credential.
- Separate deterministic source fetching from provider invocation. Provider invocation gets already validated files and no ability to execute source instructions. Neither source data nor the model can choose network destinations.
- Future GitHub token/workflow permissions, environment approval rules and provider account settings must be inspected before claiming enforcement. This packet proposes them; it does not assert they are configured.

## Explicit per-run limit and accounting

**Offline allowance: zero provider calls and zero provider spend. Proposed initial shadow ceiling: USD 0.50 per run, inherited as a configuration ceiling from current J1, not a price claim.** First live shadow authorization should cover at most one generation call in one run, hence at most that ceiling. No live authorization is granted here. A larger shadow batch needs its own run count and total experiment ceiling.

Use integer micro-USD: proposed `J1_RUN_LIMIT_MICRO_USD = 500000`. This is **independent** of the app's existing monthly ledger and cutoff. No assumption that a GitHub run draws from, or is bounded by, the Netlify ledger. A provider project budget/alert is not accepted as proof of this application admission limit without evidence of its enforcement semantics.

Before a call, bind an official, dated billing record to the exact model/version, supported service tier, billable input/cache/output categories, output cap and SDK request. No prices are populated by this report. Missing, stale, ambiguous or unsupported terms mean zero calls.

Proposed reservation formula, with rates converted to exact rational/fixed-point micro-USD per token:

```
U = ceil(I_bound * P_input_worst + O_cap * P_output_worst + F_fixed)
admit only if calls_started == 0 and U <= 500000
```

`I_bound` must upper-bound the whole provider-billed input, including instructions, source bodies and schema/protocol overhead. A byte count alone is not accepted as a proved bound. Conservative initial option: use the selected model's freshly verified maximum input/context token allowance as the input upper bound; if that reservation does not fit, deny the call. A tighter offline-tokenizer bound is a later option only after its tokenizer version and protocol/schema overhead are proven. Unknown billable categories/fees defeat the bound. No provider token-count call or extra model call is used to prove affordability.

`O_cap` must bound all billed output, including any reasoning that the selected endpoint counts against it; verify that behavior for the selected model. `P_input_worst` covers every applicable input/cache rate, assuming no cache discount. No tools means no tool fees, but the billing review must confirm any other fixed charges in `F_fixed`.

Reserve `U` before dispatch and mark the one call consumed before invoking transport. On timeout, disconnect, refusal, missing usage, crash or settlement uncertainty, retain `U` as the conservative exposure and make no retry. A client timeout cannot prove provider execution was cancelled. Usage over the bound is a hard incident and blocks further shadows; do not quietly normalize it.

On successful authoritative usage, calculate the charge using the bound billing record and compare it to `U`. Label it usage-derived, not an invoice. Reconcile against provider/account evidence before cutover. Do not use J5's old per-step estimate as billing evidence.

The one-call guard is per process/run. A process restart, GitHub rerun or another manual invocation is a new spend opportunity; during shadow, disallow automatic restarts/reruns and account each authorized attempt against the experiment ceiling. A durable cross-run or fleet-wide budget is a separate scope, not secretly supplied by the app ledger.

## Baseline transaction and shadow isolation

Candidate acceptance for changed sources requires all of: baseline identity and normalization version valid; exact complete source set; diff valid; bounded call accepted; complete validated findings; safe renderer exit and `OK` token; cost accounting accepted. Production advancement would additionally require acknowledged report delivery to the approved sink and an unchanged baseline identity immediately before write. Failure at any stage preserves the prior baseline.

For a complete no-diff run, skip the model and findings renderer. It may be recorded locally as quiet; the existing baseline content need not change. For partial/no-fetch coverage, no-diff-looking output is a failure, never quiet.

In offline/shadow stages, baseline writes are confined to a **new proposed-baseline artifact** in scratch. Hash the input baseline before and after and assert equality. No `gh issue edit`, no issue #1 mutation, no title discovery/create fallback. The sidecar cannot bootstrap or repair production baseline state.

A final reread is not an atomic compare-and-set. GitHub issue-write concurrency guarantees were not verified here. Before cutover, prove the chosen single-writer/serialization boundary covers every automated writer and document how manual edits are excluded or detected; do not call a read-then-edit sequence an atomic transaction. Shadow acceptance cannot certify that later production integration.

The existing production deficiency is documented, not fixed here. Offline tests must demonstrate the candidate's stronger advancement rule with a renderer-FAILED/exit-0 case, then preserve that assertion through any later workflow integration. Duplicate-report handling after a failed baseline write is a separate idempotency acceptance case; do not turn delivery failure into unexamined baseline advancement to avoid duplicates.

## Acceptance matrix — all results NOT RUN

Every offline test injects transport and sink spies, denies real outbound calls, and runs without real provider/GitHub credentials. Expected calls below are **mock generation calls**; live counts remain zero. Every row must assert zero issue/label writes, zero scheduled/manual workflow dispatch and unchanged original baseline. No test runs the live workflow file as a shortcut.

| ID | Fixture / condition | Required outcome |
|---|---|---|
| J1-01 | Valid complete fetch, identical normalized hashes | Zero SDK/key access and zero mock calls; honest quiet result; no baseline mutation. |
| J1-02 | One changed source, complete coverage, accepted response | One mock call; exact current-source finding/excerpt; compatible envelope; renderer `OK`; local baseline proposal only. |
| J1-03 | Several changed sources plus unchanged sources | One mock call with only allowed changed bodies; one finding per changed ID; no silent omission or extra call. |
| J1-04 | All/partial fetch failures, including apparent zero diff | Zero mock calls; explicit coverage failure; original baseline preserved. |
| J1-05 | Missing/closed/wrong-identity baseline, invalid JSON/version/source set | Zero mock calls; no discovery/create/reset fallback; preserve baseline. Test identity from synthetic metadata, not live Issues. |
| J1-06 | Different hash, no prior source text | Finding describes current evidence and unavailable prior content; no invented before/after claim. Exact source excerpt validated. |
| J1-07 | Same semantic content, JSON key-order/whitespace differences | Existing normalization semantics retained; no unnecessary model call when normalized hashes match. Array-order changes may remain a detected hash difference; do not claim semantic equality beyond normalization. |
| J1-08 | Traversal ID, duplicate ID, symlink/oversized/missing source file | Zero mock calls; no read outside allowlist; no truncated “full coverage” success. |
| J1-09 | Source asks to reveal keys, run shell, change instructions or call another URL | No secret read/tool execution/network redirection; instruction-like content flag surfaced; source stays quoted data. Preserve hostile renderer fixtures. |
| J1-10 | Closed-schema violation, duplicate/missing findings, false counts, Boolean counters, excerpt not in source | Adapter failure; safe failure envelope; no accepted baseline proposal or misleading `OK`. |
| J1-11 | Refusal, incomplete/truncated output, queued/in-progress/failed status or empty text | Fail closed; one mock call at most; no repair/fallback/poll; preserve reservation and baseline. |
| J1-12 | 401/403/429/5xx, disconnect and timeout | One mock dispatch at most; no SDK retry; safe local failure; baseline unchanged; unknown provider outcome does not free allowance. |
| J1-13 | Missing model/key/price/cap or wrong/unverified SDK API shape | Zero mock calls; fixed failure code; no fallback key/model/version. No secret values printed. |
| J1-14 | Reservation exactly at limit and one micro-USD above | Equality admits one mock call; above limit admits none. Invalid rates/overflow/unknown billing category deny. Fixed synthetic rates are labelled test values, not provider prices. |
| J1-15 | One call consumed, attempted second call or caller retries | Reject further dispatch irrespective of response or remaining apparent funds. |
| J1-16 | Missing/corrupt usage, authoritative usage over reservation, stale billing record | Preserve conservative exposure; withhold acceptance; no additional call. No fabricated zero cost. |
| J1-17 | Renderer exits 0 but writes `FAILED`; status missing/invalid | Candidate remains failed; no baseline advancement. Test exit/status independently. |
| J1-18 | Renderer crashes; evidence write fails; proposed-baseline write fails | Safe failure status, no secret/raw-error leakage, original baseline intact. A file's existence cannot prove success. |
| J1-19 | Nominal/degraded renderer fixtures | Existing findings ordering, quoted prose, hostile Markdown containment, coverage-blind warnings and no false all-clear survive the adapter. |
| J1-20 | Quiet/success/failure metering plus dry-run marker | Local provenance and actual dispatch count correct; no shadow artifacts reach current J5 collection path; old cost estimate never relabelled OpenAI billing. |
| J1-21 | Attempted issue/create/edit/label, workflow dispatch or real network in an offline test | Test harness fails immediately; side effects do not execute. Shadow has no production writer dependency or token. |
| J1-22 | Future delivery failure or baseline changed between read and proposed write | Simulated commit guard refuses advancement; preserves findings for inspection and avoids reporting an unexamined change as handled. |

Run existing `.github/scripts/tests/test-render-findings.py` and `.github/scripts/tests/test-j5-metering-median.py` unchanged in the later offline phase, inspecting their actual writes first and directing temporary output to approved scratch. Extend with adapter, budget and status-file assertions; current renderer tests alone do not certify orchestration. Do not execute package-wide build/deploy scripts just to test this runner.

For any later workflow diff, apply validation-gate's YAML parse, pinned-action assertion and 4S actionlint checks plus manual fetched-content/shell review. Pin compatible Node/SDK/actions by reviewed artifacts. Schema lint does not prove issue isolation, key scope or accounting. No validation results are asserted in this packet.

## Shadow evidence and cutover checklist

Freeze a reviewed set including quiet, one-source change, multi-source change, normalization-only change, malicious source text, fetch gap and incomplete provider result. Provider-error cases stay mocked when forcing them would spend money or depend on external failure. Existing sanitized Claude captures may provide style/coverage references, but the human-authored expected facts and deterministic coverage are the oracle; Claude output is not policy truth.

Before live shadow, record the exact candidate commit, installed SDK version/integrity, prompt/schema/input hashes, model ID, fresh source URLs/access date for model/pricing/limits, authorized project identity, run/output/timeout caps, key boundary and total experiment budget. Capture local adapter/renderer status, accepted source set, call count, reserved exposure, usage-derived cost or unknown status, duration and reviewer verdict. Keep artifacts out of production job ingestion; no raw secret/error/header artifacts.

Shadow acceptance requires every hard case to pass, complete coverage on all nominal inputs, no unsupported factual/previous-content claims, safe instruction containment, compatible renderer output, correct budget accounting and zero unauthorized writes. Record failures individually; do not average them away or equate syntactically valid JSON with parity. Staff comparison does not establish benefits truth or member retention.

After evidence is complete, prepare a separate cutover decision identifying exact workflow changes, key/environment configuration, baseline identity, production issue sink, metering treatment and rollback. J5's estimate mismatch is an explicit integration decision before switching production, not permission for a broad J5 rewrite now. Cutover must leave exactly one authoritative J1 schedule/writer. Before cutover, stopping the shadow is the rollback; after a separately approved cutover, use a prepared reviewed revert and preserve baseline identity/normalization compatibility. Do not revoke the Claude recovery credential until that later rollback decision permits it.

## Required later decisions; no input needed to finish this packet

1. Authorize an isolated J1 implementation and offline tests against this contract. No provider spend is needed for that phase.
2. Before a live shadow, confirm the intended GitHub environment and OpenAI project/key owner, with separate inspection/configuration authority. Do not paste a key into chat or a Markdown file.
3. Approve or revise the proposed **one run / one generation call / USD 0.50 maximum** first shadow ceiling. For broader evaluation, specify an attempt count and aggregate experiment ceiling; manual reruns consume it too.
4. After fresh official evidence and account access verification, approve the exact model/output cap/service tier and billing record. They are deliberately unselected here; the historical plan does not settle them.
5. Later, decide production issue/baseline integration, J5 interpretation and cutover/rollback only after shadow acceptance. No schedule, issue mutation or secret change is authorized by preparing this file.

No major new skill is necessary to prepare this bounded candidate. If repeated staff migrations expose reusable gaps, a narrowly scoped **staff-model-runner-governance** proposal could cover provider adapters, per-run admission, deterministic coverage, output envelopes, no-side-effect test modes and baseline transactions, owned by force-mod with s3-devops execution. That is an optional future scope note, not a skill spec, registry addition or present implementation requirement. It must not absorb policy verification, member-facing spend or deployment authority.

## SITREP

- COMPLETED: design/acceptance packet written only to `/tmp/tops-return-loop-2026-09-08/j1-migration-plan.md`; inspected historical plan, current local package declarations, J1/renderer/metering and current official API documentation.
- PENDING DEAN: later implementation/live-shadow decisions listed above. No required response to complete this read-only deliverable.
- BLOCKED: none for preparation. Actual SDK installation/API compatibility, model/prices/account settings and all test/shadow results remain unverified or NOT RUN.
- REGISTRY CHANGES: none; no new skill created.
- BURN: zero J1/provider-generation calls initiated; assistant-session cost not measured. Existing Claude cron untouched.
