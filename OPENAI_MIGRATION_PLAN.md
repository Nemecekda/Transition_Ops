# Transition OPS Anthropic-to-OpenAI Migration Assessment Plan

Plan date: 28 August 2026
Scope: assessment and parallel-clone plan only. No migration code, production configuration, deployment, DNS, or secrets are changed by this document.

## Open questions — answer before implementation

1. What are the last 30 and 90 days of request counts and token usage for `/.netlify/functions/navigator` and `/.netlify/functions/resume`, split by resume mode (`standard` and `federal`)? The repository contains no live request or token telemetry, so a defensible total monthly cost cannot be calculated from code alone.
2. What Anthropic account/project monthly spend limit is currently enforced, and is it a hard rejection limit or an alert? The repository only exposes per-workflow caps and friendly handling of provider credit/limit errors.
3. What OpenAI organization/project already exists, if any; what usage tier applies; and is Zero Data Retention (ZDR) or Modified Abuse Monitoring approved and enabled? `store: false` prevents Responses application-state storage, but default API abuse-monitoring logs may retain customer content for up to 30 days. This must be reconciled with the promise that Transition OPS collects no user data before any member traffic is sent.
4. Does Netlify currently apply function-level rate limiting, a firewall rule, bot protection, or a monthly invocation cap outside this repository? None is visible in code or `netlify.toml` (no `netlify.toml` is present).
5. How are production and preview environment variables scoped today? Confirm that a separate Netlify site can receive a separate `OPENAI_API_KEY` and that neither production `ANTHROPIC_API_KEY` nor production deploy hooks will be copied into the clone.
6. Should the clone exercise the GitHub Actions model jobs, or only the two member-facing Netlify functions? Running Actions against a separate branch still uses repository secrets and can create GitHub issues unless explicitly isolated. The build order below keeps them disabled until this is decided.
7. Which OpenAI retention setting and regional-processing requirement, if any, is mandatory for member-provided resume text and Navigator conversation text?
8. What acceptance sample may be used for resume and Navigator evaluation? The default recommendation is synthetic, de-identified fixtures only; no production prompts, resumes, or conversations should be copied.
9. Who may view the separate Netlify clone URL? The recommended default is access-controlled evaluator-only use until privacy, cost, and safety gates pass.

## 1. Repository inventory: every Anthropic model call

The inventory used exact endpoint, secret, model, and CLI searches across tracked source and workflow files. Six Anthropic-backed execution points were found. `netlify/functions/jobs.js` calls the USAJOBS API and is not an AI call. `j3-weekly-sitrep.yml` and `j5-spend-check.yml` are deliberately model-free.

| # | File and location | Function / workflow step | Anthropic interface and model | Feature powered | Current limits and behavior |
|---|---|---|---|---|---|
| A1 | `netlify/functions/navigator.js:374-429` | exported Netlify `handler`; API call inside the `try` block at line 400 | `POST https://api.anthropic.com/v1/messages`; `claude-haiku-4-5-20251001` | Transition Navigator grounded assistant. Sends up to the last 12 user/assistant messages, app context, computed separation-window status, rules, tool manifest, and verified corpus. | `max_tokens: 800`; each history message clipped to 1,500 characters; context clipped to 400; no streaming; plain-text response; corpus uses Anthropic ephemeral prompt caching; client keeps conversation history; gap tags may be recorded separately without member text. |
| A2 | `netlify/functions/resume.js:3-146` | exported Netlify `handler`; API call inside the `try` block at line 117 | `POST https://api.anthropic.com/v1/messages`; `claude-haiku-4-5-20251001` | AI Resume Drafter: one-page civilian format and detailed USAJOBS/federal format, selected by `mode`. | `max_tokens: 1300` civilian / `1900` federal; hard per-field character clips; one non-streaming request; plain-text response; system prompt uses ephemeral prompt caching; stateless; friendly monthly-limit failure copy. |
| A3 | `.github/workflows/j1-federal-scan.yml:159-168` | `Scan changed sources` | Claude Code CLI `2.1.220`, `claude -p`; `claude-haiku-4-5-20251001` | Daily federal-source change scan, but model fires only when deterministic source diffing finds changed content. | `Read` tool only; JSON CLI envelope; 20-minute job timeout; hard `--max-budget-usd 0.50`; measured firing cost recorded as `$0.065`; quiet days use zero model tokens. |
| A4 | `.github/workflows/j2-weekly-analysis.yml:181-190` | `Analysis pass` | Claude Code CLI `2.1.220`, `claude -p`; `claude-sonnet-5` | Weekly correlation/analysis of J1 findings; does not rate policy or deploy. Fires only when qualifying findings exist. | `Read` tool only; JSON CLI envelope; 20-minute timeout; hard `--max-budget-usd 3.00`; repository records `$0.198` at introductory pricing and applies a 1.5× post-31-August factor (`$0.297`) for spend estimates. |
| A5 | `.github/workflows/j4-link-audit.yml:311-320` | `Characterise anomalies` | Claude Code CLI `2.1.220`, `claude -p`; `claude-haiku-4-5-20251001` | Monthly semantic characterization of link-audit anomalies. The model is skipped when deterministic checks find no anomalies. | `Read` tool only; JSON CLI envelope; 25-minute timeout; hard `--max-budget-usd 0.70`; design workload approximately 40k input / 5k output tokens. |
| A6 | `.github/workflows/pao-weekly-packet.yml:121-129` | `Draft the packet` | Claude Code CLI `2.1.220`, `claude -p`; `claude-haiku-4-5-20251001` | Weekly PAO communications packet from repository sources and the brand-voice prompt. | `Read` tool only; JSON CLI envelope; 20-minute timeout; hard `--max-budget-usd 0.75`; a checked-in real-run fixture reports `$0.263963`, 106 uncached input, 67,871 cache-write input, 835,160 cache-read input, and 18,714 output tokens across the agent run. |

### Non-model calls that remain unchanged

- `netlify/functions/jobs.js` calls USAJOBS and needs no OpenAI equivalent.
- `recordGap()` in `navigator.js` writes only aggregate, sanitized gap topics to Netlify Blobs; it is not an Anthropic call. Its no-member-data contract must remain unchanged.
- Browser calls in `index.html` and `navigator-pilot.html` call the Netlify functions, not Anthropic directly. Provider keys must remain server-side.

## 2. OpenAI SDK equivalents and behavior differences

### Proposed SDK baseline

- Use the official server-side JavaScript SDK and the Responses API: `new OpenAI({ apiKey: process.env.OPENAI_API_KEY })` followed by `client.responses.create(...)`.
- Set `store: false` on every request. Do not use OpenAI Conversations, Files, vector stores, hosted file search, or provider-side persistent prompts for member-facing flows.
- Initial model mapping for parity tests:
  - Anthropic Haiku workloads → `gpt-5.6-luna` with `reasoning: { effort: "none" }` as the cost baseline.
  - Anthropic Sonnet analysis → `gpt-5.6-terra` with low reasoning as the quality/cost baseline.
  - Navigator and both resume modes must be evaluated on Luna and Terra before final selection. Accuracy and grounding outrank the lower price; model selection is not approved by this plan.
- Pin an explicit model ID available to the approved OpenAI project at implementation time and record it in tests. Do not rely on a moving "latest" alias without a regression gate.

Official model guidance describes Luna as the cost-sensitive/high-volume tier and Terra as the balanced intelligence/cost tier. Current list prices are Luna `$0.20` input / `$0.02` cached input / `$1.20` output per million tokens, and Terra `$2.00` / `$0.20` / `$12.00`. OpenAI states that both support the Responses API, streaming, function calling, and Structured Outputs. Sources: [OpenAI model catalog](https://developers.openai.com/api/docs/models), [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna), [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra), and [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create).

### Call-by-call mapping

| Current call | OpenAI equivalent planned | Required parity work / behavior differences |
|---|---|---|
| A1 Navigator | `responses.create({ model, instructions, input: sanitizedHistory, max_output_tokens: 800, reasoning: { effort: "none" }, store: false })` | Anthropic accepts multiple cached system blocks. Responses has one `instructions` field or developer/system input messages; combine RULES + MANIFEST + CORPUS + computed context with explicit delimiters and precedence tests. `max_output_tokens` includes visible output and reasoning tokens, unlike Anthropic's visible generation allowance; using reasoning `none` minimizes cap erosion. Keep client-managed history so no provider conversation state is stored. Extract `response.output_text`, not `output[0]`. No streaming today; preserve non-streaming behavior for parity first. OpenAI cache accounting and breakpoints differ from Anthropic `cache_control: ephemeral`; benchmark cache-write/read tokens rather than assuming equivalent savings. |
| A2 Resume — civilian | Same Responses call shape with civilian instructions, one user input, `max_output_tokens: 1300`, `store: false`, reasoning `none` | Preserve all input clips and grounding rules exactly. OpenAI `instructions` should replace Anthropic `system`; no structured output is needed because the feature returns plain text. Validate one-page tendency, placeholder discipline, number preservation, banned terms, military translation, and posting-tailoring behavior. |
| A2 Resume — federal | Same as civilian with federal instructions and `max_output_tokens: 1900` | Validate fuller duty statements, required bracket placeholders, USAJOBS section order, posting-keyword honesty, and no invented facts. A nominally identical token cap may produce different length because tokenizers differ and OpenAI counts reasoning inside the output cap. |
| A3 J1 federal scan | A non-interactive Node runner using `responses.create` with repository-controlled prompt plus the contents of an explicit allowlist of fetched files; Luna, reasoning `none`, `store:false`; require JSON Schema Structured Output | Claude Code's `Read` tool and `--allowed-tools Read` do not have a one-line OpenAI SDK equivalent. The safe replacement is application-owned file reading from fixed directories, then sending bytes as delimited data. Never interpolate fetched content into shell or prompt instructions. Replace the CLI JSON envelope with a schema for the actual scan result. Preserve the deterministic pre-model diff gate and timeout. |
| A4 J2 analysis | Same controlled runner pattern; Terra with low reasoning; Structured Output schema for the analysis artifact | Preserve the "correlation only, never rates" prompt boundary. Do not give hosted tools, shell, web, or repository-wide file access. The existing Claude agent can make multiple turns and tool reads; a single Responses request may differ materially. Test single-request controlled context first, then only add custom read tools if required. Every tool invocation needs an application-side allowlist and call limit. |
| A5 J4 anomaly characterization | Controlled runner; Luna, reasoning `none`; anomaly files supplied as data; schema-constrained output | Preserve deterministic crawl/classification gates. The model must not be allowed to fetch URLs or adjudicate policy. Structured Outputs are preferable to parsing free-form CLI result text. |
| A6 PAO packet | Controlled runner; Luna baseline and Terra quality challenger; explicit allowlist of the five repository sources; schema-constrained packet | Preserve brand-voice source precedence and source-read completeness checks. The current Claude Code run uses many cached tool turns; a single schema-constrained Responses call should be evaluated for completeness, not assumed equivalent. No external posting or messaging tools are allowed. |

### Cross-provider differences that must be tested

1. **System/developer instructions:** Anthropic's `system` array and per-block cache controls do not map directly. Responses `instructions` acts as a system/developer message, but when `previous_response_id` is used, prior instructions are not carried forward. The plan avoids provider state and resends instructions every call.
2. **Token limits:** replace `max_tokens` with `max_output_tokens`. The OpenAI bound includes visible and reasoning tokens. Character clips stay unchanged; model-token usage must be measured with returned `usage` fields.
3. **Structured output:** A1/A2 remain plain text. A3-A6 should replace Claude CLI envelope parsing with strict JSON Schema Structured Outputs. Schema validation failure must fail closed; no issue, post, or policy artifact is emitted from malformed output.
4. **Streaming:** none of the six current calls streams. Keep the first clone non-streaming. Streaming can be evaluated later for Navigator latency only, behind a separate approval, because event parsing, partial-output safety, abort handling, and cost accounting change.
5. **Prompt caching:** Anthropic ephemeral caching and OpenAI cached-input accounting are not behaviorally identical. Current GPT-5.6 documentation says cache writes are charged at 1.25× uncached input and cache reads at the cached-input rate. Capture `input_tokens`, cached tokens, cache-write tokens, output tokens, and latency per synthetic test.
6. **Response extraction and stopping:** OpenAI Responses output is an array of typed items; use the SDK's `output_text` helper and inspect `status`/`incomplete_details`. Treat output-limit truncation as failure, not a valid resume or answer.
7. **Safety/refusals:** build provider-neutral fixtures for crisis-first response, benefit prediction refusal, unverified-data routing, dead citation prevention, prompt injection, resume fact invention, and malformed JSON. Do not rely on provider defaults.
8. **Retries/timeouts:** preserve bounded retries and function/job timeouts. Retries can duplicate spend, so retry count is part of each budget calculation and must be logged without logging prompts or outputs.

## 3. Cost comparison at current observable usage

### What can and cannot be claimed

The repository provides workflow schedules, hard caps, some measured/modelled workflow costs, one J1 usage fixture, one PAO usage fixture, and J4 design token volume. It provides **no member-facing request counts or token usage** for Navigator/Resume. Therefore:

- Workflow cost projections below are evidence-based estimates.
- Navigator/Resume per-request formulas and cap ceilings can be calculated.
- A total monthly migration cost is **pending answers to open questions 1-3** and must not be guessed.

### OpenAI unit prices used

| Candidate | Input / 1M | Cached input / 1M | Cache write / 1M | Output / 1M |
|---|---:|---:|---:|---:|
| GPT-5.6 Luna | $0.20 | $0.02 | $0.25 | $1.20 |
| GPT-5.6 Terra | $2.00 | $0.20 | $2.50 | $12.00 |

Cache-write values apply the documented 1.25× multiplier. Prices must be rechecked on the day implementation is approved; these are current as of the plan date.

### Observable workflow comparison

| Workload | Current frequency/gate | Current Anthropic evidence | Proposed OpenAI estimate | Interpretation |
|---|---|---:|---:|---|
| J1 | Daily check; model only on changed sources | `$0.065` per firing; fixture `$0.057968` | Luna fixture replay ≈ `$0.0122` per firing | Uses fixture token classes: 1,221 input, 16,720 cache-write, 219,072 cache-read, 2,788 output. This is arithmetic only; the OpenAI runner may use fewer or more tokens. |
| J2 | Weekly; only when J1 findings exist | `$0.297` modelled per post-intro firing; hard cap `$3.00` | Terra design volume 60k input / 8k output ≈ `$0.216` per firing | Does not include cache writes or additional tool turns. Retain a hard per-run dollar guard at or below `$3.00`; do not treat the estimate as the cap. |
| J4 | Monthly; only when anomalies exist | design estimate about `$0.07`; hard cap `$0.70` | Luna 40k input / 5k output ≈ `$0.014` per firing | Deterministic clean months remain `$0`. |
| PAO | Weekly | fixture `$0.263963`; hard cap `$0.75` | Luna fixture replay ≈ `$0.0562`; Terra ≈ `$0.5616` | Fixture replay includes 106 uncached input, 67,871 cache-write, 835,160 cache-read, 18,714 output. Quality determines whether Luna or Terra is acceptable. |

At maximum scheduled frequency, assuming every conditional gate fires, the rough monthly workflow projection is:

- Luna J1: 30 × `$0.0122` ≈ `$0.37`.
- Terra J2: 4.33 × `$0.216` ≈ `$0.94`.
- Luna J4: 1 × `$0.014` = `$0.014`.
- PAO: 4.33 × `$0.0562` ≈ `$0.24` on Luna, or 4.33 × `$0.5616` ≈ `$2.43` on Terra.
- Model-workflow subtotal: approximately **`$1.56/month` with Luna PAO** or **`$3.75/month` with Terra PAO**, before retries and excluding Navigator/Resume. Real spend should be lower when J1/J2/J4 gates do not fire.

### Member-facing cost formula

For each Navigator or Resume request:

`cost = uncached_input_tokens × input_rate / 1,000,000 + cached_input_tokens × cached_rate / 1,000,000 + cache_write_tokens × cache_write_rate / 1,000,000 + output_tokens × output_rate / 1,000,000`

Monthly app cost is the sum by endpoint and model. Before implementation, export aggregate-only counts from current provider/Netlify dashboards—request count and token totals, not prompts, outputs, IPs, user IDs, or resumes—and populate a signed cost worksheet for 30-day actual, 90-day average, P95 request, and worst permitted request.

### Budget-cap survival plan

The migration is not accepted unless all layers below are proven:

1. **Provider project cap:** a dedicated OpenAI project for the clone with a Commander-approved monthly budget/limit and alerts. Confirm whether the control is hard or advisory; do not label an alert a cap.
2. **Per-request token ceilings:** preserve 800 / 1,300 / 1,900 output ceilings; preserve every input character clip and Navigator history bound.
3. **Per-run workflow dollar guard:** replace Claude CLI `--max-budget-usd` with an application-side preflight and cumulative usage ledger that stops before the existing ceilings (`$0.50`, `$3.00`, `$0.70`, `$0.75`). A single Responses request cannot enforce a native dollar cap, so calculate worst-case token exposure before dispatch and reconcile returned usage afterward. If the maximum request can exceed the cap, do not send it.
4. **Deterministic gates:** preserve zero-model-spend behavior on unchanged J1 sources, empty J2 input, and clean J4 audits.
5. **Rate controls:** apply explicit per-IP or edge-level abuse throttling only after current Netlify controls are disclosed. Do not add tracking identifiers, accounts, cookies, fingerprints, or persistent user profiles.
6. **Fail closed:** on provider limit, timeout, malformed output, or cost guard, return the existing friendly member message or stop the workflow. Never fall through to Anthropic from the clone unless a separately approved, bounded dual-provider test explicitly allows it.
7. **No-content telemetry:** record only endpoint, model, token counts, cache counts, latency, status category, and estimated cost. No prompt, completion, resume text, conversation text, IP address, or stable member identifier.

## 4. Parallel clone build order

Every implementation step below is COMMANDER lane and begins only after approval of this plan and resolution of the applicable open questions.

### Phase 0 — freeze the assessment baseline

1. Dean selects the exact `main` commit that represents the production baseline.
2. Create a local feature branch from that commit; proposed name: `ops/openai-parallel-clone`. Do not branch from unrelated staged work.
3. Record the six-call inventory, current model IDs, prompt hashes, workflow caps, current cache version, and test-fixture hashes.
4. Export aggregate-only 30/90-day usage and account-cap evidence. Complete the cost worksheet and obtain Commander approval for clone budgets.

### Phase 1 — provision isolation, without deploying code

1. Dean creates or authorizes a **new Netlify site**, not a production alias or deploy preview tied to `transitionops.org`.
2. Link only the clone branch/site. No production custom domain, DNS record, deploy hook, site ID, analytics ID, OneSignal configuration, or production environment variable may be reused.
3. Create a dedicated OpenAI project/key scoped to the clone. Set the approved retention mode, monthly limit/alerts, and least privilege.
4. Add clone-only environment variables: `OPENAI_API_KEY`, explicit model IDs, per-endpoint output ceilings, per-workflow dollar ceilings, and a kill switch defaulting to off.
5. Access-control the clone and block indexing. Confirm that a clone failure cannot trigger production deploys or user notifications.

### Phase 2 — build provider-neutral test harness first

1. Add synthetic fixtures for Navigator grounding, crisis-first behavior, citations, closed windows, prompt injection, history clipping, and gap-tag sanitization.
2. Add civilian and federal resume fixtures covering exact-number retention, no invention, placeholders, banned terms, multiple employers, certifications, posting tailoring, and output length.
3. Add workflow fixtures for valid schema, malformed schema, prompt injection in fetched files, missing files, output truncation, timeout, retry, and budget exhaustion.
4. Capture Anthropic baseline outputs from synthetic inputs only. Define scored acceptance thresholds before looking at OpenAI outputs.

### Phase 3 — implement an internal provider adapter

1. Add the OpenAI SDK behind a provider-neutral server-side adapter; keep keys out of browser code.
2. Implement `store:false`, explicit model IDs, output ceilings, bounded timeout/retry, usage extraction, and content-free cost telemetry.
3. Implement response-status and truncation handling. No user-facing path changes yet.
4. Run unit tests and the Transition OPS `validation-gate`. This phase does not deploy.

### Phase 4 — migrate the two member-facing functions in the clone

1. Navigator first: map instructions/history, preserve clips and client-side history, then test Luna and Terra against the frozen suite.
2. Resume civilian second; resume federal third. Keep endpoint paths and response shapes stable inside the clone so the UI change surface stays minimal.
3. Select the least expensive model that passes every grounding, safety, format, and P95-latency gate. Any failed accuracy case disqualifies that model regardless of price.
4. Verify no prompt/output logging, no provider state, no member identifiers, no analytics additions, and no fallback that leaks traffic to production Anthropic.

### Phase 5 — migrate model-backed GitHub workflows in an isolated mode

1. Replace Claude Code access with deterministic, application-owned file allowlists and strict Structured Outputs.
2. Preserve each pre-model zero-spend gate and existing dollar ceiling.
3. Disable schedules and side effects initially. Test via local fixtures or manual clone-only runs that cannot create production-labeled issues, notifications, or app changes.
4. Migrate in order of lowest consequence: J4, J1, PAO, then J2. J2 is last because it uses the stronger model and feeds policy-analysis routing.
5. Reconcile each run's returned usage against the application ledger and provider project dashboard.

### Phase 6 — deploy only to the separate Netlify site

1. Dean publishes the clone branch/site after local validation; agents do not push or merge.
2. Confirm clone hostname, site ID, environment variables, OpenAI project, response headers, CORS policy, robots blocking, and access control before the first request.
3. Run synthetic smoke tests only. Verify the production hostname, production functions, production Netlify deploy history, production Anthropic key, and `main` commit remain unchanged.
4. Exercise kill switch, provider-limit handling, timeout, malformed output, and rollback to the clone's prior deploy.

### Phase 7 — shadow evaluation without member data

1. Run the frozen synthetic suite through Anthropic baseline and OpenAI clone; no live dual-send of member requests.
2. Compare factual grounding, refusal behavior, citation validity, resume integrity, JSON schema compliance, output completeness, latency, cache use, and cost.
3. Require 100% pass on hard safety/accuracy cases and no regression in deterministic budget gates. Document any model-specific prompt changes.
4. Conduct human review of civilian resume, federal resume, Navigator policy answers, and workflow artifacts.

### Phase 8 — go/no-go package; production still untouched

Deliver to Dean:

- exact branch and baseline commit;
- separate Netlify clone URL/site ID and proof of isolation;
- resolved open questions;
- six-call implementation map;
- model-selection evidence;
- 30/90-day cost projection using actual aggregate usage;
- provider and application cap evidence;
- privacy/retention attestation;
- validation-gate results;
- synthetic parity report;
- clone rollback drill result;
- list of all files changed;
- explicit statement that production, `main`, DNS, and production secrets remain untouched.

Dean then decides whether to authorize a separate production migration order. Approval of this plan or the clone does **not** authorize production changes, merge, push, DNS changes, secret replacement, traffic switching, or Anthropic shutdown.

## Acceptance gates

The clone is not migration-ready unless every item passes:

- all six Anthropic execution points have an approved OpenAI equivalent or an explicit decision to remain on Anthropic;
- Navigator and Resume hard accuracy/safety fixtures pass 100%;
- civilian and federal formats preserve facts and required structure;
- workflow JSON is schema-valid and fetched content remains data, never shell or instructions;
- no member content or stable identifier is logged or stored by Transition OPS;
- approved OpenAI retention controls are verified, not assumed;
- all current per-request, per-run, monthly, timeout, and zero-spend gates survive;
- aggregate actual-usage cost stays inside the Commander-approved free-service operating target, including retry headroom;
- clone and production Netlify sites, secrets, domains, deploy paths, and notifications are demonstrably isolated;
- rollback works on the clone;
- `validation-gate` passes;
- no production file, setting, deployment, secret, DNS record, or traffic path changed.

## Capability-gap note

The current skill registry has no codified provider-migration assessment skill. `validation-gate` and `deploy-discipline` cover later validation and isolation boundaries only; `resume-drafter-maintenance` remains pending. Force-mod's read-only coverage review classified overall coverage as NONE with partial procedural coverage and recommended flagging the gap now, not drafting a new skill unless implementation is approved or reusable failure modes emerge. No registry change is proposed by this plan.
