const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const helperPath = path.join(root, "netlify/functions/openai-client.js");
const calls = [];
let nextResponse = { status: "completed", output_text: "SYNTHETIC OUTPUT" };
let nextError = null;

require.cache[helperPath] = {
  id: helperPath,
  filename: helperPath,
  loaded: true,
  exports: {
    createOpenAIClient: () => ({
      responses: {
        create: async (request) => {
          calls.push(request);
          if (nextError) throw nextError;
          return nextResponse;
        }
      }
    }),
    responseText: (response) => String(response.output_text || "").trim()
  }
};

const resume = require(path.join(root, "netlify/functions/resume.js"));
const navigator = require(path.join(root, "netlify/functions/navigator.js"));

function post(body) {
  return { httpMethod: "POST", body: JSON.stringify(body) };
}

async function run() {
  const facts = "ROLE 1\nJOB TITLE (EXACT): Synthetic Logistics Leader\nEMPLOYER OR UNIT (EXACT): Synthetic Unit\nLOCATION (EXACT OR MISSING): MISSING\nDATES (EXACT OR MISSING): MISSING\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Led a 15-person team and managed a $2M equipment inventory.\n\nEDUCATION (EXACT OR MISSING): MISSING\nCERTIFICATIONS (EXACT OR MISSING): PMP\nSKILLS AND TOOLS (EXACT OR MISSING): Planning\nNUMBERS AND SCALE (EXACT OR MISSING): 15-person; $2M\nTARGET ROLE (EXACT OR MISSING): Operations manager";
  nextResponse = { status: "completed", output_text: facts };
  let result = await resume.handler(post({
    action: "facts",
    role: "Synthetic logistics leader",
    years: "12",
    target: "Operations manager",
    experience: "Led a synthetic 15-person team and managed a $2M equipment inventory.",
    skills: "Planning",
    certs: "PMP"
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).factSheet, facts);
  assert.equal(calls.at(-1).model, "gpt-5.6-luna");
  assert.equal(calls.at(-1).max_output_tokens, 1300);
  assert.equal(calls.at(-1).store, false);
  assert.deepEqual(calls.at(-1).reasoning, { effort: "none" });

  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nLed a 15-person team managing a $2M equipment inventory.\nTIP: Add dates." };
  result = await resume.handler(post({
    action: "draft",
    role: "Synthetic logistics leader",
    years: "12",
    target: "Operations manager",
    experience: "Synthetic Logistics Leader at Synthetic Unit. Led a 15-person team and managed a $2M equipment inventory.",
    confirmedFacts: facts
  }));
  assert.equal(result.statusCode, 200);
  assert.match(JSON.parse(result.body).bullets, /Synthetic Logistics Leader - Synthetic Unit/);
  assert.equal(calls.at(-1).model, "gpt-5.6-terra");

  nextResponse = { status: "completed", output_text: facts };
  result = await resume.handler(post({
    action: "facts",
    mode: "federal",
    role: "Synthetic personnel specialist",
    target: "Program analyst",
    experience: "Prepared synthetic personnel reports and coordinated actions across five offices."
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(calls.at(-1).max_output_tokens, 1900);
  assert.match(calls.at(-1).instructions, /reviewable fact sheet/);

  nextResponse = { status: "completed", output_text: "SYNTHETIC OUTPUT" };
  result = await navigator.handler(post({
    messages: [{ role: "user", content: "Give me a synthetic transition checklist." }],
    context: "Synthetic context only",
    daysOut: 200
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).reply, "SYNTHETIC OUTPUT");
  assert.equal(calls.at(-1).model, "gpt-5.6-luna");
  assert.equal(calls.at(-1).max_output_tokens, 800);
  assert.equal(calls.at(-1).store, false);
  assert.match(calls.at(-1).instructions, /Synthetic context only/);
  assert.match(calls.at(-1).instructions, /T-200 days BEFORE separation/);

  const badDrafts = [
    "Synthetic Logistics Leader - Synthetic Unit\n**SUMMARY**\nLed a 15-person team.",
    "Synthetic Logistics Leader - Synthetic Unit\nSUMMARY\nLed a 99-person team.",
    "Changed Title - Changed Employer\nSUMMARY\nLed a 15-person team.",
    "Synthetic Logistics Leader - Synthetic Unit\nSUMMARY\nResults-driven leader who leveraged planning for a 15-person team."
  ];
  for (const badDraft of badDrafts) {
    nextResponse = { status: "completed", output_text: badDraft };
    result = await resume.handler(post({
      action: "draft",
      experience: "Synthetic Logistics Leader at Synthetic Unit. Led a 15-person team and managed a $2M equipment inventory.",
      confirmedFacts: facts
    }));
    assert.equal(result.statusCode, 502);
    assert.match(JSON.parse(result.body).error, /Generation hiccup/);
  }

  nextError = new Error("quota exceeded");
  result = await resume.handler(post({ action: "facts", experience: "This synthetic sentence is long enough to satisfy validation." }));
  assert.equal(result.statusCode, 502);
  assert.match(JSON.parse(result.body).error, /monthly limit/);

  nextError = null;
  nextResponse = { status: "incomplete", output_text: "" };
  result = await navigator.handler(post({ messages: [{ role: "user", content: "Synthetic request" }] }));
  assert.equal(result.statusCode, 502);

  console.log("PASS: synthetic OpenAI migration regression (two-step resume, exact identities, unsupported claims, markdown, filler, Navigator, budget/error paths)");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
