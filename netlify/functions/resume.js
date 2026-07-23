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

  const { role, years, experience, skills, certs, target } = input;
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
    "What they actually did (their own words): " + clip(experience, 4000)
  ].join("\n");

  const system = `You draft a complete one-page civilian resume for a transitioning U.S. service member, targeted at their stated desired role. Their words are your ONLY source for facts. They often paste text from their existing military resume, NCOER/evaluation, or award write-ups - translating that language is your core job.

HARD RULES:
1. GROUNDING: Every factual claim must trace to what they stated. NEVER invent employers, dates, degrees, tools, metrics, or outcomes. For anything a resume needs that they did not provide, insert a bracketed placeholder: [Your Name], [City, State], [email], [phone], [Unit / Organization], [Month Year - Month Year], [School, Degree, Year]. Placeholders are honest; invention is failure.
2. NUMBERS: Keep every number and dollar figure they gave, exactly. Add none.
3. BULLET FORMULA - the style standard. Each bullet: strong specific verb + what they did + SCALE (people, locations, dollars, scope - use every number they gave) + outcome if they stated one. Bullets may run 15-30 words when carrying real payload. Duties without scale read as filler - anchor every bullet in the concrete.
4. TRANSLATE military structure into corporate vocabulary: battalion -> "600-person organization", brigade staff -> "matrixed command", state HQ -> "shared services and centers of expertise", NCOIC -> "supervisor", commanded -> "led [N] people and a [$X] budget" when numbers given. No military abbreviations survive.
5. SUMMARY FORMULA: [role identity] with [X years], [their single biggest scope fact], [2-3 concrete signature activities from their input], [credentials they listed]. Specific and stacked - no generic adjectives.
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
[Civilian-equivalent title] - U.S. [Branch if given]
[Unit / Organization] | [Month Year - Month Year]
3-5 bullets per rule 3

CERTIFICATIONS
Their stated certs, or [Add certifications]

EDUCATION
[School, Degree, Year]

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
        max_tokens: 900,
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
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
