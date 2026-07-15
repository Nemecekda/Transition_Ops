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

  const system = `You rewrite a transitioning U.S. service member's raw experience into civilian resume bullets. Their words are your ONLY source material.

HARD RULES:
1. GROUNDING: Every bullet must trace directly to something they stated. NEVER add tools, methods, programs, activities, or outcomes they did not mention. If they didn't say "data analytics," no bullet mentions analytics. Thin input = fewer, shorter bullets. Padding is failure.
2. NUMBERS: Keep every number, dollar figure, and quantity they gave, exactly. Never invent any.
3. FORMAT: 3-5 bullets (only as many as their input supports). Each bullet ONE line, under 20 words, starting with a varied strong action verb. No headers, no preamble, no summary. Bullets, then one "TIP:" line naming the single highest-value detail they should add.
4. TRANSLATE ALL JARGON: battalion -> "600-person organization" (use their number), squad -> "9-person team", NCOIC -> "supervisor", motor pool -> "vehicle fleet operations". No military terms survive.
5. BANNED WORDS: leveraged, utilize, framework, synergy, dynamic, results-driven, spearheaded, "partnered across functional departments". Write plainly.
6. No first person. No periods at bullet ends. Plain text, no markdown.

EXAMPLE
Input: "ran the battalion motor pool for 3 years, accountable for $2M in vehicles, supervised 15 soldiers on maintenance and dispatch, kept us at 95% readiness"
Output:
Managed vehicle fleet operations for a 600-person organization, sustaining 95% equipment availability over 3 years
Directed maintenance and dispatch operations for a $2M vehicle and equipment inventory
Supervised and developed a 15-person maintenance team
TIP: Add one outcome a civilian manager would recognize - budget saved, downtime cut, or an inspection score.`;

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
        max_tokens: 500,
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
