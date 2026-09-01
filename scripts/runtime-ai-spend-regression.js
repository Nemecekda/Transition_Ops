"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const root = path.resolve(__dirname, "..");
const budgetPath = path.join(root, "netlify/functions/_shared/openai-budget.cjs");
const clientPath = path.join(root, "netlify/functions/_shared/openai-client.cjs");
const resumePath = path.join(root, "netlify/functions/resume.mjs");
const navigatorPath = path.join(root, "netlify/functions/navigator.mjs");
const { createSpendGuard, __testing } = require(budgetPath);
let entryClientFactory = null;
const entryHelperExports = Object.freeze({
  createOpenAIClient: function (stage) {
    assert.equal(typeof entryClientFactory, "function");
    return entryClientFactory(stage);
  },
  responseText: function (response) { return String(response.output_text || "").trim(); }
});

function useEntryClientFactory(factory) {
  entryClientFactory = factory;
  if (!require.cache[clientPath]) {
    require.cache[clientPath] = {
      id: clientPath,
      filename: clientPath,
      loaded: true,
      exports: entryHelperExports
    };
  }
}

const MONTH = "2026-08";
const NOW = new Date("2026-08-31T12:00:00.000Z");
const SENTINELS = [
  "PROMPT_SENTINEL_7Q",
  "RESUME_SENTINEL_7Q",
  "HEADER_SENTINEL_7Q",
  "LEDGER_SENTINEL_7Q",
  "TRACE_SENTINEL_7Q",
  "POSTING_SENTINEL_7Q",
  "TARGET_SENTINEL_7Q",
  "IDENTITY_SENTINEL_7Q",
  "IP_SENTINEL_7Q",
  "REQUEST_ID_SENTINEL_7Q",
  "RESPONSE_ID_SENTINEL_7Q",
  "MODEL_CONTENT_SENTINEL_7Q",
  "SECRET_SENTINEL_7Q",
  "COOKIE_SENTINEL_7Q",
  "STACK_SENTINEL_7Q",
  "PROVIDER_DATA_SENTINEL_7Q"
];

const DIAGNOSTIC_LINES = Object.freeze([
  "runtime-ai-spend phase=prepare",
  "runtime-ai-spend phase=blob_store_load",
  "runtime-ai-spend phase=ledger_read",
  "runtime-ai-spend phase=ledger_write",
  "runtime-ai-spend phase=client_init",
  "runtime-ai-spend phase=provider_call",
  "runtime-ai-spend phase=provider_result",
  "runtime-ai-spend phase=settlement"
]);

const BLOB_STORE_LOAD_SUBPHASE_LINES = Object.freeze([
  "runtime-ai-spend phase=blob_store_load subphase=module_load",
  "runtime-ai-spend phase=blob_store_load subphase=api_shape",
  "runtime-ai-spend phase=blob_store_load subphase=store_construct"
]);

const LEDGER_READ_SUBPHASE_LINES = Object.freeze([
  "runtime-ai-spend phase=ledger_read subphase=api_shape",
  "runtime-ai-spend phase=ledger_read subphase=strong_context",
  "runtime-ai-spend phase=ledger_read subphase=store_request",
  "runtime-ai-spend phase=ledger_read subphase=snapshot_shape",
  "runtime-ai-spend phase=ledger_read subphase=missing_etag",
  "runtime-ai-spend phase=ledger_read subphase=schema"
]);

const CONTENT_FREE_DIAGNOSTIC_LINES = Object.freeze(
  DIAGNOSTIC_LINES.concat(BLOB_STORE_LOAD_SUBPHASE_LINES, LEDGER_READ_SUBPHASE_LINES)
);

function clone(value) {
  return value === null || typeof value === "undefined" ? value : JSON.parse(JSON.stringify(value));
}

class FakeCasStore {
  constructor(record, options) {
    this.record = typeof record === "undefined" ? null : clone(record);
    this.options = options || {};
    this.version = this.record === null ? 0 : 1;
    this.etag = this.record === null ? null : "etag-1";
    this.getCalls = 0;
    this.setCalls = 0;
    this.writes = [];
    this.modifiedResults = [];
    this.pendingBarrierReads = [];
  }

  snapshot() {
    return this.record === null ? null : { data: clone(this.record), etag: this.etag };
  }

  async getWithMetadata(key, options) {
    this.getCalls += 1;
    assert.equal(key, __testing.RECORD_KEY);
    assert.deepEqual(options, { type: "json" });
    if (this.options.readUnavailable) throw this.options.readFailure || { code: "store_unavailable" };
    if (this.options.failGetAt === this.getCalls) throw this.options.readFailure || { code: "store_unavailable" };
    if (this.options.missingEtag && this.record !== null) return { data: clone(this.record) };
    const captured = this.snapshot();
    const barrierReads = this.options.barrierReads || 0;
    if (barrierReads && this.getCalls <= barrierReads) {
      return await new Promise((resolve) => {
        this.pendingBarrierReads.push(() => resolve(captured));
        if (this.pendingBarrierReads.length === barrierReads) {
          const releases = this.pendingBarrierReads.splice(0);
          releases.forEach((release) => release());
        }
      });
    }
    return captured;
  }

  async setJSON(key, record, options) {
    this.setCalls += 1;
    assert.equal(key, __testing.RECORD_KEY);
    this.writes.push({ key, record: clone(record), options: clone(options) });
    if (this.options.failSetAt === this.setCalls) throw this.options.writeFailure || { code: "store_unavailable" };
    if ((this.options.invalidSuccessShapeCount || 0) > 0) {
      this.options.invalidSuccessShapeCount -= 1;
      this.modifiedResults.push({});
      return {};
    }
    if ((this.options.conflictCount || 0) > 0) {
      this.options.conflictCount -= 1;
      this.modifiedResults.push({ modified: false });
      return { modified: false };
    }
    const eligible = options && options.onlyIfNew === true ? this.record === null :
      options && typeof options.onlyIfMatch === "string" ? options.onlyIfMatch === this.etag : false;
    if (!eligible) {
      this.modifiedResults.push({ modified: false });
      return { modified: false };
    }
    this.record = clone(record);
    this.version += 1;
    this.etag = "etag-" + this.version;
    this.modifiedResults.push({ modified: true });
    return { modified: true };
  }
}

function auditTextOption() {
  return {
    format: {
      type: "json_schema",
      name: "resume_quality_audit",
      strict: true,
      schema: { type: "object", properties: {}, additionalProperties: false }
    }
  };
}

function stageRequest(stage, changes) {
  const rule = __testing.STAGE_TABLE[stage];
  assert.ok(rule, "known synthetic stage");
  const request = {
    model: rule.model,
    instructions: "Synthetic instructions only.",
    input: "Synthetic input only.",
    max_output_tokens: rule.max_output_tokens,
    reasoning: { effort: "none" },
    store: false
  };
  if (stage === "resume_audit") request.text = auditTextOption();
  return Object.assign(request, changes || {});
}

function validUsage(changes) {
  const usage = {
    input_tokens: 10,
    input_tokens_details: { cached_tokens: 2, cache_write_tokens: 1 },
    output_tokens: 5
  };
  return Object.assign(usage, changes || {});
}

function completedResponse(changes) {
  return Object.assign({ status: "completed", output_text: "Synthetic output.", usage: validUsage() }, changes || {});
}

function harness(options) {
  const settings = options || {};
  const state = { providerCalls: 0, requests: [] };
  const store = settings.store || new FakeCasStore();
  const guard = createSpendGuard({
    store,
    now: settings.now || (() => NOW),
    providerCreate: async (request) => {
      state.providerCalls += 1;
      state.requests.push(request);
      if (settings.providerCreate) return await settings.providerCreate(request, store, state);
      return completedResponse();
    }
  });
  return { guard, store, state };
}

async function captureConsoleErrors(action) {
  const calls = [];
  const original = console.error;
  console.error = function () { calls.push(Array.from(arguments)); };
  try {
    const value = await action();
    return { value, calls };
  } finally {
    console.error = original;
  }
}

async function withBlobsModule(loader, action) {
  const originalLoad = Module._load;
  Module._load = function (request) {
    if (request === "@netlify/blobs") return loader();
    return originalLoad.apply(this, arguments);
  };
  try {
    return await action();
  } finally {
    Module._load = originalLoad;
  }
}

async function withOpenAIModule(loader, action) {
  const originalLoad = Module._load;
  const cachedClient = require.cache[clientPath];
  delete require.cache[clientPath];
  Module._load = function (request) {
    if (request === "openai") return loader();
    return originalLoad.apply(this, arguments);
  };
  try {
    return await action(require(clientPath));
  } finally {
    Module._load = originalLoad;
    delete require.cache[clientPath];
    if (cachedClient) require.cache[clientPath] = cachedClient;
  }
}

async function withBlobsContext(context, action) {
  const hadContext = Object.prototype.hasOwnProperty.call(globalThis, "netlifyBlobsContext");
  const previousContext = globalThis.netlifyBlobsContext;
  globalThis.netlifyBlobsContext = Buffer.from(JSON.stringify(context), "utf8").toString("base64");
  try {
    return await action();
  } finally {
    if (hadContext) globalThis.netlifyBlobsContext = previousContext;
    else delete globalThis.netlifyBlobsContext;
  }
}

function assertContentFreeDiagnostics(calls) {
  calls.forEach((call) => {
    assert.equal(call.length, 1);
    assert.ok(CONTENT_FREE_DIAGNOSTIC_LINES.indexOf(call[0]) !== -1);
  });
  const serialized = JSON.stringify(calls);
  SENTINELS.forEach((sentinel) => assert.doesNotMatch(serialized, new RegExp(sentinel)));
}

async function expectCode(action, code, expectedDiagnosticCount) {
  const captured = await captureConsoleErrors(() => assert.rejects(action, (error) => {
      assert.deepEqual(Object.keys(error), ["code"]);
      assert.equal(error.code, code);
      const serialized = JSON.stringify(error);
      SENTINELS.forEach((sentinel) => assert.doesNotMatch(serialized, new RegExp(sentinel)));
      return true;
  }));
  assertContentFreeDiagnostics(captured.calls);
  const expectedCount = Number.isInteger(expectedDiagnosticCount)
    ? expectedDiagnosticCount
    : (code === "budget_limit" ? 0 : 1);
  assert.equal(captured.calls.length, expectedCount);
  return captured.calls;
}

function seededLedger(changes) {
  return Object.assign(__testing.emptyLedger(MONTH), changes || {});
}

async function testContractTablesAndArithmetic() {
  assert.equal(__testing.CUTOFF_MICRO_USD, 4000000);
  assert.equal(__testing.STORE_NAME, "runtime-ai-spend-v1");
  assert.equal(__testing.CAS_ATTEMPTS, 3);
  assert.deepEqual(__testing.LEDGER_FIELDS, [
    "schema_version", "month_utc", "cutoff_micro_usd", "reserved_micro_usd",
    "settled_micro_usd", "admitted_call_count", "settled_call_count",
    "price_version", "halted"
  ]);
  assert.deepEqual(__testing.PRICE_TABLE["gpt-5.6-luna"], { input: 20, cached_input: 2, cache_write: 25, output: 120 });
  assert.deepEqual(__testing.PRICE_TABLE["gpt-5.6-terra"], { input: 200, cached_input: 20, cache_write: 250, output: 1200 });
  assert.deepEqual(Object.keys(__testing.STAGE_TABLE), ["navigator", "resume_facts", "resume_fact_repair", "resume_civilian", "resume_federal", "resume_audit"]);
  assert.equal(__testing.usageChargeMicroUsd(validUsage(), __testing.PRICE_TABLE["gpt-5.6-luna"]), 8);
  assert.equal(__testing.usageChargeMicroUsd(validUsage(), __testing.PRICE_TABLE["gpt-5.6-terra"]), 77);
  assert.equal(__testing.usageChargeMicroUsd({ input_tokens: 1, input_tokens_details: { cached_tokens: 1, cache_write_tokens: 0 }, output_tokens: 0 }, __testing.PRICE_TABLE["gpt-5.6-luna"]), 1);
  assert.equal(__testing.usageChargeMicroUsd({ input_tokens: 1, input_tokens_details: { cached_tokens: 0, cache_write_tokens: 0 }, output_tokens: 0 }, __testing.PRICE_TABLE["gpt-5.6-terra"]), 2);
  const prepared = __testing.prepareProviderRequest("resume_civilian", stageRequest("resume_civilian"));
  assert.equal(prepared.request_bytes, Buffer.byteLength(JSON.stringify(prepared.request), "utf8"));
  const expectedHundredths = prepared.request_bytes * 250 + 2200 * 1200;
  assert.equal(prepared.reservation_micro_usd, Math.ceil(expectedHundredths / 100));
  assert.deepEqual(
    { store: prepared.request.store, reasoning: prepared.request.reasoning, stream: prepared.request.stream, background: prepared.request.background },
    { store: false, reasoning: { effort: "none" }, stream: false, background: false }
  );
  const driftedPrices = Object.assign({}, __testing.PRICE_TABLE, { "gpt-5.6-terra": { input: 201, cached_input: 20, cache_write: 250, output: 1200, drift: 1 } });
  assert.throws(() => __testing.prepareProviderRequest("resume_civilian", stageRequest("resume_civilian"), driftedPrices), (error) => error.code === "upstream_unavailable");
  assert.equal(__testing.utcMonth(new Date("2026-12-31T23:59:59.999Z")), "2026-12");
  assert.equal(__testing.utcMonth(new Date("2027-01-01T00:00:00.000Z")), "2027-01");
  assert.equal(__testing.validMonthUtc("2026-01"), true);
  assert.equal(__testing.validMonthUtc("2026-12"), true);
  assert.equal(__testing.validMonthUtc("2026-00"), false);
  assert.equal(__testing.validMonthUtc("2026-13"), false);
}

async function testAllStagesAndCaps() {
  for (const stage of Object.keys(__testing.STAGE_TABLE)) {
    const accepted = harness();
    const response = await accepted.guard.create(stage, stageRequest(stage));
    assert.equal(response.status, "completed");
    assert.equal(accepted.state.providerCalls, 1);
    assert.equal(accepted.store.record.admitted_call_count, 1);
    assert.equal(accepted.store.record.settled_call_count, 1);
    assert.equal(accepted.store.record.reserved_micro_usd, 0);
    assert.deepEqual(Object.keys(accepted.store.record), __testing.LEDGER_FIELDS);

    const denied = harness();
    await expectCode(
      () => denied.guard.create(stage, stageRequest(stage, { max_output_tokens: __testing.STAGE_TABLE[stage].max_output_tokens + 1 })),
      "upstream_unavailable"
    );
    assert.equal(denied.state.providerCalls, 0);
    assert.equal(denied.store.setCalls, 0);
  }
}

async function testClosedOptionsAndModels() {
  const invalidRequests = [
    ["unknown_stage", stageRequest("navigator")],
    ["navigator", stageRequest("navigator", { model: "gpt-5.6-terra" })],
    ["navigator", stageRequest("navigator", { max_output_tokens: 0 })],
    ["navigator", Object.assign({}, stageRequest("navigator"), { tools: [] })],
    ["navigator", Object.assign({}, stageRequest("navigator"), { tool_choice: "auto" })],
    ["navigator", Object.assign({}, stageRequest("navigator"), { conversation: "synthetic" })],
    ["navigator", Object.assign({}, stageRequest("navigator"), { previous_response_id: "synthetic" })],
    ["navigator", Object.assign({}, stageRequest("navigator"), { metadata: {} })],
    ["navigator", Object.assign({}, stageRequest("navigator"), { user: "synthetic" })],
    ["navigator", Object.assign({}, stageRequest("navigator"), { safety_identifier: "synthetic" })],
    ["navigator", Object.assign({}, stageRequest("navigator"), { prompt_cache_key: "synthetic" })],
    ["navigator", Object.assign({}, stageRequest("navigator"), { maxRetries: 1 })],
    ["navigator", stageRequest("navigator", { store: true })],
    ["navigator", stageRequest("navigator", { stream: true })],
    ["navigator", stageRequest("navigator", { background: true })],
    ["navigator", stageRequest("navigator", { reasoning: { effort: "medium" } })],
    ["navigator", stageRequest("navigator", { text: auditTextOption() })],
    ["resume_audit", Object.assign({}, stageRequest("resume_audit"), { text: undefined })]
  ];
  for (const fixture of invalidRequests) {
    const denied = harness();
    await expectCode(() => denied.guard.create(fixture[0], fixture[1]), "upstream_unavailable");
    assert.equal(denied.state.providerCalls, 0);
    assert.equal(denied.store.setCalls, 0);
  }
}

async function testCutoffAndCas() {
  const request = stageRequest("navigator");
  const reservation = __testing.prepareProviderRequest("navigator", request).reservation_micro_usd;

  const equalityStore = new FakeCasStore(seededLedger({ settled_micro_usd: __testing.CUTOFF_MICRO_USD - reservation }));
  const equality = harness({ store: equalityStore });
  await equality.guard.create("navigator", request);
  assert.equal(equality.state.providerCalls, 1);

  const overStore = new FakeCasStore(seededLedger({ settled_micro_usd: __testing.CUTOFF_MICRO_USD - reservation + 1 }));
  const over = harness({ store: overStore });
  await expectCode(() => over.guard.create("navigator", request), "budget_limit");
  assert.equal(over.state.providerCalls, 0);
  assert.equal(over.store.setCalls, 0);

  const retryStore = new FakeCasStore(undefined, { conflictCount: 1 });
  const retry = harness({ store: retryStore });
  await retry.guard.create("navigator", request);
  assert.deepEqual(retry.store.modifiedResults.slice(0, 2), [{ modified: false }, { modified: true }]);
  assert.equal(retry.state.providerCalls, 1);

  const exhaustedStore = new FakeCasStore(undefined, { conflictCount: 3 });
  const exhausted = harness({ store: exhaustedStore });
  await expectCode(() => exhausted.guard.create("navigator", request), "upstream_unavailable");
  assert.equal(exhausted.store.setCalls, 3);
  assert.deepEqual(exhausted.store.modifiedResults, [{ modified: false }, { modified: false }, { modified: false }]);
  assert.equal(exhausted.state.providerCalls, 0);

  const invalidShapeStore = new FakeCasStore(undefined, { invalidSuccessShapeCount: 3 });
  const invalidShape = harness({ store: invalidShapeStore });
  await expectCode(() => invalidShape.guard.create("navigator", request), "upstream_unavailable");
  assert.equal(invalidShape.store.setCalls, 3);
  assert.equal(invalidShape.state.providerCalls, 0);

  const concurrentStore = new FakeCasStore(
    seededLedger({ settled_micro_usd: __testing.CUTOFF_MICRO_USD - reservation }),
    { barrierReads: 2 }
  );
  let concurrentProviderCalls = 0;
  function contender() {
    return createSpendGuard({
      store: concurrentStore,
      now: () => NOW,
      providerCreate: async () => { concurrentProviderCalls += 1; return completedResponse(); }
    }).create("navigator", request);
  }
  const results = await Promise.allSettled([contender(), contender()]);
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  const rejection = results.find((result) => result.status === "rejected");
  assert.equal(rejection.reason.code, "budget_limit");
  assert.equal(concurrentProviderCalls, 1);
  assert.ok(concurrentStore.record.settled_micro_usd + concurrentStore.record.reserved_micro_usd <= __testing.CUTOFF_MICRO_USD);
}

async function testPreCallAccountingFailures() {
  const request = stageRequest("navigator");
  const fixtures = [
    new FakeCasStore(undefined, { readUnavailable: true }),
    new FakeCasStore(Object.assign(seededLedger(), { unexpected: 1 })),
    new FakeCasStore(seededLedger({ price_version: "stale-price-version" })),
    new FakeCasStore(seededLedger(), { missingEtag: true })
  ];
  for (const store of fixtures) {
    const denied = harness({ store });
    await expectCode(() => denied.guard.create("navigator", request), "upstream_unavailable");
    assert.equal(denied.state.providerCalls, 0);
  }

  const invalidMonthStore = new FakeCasStore(seededLedger({ month_utc: "2026-13" }));
  const invalidMonth = harness({ store: invalidMonthStore });
  await expectCode(() => invalidMonth.guard.create("navigator", request), "upstream_unavailable");
  assert.equal(invalidMonth.state.providerCalls, 0);
  assert.equal(invalidMonth.store.setCalls, 0);
  assert.equal(invalidMonth.store.record.month_utc, "2026-13");

  const futureMonthStore = new FakeCasStore(seededLedger({ month_utc: "2026-09" }));
  const futureMonth = harness({ store: futureMonthStore });
  await expectCode(() => futureMonth.guard.create("navigator", request), "upstream_unavailable");
  assert.equal(futureMonth.state.providerCalls, 0);
  assert.equal(futureMonth.store.setCalls, 0);
  assert.equal(futureMonth.store.record.month_utc, "2026-09");

  const maxSafeCountStore = new FakeCasStore(seededLedger({ admitted_call_count: Number.MAX_SAFE_INTEGER }));
  const maxSafeCount = harness({ store: maxSafeCountStore });
  await expectCode(() => maxSafeCount.guard.create("navigator", request), "upstream_unavailable");
  assert.equal(maxSafeCount.state.providerCalls, 0);
  assert.equal(maxSafeCount.store.setCalls, 0);
  assert.equal(maxSafeCount.store.record.admitted_call_count, Number.MAX_SAFE_INTEGER);
}

async function testContentFreePhaseDiagnostics() {
  const request = stageRequest("navigator", { instructions: SENTINELS.join(" ") });

  const prepare = harness();
  const prepareCalls = await expectCode(
    () => prepare.guard.create("navigator", Object.assign({}, request, { max_output_tokens: 801 })),
    "upstream_unavailable"
  );
  assert.deepEqual(prepareCalls, [[DIAGNOSTIC_LINES[0]]]);
  assert.equal(prepare.state.providerCalls, 0);
  assert.equal(prepare.store.getCalls, 0);
  assert.equal(prepare.store.setCalls, 0);

  let blobProviderCalls = 0;
  const blobFailure = Object.assign(new Error(SENTINELS.join(" ")), {
    request_id: SENTINELS[9],
    response_id: SENTINELS[10]
  });
  const blobGuard = createSpendGuard({
    store: Promise.reject(blobFailure),
    now: () => NOW,
    providerCreate: async () => { blobProviderCalls += 1; return completedResponse(); }
  });
  const blobCalls = await expectCode(() => blobGuard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(blobCalls, [[DIAGNOSTIC_LINES[1]]]);
  assert.equal(blobProviderCalls, 0);

  let moduleLoadCalls = 0;
  let moduleProviderCalls = 0;
  const moduleCalls = await withBlobsModule(
    () => {
      moduleLoadCalls += 1;
      throw blobFailure;
    },
    () => {
      const guard = createSpendGuard({
        now: () => NOW,
        providerCreate: async () => { moduleProviderCalls += 1; return completedResponse(); }
      });
      return expectCode(() => guard.create("navigator", request), "upstream_unavailable");
    }
  );
  assert.deepEqual(moduleCalls, [[BLOB_STORE_LOAD_SUBPHASE_LINES[0]]]);
  assert.equal(moduleLoadCalls, 1);
  assert.equal(moduleProviderCalls, 0);

  let apiShapeLoadCalls = 0;
  let apiShapeProviderCalls = 0;
  const apiShapeCalls = await withBlobsModule(
    () => {
      apiShapeLoadCalls += 1;
      return { raw_error: blobFailure };
    },
    () => {
      const guard = createSpendGuard({
        now: () => NOW,
        providerCreate: async () => { apiShapeProviderCalls += 1; return completedResponse(); }
      });
      return expectCode(() => guard.create("navigator", request), "upstream_unavailable");
    }
  );
  assert.deepEqual(apiShapeCalls, [[BLOB_STORE_LOAD_SUBPHASE_LINES[1]]]);
  assert.equal(apiShapeLoadCalls, 1);
  assert.equal(apiShapeProviderCalls, 0);

  let storeConstructLoadCalls = 0;
  let storeConstructCalls = 0;
  let storeConstructOptions = null;
  let storeConstructProviderCalls = 0;
  const storeConstructDiagnosticCalls = await withBlobsModule(
    () => {
      storeConstructLoadCalls += 1;
      return {
        getStore: (options) => {
          storeConstructCalls += 1;
          storeConstructOptions = options;
          throw blobFailure;
        }
      };
    },
    () => {
      const guard = createSpendGuard({
        now: () => NOW,
        providerCreate: async () => { storeConstructProviderCalls += 1; return completedResponse(); }
      });
      return expectCode(() => guard.create("navigator", request), "upstream_unavailable");
    }
  );
  assert.deepEqual(storeConstructDiagnosticCalls, [[BLOB_STORE_LOAD_SUBPHASE_LINES[2]]]);
  assert.equal(storeConstructLoadCalls, 1);
  assert.equal(storeConstructCalls, 1);
  assert.deepEqual(storeConstructOptions, { name: "runtime-ai-spend-v1", consistency: "strong" });
  assert.equal(storeConstructProviderCalls, 0);

  const zeroConfigStore = new FakeCasStore();
  const zeroConfigSequence = [];
  let zeroConfigProviderCalls = 0;
  const zeroConfigCapture = await withBlobsModule(
    () => ({
      getStore: (options) => {
        zeroConfigSequence.push("getStore");
        assert.deepEqual(options, { name: "runtime-ai-spend-v1", consistency: "strong" });
        return zeroConfigStore;
      }
    }),
    () => {
      const guard = createSpendGuard({
        now: () => NOW,
        providerCreate: async () => { zeroConfigProviderCalls += 1; return completedResponse(); }
      });
      return captureConsoleErrors(() => guard.create("navigator", request));
    }
  );
  assert.deepEqual(zeroConfigSequence, ["getStore"]);
  assert.deepEqual(zeroConfigCapture.calls, []);
  assert.equal(zeroConfigProviderCalls, 1);

  const readFailure = Object.assign(new Error(SENTINELS.join(" ")), {
    request_id: SENTINELS[9],
    response_id: SENTINELS[10]
  });
  const readStore = new FakeCasStore(undefined, { readUnavailable: true, readFailure });
  const read = harness({ store: readStore });
  const readCalls = await expectCode(() => read.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(readCalls, [[LEDGER_READ_SUBPHASE_LINES[2]]]);
  assert.equal(read.state.providerCalls, 0);
  assert.equal(read.store.setCalls, 0);

  let readApiShapeProviderCalls = 0;
  const apiShapeReadGuard = createSpendGuard({
    store: { getWithMetadata: async () => null },
    now: () => NOW,
    providerCreate: async () => { readApiShapeProviderCalls += 1; return completedResponse(); }
  });
  const apiShapeReadCalls = await expectCode(
    () => apiShapeReadGuard.create("navigator", request),
    "upstream_unavailable"
  );
  assert.deepEqual(apiShapeReadCalls, [[LEDGER_READ_SUBPHASE_LINES[0]]]);
  assert.equal(readApiShapeProviderCalls, 0);

  let strongContextProviderCalls = 0;
  const strongContextCalls = await withBlobsContext(
    { siteID: SENTINELS[8], token: SENTINELS[9], edgeURL: "https://example.invalid" },
    () => {
      const guard = createSpendGuard({
        now: () => NOW,
        providerCreate: async () => { strongContextProviderCalls += 1; return completedResponse(); }
      });
      return expectCode(() => guard.create("navigator", request), "upstream_unavailable");
    }
  );
  assert.deepEqual(strongContextCalls, [[LEDGER_READ_SUBPHASE_LINES[1]]]);
  assert.equal(strongContextProviderCalls, 0);

  const malformedSnapshotStore = new FakeCasStore();
  malformedSnapshotStore.getWithMetadata = async () => ({ unexpected: SENTINELS[3] });
  const malformedSnapshot = harness({ store: malformedSnapshotStore });
  const malformedSnapshotCalls = await expectCode(
    () => malformedSnapshot.guard.create("navigator", request),
    "upstream_unavailable"
  );
  assert.deepEqual(malformedSnapshotCalls, [[LEDGER_READ_SUBPHASE_LINES[3]]]);
  assert.equal(malformedSnapshot.state.providerCalls, 0);
  assert.equal(malformedSnapshot.store.setCalls, 0);

  const missingEtag = harness({ store: new FakeCasStore(seededLedger(), { missingEtag: true }) });
  const missingEtagCalls = await expectCode(
    () => missingEtag.guard.create("navigator", request),
    "upstream_unavailable"
  );
  assert.deepEqual(missingEtagCalls, [[LEDGER_READ_SUBPHASE_LINES[4]]]);
  assert.equal(missingEtag.state.providerCalls, 0);
  assert.equal(missingEtag.store.setCalls, 0);

  const invalidSchema = harness({
    store: new FakeCasStore(Object.assign(seededLedger(), { unexpected: SENTINELS[3] }))
  });
  const invalidSchemaCalls = await expectCode(
    () => invalidSchema.guard.create("navigator", request),
    "upstream_unavailable"
  );
  assert.deepEqual(invalidSchemaCalls, [[LEDGER_READ_SUBPHASE_LINES[5]]]);
  assert.equal(invalidSchema.state.providerCalls, 0);
  assert.equal(invalidSchema.store.setCalls, 0);

  const writeFailure = Object.assign(new Error(SENTINELS.join(" ")), {
    request_id: SENTINELS[9],
    response_id: SENTINELS[10]
  });
  const writeStore = new FakeCasStore(undefined, { failSetAt: 1, writeFailure });
  const write = harness({ store: writeStore });
  const writeCalls = await expectCode(() => write.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(writeCalls, [[DIAGNOSTIC_LINES[3]]]);
  assert.equal(write.state.providerCalls, 0);
  assert.equal(write.store.setCalls, 1);

  const exhausted = harness({ store: new FakeCasStore(undefined, { conflictCount: 3 }) });
  const exhaustedCalls = await expectCode(
    () => exhausted.guard.create("navigator", request),
    "upstream_unavailable"
  );
  assert.deepEqual(exhaustedCalls, [[DIAGNOSTIC_LINES[3]]]);
  assert.equal(exhausted.state.providerCalls, 0);
  assert.equal(exhausted.store.setCalls, 3);

  const recovered = harness({ store: new FakeCasStore(undefined, { conflictCount: 1 }) });
  const recoveredCapture = await captureConsoleErrors(() => recovered.guard.create("navigator", request));
  assertContentFreeDiagnostics(recoveredCapture.calls);
  assert.deepEqual(recoveredCapture.calls, []);
  assert.equal(recovered.state.providerCalls, 1);

  const settlementStore = new FakeCasStore(undefined, { failSetAt: 2, writeFailure });
  const settlement = harness({ store: settlementStore });
  const settlementCalls = await expectCode(
    () => settlement.guard.create("navigator", request),
    "upstream_unavailable"
  );
  assert.deepEqual(settlementCalls, [[DIAGNOSTIC_LINES[3]]]);
  assert.equal(settlement.state.providerCalls, 1);
  assert.ok(settlement.store.record.reserved_micro_usd > 0);
  assert.equal(settlement.store.record.settled_micro_usd, 0);

  const success = harness();
  const successCapture = await captureConsoleErrors(() => success.guard.create("navigator", request));
  assertContentFreeDiagnostics(successCapture.calls);
  assert.deepEqual(successCapture.calls, []);
  assert.equal(success.state.providerCalls, 1);

  const reservation = __testing.prepareProviderRequest("navigator", request).reservation_micro_usd;
  const budget = harness({
    store: new FakeCasStore(seededLedger({ settled_micro_usd: __testing.CUTOFF_MICRO_USD - reservation + 1 }))
  });
  const budgetCalls = await expectCode(() => budget.guard.create("navigator", request), "budget_limit");
  assert.deepEqual(budgetCalls, []);
  assert.equal(budget.state.providerCalls, 0);

  const provider = harness({ providerCreate: async () => { throw new Error(SENTINELS.join(" ")); } });
  const providerCalls = await expectCode(() => provider.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(providerCalls, [[DIAGNOSTIC_LINES[5]]]);
  assert.equal(provider.state.providerCalls, 1);
}

function sentinelFailure(changes) {
  const failure = new Error(SENTINELS.join(" "));
  failure.stack = SENTINELS[14];
  return Object.assign(failure, {
    secret: SENTINELS[12],
    cookie: SENTINELS[13],
    provider_data: SENTINELS[15],
    request_id: SENTINELS[9],
    response_id: SENTINELS[10],
    request: { content: SENTINELS[0] },
    response: { content: SENTINELS[1] }
  }, changes || {});
}

async function testRsg15PhaseCompleteness() {
  assert.deepEqual(__testing.DIAGNOSTIC_PHASES, [
    "prepare", "blob_store_load", "ledger_read", "ledger_write",
    "client_init", "provider_call", "provider_result", "settlement"
  ]);
  const request = stageRequest("navigator", { instructions: SENTINELS.join(" ") });

  const prepare = harness();
  const prepareCalls = await expectCode(
    () => prepare.guard.create("navigator", Object.assign({}, request, { max_output_tokens: 801 })),
    "upstream_unavailable"
  );
  assert.deepEqual(prepareCalls, [[DIAGNOSTIC_LINES[0]]]);
  assert.equal(prepare.state.providerCalls, 0);

  let blobProviderCalls = 0;
  const blobGuard = createSpendGuard({
    store: Promise.reject(sentinelFailure()),
    now: () => NOW,
    providerCreate: async () => { blobProviderCalls += 1; return completedResponse(); }
  });
  const blobCalls = await expectCode(() => blobGuard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(blobCalls, [[DIAGNOSTIC_LINES[1]]]);
  assert.equal(blobProviderCalls, 0);

  const ledgerRead = harness({
    store: new FakeCasStore(undefined, { readUnavailable: true, readFailure: sentinelFailure() })
  });
  const ledgerReadCalls = await expectCode(() => ledgerRead.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(ledgerReadCalls, [[LEDGER_READ_SUBPHASE_LINES[2]]]);
  assert.equal(ledgerRead.state.providerCalls, 0);

  const ledgerWrite = harness({
    store: new FakeCasStore(undefined, { failSetAt: 1, writeFailure: sentinelFailure() })
  });
  const ledgerWriteCalls = await expectCode(() => ledgerWrite.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(ledgerWriteCalls, [[DIAGNOSTIC_LINES[3]]]);
  assert.equal(ledgerWrite.state.providerCalls, 0);

  const clientInitCalls = await withOpenAIModule(
    () => function FailingOpenAI() { throw sentinelFailure(); },
    (clientModule) => expectCode(
      () => Promise.resolve().then(() => clientModule.createOpenAIClient("navigator")),
      "upstream_unavailable"
    )
  );
  assert.deepEqual(clientInitCalls, [[DIAGNOSTIC_LINES[4]]]);

  const provider = harness({ providerCreate: async () => { throw sentinelFailure(); } });
  const providerCalls = await expectCode(() => provider.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(providerCalls, [[DIAGNOSTIC_LINES[5]]]);
  assert.equal(provider.state.providerCalls, 1);

  const providerBudget = harness({
    providerCreate: async () => { throw sentinelFailure({ code: "insufficient_quota" }); }
  });
  const providerBudgetCalls = await expectCode(
    () => providerBudget.guard.create("navigator", request),
    "budget_limit"
  );
  assert.deepEqual(providerBudgetCalls, []);
  assert.equal(providerBudget.state.providerCalls, 1);

  for (const fixture of [
    [sentinelFailure({ status: 429 }), "rate_limit"],
    [sentinelFailure({ code: "ETIMEDOUT" }), "timeout"]
  ]) {
    const categorized = harness({ providerCreate: async () => { throw fixture[0]; } });
    const categorizedCalls = await expectCode(
      () => categorized.guard.create("navigator", request),
      fixture[1],
      1
    );
    assert.deepEqual(categorizedCalls, [[DIAGNOSTIC_LINES[5]]]);
    assert.equal(categorized.state.providerCalls, 1);
  }

  const providerResult = harness({
    providerCreate: async () => ({
      status: "incomplete",
      incomplete_details: { reason: "server_error" },
      output_text: SENTINELS.join(" "),
      provider_data: SENTINELS[15]
    })
  });
  const providerResultCapture = await captureConsoleErrors(() => providerResult.guard.create("navigator", request));
  assertContentFreeDiagnostics(providerResultCapture.calls);
  assert.deepEqual(providerResultCapture.calls, [[DIAGNOSTIC_LINES[6]]]);
  assert.deepEqual(providerResultCapture.value, {
    status: "incomplete",
    incomplete_details: { reason: "server_error" }
  });
  assert.equal(providerResult.state.providerCalls, 1);

  const settlement = harness({
    providerCreate: async (providerRequest, store) => {
      store.record.reserved_micro_usd = 0;
      return completedResponse();
    }
  });
  const settlementCalls = await expectCode(() => settlement.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(settlementCalls, [[DIAGNOSTIC_LINES[7]]]);
  assert.equal(settlement.state.providerCalls, 1);
}

async function testRsg16SentinelExclusion() {
  const request = stageRequest("navigator", { instructions: SENTINELS.join(" ") });
  const provider = harness({ providerCreate: async () => { throw sentinelFailure(); } });
  const providerCalls = await expectCode(() => provider.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(providerCalls, [[DIAGNOSTIC_LINES[5]]]);
  assertContentFreeDiagnostics(providerCalls);

  const unusable = harness({
    providerCreate: async () => completedResponse({
      output_text: "   ",
      provider_data: SENTINELS[15],
      id: SENTINELS[10]
    })
  });
  const reservation = __testing.prepareProviderRequest("navigator", request).reservation_micro_usd;
  const unusableCapture = await captureConsoleErrors(() => unusable.guard.create("navigator", request));
  assertContentFreeDiagnostics(unusableCapture.calls);
  assert.deepEqual(unusableCapture.calls, [[DIAGNOSTIC_LINES[6]]]);
  assert.equal(unusableCapture.value.output_text, "   ");
  assert.equal(unusable.store.record.reserved_micro_usd, 0);
  assert.equal(unusable.store.record.settled_micro_usd, reservation);
  const publicSurface = JSON.stringify({ code: "upstream_unavailable", result: { status: "incomplete" } });
  SENTINELS.forEach((sentinel) => assert.doesNotMatch(publicSurface, new RegExp(sentinel)));
}

async function testRsg17TerminalPrecedence() {
  const request = stageRequest("navigator", { instructions: SENTINELS.join(" ") });

  const readStore = new FakeCasStore(undefined, { failGetAt: 2, readFailure: sentinelFailure() });
  const terminalRead = harness({
    store: readStore,
    providerCreate: async () => { throw sentinelFailure(); }
  });
  const readCalls = await expectCode(() => terminalRead.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(readCalls, [[LEDGER_READ_SUBPHASE_LINES[2]]]);
  assert.equal(terminalRead.state.providerCalls, 1);
  assert.ok(readStore.record.reserved_micro_usd > 0);
  assert.equal(readStore.record.settled_micro_usd, 0);

  const writeStore = new FakeCasStore(undefined, { failSetAt: 2, writeFailure: sentinelFailure() });
  const terminalWrite = harness({
    store: writeStore,
    providerCreate: async () => { throw sentinelFailure(); }
  });
  const writeCalls = await expectCode(() => terminalWrite.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(writeCalls, [[DIAGNOSTIC_LINES[3]]]);
  assert.equal(terminalWrite.state.providerCalls, 1);
  assert.ok(writeStore.record.reserved_micro_usd > 0);
  assert.equal(writeStore.record.settled_micro_usd, 0);
}

async function testRsg18SilenceAndDrift() {
  const request = stageRequest("navigator");
  const success = harness();
  const successCapture = await captureConsoleErrors(() => success.guard.create("navigator", request));
  assertContentFreeDiagnostics(successCapture.calls);
  assert.deepEqual(successCapture.calls, []);
  assert.equal(success.state.providerCalls, 1);

  const reservation = __testing.prepareProviderRequest("navigator", request).reservation_micro_usd;
  const cutoff = harness({
    store: new FakeCasStore(seededLedger({ settled_micro_usd: __testing.CUTOFF_MICRO_USD - reservation + 1 }))
  });
  const cutoffCalls = await expectCode(() => cutoff.guard.create("navigator", request), "budget_limit");
  assert.deepEqual(cutoffCalls, []);
  assert.equal(cutoff.state.providerCalls, 0);

  for (const phase of ["client_init", "provider_call", "provider_result", "settlement"]) {
    const tagged = __testing.diagnosticFailure(phase);
    assert.equal(__testing.diagnosticPhase(tagged), phase);
    assert.equal(__testing.diagnosticSubphase(tagged), "");
    const rejectedSubphase = __testing.diagnosticFailure(phase, "not_allowed");
    assert.equal(__testing.diagnosticPhase(rejectedSubphase), "");
    assert.equal(__testing.diagnosticSubphase(rejectedSubphase), "");
  }

  const budgetSource = fs.readFileSync(budgetPath, "utf8");
  const clientSource = fs.readFileSync(clientPath, "utf8");
  const markerArguments = Array.from(
    budgetSource.matchAll(/console\.error\(([^;\n]+)\);/g),
    (match) => match[1].trim()
  );
  assert.equal(markerArguments.length, CONTENT_FREE_DIAGNOSTIC_LINES.length);
  markerArguments.forEach((argument) => assert.match(argument, /^"[^"]+"$/));
  assert.deepEqual(
    markerArguments.map((argument) => JSON.parse(argument)).sort(),
    CONTENT_FREE_DIAGNOSTIC_LINES.slice().sort()
  );
  assert.match(budgetSource, /let failurePhase = "prepare";/);
  for (const phase of ["blob_store_load", "ledger_read", "provider_call", "provider_result", "settlement"]) {
    assert.match(budgetSource, new RegExp("failurePhase = \\\"" + phase + "\\\";"));
  }
  assert.match(budgetSource, /throw diagnosticFailure\(failurePhase, undefined, safeCode\);/);
  assert.match(clientSource, /throw clientInitializationFailure\(\);/);
  assert.doesNotMatch(clientSource, /console\.(?:error|warn|log)\(/);
}

async function testFailureAndConservativeSettlement() {
  const request = stageRequest("navigator");
  const reservation = __testing.prepareProviderRequest("navigator", request).reservation_micro_usd;

  const crashStore = new FakeCasStore();
  await __testing.admitReservation(crashStore, MONTH, reservation);
  assert.equal(crashStore.record.reserved_micro_usd, reservation);
  assert.equal(crashStore.record.settled_micro_usd, 0);
  assert.equal(crashStore.record.admitted_call_count, 1);
  assert.equal(crashStore.record.settled_call_count, 0);

  const providerFailure = harness({
    providerCreate: async () => { throw new Error(SENTINELS.join(" ")); }
  });
  await expectCode(() => providerFailure.guard.create("navigator", request), "upstream_unavailable");
  assert.equal(providerFailure.store.record.reserved_micro_usd, 0);
  assert.equal(providerFailure.store.record.settled_micro_usd, reservation);
  assert.equal(providerFailure.store.record.settled_call_count, 1);

  const incomplete = harness({
    providerCreate: async () => ({
      status: "incomplete",
      incomplete_details: { reason: "max_output_tokens" },
      output_text: SENTINELS[0],
      id: SENTINELS[9]
    })
  });
  const incompleteCapture = await captureConsoleErrors(() => incomplete.guard.create("navigator", request));
  const incompleteResult = incompleteCapture.value;
  assertContentFreeDiagnostics(incompleteCapture.calls);
  assert.deepEqual(incompleteCapture.calls, [[DIAGNOSTIC_LINES[6]]]);
  assert.deepEqual(incompleteResult, { status: "incomplete", incomplete_details: { reason: "max_output_tokens" } });
  assert.equal(incomplete.store.record.settled_micro_usd, reservation);

  for (const response of [
    { status: "completed", output_text: "Synthetic output." },
    completedResponse({ usage: { input_tokens: 10, input_tokens_details: { cached_tokens: 11, cache_write_tokens: 0 }, output_tokens: 1 } })
  ]) {
    const missingUsage = harness({ providerCreate: async () => response });
    const missingUsageCapture = await captureConsoleErrors(() => missingUsage.guard.create("navigator", request));
    const released = missingUsageCapture.value;
    assertContentFreeDiagnostics(missingUsageCapture.calls);
    assert.deepEqual(missingUsageCapture.calls, []);
    assert.equal(released.status, "completed");
    assert.equal(missingUsage.store.record.settled_micro_usd, reservation);
    assert.equal(missingUsage.store.record.reserved_micro_usd, 0);
  }

  const settlementFaultStore = new FakeCasStore(undefined, { failSetAt: 2 });
  const settlementFault = harness({ store: settlementFaultStore });
  await expectCode(() => settlementFault.guard.create("navigator", request), "upstream_unavailable");
  assert.equal(settlementFault.state.providerCalls, 1);
  assert.equal(settlementFault.store.record.reserved_micro_usd, reservation);
  assert.equal(settlementFault.store.record.settled_micro_usd, 0);

  const overUsage = harness({
    providerCreate: async () => completedResponse({
      usage: { input_tokens: 1, input_tokens_details: { cached_tokens: 0, cache_write_tokens: 0 }, output_tokens: reservation * 100 }
    })
  });
  const overUsageCalls = await expectCode(() => overUsage.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(overUsageCalls, [[DIAGNOSTIC_LINES[6]]]);
  assert.equal(overUsage.store.record.halted, true);
  assert.equal(overUsage.store.record.reserved_micro_usd, 0);
  assert.equal(overUsage.store.record.settled_micro_usd, reservation);

  const impossible = harness({
    providerCreate: async (providerRequest, store) => {
      store.record.reserved_micro_usd = 0;
      return completedResponse();
    }
  });
  const impossibleCalls = await expectCode(() => impossible.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(impossibleCalls, [[DIAGNOSTIC_LINES[7]]]);
  assert.equal(impossible.store.record.halted, true);
}

async function testUtcRolloverAndLateSettlement() {
  const request = stageRequest("navigator");
  const reservation = __testing.prepareProviderRequest("navigator", request).reservation_micro_usd;
  const store = new FakeCasStore();
  const januaryAdmission = await __testing.admitReservation(store, "2026-01", reservation);
  const februaryReservation = reservation + 1;
  await __testing.admitReservation(store, "2026-02", februaryReservation);
  const beforeLate = clone(store.record);
  const late = await __testing.settleReservation(store, januaryAdmission, 1, false, false);
  assert.equal(late.late_month, true);
  assert.deepEqual(store.record, beforeLate);
  assert.equal(store.record.month_utc, "2026-02");
  assert.equal(store.record.reserved_micro_usd, februaryReservation);

  const olderStore = new FakeCasStore(seededLedger({ month_utc: "2026-01", reserved_micro_usd: reservation, admitted_call_count: 1 }));
  const olderBefore = clone(olderStore.record);
  await expectCode(
    () => __testing.settleReservation(olderStore, { month_utc: "2026-02", reservation_micro_usd: reservation }, 1, false, false),
    "upstream_unavailable",
    0
  );
  assert.deepEqual(olderStore.record, olderBefore);
  assert.equal(olderStore.setCalls, 0);
}

async function testFourCallPathAndSentinelExclusion() {
  const store = new FakeCasStore();
  const stages = ["resume_facts", "resume_fact_repair", "resume_civilian", "resume_audit"];
  const seen = [];
  for (const stage of stages) {
    const guard = createSpendGuard({
      store,
      now: () => NOW,
      providerCreate: async (request) => {
        seen.push({ stage, request });
        return completedResponse({ id: SENTINELS[10], output_text: SENTINELS[11] });
      }
    });
    const request = stageRequest(stage, {
      instructions: SENTINELS.slice(0, 6).join(" "),
      input: SENTINELS.slice(6).join(" ")
    });
    await guard.create(stage, request);
  }
  assert.deepEqual(seen.map((item) => item.stage), stages);
  assert.equal(store.record.admitted_call_count, 4);
  assert.equal(store.record.settled_call_count, 4);
  assert.equal(store.record.reserved_micro_usd, 0);
  assert.deepEqual(Object.keys(store.record), __testing.LEDGER_FIELDS);
  const persistedSurface = JSON.stringify({
    storeName: __testing.STORE_NAME,
    key: __testing.RECORD_KEY,
    record: store.record,
    writes: store.writes
  });
  SENTINELS.forEach((sentinel) => assert.doesNotMatch(persistedSurface, new RegExp(sentinel)));
  assert.doesNotMatch(__testing.STORE_NAME + " " + __testing.RECORD_KEY, /prompt|resume|header|ledger|trace|posting|target|identity|request|response|model|client|device|cookie|stage/i);

  const request = stageRequest("navigator", { instructions: SENTINELS.join(" ") });
  const reservation = __testing.prepareProviderRequest("navigator", request).reservation_micro_usd;
  const denied = harness({ store: new FakeCasStore(seededLedger({ settled_micro_usd: __testing.CUTOFF_MICRO_USD - reservation + 1 })) });
  await expectCode(() => denied.guard.create("navigator", request), "budget_limit");
  assert.equal(denied.state.providerCalls, 0);
}

function bodyAtBytes(targetBytes) {
  const body = {
    action: "facts",
    target: "Program Analyst",
    experience: "Synthetic planning duties described in a complete sentence.",
    padding: ""
  };
  const base = Buffer.byteLength(JSON.stringify(body), "utf8");
  assert.ok(base <= targetBytes);
  body.padding = "x".repeat(targetBytes - base);
  const serialized = JSON.stringify(body);
  assert.equal(Buffer.byteLength(serialized, "utf8"), targetBytes);
  return serialized;
}

async function testResumeBodyBoundaryAndStageWiring() {
  const stages = [];
  const factSheet = "ROLE 1\nJOB TITLE (EXACT): Synthetic Planner\nEMPLOYER OR UNIT (EXACT): Synthetic Unit\nLOCATION (EXACT OR MISSING): MISSING\nDATES (EXACT OR MISSING): MISSING\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Performed synthetic planning duties.\n\nEDUCATION (EXACT OR MISSING): MISSING\nCERTIFICATIONS (EXACT OR MISSING): MISSING\nSKILLS AND TOOLS (EXACT OR MISSING): Planning\nNUMBERS AND SCALE (EXACT OR MISSING): MISSING\nTARGET ROLE (EXACT OR MISSING): Program Analyst";
  useEntryClientFactory((stage) => {
    stages.push(stage);
    return { responses: { create: async () => ({ status: "completed", output_text: factSheet }) } };
  });
  const resume = await import(pathToFileURL(resumePath).href + "?runtime-ai-spend-resume");
  assert.equal(typeof resume.default, "function");
  assert.equal(typeof resume.lambdaHandler, "function");
  const modernOptions = await resume.default(new Request("https://clone.invalid/.netlify/functions/resume", {
    method: "OPTIONS"
  }), { requestId: "synthetic-resume-options" });
  assert.equal(modernOptions.status, 204);
  assert.equal(await modernOptions.text(), "");
  assert.equal(modernOptions.headers.get("access-control-allow-origin"), "https://transitionops.org");
  const exact = await resume.lambdaHandler({ httpMethod: "POST", body: bodyAtBytes(65536) });
  assert.equal(exact.statusCode, 200);
  assert.deepEqual(stages, ["resume_facts"]);
  const beforeOverage = stages.length;
  const over = await resume.lambdaHandler({ httpMethod: "POST", body: bodyAtBytes(65537) });
  assert.equal(over.statusCode, 413);
  assert.deepEqual(JSON.parse(over.body), { error: "Request is too large." });
  assert.equal(stages.length, beforeOverage);

  const resumeSource = fs.readFileSync(resumePath, "utf8");
  const clientSource = fs.readFileSync(clientPath, "utf8");
  assert.match(resumeSource, /"resume_facts"[\s\S]*"resume_federal"[\s\S]*"resume_civilian"/);
  assert.match(resumeSource, /createOpenAIClient\(primaryStage\)/);
  assert.match(resumeSource, /createOpenAIClient\("resume_fact_repair"\)/);
  assert.match(resumeSource, /createOpenAIClient\("resume_audit"\)/);
  assert.doesNotMatch(resumeSource, /createOpenAIClient\(\)/);
  assert.match(resumeSource, /import \{ withLambda \} from "@netlify\/aws-lambda-compat";/);
  assert.match(resumeSource, /export const lambdaHandler = async/);
  assert.match(resumeSource, /export default withLambda\(lambdaHandler\);/);
  assert.doesNotMatch(resumeSource, /\bexport\s+const\s+handler\b/);
  assert.doesNotMatch(resumeSource, /exports\.handler/);
  assert.match(resumeSource, /const RESUME_BODY_MAX_BYTES = 65536/);
  assert.doesNotMatch(resumeSource, /nothing stored|nothing logged|EXTERNAL_MONTHLY_HARD_CAP_STATUS|PROVIDER_PROJECT_CONTROL_STATUS|AUDIT_INCREMENTAL_CEILING_USD|BROWSER_DAILY_AUDIT_CEILING_USD|UNVERIFIED/i);
  assert.match(resumeSource, /Dated provider-account evidence and the repository spend guard are distinct controls/);
  assert.match(clientSource, /function createOpenAIClient\(stage\)/);
  assert.doesNotMatch(clientSource, /lambdaEvent|connectLambda/);
  assert.match(clientSource, /maxRetries: 0/);
  assert.match(clientSource, /guard\.create\(stage, request\)/);
  assert.doesNotMatch(clientSource, /return new OpenAI/);
  assert.match(clientSource, /module\.exports = \{ createOpenAIClient, responseText \}/);
}

async function testNavigatorBodyBoundaryAndStageWiring() {
  const stages = [];
  const guardedRequests = [];
  const guardedFailures = [];
  let providerCalls = 0;
  useEntryClientFactory((stage) => {
    stages.push(stage);
    return {
      responses: {
        create: async (request) => {
          guardedRequests.push(request);
          if (guardedFailures.length) throw guardedFailures.shift();
          providerCalls += 1;
          return { status: "completed", output_text: "Synthetic Navigator response." };
        }
      }
    };
  });
  const navigator = await import(pathToFileURL(navigatorPath).href + "?runtime-ai-spend-navigator");
  assert.equal(typeof navigator.default, "function");
  assert.equal(typeof navigator.lambdaHandler, "function");
  const modernOptions = await navigator.default(new Request("https://clone.invalid/.netlify/functions/navigator", {
    method: "OPTIONS"
  }), { requestId: "synthetic-navigator-options" });
  assert.equal(modernOptions.status, 204);
  assert.equal(await modernOptions.text(), "");
  assert.equal(modernOptions.headers.get("access-control-allow-origin"), "https://transitionops.org");
  function navigatorBodyAtBytes(targetBytes) {
    const body = { messages: [{ role: "user", content: "Synthetic request." }], padding: "" };
    const base = Buffer.byteLength(JSON.stringify(body), "utf8");
    assert.ok(base <= targetBytes);
    body.padding = "x".repeat(targetBytes - base);
    const serialized = JSON.stringify(body);
    assert.equal(Buffer.byteLength(serialized, "utf8"), targetBytes);
    return serialized;
  }
  async function assertNavigatorGuardFailure(thrownError, expectedCategory) {
    const stagesBeforeFailure = stages.length;
    const guardedRequestsBeforeFailure = guardedRequests.length;
    const providerCallsBeforeFailure = providerCalls;
    guardedFailures.push(thrownError);
    const failure = await navigator.lambdaHandler({
      httpMethod: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "Synthetic guarded failure request." }] })
    });
    assert.equal(failure.statusCode, 502);
    const failureBody = JSON.parse(failure.body);
    assert.deepEqual(Object.keys(failureBody), ["error", "reasonCategory"]);
    assert.ok(["budget_limit", "upstream_unavailable"].includes(failureBody.reasonCategory));
    assert.equal(failureBody.reasonCategory, expectedCategory);
    assert.equal(
      failureBody.error,
      expectedCategory === "budget_limit"
        ? "The Navigator has reached its monthly limit. Try again next month."
        : "The Navigator is briefly unavailable. Try again in a moment."
    );
    assert.deepEqual(stages.slice(stagesBeforeFailure), ["navigator"]);
    assert.equal(guardedRequests.length - guardedRequestsBeforeFailure, 1);
    assert.equal(providerCalls, providerCallsBeforeFailure);
    const serializedFailure = JSON.stringify(failureBody);
    SENTINELS.forEach((sentinel) => assert.doesNotMatch(serializedFailure, new RegExp(sentinel)));
    assert.doesNotMatch(serializedFailure, /accounting_fault|raw accounting detail|stack|request_id|response_id/i);
  }

  const exact = await navigator.lambdaHandler({ httpMethod: "POST", body: navigatorBodyAtBytes(32768) });
  assert.equal(exact.statusCode, 200);
  assert.deepEqual(stages, ["navigator"]);
  assert.equal(providerCalls, 1);
  const stageCountBeforeOverage = stages.length;
  const providerCallsBeforeOverage = providerCalls;
  const over = await navigator.lambdaHandler({ httpMethod: "POST", body: navigatorBodyAtBytes(32769) });
  assert.equal(over.statusCode, 413);
  assert.deepEqual(JSON.parse(over.body), { error: "Request too large" });
  assert.equal(stages.length, stageCountBeforeOverage);
  assert.equal(providerCalls, providerCallsBeforeOverage);

  await assertNavigatorGuardFailure({ code: "budget_limit" }, "budget_limit");
  const accountingError = Object.assign(new Error("raw accounting detail " + SENTINELS.join(" ")), {
    code: "accounting_fault",
    request_id: "REQUEST_ID_SENTINEL_7Q",
    response_id: "RESPONSE_ID_SENTINEL_7Q"
  });
  await assertNavigatorGuardFailure(accountingError, "upstream_unavailable");

  const navigatorSource = fs.readFileSync(navigatorPath, "utf8");
  assert.match(navigatorSource, /Buffer\.byteLength\(rawBody, "utf8"\) > 32768/);
  assert.match(navigatorSource, /createOpenAIClient\("navigator"\)/);
  assert.match(navigatorSource, /import \{ withLambda \} from "@netlify\/aws-lambda-compat";/);
  assert.match(navigatorSource, /export const lambdaHandler = async/);
  assert.match(navigatorSource, /export default withLambda\(lambdaHandler\);/);
  assert.doesNotMatch(navigatorSource, /\bexport\s+const\s+handler\b/);
  assert.doesNotMatch(navigatorSource, /exports\.handler/);
}

async function run() {
  await testContractTablesAndArithmetic();
  await testAllStagesAndCaps();
  await testClosedOptionsAndModels();
  await testCutoffAndCas();
  await testPreCallAccountingFailures();
  await testContentFreePhaseDiagnostics();
  await testRsg15PhaseCompleteness();
  await testRsg16SentinelExclusion();
  await testRsg17TerminalPrecedence();
  await testRsg18SilenceAndDrift();
  await testFailureAndConservativeSettlement();
  await testUtcRolloverAndLateSettlement();
  await testFourCallPathAndSentinelExclusion();
  await testResumeBodyBoundaryAndStageWiring();
  await testNavigatorBodyBoundaryAndStageWiring();
  console.log("PASS: runtime AI spend governance synthetic suite - modern withLambda wiring for Navigator and Resume, zero-config strong-consistency @netlify/blobs 10.7.13 loading, fixed prices, six stages, exact caps, executed 32,768-byte Navigator and 65,536-byte Resume boundaries, content-free budget/accounting failures, strict options, ledger initialization, corrupt-ledger denial, cutoff equality/overage, { modified } ETag CAS conflicts, concurrency, three-attempt failure, invalid/future months, max-safe counters, conservative settlement, one-way UTC rollover, four-call repair path, aggregate-only sentinel exclusion, eight fixed content-free phase diagnostics, three fixed blob-store-load subphase diagnostics, six fixed ledger-read subphase diagnostics, and executable RSG-15 through RSG-18 diagnostic-origin coverage");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
