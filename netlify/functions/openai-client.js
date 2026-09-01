// Shared guarded OpenAI boundary for Transition OPS serverless functions.
// Provider and platform handling remain separate from the aggregate repository guard.

const { createSpendGuard } = require("./openai-budget");

function readOpenAIKey() {
  if (typeof Netlify !== "undefined" && Netlify.env && typeof Netlify.env.get === "function") {
    return Netlify.env.get("OPENAI_API_KEY");
  }
  return process.env.OPENAI_API_KEY;
}

function createOpenAIClient(stage, lambdaEvent) {
  let provider;
  try {
    const OpenAI = require("openai");
    provider = new OpenAI({
      apiKey: readOpenAIKey(),
      maxRetries: 0,
      timeout: 25000
    });
  } catch (error) {
    throw Object.freeze({ code: "upstream_unavailable" });
  }
  const guard = createSpendGuard({
    lambdaEvent,
    providerCreate: function (request) { return provider.responses.create(request); }
  });
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
