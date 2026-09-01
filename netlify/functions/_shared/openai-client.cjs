// Shared guarded OpenAI boundary for Transition OPS serverless functions.
// Provider and platform handling remain separate from the aggregate repository guard.

const { createSpendGuard, clientInitializationFailure } = require("./openai-budget.cjs");

function readOpenAIKey() {
  if (typeof Netlify !== "undefined" && Netlify.env && typeof Netlify.env.get === "function") {
    return Netlify.env.get("OPENAI_API_KEY");
  }
  return process.env.OPENAI_API_KEY;
}

function loadOpenAIModule() {
  return require("openai");
}

function createOpenAIClient(stage) {
  let OpenAI;
  try {
    OpenAI = loadOpenAIModule();
  } catch (error) {
    throw clientInitializationFailure("module_load");
  }
  if (typeof OpenAI !== "function") {
    throw clientInitializationFailure("api_shape");
  }

  let apiKey;
  try {
    apiKey = readOpenAIKey();
  } catch (error) {
    throw clientInitializationFailure("key_lookup");
  }
  if (typeof apiKey !== "string" || apiKey.trim().length === 0) {
    throw clientInitializationFailure("key_lookup");
  }

  let provider;
  try {
    provider = new OpenAI({
      apiKey: apiKey,
      maxRetries: 0,
      timeout: 25000
    });
    if (!provider || !provider.responses || typeof provider.responses.create !== "function") {
      throw new TypeError("Invalid OpenAI client shape");
    }
  } catch (error) {
    throw clientInitializationFailure("client_construct");
  }

  let guard;
  try {
    guard = createSpendGuard({
      providerCreate: function (request) { return provider.responses.create(request); }
    });
    if (!guard || typeof guard.create !== "function") {
      throw new TypeError("Invalid spend guard shape");
    }
  } catch (error) {
    throw clientInitializationFailure("guard_construct");
  }
  return Object.freeze({
    responses: Object.freeze({
      create: function (request) { return guard.create(stage, request); }
    })
  });
}

function responseText(response) {
  return typeof response.output_text === "string" ? response.output_text.trim() : "";
}

module.exports = { createOpenAIClient, responseText };
