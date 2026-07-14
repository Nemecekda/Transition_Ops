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

  const system = `You turn a transitioning U.S. service member's raw experience into polished, civilian-framed, ATS-friendly resume bullets.
Rules:
- Output exactly 5 bullets, each starting with a strong action verb, each ONE short line. Be concise.
- Translate military jargon to civilian equivalents (e.g., "squad" -> "team of 9", "NCOIC" -> "supervisor/lead", "motor pool" -> "vehicle fleet operations").
- Keep every number, dollar figure, and quantity the person gave; never invent numbers, awards, or facts not provided.
- No first person, no periods debate — end bullets without periods.
- After the bullets, add one line: "TIP:" with the single most useful improvement they could make (e.g., add a metric to a specific bullet).
- Plain text only. No markdown, no headers.`;

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
