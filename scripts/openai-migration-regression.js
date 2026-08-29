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
  let result = await resume.handler(post({
    role: "Synthetic logistics leader",
    years: "12",
    target: "Operations manager",
    experience: "Led a synthetic 15-person team and managed a $2M equipment inventory.",
    skills: "Planning",
    certs: "PMP"
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).bullets, "SYNTHETIC OUTPUT");
  assert.equal(calls.at(-1).model, "gpt-5.6-luna");
  assert.equal(calls.at(-1).max_output_tokens, 1300);
  assert.equal(calls.at(-1).store, false);
  assert.deepEqual(calls.at(-1).reasoning, { effort: "none" });

  result = await resume.handler(post({
    mode: "federal",
    role: "Synthetic personnel specialist",
    target: "Program analyst",
    experience: "Prepared synthetic personnel reports and coordinated actions across five offices."
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(calls.at(-1).max_output_tokens, 1900);
  assert.match(calls.at(-1).instructions, /FEDERAL-STYLE/);

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

  nextError = new Error("quota exceeded");
  result = await resume.handler(post({ experience: "This synthetic sentence is long enough to satisfy validation." }));
  assert.equal(result.statusCode, 502);
  assert.match(JSON.parse(result.body).error, /monthly limit/);

  nextError = null;
  nextResponse = { status: "incomplete", output_text: "" };
  result = await navigator.handler(post({ messages: [{ role: "user", content: "Synthetic request" }] }));
  assert.equal(result.statusCode, 502);

  console.log("PASS: synthetic OpenAI migration regression (civilian resume, federal resume, Navigator, budget/error paths)");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
