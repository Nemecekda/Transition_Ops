// TOPS Resume Builder — server-side proxy to OpenAI API
// Stateless: nothing stored, nothing logged. Key lives in Netlify env only.
exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "https://transitionops.org",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "POST only" }) };

  let input;
  try { input = JSON.parse(event.body || "{}"); } catch (e) { return { statusCode: 400, headers, body: JSON.stringify({ error: "Bad JSON" }) }; }

  const { role, years, experience, skills, certs, target, posting } = input;
  const mode = input.mode === "federal" ? "federal" : "standard";
  if (!experience || String(experience).trim().length < 20) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Tell us what you actually did — at least a sentence or two." }) };
  }
  // Hard input bounds (cost + abuse control)
  const clip = (s, n) => String(s || "").slice(0, n);
  const action = input.action === "draft" ? "draft" : "facts";
  const confirmedFacts = clip(input.confirmedFacts, 10000);
  const userBlock = [
    "Military role/MOS/rate: " + clip(role, 120),
    "Years of service: " + clip(years, 20),
    "Target civilian role: " + clip(target, 120),
    "Additional skills/ASIs: " + clip(skills, 400),
    "Certifications: " + clip(certs, 400),
    "What they actually did (their own words): " + clip(experience, 8000),
    (posting && String(posting).trim() ? "TARGET JOB POSTING - tailor the resume to this announcement per the TAILORING rule: " + clip(posting, 3500) : "")
  ].filter(Boolean).join("\n");

  const factInstructions = `Extract a reviewable fact sheet from the member's source text. Do not draft a resume. Do not infer, improve, translate, or add facts. Preserve every stated job title, employer or unit, location, date, certification, degree, tool, number, dollar figure, and outcome exactly as written. A missing item is MISSING, never guessed.

Return plain text only, using this exact repeating structure:
ROLE 1
JOB TITLE (EXACT):
EMPLOYER OR UNIT (EXACT):
LOCATION (EXACT OR MISSING):
DATES (EXACT OR MISSING):
DUTIES AND OUTCOMES (EXACT FACTS ONLY):

Then include:
EDUCATION (EXACT OR MISSING):
CERTIFICATIONS (EXACT OR MISSING):
SKILLS AND TOOLS (EXACT OR MISSING):
NUMBERS AND SCALE (EXACT OR MISSING):
TARGET ROLE (EXACT OR MISSING):

Use one ROLE block for every distinct job title, even when several titles share one employer or unit. Transition phrases such as "later served as Deputy Director" always start a new ROLE block.
DATES may contain only calendar dates or calendar date ranges explicitly stated in the source. Tenure such as "26 years of service" is not a date; put it under NUMBERS AND SCALE.
Software and tools, including Workday, belong under SKILLS AND TOOLS unless the source explicitly identifies a named certification in that software or tool.
No markdown, bullets, commentary, advice, or resume language.`;

  const systemFederal = `You draft a FEDERAL-STYLE resume (USAJOBS format) for a transitioning U.S. service member, targeted at their stated desired role. Their words are your ONLY source for facts. Federal resumes are longer and more detailed than civilian resumes - that detail must come from what they stated, never invention.

HARD RULES (identical grounding discipline):
1. GROUNDING: Every factual claim traces to their input. NEVER invent employers, dates, degrees, tools, metrics, supervisors, or outcomes. Bracket what a federal resume needs that they did not provide: [Hours per week: __], [Supervisor: Name, Phone - may contact: Yes/No], [Salary if required], [Series/Grade if known], [Month Year - Month Year].
2. NUMBERS: keep every number exactly; add none.
3. TRANSLATE military jargon to civilian equivalents but KEEP official unit names and titles alongside (federal HR staff understand military service; specificity helps here).
4. DUTY DETAIL: federal announcements score on specialized experience. Expand each role's bullets into fuller duty statements (2-4 sentences or dense bullets per role) - but ONLY elaborating what they actually stated. Never pad with generic duties they didn't mention.
TAILORING (when a TARGET JOB POSTING is provided): mirror the posting's job title and its exact keyword and skill language wherever the person's REAL experience genuinely matches - legitimate ATS alignment, not invention. Order experiences and skills by relevance to the posting's requirements. NEVER claim experience, tools, or qualifications they did not state just because the posting asks - unmet requirements belong in the TIP as honest gaps. In the TIP, name the top posting keywords their background legitimately matches and the single biggest gap to address in a cover letter.
5. BANNED: leveraged, utilize, synergy, framework, dynamic, results-driven, "Responsible for", "Ensured".

FORMAT - plain text, no markdown:
[Your Name]
[City, State ZIP] | [phone] | [email]
[Veterans' Preference: e.g., 5-point / 10-point - if they indicated service-connected disability or preference eligibility, bracket it: [Veterans' Preference: __]]
[Citizenship: U.S. Citizen]

PROFESSIONAL SUMMARY
3-4 sentences, specific and stacked from their input, aimed at the target role.

PROFESSIONAL EXPERIENCE
One entry PER employer/role stated, most recent first, real names and dates. Per entry:
[Title] - [Employer as stated]
[Location] | [dates as given] | [Hours per week: __]
[Supervisor: Name, Phone - may contact: Yes/No]
Detailed duty and accomplishment statements per rule 4 - grounded only.

EDUCATION
Every stated degree, one line each: degree, school, year (bracket missing pieces).

CERTIFICATIONS & TRAINING
Exactly as stated - never change a certification's name or level. Include stated military training/schools here.

End with: "TIP:" - the single highest-value addition for federal applications, specific to their draft (e.g., which bracket to fill first, or matching announcement keywords).`;

  const system = `You draft a complete one-page civilian resume for a transitioning U.S. service member, targeted at their stated desired role. Their words are your ONLY source for facts. They often paste text from their existing military resume, NCOER/evaluation, or award write-ups - translating that language is your core job.

HARD RULES:
1. GROUNDING: Every factual claim must trace to what they stated. NEVER invent employers, dates, degrees, tools, metrics, or outcomes. For anything a resume needs that they did not provide, insert a bracketed placeholder: [Your Name], [City, State], [email], [phone], [Unit / Organization], [Month Year - Month Year], [School, Degree, Year]. Placeholders are honest; invention is failure.
2. NUMBERS: Keep every number and dollar figure they gave, exactly. Add none.
3. BULLET FORMULA - the style standard. Each bullet: strong specific verb + what they did + SCALE (people, locations, dollars, scope - use every number they gave) + outcome if they stated one. Bullets may run 15-30 words when carrying real payload. Duties without scale read as filler - anchor every bullet in the concrete.
4. TRANSLATE military structure into corporate vocabulary: battalion -> "600-person organization", brigade staff -> "matrixed command", state HQ -> "shared services and centers of expertise", NCOIC -> "supervisor", commanded -> "led [N] people and a [$X] budget" when numbers given. No military abbreviations survive.
5. SUMMARY FORMULA: [role identity] with [X years], [their single biggest scope fact], [2-3 concrete signature activities from their input], [credentials they listed]. Specific and stacked - no generic adjectives.
TAILORING (when a TARGET JOB POSTING is provided): mirror the posting's job title and its exact keyword and skill language wherever the person's REAL experience genuinely matches - legitimate ATS alignment, not invention. Order experiences and skills by relevance to the posting's requirements. NEVER claim experience, tools, or qualifications they did not state just because the posting asks - unmet requirements belong in the TIP as honest gaps. In the TIP, name the top posting keywords their background legitimately matches and the single biggest gap to address in a cover letter.
6. BANNED: leveraged, utilize, synergy, framework, dynamic, results-driven, "Responsible for", "Ensured". Write plainly and concretely.

TRANSLATION EXAMPLE - typical pasted input and the correct conversion:
INPUT: "NCOIC, Battalion Motor Pool. Responsible for all maintenance operations. Ensured 100% accountability of $2M in assigned equipment. Supervised 15 personnel in performance of PMCS and dispatch operations. Maintained operational readiness rate of 95%."
CORRECT BULLETS:
Managed vehicle fleet maintenance for a 600-person organization, sustaining a 95% operational readiness rate
Directed accountability and upkeep of a $2M vehicle and equipment inventory
Supervised and developed a 15-person maintenance and dispatch team
The moves: "Responsible for/Ensured" become active accomplishment verbs; NCOIC becomes supervisor/manager; PMCS becomes preventive maintenance; every number kept.

STYLE EXEMPLAR - imitate this density (real bullets from a senior HR leader's interview-winning resume):
"Served as the senior HR business partner for a commercial, sales-driven organization of 1,200+ employees across 18 states, translating business priorities into a scalable people agenda"
"Deputy Director of Personnel: senior HR leader for 7,000+ Soldiers across 65+ locations in a matrixed command with shared services and centers of expertise; owned talent management, succession, employee relations, compliance, and people analytics"
"Battalion Commander: led 110 people and a $9M budget, accountable for performance management, leader development, and organizational effectiveness across a distributed operation"
Every bullet names scale. Ownership language. Zero filler.

FORMAT - plain text, no markdown, one page:
[Your Name]
[City, State] | [email] | [phone]

SUMMARY
(per rule 5)

CORE SKILLS
6-9 concrete skill phrases from their input, comma-separated, civilian-framed

PROFESSIONAL EXPERIENCE
CRITICAL: one entry PER employer or role they stated, most recent first, using their REAL employer names, locations, and dates whenever given. Civilian jobs keep their actual titles and companies. Military roles get civilian-equivalent titles with "- U.S. [Branch]" framing. Never merge separate employers into one block. Per entry:
[Title] - [Employer as they stated it]
[Location if given] | [dates as given, or [Month Year - Month Year]]
2-4 bullets per rule 3 (fewer bullets per job when they held many jobs - one page total)

CERTIFICATIONS
ONLY certifications and licenses, worded exactly as they stated them - never change a certification's name or level (SPHR stays SPHR; "SHRM certified" never becomes SHRM-SCP). Degrees NEVER appear here.

EDUCATION
Every degree they stated (B.A./B.S./M.A./M.S./M.B.A./PhD etc.), one line each, with their school and year when given and bracketed [School] or [Year] only for the missing pieces. If no degree was stated: [School, Degree, Year]

End with one line: "TIP:" naming the single highest-value fact to add before sending - specific to THEIR draft, not generic advice.`;

  function factRoles(facts) {
    return String(facts || "").split(/^ROLE\s+\d+\s*$/im).slice(1).map(function (block) {
      const title = /^JOB TITLE \(EXACT\):\s*(.+)$/im.exec(block);
      const employer = /^EMPLOYER OR UNIT \(EXACT\):\s*(.+)$/im.exec(block);
      return {
        title: title ? title[1].trim() : "",
        employer: employer ? employer[1].trim() : ""
      };
    }).filter(function (entry) { return entry.title && !/^MISSING$/i.test(entry.title); });
  }

  function explicitLaterRoleTitles(source) {
    const titles = [];
    const pattern = /\b(?:later|then|subsequently)\s+served\s+as\s+([^,.;\n]+?)(?=\s+(?:at|for)\s+|[,.;\n]|$)/gi;
    let match;
    while ((match = pattern.exec(String(source || "")))) titles.push(match[1].trim());
    return titles;
  }

  function factSheetIssues(facts, source) {
    const issues = [];
    const roles = factRoles(facts);
    explicitLaterRoleTitles(source).forEach(function (title) {
      if (!roles.some(function (role) { return role.title.toLowerCase() === title.toLowerCase(); })) issues.push("missing distinct later role");
    });
    const dateLines = String(facts || "").match(/^DATES \(EXACT OR MISSING\):\s*(.+)$/gim) || [];
    dateLines.forEach(function (line) {
      const value = line.replace(/^DATES \(EXACT OR MISSING\):\s*/i, "").trim();
      if (!/^MISSING$/i.test(value) && (!/(?:\b(?:19|20)\d{2}\b|\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|present|current)\b)/i.test(value) || /\byears?\s+(?:of\s+)?(?:service|experience|tenure)\b/i.test(value))) issues.push("invalid date field");
    });
    const sourceNamesWorkdayCertification = /(?:workday.{0,35}(?:certif|credential)|(?:certif|credential).{0,35}workday)/i.test(source);
    const certLine = (/^CERTIFICATIONS \(EXACT OR MISSING\):\s*(.+)$/im.exec(facts) || ["", ""])[1];
    const toolsLine = (/^SKILLS AND TOOLS \(EXACT OR MISSING\):\s*(.+)$/im.exec(facts) || ["", ""])[1];
    if (/\bWorkday\b/i.test(source) && !sourceNamesWorkdayCertification && (/\bWorkday\b/i.test(certLine) || !/\bWorkday\b/i.test(toolsLine))) issues.push("Workday misclassified");
    return issues;
  }

  function factIssueWarnings(issues) {
    const warnings = [];
    (issues || []).forEach(function (issue) {
      if (issue === "missing distinct later role") warnings.push("Give each distinct job title its own ROLE block.");
      if (issue === "invalid date field") warnings.push("Use calendar dates only in DATES; put tenure under NUMBERS AND SCALE.");
      if (issue === "Workday misclassified") warnings.push("Put Workday under SKILLS AND TOOLS unless your source explicitly names a Workday certification.");
    });
    return warnings.filter(function (warning, index) { return warnings.indexOf(warning) === index; });
  }

  function hasSpecificTarget(value) {
    const targetValue = String(value || "").trim();
    if (targetValue.length < 2 || !/[A-Za-z]/.test(targetValue)) return false;
    if (/^(?:a\s+)?(?:job|civilian job|federal job|management|manager|leadership|business|human resources|talent management|anything|any|open|not sure|unsure|unknown|tbd|n\/a)$/i.test(targetValue)) return false;
    // Deterministic title test: require a role noun, or an established "Head of X" title.
    // Function areas such as "Talent Management" and "Human Resources" are not job titles.
    const roleNoun = /\b(?:manager|analyst|specialist|coordinator|director|officer|engineer|developer|administrator|supervisor|lead|consultant|advisor|recruiter|technician|mechanic|nurse|physician|counselor|teacher|instructor|planner|auditor|investigator|operator|controller|architect|scientist|designer|writer|editor|attorney|paralegal|accountant|clerk|agent|representative|executive|president|chief)\b/i;
    return roleNoun.test(targetValue) || /^head\s+of\s+[A-Za-z][A-Za-z &/-]*$/i.test(targetValue);
  }

  function normalizePlainText(text) {
    return String(text || "")
      .replace(/^\s*```.*$/gm, "")
      .replace(/^\s*#{1,6}\s+/gm, "")
      .replace(/\*\*([^*\n]+)\*\*/g, "$1")
      .replace(/__([^_\n]+)__/g, "$1")
      .replace(/`/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function roleStructureIssues(text, facts) {
    const lines = String(text || "").split("\n").map(function (line) { return line.trim(); });
    const usedLines = [];
    return factRoles(facts).filter(function (role) {
      const employerRequired = role.employer && !/^MISSING$/i.test(role.employer);
      const lineIndex = lines.findIndex(function (line) {
        return line.length <= 180 && line.indexOf(role.title) !== -1 && (!employerRequired || line.indexOf(role.employer) !== -1);
      });
      if (lineIndex === -1 || usedLines.indexOf(lineIndex) !== -1) return true;
      usedLines.push(lineIndex);
      return false;
    }).map(function () { return "merged or missing role entry"; });
  }

  function unsupportedNumbers(text, source) {
    const values = String(text || "").match(/\$?\d[\d,.]*%?\+?/g) || [];
    return values.filter(function (value, index) {
      return values.indexOf(value) === index && String(source || "").indexOf(value) === -1;
    });
  }

  function draftQualityIssues(text, source, facts) {
    const issues = [];
    if (/\b(?:leveraged|utilize[sd]?|synergy|dynamic|results-driven|responsible for|ensured)\b/i.test(text)) issues.push("filler language");
    if (unsupportedNumbers(text, source).length) issues.push("unsupported number");
    return issues.concat(roleStructureIssues(text, facts));
  }

  try {
    if (action === "draft" && !confirmedFacts.trim()) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Review the fact sheet before drafting." }) };
    }
    if (action === "draft" && !hasSpecificTarget(clip(target, 120))) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Enter a specific target job title before drafting, such as Operations Manager or Program Analyst." }) };
    }
    if (action === "draft") {
      const unresolvedFactIssues = factSheetIssues(confirmedFacts, userBlock);
      if (unresolvedFactIssues.length) {
        return { statusCode: 400, headers, body: JSON.stringify({
          error: "Resolve the fact-sheet warnings before drafting. Review each role, date, tool, and certification, then try again.",
          warnings: factIssueWarnings(unresolvedFactIssues)
        }) };
      }
    }
    const { createOpenAIClient, responseText } = require("./openai-client");
    const client = createOpenAIClient();
    const response = await client.responses.create({
      model: action === "facts" ? "gpt-5.6-luna" : "gpt-5.6-terra",
      instructions: action === "facts" ? factInstructions : (mode === "federal" ? systemFederal : system) + `\n\nCONFIRMED FACT SHEET RULES:\nThe member reviewed the fact sheet below. Treat it as the controlling fact ledger. Preserve every JOB TITLE (EXACT) and EMPLOYER OR UNIT (EXACT) byte-for-byte in the draft. Do not use a number, outcome, credential, tool, employer, title, or qualification unless it appears in the member's source or confirmed fact sheet. The job posting supplies targeting language only, never facts about the member. Return plain text only: no markdown markers. Avoid generic filler.`,
      input: action === "facts" ? userBlock : userBlock + "\n\nMEMBER-REVIEWED FACT SHEET:\n" + confirmedFacts,
      max_output_tokens: mode === "federal" ? 1900 : 1300,
      reasoning: { effort: "none" },
      store: false
    });
    const rawText = response.status === "completed" ? responseText(response) : "";
    if (!rawText) throw new Error("generation incomplete");
    if (action === "facts") {
      const factIssues = factSheetIssues(rawText, userBlock);
      if (!factIssues.length) return { statusCode: 200, headers, body: JSON.stringify({ factSheet: rawText, warnings: [] }) };

      const repairResponse = await client.responses.create({
        model: "gpt-5.6-terra",
        instructions: `Repair the fact sheet's structure and classification only. Preserve every source fact exactly; do not add, infer, translate, or improve facts. Split every distinct job title into its own ROLE block, including later or subsequent roles. DATES may contain only explicit calendar dates or date ranges; move tenure to NUMBERS AND SCALE. Put software and tools under SKILLS AND TOOLS unless the source explicitly names a certification. Return the complete corrected fact sheet in the original plain-text field structure, with no markdown or commentary.`,
        input: "ORIGINAL BOUNDED SOURCE:\n" + userBlock + "\n\nFIRST FACT SHEET:\n" + rawText + "\n\nSTRUCTURAL ISSUE LABELS:\n" + factIssues.join(", "),
        max_output_tokens: mode === "federal" ? 1900 : 1300,
        reasoning: { effort: "none" },
        store: false
      });
      const repairedText = repairResponse.status === "completed" ? responseText(repairResponse) : "";
      const editableText = repairedText || rawText;
      const repairedIssues = factSheetIssues(editableText, userBlock);
      if (repairedIssues.length) {
        return { statusCode: 200, headers, body: JSON.stringify({ factSheet: editableText, warnings: factIssueWarnings(repairedIssues) }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ factSheet: editableText, warnings: [] }) };
    }
    const text = normalizePlainText(rawText);
    const issues = draftQualityIssues(text, userBlock + "\n" + confirmedFacts, confirmedFacts);
    if (issues.length) throw new Error("quality check failed: " + issues.join(", "));
    return { statusCode: 200, headers, body: JSON.stringify({ bullets: text }) };
  } catch (e) {
    const msg = String(e && e.message || "generation failed");
    const friendly = /^fact sheet quality check failed:/.test(msg)
      ? "We could not safely separate or classify the fact sheet. Revise your source so each role lists one title, employer, dates, and duties, then try again."
      : /^quality check failed:/.test(msg)
        ? "The draft did not pass grounding and role-structure checks. Review your confirmed roles and facts, then try again."
        : /credit|billing|limit|quota/i.test(msg)
          ? "The free generator has hit its monthly limit. It resets next month — meanwhile, the Resume Starter on each career page still works."
          : "Generation hiccup — try again in a minute.";
    return { statusCode: 502, headers, body: JSON.stringify({ error: friendly }) };
  }
};
