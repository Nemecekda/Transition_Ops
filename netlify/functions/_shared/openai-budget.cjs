"use strict";

// Modern Netlify Functions supply the site-scoped Blobs context at invocation time.

const CUTOFF_MICRO_USD = 4000000;
const SCHEMA_VERSION = 1;
const PRICE_VERSION = "openai-2026-08-31";
const STORE_NAME = "runtime-ai-spend-v1";
const RECORD_KEY = "current";
const CAS_ATTEMPTS = 3;

const LEDGER_FIELDS = Object.freeze([
  "schema_version",
  "month_utc",
  "cutoff_micro_usd",
  "reserved_micro_usd",
  "settled_micro_usd",
  "admitted_call_count",
  "settled_call_count",
  "price_version",
  "halted"
]);

const PRICE_TABLE = Object.freeze({
  "gpt-5.6-luna": Object.freeze({ input: 20, cached_input: 2, cache_write: 25, output: 120 }),
  "gpt-5.6-terra": Object.freeze({ input: 200, cached_input: 20, cache_write: 250, output: 1200 })
});

const STAGE_TABLE = Object.freeze({
  navigator: Object.freeze({ model: "gpt-5.6-luna", max_output_tokens: 800 }),
  resume_facts: Object.freeze({ model: "gpt-5.6-luna", max_output_tokens: 3500 }),
  resume_fact_repair: Object.freeze({ model: "gpt-5.6-terra", max_output_tokens: 3500 }),
  resume_civilian: Object.freeze({ model: "gpt-5.6-terra", max_output_tokens: 2200 }),
  resume_federal: Object.freeze({ model: "gpt-5.6-terra", max_output_tokens: 1900 }),
  resume_audit: Object.freeze({ model: "gpt-5.6-terra", max_output_tokens: 4000 })
});

const REQUEST_FIELDS = Object.freeze([
  "model",
  "instructions",
  "input",
  "max_output_tokens",
  "reasoning",
  "store",
  "stream",
  "background",
  "text"
]);

const DIAGNOSTIC_PHASES = Object.freeze([
  "prepare",
  "blob_store_load",
  "ledger_read",
  "ledger_write"
]);

const BLOB_STORE_LOAD_SUBPHASES = Object.freeze([
  "module_load",
  "api_shape",
  "store_construct"
]);

const LEDGER_READ_SUBPHASES = Object.freeze([
  "api_shape",
  "strong_context",
  "store_request",
  "snapshot_shape",
  "missing_etag",
  "schema"
]);

const diagnosticPhaseByFailure = new WeakMap();
const diagnosticSubphaseByFailure = new WeakMap();

function diagnosticFailure(phase, subphase) {
  if (DIAGNOSTIC_PHASES.indexOf(phase) === -1) return guardFailure("upstream_unavailable");
  const validSubphase = (phase === "blob_store_load" && BLOB_STORE_LOAD_SUBPHASES.indexOf(subphase) !== -1) ||
    (phase === "ledger_read" && LEDGER_READ_SUBPHASES.indexOf(subphase) !== -1);
  if (typeof subphase !== "undefined" && !validSubphase) {
    return guardFailure("upstream_unavailable");
  }
  const failure = guardFailure("upstream_unavailable");
  diagnosticPhaseByFailure.set(failure, phase);
  if (typeof subphase !== "undefined") diagnosticSubphaseByFailure.set(failure, subphase);
  return failure;
}

function diagnosticPhase(error) {
  if (!error || (typeof error !== "object" && typeof error !== "function")) return "";
  return diagnosticPhaseByFailure.get(error) || "";
}

function diagnosticSubphase(error) {
  if (!error || (typeof error !== "object" && typeof error !== "function")) return "";
  return diagnosticSubphaseByFailure.get(error) || "";
}

function preserveDiagnosticFailure(error, phase) {
  return diagnosticPhase(error) ? error : diagnosticFailure(phase);
}

function emitPhaseDiagnostic(error) {
  switch (diagnosticPhase(error)) {
    case "prepare":
      console.error("runtime-ai-spend phase=prepare");
      break;
    case "blob_store_load":
      switch (diagnosticSubphase(error)) {
        case "module_load":
          console.error("runtime-ai-spend phase=blob_store_load subphase=module_load");
          break;
        case "api_shape":
          console.error("runtime-ai-spend phase=blob_store_load subphase=api_shape");
          break;
        case "store_construct":
          console.error("runtime-ai-spend phase=blob_store_load subphase=store_construct");
          break;
        default:
          console.error("runtime-ai-spend phase=blob_store_load");
      }
      break;
    case "ledger_read":
      switch (diagnosticSubphase(error)) {
        case "api_shape":
          console.error("runtime-ai-spend phase=ledger_read subphase=api_shape");
          break;
        case "strong_context":
          console.error("runtime-ai-spend phase=ledger_read subphase=strong_context");
          break;
        case "store_request":
          console.error("runtime-ai-spend phase=ledger_read subphase=store_request");
          break;
        case "snapshot_shape":
          console.error("runtime-ai-spend phase=ledger_read subphase=snapshot_shape");
          break;
        case "missing_etag":
          console.error("runtime-ai-spend phase=ledger_read subphase=missing_etag");
          break;
        case "schema":
          console.error("runtime-ai-spend phase=ledger_read subphase=schema");
          break;
        default:
          console.error("runtime-ai-spend phase=ledger_read");
      }
      break;
    case "ledger_write":
      console.error("runtime-ai-spend phase=ledger_write");
      break;
  }
}

function publicGuardFailure(error) {
  try {
    emitPhaseDiagnostic(error);
  } catch (diagnosticError) {
    // Diagnostics must never change the fail-closed result.
  }
  const allowed = ["budget_limit", "rate_limit", "timeout", "upstream_unavailable"];
  const code = error && allowed.indexOf(error.code) !== -1 ? error.code : "upstream_unavailable";
  return guardFailure(code);
}

function guardFailure(code) {
  return Object.freeze({ code: code });
}

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertJsonValue(value, seen) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number" && Number.isFinite(value)) return;
  if (Array.isArray(value)) {
    if (seen.has(value)) throw guardFailure("upstream_unavailable");
    seen.add(value);
    value.forEach(function (item) { assertJsonValue(item, seen); });
    seen.delete(value);
    return;
  }
  if (!isPlainObject(value)) throw guardFailure("upstream_unavailable");
  if (seen.has(value)) throw guardFailure("upstream_unavailable");
  seen.add(value);
  Object.keys(value).forEach(function (key) {
    if (typeof value[key] === "undefined") throw guardFailure("upstream_unavailable");
    assertJsonValue(value[key], seen);
  });
  seen.delete(value);
}

function exactObjectFields(value, fields) {
  if (!isPlainObject(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = fields.slice().sort();
  return actual.length === expected.length && actual.every(function (key, index) { return key === expected[index]; });
}

function validPrice(price) {
  return exactObjectFields(price, ["input", "cached_input", "cache_write", "output"]) &&
    Object.keys(price).every(function (key) { return Number.isSafeInteger(price[key]) && price[key] > 0; });
}

function roundHundredthsUp(value) {
  if (!Number.isSafeInteger(value) || value < 0) throw guardFailure("upstream_unavailable");
  const rounded = Math.floor((value + 99) / 100);
  if (!Number.isSafeInteger(rounded)) throw guardFailure("upstream_unavailable");
  return rounded;
}

function checkedProduct(left, right) {
  const value = left * right;
  if (!Number.isSafeInteger(value) || value < 0) throw guardFailure("upstream_unavailable");
  return value;
}

function checkedSum(values) {
  const value = values.reduce(function (sum, item) { return sum + item; }, 0);
  if (!Number.isSafeInteger(value) || value < 0) throw guardFailure("upstream_unavailable");
  return value;
}

function validateTextOption(stage, text) {
  if (typeof text === "undefined") {
    if (stage === "resume_audit") throw guardFailure("upstream_unavailable");
    return;
  }
  if (stage !== "resume_audit" || !exactObjectFields(text, ["format"])) throw guardFailure("upstream_unavailable");
  const format = text.format;
  if (!exactObjectFields(format, ["type", "name", "strict", "schema"]) ||
      format.type !== "json_schema" || format.name !== "resume_quality_audit" || format.strict !== true ||
      !isPlainObject(format.schema)) throw guardFailure("upstream_unavailable");
}

function prepareProviderRequest(stage, request, priceTable, stageTable) {
  const prices = priceTable || PRICE_TABLE;
  const stages = stageTable || STAGE_TABLE;
  const stageRule = stages[stage];
  if (!stageRule || !exactObjectFields(stageRule, ["model", "max_output_tokens"])) throw guardFailure("upstream_unavailable");
  const price = prices[stageRule.model];
  if (!validPrice(price)) throw guardFailure("upstream_unavailable");
  if (!isPlainObject(request)) throw guardFailure("upstream_unavailable");
  const requestKeys = Object.keys(request);
  if (requestKeys.some(function (key) { return REQUEST_FIELDS.indexOf(key) === -1; })) throw guardFailure("upstream_unavailable");
  if (request.model !== stageRule.model || typeof request.instructions !== "string" || !request.instructions.length ||
      !(typeof request.input === "string" || Array.isArray(request.input)) ||
      !Number.isSafeInteger(request.max_output_tokens) || request.max_output_tokens < 1 ||
      request.max_output_tokens > stageRule.max_output_tokens) throw guardFailure("upstream_unavailable");
  if (Object.prototype.hasOwnProperty.call(request, "store") && request.store !== false) throw guardFailure("upstream_unavailable");
  if (Object.prototype.hasOwnProperty.call(request, "stream") && request.stream !== false) throw guardFailure("upstream_unavailable");
  if (Object.prototype.hasOwnProperty.call(request, "background") && request.background !== false) throw guardFailure("upstream_unavailable");
  if (Object.prototype.hasOwnProperty.call(request, "reasoning") &&
      (!exactObjectFields(request.reasoning, ["effort"]) || request.reasoning.effort !== "none")) throw guardFailure("upstream_unavailable");
  validateTextOption(stage, request.text);
  assertJsonValue(request.input, new Set());
  if (typeof request.text !== "undefined") assertJsonValue(request.text, new Set());

  const providerRequest = {
    model: request.model,
    instructions: request.instructions,
    input: request.input,
    max_output_tokens: request.max_output_tokens,
    reasoning: { effort: "none" },
    store: false,
    stream: false,
    background: false
  };
  if (typeof request.text !== "undefined") providerRequest.text = request.text;
  let serialized;
  try {
    serialized = JSON.stringify(providerRequest);
  } catch (error) {
    throw guardFailure("upstream_unavailable");
  }
  const requestBytes = Buffer.byteLength(serialized, "utf8");
  const reservationHundredths = checkedSum([
    checkedProduct(requestBytes, price.cache_write),
    checkedProduct(request.max_output_tokens, price.output)
  ]);
  return Object.freeze({
    request: Object.freeze(providerRequest),
    request_bytes: requestBytes,
    reservation_micro_usd: roundHundredthsUp(reservationHundredths),
    price: price
  });
}

function usageChargeMicroUsd(usage, price) {
  if (!isPlainObject(usage) || !isPlainObject(usage.input_tokens_details) ||
      !Number.isSafeInteger(usage.input_tokens) || usage.input_tokens < 0 ||
      !Number.isSafeInteger(usage.input_tokens_details.cached_tokens) || usage.input_tokens_details.cached_tokens < 0 ||
      !Number.isSafeInteger(usage.input_tokens_details.cache_write_tokens) || usage.input_tokens_details.cache_write_tokens < 0 ||
      !Number.isSafeInteger(usage.output_tokens) || usage.output_tokens < 0) return null;
  const cached = usage.input_tokens_details.cached_tokens;
  const cacheWrite = usage.input_tokens_details.cache_write_tokens;
  if (cached + cacheWrite > usage.input_tokens) return null;
  const regular = usage.input_tokens - cached - cacheWrite;
  try {
    return roundHundredthsUp(checkedSum([
      checkedProduct(regular, price.input),
      checkedProduct(cached, price.cached_input),
      checkedProduct(cacheWrite, price.cache_write),
      checkedProduct(usage.output_tokens, price.output)
    ]));
  } catch (error) {
    return null;
  }
}

function utcMonth(nowValue) {
  const date = nowValue instanceof Date ? new Date(nowValue.getTime()) : new Date(nowValue);
  if (!Number.isFinite(date.getTime())) throw guardFailure("upstream_unavailable");
  return date.getUTCFullYear() + "-" + String(date.getUTCMonth() + 1).padStart(2, "0");
}

function emptyLedger(month) {
  return {
    schema_version: SCHEMA_VERSION,
    month_utc: month,
    cutoff_micro_usd: CUTOFF_MICRO_USD,
    reserved_micro_usd: 0,
    settled_micro_usd: 0,
    admitted_call_count: 0,
    settled_call_count: 0,
    price_version: PRICE_VERSION,
    halted: false
  };
}

function validMonthUtc(value) {
  return typeof value === "string" && /^\d{4}-\d{2}$/.test(value) &&
    Number(value.slice(5, 7)) >= 1 && Number(value.slice(5, 7)) <= 12;
}

function validateLedger(record) {
  if (!exactObjectFields(record, LEDGER_FIELDS) || record.schema_version !== SCHEMA_VERSION ||
      !validMonthUtc(record.month_utc) || record.cutoff_micro_usd !== CUTOFF_MICRO_USD ||
      record.price_version !== PRICE_VERSION || typeof record.halted !== "boolean") throw guardFailure("upstream_unavailable");
  ["reserved_micro_usd", "settled_micro_usd", "admitted_call_count", "settled_call_count"].forEach(function (field) {
    if (!Number.isSafeInteger(record[field]) || record[field] < 0) throw guardFailure("upstream_unavailable");
  });
  if (record.settled_call_count > record.admitted_call_count ||
      checkedSum([record.reserved_micro_usd, record.settled_micro_usd]) > CUTOFF_MICRO_USD) throw guardFailure("upstream_unavailable");
  return record;
}

function normalizeSnapshot(snapshot) {
  if (snapshot === null) return { exists: false, data: null, etag: null };
  if (!isPlainObject(snapshot) || !Object.prototype.hasOwnProperty.call(snapshot, "data")) {
    throw diagnosticFailure("ledger_read", "snapshot_shape");
  }
  if (typeof snapshot.etag !== "string" || !snapshot.etag) {
    throw diagnosticFailure("ledger_read", "missing_etag");
  }
  return { exists: true, data: snapshot.data, etag: snapshot.etag };
}

function isCasConflict(error) {
  if (!error) return false;
  const code = typeof error.code === "string" ? error.code.toLowerCase() : "";
  const name = typeof error.name === "string" ? error.name.toLowerCase() : "";
  return error.status === 412 || code === "condition_failed" || code === "precondition_failed" ||
    name === "preconditionfailederror" || name === "conditionfailederror";
}

async function readSnapshot(store) {
  if (!store || typeof store.getWithMetadata !== "function" || typeof store.setJSON !== "function") {
    throw diagnosticFailure("ledger_read", "api_shape");
  }
  let snapshot;
  try {
    snapshot = await store.getWithMetadata(RECORD_KEY, { type: "json" });
  } catch (error) {
    if (diagnosticPhase(error)) throw error;
    if (error && error.name === "BlobsConsistencyError") {
      throw diagnosticFailure("ledger_read", "strong_context");
    }
    throw diagnosticFailure("ledger_read", "store_request");
  }
  return normalizeSnapshot(snapshot);
}

async function conditionalWrite(store, snapshot, record) {
  const options = snapshot.exists ? { onlyIfMatch: snapshot.etag } : { onlyIfNew: true };
  try {
    const result = await store.setJSON(RECORD_KEY, record, options);
    if (!isPlainObject(result) || result.modified !== true) throw { code: "condition_failed" };
  } catch (error) {
    if (isCasConflict(error)) throw { code: "condition_failed" };
    throw diagnosticFailure("ledger_write");
  }
}

async function admitReservation(store, month, reservationMicroUsd) {
  if (!validMonthUtc(month) || !Number.isSafeInteger(reservationMicroUsd) || reservationMicroUsd < 0) throw guardFailure("upstream_unavailable");
  for (let attempt = 0; attempt < CAS_ATTEMPTS; attempt += 1) {
    let snapshot;
    let record;
    try {
      snapshot = await readSnapshot(store);
    } catch (error) {
      throw preserveDiagnosticFailure(error, "ledger_read");
    }
    try {
      record = snapshot.exists ? validateLedger(snapshot.data) : emptyLedger(month);
      if (record.month_utc > month) throw guardFailure("upstream_unavailable");
      if (record.month_utc < month) record = emptyLedger(month);
      if (record.halted) throw guardFailure("upstream_unavailable");
    } catch (error) {
      throw diagnosticFailure("ledger_read", "schema");
    }
    const projected = checkedSum([record.settled_micro_usd, record.reserved_micro_usd, reservationMicroUsd]);
    if (projected > CUTOFF_MICRO_USD) throw guardFailure("budget_limit");
    let next;
    try {
      next = Object.assign({}, record, {
        reserved_micro_usd: checkedSum([record.reserved_micro_usd, reservationMicroUsd]),
        admitted_call_count: checkedSum([record.admitted_call_count, 1])
      });
      validateLedger(next);
    } catch (error) {
      throw preserveDiagnosticFailure(error, "ledger_write");
    }
    try {
      await conditionalWrite(store, snapshot, next);
      return Object.freeze({ month_utc: month, reservation_micro_usd: reservationMicroUsd });
    } catch (error) {
      if (error && error.code === "condition_failed" && attempt + 1 < CAS_ATTEMPTS) continue;
      throw preserveDiagnosticFailure(error, "ledger_write");
    }
  }
  throw diagnosticFailure("ledger_write");
}

async function settleReservation(store, admission, actualMicroUsd, forceFullCharge, forceHalt) {
  if (!isPlainObject(admission) || !validMonthUtc(admission.month_utc) ||
      !Number.isSafeInteger(admission.reservation_micro_usd) || admission.reservation_micro_usd < 0) throw guardFailure("upstream_unavailable");
  for (let attempt = 0; attempt < CAS_ATTEMPTS; attempt += 1) {
    let snapshot;
    let record;
    try {
      snapshot = await readSnapshot(store);
    } catch (error) {
      throw preserveDiagnosticFailure(error, "ledger_read");
    }
    try {
      if (!snapshot.exists) throw guardFailure("upstream_unavailable");
      record = validateLedger(snapshot.data);
      if (record.month_utc > admission.month_utc) return Object.freeze({ late_month: true, halted: record.halted });
      if (record.month_utc < admission.month_utc) throw guardFailure("upstream_unavailable");
    } catch (error) {
      throw diagnosticFailure("ledger_read", "schema");
    }
    const impossible = record.reserved_micro_usd < admission.reservation_micro_usd ||
      record.settled_call_count >= record.admitted_call_count ||
      !Number.isSafeInteger(actualMicroUsd) || actualMicroUsd < 0;
    let next;
    try {
      if (impossible) {
        next = Object.assign({}, record, { halted: true });
      } else {
        const charge = forceFullCharge ? admission.reservation_micro_usd : actualMicroUsd;
        next = Object.assign({}, record, {
          reserved_micro_usd: record.reserved_micro_usd - admission.reservation_micro_usd,
          settled_micro_usd: checkedSum([record.settled_micro_usd, charge]),
          settled_call_count: checkedSum([record.settled_call_count, 1]),
          halted: record.halted || forceHalt
        });
        if (checkedSum([next.settled_micro_usd, next.reserved_micro_usd]) > CUTOFF_MICRO_USD) next = Object.assign({}, record, { halted: true });
      }
      validateLedger(next);
    } catch (error) {
      throw preserveDiagnosticFailure(error, "ledger_write");
    }
    try {
      await conditionalWrite(store, snapshot, next);
      return Object.freeze({ late_month: false, halted: next.halted, impossible: impossible });
    } catch (error) {
      if (error && error.code === "condition_failed" && attempt + 1 < CAS_ATTEMPTS) continue;
      throw preserveDiagnosticFailure(error, "ledger_write");
    }
  }
  throw diagnosticFailure("ledger_write");
}

function providerFailureCode(error) {
  const code = error && typeof error.code === "string" ? error.code : "";
  const type = error && typeof error.type === "string" ? error.type : "";
  const name = error && typeof error.name === "string" ? error.name : "";
  const status = error && Number.isInteger(error.status) ? error.status : 0;
  if (["insufficient_quota", "billing_hard_limit_reached", "billing_limit", "credits_exhausted", "budget_limit"].indexOf(code) !== -1 ||
      ["insufficient_quota", "billing_error"].indexOf(type) !== -1) return "budget_limit";
  if (status === 429 || ["rate_limit", "rate_limit_exceeded"].indexOf(code) !== -1 || type === "rate_limit_error") return "rate_limit";
  if ([408, 504].indexOf(status) !== -1 || ["ETIMEDOUT", "ECONNABORTED"].indexOf(code) !== -1 ||
      ["APIConnectionTimeoutError", "TimeoutError"].indexOf(name) !== -1 || type === "timeout") return "timeout";
  return "upstream_unavailable";
}

function sanitizedIncomplete(response) {
  const allowed = [
    "max_output_tokens", "max_output_tokens_exceeded", "output_limit", "length",
    "timeout", "request_timeout", "rate_limit", "rate_limit_exceeded",
    "insufficient_quota", "billing_limit", "budget_limit", "server_error",
    "service_unavailable", "upstream_unavailable"
  ];
  const candidate = response && response.incomplete_details && response.incomplete_details.reason;
  return {
    status: "incomplete",
    incomplete_details: { reason: allowed.indexOf(candidate) === -1 ? "unknown" : candidate }
  };
}

async function loadStrongStore() {
  let blobs;
  try {
    blobs = require("@netlify/blobs");
  } catch (error) {
    throw diagnosticFailure("blob_store_load", "module_load");
  }
  if (!blobs || typeof blobs.getStore !== "function") {
    throw diagnosticFailure("blob_store_load", "api_shape");
  }
  try {
    return blobs.getStore({ name: STORE_NAME, consistency: "strong" });
  } catch (error) {
    throw diagnosticFailure("blob_store_load", "store_construct");
  }
}

function createSpendGuard(options) {
  const settings = options || {};
  const providerCreate = settings.providerCreate;
  const now = typeof settings.now === "function" ? settings.now : function () { return new Date(); };
  let storePromise = null;
  async function resolveStore() {
    if (!storePromise) storePromise = settings.store ? Promise.resolve(settings.store) : loadStrongStore();
    try {
      return await storePromise;
    } catch (error) {
      throw preserveDiagnosticFailure(error, "blob_store_load");
    }
  }

  async function guardedCreate(stage, request) {
      let prepared;
      let month;
      try {
        prepared = prepareProviderRequest(stage, request);
        month = utcMonth(now());
      } catch (error) {
        throw diagnosticFailure("prepare");
      }
      if (typeof providerCreate !== "function") throw diagnosticFailure("prepare");
      const store = await resolveStore();
      let admission;
      try {
        admission = await admitReservation(store, month, prepared.reservation_micro_usd);
      } catch (error) {
        if (error && error.code === "budget_limit") throw guardFailure("budget_limit");
        if (diagnosticPhase(error)) throw error;
        throw guardFailure("upstream_unavailable");
      }

      let response;
      try {
        response = await providerCreate(prepared.request);
      } catch (providerError) {
        try {
          await settleReservation(store, admission, admission.reservation_micro_usd, true, false);
        } catch (settlementError) {
          if (diagnosticPhase(settlementError)) throw settlementError;
          throw guardFailure("upstream_unavailable");
        }
        throw guardFailure(providerFailureCode(providerError));
      }

      if (!response || response.status !== "completed") {
        try {
          await settleReservation(store, admission, admission.reservation_micro_usd, true, false);
        } catch (settlementError) {
          if (diagnosticPhase(settlementError)) throw settlementError;
          throw guardFailure("upstream_unavailable");
        }
        return sanitizedIncomplete(response);
      }

      const actualMicroUsd = usageChargeMicroUsd(response.usage, prepared.price);
      const missingUsage = actualMicroUsd === null;
      const usageOverReservation = !missingUsage && actualMicroUsd > admission.reservation_micro_usd;
      let settlement;
      try {
        settlement = await settleReservation(
          store,
          admission,
          missingUsage || usageOverReservation ? admission.reservation_micro_usd : actualMicroUsd,
          missingUsage || usageOverReservation,
          usageOverReservation
        );
      } catch (settlementError) {
        if (diagnosticPhase(settlementError)) throw settlementError;
        throw guardFailure("upstream_unavailable");
      }
      if (usageOverReservation || settlement.halted || settlement.impossible) throw guardFailure("upstream_unavailable");
      return response;
  }

  return Object.freeze({
    create: async function (stage, request) {
      try {
        return await guardedCreate(stage, request);
      } catch (error) {
        throw publicGuardFailure(error);
      }
    }
  });
}

module.exports = {
  createSpendGuard,
  __testing: Object.freeze({
    CUTOFF_MICRO_USD,
    SCHEMA_VERSION,
    PRICE_VERSION,
    STORE_NAME,
    RECORD_KEY,
    CAS_ATTEMPTS,
    LEDGER_FIELDS,
    PRICE_TABLE,
    STAGE_TABLE,
    prepareProviderRequest,
    usageChargeMicroUsd,
    emptyLedger,
    validMonthUtc,
    validateLedger,
    admitReservation,
    settleReservation,
    utcMonth
  })
};
