# Weekend integration validation - local candidate only

S3-devops; 2026-09-07. Local EDIT gate PASS. This report records the reviewed integration in `codex/openai-weekend-integration`; it is not release, hosted, phone, iOS, or incident root-cause acceptance. The Commander authorized the local merge commit only; no main update or push is authorized here.

## Source identity and disposition

First parent (OpenAI candidate): `0433f333e1de16d2dfd06e0cad4cb9a1ba025008`.

Second parent (published main): `d82516389ed5906febad467cfe57887acda97053`.

Supplemental source: `c395c454d254de2b5021fab129996b6ff38e0f55` (selective preservation, not a third merge parent).

- Retained clone privacy, production push OFF, modern OpenAI functions, zero provider retries and exact public-build boundary. Main's two-attempt provider retry behavior is explicitly superseded; no Anthropic handler restored.
- Retained main policy/reminder values, verbatim Navigator RULE16 and corpus(b) in-force wording, and ten changed fleet scripts/workflows. Verification records preserve both histories under source-qualified sections with original IDs/content/ratings; no new ratings or policy wording.
- Restored main's font-only preconnect/nonblocking stylesheet/noscript block verbatim, without analytics. Local browser checks pass; no performance benchmark claim.
- Retained environment-only Navigator dry-run with input validation and zero client/store/provider construction. Request-body dryRun does not activate it. Main RULE17 gap collection is superseded by approved clone privacy removal; no recordGap/Blob writes restored.
- **Row29 BLOCKED-POLICY:** full per-invocation Navigator success/status telemetry is not ported. Current runtime-ai-spend-governance lines225-229 require closed compile-time literal markers and prohibit runtime status/request/response/usage data. Recommendation: retain existing closed markers. Full dynamic telemetry is a separate governance decision, not an implicit implementation authorization. Existing failure markers do not replace full success-path observability.
- Supplemental e073af5, ca7411f and c395c45 are preserved through final reviewed notify helpers plus a FIRST production-OFF return, with zero callers restored. Seven historical docs/tests retained; two harnesses explicitly activate only isolated stubbed test engines. Historical synthetic reproduction stays pinned to e073af5. No duplicate guarantee for old contexts that ignore ledger/locks; no real sends or activation.
- Active pwa-sw151->152 exactly once; 152 is provisional pending parent's hosted-origin cache ledger. Legacy sw remains exact approved clone130, not main135 or supplemental136. Lockfile unchanged; no dependency additions.

Force-mod's final `intel/weekend-update-reconciliation.md` accounts for31/31 weekend rows:30 preserved/adapted/superseded and1 BLOCKED-POLICY; supplemental3/3 applied inactive. Its final snapshot manifest was verified against candidate bytes before this report. Not all production behavior was ported.

## Final measured results

All commands below exited0 on the unchanged final runtime bytes. No numeric assertion total is invented for suites that emit only summary groups.

| Command | Result |
|---|---|
| `npm run test:openai-migration` | 4 PASS summary groups; dry-run, browser, LibreOffice, RDM integration |
| `npm run test:runtime-ai-spend` | 1 suite PASS; no numeric assertion total emitted |
| `npm run test:sw-privacy` | 83 PASS /0 FAIL |
| `npm run test:privacy-network` | 49 PASS /0 FAIL; provider0 |
| `npm run test:accessibility-release` | 309 PASS /0 FAIL;36 scenarios; local automation only |
| `npm run test:policy-content` | 96 assertions,1110 parity vectors PASS |
| `node scratchpad/alert-disabled-test.cjs` | 1 PASS; granted permission, OFF, zero worker/locks/storage/show access |
| `TZ=America/Chicago node scratchpad/alert-persistence-test.cjs` | 35/35 PASS; stubbed lock/persistence |
| `node scratchpad/alert-browser-test.cjs` | 7/7 PASS; native local locks/storage, stubbed notifications |
| `python3 .github/scripts/tests/test-j5-metering-median.py` | 15 PASS /0 FAIL |
| `npm run build:public` | exact22files PASS |
| `bash /tmp/tops-weekend-evidence/package-boundary.sh` | exact current validation skill4N; package/both AI artifacts/jobs exclusion PASS |
| `/Users/deannemecek/.local/bin/actionlint` | 1.7.12; zero findings;6 workflows |
| `python3 /tmp/tops-weekend-evidence/final-gate.py` | 41 JS/JSON parses +6 YAML PASS;12 uses pinned40hex; preservation PASS |
| `git diff HEAD --check` | PASS, no output |

Dependency installation used the existing inspected lock only: `env -i PATH="$PATH" TMPDIR=/tmp npm ci --ignore-scripts --no-audit --no-fund --userconfig=/dev/null --globalconfig=/tmp/tops-weekend-empty-npmrc --cache=/tmp/tops-weekend-npm-cache`. Authorized registry download; no credentials copied or model/provider requests. Local browser tests used isolated state and blocked outbound requests. No real notifications or hosted actions.

Earlier failures were resolved: globally unique verification-ID assertion adapted to reviewed source-qualified records; sandbox browser launch rerun with authorized isolated browser access; initial duplicate npm configuration failed before install; overbroad fleet preservation probe corrected to published merge-base diff; actionlint resolved to the installed explicit path. No unresolved executed-test failure.

Full EDIT encoding inventory checked staged plus unstaged added lines and all intended new markdown:35 files before this report, zero U+2018/U+2019/U+201C/U+201D/U+00A0. This report is checked separately before staging, then the complete36-file staged diff is checked. No source quotations normalized. No code tests rerun for this evidence-only addition.

## Final code SHA-256

```text
SHA256 index.html 54db0513e6aa6063c057f0f6780a2ccf4b54a6e8338addf17348f6c603515e39
SHA256 netlify/functions/navigator.mjs 3196dab6d35e157a4b6536076446e2d414621e8d4d9b24d937cfe3134a1332c9
SHA256 pwa-sw.js 0f2499c307702a3533d399fc720a0f991eb6674576cdf5155166022dbedc7ff6
SHA256 sw.js 45a4f093d7a19d4403cdaa5da0e6d6ae0a7ae497080fe92694046be789108d32
SHA256 package-lock.json 5b0869b9e2dbf38e834a5765dd7054c68616e1f214716f930486cff773cb8e8b
```

## Actual emitted final output excerpts (gate6)

These are verbatim stdout excerpts from final successful runs, not reconstructed outputs. Full local logs and review diffs remain in `/tmp/tops-weekend-evidence/`; the repository harnesses and commands above remain reproducible. No large app diff or policy corpus is duplicated here.

### openai-migration-final

```text
PASS: Navigator dry-run environment gate, validation, no client/store/provider, and request-flag rejection
PASS: RDM-175 and RDM-187..RDM-198 browser preflight, fixed senior profile, honest one-page exception, exact content, and negative layout controls
PASS: RDM-192 and RDM-195 actual LibreOffice DOCX rendering; one/two-page counts, fixed senior profile, substantive visible pages, exact renderer-extracted content, no clipping, and only the expected semantic role-boundary break
PASS: synthetic RDM-1..RDM-263 integration paths; all prior grounding, DOCX, federal, adaptive-length, guarded-stage, transport, browser-only civilian header, and federal hosted-preparation fixtures verified locally
```

### runtime-ai-spend-final

```text
PASS: runtime AI spend governance synthetic suite - modern withLambda wiring for Navigator and Resume, zero-config strong-consistency @netlify/blobs 10.7.13 loading, fixed prices, six stages, exact caps, executed 32,768-byte Navigator and 65,536-byte Resume boundaries, content-free budget/accounting failures, strict options, ledger initialization, corrupt-ledger denial, cutoff equality/overage, { modified } ETag CAS conflicts, concurrency, three-attempt failure, invalid/future months, max-safe counters, conservative settlement, one-way UTC rollover, four-call repair path, aggregate-only sentinel exclusion, seven fixed content-free phase diagnostics, three fixed blob-store-load subphase diagnostics, six fixed client-init subphase diagnostics, six fixed ledger-read subphase diagnostics, and executable RSG-15 through RSG-25 diagnostic-origin coverage
```

### sw-privacy-final

```text
PASS public build command produces the exact validated dist inventory
PASS dist excludes pilot, internal evidence, scripts, functions, docs, and package metadata
SW-PRIVACY REGRESSION PASS
```

### privacy-network-final

```text
PASS MIGRATED makes zero GA, Kit, or OneSignal requests across load, interactions, and reload
RUNTIME MIGRATED: 16 local/browser requests observed; provider count 0
PRIVACY-NETWORK REGRESSION PASS
```

### accessibility-release-final

```text
NETWORK target external attempts=0; blocking proxy contacts=154
SCOPE local browser automation only; manual assistive-technology and hosted release acceptance remain untested
LOCAL AUTOMATION PASS
```

### policy-content-final

```text
PASS V-2026-018 appears exactly once within its clone source
PASS V-2026-018 published record and any amendment remain within their main source
Policy content regression: PASS (96 assertions; 1110 parity vectors)
```

### alert-disabled

```text
PASS production OFF: granted permission, direct call, zero worker/locks/storage/show access; no callers
```

### alert-persistence

```text
PASS rejected native lock: explicit failure, no fallback or notification
PASS lock acquired only after readiness, held until show and finalization finish
35/35 PASS; stubbed locks and persistence only. Native browser concurrency, old-version contexts and iOS NOT certified.
```

### alert-browser

```text
Browser: 152.0.7977.82
index.html SHA256: 54db0513e6aa6063c057f0f6780a2ccf4b54a6e8338addf17348f6c603515e39
Exact extracted engine: 38440 bytes; native-lock reference: true
PASS two concurrent same-origin opens: exactly one show request
PASS successful delivery persists daily cap across a new page
PASS stale ETS: no show request or storage mutation
PASS denial: no state burn; subsequent grant can deliver
PASS failed show: no delivery-state burn; retry can deliver
PASS page loss during show: native lock releases; durable pending prevents repeat
PASS Web Locks unavailable: no show request or storage mutation
7/7 PASS
Scope: extracted browser engine; native localStorage + Web Locks; stubbed notification API. No React UI or real iPhone delivery proof.
```

### fleet-metering

```text
  PASS  empty input is not an error

ALL CHECKS PASSED
```

### build-public-final

```text
> node scripts/build-public.js

PUBLIC BUILD PASS: 22 files -> dist
```

### package-boundary

```text
26.1.0
14.7.1
4N PACKAGE PASS actual netlify.toml
4N PASS navigator openai=7.8.0 blobs=10.7.13 otel=6.0.6 runtime-utils=2.3.0
4N PASS resume openai=7.8.0 blobs=10.7.13 otel=6.0.6 runtime-utils=2.3.0
4N PASS jobs excludes all four package paths
```

### actionlint-version

```text
1.7.12
installed by downloading from release page
built with go1.26.1 compiler for darwin/arm64
```

### final-gate

```text
YAML PASS .github/workflows/j1-federal-scan.yml 20703 bytes 1 documents
YAML PASS .github/workflows/j2-weekly-analysis.yml 49560 bytes 1 documents
YAML PASS .github/workflows/j3-weekly-sitrep.yml 20981 bytes 1 documents
YAML PASS .github/workflows/j4-link-audit.yml 39875 bytes 1 documents
YAML PASS .github/workflows/j5-spend-check.yml 37182 bytes 1 documents
YAML PASS .github/workflows/pao-weekly-packet.yml 14715 bytes 1 documents
STRUCTURAL PASS {".json": 15, ".js": 16, ".cjs": 6, ".mjs": 2, "inline": 2} FAIL=0
PASS 12 workflow references pinned40hex
PASS added tracked code/text prohibited encoding zero
PASS app conflict markers zero
PASS unmerged index entries zero
```

## Remaining boundaries

Parent/Dean owns hosted identity/package/function acceptance, full origin-cache ledger and manual assistive-technology/phone evidence. None was executed or certified here. Local gates and a local merge commit do not authorize deployment. Row29 stays BLOCKED-POLICY as described above. No registry changes.
