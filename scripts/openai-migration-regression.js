const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const helperPath = path.join(root, "netlify/functions/openai-client.js");
const calls = [];
let nextResponse = { status: "completed", output_text: "SYNTHETIC OUTPUT" };
let responseQueue = [];
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
          return responseQueue.length ? responseQueue.shift() : nextResponse;
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
  const callsBeforeCleanFacts = calls.length;
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
  assert.equal(calls.length - callsBeforeCleanFacts, 1);
  assert.equal(JSON.parse(result.body).factSheet, facts);
  assert.deepEqual(JSON.parse(result.body).warnings, []);
  assert.equal(calls.at(-1).model, "gpt-5.6-luna");
  assert.equal(calls.at(-1).max_output_tokens, 1300);
  assert.equal(calls.at(-1).store, false);
  assert.deepEqual(calls.at(-1).reasoning, { effort: "none" });
  assert.match(calls.at(-1).instructions, /later served as Deputy Director/);
  assert.match(calls.at(-1).instructions, /Tenure such as "26 years of service" is not a date/);
  assert.match(calls.at(-1).instructions, /including Workday/);

  const combinedTargetFacts = facts.replace("TARGET ROLE (EXACT OR MISSING): Operations manager", "TARGET ROLE (EXACT OR MISSING): Talent Management; Talent Development Manager");
  nextResponse = { status: "completed", output_text: combinedTargetFacts };
  result = await resume.handler(post({
    action: "facts",
    target: "Talent Management",
    experience: "Led a synthetic 15-person team and managed a $2M equipment inventory."
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).suggestedTarget, "Talent Development Manager");

  nextResponse = { status: "completed", output_text: combinedTargetFacts };
  result = await resume.handler(post({
    action: "facts",
    target: "Program Analyst",
    experience: "Led a synthetic 15-person team and managed a $2M equipment inventory."
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(Object.hasOwn(JSON.parse(result.body), "suggestedTarget"), false);

  const broadOnlyTargetFacts = facts.replace("TARGET ROLE (EXACT OR MISSING): Operations manager", "TARGET ROLE (EXACT OR MISSING): Talent Management");
  nextResponse = { status: "completed", output_text: broadOnlyTargetFacts };
  result = await resume.handler(post({
    action: "facts",
    target: "Talent Management",
    experience: "Led a synthetic 15-person team and managed a $2M equipment inventory."
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(Object.hasOwn(JSON.parse(result.body), "suggestedTarget"), false);

  const multiRoleFacts = "ROLE 1\nJOB TITLE (EXACT): HR Director\nEMPLOYER OR UNIT (EXACT): Synthetic Command\nLOCATION (EXACT OR MISSING): MISSING\nDATES (EXACT OR MISSING): MISSING\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Led personnel operations.\n\nROLE 2\nJOB TITLE (EXACT): Deputy Director\nEMPLOYER OR UNIT (EXACT): Synthetic Command\nLOCATION (EXACT OR MISSING): MISSING\nDATES (EXACT OR MISSING): MISSING\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Managed Workday reporting.\n\nEDUCATION (EXACT OR MISSING): MISSING\nCERTIFICATIONS (EXACT OR MISSING): PMP\nSKILLS AND TOOLS (EXACT OR MISSING): Workday\nNUMBERS AND SCALE (EXACT OR MISSING): 26 years of service\nTARGET ROLE (EXACT OR MISSING): Talent Management; Talent Development Manager";
  nextResponse = { status: "completed", output_text: multiRoleFacts };
  result = await resume.handler(post({
    action: "facts",
    target: "Human Resources Director",
    experience: "Served as HR Director at Synthetic Command and later served as Deputy Director. Used Workday across 26 years of service.",
    certs: "PMP"
  }));
  assert.equal(result.statusCode, 200);
  assert.match(JSON.parse(result.body).factSheet, /ROLE 2\nJOB TITLE \(EXACT\): Deputy Director/);
  assert.equal(Object.hasOwn(JSON.parse(result.body), "suggestedTarget"), false);

  const invalidDateFacts = multiRoleFacts.replace("DATES (EXACT OR MISSING): MISSING", "DATES (EXACT OR MISSING): 26 years of service");
  const invalidWorkdayFacts = multiRoleFacts.replace("CERTIFICATIONS (EXACT OR MISSING): PMP", "CERTIFICATIONS (EXACT OR MISSING): Workday").replace("SKILLS AND TOOLS (EXACT OR MISSING): Workday", "SKILLS AND TOOLS (EXACT OR MISSING): MISSING");
  const unresolvedFacts = invalidWorkdayFacts.replaceAll("DATES (EXACT OR MISSING): MISSING", "DATES (EXACT OR MISSING): 26 years of service");
  const factsRequest = {
    action: "facts",
    target: "Talent Management",
    experience: "Served as HR Director at Synthetic Command and later served as Deputy Director. Used Workday across 26 years of service.",
    certs: "PMP"
  };

  responseQueue = [
    { status: "completed", output_text: invalidDateFacts },
    { status: "completed", output_text: multiRoleFacts }
  ];
  const callsBeforeSuccessfulRepair = calls.length;
  result = await resume.handler(post(factsRequest));
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).factSheet, multiRoleFacts);
  assert.equal(JSON.parse(result.body).suggestedTarget, "Talent Development Manager");
  assert.deepEqual(JSON.parse(result.body).warnings, []);
  assert.equal(calls.length - callsBeforeSuccessfulRepair, 2);
  const repairCall = calls[callsBeforeSuccessfulRepair + 1];
  assert.equal(repairCall.model, "gpt-5.6-terra");
  assert.equal(repairCall.max_output_tokens, 1300);
  assert.equal(repairCall.store, false);
  assert.deepEqual(repairCall.reasoning, { effort: "none" });
  assert.match(repairCall.input, /ORIGINAL BOUNDED SOURCE:/);
  assert.match(repairCall.input, /FIRST FACT SHEET:/);
  assert.match(repairCall.input, /STRUCTURAL ISSUE LABELS:/);

  responseQueue = [
    { status: "completed", output_text: unresolvedFacts },
    { status: "completed", output_text: unresolvedFacts }
  ];
  const callsBeforeFailedRepair = calls.length;
  result = await resume.handler(post(factsRequest));
  assert.equal(result.statusCode, 200);
  assert.equal(calls.length - callsBeforeFailedRepair, 2);
  const unresolvedBody = JSON.parse(result.body);
  assert.equal(unresolvedBody.factSheet, unresolvedFacts);
  assert.equal(unresolvedBody.suggestedTarget, "Talent Development Manager");
  assert.equal(unresolvedBody.warnings.length, 2);
  assert.equal(new Set(unresolvedBody.warnings).size, unresolvedBody.warnings.length);
  assert.match(unresolvedBody.warnings.join(" "), /calendar dates only/);
  assert.match(unresolvedBody.warnings.join(" "), /Workday under SKILLS AND TOOLS/);
  assert.doesNotMatch(unresolvedBody.warnings.join(" "), /quality check failed|Workday misclassified|invalid date|missing distinct|Synthetic/);

  const callsBeforeBlockedDraft = calls.length;
  result = await resume.handler(post({
    action: "draft",
    target: "Human Resources Director",
    experience: factsRequest.experience,
    confirmedFacts: unresolvedBody.factSheet
  }));
  assert.equal(result.statusCode, 400);
  assert.equal(calls.length, callsBeforeBlockedDraft);
  assert.deepEqual(JSON.parse(result.body).warnings, unresolvedBody.warnings);
  assert.match(JSON.parse(result.body).error, /Resolve the fact-sheet warnings before drafting/);

  nextResponse = { status: "completed", output_text: "```text\n**Synthetic Logistics Leader - Synthetic Unit**\n# PROFESSIONAL EXPERIENCE\n[Hours per week: __]\nLed a 15-person team managing a $2M equipment inventory.\nTIP: Add dates.\n```" };
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
  assert.doesNotMatch(JSON.parse(result.body).bullets, /```|\*\*|^#/m);
  assert.match(JSON.parse(result.body).bullets, /\[Hours per week: __\]/);
  assert.equal(calls.at(-1).model, "gpt-5.6-terra");

  const callsBeforeTargetChecks = calls.length;
  for (const vagueTarget of ["", "manager", "not sure", "Talent Management", "Human Resources"]) {
    result = await resume.handler(post({
      action: "draft",
      target: vagueTarget,
      experience: "Synthetic Logistics Leader at Synthetic Unit with enough source detail.",
      confirmedFacts: facts
    }));
    assert.equal(result.statusCode, 400);
    assert.match(JSON.parse(result.body).error, /specific target job title/);
  }
  assert.equal(calls.length, callsBeforeTargetChecks);

  for (const specificTarget of ["Talent Development Manager", "Program Analyst", "Recruiter", "Head of Talent"]) {
    nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nLed a 15-person team managing a $2M equipment inventory.\nTIP: Add dates." };
    result = await resume.handler(post({
      action: "draft",
      target: specificTarget,
      experience: "Synthetic Logistics Leader at Synthetic Unit. Led a 15-person team and managed a $2M equipment inventory.",
      confirmedFacts: facts
    }));
    assert.equal(result.statusCode, 200);
    assert.equal(calls.at(-1).model, "gpt-5.6-terra");
  }

  nextResponse = { status: "completed", output_text: "HR Director - Synthetic Command\nLed personnel operations.\n\nDeputy Director - Synthetic Command\nManaged Workday reporting.\nTIP: Add calendar dates." };
  const callsBeforeCorrectedDraft = calls.length;
  result = await resume.handler(post({
    action: "draft",
    target: "Human Resources Director",
    experience: "Served as HR Director at Synthetic Command and later served as Deputy Director. Used Workday across 26 years of service.",
    confirmedFacts: multiRoleFacts
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(calls.length - callsBeforeCorrectedDraft, 1);
  assert.equal(calls.at(-1).model, "gpt-5.6-terra");
  assert.match(JSON.parse(result.body).bullets, /^HR Director - Synthetic Command[\s\S]*^Deputy Director - Synthetic Command/m);

  nextResponse = { status: "completed", output_text: "HR Director and Deputy Director - Synthetic Command\nLed personnel operations and managed Workday reporting." };
  result = await resume.handler(post({
    action: "draft",
    target: "Human Resources Director",
    experience: "Served as HR Director at Synthetic Command and later served as Deputy Director. Used Workday across 26 years of service.",
    confirmedFacts: multiRoleFacts
  }));
  assert.equal(result.statusCode, 502);
  assert.match(JSON.parse(result.body).error, /did not pass grounding and role-structure checks/);
  assert.doesNotMatch(JSON.parse(result.body).error, /quality check failed|merged or missing/);

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
    "Synthetic Logistics Leader - Synthetic Unit\nSUMMARY\nLed a 99-person team.",
    "Changed Title - Changed Employer\nSUMMARY\nLed a 15-person team.",
    "Synthetic Logistics Leader - Synthetic Unit\nSUMMARY\nResults-driven leader who leveraged planning for a 15-person team."
  ];
  for (const badDraft of badDrafts) {
    nextResponse = { status: "completed", output_text: badDraft };
    result = await resume.handler(post({
      action: "draft",
      target: "Operations Manager",
      experience: "Synthetic Logistics Leader at Synthetic Unit. Led a 15-person team and managed a $2M equipment inventory.",
      confirmedFacts: facts
    }));
    assert.equal(result.statusCode, 502);
    assert.match(JSON.parse(result.body).error, /did not pass grounding and role-structure checks/);
    assert.doesNotMatch(JSON.parse(result.body).error, /quality check failed|unsupported number|filler language|merged or missing/);
  }

  nextError = new Error("quota exceeded");
  result = await resume.handler(post({ action: "facts", experience: "This synthetic sentence is long enough to satisfy validation." }));
  assert.equal(result.statusCode, 502);
  assert.match(JSON.parse(result.body).error, /monthly limit/);

  nextError = null;
  nextResponse = { status: "incomplete", output_text: "" };
  result = await navigator.handler(post({ messages: [{ role: "user", content: "Synthetic request" }] }));
  assert.equal(result.statusCode, 502);

  console.log("PASS: synthetic OpenAI migration regression (grounded target autofill, Luna extraction, Terra repair, editable warning fallback, zero-call unresolved draft block, corrected Terra draft, safe deduped warnings, Navigator, budget/error paths)");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
