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
check(occurrences(index, 'const TOPS_TALENT_NETWORK = "https://apply.veteranbridgesolutions.com/apply";') === 1 && occurrences(index, 'const TOPS_TALENT_ROLES = "https://apply.veteranbridgesolutions.com/roles";') === 1 && occurrences(index, "apply.veteranbridgesolutions.com") === 2,
  "the two VBS addresses are each defined once and used through their constants");
check(index.includes('{ id: controlId("tops-talent-network"), href: TOPS_TALENT_NETWORK, target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer"'),
  "talent network link opens in a new tab with no opener and no referrer");
check(index.includes("Veteran Bridge Solutions' own intake form, on a separate VBS site. It requires your name, email and one career area, and no resume. Employers pay VBS to fill roles; joining costs you nothing. Read the form's privacy notice before you submit: it covers storage, AI-assisted review and when VBS shares your information with an employer. Opens a new tab."),
  "talent network note says who runs it, what it requires, who pays and what its privacy notice covers");
check(index.includes('"Dean is a recruiter with Veteran Bridge Solutions. Book a conversation, join the VBS talent network, see the roles VBS is filling or introduce yourself by email. None of these guarantees a response, interview or job."') && occurrences(index, "Neither guarantees a response, interview or job.") === 0 && occurrences(index, "join the VBS talent network or introduce yourself by email.") === 0,
  "contact section names all four options and keeps the no-guarantee statement");
check(occurrences(verificationLog, "## V-2026-11-15-VBS-TALENT-NETWORK ") === 1, "talent network link carries one verification record");

// HIRE Vets Medallion: links to the Department of Labor's recipient list.
// V-2026-11-15-HIREVETS-MEDALLION.
check(occurrences(index, '{ id: "tops-job-hire-vets-medallion", href: "https://www.hirevets.gov/awardees_table", target: "_blank", rel: "noopener noreferrer", "aria-describedby": "tops-job-hire-vets-medallion-note", style: link }, "See employers with a HIRE Vets Medallion Award (new tab)"') === 1,
  "job search offers the federal award list once, in a new tab with no opener and no referrer");
check(index.includes('{ id: "tops-job-hire-vets-medallion-note", style: { color: C.textSecondary, margin: "0 0 14px" } }, "The U.S. Department of Labor gives this award to employers for hiring and retaining veterans. Filter the official list by state and award year. Employers apply for it and attest to the information they submit, and an award does not establish a current opening or a hiring preference."'),
  "job search note names the issuer, the filters, the self-attestation and the award boundary");
check(occurrences(index, "const TOPS_WISCONSIN_MEDALLION = ") === 1 && index.includes('"url":"https://www.hirevets.gov/awardees_table?field_employer_state_value=51"') && occurrences(index, "hirevets.gov/awardees_table") === 2 && !/awardees_table[^"]*created=/.test(index),
  "Wisconsin section links the official list filtered to Wisconsin, the list is linked in two places only, and no link pins an award year");
check(index.includes("This federal award is separate from Wisconsin's Vets Ready recognition. Employers apply for it and attest to the information they submit, and the Department of Labor checks for violations of veteran-related labor laws. An award does not establish a current opening, job quality for every worker, hiring preference, or SkillBridge approval.") &&
  index.includes('React.createElement("section", { id: "tops-wisconsin-hire-vets", style: { padding: "8px 0 14px" } }'),
  "Wisconsin note separates the federal award from Vets Ready and states how it is verified and what it does not establish");
{
  const medallionLine = (index.match(/const TOPS_WISCONSIN_MEDALLION = [^\n]*\n/) || [""])[0];
  const recipients = ["Salute Mission Critical, LLC", "REDI Transports", "U.S. Vet General Contracting, LLC", "ITU AbsorbTech", "Vocational Rehabilitation Specialists Inc", "Sakom Services WI LLC", "Outdoor Services of the Coulee Region Inc., doing business as Outdoor Services, Inc."];
  check(recipients.every(function (name) { return occurrences(index, '"name":"' + name + '"') === 1 && medallionLine.includes('"name":"' + name + '"'); }) && occurrences(medallionLine, '"name":"') === 7,
    "the seven 2026 Wisconsin recipients are named once each, as the Department of Labor rows spell them, and only in the Wisconsin list");
  check(medallionLine.includes('"recipientsCaption":"The Department of Labor\'s list showed these seven Wisconsin recipients for the 2026 award year when read on 15 NOV 2026. The official list is the source and can change."') && index.includes('{ id: "tops-wisconsin-hire-vets-recipients", "aria-describedby": "tops-wisconsin-hire-vets-caption"'),
    "the recipient list carries its issuer, award year and read date, and says the official list is the source");
}
check(occurrences(verificationLog, "## V-2026-11-15-HIREVETS-MEDALLION-NAMES ") === 1, "naming the recipients carries its own verification record");
check(occurrences(verificationLog, "## V-2026-11-15-HIREVETS-MEDALLION ") === 1, "HIRE Vets Medallion links carry one verification record");

// SkillBridge feed freshness: the hand-kept feed states its age and points to the official list.
// V-2026-11-15-SKILLBRIDGE-FEED-AGE.
{
  const ageSource = (index.match(/function topsSkillbridgeBatchAgeDays\(week, now\) \{[\s\S]*?\n\}/) || [])[0];
  const age = ageSource ? new Function(ageSource + "; return topsSkillbridgeBatchAgeDays;")() : null;
  check(!!age && age("1-9 JUL 2026", Date.UTC(2026, 10, 15)) === 129 && age("27 JAN - 2 FEB 2026", Date.UTC(2026, 1, 10)) === 8 && age("8-14 JUN 2026", Date.UTC(2026, 5, 14)) === 0 && age("someday", 0) === null && age("", 0) === null,
    "the batch date reader returns whole days from the last date in the label and null when the label has no date");
}
check(occurrences(index, "const TOPS_SKILLBRIDGE_STALE_DAYS = 45;") === 1 && occurrences(index, 'const TOPS_SKILLBRIDGE_FINDER_URL = "https://skillbridge.mil/locations";') === 1 && index.includes("return age === null || age > TOPS_SKILLBRIDGE_STALE_DAYS;"),
  "a batch older than 45 days, or one whose date cannot be read, counts as old");
check(occurrences(index, "SKILLBRIDGE_FEED[0].companies && topsSkillbridgeFeedIsStale() && React.createElement(\"div\", { id: \"tops-home-skillbridge-check\"") === 1 && occurrences(index, "SKILLBRIDGE_FEED[0].companies && !topsSkillbridgeFeedIsStale() && React.createElement(\"div\", { style: { margin: \"20px 2px 16px\" } },") === 1,
  "Home shows the company teaser only while the newest batch is fresh, and the official-list pointer otherwise");
check(index.includes('"The newest batch in our SkillBridge list covers " + SKILLBRIDGE_FEED[0].week + ". Search the official SkillBridge list for current openings."') && index.includes('", and openings change. Confirm any listing on the official SkillBridge list before you plan around it."'),
  "both notices state the batch dates and send the member to the official list");
check(occurrences(index, "href: TOPS_SKILLBRIDGE_FINDER_URL, target: \"_blank\", rel: \"noopener noreferrer\"") === 2 && occurrences(index, '"Search official SkillBridge opportunities (new tab)"') === 3,
  "the official list link appears on Home and above the full feed, in a new tab with no opener and no referrer, with the same label the Career search section already uses");
check(occurrences(verificationLog, "## V-2026-11-15-SKILLBRIDGE-FEED-AGE ") === 1, "the feed-age notices carry one verification record");

// VBS open roles link in the recruiter contact section.
// V-2026-11-15-VBS-OPEN-ROLES.
check(index.includes('{ id: controlId("tops-talent-open-roles"), href: TOPS_TALENT_ROLES, target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer"') && occurrences(index, '"See open roles Veteran Bridge Solutions is filling"') === 1,
  "open roles link opens in a new tab with no opener and no referrer");
check(index.includes("Veteran Bridge Solutions' own list of roles it is recruiting for, on the same separate VBS site. Roles change, and the list can be empty. Applying there does not guarantee an interview or a job. Opens a new tab."),
  "open roles note says whose list it is, that it changes and that applying guarantees nothing");
check(!/Wulf|HVAC Service Technician/.test(index.slice(index.indexOf('controlId("tops-talent-open-roles")'), index.indexOf('controlId("tops-talent-open-roles")') + 900)),
  "the app names no individual role or client beside the link; the VBS page is the source");
check(occurrences(index, 'controlId("tops-talent-open-roles")') === 1 && occurrences(index, 'controlId("tops-talent-roles")') === 0,
  "the open roles link has its own id and does not take the id of the email form's roles field");
check(occurrences(verificationLog, "## V-2026-11-15-VBS-OPEN-ROLES ") === 1, "open roles link carries one verification record");

// One-year mark for a VA disability claim: one post-separation reminder with its own window.
// V-2026-11-15-VA-CLAIM-ONE-YEAR.
{
  const nine = (index.match(/\{id:"r-p10-claim",mo:-10,[^\n]*\},\n/) || [""])[0];
  check(nine.includes('pri:"CRITICAL"') && nine.includes("VA says that if it gets your claim within 1 year of the day you left active service, the effective date can be as early as the day following separation.") && nine.includes('link:"https://www.va.gov/disability/effective-date/"'),
    "the one-year claim reminder states VA's rule in VA's own terms and links the VA page");
  check(nine.includes("If you already filed, this reminder needs no action") && nine.includes("VA states this rule for direct service connection.") && nine.includes("This reminder does not establish eligibility or a rating.") && nine.includes("this reminder does not address Guard or Reserve periods of service"),
    "the reminder excuses members who already filed, limits the rule to direct service connection, claims no eligibility or rating and does not address Guard or Reserve service");
  check(!/intent to file/i.test(nine) && !/\$|\d{3}-\d{3}-\d{4}|back pay|retroactive/i.test(nine) && !/BDD|PACT/.test(nine),
    "the reminder mentions no intent to file, dollar figure, phone number, BDD or PACT Act");
}
check(occurrences(index, "var RUNG_CLAIM_YEAR_WINDOW = { start: -270, end: -360 };") === 1 && occurrences(index, 'if (rung.id === "r-p10-claim") return Number.isFinite(d) && d <= RUNG_CLAIM_YEAR_WINDOW.start && d >= RUNG_CLAIM_YEAR_WINDOW.end;') === 1 && occurrences(index, 'if (rung.id === "r-p10-claim") return d < RUNG_CLAIM_YEAR_WINDOW.end;') === 1 && occurrences(index, 'if (rung.id === "r-6-bdd2" || rung.id === "r-p10-claim") return rungIsDue(rung, dateStr);') === 1,
  "the reminder is current from day 270 to day 360 after separation and dark after that, on Home and in the ladder");
check(index.indexOf('{id:"r-p6",mo:-6,') < index.indexOf('{id:"r-p10-claim",mo:-10,') && index.indexOf('{id:"r-p10-claim",mo:-10,') < index.indexOf('{id:"r-p12",mo:-12,') && occurrences(index, '"r-p10-claim"') === 7 && occurrences(index, '"r-p10-claim": "VA disability claim: first-year timing"') === 1 && index.includes('rung.id !== "r-p10-claim" && !bddWindowCard') && index.includes('rung.id === "r-p10-claim" ? RUNG_CLAIM_YEAR_WINDOW.start : rungTriggerDay(rung)'),
  "the reminder sits between the month 6 and month 12 reminders, and its timing note follows its own window");
check(occurrences(verificationLog, "## V-2026-11-15-VA-CLAIM-ONE-YEAR ") === 1, "the one-year claim reminder carries one verification record");

// What's New entry and the two verified stamps. V-2026-11-15-VERIFIED-STAMP.
check(occurrences(index, 'const APP_VERSION = "v99";') === 1 && /const WHATS_NEW = \[\n  \{ v: "v99", date: "15 NOV 2026", note: "TAMP for Guard and Reserve: a DoD memo clarified who qualifies/.test(index),
  "the app version and the first What's New entry are both v99, dated 15 NOV 2026");
check(occurrences(index, 'const DATA_VERIFIED = "1 AUG 2026";') === 1 && occurrences(index, 'const DATA_LATEST_CHECK_DATE = "15 NOV 2026";') === 1 && occurrences(index, 'const DATA_LATEST_CHECK = DATA_LATEST_CHECK_DATE + ", 19:18 UTC";') === 1,
  "the full-review date is unchanged and the latest-check stamp carries a date and a time");
check(index.includes('or both. Full data review " + DATA_VERIFIED + ". Latest source check " + DATA_LATEST_CHECK + "."') && index.includes('SOURCED \\u00B7 LATEST CHECK " + DATA_LATEST_CHECK_DATE)') && occurrences(index, '"Last verified: " + DATA_VERIFIED + ""') === 1 && !index.includes('VERIFIED " + DATA_VERIFIED)'),
  "Critical Windows shows both stamps, the policy panel shows the latest check, and the directory footnote keeps the full-review date");
{
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const dated = Array.from(verificationLog.matchAll(/^## V-(\d{4})-(\d{2})-(\d{2})-/gm)).map(function (m) { return m[1] + m[2] + m[3]; }).sort();
  const newest = dated[dated.length - 1] || "";
  const stamp = newest ? String(Number(newest.slice(6, 8))) + " " + months[Number(newest.slice(4, 6)) - 1] + " " + newest.slice(0, 4) : "";
  check(stamp === "15 NOV 2026" && index.includes('const DATA_LATEST_CHECK_DATE = "' + stamp + '";'),
    "the latest-check date equals the date of the newest dated entry in the verification log");
}
check(occurrences(verificationLog, "## V-2026-11-15-VERIFIED-STAMP ") === 1, "the verified stamps carry one verification record");

// TRICARE 2027 Prime and Select costs published. V-2026-11-15-TRICARE-2027-COSTS. No dollar figure is added.
{
  const listHead = "const POLICY_CHANGES = [\n";
  const entry = (index.match(/  \{ date: "12 NOV 2026", title: "TRICARE 2027: Prime and Select costs published",[^\n]*\},\n/) || [""])[0];
  check(entry.length > 0 && index.indexOf(entry) === index.indexOf(listHead) + listHead.length && occurrences(index, 'title: "TRICARE 2027: Prime and Select costs published"') === 1,
    "the TRICARE 2027 entry is the first Policy Intel entry and appears once");
  check(entry.includes("DoD published calendar year 2027 out-of-pocket costs for TRICARE Prime and TRICARE Select, effective 1 JAN 2027.") &&
    entry.includes("TRICARE Open Season for 2027 coverage: 9 NOV to 8 DEC 2026.") &&
    entry.includes("Outside that window, TRICARE allows enrollment in, or a change to, a Prime option or Select only after a Qualifying Life Event."),
    "the entry gives the effective date, the open season dates and the rule outside the window");
  check(entry.includes('url: "https://www.tricare.mil/CompareCosts"') && entry.includes('src: "TRICARE Health Plan Costs; Federal Register 91 FR 72858"'),
    "the entry links TRICARE's cost page and cites the Federal Register notice");
  check(!/\$\d/.test(entry) && entry.includes("TRICARE lists the pharmacy copays shown in this app for calendar years 2026 and 2027."),
    "the entry carries no dollar figure and states the years TRICARE gives for the pharmacy copays");

  const noticeStart = index.indexOf('React.createElement("section", { id: "tops-tricare-open-season-2026"');
  const notice = index.slice(noticeStart, index.indexOf("\n      ),\n", noticeStart));
  check(noticeStart > 0 && occurrences(index, 'id: "tops-tricare-open-season-2026"') === 1 &&
    occurrences(notice, 'React.createElement("p", { id: "tops-tricare-open-season-2026-costs", style: { margin: "0 0 8px" } }, "DoD has published 2027 costs for TRICARE Prime and TRICARE Select, effective Jan. 1, 2027. TRICARE\'s Health Plan Costs page lists them."),') === 1,
    "the open season notice says 2027 costs are published and where TRICARE lists them");
  check(occurrences(notice, 'id: "tops-tricare-open-season-2026-costs-link", href: "https://www.tricare.mil/CompareCosts", target: "_blank", rel: "noopener noreferrer"') === 1 &&
    occurrences(notice, '"2027 health plan costs on tricare.mil (new tab)"') === 1 &&
    occurrences(notice, 'href: "https://www.tricare.mil/About/Changes/OpenSeason", target: "_blank", rel: "noopener noreferrer"') === 1 &&
    occurrences(notice, "React.createElement(\"a\", ") === 2 && !/\$\d/.test(notice),
    "the notice links TRICARE's cost page in a new tab, keeps its open season link and carries no dollar figure");
  check(occurrences(notice, "sign in to milConnect or call your TRICARE regional contractor by Dec. 8, 2026. Changes take effect Jan. 1, 2027.") === 1 &&
    occurrences(notice, "This does not apply to active duty service members, or to TRICARE For Life, TRICARE Reserve Select, TRICARE Retired Reserve, or TRICARE Young Adult coverage.") === 1 &&
    occurrences(notice, "!reminderTimedOnly && topsTricareOpenSeason2026Active() && ") === 0 &&
    occurrences(index, '!reminderTimedOnly && topsTricareOpenSeason2026Active() && React.createElement("section", { id: "tops-tricare-open-season-2026"') === 1,
    "the notice keeps its one act sentence, its exclusion line and its date gate");

  const helperStart = index.indexOf("function topsTricareOpenSeason2026Active(now) {");
  const helper = index.slice(helperStart, index.indexOf("\n}\n", helperStart) + 3);
  const windowSandbox = {};
  // Dates are built inside the sandbox: a Date from this realm fails the helper's instanceof test and would fall back to today.
  vm.runInNewContext(helper + "\nthis.at = function(y, m, d, h) { return topsTricareOpenSeason2026Active(new Date(y, m - 1, d, h, 0, 0)); };\nthis.fallback = topsTricareOpenSeason2026Active('2026-11-20');", windowSandbox);
  check(helperStart > 0 && windowSandbox.at(2026, 11, 8, 23) === false && windowSandbox.at(2026, 11, 9, 0) === true && windowSandbox.at(2026, 11, 15, 12) === true &&
    windowSandbox.at(2026, 12, 8, 23) === true && windowSandbox.at(2026, 12, 9, 0) === false && windowSandbox.at(2027, 11, 20, 12) === false && typeof windowSandbox.fallback === "boolean",
    "the open season notice runs from 9 NOV through 8 DEC 2026 on the device's local date and then goes dark");
}
check(occurrences(verificationLog, "## V-2026-11-15-TRICARE-2027-COSTS ") === 1, "the TRICARE 2027 costs change carries one verification record");

// Federal Benefits Open Season notice (FEDVIP dental and vision). V-2026-11-15-FEDVIP-OPEN-SEASON. No dollar figure.
{
  const fedStart = index.indexOf('React.createElement("details", { id: "tops-fedvip-open-season-2026"');
  const fed = index.slice(fedStart, index.indexOf("\n      ),\n", fedStart));
  const tricareStart = index.indexOf('React.createElement("section", { id: "tops-tricare-open-season-2026"');
  const urgentStart = index.indexOf("!reminderTimedOnly && urgentR.length > 0 && React.createElement(", fedStart);
  check(fedStart > tricareStart && tricareStart > 0 && urgentStart > fedStart && occurrences(index, 'id: "tops-fedvip-open-season-2026"') === 1 &&
    occurrences(index, '!reminderTimedOnly && topsFederalBenefitsOpenSeason2026Active() && React.createElement("details", { id: "tops-fedvip-open-season-2026", open: !topsTricareOpenSeason2026Active(), ') === 1,
    "the FEDVIP notice sits under the TRICARE notice, is gated by its own window and opens by default only when it stands alone");
  check(occurrences(fed, '"Federal Benefits Open Season (FEDVIP dental and vision): Nov. 9 to Dec. 14, 2026"') === 1 &&
    occurrences(fed, "use BENEFEDS.gov by 11:59 p.m. Eastern on Dec. 14, 2026. If you cannot enroll online, call BENEFEDS at 1-877-888-3337. BENEFEDS checks your eligibility as the first step. Coverage chosen in open season takes effect Jan. 1, 2027.") === 1,
    "the FEDVIP notice names the portal, the deadline with its time zone, the phone number and the effective date");
  check(occurrences(fed, "If you are already enrolled, your coverage continues each year with no action. Dental and vision are separate enrollments.") === 1 &&
    occurrences(fed, "BENEFEDS lists retired uniformed service members and Retired Reserve members, including gray area reservists under age 60, as eligible for dental and vision with their eligible family members. Vision requires enrollment in a TRICARE health plan.") === 1 &&
    occurrences(fed, "Active duty family members, and National Guard or Reserve members enrolled in TRICARE Reserve Select, are eligible for vision only, while enrolled in a TRICARE health plan.") === 1,
    "the FEDVIP notice says who is eligible for dental and vision, who is eligible for vision only, and what an enrollee who does nothing keeps");
  check(occurrences(fed, "This does not apply to active duty service members, who are not eligible for FEDVIP dental or vision. Survivors and other groups have their own rules on the BENEFEDS eligibility page.") === 1 &&
    occurrences(fed, "This window is separate from TRICARE Open Season (Nov. 9 to Dec. 8, 2026).") === 1,
    "the FEDVIP notice carries its exclusion line and separates itself from TRICARE Open Season");
  check(occurrences(fed, 'id: "tops-fedvip-open-season-2026-eligibility-link", href: "https://www.benefeds.gov/learn/fedvip/fedvip-eligibility-uniformed-services", target: "_blank", rel: "noopener noreferrer"') === 1 &&
    occurrences(fed, 'id: "tops-fedvip-open-season-2026-enroll-link", href: "https://www.benefeds.gov/", target: "_blank", rel: "noopener noreferrer"') === 1 &&
    occurrences(fed, "(new tab)\")") === 2 && occurrences(fed, "React.createElement(\"a\", ") === 2 && !/\$\d/.test(fed),
    "the FEDVIP notice has two BENEFEDS links that open in a new tab and say so, and no dollar figure");

  const fedHelperStart = index.indexOf("function topsFederalBenefitsOpenSeason2026Active(now) {");
  const fedHelper = index.slice(fedHelperStart, index.indexOf("\n}\n", fedHelperStart) + 3);
  const fedSandbox = {};
  // Dates are built inside the sandbox so the helper's instanceof test sees its own Date.
  vm.runInNewContext(fedHelper + "\nthis.local = function(y, m, d, h) { return topsFederalBenefitsOpenSeason2026Active(new Date(y, m - 1, d, h, 0, 0)); };\nthis.instant = function(ms) { return topsFederalBenefitsOpenSeason2026Active(new Date(ms)); };", fedSandbox);
  check(fedHelperStart > 0 && occurrences(index, "function topsFederalBenefitsOpenSeason2026Active(now) {") === 1 &&
    fedSandbox.local(2026, 11, 8, 12) === false && fedSandbox.local(2026, 11, 9, 12) === true && fedSandbox.local(2026, 12, 9, 12) === true &&
    fedSandbox.instant(Date.UTC(2026, 11, 15, 4, 59, 59)) === true && fedSandbox.instant(Date.UTC(2026, 11, 15, 5, 0, 0)) === false && fedSandbox.instant(Date.UTC(2027, 10, 20, 12, 0, 0)) === false,
    "the FEDVIP notice starts on 9 NOV 2026 and ends at 11:59 pm Eastern on 14 DEC 2026 on every device");
}
check(occurrences(verificationLog, "## V-2026-11-15-FEDVIP-OPEN-SEASON ") === 1, "the FEDVIP open season notice carries one verification record");

// Starting points by state: veterans office and job bank. V-2026-11-15-STATE-STARTING-POINTS.
{
  const listStart = index.indexOf("const TOPS_STATE_START = [\n");
  const listEnd = index.indexOf("\n];\n", listStart);
  const listBox = {};
  vm.runInNewContext(index.slice(listStart, listEnd + 4) + "\nthis.rows = JSON.stringify(TOPS_STATE_START);", listBox);
  const rows = JSON.parse(listBox.rows);
  check(listStart > 0 && rows.length === 55 && new Set(rows.map((r) => r[0])).size === 55 && new Set(rows.map((r) => r[1])).size === 55 &&
    rows.every((r, i) => /^[A-Z]{2}$/.test(r[0]) && (i === 0 || rows[i - 1][1] < r[1])),
    "the state list holds 55 states and territories, each once, in name order");
  check(rows.every((r) => /^https:\/\/[a-z0-9.-]+\/\S*$/.test(r[4]) && (r[3] === "" ? r[2] === "" && r[0] === "MP" : /^https:\/\/[a-z0-9.-]+\/\S*$/.test(r[3]) && r[2].length > 10)) &&
    rows.filter((r) => r[3] === "").length === 1 && rows.every((r) => r.length === 5 || (r.length === 6 && r[0] === "NH")),
    "every row has an https job bank link, and an office name with an https link except the one territory VA lists no office for");
  check(require("node:crypto").createHash("sha256").update(rows.map((r) => r.join("|")).join("\n"), "utf8").digest("hex") === "5c8cfbbf5b9040cc7d5107a1df62669ed125622e5be154e142dfec262b275d0d",
    "the state list equals the reviewed list byte for byte; any change needs a new source read and a new log entry");
  const row = (code) => rows.find((r) => r[0] === code);
  check(row("NH")[3] === "https://www.nhveterans.nh.gov/" && row("NH")[5] === "VA's link for New Hampshire did not load on 15 NOV 2026. This address comes from NH.gov's list of state agencies." && row("NM")[3] === "https://www.dvs.nm.gov/" && row("CO")[4] === "https://www.connectingcolorado.gov/",
    "New Hampshire carries its own sourced address and note, and New Mexico and Colorado use the .gov address their listed link leads to");
  check(row("WI")[3] === "https://dva.wi.gov/Pages/Home.aspx" && row("WI")[4] === "https://jobcenterofwisconsin.com/" && row("TX")[2] === "Texas Veterans Commission" && row("TX")[4] === "https://www.workintexas.com/vosnet/Default.aspx" && row("OR")[4] === "https://secure.emp.state.or.us/jobs/index.cfm?bkmk=w9",
    "spot checks: Wisconsin, Texas and the one job bank address with a query string");
  check(occurrences(index, 'context.area !== "wi" && React.createElement("section", { id: "tops-state-start", "aria-labelledby": "tops-state-start-heading"') === 1 &&
    occurrences(index, 'React.createElement("label", { htmlFor: "tops-state-start-select"') === 1 && occurrences(index, 'React.createElement("select", { id: "tops-state-start-select", value: startCode, style: field, "aria-describedby": "tops-state-start-caption"') === 1 &&
    occurrences(index, 'id: "tops-state-start-status", className: "sr-only", role: "status", "aria-live": "polite"') === 1,
    "the state control shows only outside the Wisconsin guide, has a label and a caption, and announces its result");
  check(occurrences(index, 'id: "tops-state-start-office", href: startRow[3], target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer"') === 1 &&
    occurrences(index, 'id: "tops-state-start-jobs", href: startRow[4], target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer"') === 1 &&
    occurrences(index, '" veterans office site (new tab)"') === 1 && occurrences(index, '" job bank (new tab)"') === 1,
    "both state links open a new tab without a referrer and say so");
  check(occurrences(index, "\"Office links come from VA's directory of state veterans affairs offices. Job bank links come from CareerOneStop, which the U.S. Department of Labor sponsors. Both lists were read on \" + TOPS_STATE_START_READ + \" and can change. Choosing a state here does not establish residence or eligibility.\"") === 1 &&
    occurrences(index, 'const TOPS_STATE_START_READ = "15 NOV 2026";') === 1 && occurrences(index, 'var startPick = useState(function() { return topsStateStartFromURL(window.location.href); }), startCode = startPick[0]') === 1 && occurrences(index, "useState(function() { return topsStateStartFromURL(") === 1 &&
    !/tops_state_start|localStorage[^;]{0,80}startCode|startCode[^;]{0,80}localStorage/.test(index) && !/searchParams\.(set|append)\("state"/.test(index),
    "the caption names both sources and the read date, and the choice is held for the visit, saved nowhere and never written into the address");
}
check(occurrences(verificationLog, "## V-2026-11-15-STATE-STARTING-POINTS ") === 1, "the state starting points carry one verification record");

// Share control, share text and the shared state link. V-2026-11-15-SHARE-TEXT.
{
  const textStart = index.indexOf("const TOPS_SHARE_TEXT = {\n");
  const textBox = {};
  vm.runInNewContext(index.slice(textStart, index.indexOf("\n};\n", textStart) + 4) + "\nthis.t = JSON.stringify(TOPS_SHARE_TEXT);", textBox);
  const shareText = JSON.parse(textBox.t);
  check(textStart > 0 && Object.keys(shareText).sort().join(",") === "fedvip,state,stateJobsOnly,tricare" &&
    Object.values(shareText).every((t) => t.replace("{State}", "Northern Mariana Islands").length <= 160 && /^[\x20-\x7e]+$/.test(t) && !/\$\d|!/.test(t)),
    "four share texts, each 160 characters or fewer with the longest name, plain characters, no dollar figure and no exclamation point");
  check(shareText.tricare === "TRICARE Open Season closes Dec. 8, 2026. This page shows who it covers and how to change plans. Changes take effect Jan. 1, 2027." &&
    shareText.fedvip === "Federal Benefits Open Season for FEDVIP dental and vision ends Dec. 14, 2026 at 11:59 p.m. Eastern. This page lists who is eligible and where to enroll.",
    "the two deadline share texts carry the dates, the year and the time zone already in the notices, and no instruction of their own");
  check(shareText.state === "{State} veterans office and job bank links are in Transition OPS. Office links come from VA's directory. Job banks come from CareerOneStop." &&
    shareText.stateJobsOnly === "The {State} job bank link is in Transition OPS. It comes from CareerOneStop, which the U.S. Department of Labor sponsors.",
    "the state share texts name both sources, and the one territory without a listed office gets a text that promises no office link");

  const controlStart = index.indexOf("function TopsShareControl(props) {");
  const control = index.slice(controlStart, index.indexOf("\n}\n", controlStart));
  check(controlStart > 0 && !/__trackEvent|window\.location|localStorage|sessionStorage|fetch\(|XMLHttpRequest|sendBeacon/.test(control) &&
    occurrences(control, "navigator.share({ title: props.title, text: props.text, url: props.url })") === 1 &&
    occurrences(control, 'if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") throw new Error("Clipboard unavailable");') === 1 &&
    occurrences(control, 'navigator.clipboard.writeText(props.text + " " + props.url)') === 1,
    "the share control sends only the text and address it is given: no tracking call, no storage, no request, no address read from the page");
  check(occurrences(control, 'role: "status", "aria-live": "polite", "aria-atomic": "true"') === 1 && occurrences(control, '"Link to copy"') === 1 && occurrences(control, "readOnly: true, value: props.url") === 1 &&
    occurrences(control, '"Share options closed."') === 1 && occurrences(control, '"Sharing canceled."') === 1 && occurrences(control, '"Copied. Paste it into a message."') === 1 && occurrences(control, '"Select and copy the link below."') === 1,
    "the share control reports each outcome and falls back to a labeled link the member can select");
  check(occurrences(index, 'React.createElement(TopsShareControl, { id: "tops-tricare-open-season-2026-share", colors: C, fill: C.bgCard, label: "Share this deadline", title: "TRICARE Open Season", text: TOPS_SHARE_TEXT.tricare, url: TOPS_SHARE_ORIGIN + "/?tool=reminders" })') === 1 &&
    occurrences(index, 'React.createElement(TopsShareControl, { id: "tops-fedvip-open-season-2026-share", colors: C, fill: C.bgCard, label: "Share this deadline", title: "Federal Benefits Open Season", text: TOPS_SHARE_TEXT.fedvip, url: TOPS_SHARE_ORIGIN + "/?tool=reminders" })') === 1 &&
    occurrences(index, 'url: TOPS_SHARE_ORIGIN + "/?tool=resources&view=state-help&area=national&state=" + startRow[0] })') === 1 && occurrences(index, 'React.createElement(TopsShareControl, { id: "tops-saved-result-share", colors: C, label: "Share Career tools", title: "Transition OPS career tools", text: "Find jobs and free learning resources in Transition OPS.", url: TOPS_SHARE_ORIGIN + "/?tool=pathway" })') === 1 && occurrences(index, 'const TOPS_SHARE_ORIGIN = "https://transitionops.org";') === 1 && occurrences(index, "React.createElement(TopsShareControl, ") === 4,
    "four share controls: both open season notices share Reminders, a state shares its address, and the saved-result control shares only the generic Career route");

  const appShareStart = index.indexOf("function handleShareApp(setToast) {");
  const appShare = index.slice(appShareStart, index.indexOf("function AboutModal(props) {", appShareStart));
  check(appShareStart > 0 && !/__trackEvent|trackShare|app_shared/.test(appShare) && occurrences(appShare, "navigator.share(shareData).catch(function () {});") === 1 && occurrences(appShare, "url: 'https://transitionops.org'") === 1 &&
    occurrences(index, "navigator.clipboard.writeText(window.location.href);") === 0 && occurrences(index, 'showToast("Copy this link: " + window.location.href);') === 8,
    "sharing the app makes no tracking call, and no button assumes a clipboard: four older handlers now check for one and say what to copy");
  check(occurrences(index, 'React.createElement("button", { id: "tops-menu-share", className: "tops-more-tool", type: "button", onClick: function() { setShowMoreMenu(false); handleShareApp(setToast); } }, "Share Transition OPS")') === 1,
    "the More tools menu offers Share Transition OPS");

  const readerStart = index.indexOf("function topsStateStartFromURL(href) {");
  const isStart = index.indexOf("function topsIsStateHelpURL(href) {");
  const listStart2 = index.indexOf("const TOPS_STATE_START = [\n");
  const readerBox = { URL };
  vm.runInNewContext(index.slice(listStart2, index.indexOf("\n];\n", listStart2) + 4) + index.slice(isStart, index.indexOf("\n}\n", isStart) + 3) + index.slice(readerStart, index.indexOf("\n}\n", readerStart) + 3) + "\nthis.read = topsStateStartFromURL;", readerBox);
  const stateLink = "https://transitionops.org/?tool=resources&view=state-help&area=national&state=";
  check(readerStart > 0 && readerBox.read(stateLink + "TX") === "TX" && readerBox.read(stateLink + "tx") === "TX" && readerBox.read(stateLink + "MP") === "MP" && readerBox.read(stateLink + "ZZ") === "" && readerBox.read(stateLink + "TX&state=CA") === "" &&
    readerBox.read(stateLink + "") === "" && readerBox.read("https://transitionops.org/?tool=reminders&state=TX") === "" && readerBox.read("https://transitionops.org/?tool=resources&view=state-help&guide=x&state=TX") === "" && readerBox.read("not an address") === "" &&
    occurrences(index, "var startPick = useState(function() { return topsStateStartFromURL(window.location.href); })") === 1,
    "a shared state link chooses a listed state once, in either letter case, and anything else chooses nothing");
  const dropStart = index.indexOf("function topsDropStateStartFromURL() {");
  const drop = index.slice(dropStart, index.indexOf("\n}\n", dropStart));
  check(dropStart > 0 && occurrences(drop, 'url.searchParams.delete("state"); history.replaceState(history.state, "", url.href);') === 1 && !/searchParams\.(set|append)/.test(drop) &&
    occurrences(index, 'onChange: function(e) { setStartCode(e.target.value); topsDropStateStartFromURL(); } },') === 1 && occurrences(index, "topsDropStateStartFromURL()") === 2 &&
    occurrences(index, 'if (!(activeTab === "resources" && subTab === "state-help") && url.searchParams.has("state")) url.searchParams.delete("state");') === 1,
    "a linked state leaves the address when the member chooses for themselves or leaves State and local help");
}
check(occurrences(verificationLog, "## V-2026-11-15-SHARE-TEXT ") === 1, "the share text carries one verification record");

// The line sent when a member shares the app itself. V-2026-11-15-APP-SHARE-LINE.
{
  const line = "A free transition app from a retired Army officer: VA disability math, benefit deadlines, state veterans office and job bank links, and resume tools.";
  const start = index.indexOf("function handleShareApp(setToast) {");
  const handler = index.slice(start, index.indexOf("function AboutModal(props) {", start));
  check(start > 0 && occurrences(handler, "    text: '" + line + "',\n") === 1 && occurrences(handler, "text: '") === 1 &&
    line.length <= 160 && /^[\x20-\x7e]+$/.test(line) && !/\$\d|!/.test(line),
    "sharing the app sends one line of 160 characters or fewer, in plain characters, with no dollar figure and no exclamation point");
  check(!index.includes("state tax intel, and personalized timelines. Built by a veteran."), "the earlier app share line is gone");
  const routes = JSON.parse((index.match(/const TOPS_TOOL_ROUTES = (\[[^\]]+\]);/) || [null, "[]"])[1]);
  check(["vamath", "reminders", "resources", "pathway"].every((tool) => routes.includes(tool)),
    "each part of the app the share line names still has its tool: the VA calculator, Reminders, State and local help, and Career");
}
check(occurrences(verificationLog, "## V-2026-11-15-APP-SHARE-LINE ") === 1, "the app share line carries one verification record");

// Retirement FEDVIP reminders, re-read against BENEFEDS on 15 NOV 2026. V-2026-11-15-FEDVIP-RETIREMENT-WINDOW.
{
  const rung = (id) => { const start = index.indexOf('{id:"' + id + '"'); return index.slice(start, index.indexOf("},\n", start) + 1); };
  const first = rung("r-1-fedvip"), backstop = rung("r-p1-fedvip");
  check(first.length > 200 && first.length < 2400 && backstop.length > 200 && backstop.length < 2400, "both retirement FEDVIP reminders are extractable");
  check(occurrences(first, '"Vision coverage requires enrollment in a TRICARE health plan","If a family member enrolled in FEDVIP vision while you were on active duty, their enrollment cannot continue after you retire","Notify BENEFEDS of your retirement, then enroll as a retired uniformed service member in this window and add them as a dependent","Gray area reservists under age 60 are also eligible",') === 1,
    "the one-month reminder states that a family member's own vision enrollment cannot continue, then the step: notify BENEFEDS, enroll, add the dependent");
  check(occurrences(backstop, '"If a family member held FEDVIP vision while you were on active duty, notify BENEFEDS of your retirement and enroll as a retired uniformed service member to add them as a dependent",') === 1 && occurrences(index, "notify BENEFEDS of your retirement") + occurrences(index, "Notify BENEFEDS of your retirement") === 2,
    "the 30-days-left reminder carries the same step, and no other place in the app gives that instruction");
  check(occurrences(first, '"Enroll BEFORE your retirement date to avoid a dental coverage gap","Window: 31 days before retirement date through 60 days after",') === 1 && occurrences(first, '"Miss the window and you wait for the next Federal Benefits Open Season","Enroll at BENEFEDS.gov or 1-877-888-3337"]') === 1 && !/qualifying life event|QLE/.test(first),
    "the statements BENEFEDS was re-read against are unchanged, and the reminder does not call retirement a qualifying life event");
  check(!/\$\d/.test(first) && !/\$\d/.test(backstop) && !/belated|three months/i.test(first + backstop), "neither reminder carries a dollar figure or the belated-enrollment exception, which was not confirmed for retirees");
}
check(occurrences(verificationLog, "## V-2026-11-15-FEDVIP-RETIREMENT-WINDOW ") === 1, "the retirement FEDVIP re-read carries one verification record");

console.log("Policy content regression: PASS (" + checks + " assertions; " + vectorCount + " parity vectors)");
