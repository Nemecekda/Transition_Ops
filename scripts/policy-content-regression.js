#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const index = read("index.html");
const vaMathGuide = read("va-math/index.html");
const navigator = read("netlify/functions/navigator.mjs");
const verificationLog = read("intel/verification-log.md");

let checks = 0;
function check(condition, message) {
  checks += 1;
  assert.ok(condition, message);
  console.log("PASS " + message);
}

function occurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function requireAbsent(haystack, needle, label) {
  check(occurrences(haystack.toLowerCase(), needle.toLowerCase()) === 0, label);
}

check(occurrences(index, "function calcVACombined(") === 1,
  "calcVACombined has one canonical implementation");

const functionMatch = index.match(
  /function calcVACombined\(conditions\) \{[\s\S]*?\n\}\n\nfunction calcReadiness/
);
check(Boolean(functionMatch), "canonical calculator source is extractable");

const calculatorSource = functionMatch[0].replace(/\n\nfunction calcReadiness$/, "");
const sandbox = {};
vm.runInNewContext(calculatorSource + "\nthis.calcVACombined = calcVACombined;", sandbox);
const calcVACombined = sandbox.calcVACombined;

function tableReference(inputRatings) {
  const sorted = inputRatings
    .map((rating, indexValue) => ({ rating, name: "condition-" + indexValue }))
    .sort((a, b) => b.rating - a.rating);
  let running = 0;
  const steps = sorted.map((condition) => {
    const healthy = 100 - running;
    const taken = Math.floor(((healthy * condition.rating) + 50) / 100);
    running += taken;
    return {
      label: condition.name,
      rating: condition.rating,
      taken,
      healthy: 100 - running,
      running
    };
  });
  const rounded = Math.round(running / 10) * 10;
  return { combined: rounded, rounded, exact: running, steps };
}

function runVector(ratings) {
  const conditions = ratings.map((rating, indexValue) => ({
    rating,
    name: "condition-" + indexValue
  }));
  return JSON.parse(JSON.stringify(calcVACombined(conditions)));
}

const requiredVector = runVector([60, 30, 10]);
check(
  requiredVector.exact === 75 &&
    requiredVector.rounded === 80 &&
    requiredVector.combined === 80 &&
    requiredVector.steps.map((step) => step.running).join(",") === "60,72,75",
  "[60,30,10] carries 60 -> 72 -> 75 and converts once to 80"
);

const descendingVector = runVector([10, 60, 30]);
check(
  descendingVector.steps.map((step) => step.rating).join(",") === "60,30,10",
  "calculator sorts object callers from highest to lowest"
);

const allowedRatings = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
let vectorCount = 0;
for (const first of allowedRatings) {
  const one = [first];
  assert.deepEqual(runVector(one), tableReference(one));
  vectorCount += 1;
  for (const second of allowedRatings) {
    const two = [first, second];
    assert.deepEqual(runVector(two), tableReference(two));
    vectorCount += 1;
    for (const third of allowedRatings) {
      const three = [first, second, third];
      assert.deepEqual(runVector(three), tableReference(three));
      vectorCount += 1;
    }
  }
}
check(vectorCount === 1110, "1,110 deterministic one-, two-, and three-rating vectors match Table I parity");

const allPolicyCopy = index + "\n" + navigator;
[
  "C&P exams are VA-scheduled and cannot be rescheduled",
  "I have C&P exams being scheduled by the VA that I cannot reschedule",
  "BDD is time-sensitive and cannot be rescheduled",
  "Medical appointments for BDD claims are VA-scheduled and take priority",
  "Transition Center / SFL-TAP office has regulatory authority",
  "attendance is a statutory entitlement",
  "lose the ability to have a rating on Day 1",
  "rating effective the day after separation",
  "rating effective day one",
  "rating effective Day 1",
  "rating decision within weeks of separation",
  "decision typically 3-12 months after separation",
  "3-12 month wait",
  "Standard post-discharge claims take 3–6 months",
  "Missing BDD means 6-18 months",
  "delay your rating by 6-12+ months",
  "tens of thousands in delayed compensation",
  "you lose the fast-track",
  "longer treatment history makes conditions far easier",
  "longer documented treatment history are easier",
  "easier conditions are to rate",
  "No record = no claim",
  "military accepts VA physical",
  "Some leaders will try to block or delay",
  "IG complaint is a last resort",
  "far harder to claim later",
  "under-rated or never file",
  "exponentially harder to claim",
  "significantly harder to service-connect",
  "future VA claims substantially harder to service-connect"
].forEach((phrase) => requireAbsent(allPolicyCopy, phrase, "BDD prohibited phrase absent: " + phrase));

[
  "most members rate 60–120 days",
  "most rank categories cap at 60–120 days",
  "60–90 days for many grades",
  "Most SkillBridge participants report job offers",
  "Missing this window = walking out with no income",
  "processing: 60-90 days",
  "E1–E5 generally rate up to 120 days",
  "SkillBridge Application Window OPENS",
  "All services: the clock on command endorsement starts NOW",
  "senior grades at 60–90 days must start soon",
  "window functionally closed",
  "blanket 180-day planning assumption is dead",
  "Navy: confirm with your command career counselor"
].forEach((phrase) => requireAbsent(allPolicyCopy, phrase, "SkillBridge prohibited phrase absent: " + phrase));

check(index.includes("VBA goal: decision within 30 days after separation; not guaranteed."),
  "BDD member copy marks VBA's 30-day target as a non-guaranteed goal");
check(navigator.includes("VBA's stated goal is a decision within 30 days after separation, not a guarantee."),
  "Navigator marks VBA's 30-day target as a non-guaranteed goal");
check(allPolicyCopy.includes("available for VA exams within 45 days after filing"),
  "BDD exam-availability requirement is present");
check(index.includes("contact the VA medical center or contractor at least 48 hours in advance"),
  "BDD exam-rescheduling route is present");
check(index.includes("Gather service treatment records and document current conditions before filing."),
  "BDD preparation uses evidence-of-record guidance");
check(index.includes("If fewer than 90 days remain, file a standard pre-discharge claim instead."),
  "BDD closed-window guidance routes to the standard pre-discharge claim");
check(index.includes("Guard and Reserve members on qualifying full-time active duty may use BDD"),
  "BDD Guard and Reserve eligibility is qualified");

check(index.includes("Published ceilings range from 60–180 days"),
  "SkillBridge member copy uses a sourced ceiling range");
check(navigator.includes("Army, Air Force, Space Force, and Marine Corps standard tiers range from 60–120 days"),
  "Navigator names the 60-120-day service tiers");
check(navigator.includes("Coast Guard permits up to 180 days"),
  "Navigator preserves the Coast Guard exception");
check(navigator.includes("Navy tiers are 90, 120, or 180 days depending on paygrade and qualifying program"),
  "Navigator includes the verified Navy tiers");
check(index.includes("SkillBridge Service-Rule Check \u2014 T-365"),
  "SkillBridge T-365 reminder is a service-rule check, not a universal opening date");
check(index.includes("Use your current service instruction or MyNavyHR SkillBridge page to confirm your maximum days and approval authority"),
  "SkillBridge member copy routes users to current service-specific rules");
check(index.includes("Ceiling check: compare your service/paygrade maximum with the days remaining before separation"),
  "SkillBridge execution reminder compares the member's ceiling with time remaining");

const skillBridgeBlock = index.match(/\{\n    id:"skillbridge"[\s\S]*?\n  \},\n  \{\n    id:"bdd"/);
check(Boolean(skillBridgeBlock), "SkillBridge channel block is extractable");
check(skillBridgeBlock[0].includes("hardStartDay:-180"),
  "SkillBridge hardStartDay remains -180");
check(occurrences(index, '{label:"AR 600-81 (25 MAR 2026)"}') === 1,
  "Army publication source remains one label-only entry");
check(!index.includes('{label:"AR 600-81 (25 MAR 2026)",url:'),
  "Army publication source has no URL field");
check(index.includes('{label:"USCG ALCOAST 202/26",url:"https://content.govdelivery.com/accounts/USDHSCG/bulletins/41eb992"}'),
  "SkillBridge source list cites USCG ALCOAST 202/26");
check(index.includes('{label:"MyNavyHR SkillBridge",url:"https://www.mynavyhr.navy.mil/Career-Management/Transition/SkillBridge/"}'),
  "SkillBridge source list cites MyNavyHR directly");

requireAbsent(index, "Calculate your combined disability rating using the official VA formula",
  "VA calculator avoids an official-result claim");
requireAbsent(index, "100% P&T is the goal",
  "VA calculator avoids outcome-seeking copy");
requireAbsent(vaMathGuide, "it combines your ratings correctly",
  "VA guide avoids an official-correctness claim");
requireAbsent(vaMathGuide, "the final combined value is the same regardless of order",
  "VA guide does not waive the required ordering rule");
requireAbsent(index, "Combine disability ratings using VA's formula",
  "VA calculator entry copy avoids formula shorthand");
requireAbsent(index, "Calculate combined disability rating",
  "VA calculator action copy is framed as an estimate");
requireAbsent(index, '"VA says: \\"If you\'re "',
  "VA calculator explanation avoids decimal healthy-portion shorthand");
requireAbsent(index, '"Final: " + result.exact.toFixed(2)',
  "VA calculator display avoids decimal intermediate output");
requireAbsent(index, "100% P&T (Permanent & Total) unlocks",
  "VA calculator avoids a universal P&T benefits claim");
requireAbsent(vaMathGuide, "your real combined rating is higher than plain combined math gives",
  "VA guide does not promise that the bilateral factor changes the final rounded evaluation");
check(index.includes("VA converts only the final combined value to the nearest 10%; a final value ending in 5 rounds up."),
  "VA member copy states final-only conversion");
check(vaMathGuide.includes("carrying forward the exact whole-number table value"),
  "VA guide states intermediate whole-number carry-forward");
check(index.includes("38 CFR 4.25 Table I combines ratings from highest to lowest and carries each whole-number table value into the next step."),
  "VA calculator display explains Table I whole-number carry-forward");
check(index.includes('"Table I combines " + result.steps[i-1].running + "% with " + s.rating + "% = " + s.running + "%"'),
  "VA calculator steps display whole-number Table I combinations");
check(index.includes('"Final Table I value: " + result.exact + "%'),
  "VA calculator final display uses the whole-number Table I value");
check(index.includes("A 100% permanent-and-total designation can affect eligibility for additional federal and state benefits; verify each program's rules separately."),
  "VA calculator qualifies P&T-related benefit eligibility");
check(vaMathGuide.includes("the final rounded evaluation may or may not change"),
  "VA guide qualifies the bilateral factor's effect on the final rounded evaluation");

check(occurrences(navigator, "adaptive one- or two-page civilian resume") === 2,
  "Navigator has two adaptive one-/two-page resume descriptions");
requireAbsent(navigator, "builds a one-page civilian",
  "Navigator has no stale one-page-only resume description");

["V-2026-016", "V-2026-017", "V-2026-018"].forEach((recordId) => {
  check(occurrences(verificationLog, recordId) === 1,
    recordId + " appears exactly once in the verification log");
});

console.log("Policy content regression: PASS (" + checks + " assertions; " + vectorCount + " parity vectors)");
