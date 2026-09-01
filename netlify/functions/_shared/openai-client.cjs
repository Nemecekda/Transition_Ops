// Shared guarded OpenAI boundary for Transition OPS serverless functions.
// Provider and platform handling remain separate from the aggregate repository guard.

const { createSpendGuard, clientInitializationFailure } = require("./openai-budget.cjs");

function readOpenAIKey() {
  if (typeof Netlify !== "undefined" && Netlify.env && typeof Netlify.env.get === "function") {
    return Netlify.env.get("OPENAI_API_KEY");
  }
  return process.env.OPENAI_API_KEY;
}

function createOpenAIClient(stage) {
  let provider;
  let guard;
  try {
    const OpenAI = require("openai");
    provider = new OpenAI({
      apiKey: readOpenAIKey(),
      maxRetries: 0,
      timeout: 25000
    });
    guard = createSpendGuard({
      providerCreate: function (request) { return provider.responses.create(request); }
    });
  } catch (error) {
    throw clientInitializationFailure();
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
