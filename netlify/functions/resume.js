// TOPS Resume Builder — server-side proxy to Anthropic API
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
  const userBlock = [
    "Military role/MOS/rate: " + clip(role, 120),
    "Years of service: " + clip(years, 20),
    "Target civilian role: " + clip(target, 120),
    "Additional skills/ASIs: " + clip(skills, 400),
    "Certifications: " + clip(certs, 400),
    "What they actually did (their own words): " + clip(experience, 8000),
    (posting && String(posting).trim() ? "TARGET JOB POSTING - tailor the resume to this announcement per the TAILORING rule: " + clip(posting, 3500) : "")
  ].filter(Boolean).join("\n");

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

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: mode === "federal" ? 1900 : 1300,
        system: [{ type: "text", text: mode === "federal" ? systemFederal : system, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: userBlock }]
      })
    });
    const data = await resp.json();
    if (!resp.ok) {
      const msg = (data && data.error && data.error.message) || "generation failed";
      const friendly = /credit|billing|limit/i.test(msg)
        ? "The free generator has hit its monthly limit. It resets next month — meanwhile, the Resume Starter on each career page still works."
        : "Generation hiccup — try again in a minute.";
      return { statusCode: 502, headers, body: JSON.stringify({ error: friendly }) };
    }
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    return { statusCode: 200, headers, body: JSON.stringify({ bullets: text }) };
  } catch (e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: "Network hiccup — try again in a minute." }) };
  }
};
