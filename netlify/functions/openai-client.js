// Shared OpenAI client factory for Transition OPS serverless functions.
// No client, prompt, response, or member content is stored at module scope.

function readOpenAIKey() {
  if (typeof Netlify !== "undefined" && Netlify.env && typeof Netlify.env.get === "function") {
    return Netlify.env.get("OPENAI_API_KEY");
  }
  return process.env.OPENAI_API_KEY;
}

function createOpenAIClient() {
  const OpenAI = require("openai");
  return new OpenAI({
    apiKey: readOpenAIKey(),
    maxRetries: 0,
    timeout: 25000
  });
}

function responseText(response) {
  return typeof response.output_text === "string" ? response.output_text.trim() : "";
}

module.exports = { createOpenAIClient, responseText };
