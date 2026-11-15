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

assert.ok(index.includes('value:pcsMoveType==="retirement"?"3 YRS":"180 DAYS"'), "PCS summary distinguishes the general separation deadline");
assert.ok(!index.includes('value:pcsMoveType==="retirement"?"3 YRS":"1 YR"'), "PCS summary must not give separatees a one-year move deadline");
assert.ok(index.includes('Most separations; verify your orders') && index.includes('Official final-move guidance'), "PCS deadline retains qualification and official source");

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

// Cohort employers: identity links, and a SkillBridge note only where the official list shows the company.
// WI5-20261115-JOHNSONVILLE, WI5-20261115-TTX, WI5-20261115-SKILLBRIDGE-AUTHORIZED.
const cohortStart = index.indexOf("const TOPS_WISCONSIN_COHORT_EMPLOYERS = ") + "const TOPS_WISCONSIN_COHORT_EMPLOYERS = ".length;
const cohort = JSON.parse(index.slice(cohortStart, index.indexOf("\n", cohortStart)).replace(/;\s*$/, ""));
check(JSON.stringify(cohort.map((item) => item.id)) === JSON.stringify(["WI2-20261016-AIRTECH", "WI2-20261016-WMC", "WI2-20261016-KRIETE", "WI5-20261115-JOHNSONVILLE", "WI5-20261115-TTX"]),
  "cohort lists the five employers Dean named, in order");
check(JSON.stringify(cohort.map((item) => item.url)) === JSON.stringify(["https://airtechhtg.com/careers/", "https://www.wisconsinmanagement.com/careers", "https://krietetrucks.com/careers/", "https://careers.johnsonville.com/Johnsonville", "https://www.ttxinc.com/careers"]),
  "each cohort employer links to its own careers page");
check(JSON.stringify(cohort.filter((item) => item.skillbridge).map((item) => item.id)) === JSON.stringify(["WI2-20261016-WMC", "WI2-20261016-KRIETE"]),
  "only the two organizations on the official list carry a SkillBridge note");
check(cohort.filter((item) => item.skillbridge).every((item) => /official list of authorized SkillBridge organizations/.test(item.skillbridge) && /checked 15 NOV 2026/.test(item.skillbridge) && /No position was listed in the official opportunity search that day/.test(item.skillbridge) && item.skillbridgeVerification === "WI5-20261115-SKILLBRIDGE-AUTHORIZED"),
  "each SkillBridge note states the list, the check date and the empty opportunity search");
check(cohort.every((item) => occurrences(verificationLog, "## " + item.verification + " ") === 1),
  "every cohort employer has exactly one verification record");
check(occurrences(index, "roles coming soon") === 0 && occurrences(index, "are not posted yet") === 0,
  "the job search block no longer promises or denies posted roles");

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

const cloneProvenance = "### Source identifier: CLONE-0433f333e1de16d2dfd06e0cad4cb9a1ba025008";
const mainProvenance = "### Source identifier: MAIN-d82516389ed5906febad467cfe57887acda97053";
check(occurrences(verificationLog, cloneProvenance) === 1, "one immutable clone verification source");
check(occurrences(verificationLog, mainProvenance) === 1, "one immutable published verification source");
check(verificationLog.indexOf(cloneProvenance) < verificationLog.indexOf(mainProvenance), "verification source sections remain ordered and separate");
const cloneRecords = verificationLog.slice(verificationLog.indexOf(cloneProvenance), verificationLog.indexOf(mainProvenance));
const mainRecords = verificationLog.slice(verificationLog.indexOf(mainProvenance));
["V-2026-016", "V-2026-017", "V-2026-018"].forEach((recordId) => {
  check(occurrences(cloneRecords, recordId) === 1,
    recordId + " appears exactly once within its clone source");
  check(occurrences(mainRecords, "## " + recordId + " —") === (recordId === "V-2026-017" ? 2 : 1),
    recordId + " published record and any amendment remain within their main source");
});

// TRICARE pharmacy copays, their exceptions and the Prime travel distance.
// V-2026-11-14-TRICARE-COPAY-EXCEPTIONS and V-2026-11-14-PRIME-TRAVEL-NONARMED.
const tricareCard = index.slice(index.indexOf('{id:"r-9-tri26"'), index.indexOf('{id:"r-6-vettec"'));
check(tricareCard.includes('"Retail (30-day): $16 generic / $48 brand-name"') && tricareCard.includes('"Home delivery (90-day): $14 generic / $44 brand / $85 non-formulary"'),
  "TRICARE card keeps the general copays");
check(tricareCard.includes('"TRICARE lists these copays for calendar years 2026 and 2027"'),
  "TRICARE card states the calendar years its copays cover");
check(tricareCard.includes("active duty service members, and active duty family members in TRICARE Prime Remote in the U.S., pay $0 for covered drugs at military, retail network and home delivery pharmacies"),
  "TRICARE card names the two groups that pay $0");
check(tricareCard.includes("medically retired service members, their family members, and survivors of active duty service members pay lower copays: retail (30-day) $10 generic / $24 brand-name / $50 non-formulary; home delivery (90-day) $0 generic / $20 brand-name / $49 non-formulary"),
  "TRICARE card carries the frozen copays for medically retired members, their families and survivors");
check(tricareCard.includes('link:"https://www.tricare.mil/Costs/PharmacyCosts"') && index.includes('src: "TRICARE.mil \\u2014 Pharmacy Costs", url: "https://www.tricare.mil/Costs/PharmacyCosts"'),
  "TRICARE card and policy entry link to the page that shows the copay figures");
check(occurrences(index, "Medically retired members, their families, and survivors of active duty service members pay less.") === 2,
  "both TRICARE copay summaries say who pays less");
check(occurrences(index, "(PHS and NOAA families and retirees remain at 100 miles)") === 4 && occurrences(index, "(retirees remain at 100 miles)") === 0,
  "all four Prime travel lines keep PHS, NOAA and retiree families at 100 miles");

// TAMP Guard/Reserve eligibility and the reimbursement request.
// V-2026-11-15-TAMP-RESERVE-ELIGIBILITY and V-2026-11-15-TAMP-REIMBURSEMENT.
const tampDha = "dha.san-diego.healthcare-ops.mbx.thp-eligibility-adj@health.mil";
const tampWindow = index.slice(index.indexOf('id:"tricare", num:6'), index.indexOf('{"label":"milConnect BWE"'));
check(tampWindow.length > 2000 && tampWindow.includes('"Guard/Reserve release after more than 30 consecutive days of active duty for a preplanned mission (10 U.S.C. 12304b) or a contingency operation, including members who volunteered for active duty under 10 U.S.C. 12301(d)"'),
  "TAMP list names the 12304b, contingency and 12301(d) routes");
check(tampWindow.includes('"Guard/Reserve members do not need to show that the service was connected to a war, a contingency operation or a national emergency (DoD memo, corrected copy dated 27 AUG 2026)"'),
  "TAMP list carries the memo's no-connection statement");
check(occurrences(index, 'for a preplanned mission or contingency operation"') === 0 && occurrences(index, "preplanned mission or contingency, and") === 0 && occurrences(navigator, "preplanned mission or contingency, and") === 0,
  "no surface keeps the superseded Guard/Reserve TAMP route wording");
check(tampWindow.includes("found ineligible for TAMP on or after 24 APR 2020 because the activation was not treated as qualifying: email the Defense Health Agency at " + tampDha),
  "TAMP window gives the reimbursement request and its 24 APR 2020 look-back");
check(tampWindow.includes("tricare.mil/TAMP did not yet show the memo when checked 15 NOV 2026") && tampWindow.includes("this list is not a self-certification"),
  "TAMP note dates the tricare.mil check and keeps the service determination");
check(tampWindow.includes('{"label":"TAMP eligibility","url":"https://www.tricare.mil/TAMP"},{"label":"DoD TAMP eligibility memo, 27 AUG 2026 (PDF)","url":"https://www.hqrio.afrc.af.mil/Portals/149/Documents/27%20Aug%202026%20%E2%80%93%20Transitional%20Assistance%20Management%20Program%20Eligibility%20Memo.pdf"}'),
  "TAMP window links the memo beside the TRICARE page");
check(index.includes("including voluntary active duty under 10 U.S.C. 12301(d), and more than 30 consecutive days of qualifying National Guard Title 32 section 502(f) duty. A DoD memo (corrected copy dated 27 AUG 2026) says you do not need to show a connection to a war, contingency operation or national emergency.") &&
  navigator.includes("including voluntary active duty under 10 U.S.C. 12301(d), and more than 30 consecutive days of qualifying National Guard Title 32 section 502(f) duty. A DoD memo (corrected copy dated 27 AUG 2026) says Guard/Reserve members do not need to show the service was connected to a war, contingency operation or national emergency."),
  "Guard demobilization line and Navigator corpus state the same TAMP routes");
check(occurrences(index, tampDha) === 2 && occurrences(navigator, tampDha) === 1 && occurrences(index, "thp-eligibility-adj@") === 2 && occurrences(navigator, "thp-eligibility-adj@") === 1,
  "the Defense Health Agency address is spelled the same on every surface");
check(index.includes('{ date: "27 AUG 2026", title: "TAMP: Guard/Reserve eligibility clarified, with reimbursement for past denials"') &&
  occurrences(verificationLog, "## V-2026-11-15-TAMP-RESERVE-ELIGIBILITY ") === 1 && occurrences(verificationLog, "## V-2026-11-15-TAMP-REIMBURSEMENT ") === 1,
  "TAMP policy entry exists with one verification record per finding");

// CareerOneStop Job Finder and Veterans Job Matcher links in Career job search.
// V-2026-11-15-CAREERONESTOP-JOB-LINKS.
check(index.includes('careeronestop: "https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?" + new URLSearchParams({ keyword: role, location: area }).toString(),'),
  "job search builds the CareerOneStop results address from the role and area only");
check(occurrences(index, '"Search CareerOneStop jobs (new tab)"') === 1 && index.includes('{ id: "tops-job-careeronestop", href: links.careeronestop, target: "_blank", rel: "noopener noreferrer", "aria-describedby": "tops-job-sharing tops-job-careeronestop-note", style: link }'),
  "CareerOneStop search opens in a new tab and is described by the sharing notice");
check(index.includes('"CareerOneStop is sponsored by the U.S. Department of Labor. Its listings come from state job banks and employers through the National Labor Exchange, and you can read a posting without an account."'),
  "CareerOneStop note states sponsor, listing source and account-free reading");
check(index.includes('{ id: "tops-job-veteran-matcher", href: "https://www.careeronestop.org/Toolkit/Jobs/match-veteran-jobs.aspx", target: "_blank", rel: "noopener noreferrer", style: link }, "Find civilian careers related to your military job: Veterans Job Matcher (new tab)"'),
  "Veterans Job Matcher link is offered beside the state job banks");
check(occurrences(index, "CareerOneStop, LinkedIn and state job banks open separately.") === 1 && occurrences(index, "or open CareerOneStop, LinkedIn and USAJOBS searches. No automatic job matching.") === 1 &&
  occurrences(index, ". LinkedIn and state job banks open separately.") === 0 && occurrences(index, "or open LinkedIn and USAJOBS searches.") === 0,
  "both job search summaries name CareerOneStop and neither keeps the two-site wording");
check(occurrences(verificationLog, "## V-2026-11-15-CAREERONESTOP-JOB-LINKS ") === 1 && !/vetted|guarantee/i.test(index.slice(index.indexOf('id: "tops-job-careeronestop"'), index.indexOf('id: "tops-job-careeronestop"') + 1200)),
  "job links carry one verification record and make no vetting or guarantee claim");

// FRONTLINE Cadre intake link in the recruiter contact section.
// V-2026-11-15-VBS-TALENT-NETWORK.
check(occurrences(index, 'const TOPS_TALENT_NETWORK = "https://apply.veteranbridgesolutions.com/apply";') === 1 && occurrences(index, "apply.veteranbridgesolutions.com") === 1,
  "talent network address is defined once and used through its constant");
check(index.includes('{ id: controlId("tops-talent-network"), href: TOPS_TALENT_NETWORK, target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer"'),
  "talent network link opens in a new tab with no opener and no referrer");
check(index.includes("Veteran Bridge Solutions' own intake form, on a separate VBS site. It requires your name, email and one career area, and no resume. Employers pay VBS to fill roles; joining costs you nothing. Read the form's privacy notice before you submit: it covers storage, AI-assisted review and when VBS shares your information with an employer. Opens a new tab."),
  "talent network note says who runs it, what it requires, who pays and what its privacy notice covers");
check(index.includes('"Dean is a recruiter with Veteran Bridge Solutions. Book a conversation, join the VBS talent network or introduce yourself by email. None of these guarantees a response, interview or job."') && occurrences(index, "Neither guarantees a response, interview or job.") === 0,
  "contact section names all three options and keeps the no-guarantee statement");
check(occurrences(verificationLog, "## V-2026-11-15-VBS-TALENT-NETWORK ") === 1, "talent network link carries one verification record");

console.log("Policy content regression: PASS (" + checks + " assertions; " + vectorCount + " parity vectors)");
