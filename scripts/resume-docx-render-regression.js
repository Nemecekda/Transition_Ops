const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const vm = require("node:vm");
const { TextDecoder, TextEncoder } = require("node:util");

const root = path.resolve(__dirname, "..");

function executable(filePath) {
  if (!filePath) return false;
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch (error) {
    return false;
  }
}

function executableOnPath(names) {
  const directories = String(process.env.PATH || "").split(path.delimiter).filter(Boolean);
  for (const directory of directories) {
    for (const name of names) {
      const candidate = path.join(directory, name);
      if (executable(candidate)) return candidate;
    }
  }
  return "";
}

function findLayoutBrowser() {
  if (process.env.TOPS_CHROME_BIN) {
    assert.ok(executable(process.env.TOPS_CHROME_BIN), "TOPS_CHROME_BIN must name an executable Chrome or Edge binary");
    return process.env.TOPS_CHROME_BIN;
  }
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge",
    "/usr/bin/microsoft-edge-stable",
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"),
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Microsoft", "Edge", "Application", "msedge.exe"),
    process.env["PROGRAMFILES(X86)"] && path.join(process.env["PROGRAMFILES(X86)"], "Microsoft", "Edge", "Application", "msedge.exe")
  ].filter(Boolean);
  return candidates.find(executable) || executableOnPath(["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge", "microsoft-edge-stable", "chrome", "msedge"]);
}

function bundledTool(name) {
  return path.join(os.homedir(), ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "bin", "override", name);
}

function findLibreOffice() {
  if (process.env.TOPS_LIBREOFFICE_BIN) {
    assert.ok(executable(process.env.TOPS_LIBREOFFICE_BIN), "TOPS_LIBREOFFICE_BIN must name an executable LibreOffice binary");
    return process.env.TOPS_LIBREOFFICE_BIN;
  }
  const candidates = [
    bundledTool("soffice"),
    "/Applications/LibreOffice.app/Contents/MacOS/soffice",
    "/Applications/LibreOfficeDev.app/Contents/MacOS/soffice",
    "/usr/bin/libreoffice",
    "/usr/bin/soffice"
  ];
  return candidates.find(executable) || executableOnPath(["libreoffice", "soffice"]);
}

function requiredPdfTool(envName, bundledName, pathNames) {
  if (process.env[envName]) {
    assert.ok(executable(process.env[envName]), envName + " must name an executable binary");
    return process.env[envName];
  }
  const bundled = bundledTool(bundledName);
  return executable(bundled) ? bundled : executableOnPath(pathNames);
}

function buildRenderFixtures() {
  const short = [
    "Jordan Short", "Madison, WI | jordan.short@example.test | (555) 010-1100", "",
    "SUMMARY", "Operations planning; scheduling; maintenance coordination.", "",
    "CORE SKILLS", "Process improvement, team coordination, reporting", "",
    "PROFESSIONAL EXPERIENCE",
    "Operations Coordinator | Synthetic Service Group", "2022 - Present",
    "\u2022 Coordinated maintenance schedules and documented service priorities for the operations team.",
    "\u2022 Tracked open work and briefed supervisors on confirmed completion status.",
    "\u2022 Updated operating procedures from approved process changes.", "",
    "Maintenance Lead | Synthetic Unit", "2019 - 2022",
    "\u2022 Assigned daily maintenance work and reviewed completed records.",
    "\u2022 Coordinated parts requests with the supported supply team.",
    "\u2022 Trained team members on documented inspection procedures.", "",
    "CERTIFICATIONS", "Project Management Certificate", "",
    "EDUCATION", "A.A.S., Applied Management, Synthetic College"
  ].join("\n");

  const browserOnlyHeader = [
    "Casey Exact", "Test City, ZZ | casey@example.invalid | (202) 555-0100", "",
    "SUMMARY", "Grounded synthetic operations leader with confirmed planning and reporting experience.", "",
    "CORE SKILLS", "Operations planning, Reporting, Team coordination", "",
    "PROFESSIONAL EXPERIENCE",
    "Operations Manager | Synthetic Company Alpha", "Test City, ZZ | 2021 - Present",
    "\u2022 Coordinated documented operating plans for supported teams.",
    "\u2022 Reported confirmed milestones to accountable leaders.", "",
    "Program Lead | Synthetic Company Bravo", "Sample City, ZZ | 2017 - 2021",
    "\u2022 Managed approved program schedules and open actions.",
    "\u2022 Updated operating procedures after completed reviews.", "",
    "CERTIFICATIONS", "Project Management Professional", "Lean Six Sigma Green Belt", "",
    "EDUCATION", "M.S., Operations Leadership, Synthetic University, 2017", "B.S., Business Administration, Synthetic College, 2012", "Graduate Certificate, Workforce Analytics, Synthetic Institute, 2020"
  ].join("\n");

  const liveSixRole = [
    "Alex Exact", "Ephraim, WI | alex.exact@example.test | (555) 010-2026", "",
    "SUMMARY", "Planning; Workday HCM; Analytics; Coaching.", "",
    "CORE SKILLS", "Facilitation, Recruiting, Workforce planning, Process improvement, Data analysis", "",
    "PROFESSIONAL EXPERIENCE",
    "Founder and Principal | Veteran Bridge Solutions LLC", "Ephraim, WI | 2024 - Present",
    "\u2022 Advise employers on recruiting strategy and hiring workflow design.",
    "\u2022 Built a transition-planning application for service members.",
    "\u2022 Coordinate synthetic market research, screening support, and funnel analysis.", "",
    "Talent Program Manager | Clarios", "17 U.S. plants | 2024 - 2026",
    "\u2022 Managed full-cycle recruiting for technical and manufacturing roles.",
    "\u2022 Built market-specific sourcing strategies tied to documented funnel data.",
    "\u2022 Developed recruiting dashboards for synthetic executive sponsors.", "",
    "HR Director | Mad City Windows and Baths", "2024",
    "\u2022 Led employee relations, performance coaching, and succession planning.",
    "\u2022 Delivered talent planning and leadership development for confirmed leaders.", "",
    "Talent Acquisition Leader | Trek Bicycle", "Waterloo, WI | Oct 2021 - Feb 2024",
    "\u2022 Led recruiters through a documented high-volume growth year.",
    "\u2022 Built a talent acquisition structure using confirmed competency practices.",
    "\u2022 Directed the recruiting workstream for a Workday implementation.", "",
    "Recruiting and Retention Battalion Commander | Wisconsin Army National Guard",
    "\u2022 Led a recruiting operation against documented monthly production targets.",
    "\u2022 Managed staff activity, resources, and recruiting performance reviews.",
    "\u2022 Developed leaders and maintained accountable workforce planning practices.", "",
    "Deputy Director of Personnel | Wisconsin Army National Guard",
    "\u2022 Directed talent management, succession planning, and workforce analytics.",
    "\u2022 Coordinated personnel planning across documented statewide locations.", "",
    "CERTIFICATIONS", "SHRM-SCP", "SPHR", "TalentSmart EQ Certified", "Lean Six Sigma Green Belt", "",
    "EDUCATION", "MBA, Human Resource Management, Synthetic University, 2008", "B.B.A., Business Administration, Synthetic College, 2002", "M.A., Strategic Studies, Synthetic War College", "Doctoral candidate, Applied Leadership, Synthetic University"
  ].join("\n");

  const seniorLiveShape14 = [
    "Riley Senior", "Green Bay, WI | riley.senior@example.test | (555) 010-2400", "",
    "SUMMARY", "Talent strategy; Workforce planning; Recruiting operations; Leadership development.", "",
    "CORE SKILLS", "Succession planning, Talent analytics, Hiring leader advisory, Process design, Workday, Performance coaching", "",
    "PROFESSIONAL EXPERIENCE",
    "Founder and Principal | Bridgeway Workforce Studio", "Remote | 2024 - Present",
    "\u2022 Advise employers on recruiting strategy, sourcing programs, and documented hiring workflows for technical talent pipelines.",
    "\u2022 Built a transition-planning application and documented AI-enabled sourcing research, market mapping, screening support, and funnel analysis.", "",
    "Talent Program Manager | Synthetic Energy Systems", "17 U.S. sites | 2024 - 2026",
    "\u2022 Managed full-cycle recruiting for technical, production, maintenance, and engineering-adjacent roles across confirmed manufacturing sites.",
    "\u2022 Built market-specific sourcing strategies and connected approved recruitment marketing activity to documented funnel data.",
    "\u2022 Reported pipeline health, time to fill, source effectiveness, and quality signals to confirmed executive sponsors.", "",
    "HR Director | Regional Home Services", "2024",
    "\u2022 Led employee relations, investigations, performance coaching, succession planning, and leadership development for confirmed leaders.", "",
    "Talent Acquisition Leader | Consumer Products Group", "2021 - 2024",
    "\u2022 Led recruiters through a documented high-volume growth year across engineering, corporate, retail, and operations functions.",
    "\u2022 Built a talent acquisition structure using confirmed competencies, interview training, and documented hiring debriefs.",
    "\u2022 Directed the recruiting workstream for a Workday implementation, including requisition workflow, data standards, and reporting design.", "",
    "Recruiting and Retention Commander | State Defense Organization",
    "\u2022 Led a recruiting operation against documented monthly production targets and accountable workforce requirements.",
    "\u2022 Managed staff activity, approved resources, and recurring recruiting performance reviews.",
    "\u2022 Developed leaders and maintained documented workforce planning practices across the supported organization.", "",
    "Deputy Personnel Director | State Defense Organization",
    "\u2022 Directed talent management, succession planning, workforce planning, and analytics for a confirmed statewide workforce.",
    "\u2022 Coordinated personnel planning and leadership decisions across documented operating locations.", "",
    "CERTIFICATIONS", "Senior HR Certification", "Professional HR Certification", "Emotional Intelligence Certification", "Lean Six Sigma Green Belt", "",
    "EDUCATION", "MBA, Human Resource Management, Synthetic University", "B.B.A., Business Administration, Synthetic College", "M.A., Strategic Studies, Synthetic War College", "Doctoral candidate, Applied Leadership, Synthetic University"
  ].join("\n");

  const substantiveOnePage = [
    "Morgan Grounded", "Milwaukee, WI | morgan.grounded@example.test", "",
    "SUMMARY", "Operations planning; reporting; team coordination.", "",
    "PROFESSIONAL EXPERIENCE",
    "Operations Manager | Synthetic Company Alpha", "2022 - Present",
    "\u2022 Coordinated weekly operations planning and approved handoffs.",
    "\u2022 Reviewed documented risks with accountable team leads.",
    "\u2022 Tracked confirmed milestones through scheduled completion reviews.", "",
    "Program Lead | Synthetic Company Bravo", "2019 - 2022",
    "\u2022 Managed program schedules and documented open actions.",
    "\u2022 Briefed supported leaders on confirmed operating constraints.",
    "\u2022 Updated approved procedures after completed process reviews.", "",
    "Operations Coordinator | Synthetic Company Charlie", "2016 - 2019",
    "\u2022 Coordinated service requests across supported functional teams.",
    "\u2022 Maintained accurate status records for recurring reviews.", "",
    "Operations Analyst | Synthetic Company Delta", "2013 - 2016",
    "\u2022 Analyzed confirmed performance trends for operations supervisors.",
    "\u2022 Prepared recurring reports from approved source records.", "",
    "CERTIFICATIONS", "Project Management Certificate", "",
    "EDUCATION", "B.S., Operations Management, Synthetic University"
  ].join("\n");

  const nineBulletLongLines = [
    "Casey Fallback", "Appleton, WI | casey.fallback@example.test", "",
    "SUMMARY", "Operations planning; service coordination; risk review.", "",
    "PROFESSIONAL EXPERIENCE"
  ];
  ["Alpha", "Bravo", "Charlie"].forEach((label, roleIndex) => {
    nineBulletLongLines.push("Operations Lead " + label + " | Synthetic Fallback Group " + label, "Role period " + label);
    ["planning", "delivery", "review"].forEach((activity, activityIndex) => {
      nineBulletLongLines.push("\u2022 Coordinated documented " + activity + " activity " + label + " " + (activityIndex + 1) + " across supported functional teams, reviewed approved operating requirements with accountable leaders, maintained complete action records, analyzed confirmed constraints, prepared recurring status updates, tracked open decisions through established governance reviews, preserved the source evidence used for each completed handoff, validated status against approved records, coordinated documented dependencies with designated owners, summarized unresolved issues for the next decision forum, and closed actions only after receiving confirmed completion evidence from the responsible functional lead.");
    });
    nineBulletLongLines.push("");
  });
  nineBulletLongLines.push("CERTIFICATIONS", "Project Management Certificate", "", "EDUCATION", "B.S., Operations Management, Synthetic University");

  const roleSpecs = [
    ["Senior Operations Program Manager | Synthetic Manufacturing Group", "2021 - Present", "production planning", "plant leaders"],
    ["Regional Operations Manager | Synthetic Logistics Network", "2017 - 2021", "distribution operations", "regional partners"],
    ["Program Operations Lead | Synthetic Technology Services", "2013 - 2017", "service delivery", "program stakeholders"],
    ["Operations Planning Manager | Synthetic Support Command", "2009 - 2013", "resource planning", "supported organizations"],
    ["Operations Analyst | Synthetic Readiness Center", "2005 - 2009", "readiness analysis", "operations supervisors"],
    ["Operations Supervisor | Synthetic Service Activity", "2001 - 2005", "service operations", "functional coordinators"]
  ];
  const seniorLines = [
    "Taylor Senior", "Green Bay, WI | taylor.senior@example.test | (555) 010-2200", "",
    "SUMMARY", "Operations program leadership; process governance; performance analysis; cross-functional planning.", "",
    "CORE SKILLS", "Program operations, Process improvement, Workforce planning, Risk review, Executive reporting, Stakeholder coordination", "",
    "PROFESSIONAL EXPERIENCE"
  ];
  roleSpecs.forEach((role, roleIndex) => {
    seniorLines.push(role[0], role[1]);
    seniorLines.push("\u2022 Directed " + role[2] + " through documented weekly reviews, coordinated decisions with " + role[3] + ", and maintained approved action records through completion.");
    seniorLines.push("\u2022 Analyzed operating constraints, compared confirmed performance trends, and presented prioritized corrective actions to accountable leaders during recurring program reviews.");
    seniorLines.push("\u2022 Standardized handoffs across functional teams, documented ownership for open work, and monitored supported milestones without changing the underlying operating requirements.");
    seniorLines.push("\u2022 Coached team members on approved procedures, reviewed work products for accuracy, and escalated documented risks through the established leadership channel for role " + (roleIndex + 1) + ".");
    seniorLines.push("");
  });
  seniorLines.push("CERTIFICATIONS", "Project Management Professional", "Lean Six Sigma Green Belt", "Certified Manager", "Change Management Practitioner", "");
  seniorLines.push("EDUCATION", "M.S., Operations Management, Synthetic University", "B.S., Business Administration, Synthetic College");

  return { short, browserOnlyHeader, substantiveOnePage, nineBulletLong: nineBulletLongLines.join("\n"), liveSixRole, seniorLiveShape14, senior: seniorLines.join("\n") };
}

function docxBlockFromIndex() {
  const uiSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const blockMatch = uiSource.match(/\/\/ RESUME_DOCX_START\n([\s\S]*?)\n\/\/ RESUME_DOCX_END/);
  assert.ok(blockMatch, "index.html contains one isolated resume DOCX implementation block");
  return blockMatch[1];
}

function nodeDocxApi(docxBlock) {
  const context = { window: {}, TextDecoder, TextEncoder, Uint8Array, ArrayBuffer, DataView, Object, String, RegExp };
  vm.runInNewContext(docxBlock, context, { timeout: 1000 });
  return context.window.__TOPS_RESUME_DOCX;
}

function storedDocxEntry(bytes, targetName) {
  let offset = 0;
  while (offset + 30 <= bytes.length) {
    const view = new DataView(bytes.buffer, bytes.byteOffset + offset, bytes.byteLength - offset);
    if (view.getUint32(0, true) !== 0x04034B50) break;
    const method = view.getUint16(8, true);
    const size = view.getUint32(18, true);
    const nameLength = view.getUint16(26, true);
    const extraLength = view.getUint16(28, true);
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const name = new TextDecoder().decode(bytes.slice(nameStart, nameStart + nameLength));
    if (name === targetName) {
      assert.equal(method, 0, "regression DOCX entries remain deterministic and uncompressed");
      return bytes.slice(dataStart, dataStart + size);
    }
    offset = dataStart + size;
  }
  throw new Error("DOCX entry missing: " + targetName);
}

function xmlText(value) {
  return String(value).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

function extractedDocxText(bytes) {
  const documentXml = new TextDecoder().decode(storedDocxEntry(bytes, "word/document.xml"));
  const markerByNumId = { "41": "\u2022", "42": "-", "43": "*" };
  return Array.from(documentXml.matchAll(/<w:p>([\s\S]*?)<\/w:p>/g), (paragraphMatch) => {
    const paragraph = paragraphMatch[1];
    const text = Array.from(paragraph.matchAll(/<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>/g), (textMatch) => xmlText(textMatch[1])).join("");
    const numberMatch = paragraph.match(/<w:numId w:val="(\d+)"\/>/);
    return numberMatch ? markerByNumId[numberMatch[1]] + " " + text : text;
  }).join("\n");
}

function pageBreakCount(bytes) {
  const documentXml = new TextDecoder().decode(storedDocxEntry(bytes, "word/document.xml"));
  return (documentXml.match(/<w:pageBreakBefore\/>|<w:br w:type="page"\/>/g) || []).length;
}

function browserRegressionBody() {
  function check(condition, message) {
    if (!condition) throw new Error(message);
  }
  function exactText(bytes) {
    return topsResumeDocxParagraphs(bytes).map(function(paragraph) { return paragraph.text; }).join("\n");
  }

  var fixtures = window.__TOPS_RENDER_FIXTURES;
  var api = window.__TOPS_RESUME_DOCX;
  var fileName = "Resume_Draft.docx";
  var shortPlan = {
    preference: "two_pages", recommendedPages: 1, selectedPages: 2,
    postAuditEvidenceFit: "FAIL", presentationProfile: "compact_one_page"
  };
  var seniorPlan = {
    preference: "adaptive", recommendedPages: 2, selectedPages: 2,
    postAuditEvidenceFit: "PASS", presentationProfile: "readable_two_page"
  };
  var onePageSeniorPlan = {
    preference: "one_page", recommendedPages: 2, selectedPages: 1,
    postAuditEvidenceFit: "PASS", presentationProfile: "compact_one_page"
  };
  var livePlan = {
    preference: "adaptive", recommendedPages: 1, selectedPages: 1,
    postAuditEvidenceFit: "PASS", presentationProfile: "compact_one_page"
  };
  var substantiveOnePagePlan = {
    preference: "two_pages", recommendedPages: 1, selectedPages: 2,
    postAuditEvidenceFit: "PASS", presentationProfile: "readable_two_page"
  };
  var failedPostAuditFallbackPlan = {
    preference: "adaptive", recommendedPages: 2, selectedPages: 2,
    postAuditEvidenceFit: "FAIL", presentationProfile: "compact_one_page",
    postAuditDisposition: "fallback_one_page_insufficient_supported_bullets"
  };

  var shortPrepared = api.prepare(fixtures.short, fileName, api.mime, shortPlan);
  check(shortPrepared.ok && shortPrepared.renderCheck.pageCount === 1, "RDM-187/RDM-190 short candidate stays one page without padding");
  check(shortPrepared.options.presentationProfile === "compact_one_page", "RDM-190 two-page preference is guarded after insufficient supported bullets");
  check(exactText(shortPrepared.bytes) === fixtures.short, "RDM-193 short candidate content is exact");

  var substantiveOnePagePrepared = api.prepare(fixtures.substantiveOnePage, fileName, api.mime, substantiveOnePagePlan);
  check(substantiveOnePagePrepared.ok && substantiveOnePagePrepared.renderCheck.pageCount === 1, "RDM-197 fixed senior profile may remain one natural page");
  check(substantiveOnePagePrepared.requestedRenderCheck.pageCount === 1, "RDM-197 browser estimate reports the fixed profile truthfully");
  check(substantiveOnePagePrepared.options.presentationProfile === "readable_two_page", "RDM-196 B-pass candidate never falls back to the compact profile");
  check(substantiveOnePagePrepared.lengthPlan.preflightDisposition === "one_page_evidence_exception", "RDM-197 one-page evidence exception is transparent");
  check(substantiveOnePagePrepared.lengthPlan.needsMoreConfirmedDetail === true, "RDM-197 requests more confirmed role detail outside the resume");
  check(exactText(substantiveOnePagePrepared.bytes) === fixtures.substantiveOnePage, "RDM-197 one-page exception content is exact");
  var onePageScorecardInput = [
    { dimension: "length_and_readability", status: "PASS", evidence: "Original length finding." },
    { dimension: "format_compliance", status: "PASS", evidence: "Original format finding." }
  ];
  var onePageScorecard = api.scorecardWithLengthPlan(onePageScorecardInput, substantiveOnePagePrepared.lengthPlan);
  check(onePageScorecard[0].status === "NEEDS MEMBER FACT" && /more confirmed, role-specific accomplishments/i.test(onePageScorecard[0].evidence), "RDM-197 runtime scorecard marks the natural one-page exception NEEDS MEMBER FACT");
  check(onePageScorecard[1] === onePageScorecardInput[1] && onePageScorecardInput[0].status === "PASS", "RDM-197 scorecard update leaves unrelated dimensions and source data unchanged");
  var preservedFailure = api.scorecardWithLengthPlan([{ dimension: "length_and_readability", status: "FAIL", evidence: "Existing blocking failure." }], substantiveOnePagePrepared.lengthPlan);
  check(preservedFailure[0].status === "FAIL" && preservedFailure[0].evidence === "Existing blocking failure.", "RDM-197 scorecard preserves an existing FAIL");

  var failedFallbackPrepared = api.prepare(fixtures.nineBulletLong, fileName, api.mime, failedPostAuditFallbackPlan);
  check(!failedFallbackPrepared.ok, "RDM-192 B=9 fallback is withheld when the same audited content still needs two pages");
  check(failedFallbackPrepared.renderCheck.pageCount === 2, "RDM-192 B=9 fallback re-renders the compact profile before withholding");
  check(failedFallbackPrepared.lengthPlan.preflightDisposition === "fallback_withheld", "RDM-192 failed fallback disposition is transparent");
  check(failedFallbackPrepared.lengthPlan.appliedPages === null, "RDM-192 failed fallback is never reported as an applied artifact");

  var seniorPrepared = api.prepare(fixtures.senior, fileName, api.mime, seniorPlan);
  check(seniorPrepared.ok && seniorPrepared.renderCheck.pageCount === 2, "RDM-188 senior candidate reaches two natural browser-preflight pages");
  check(seniorPrepared.options.presentationProfile === "readable_two_page", "RDM-188 substantive senior candidate keeps the readable two-page profile");
  check(seniorPrepared.renderCheck.minimumPageUseRatio >= 0.25, "RDM-188 both senior preflight pages are substantive");
  check(exactText(seniorPrepared.bytes) === fixtures.senior, "RDM-193 senior candidate content is exact");

  var onePageSeniorPrepared = api.prepare(fixtures.senior, fileName, api.mime, onePageSeniorPlan);
  check(onePageSeniorPrepared.ok, "RDM-190 one-page preference does not withhold supported senior content");
  check(onePageSeniorPrepared.renderCheck.pageCount === 2, "RDM-190 one-page preference retains two pages when content does not fit readably");
  check(onePageSeniorPrepared.lengthPlan.preflightDisposition === "content_preserved_two_pages", "RDM-190 one-page override reports content preservation");
  check(exactText(onePageSeniorPrepared.bytes) === fixtures.senior, "RDM-193 one-page preference preserves candidate content");

  var livePrepared = api.prepare(fixtures.liveSixRole, fileName, api.mime, livePlan);
  check(livePrepared.ok && livePrepared.renderCheck.pageCount === 1, "RDM-175 prior six-role fixture remains one natural page");
  check(exactText(livePrepared.bytes) === fixtures.liveSixRole, "RDM-175 prior fixture remains exact");

  var browserOnlyHeaderPrepared = api.prepare(fixtures.browserOnlyHeader, fileName, api.mime, livePlan);
  check(browserOnlyHeaderPrepared.ok && browserOnlyHeaderPrepared.renderCheck.pageCount === 1, "RDM-256 browser-assembled civilian candidate remains a genuine non-sparse DOCX");
  check(exactText(browserOnlyHeaderPrepared.bytes) === fixtures.browserOnlyHeader, "RDM-256 DOCX preserves the browser-only header and every server-candidate byte");
  check(exactText(browserOnlyHeaderPrepared.bytes).split("(202) 555-0100").length - 1 === 1, "RDM-256 parenthesized phone remains byte-exact exactly once");
  ["M.S., Operations Leadership, Synthetic University, 2017", "B.S., Business Administration, Synthetic College, 2012", "Graduate Certificate, Workforce Analytics, Synthetic Institute, 2020", "Project Management Professional", "Lean Six Sigma Green Belt"].forEach(function(item) {
    check(exactText(browserOnlyHeaderPrepared.bytes).split(item).length - 1 === 1, "RDM-256 exact global item survives browser assembly and DOCX export: " + item);
  });

  var seniorLiveShapePrepared = api.prepare(fixtures.seniorLiveShape14, fileName, api.mime, seniorPlan);
  var seniorLiveRoleIndexes = topsResumeDocxParagraphs(api.build(fixtures.seniorLiveShape14, { presentationProfile: "readable_two_page" })).map(function(paragraph, paragraphIndex) { return paragraph.styleId === "ResumeRole" ? paragraphIndex : -1; }).filter(function(paragraphIndex) { return paragraphIndex >= 0; });
  var seniorLiveBalanceMetrics = seniorLiveRoleIndexes.map(function(paragraphIndex) {
    var candidateCheck = api.renderCheck(api.build(fixtures.seniorLiveShape14, { presentationProfile: "readable_two_page", pageBreakBeforeParagraph: paragraphIndex }));
    return { paragraphIndex: paragraphIndex, ok: candidateCheck.ok, pageCount: candidateCheck.pageCount, minimumPageUseRatio: candidateCheck.minimumPageUseRatio, pageBalanceSpread: candidateCheck.pageBalanceSpread };
  });
  check(seniorLiveShapePrepared.ok && seniorLiveShapePrepared.renderCheck.pageCount === 2, "RDM-195 six-role 14-bullet senior candidate reaches two browser-preflight pages");
  check(seniorLiveShapePrepared.options.presentationProfile === "readable_two_page", "RDM-195 senior live-shape keeps the fixed readable profile");
  check(seniorLiveShapePrepared.renderCheck.minimumPageUseRatio >= 0.25 && !seniorLiveShapePrepared.renderCheck.sparseTrailingPage, "RDM-195 both browser-preflight pages are substantive after semantic rebalancing");
  check(seniorLiveShapePrepared.lengthPlan.preflightDisposition === "semantic_role_rebalance", "RDM-195 a semantic role boundary balances the already-two-page candidate: " + JSON.stringify(seniorLiveBalanceMetrics));
  check(seniorLiveShapePrepared.lengthPlan.semanticPageBreakApplied === true, "RDM-195 reports the presentation-only role-boundary break");
  check(seniorLiveShapePrepared.options.pageBreakBeforeParagraph === 25, "RDM-195 deterministic balance boundary expected paragraph 25, received " + String(seniorLiveShapePrepared.options.pageBreakBeforeParagraph));
  check(exactText(seniorLiveShapePrepared.bytes) === fixtures.seniorLiveShape14, "RDM-195 senior live-shape content is exact");
  var firstRoleBreakCheck = api.renderCheck(api.build(fixtures.seniorLiveShape14, { presentationProfile: "readable_two_page", pageBreakBeforeParagraph: seniorLiveRoleIndexes[0] }));
  check(!firstRoleBreakCheck.ok && firstRoleBreakCheck.orphan, "RDM-195 a semantic break cannot orphan PROFESSIONAL EXPERIENCE from its first role");
  var originalSemanticRebalance = topsResumeSemanticRoleRebalance;
  var unresolvedSparsePrepared;
  try {
    topsResumeSemanticRoleRebalance = function() { return null; };
    unresolvedSparsePrepared = api.prepare(fixtures.seniorLiveShape14, fileName, api.mime, seniorPlan);
  } finally {
    topsResumeSemanticRoleRebalance = originalSemanticRebalance;
  }
  check(!unresolvedSparsePrepared.ok && unresolvedSparsePrepared.lengthPlan.preflightDisposition === "unbalanced_two_page_withheld", "RDM-195 unresolved sparse two-page output is withheld instead of released or compacted");
  check(unresolvedSparsePrepared.lengthPlan.appliedPages === null && unresolvedSparsePrepared.lengthPlan.unbalancedTwoPageWithheld === true, "RDM-195 withheld sparse output is never reported as applied");

  [shortPrepared, browserOnlyHeaderPrepared, substantiveOnePagePrepared, seniorPrepared, onePageSeniorPrepared, livePrepared].forEach(function(prepared) {
    var paragraphs = topsResumeDocxParagraphs(prepared.bytes);
    check(paragraphs.filter(function(paragraph) { return paragraph.pageBreakBefore; }).length === 0, "RDM-191 released profiles contain zero automatic page breaks");
  });
  var seniorLiveBreaks = topsResumeDocxParagraphs(seniorLiveShapePrepared.bytes).filter(function(paragraph) { return paragraph.pageBreakBefore; });
  check(seniorLiveBreaks.length === 1 && seniorLiveBreaks[0].styleId === "ResumeRole", "RDM-195 rebalancing uses one semantic role boundary and never a spacer");
  var spacerIndex = fixtures.liveSixRole.split("\n").indexOf("");
  var spacerBreakAttempt = api.build(fixtures.liveSixRole, { presentationProfile: "compact_one_page", pageBreakBeforeParagraph: spacerIndex });
  check(topsResumeDocxParagraphs(spacerBreakAttempt).filter(function(paragraph) { return paragraph.pageBreakBefore; }).length === 0, "RDM-191 ResumeSpacer cannot receive pageBreakBefore");

  var clippingText = ["Alex Exact", "alex.exact@example.test", "", "SUMMARY", Array(1200).join("X")].join("\n");
  var clippingRender = api.renderCheck(api.build(clippingText));
  check(!clippingRender.ok && clippingRender.overflow, "RDM-192 browser preflight blocks clipping");

  var hiddenStyle = document.createElement("style");
  hiddenStyle.textContent = 'div[aria-hidden="true"] > div { display:none !important; }';
  document.head.appendChild(hiddenStyle);
  var hiddenRender = api.renderCheck(api.build(fixtures.short));
  hiddenStyle.remove();
  check(!hiddenRender.ok && hiddenRender.hiddenText, "RDM-192 browser preflight blocks hidden text");

  var overlapStyle = document.createElement("style");
  overlapStyle.textContent = 'div[aria-hidden="true"] > div { position:absolute !important; top:0 !important; }';
  document.head.appendChild(overlapStyle);
  var overlapRender = api.renderCheck(api.build(fixtures.short));
  overlapStyle.remove();
  check(!overlapRender.ok && overlapRender.overlap, "RDM-192 browser preflight blocks overlap");

  var longLines = ["Alex Exact", "alex.exact@example.test", "", "SUMMARY"];
  for (var longIndex = 0; longIndex < 220; longIndex += 1) longLines.push("Supported overflow control line " + longIndex + ".");
  var longRender = api.renderCheck(api.build(longLines.join("\n")));
  check(!longRender.ok && longRender.tooManyPages && longRender.pageCount > 2, "RDM-192 browser preflight blocks artifacts over two pages");

  check(api.mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "RDM-198 DOCX MIME remains exact");
  return "PASS: RDM-175 and RDM-187..RDM-198 browser preflight, fixed senior profile, honest one-page exception, exact content, and negative layout controls";
}

function buildHarness(docxBlock, fixtures) {
  const fixtureJson = JSON.stringify(fixtures).replace(/</g, "\\u003c");
  return "<!doctype html><html><head><meta charset=\"utf-8\"><title>Transition OPS DOCX render regression</title></head><body><pre id=\"result\">RUNNING</pre><script>window.__TOPS_RENDER_FIXTURES=" + fixtureJson + ";</script><script>" + docxBlock + "</script><script>(function(){try{var message=(" + browserRegressionBody.toString() + ")();document.documentElement.setAttribute('data-rdm-result','PASS');document.getElementById('result').textContent=message;}catch(error){document.documentElement.setAttribute('data-rdm-result','FAIL');document.getElementById('result').textContent='FAIL: '+String(error&&error.stack||error);}})();</script></body></html>";
}

async function runBrowserRegression(browser, docxBlock, fixtures) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tops-resume-browser-"));
  const harnessPath = path.join(scratch, "render-regression.html");
  const profilePath = path.join(scratch, "chrome-profile");
  try {
    fs.writeFileSync(harnessPath, buildHarness(docxBlock, fixtures), "utf8");
    const args = [
      "--headless=new",
      "--disable-gpu",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-sync",
      "--metrics-recording-only",
      "--no-first-run",
      "--no-sandbox",
      "--allow-file-access-from-files",
      "--host-resolver-rules=MAP * ~NOTFOUND",
      "--user-data-dir=" + profilePath,
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=5000",
      "--dump-dom",
      "file://" + harnessPath
    ];
    const result = await new Promise((resolve, reject) => {
      const child = childProcess.spawn(browser, args, { stdio: ["ignore", "pipe", "pipe"] });
      let stdout = "";
      let stderr = "";
      let complete = false;
      let settled = false;
      let forceTimer = null;
      const timeout = setTimeout(() => {
        if (settled) return;
        settled = true;
        child.kill("SIGKILL");
        reject(new Error("Headless browser did not complete the layout regression within 30 seconds.\n" + stderr + stdout));
      }, 30000);
      function append(current, chunk) {
        const next = current + chunk.toString("utf8");
        if (next.length > 20 * 1024 * 1024) throw new Error("Headless browser output exceeded 20 MB.");
        return next;
      }
      function inspectOutput() {
        if (complete || !/data-rdm-result="(?:PASS|FAIL)"/.test(stdout) || !/<\/pre>/.test(stdout)) return;
        complete = true;
        child.kill("SIGTERM");
        forceTimer = setTimeout(() => child.kill("SIGKILL"), 1000);
      }
      child.stdout.on("data", (chunk) => {
        try {
          stdout = append(stdout, chunk);
          inspectOutput();
        } catch (error) {
          child.kill("SIGKILL");
          if (!settled) { settled = true; clearTimeout(timeout); reject(error); }
        }
      });
      child.stderr.on("data", (chunk) => {
        try {
          stderr = append(stderr, chunk);
        } catch (error) {
          child.kill("SIGKILL");
          if (!settled) { settled = true; clearTimeout(timeout); reject(error); }
        }
      });
      child.on("error", (error) => {
        if (!settled) { settled = true; clearTimeout(timeout); if (forceTimer) clearTimeout(forceTimer); reject(error); }
      });
      child.on("close", (status, signal) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        if (forceTimer) clearTimeout(forceTimer);
        if (!complete && status !== 0) return reject(new Error("Headless browser exited before completing the regression (status " + status + ", signal " + signal + ").\n" + stderr + stdout));
        resolve({ stdout, stderr, status, signal });
      });
    });
    assert.match(result.stdout, /data-rdm-result="PASS"/, result.stdout);
    const messageMatch = result.stdout.match(/<pre id="result">([\s\S]*?)<\/pre>/);
    assert.ok(messageMatch, "headless browser returned the regression result");
    const message = messageMatch[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    console.log(message);
    return message;
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

function runChecked(binary, args, label, options) {
  const result = childProcess.spawnSync(binary, args, Object.assign({ encoding: "utf8", timeout: 60000, maxBuffer: 10 * 1024 * 1024 }, options || {}));
  assert.equal(result.error, undefined, label + " failed to start: " + String(result.error || ""));
  assert.equal(result.status, 0, label + " failed (status " + result.status + "):\n" + String(result.stderr || "") + String(result.stdout || ""));
  return result;
}

function parsePgm(filePath) {
  const bytes = fs.readFileSync(filePath);
  let offset = 0;
  function token() {
    while (offset < bytes.length) {
      if (bytes[offset] === 35) {
        while (offset < bytes.length && bytes[offset] !== 10) offset += 1;
      } else if (bytes[offset] <= 32) {
        offset += 1;
      } else {
        break;
      }
    }
    const start = offset;
    while (offset < bytes.length && bytes[offset] > 32 && bytes[offset] !== 35) offset += 1;
    return bytes.slice(start, offset).toString("ascii");
  }
  assert.equal(token(), "P5", "LibreOffice PDF raster uses binary PGM");
  const width = Number(token());
  const height = Number(token());
  const maxValue = Number(token());
  assert.ok(width > 0 && height > 0 && maxValue === 255, "PGM dimensions and depth are valid");
  while (offset < bytes.length && bytes[offset] <= 32) offset += 1;
  const pixels = bytes.subarray(offset);
  assert.equal(pixels.length, width * height, "PGM pixel count is exact");
  let ink = 0;
  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;
  for (let index = 0; index < pixels.length; index += 1) {
    if (pixels[index] >= 245) continue;
    ink += 1;
    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return {
    width,
    height,
    ink,
    inkRatio: ink / pixels.length,
    horizontalUse: maxX >= minX ? (maxX - minX + 1) / width : 0,
    verticalUse: maxY >= minY ? (maxY - minY + 1) / height : 0,
    clipped: ink > 0 && (minX <= 1 || minY <= 1 || maxX >= width - 2 || maxY >= height - 2)
  };
}

function normalizedRenderedContent(value) {
  return String(value).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").replace(/\f/g, "\n").split("\n").map((line) => line.trim().replace(/^([\u2022*-])\s+/, "$1 ")).filter(Boolean).join("\n");
}

function renderActualDocx(tooling, bytes, resumeText, label, expectedPages, substantiveTwoPage) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tops-resume-libreoffice-"));
  const docxPath = path.join(scratch, label + ".docx");
  const outputDir = path.join(scratch, "rendered");
  const profileDir = path.join(scratch, "profile");
  fs.mkdirSync(outputDir);
  fs.mkdirSync(profileDir);
  try {
    fs.writeFileSync(docxPath, bytes);
    const profileUri = pathToFileURL(profileDir).href;
    const conversion = runChecked(tooling.libreOffice, ["-env:UserInstallation=" + profileUri, "--headless", "--convert-to", "pdf", "--outdir", outputDir, docxPath], label + " LibreOffice conversion");
    assert.doesNotMatch(String(conversion.stderr || "") + String(conversion.stdout || ""), /error|corrupt|repair|damaged/i, label + " has no renderer compatibility error");
    const pdfPath = path.join(outputDir, label + ".pdf");
    assert.ok(fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 0, label + " produced a nonempty PDF");
    const info = runChecked(tooling.pdfinfo, [pdfPath], label + " pdfinfo").stdout;
    const pagesMatch = String(info).match(/^Pages:\s+(\d+)$/m);
    assert.ok(pagesMatch, label + " pdfinfo reports page count");
    const pageCount = Number(pagesMatch[1]);
    assert.equal(pageCount, expectedPages, label + " renders the expected page count");

    const textConversion = runChecked(tooling.libreOffice, ["-env:UserInstallation=" + profileUri, "--headless", "--convert-to", "txt:Text", "--outdir", outputDir, docxPath], label + " LibreOffice text export");
    assert.doesNotMatch(String(textConversion.stderr || "") + String(textConversion.stdout || ""), /error|corrupt|repair|damaged/i, label + " text export has no compatibility error");
    const renderedTextPath = path.join(outputDir, label + ".txt");
    assert.ok(fs.existsSync(renderedTextPath), label + " produced renderer-extracted text");
    assert.equal(normalizedRenderedContent(fs.readFileSync(renderedTextPath, "utf8")), normalizedRenderedContent(resumeText), label + " Word-compatible rendering preserves every candidate-content line in order");

    const rasterPrefix = path.join(scratch, "page");
    runChecked(tooling.pdftoppm, ["-gray", "-r", "72", pdfPath, rasterPrefix], label + " PDF rasterization");
    const pageMetrics = Array.from({ length: pageCount }, (_, index) => parsePgm(rasterPrefix + "-" + (index + 1) + ".pgm"));
    pageMetrics.forEach((metrics, index) => {
      assert.ok(metrics.inkRatio > 0.001, label + " page " + (index + 1) + " contains visible content");
      assert.equal(metrics.clipped, false, label + " page " + (index + 1) + " keeps rendered ink inside page edges");
    });
    if (substantiveTwoPage) {
      pageMetrics.forEach((metrics, index) => {
        assert.ok(metrics.verticalUse >= 0.35, label + " page " + (index + 1) + " is substantive rather than sparse (vertical use " + metrics.verticalUse.toFixed(3) + ")");
      });
      const verticalUse = pageMetrics.map((metrics) => metrics.verticalUse);
      assert.ok(Math.max.apply(Math, verticalUse) - Math.min.apply(Math, verticalUse) <= 0.55, label + " pages remain reasonably balanced without content padding or distortion");
    }
    return { pageCount, pageMetrics };
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

function runLibreOfficeRegression(docxBlock, fixtures) {
  const libreOffice = findLibreOffice();
  assert.ok(libreOffice, "RDM-192 requires local LibreOffice; set TOPS_LIBREOFFICE_BIN when it is not on the standard path");
  const tooling = {
    libreOffice,
    pdfinfo: requiredPdfTool("TOPS_PDFINFO_BIN", "pdfinfo", ["pdfinfo"]),
    pdftoppm: requiredPdfTool("TOPS_PDFTOPPM_BIN", "pdftoppm", ["pdftoppm"])
  };
  assert.ok(tooling.pdfinfo && tooling.pdftoppm, "RDM-192 requires local PDF inspection tools; renderer checks may not skip");

  const api = nodeDocxApi(docxBlock);
  const cases = [
    { label: "short-adaptive", text: fixtures.short, options: { presentationProfile: "compact_one_page" }, pages: 1, substantive: false },
    { label: "substantive-one-page-evidence-exception", text: fixtures.substantiveOnePage, options: { presentationProfile: "readable_two_page" }, pages: 1, substantive: false },
    { label: "nine-bullet-fallback-control", text: fixtures.nineBulletLong, options: { presentationProfile: "compact_one_page" }, pages: 2, substantive: false },
    { label: "senior-adaptive", text: fixtures.senior, options: { presentationProfile: "readable_two_page" }, pages: 2, substantive: true },
    { label: "senior-one-page-preference", text: fixtures.senior, options: { presentationProfile: "compact_one_page" }, pages: 2, substantive: false },
    { label: "live-six-role", text: fixtures.liveSixRole, options: { presentationProfile: "compact_one_page" }, pages: 1, substantive: false },
    { label: "browser-only-header", text: fixtures.browserOnlyHeader, options: { presentationProfile: "compact_one_page" }, pages: 1, substantive: false },
    { label: "senior-live-shape-14", text: fixtures.seniorLiveShape14, options: { presentationProfile: "readable_two_page", pageBreakBeforeParagraph: 25 }, pages: 2, substantive: true, pageBreaks: 1 }
  ];
  const evidence = {};
  cases.forEach((fixture) => {
    const bytes = api.build(fixture.text, fixture.options);
    assert.equal(extractedDocxText(bytes), fixture.text, fixture.label + " DOCX content is byte-exact after extraction");
    assert.equal(pageBreakCount(bytes), fixture.pageBreaks || 0, fixture.label + " contains only its expected semantic page break");
    assert.equal(api.validate(bytes, fixture.text, "Resume_Draft.docx", api.mime, fixture.options).ok, true, fixture.label + " validates as genuine DOCX");
    evidence[fixture.label] = renderActualDocx(tooling, bytes, fixture.text, fixture.label, fixture.pages, fixture.substantive);
  });
  console.log("PASS: RDM-192 and RDM-195 actual LibreOffice DOCX rendering; one/two-page counts, fixed senior profile, substantive visible pages, exact renderer-extracted content, no clipping, and only the expected semantic role-boundary break");
  return { libreOffice, evidence };
}

async function runRenderRegression() {
  const browser = findLayoutBrowser();
  assert.ok(browser, "RDM-181 requires an executable Chrome or Edge browser; set TOPS_CHROME_BIN to its path");
  const docxBlock = docxBlockFromIndex();
  const fixtures = buildRenderFixtures();
  const browserMessage = await runBrowserRegression(browser, docxBlock, fixtures);
  const libreOfficeEvidence = runLibreOfficeRegression(docxBlock, fixtures);
  return { skipped: false, browser, browserMessage, libreOffice: libreOfficeEvidence.libreOffice, libreOfficeEvidence: libreOfficeEvidence.evidence };
}

if (require.main === module) {
  runRenderRegression().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { buildRenderFixtures, findLayoutBrowser, findLibreOffice, runRenderRegression };
