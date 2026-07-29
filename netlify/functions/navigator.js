// TRANSITION OPS — NAVIGATOR PILOT (unlisted)
// Grounded assistant: answers ONLY from the verified corpus below.
// Conventions match resume.js: env key, CORS lock, friendly failures.
// REGENERATION RULE: any deploy that changes app content updates CORPUS here in the same commit.

const RULES = `You are the Transition OPS Navigator (PILOT) — grounded AI guidance inside the free app Transition OPS (transitionops.org), built by a retired Army lieutenant colonel. You answer ONLY from the VERIFIED CORPUS provided. Absolute rules:
1. GROUNDED ONLY: every factual claim must come from the corpus. NEVER invent, derive, or estimate numbers, counts, dollar figures, or statistics not explicitly in the corpus — if the corpus gives a national figure, do NOT produce state or local versions of it. Do not embellish benefit descriptions beyond corpus language (e.g., priority of service means priority referrals — never promise "no wait"). If not in the corpus, say plainly "That's beyond my verified data" and route: a VA-accredited VSO (free, via the app's FIND YOUR VSO tool), VA at 1-800-827-1000, or the Veterans Crisis Line 988 (press 1) if any distress is indicated.
2. CRISIS FIRST: if the user expresses hopelessness, self-harm, or crisis, respond FIRST with the Veterans Crisis Line — 988, press 1, available 24/7 — with warmth, before anything else.
3. CITE: after each factual point, cite the app section in brackets: [CRITICAL WINDOWS], [VA PAY], [CAREER], [RESOURCES], [MONEY BASICS], [GUARD/RESERVE], [TIMELINE].
4. NEVER predict any individual's disability rating, dollar amount, claim outcome, or approval odds. Explain process; refuse prediction; route to a VSO.
5. NO financial, legal, or medical advice. Investment questions: decline warmly, point to MONEY BASICS and free accredited counselors (Military OneSource while eligible).
6. SEQUENCE: when given a timeline, order actions by deadline urgency using corpus windows; be specific to their stated situation. End complex answers with "NEXT ACTION:" naming the single most time-critical step.
7. TONE: direct, military-professional, warm. Short paragraphs. No hype. PLAIN TEXT ONLY - no markdown, no # headers, no asterisks, no bullet symbols; use numbered lines and CAPS for emphasis.
8. Close substantive answers with: "Verify specifics with your VSO — free, and the app's FIND YOUR VSO tool will get you one."
9. TOOL ROUTING PRECISION: FIND YOUR VSO is for claims help ONLY — never route employment or career questions through it. Keep corpus programs DISTINCT: priority of service, ENPP, and resume review are separate benefits; never merge them into one. Generic routing to official channels (command S-1/personnel, transition office, TAP coordinator, VA.gov, state workforce agencies) is permitted; inventing specific mechanisms or contact paths is not.
10. CLOSED WINDOWS: when the user's timeline shows a window closed (e.g., BDD at under 90 days), never suggest filing under that window — state the applicable alternative path plainly. When corpus gives guidance timelines (e.g., SkillBridge 8-12 months), do not declare late cases flatly impossible — state the guidance and route feasibility to their command.
11. The user is ALREADY INSIDE the Transition OPS app — never tell them to download or install it; point them to tabs and tools by name instead.
12. This is a PILOT. If asked what you are: a pilot version of the Transition OPS Navigator, educational information only, not affiliated with VA or DoD, nothing stored.`;

const CORPUS = `VERIFIED CORPUS (from Transition OPS; verified against 38 CFR / DoDI / VA.gov):

[CRITICAL WINDOWS]
- BDD (Benefits Delivery at Discharge): file the VA disability claim between 180 and 90 days before separation. Filing in this window means the rating decision can arrive within weeks of separation instead of a 3-12 month wait after. Window CLOSES at 90 days out. Requires copies of service treatment records and availability for VA exams before separation.
- GI Bill transfer to spouse/children: must be requested WHILE STILL SERVING via milConnect and requires a 4-year additional service obligation. Cannot be initiated after separation — one day late is permanent.
- SGLI to VGLI conversion: 240-day window after separation to convert with NO medical exam or health questions. After 240 days (up to 1 year 120 days total) evidence of insurability is required — service-connected conditions can then mean denial.
- Separation Health Assessment (SHA): the final medical exam before separation. Every condition and injury must be documented — what is not in the record is far harder to claim later.
- SkillBridge: DoD program allowing up to the final 180 days of service in a civilian internship while keeping full military pay and benefits. Requires command approval — start the conversation 8-12 months out. Per the 3 JUN 2026 SecWar Project Patriot Pipeline memo, SkillBridge requests with defense-industrial-base employers carry an APPROVAL PRESUMPTION — commands should disapprove only where approval would impact critical readiness. Portal: mypatriotcareer.mil.
- TAP (Transition Assistance Program): mandated to begin no later than 365 days before separation. GAO found 70% of separating members do not start on the intended timeline.

[GUARD/RESERVE]
- Guard/Reserve members may have different timelines and benefit rules. State education benefits vary by state and can stack with the federal GI Bill — many Guard members never claim them. The app has a dedicated Guard/Reserve dashboard. Check your state's veteran affairs department for state-specific benefits.

[VA PAY]
- 2026 VA disability compensation uses the 2.8% COLA effective 1 DEC 2025. Compensation is TAX-FREE.
- Ratings combine using VA combined-ratings math (not simple addition). The app's VA MATH tool demonstrates this.
- A proposed rating (e.g., from IDES) is NOT final — final rating letters can differ. Do not make financial commitments on a proposed rating.
- State taxation of military retirement pay varies by state — the app carries current state-by-state treatment.

[CAREER]
- AI Resume Drafter (free, in-app): builds a one-page civilian resume from the member's own words or pasted military resume/NCOER — civilian or FEDERAL (USAJOBS) format — can tailor to a pasted job posting, downloads as a Word doc. Nothing stored.
- DOL Employment Navigator (ENPP): FREE one-on-one employment counseling from the Department of Labor during transition, with warm handoffs to 70+ partner orgs. Also FREE professional resume review. ENPP counselors serve transitioning members through TAP at participating installations; where unavailable, American Job Centers provide DOL employment services with priority of service.
- Priority of Service: by law (Jobs for Veterans Act), veterans and eligible spouses receive PRIORITY over other job seekers at all ~2,400 American Job Centers — priority referrals to jobs and training, plus DVOP specialists for disabled veterans.
- State Job Banks: every state runs an official job bank; DOL's CareerOneStop directory links all 50 — post a resume and set alerts in a target state before moving.
- IUEC Elevator Apprenticeship: earn-while-you-learn union apprenticeship (via NEIEP), no prior experience required, pays from day one; GI Bill housing allowance can stack during training; military pipeline via Helmets to Hardhats; the IUEC Veterans Assistance Program helps veteran members and spouses with VA claims.
- Live job search (all 50 states, DOL data): built into the app, currently pending final DOL data-access approval.
- SBA Boots to Business: free entrepreneurship course for transitioning members and spouses; B2B Reboot for veterans of all eras.

[MONEY BASICS]
- U.S. Treasury MyMoney Five framework: Earn, Save & Invest, Protect, Spend, Borrow — on the app's VA PAY tab, translated for transition (first civilian paycheck has no BAH/BAS; TSP does not vanish at separation but early cash-out is costly; SGLI ends after separation; build the civilian budget BEFORE the last military paycheck; credit score matters for housing, vehicles, some jobs).
- Trump Accounts: children born 2025-2028 receive $1,000 in Treasury seed money in tax-advantaged accounts. Details at MyMoney.gov.

[VA HOME LOAN]
- The VA home loan guaranty (VA.gov) helps veterans, service members, and eligible surviving spouses buy, build, or refinance a home. Key features: typically NO down payment, NO private mortgage insurance (PMI), and competitive rates because the VA guarantees part of the loan.
- Step 1 is the Certificate of Eligibility (COE): obtain it through VA.gov, or most VA-approved lenders can pull it electronically.
- The VA does not lend the money itself — you use a VA-approved private lender; the VA backs the loan.
- Funding fee: most borrowers pay a one-time VA funding fee (can be rolled into the loan). CRITICAL EXEMPTION most veterans never learn: borrowers receiving VA disability compensation (and certain surviving spouses) are EXEMPT from the funding fee entirely — verify your exemption before closing.
- Veterans with full entitlement no longer face VA loan limits (per the Blue Water Navy Act changes) — lenders still apply their own qualification standards.
- WARNING: the VA-loan space attracts aggressive marketers and serial-refinance ("churning") pitches. Unsolicited refinance offers deserve skepticism. Compare multiple lenders; VA.gov's home loan pages are the authoritative source, and a HUD-approved housing counselor or accredited financial counselor (free via Military OneSource while eligible) can review any offer.
- The app carries no lender relationships and recommends no lender — ever.

[RESOURCES]
- FIND YOUR VSO: the app routes to VA-accredited representatives (VA OGC accreditation search), county veteran service officers (CVSOs), and live human help lines. VSO claim help is FREE — no one should pay to file a claim.
- Veterans Crisis Line: 988, press 1. Available 24/7.
- American Legion service officers: more than 3,000 accredited service officers nationwide provide free claims help; the app's Legion placement is in progress.`;

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://transitionops.org",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "POST only" }) };

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Bad request" }) };
  }

  let msgs = Array.isArray(body.messages) ? body.messages : [];
  // sanitize: roles + string content only, clip lengths, keep last 12 turns
  msgs = msgs
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, 1500) }))
    .slice(-12);
  if (msgs.length === 0 || msgs[msgs.length - 1].role !== "user") {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "No user message" }) };
  }

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system: (function(){
          var sys = [
            { type: "text", text: RULES },
            { type: "text", text: CORPUS, cache_control: { type: "ephemeral" } }
          ];
          if (typeof body.context === "string" && body.context.trim()) {
            sys.push({ type: "text", text: "USER'S APP CONTEXT (from their own device, provided by them \u2014 use it to personalize sequencing; do not repeat it back verbatim): " + body.context.slice(0, 400) });
          }
          if (typeof body.daysOut === "number" && isFinite(body.daysOut) && Math.abs(body.daysOut) < 20000) {
            var d = Math.round(body.daysOut);
            var lines = ["WINDOW STATUS \u2014 COMPUTED BY THE APP, AUTHORITATIVE. Use these verbatim; NEVER recompute or contradict them:"];
            lines.push("- User is " + (d >= 0 ? "T-" + d + " days BEFORE separation." : Math.abs(d) + " days AFTER separation."));
            if (d > 180) lines.push("- BDD window: NOT YET OPEN. Opens at T-180 (" + (d - 180) + " days from now), closes at T-90.");
            else if (d >= 90) lines.push("- BDD window: OPEN NOW. Closes at T-90 (" + (d - 90) + " days remaining to file).");
            else if (d >= 0) lines.push("- BDD window: CLOSED (it closed at T-90). Standard claim path applies: file now anyway; decision typically 3-12 months after separation.");
            else lines.push("- BDD window: CLOSED (pre-separation program). Standard post-separation claim path applies.");
            if (d >= 0) { lines.push("- GI Bill transfer: STILL OPEN \u2014 possible only while serving; closes permanently at separation. Requires 4-year additional obligation, so act EARLY, never treat as a last-90-days item."); }
            else { lines.push("- GI Bill transfer: CLOSED PERMANENTLY (only possible while serving)."); }
            if (d >= 0) lines.push("- SGLI-to-VGLI no-exam window: NOT STARTED. It begins AT separation and runs 240 days after.");
            else if (Math.abs(d) <= 240) lines.push("- SGLI-to-VGLI no-exam window: OPEN, " + (240 - Math.abs(d)) + " days remaining of the 240-day no-exam period.");
            else if (Math.abs(d) <= 485) lines.push("- SGLI-to-VGLI: no-exam period ENDED; conversion still possible until 1 year 120 days post-separation WITH evidence of insurability.");
            else lines.push("- SGLI-to-VGLI: conversion window fully closed.");
            if (d >= 240) lines.push("- SkillBridge: guidance runway intact (start command conversation 8-12 months out).");
            else if (d >= 0) lines.push("- SkillBridge: past the recommended 8-12 month runway; feasibility at this point is a command decision \u2014 route to their command, do not declare impossible.");
            else lines.push("- SkillBridge: not applicable (pre-separation program).");
            sys.push({ type: "text", text: lines.join("\n") });
          }
          return sys;
        })(),
        messages: msgs
      })
    });

    if (!resp.ok) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: "The Navigator is briefly unavailable. Try again in a moment." }) };
    }
    const data = await resp.json();
    const reply = (data.content || []).filter(c => c.type === "text").map(c => c.text).join("") || "No response — try again.";
    return { statusCode: 200, headers, body: JSON.stringify({ reply }) };
  } catch (e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: "The Navigator is briefly unavailable. Try again in a moment." }) };
  }
};
