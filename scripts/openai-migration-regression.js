const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const helperPath = path.join(root, "netlify/functions/openai-client.js");
const calls = [];
let nextResponse = { status: "completed", output_text: "SYNTHETIC OUTPUT" };
let responseQueue = [];
let auditResponseQueue = [];
let nextError = null;

const auditDimensions = [
  "grounding_and_claim_trace", "exact_identity_preservation", "role_separation", "date_completeness",
  "quantified_impact", "job_posting_alignment", "military_jargon_translation", "filler",
  "length_and_readability", "format_compliance"
];

function draftClausesFromAuditRequest(request) {
  const draft = String(request.input || "").split("\n\nCANDIDATE DRAFT:\n").pop();
  return draft.split("\n").map((line) => line.trim().replace(/^[\u2022*-]\s*/, "")).filter((line) => line && !/^(?:SUMMARY|PROFESSIONAL SUMMARY|CORE SKILLS|PROFESSIONAL EXPERIENCE|CERTIFICATIONS(?: & TRAINING)?|EDUCATION)$/i.test(line) && !/^\[[^\]]+\](?:\s*\|\s*\[[^\]]+\])*$/.test(line));
}

function clauseInventoryFromAuditRequest(request) {
  const input = String(request.input || "");
  const match = input.match(/<UNTRUSTED_CLAUSE_INVENTORY>\n([\s\S]*?)\n<\/UNTRUSTED_CLAUSE_INVENTORY>/);
  assert.ok(match, "audit request includes the delimited clause inventory");
  return JSON.parse(match[1]);
}

function factCatalogFromAuditRequest(request) {
  const match = String(request.input || "").match(/<UNTRUSTED_FACT_CATALOG>\n([\s\S]*?)\n<\/UNTRUSTED_FACT_CATALOG>/);
  assert.ok(match, "audit request includes the closed fact catalog");
  return JSON.parse(match[1]);
}

function passingAudit(request, changes) {
  const catalog = factCatalogFromAuditRequest(request);
  const audit = {
    audit_verdict: "pass",
    blockers: [],
    claim_trace: clauseInventoryFromAuditRequest(request).map((claim) => ({ claim_id: claim.claim_id, section: "resume", fact_refs: [(catalog.find((fact) => fact.owner === claim.owner && !fact.unlinked_number) || catalog.find((fact) => fact.owner === "global" && !fact.unlinked_number) || catalog[0]).fact_id], posting_refs: [], transform: "exact", verdict: "supported" })),
    scorecard: auditDimensions.map((dimension) => ({ dimension, status: "PASS", evidence: "Synthetic fixture passed this dimension." })),
    supported_keywords: ["preventive maintenance"],
    unmet_gaps: []
  };
  return Object.assign(audit, changes || {});
}

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
          if (request.text && request.text.format && request.text.format.name === "resume_quality_audit") {
            const queuedAudit = auditResponseQueue.length ? auditResponseQueue.shift() : null;
            const audit = typeof queuedAudit === "function" ? queuedAudit(request) : (queuedAudit || passingAudit(request));
            return audit && audit.status ? audit : { status: "completed", output_text: JSON.stringify(audit) };
          }
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
  assert.equal(result.statusCode, 200, result.body);
  assert.equal(calls.length - callsBeforeCleanFacts, 1);
  assert.equal(JSON.parse(result.body).factSheet, facts);
  assert.deepEqual(JSON.parse(result.body).warnings, []);
  assert.equal(calls.at(-1).model, "gpt-5.6-luna");
  assert.equal(calls.at(-1).max_output_tokens, 3500);
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
  const callsBeforeComplexStandardFacts = calls.length;
  result = await resume.handler(post({
    action: "facts",
    target: "Human Resources Director",
    experience: "Served as HR Director at Synthetic Command and later served as Deputy Director. Used Workday across 26 years of service.",
    certs: "PMP"
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(calls.length - callsBeforeComplexStandardFacts, 1);
  assert.equal(calls[callsBeforeComplexStandardFacts].max_output_tokens, 3500);
  assert.match(JSON.parse(result.body).factSheet, /ROLE 2\nJOB TITLE \(EXACT\): Deputy Director/);
  assert.equal(Object.hasOwn(JSON.parse(result.body), "suggestedTarget"), false);

  const invalidDateFacts = multiRoleFacts.replace("DATES (EXACT OR MISSING): MISSING", "DATES (EXACT OR MISSING): 26 years of service");
  const invalidWorkdayFacts = multiRoleFacts.replace("CERTIFICATIONS (EXACT OR MISSING): PMP", "CERTIFICATIONS (EXACT OR MISSING): Workday").replace("SKILLS AND TOOLS (EXACT OR MISSING): Workday", "SKILLS AND TOOLS (EXACT OR MISSING): MISSING");
  const unresolvedFacts = invalidWorkdayFacts.replaceAll("DATES (EXACT OR MISSING): MISSING", "DATES (EXACT OR MISSING): 26 years of service");
  const postingOnlySentinel = "POSTING_ONLY_SENTINEL employer Example Corp requires Workday Elite credential, service from Jan 2040 to Dec 2041, $777 scope, 88% outcome, and SentinelTool.";
  const factsRequest = {
    action: "facts",
    target: "Talent Management",
    experience: "Served as HR Director at Synthetic Command and later served as Deputy Director. Used Workday across 26 years of service.",
    certs: "PMP",
    posting: postingOnlySentinel
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
  assert.equal(repairCall.max_output_tokens, 3500);
  assert.equal(repairCall.store, false);
  assert.deepEqual(repairCall.reasoning, { effort: "none" });
  assert.match(repairCall.input, /ORIGINAL BOUNDED SOURCE:/);
  assert.match(repairCall.input, /FIRST FACT SHEET:/);
  assert.match(repairCall.input, /STRUCTURAL ISSUE LABELS:/);
  assert.doesNotMatch(calls[callsBeforeSuccessfulRepair].input, /POSTING_ONLY_SENTINEL|Example Corp|2040|\$777|88%|SentinelTool/);
  assert.doesNotMatch(repairCall.input, /POSTING_ONLY_SENTINEL|Example Corp|2040|\$777|88%|SentinelTool/);
  assert.match(calls[callsBeforeSuccessfulRepair].input, /Target civilian role: Talent Management/);
  assert.match(repairCall.input, /Target civilian role: Talent Management/);

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
  assert.equal(JSON.parse(result.body).reasonCategory, "quality_gate");
  assert.equal(calls.length, callsBeforeBlockedDraft);
  assert.deepEqual(JSON.parse(result.body).warnings, unresolvedBody.warnings);
  assert.match(JSON.parse(result.body).error, /Resolve the fact-sheet warnings before drafting/);

  nextResponse = { status: "completed", output_text: "```text\n**Synthetic Logistics Leader - Synthetic Unit**\n# PROFESSIONAL EXPERIENCE\nLed a 15-person team managing a $2M equipment inventory.\n```" };
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
  assert.doesNotMatch(JSON.parse(result.body).bullets, /\[|MISSING|TIP:/);
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
    nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nLed a 15-person team managing a $2M equipment inventory." };
    result = await resume.handler(post({
      action: "draft",
      target: specificTarget,
      experience: "Synthetic Logistics Leader at Synthetic Unit. Led a 15-person team and managed a $2M equipment inventory.",
      confirmedFacts: facts
    }));
    assert.equal(result.statusCode, 200);
    assert.equal(calls.at(-1).model, "gpt-5.6-terra");
  }

  nextResponse = { status: "completed", output_text: "HR Director - Synthetic Command\nLed personnel operations.\n\nDeputy Director - Synthetic Command\nManaged Workday reporting." };
  const callsBeforeCorrectedDraft = calls.length;
  result = await resume.handler(post({
    action: "draft",
    target: "Human Resources Director",
    experience: "Served as HR Director at Synthetic Command and later served as Deputy Director. Used Workday across 26 years of service.",
    confirmedFacts: multiRoleFacts
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(calls.length - callsBeforeCorrectedDraft, 2);
  assert.equal(calls[callsBeforeCorrectedDraft].max_output_tokens, 2200);
  assert.equal(calls[callsBeforeCorrectedDraft + 1].max_output_tokens, 4000);
  assert.equal(calls.at(-1).model, "gpt-5.6-terra");
  assert.match(JSON.parse(result.body).bullets, /^HR Director - Synthetic Command[\s\S]*^Deputy Director - Synthetic Command/m);

  const colonRoleSource = "Served as HR Director at Synthetic Command and later served as Deputy Director of Personnel: talent management, succession planning, and workforce reporting.";
  const colonRoleFacts = multiRoleFacts.replace("JOB TITLE (EXACT): Deputy Director", "JOB TITLE (EXACT): Deputy Director of Personnel");
  nextResponse = { status: "completed", output_text: "HR Director - Synthetic Command\nLed personnel operations.\n\nDeputy Director of Personnel - Synthetic Command\nManaged talent programs." };
  const callsBeforeColonRoleDraft = calls.length;
  result = await resume.handler(post({
    action: "draft",
    target: "Human Resources Director",
    experience: colonRoleSource,
    confirmedFacts: colonRoleFacts
  }));
  assert.equal(result.statusCode, 200);
  assert.deepEqual(JSON.parse(result.body).warnings || [], []);
  assert.equal(calls.length - callsBeforeColonRoleDraft, 2);
  assert.equal(calls.filter((call, index) => index >= callsBeforeColonRoleDraft && !(call.text && call.text.format)).length, 1);
  assert.equal(calls.filter((call, index) => index >= callsBeforeColonRoleDraft && call.text && call.text.format).length, 1);
  assert.equal(calls.at(-1).model, "gpt-5.6-terra");

  const callsBeforeMissingColonRole = calls.length;
  result = await resume.handler(post({
    action: "draft",
    target: "Human Resources Director",
    experience: colonRoleSource,
    confirmedFacts: multiRoleFacts
  }));
  assert.equal(result.statusCode, 400);
  assert.equal(calls.length, callsBeforeMissingColonRole);
  assert.match(JSON.parse(result.body).warnings.join(" "), /distinct job title/);

  const lastAuditCall = calls.filter((call) => call.text && call.text.format).at(-1);
  assert.equal(lastAuditCall.model, "gpt-5.6-terra");
  assert.equal(lastAuditCall.max_output_tokens, 4000);
  assert.equal(lastAuditCall.store, false);
  assert.deepEqual(lastAuditCall.reasoning, { effort: "none" });
  assert.equal(lastAuditCall.text.format.type, "json_schema");
  assert.equal(lastAuditCall.text.format.strict, true);
  assert.deepEqual(lastAuditCall.text.format.schema.required, ["audit_verdict", "blockers", "claim_trace", "scorecard", "supported_keywords", "unmet_gaps"]);
  assert.deepEqual(lastAuditCall.text.format.schema.properties.claim_trace.items.required, ["claim_id", "section", "fact_refs", "posting_refs", "transform", "verdict"]);
  assert.equal(Object.hasOwn(lastAuditCall.text.format.schema.properties.claim_trace.items.properties, "claim_text"), false);
  assert.deepEqual(lastAuditCall.text.format.schema.properties.claim_trace.items.properties.claim_id.enum, clauseInventoryFromAuditRequest(lastAuditCall).map((item) => item.claim_id));
  assert.deepEqual(lastAuditCall.text.format.schema.properties.scorecard.items.required, ["dimension", "status", "evidence"]);
  assert.equal(lastAuditCall.text.format.schema.properties.scorecard.items.properties.dimension.enum.length, 10);

  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nImproved customer satisfaction." };
  auditResponseQueue.push((request) => {
    const audit = passingAudit(request);
    const claimId = clauseInventoryFromAuditRequest(request).find((item) => /customer satisfaction/.test(item.claim_text)).claim_id;
    const claim = audit.claim_trace.find((item) => item.claim_id === claimId);
    claim.fact_refs = [];
    claim.verdict = "unsupported";
    audit.scorecard.find((item) => item.dimension === "grounding_and_claim_trace").status = "FAIL";
    return audit;
  });
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Planning duties completed.", confirmedFacts: facts }));
  assert.equal(result.statusCode, 422);
  assert.equal(JSON.parse(result.body).reasonCategory, "quality_gate");
  assert.equal(Object.hasOwn(JSON.parse(result.body), "bullets"), false);
  assert.match(JSON.parse(result.body).blockers.join(" "), /unsupported|quality dimensions failed/);

  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nLed planning work." };
  auditResponseQueue.push((request) => passingAudit(request, { audit_verdict: "withhold" }));
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Led planning work.", confirmedFacts: facts }));
  assert.equal(result.statusCode, 422);
  assert.equal(Object.hasOwn(JSON.parse(result.body), "bullets"), false);
  assert.deepEqual(JSON.parse(result.body).blockers, ["The quality review determined this draft should not be released."]);

  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nManaged maintenance for a 600-person organization." };
  const callsBeforeUnsupported600 = calls.length;
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Battalion maintenance leader.", confirmedFacts: facts }));
  assert.equal(result.statusCode, 502);
  assert.equal(calls.length - callsBeforeUnsupported600, 1);
  assert.equal(calls.slice(callsBeforeUnsupported600).filter((call) => call.text && call.text.format).length, 0);

  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nLed planning work." };
  auditResponseQueue.push((request) => {
    const audit = passingAudit(request);
    audit.claim_trace.pop();
    return audit;
  });
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Led planning work.", confirmedFacts: facts }));
  assert.equal(result.statusCode, 502);
  assert.match(JSON.parse(result.body).blockers.join(" "), /not traced/);

  for (const mutateIds of [
    (audit) => { audit.claim_trace[1].claim_id = audit.claim_trace[0].claim_id; },
    (audit) => { audit.claim_trace[0].claim_id = "C999"; }
  ]) {
    nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nLed planning work." };
    auditResponseQueue.push((request) => { const audit = passingAudit(request); mutateIds(audit); return audit; });
    result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Led planning work.", confirmedFacts: facts }));
    assert.equal(result.statusCode, 502);
    assert.equal(JSON.parse(result.body).reasonCategory, "quality_gate");
    assert.deepEqual(JSON.parse(result.body).blockers, ["One or more draft claims were not traced to confirmed facts."]);
  }

  const duplicateClause = "Led planning work.";
  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\n" + duplicateClause + "\n" + duplicateClause };
  auditResponseQueue.push((request) => passingAudit(request));
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Led planning work.", confirmedFacts: facts }));
  assert.equal(result.statusCode, 200);
  const duplicateTraces = JSON.parse(result.body).trace.filter((item) => item.claim_text === duplicateClause);
  assert.equal(duplicateTraces.length, 2);
  assert.notEqual(duplicateTraces[0].claim_id, duplicateTraces[1].claim_id);
  assert.ok(duplicateTraces.every((item) => item.claim_text === duplicateClause));

  const emptyInventoryFacts = facts.replace("JOB TITLE (EXACT): Synthetic Logistics Leader", "JOB TITLE (EXACT): SUMMARY").replace("EMPLOYER OR UNIT (EXACT): Synthetic Unit", "EMPLOYER OR UNIT (EXACT): MISSING");
  nextResponse = { status: "completed", output_text: "SUMMARY\nPROFESSIONAL EXPERIENCE\nCERTIFICATIONS\nEDUCATION" };
  const callsBeforeEmptyInventory = calls.length;
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "SUMMARY role placeholder text.", confirmedFacts: emptyInventoryFacts }));
  assert.equal(result.statusCode, 502);
  assert.equal(JSON.parse(result.body).reasonCategory, "quality_gate");
  assert.deepEqual(JSON.parse(result.body).blockers, ["One or more draft claims were not traced to confirmed facts."]);
  assert.equal(calls.length - callsBeforeEmptyInventory, 1);
  assert.equal(calls.slice(callsBeforeEmptyInventory).filter((call) => call.text && call.text.format).length, 0);
  assert.equal(calls.slice(callsBeforeEmptyInventory).some((call) => /\"enum\":\[\]/.test(JSON.stringify(call))), false);

  const liveLedger = Array.from({ length: 6 }, (_, index) => "ROLE " + (index + 1) + "\nJOB TITLE (EXACT): Synthetic Role " + (index + 1) + "\nEMPLOYER OR UNIT (EXACT): Synthetic Employer " + (index + 1) + "\nLOCATION (EXACT OR MISSING): MISSING\nDATES (EXACT OR MISSING): MISSING\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Led synthetic function " + (index + 1) + (index === 2 ? " with a team of 9 specialists." : index === 4 ? " with a 110-person operation and $9M budget." : ".")).join("\n\n") + "\n\nEDUCATION (EXACT OR MISSING): M.B.A., Synthetic Management, Synthetic University\nCERTIFICATIONS (EXACT OR MISSING): Synthetic Certified Professional; Synthetic Leadership License\nSKILLS AND TOOLS (EXACT OR MISSING): Planning; Analytics\nNUMBERS AND SCALE (EXACT OR MISSING): team of 9 specialists; 110-person operation; $9M budget; 1,200 employees; 18 states; 1100 hires\nTARGET ROLE (EXACT OR MISSING): Talent Management Manager";
  const liveCivilianDraft = Array.from({ length: 6 }, (_, index) => "Synthetic Role " + (index + 1) + " - Synthetic Employer " + (index + 1) + "\nLed synthetic function " + (index + 1) + (index === 2 ? " with a team of 9 specialists." : index === 4 ? " with a 110-person operation and $9M budget." : ".")).join("\n\n") + "\n\nEDUCATION\nM.B.A., Synthetic Management, Synthetic University\n\nCERTIFICATIONS\nSynthetic Certified Professional\nSynthetic Leadership License";
  nextResponse = { status: "completed", output_text: liveCivilianDraft };
  auditResponseQueue.push((request) => passingAudit(request, { unmet_gaps: ["Dates for roles where none were confirmed"], scorecard: auditDimensions.map((dimension) => ({ dimension, status: dimension === "date_completeness" ? "NEEDS MEMBER FACT" : "PASS", evidence: "Synthetic v0.7 fixture." })) }));
  result = await resume.handler(post({ action: "draft", target: "Talent Management Manager", experience: liveLedger, confirmedFacts: liveLedger }));
  assert.equal(result.statusCode, 200);
  const liveBody = JSON.parse(result.body);
  assert.doesNotMatch(liveBody.bullets, /\[|\bMISSING\b|TIP:|1,200 employees|18 states/);
  for (const identity of ["Synthetic Role 1", "Synthetic Employer 1", "Synthetic Role 6", "Synthetic Employer 6", "M.B.A., Synthetic Management, Synthetic University", "Synthetic Certified Professional", "Synthetic Leadership License"]) assert.match(liveBody.bullets, new RegExp(identity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(liveBody.scorecard.find((item) => item.dimension === "date_completeness").status, "NEEDS MEMBER FACT");

  const ownershipDraft = "SUMMARY\nSynthetic Role 1 at Synthetic Employer 1 provides context.\nThis summary claim stays global.\n\nPROFESSIONAL EXPERIENCE\nSynthetic Role 1 - Synthetic Employer 1\nWorked with Synthetic Role 2 without changing ownership.\n\nSynthetic Role 2 - Synthetic Employer 2\nLed synthetic function 2.";
  const ownershipLedger = "ROLE 1\nJOB TITLE (EXACT): Synthetic Role 1\nEMPLOYER OR UNIT (EXACT): Synthetic Employer 1\nLOCATION (EXACT OR MISSING): MISSING\nDATES (EXACT OR MISSING): MISSING\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Worked with Synthetic Role 2 without changing ownership.\n\nROLE 2\nJOB TITLE (EXACT): Synthetic Role 2\nEMPLOYER OR UNIT (EXACT): Synthetic Employer 2\nLOCATION (EXACT OR MISSING): MISSING\nDATES (EXACT OR MISSING): MISSING\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Led synthetic function 2.\n\nEDUCATION (EXACT OR MISSING): MISSING\nCERTIFICATIONS (EXACT OR MISSING): MISSING\nSKILLS AND TOOLS (EXACT OR MISSING): Planning\nNUMBERS AND SCALE (EXACT OR MISSING): 88 sites\nTARGET ROLE (EXACT OR MISSING): Talent Management Manager";
  nextResponse = { status: "completed", output_text: ownershipDraft };
  auditResponseQueue.push((request) => {
    const inventory = clauseInventoryFromAuditRequest(request);
    assert.deepEqual(inventory.map((item) => item.owner), ["global", "global", "R1", "R1", "R2", "R2"]);
    return passingAudit(request);
  });
  result = await resume.handler(post({ action: "draft", target: "Talent Management Manager", experience: ownershipLedger, confirmedFacts: ownershipLedger }));
  assert.equal(result.statusCode, 200);

  const boundaryLedger = "ROLE 1\nJOB TITLE (EXACT): Boundary Role 1\nEMPLOYER OR UNIT (EXACT): Boundary Employer 1\nLOCATION (EXACT OR MISSING): MISSING\nDATES (EXACT OR MISSING): MISSING\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Used shared 44-unit scale and delivered 1100 hires.\n\nROLE 2\nJOB TITLE (EXACT): Boundary Role 2\nEMPLOYER OR UNIT (EXACT): Boundary Employer 2\nLOCATION (EXACT OR MISSING): MISSING\nDATES (EXACT OR MISSING): MISSING\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Used shared 44-unit scale and managed 22 specialists.\n\nEDUCATION (EXACT OR MISSING): MISSING\nCERTIFICATIONS (EXACT OR MISSING): MISSING\nSKILLS AND TOOLS (EXACT OR MISSING): Planning\nNUMBERS AND SCALE (EXACT OR MISSING): 22 specialists; shared 44-unit scale; 110; 77 sites\nTARGET ROLE (EXACT OR MISSING): Program Analyst";
  nextResponse = { status: "completed", output_text: "PROFESSIONAL EXPERIENCE\nBoundary Role 1 - Boundary Employer 1\nDelivered hiring work.\nBoundary Role 2 - Boundary Employer 2\nManaged specialist work." };
  auditResponseQueue.push((request) => {
    const catalog = factCatalogFromAuditRequest(request);
    assert.equal(catalog.find((fact) => fact.text === "22 specialists").owner, "R2");
    assert.equal(catalog.find((fact) => fact.text === "shared 44-unit scale").unlinked_number, true);
    assert.equal(catalog.find((fact) => fact.text === "110").unlinked_number, true);
    assert.equal(catalog.find((fact) => fact.text === "77 sites").unlinked_number, true);
    return passingAudit(request);
  });
  result = await resume.handler(post({ action: "draft", target: "Program Analyst", experience: boundaryLedger, confirmedFacts: boundaryLedger }));
  assert.equal(result.statusCode, 200);

  nextResponse = { status: "completed", output_text: "SUMMARY\nSynthetic summary claim.\nPROFESSIONAL EXPERIENCE\nSynthetic Role 1 - Synthetic Employer 1\nWorked with Synthetic Role 2 without changing ownership.\nSynthetic Role 2 - Synthetic Employer 2\nLed synthetic function 2." };
  auditResponseQueue.push((request) => { const audit = passingAudit(request); const catalog = factCatalogFromAuditRequest(request); audit.claim_trace[0].fact_refs = [catalog.find((fact) => fact.unlinked_number).fact_id]; return audit; });
  result = await resume.handler(post({ action: "draft", target: "Talent Management Manager", experience: ownershipLedger, confirmedFacts: ownershipLedger }));
  assert.equal(result.statusCode, 502);

  for (const contamination of ["[email]", "MISSING", "TIP: Add dates."]) {
    nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\n" + contamination };
    const before = calls.length;
    result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit with planning duties.", confirmedFacts: facts }));
    assert.equal(result.statusCode, 502);
    assert.equal(calls.length - before, 1);
  }

  for (const badRef of ["F999", "CROSS_ROLE", "GLOBAL_ROLE", "UNLINKED", "MALFORMED"]) {
    nextResponse = { status: "completed", output_text: "PROFESSIONAL EXPERIENCE\nHR Director - Synthetic Command\nLed personnel operations.\n\nDeputy Director - Synthetic Command\nManaged Workday reporting." };
    auditResponseQueue.push((request) => { const audit = passingAudit(request); const catalog = factCatalogFromAuditRequest(request); audit.claim_trace[0].fact_refs = badRef === "MALFORMED" ? null : [badRef === "F999" ? badRef : badRef === "CROSS_ROLE" ? catalog.find((fact) => fact.owner === "R2").fact_id : badRef === "UNLINKED" ? catalog.find((fact) => fact.unlinked_number).fact_id : catalog.find((fact) => fact.owner === "global" && !fact.unlinked_number).fact_id]; return audit; });
    result = await resume.handler(post({ action: "draft", target: "Human Resources Director", experience: factsRequest.experience, confirmedFacts: multiRoleFacts }));
    assert.equal(result.statusCode, 502);
    assert.equal(JSON.parse(result.body).reasonCategory, "quality_gate");
  }

  nextResponse = { status: "completed", output_text: liveCivilianDraft.replace("with a 110-person", "with 1,200 employees across 18 states and a 110-person") };
  const callsBeforeUnlinkedGlobal = calls.length;
  result = await resume.handler(post({ action: "draft", target: "Talent Management Manager", experience: liveLedger, confirmedFacts: liveLedger }));
  assert.equal(result.statusCode, 502);
  assert.equal(calls.length - callsBeforeUnlinkedGlobal, 1);

  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nClaimed RAW_SOURCE_ONLY_TOOL expertise." };
  auditResponseQueue.push((request) => { const audit = passingAudit(request); audit.claim_trace[1].verdict = "unsupported"; audit.claim_trace[1].fact_refs = []; return audit; });
  const callsBeforeRawOnly = calls.length;
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit used RAW_SOURCE_ONLY_TOOL extensively.", posting: "RAW_SOURCE_ONLY_TOOL preferred", confirmedFacts: facts }));
  assert.equal(result.statusCode, 422);
  assert.equal(calls.length - callsBeforeRawOnly, 2);
  assert.doesNotMatch(calls[callsBeforeRawOnly].input, /RAW_SOURCE_ONLY_TOOL extensively/);
  assert.doesNotMatch(calls[callsBeforeRawOnly].instructions, /member's source or confirmed fact sheet|unless it appears in the member's source/i);
  assert.match(calls[callsBeforeRawOnly].instructions, /sole controlling fact ledger/);

  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nLed planning work." };
  auditResponseQueue.push((request) => {
    const audit = passingAudit(request);
    audit.scorecard.pop();
    return audit;
  });
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Led planning work.", confirmedFacts: facts }));
  assert.equal(result.statusCode, 502);
  assert.match(JSON.parse(result.body).error, /quality review could not be verified/);

  const threeRoleFacts = "ROLE 1\nJOB TITLE (EXACT): NCOIC\nEMPLOYER OR UNIT (EXACT): 1st Bn., U.S. Army\nLOCATION (EXACT OR MISSING): Fort Example\nDATES (EXACT OR MISSING): Jan 2020 - Dec 2021\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Led PMCS for 15 personnel; managed $2M; maintained 95% readiness.\n\nROLE 2\nJOB TITLE (EXACT): Deputy Director of Personnel\nEMPLOYER OR UNIT (EXACT): 1st Bn., U.S. Army\nLOCATION (EXACT OR MISSING): Fort Example\nDATES (EXACT OR MISSING): MISSING\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Led talent management and succession planning.\n\nROLE 3\nJOB TITLE (EXACT): Senior Advisor\nEMPLOYER OR UNIT (EXACT): 1st Bn., U.S. Army\nLOCATION (EXACT OR MISSING): Fort Example\nDATES (EXACT OR MISSING): 2022 - 2023\nDUTIES AND OUTCOMES (EXACT FACTS ONLY): Advised leaders on workforce planning.\n\nEDUCATION (EXACT OR MISSING): B.S., Example University\nCERTIFICATIONS (EXACT OR MISSING): PMP\nSKILLS AND TOOLS (EXACT OR MISSING): PMCS; talent management\nNUMBERS AND SCALE (EXACT OR MISSING): 15 personnel; $2M; 95%\nTARGET ROLE (EXACT OR MISSING): Talent Development Manager";
  const threeRoleSource = "NCOIC at 1st Bn., U.S. Army from Jan 2020 - Dec 2021. Led PMCS for 15 personnel, managed $2M, and maintained 95% readiness; later served as Deputy Director of Personnel, then served as Senior Advisor at 1st Bn., U.S. Army from 2022 - 2023. Led talent management, succession planning, and workforce planning. B.S., Example University. PMP.";
  const civilianThreeRoleDraft = "NCOIC - 1st Bn., U.S. Army\nFort Example | Jan 2020 - Dec 2021\nLed preventive maintenance for 15 personnel and managed $2M while maintaining 95% readiness.\n\nDeputy Director of Personnel - 1st Bn., U.S. Army\nLed talent management and succession planning.\n\nSenior Advisor - 1st Bn., U.S. Army\nFort Example | 2022 - 2023\nAdvised leaders on workforce planning.\n\nCERTIFICATIONS\nPMP\nEDUCATION\nB.S., Example University";
  nextResponse = { status: "completed", output_text: civilianThreeRoleDraft };
  auditResponseQueue.push((request) => {
    const audit = passingAudit(request);
    audit.scorecard.find((item) => item.dimension === "date_completeness").status = "NEEDS MEMBER FACT";
    audit.unmet_gaps = ["Dates for Deputy Director of Personnel", "Posting-only Workday certification"];
    audit.supported_keywords = ["talent management", "succession planning"];
    return audit;
  });
  result = await resume.handler(post({ action: "draft", mode: "standard", target: "Talent Development Manager", experience: threeRoleSource, posting: "Talent management, succession planning, and Workday certification required.", confirmedFacts: threeRoleFacts }));
  assert.equal(result.statusCode, 200);
  const civilianAuditBody = JSON.parse(result.body);
  assert.equal(civilianAuditBody.scorecard.length, 10);
  assert.equal(civilianAuditBody.trace.length, draftClausesFromAuditRequest(calls.at(-1)).length);
  assert.ok(civilianAuditBody.trace.every((item) => item.claim_id && item.section && item.claim_text && item.fact_refs.length > 0 && Object.hasOwn(item, "posting_refs") && item.transform && item.verdict));
  assert.equal(civilianAuditBody.scorecard.find((item) => item.dimension === "date_completeness").status, "NEEDS MEMBER FACT");
  assert.deepEqual(civilianAuditBody.supportedKeywords, ["talent management", "succession planning"]);
  assert.match(civilianAuditBody.gaps.join(" "), /Workday certification/);
  assert.match(civilianAuditBody.bullets, /^NCOIC - 1st Bn\., U\.S\. Army[\s\S]*^Deputy Director of Personnel - 1st Bn\., U\.S\. Army[\s\S]*^Senior Advisor - 1st Bn\., U\.S\. Army/m);
  assert.doesNotMatch(civilianAuditBody.bullets, /Hours per week|Supervisor:/);
  assert.match(calls.at(-2).input, /Workday certification required/);
  assert.match(calls.at(-1).input, /Workday certification required/);

  nextResponse = { status: "completed", output_text: civilianThreeRoleDraft.replace("Fort Example | Jan 2020 - Dec 2021", "Fort Example | Jan 2020 - Dec 2021 | [Hours per week: __]\n[Supervisor: Name, Phone - may contact: Yes/No]") };
  result = await resume.handler(post({ action: "draft", mode: "federal", target: "Program Analyst", experience: threeRoleSource, confirmedFacts: threeRoleFacts }));
  assert.equal(result.statusCode, 200);
  assert.match(JSON.parse(result.body).bullets, /\[Hours per week: __\]/);
  assert.equal(calls.at(-2).max_output_tokens, 1900);

  const noMetricFacts = facts.replace("Led a 15-person team and managed a $2M equipment inventory.", "Led planning and maintenance work.").replace("15-person; $2M", "MISSING");
  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nLed planning and maintenance work." };
  auditResponseQueue.push((request) => {
    const audit = passingAudit(request);
    audit.scorecard.find((item) => item.dimension === "quantified_impact").status = "NEEDS MEMBER FACT";
    audit.unmet_gaps = ["Team size or readiness outcome"];
    return audit;
  });
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Led planning and maintenance work.", confirmedFacts: noMetricFacts }));
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).scorecard.find((item) => item.dimension === "quantified_impact").status, "NEEDS MEMBER FACT");
  assert.doesNotMatch(JSON.parse(result.body).bullets, /\b\d/);

  const longExperience = "Synthetic Logistics Leader at Synthetic Unit. Led a 15-person team and managed a $2M equipment inventory. " + "A".repeat(9000) + "ENDMARKER";
  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nLed a 15-person team and managed a $2M equipment inventory." };
  const callsBeforeLongInput = calls.length;
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: longExperience, posting: "P".repeat(5000), confirmedFacts: facts }));
  assert.equal(result.statusCode, 200);
  assert.equal(calls.length - callsBeforeLongInput, 2);
  assert.doesNotMatch(calls[callsBeforeLongInput].input, /ENDMARKER/);
  assert.ok(calls[callsBeforeLongInput].input.length < 22000);
  assert.match(JSON.parse(result.body).bullets, /Synthetic Logistics Leader - Synthetic Unit/);

  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nManaged $777 and achieved an 88% outcome.\nTIP: Add dates." };
  const callsBeforePostingOnlyGrounding = calls.length;
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Led planning work.", posting: postingOnlySentinel, confirmedFacts: facts }));
  assert.equal(result.statusCode, 502);
  assert.equal(JSON.parse(result.body).reasonCategory, "quality_gate");
  assert.equal(calls.length - callsBeforePostingOnlyGrounding, 1);
  assert.match(calls[callsBeforePostingOnlyGrounding].input, /POSTING_ONLY_SENTINEL/);

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

  nextResponse = { status: "completed", output_text: multiRoleFacts };
  result = await resume.handler(post({
    action: "facts",
    mode: "federal",
    role: "Human resources leader",
    target: "Program analyst",
    skills: "Workday",
    certs: "PMP",
    experience: "Served as HR Director at Synthetic Command and later served as Deputy Director. Used Workday across 26 years of service."
  }));
  assert.equal(result.statusCode, 200);
  assert.equal(calls.at(-1).max_output_tokens, 3500);
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
    assert.equal(JSON.parse(result.body).reasonCategory, "quality_gate");
    assert.match(JSON.parse(result.body).error, /did not pass grounding and role-structure checks/);
    assert.doesNotMatch(JSON.parse(result.body).error, /quality check failed|unsupported number|filler language|merged or missing/);
  }

  nextResponse = { status: "incomplete", incomplete_details: { reason: "max_output_tokens" }, output_text: "MEMBER SECRET request_id=req_123 token=999" };
  const callsBeforeOutputLimit = calls.length;
  result = await resume.handler(post({ action: "facts", experience: "This synthetic sentence is long enough to satisfy validation." }));
  assert.equal(result.statusCode, 502);
  assert.equal(JSON.parse(result.body).reasonCategory, "output_limit");
  assert.equal(JSON.parse(result.body).error, "We could not safely extract every fact into a complete fact sheet. Nothing was drafted or stored. Your source text is not the problem; this fact-sheet review needs a different workflow.");
  assert.equal(JSON.parse(result.body).stage, "facts");
  assert.equal(Object.hasOwn(JSON.parse(result.body), "factSheet"), false);
  assert.equal(calls.length - callsBeforeOutputLimit, 1);
  assert.doesNotMatch(result.body, /MEMBER SECRET|req_123|999|max_output_tokens/);

  nextResponse = { status: "incomplete", incomplete_details: { reason: "unrecognized_provider_reason" }, output_text: "PRIVATE DRAFT" };
  const callsBeforeUnknownIncomplete = calls.length;
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Led planning work.", confirmedFacts: facts }));
  assert.equal(result.statusCode, 502);
  assert.equal(JSON.parse(result.body).reasonCategory, "incomplete_unknown");
  assert.equal(calls.length - callsBeforeUnknownIncomplete, 1);
  assert.doesNotMatch(result.body, /unrecognized_provider_reason|PRIVATE DRAFT/);

  responseQueue = [{ status: "completed", output_text: invalidDateFacts }, { status: "incomplete", incomplete_details: { reason: "max_output_tokens" }, output_text: "PRIVATE REPAIR" }];
  const callsBeforeIncompleteRepair = calls.length;
  result = await resume.handler(post(factsRequest));
  assert.equal(result.statusCode, 502);
  assert.equal(JSON.parse(result.body).reasonCategory, "output_limit");
  assert.equal(JSON.parse(result.body).error, "We could not safely extract every fact into a complete fact sheet. Nothing was drafted or stored. Your source text is not the problem; this fact-sheet review needs a different workflow.");
  assert.equal(JSON.parse(result.body).stage, "facts");
  assert.equal(Object.hasOwn(JSON.parse(result.body), "factSheet"), false);
  assert.equal(calls.length - callsBeforeIncompleteRepair, 2);
  assert.doesNotMatch(result.body, /PRIVATE REPAIR|max_output_tokens/);

  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nLed planning work." };
  auditResponseQueue.push({ status: "incomplete", incomplete_details: { reason: "max_output_tokens" }, output_text: "PRIVATE AUDIT request_id=req_audit" });
  const callsBeforeIncompleteAudit = calls.length;
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Led planning work.", confirmedFacts: facts }));
  assert.equal(result.statusCode, 502);
  assert.equal(JSON.parse(result.body).reasonCategory, "output_limit");
  assert.equal(calls.length - callsBeforeIncompleteAudit, 2);
  assert.equal(JSON.parse(result.body).error, "Your draft was created, but the quality review needed more room to complete. Your confirmed facts are not the issue. Please try again.");
  assert.deepEqual(JSON.parse(result.body).blockers, ["The quality review could not be completed."]);
  assert.deepEqual(JSON.parse(result.body).scorecard, []);
  assert.doesNotMatch(JSON.parse(result.body).error, /shorten|facts are too long/i);
  assert.doesNotMatch(result.body, /PRIVATE AUDIT|req_audit|max_output_tokens/);

  nextResponse = { status: "completed", output_text: "Synthetic Logistics Leader - Synthetic Unit\nPROFESSIONAL EXPERIENCE\nLed planning work." };
  auditResponseQueue.push(() => { throw Object.assign(new Error("PRIVATE AUDIT TRANSPORT request_id=req_transport"), { name: "APIConnectionTimeoutError", code: "ETIMEDOUT", status: 408, type: "timeout" }); });
  const callsBeforeAuditTransport = calls.length;
  result = await resume.handler(post({ action: "draft", target: "Operations Manager", experience: "Synthetic Logistics Leader at Synthetic Unit. Led planning work.", confirmedFacts: facts }));
  assert.equal(result.statusCode, 502);
  assert.equal(JSON.parse(result.body).reasonCategory, "timeout");
  assert.equal(calls.length - callsBeforeAuditTransport, 2);
  assert.doesNotMatch(result.body, /PRIVATE AUDIT TRANSPORT|req_transport|ETIMEDOUT/);

  const timeoutError = Object.assign(new Error("MEMBER SECRET timeout request_id=req_timeout token=777"), { name: "APIConnectionTimeoutError", code: "ETIMEDOUT", status: 408, type: "timeout" });
  nextError = timeoutError;
  const callsBeforeTimeout = calls.length;
  result = await resume.handler(post({ action: "facts", experience: "This synthetic sentence is long enough to satisfy validation." }));
  assert.equal(JSON.parse(result.body).reasonCategory, "timeout");
  assert.equal(calls.length - callsBeforeTimeout, 1);
  assert.doesNotMatch(result.body, /MEMBER SECRET|req_timeout|777|ETIMEDOUT/);

  nextError = Object.assign(new Error("raw provider rate message"), { status: 429, code: "rate_limit_exceeded", type: "rate_limit_error" });
  const callsBeforeRateLimit = calls.length;
  result = await resume.handler(post({ action: "facts", experience: "This synthetic sentence is long enough to satisfy validation." }));
  assert.equal(JSON.parse(result.body).reasonCategory, "rate_limit");
  assert.equal(calls.length - callsBeforeRateLimit, 1);
  assert.doesNotMatch(result.body, /raw provider rate message|rate_limit_exceeded/);

  const capturedLogs = [];
  const originalConsoleLog = console.log;
  console.log = function () { capturedLogs.push(Array.from(arguments).join(" ")); };
  nextError = Object.assign(new Error("MEMBER SECRET billing body request_id=req_budget token=888"), { status: 429, code: "insufficient_quota", type: "billing_error" });
  const callsBeforeBudgetLimit = calls.length;
  result = await resume.handler(post({ action: "facts", experience: "This synthetic sentence is long enough to satisfy validation." }));
  console.log = originalConsoleLog;
  assert.equal(JSON.parse(result.body).reasonCategory, "budget_limit");
  assert.equal(calls.length - callsBeforeBudgetLimit, 1);
  assert.equal(capturedLogs.length, 0);
  assert.doesNotMatch(result.body, /MEMBER SECRET|billing body|req_budget|888|insufficient_quota/);

  nextError = Object.assign(new Error("raw upstream body"), { status: 503, code: "server_error", type: "server_error" });
  const callsBeforeUpstream = calls.length;
  result = await resume.handler(post({ action: "facts", experience: "This synthetic sentence is long enough to satisfy validation." }));
  assert.equal(JSON.parse(result.body).reasonCategory, "upstream_unavailable");
  assert.equal(calls.length - callsBeforeUpstream, 1);
  assert.doesNotMatch(result.body, /raw upstream body|server_error/);

  nextError = null;
  nextResponse = { status: "incomplete", output_text: "" };
  result = await navigator.handler(post({ messages: [{ role: "user", content: "Synthetic request" }] }));
  assert.equal(result.statusCode, 502);

  const auditCalls = calls.filter((call) => call.text && call.text.format && call.text.format.name === "resume_quality_audit");
  assert.ok(auditCalls.length > 0);
  assert.ok(calls.every((call) => call.store === false));
  assert.ok(auditCalls.every((call) => call.model === "gpt-5.6-terra" && call.max_output_tokens === 4000 && call.reasoning.effort === "none"));
  const resumeSource = fs.readFileSync(path.join(root, "netlify/functions/resume.js"), "utf8");
  const clientSource = fs.readFileSync(path.join(root, "netlify/functions/openai-client.js"), "utf8");
  const uiSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(packageData.dependencies.openai, "7.8.0");
  assert.doesNotMatch(resumeSource, /battalion -> "600-person organization"|Every bullet names scale/);
  assert.doesNotMatch(resumeSource, /1,200\+? employees across 18 states|7,000\+? Soldiers|110 people and a \$9M budget/);
  const civilianPrompt = resumeSource.match(/const system = `([\s\S]*?)`;/)[1];
  assert.doesNotMatch(civilianPrompt, /TIP:|\[[^\]]+\]/);
  assert.match(resumeSource, /AUDIT_INCREMENTAL_CEILING_USD = 0\.08/);
  assert.match(resumeSource, /BROWSER_DAILY_AUDIT_CEILING_USD = 0\.24/);
  assert.match(resumeSource, /EXTERNAL_MONTHLY_HARD_CAP_STATUS = "UNVERIFIED"/);
  const failureMessagesBlock = resumeSource.match(/const FAILURE_MESSAGES = \{([\s\S]*?)\n  \};/)[1];
  const publicCategories = Array.from(failureMessagesBlock.matchAll(/^    ([a-z_]+):/gm), (match) => match[1]);
  assert.deepEqual(publicCategories, ["output_limit", "timeout", "rate_limit", "budget_limit", "upstream_unavailable", "quality_gate", "incomplete_unknown"]);
  assert.match(resumeSource, /clip\(experience, 8000\)/);
  assert.match(resumeSource, /clip\(posting, 3500\)/);
  assert.doesNotMatch(resumeSource, /console\.(?:log|info|debug)/);
  assert.doesNotMatch(resumeSource, /\.message/);
  assert.match(clientSource, /maxRetries: 0/);
  assert.match(resumeSource, /action === "facts" \? 3500 : \(mode === "federal" \? 1900 : 2200\)/);
  assert.equal((resumeSource.match(/max_output_tokens: 3500/g) || []).length, 1);
  assert.match(resumeSource, /AUDIT_MAX_OUTPUT_TOKENS = 4000/);
  assert.equal(2200 - 1600, 600);
  assert.equal((((2200 - 1600) / 1600) * 100).toFixed(2), "37.50");
  assert.equal(((2200 - 1600) * 12 / 1000000).toFixed(4), "0.0072");
  assert.equal((((2200 - 1600) * 12 / 1000000) * 3).toFixed(4), "0.0216");
  assert.equal(2200 - 1300, 900);
  assert.equal((((2200 - 1300) / 1300) * 100).toFixed(2), "69.23");
  assert.equal(((2200 - 1300) * 12 / 1000000).toFixed(4), "0.0108");
  assert.equal((((2200 - 1300) * 12 / 1000000) * 3).toFixed(4), "0.0324");
  assert.equal(((4000 - 3000) * 12 / 1000000).toFixed(3), "0.012");
  assert.equal((((4000 - 3000) * 12 / 1000000) * 3).toFixed(3), "0.036");
  assert.equal((3500 * 1.2 / 1000000).toFixed(5), "0.00420");
  assert.equal((3500 * 12 / 1000000).toFixed(5), "0.04200");
  assert.equal(((3500 * 1.2 + 3500 * 12) / 1000000).toFixed(5), "0.04620");
  assert.equal((((3500 - 1300) * (1.2 + 12)) / 1000000).toFixed(5), "0.02904");
  assert.doesNotMatch(resumeSource + uiSource, /(?:three|3)\s+(?:fact|fact-sheet)\s+(?:requests|reviews).*day|daily\s+fact/i);
  assert.match(fs.readFileSync(path.join(root, "netlify/functions/navigator.js"), "utf8"), /max_output_tokens: 800/);
  assert.match(uiSource, /QUALITY SCORECARD/);
  assert.match(uiSource, /DRAFT WITHHELD/);
  assert.match(uiSource, /SHOW CLAIM TRACE/);
  assert.match(uiSource, /SUPPORTED JOB KEYWORDS/);
  assert.match(uiSource, /HONEST GAPS/);
  assert.match(uiSource, /Civilian format omits optional details/);
  assert.match(uiSource, /aiR\.mode === "federal" \? "RESUME COPIED \\u2014 fill the \[brackets\]/);
  assert.match(fs.readFileSync(path.join(root, "sw.js"), "utf8"), /transition-ops-v136/);
  assert.ok(auditCalls.every((call) => call.max_output_tokens === 4000) && calls.every((call) => call.store === false), "v0.7 preserves call caps and store:false");
  assert.match(uiSource, /auditTrace: Array\.isArray\(res\.d\.trace\)/);
  assert.doesNotMatch(uiSource, /__safeSet\([^\n]*(?:auditTrace|scorecard|supportedKeywords|auditGaps)/);

  console.log("PASS: synthetic RDM-1..RDM-68 control paths, v0.7 civilian omission/exact-identity/catalog isolation, six-role ledger, unchanged caps/calls/privacy controls (live model evaluation pending)");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
