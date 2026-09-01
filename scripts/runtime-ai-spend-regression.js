"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const budgetPath = path.join(root, "netlify/functions/openai-budget.js");
const clientPath = path.join(root, "netlify/functions/openai-client.js");
const resumePath = path.join(root, "netlify/functions/resume.js");
const { createSpendGuard, __testing } = require(budgetPath);

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
  "MODEL_CONTENT_SENTINEL_7Q"
];

const DIAGNOSTIC_LINES = Object.freeze([
  "runtime-ai-spend phase=prepare",
  "runtime-ai-spend phase=blob_store_load",
  "runtime-ai-spend phase=ledger_read",
  "runtime-ai-spend phase=ledger_write"
]);

const BLOB_STORE_LOAD_SUBPHASE_LINES = Object.freeze([
  "runtime-ai-spend phase=blob_store_load subphase=module_load",
  "runtime-ai-spend phase=blob_store_load subphase=api_shape",
  "runtime-ai-spend phase=blob_store_load subphase=store_construct"
]);

const CONTENT_FREE_DIAGNOSTIC_LINES = Object.freeze(
  DIAGNOSTIC_LINES.concat(BLOB_STORE_LOAD_SUBPHASE_LINES)
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

function assertContentFreeDiagnostics(calls) {
  calls.forEach((call) => {
    assert.equal(call.length, 1);
    assert.ok(CONTENT_FREE_DIAGNOSTIC_LINES.indexOf(call[0]) !== -1);
  });
  const serialized = JSON.stringify(calls);
  SENTINELS.forEach((sentinel) => assert.doesNotMatch(serialized, new RegExp(sentinel)));
}

async function expectCode(action, code) {
  const captured = await captureConsoleErrors(() => assert.rejects(action, (error) => {
      assert.deepEqual(Object.keys(error), ["code"]);
      assert.equal(error.code, code);
      const serialized = JSON.stringify(error);
      SENTINELS.forEach((sentinel) => assert.doesNotMatch(serialized, new RegExp(sentinel)));
      return true;
    }));
  assertContentFreeDiagnostics(captured.calls);
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

  const readFailure = Object.assign(new Error(SENTINELS.join(" ")), {
    request_id: SENTINELS[9],
    response_id: SENTINELS[10]
  });
  const readStore = new FakeCasStore(undefined, { readUnavailable: true, readFailure });
  const read = harness({ store: readStore });
  const readCalls = await expectCode(() => read.guard.create("navigator", request), "upstream_unavailable");
  assert.deepEqual(readCalls, [[DIAGNOSTIC_LINES[2]]]);
  assert.equal(read.state.providerCalls, 0);
  assert.equal(read.store.setCalls, 0);

  for (const store of [
    new FakeCasStore(Object.assign(seededLedger(), { unexpected: 1 })),
    new FakeCasStore(seededLedger(), { missingEtag: true })
  ]) {
    const invalidRead = harness({ store });
    const invalidReadCalls = await expectCode(
      () => invalidRead.guard.create("navigator", request),
      "upstream_unavailable"
    );
    assert.deepEqual(invalidReadCalls, [[DIAGNOSTIC_LINES[2]]]);
    assert.equal(invalidRead.state.providerCalls, 0);
    assert.equal(invalidRead.store.setCalls, 0);
  }

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
  assert.deepEqual(providerCalls, []);
  assert.equal(provider.state.providerCalls, 1);
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
  const incompleteResult = await incomplete.guard.create("navigator", request);
  assert.deepEqual(incompleteResult, { status: "incomplete", incomplete_details: { reason: "max_output_tokens" } });
  assert.equal(incomplete.store.record.settled_micro_usd, reservation);

  for (const response of [
    { status: "completed", output_text: "Synthetic output." },
    completedResponse({ usage: { input_tokens: 10, input_tokens_details: { cached_tokens: 11, cache_write_tokens: 0 }, output_tokens: 1 } })
  ]) {
    const missingUsage = harness({ providerCreate: async () => response });
    const released = await missingUsage.guard.create("navigator", request);
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
  await expectCode(() => overUsage.guard.create("navigator", request), "upstream_unavailable");
  assert.equal(overUsage.store.record.halted, true);
  assert.equal(overUsage.store.record.reserved_micro_usd, 0);
  assert.equal(overUsage.store.record.settled_micro_usd, reservation);

  const impossible = harness({
    providerCreate: async (providerRequest, store) => {
      store.record.reserved_micro_usd = 0;
      return completedResponse();
    }
  });
  await expectCode(() => impossible.guard.create("navigator", request), "upstream_unavailable");
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
    "upstream_unavailable"
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
  const helperPath = path.join(root, "netlify/functions/openai-client.js");
  const originalHelperCache = require.cache[helperPath];
  const originalResumeCache = require.cache[resumePath];
  const stages = [];
  const factSheet = "ROLE 1\nJOB TITLE (EXACT): Synthetic Planner\nEMPLOYER OR UNIT (EXACT): Synthetic Unit\nLOCATION (EXACT OR MISSING): MISSING\nDATES (EXACT OR MISSING): MISSING\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Performed synthetic planning duties.\n\nEDUCATION (EXACT OR MISSING): MISSING\nCERTIFICATIONS (EXACT OR MISSING): MISSING\nSKILLS AND TOOLS (EXACT OR MISSING): Planning\nNUMBERS AND SCALE (EXACT OR MISSING): MISSING\nTARGET ROLE (EXACT OR MISSING): Program Analyst";
  require.cache[helperPath] = {
    id: helperPath,
    filename: helperPath,
    loaded: true,
    exports: {
      createOpenAIClient: (stage) => {
        stages.push(stage);
        return { responses: { create: async () => ({ status: "completed", output_text: factSheet }) } };
      },
      responseText: (response) => String(response.output_text || "").trim()
    }
  };
  delete require.cache[resumePath];
  const resume = require(resumePath);
  const exact = await resume.handler({ httpMethod: "POST", body: bodyAtBytes(65536) });
  assert.equal(exact.statusCode, 200);
  assert.deepEqual(stages, ["resume_facts"]);
  const beforeOverage = stages.length;
  const over = await resume.handler({ httpMethod: "POST", body: bodyAtBytes(65537) });
  assert.equal(over.statusCode, 413);
  assert.deepEqual(JSON.parse(over.body), { error: "Request is too large." });
  assert.equal(stages.length, beforeOverage);

  if (originalHelperCache) require.cache[helperPath] = originalHelperCache;
  else delete require.cache[helperPath];
  if (originalResumeCache) require.cache[resumePath] = originalResumeCache;
  else delete require.cache[resumePath];

  const resumeSource = fs.readFileSync(resumePath, "utf8");
  const clientSource = fs.readFileSync(clientPath, "utf8");
  assert.match(resumeSource, /"resume_facts"[\s\S]*"resume_federal"[\s\S]*"resume_civilian"/);
  assert.match(resumeSource, /createOpenAIClient\("resume_fact_repair"\)/);
  assert.match(resumeSource, /createOpenAIClient\("resume_audit"\)/);
  assert.doesNotMatch(resumeSource, /createOpenAIClient\(\)/);
  assert.match(resumeSource, /const RESUME_BODY_MAX_BYTES = 65536/);
  assert.doesNotMatch(resumeSource, /nothing stored|nothing logged|EXTERNAL_MONTHLY_HARD_CAP_STATUS|PROVIDER_PROJECT_CONTROL_STATUS|AUDIT_INCREMENTAL_CEILING_USD|BROWSER_DAILY_AUDIT_CEILING_USD|UNVERIFIED/i);
  assert.match(resumeSource, /Dated provider-account evidence and the repository spend guard are distinct controls/);
  assert.match(clientSource, /function createOpenAIClient\(stage\)/);
  assert.match(clientSource, /maxRetries: 0/);
  assert.match(clientSource, /guard\.create\(stage, request\)/);
  assert.doesNotMatch(clientSource, /return new OpenAI/);
  assert.match(clientSource, /module\.exports = \{ createOpenAIClient, responseText \}/);
}

async function testNavigatorBodyBoundaryAndStageWiring() {
  const navigatorPath = path.join(root, "netlify/functions/navigator.js");
  const helperPath = path.join(root, "netlify/functions/openai-client.js");
  const originalHelperCache = require.cache[helperPath];
  const originalNavigatorCache = require.cache[navigatorPath];
  const stages = [];
  const guardedRequests = [];
  const guardedFailures = [];
  let providerCalls = 0;
  require.cache[helperPath] = {
    id: helperPath,
    filename: helperPath,
    loaded: true,
    exports: {
      createOpenAIClient: (stage) => {
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
      },
      responseText: (response) => String(response.output_text || "").trim()
    }
  };
  delete require.cache[navigatorPath];
  const navigator = require(navigatorPath);
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
    const failure = await navigator.handler({
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

  const exact = await navigator.handler({ httpMethod: "POST", body: navigatorBodyAtBytes(32768) });
  assert.equal(exact.statusCode, 200);
  assert.deepEqual(stages, ["navigator"]);
  assert.equal(providerCalls, 1);
  const stageCountBeforeOverage = stages.length;
  const providerCallsBeforeOverage = providerCalls;
  const over = await navigator.handler({ httpMethod: "POST", body: navigatorBodyAtBytes(32769) });
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

  if (originalHelperCache) require.cache[helperPath] = originalHelperCache;
  else delete require.cache[helperPath];
  if (originalNavigatorCache) require.cache[navigatorPath] = originalNavigatorCache;
  else delete require.cache[navigatorPath];

  const navigatorSource = fs.readFileSync(navigatorPath, "utf8");
  assert.match(navigatorSource, /Buffer\.byteLength\(rawBody, "utf8"\) > 32768/);
  assert.match(navigatorSource, /createOpenAIClient\("navigator"\)/);
}

async function run() {
  await testContractTablesAndArithmetic();
  await testAllStagesAndCaps();
  await testClosedOptionsAndModels();
  await testCutoffAndCas();
  await testPreCallAccountingFailures();
  await testContentFreePhaseDiagnostics();
  await testFailureAndConservativeSettlement();
  await testUtcRolloverAndLateSettlement();
  await testFourCallPathAndSentinelExclusion();
  await testResumeBodyBoundaryAndStageWiring();
  await testNavigatorBodyBoundaryAndStageWiring();
  console.log("PASS: runtime AI spend governance synthetic suite - fixed prices, six stages, exact caps, executed 32,768-byte Navigator and 65,536-byte Resume boundaries, content-free Navigator budget/accounting failures, strict options, cutoff equality/overage, @netlify/blobs 10.7.13 CommonJS loading, { modified } CAS conflicts, concurrency, three-attempt failure, invalid/future months, max-safe counters, conservative settlement, one-way UTC rollover, four-call repair path, aggregate-only sentinel exclusion, four fixed content-free phase diagnostics, and three fixed blob-store-load subphase diagnostics");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
