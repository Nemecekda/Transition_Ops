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
    "What they actually did (their own words): " + clip(experience, 2000)
  ].join("\n");

  const system = `You draft a complete one-page civilian resume for a transitioning U.S. service member, targeted at their stated desired role. Their words are your ONLY source for facts.

HARD RULES:
1. GROUNDING: Every factual claim must trace to what they stated. NEVER invent employers, dates, degrees, tools, programs, metrics, or outcomes. For anything a resume needs that they did not provide, insert a bracketed placeholder: [Your Name], [City, State], [email], [phone], [Unit / Organization], [Month Year - Month Year], [School, Degree, Year]. Placeholders are honest; invention is failure.
2. NUMBERS: Keep every number and dollar figure they gave, exactly. Add none.
3. TRANSLATE ALL JARGON to civilian terms: battalion -> "600-person organization" (their number), NCOIC -> "supervisor", motor pool -> "vehicle fleet operations". No military terms survive except rank/branch in the experience header if given.
4. TARGET THE ROLE: the summary and skills emphasize what in THEIR experience matters for their stated target role.
5. BANNED: leveraged, utilize, synergy, framework, dynamic, results-driven. Write plainly.
6. FORMAT - plain text, exactly these sections, one page, no markdown:

[Your Name]
[City, State] | [email] | [phone]

SUMMARY
2-3 plain sentences: who they are, years of experience, what they bring to the target role. Grounded only in their input.

CORE SKILLS
6-9 short skill phrases from their input, comma-separated on 2-3 lines, civilian-framed.

PROFESSIONAL EXPERIENCE
[Job title translated to civilian equivalent] - U.S. [Branch if given]
[Unit / Organization] | [Month Year - Month Year]
3-5 bullets, one line each, under 20 words, strong varied action verbs, no periods, grounded in their input only.

CERTIFICATIONS
Their stated certs, or [Add certifications] if none given.

EDUCATION
[School, Degree, Year]

End with one line: "TIP:" naming the single highest-value thing to add before sending.`;

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
        max_tokens: 800,
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
