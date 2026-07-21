// TOPS Jobs — server-side proxy to CareerOneStop Job Search API (DOL open data)
// Token + UserID live in Netlify env only: COS_API_TOKEN, COS_USER_ID
// Defensive by design: if the API shape changes or fails, the app falls back to link-out.
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

  const clip = (s, n) => String(s || "").trim().slice(0, n);
  const keyword = clip(input.keyword, 80);
  const location = clip(input.location, 40); // state name, abbrev, or zip
  if (!keyword || !location) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Need a job keyword and a state." }) };
  }

  const userId = process.env.COS_USER_ID;
  const token = process.env.COS_API_TOKEN;
  if (!userId || !token) {
    return { statusCode: 503, headers, body: JSON.stringify({ error: "Job search is warming up — use the State Job Banks link in Resources meanwhile." }) };
  }

  // Jobs API: tokens issued after Aug 27, 2024 use v2; older tokens use v1.
  // Path: /{ver}/jobsearch/{userId}/{keyword}/{location}/{radius}/{sortColumns}/{sortOrder}/{startRecord}/{pageSize}/{days}
  const tail = [
    userId,
    encodeURIComponent(keyword),
    encodeURIComponent(location),
    "25", "0", "0", "0", "10", "30"
  ].join("/");

  async function callApi(ver) {
    const url = "https://api.careeronestop.org/" + ver + "/jobsearch/" + tail;
    const resp = await fetch(url, {
      headers: { "Authorization": "Bearer " + token, "Accept": "application/json" }
    });
    if (!resp.ok) {
      let bodySnippet = "";
      try { bodySnippet = (await resp.text()).slice(0, 200); } catch (e) {}
      console.log("COS " + ver + " status " + resp.status + ": " + bodySnippet);
      return null;
    }
    return resp.json();
  }

  try {
    let data = await callApi("v2");
    if (!data) data = await callApi("v1");
    if (!data) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: "Job search hiccup — the State Job Banks link in Resources always works." }) };
    }
    // Defensive parse: expected shape { Jobs: [{ JvId, JobTitle, Company, Location, DatePosted, URL }], JobCount }
    const raw = Array.isArray(data.Jobs) ? data.Jobs : [];
    const jobs = raw.slice(0, 10).map(function (j) {
      return {
        title: String(j.JobTitle || j.Title || "Untitled role").slice(0, 120),
        company: String(j.Company || j.CompanyName || "").slice(0, 80),
        location: String(j.Location || "").slice(0, 60),
        posted: String(j.DatePosted || j.AcquisitionDate || j.AccquisitionDate || "").slice(0, 24),
        url: typeof (j.URL || j.Url) === "string" && /^https?:\/\//.test(j.URL || j.Url) ? (j.URL || j.Url) : null
      };
    }).filter(function (j) { return j.url; });
    if (jobs.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ jobs: [], count: 0, note: "No matches in the last 30 days — try a broader keyword, or browse your state's job bank directly." }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ jobs: jobs, count: Number(data.Jobcount || data.JobCount || jobs.length) || jobs.length, source: "CareerOneStop / U.S. Department of Labor" }) };
  } catch (e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: "Job search hiccup — the State Job Banks link in Resources always works." }) };
  }
};
