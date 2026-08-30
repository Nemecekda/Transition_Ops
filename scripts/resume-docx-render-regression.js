const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

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

function browserOnPath(names) {
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
  return candidates.find(executable) || browserOnPath(["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge", "microsoft-edge-stable", "chrome", "msedge"]);
}

function browserRegressionBody() {
  function check(condition, message) {
    if (!condition) throw new Error(message);
  }

  function liveFixture(extraWords) {
    var roles = [
      ["Founder and Principal | Veteran Bridge Solutions LLC", "Ephraim, WI | 2024 - Present", [
        "Advise employers on recruiting strategy, sourcing programs, and hiring workflow design.",
        "Built and operate a transition-planning application for service members.",
        "Coordinate synthetic market research, screening support, and funnel analysis."
      ]],
      ["Talent Program Manager | Clarios", "17 U.S. plants | 2024 - 2026", [
        "Managed full-cycle recruiting for technical, production, and maintenance roles.",
        "Built market-specific sourcing strategies tied to documented funnel data.",
        "Developed recruiting dashboards for synthetic executive sponsors."
      ]],
      ["HR Director | Mad City Windows and Baths", "2024", [
        "Led employee relations, investigations, and performance management coaching.",
        "Delivered talent planning and leadership development for confirmed leaders."
      ]],
      ["Talent Acquisition Leader | Trek Bicycle", "Waterloo, WI | Oct 2021 - Feb 2024", [
        "Led recruiters and coordinators through a documented high-volume growth year.",
        "Built a talent acquisition structure using confirmed competency practices.",
        "Directed the recruiting workstream for a Workday implementation."
      ]],
      ["Recruiting and Retention Battalion Commander | Wisconsin Army National Guard", "", [
        "Led a recruiting operation against documented monthly production targets.",
        "Managed staff activity, resources, and recruiting performance reviews.",
        "Developed leaders and maintained accountable workforce planning practices."
      ]],
      ["Deputy Director of Personnel | Wisconsin Army National Guard", "", [
        "Directed talent management, succession planning, and workforce analytics.",
        "Coordinated personnel planning across documented statewide locations."
      ]]
    ];
    var remainingWords = Math.max(0, extraWords || 0);
    var bulletIndex = 0;
    var lines = [
      "Alex Exact", "Ephraim, WI | alex.exact@example.test | (555) 010-2026", "",
      "SUMMARY", "Planning; Workday HCM; Analytics; Coaching.", "",
      "CORE SKILLS", "Facilitation, Recruiting, Workforce planning, Process improvement, Data analysis", "",
      "PROFESSIONAL EXPERIENCE"
    ];
    roles.forEach(function(role) {
      lines.push(role[0]);
      if (role[1]) lines.push(role[1]);
      role[2].forEach(function(bullet) {
        var add = Math.floor(remainingWords / Math.max(1, 16 - bulletIndex));
        remainingWords -= add;
        bulletIndex += 1;
        lines.push("\u2022 " + bullet + (add ? " " + Array(add + 1).join("coordination ").trim() : ""));
      });
      lines.push("");
    });
    lines.push("CERTIFICATIONS", "SHRM-SCP", "SPHR", "TalentSmart EQ Certified", "Lean Six Sigma Green Belt", "");
    lines.push("EDUCATION", "MBA, Human Resource Management, Synthetic University, 2008", "B.B.A., Business Administration, Synthetic College, 2002", "M.A., Strategic Studies, Synthetic War College", "Doctoral candidate, Applied Leadership, Synthetic University");
    return lines.join("\n");
  }

  function extractedText(bytes) {
    return topsResumeDocxParagraphs(bytes).map(function(paragraph) { return paragraph.text; }).join("\n");
  }

  function tamperStyleSize(bytes, styleId, oldSize, newSize) {
    check(String(oldSize).length === String(newSize).length, "tampered style size must preserve byte length");
    var output = bytes.slice();
    var marker = new TextEncoder().encode('w:styleId="' + styleId + '"');
    var target = new TextEncoder().encode('w:sz w:val="' + oldSize + '"');
    var replacement = new TextEncoder().encode('w:sz w:val="' + newSize + '"');
    function find(sequence, start) {
      for (var i = start || 0; i <= output.length - sequence.length; i += 1) {
        var match = true;
        for (var j = 0; j < sequence.length; j += 1) if (output[i + j] !== sequence[j]) { match = false; break; }
        if (match) return i;
      }
      return -1;
    }
    var markerIndex = find(marker, 0);
    check(markerIndex >= 0, "target style exists for unreadable-compression control");
    var targetIndex = find(target, markerIndex + marker.length);
    check(targetIndex >= 0, "target style size exists for unreadable-compression control");
    output.set(replacement, targetIndex);
    return output;
  }

  var api = window.__TOPS_RESUME_DOCX;
  var fileName = "Resume_Draft.docx";
  var baseText = liveFixture(0);
  var baseBytes = api.build(baseText);
  var basePrepared = api.prepare(baseText, fileName, api.mime);
  check(basePrepared.ok, "RDM-179 live-shaped six-role artifact downloads");
  check(baseBytes[0] === 0x50 && baseBytes[1] === 0x4B, "RDM-179 artifact has a genuine ZIP/DOCX signature");
  check((baseText.match(/^\u2022 /gm) || []).length === 16, "RDM-179 fixture contains 16 bullets");
  check(topsResumeDocxParagraphs(baseBytes).filter(function(paragraph) { return paragraph.styleId === "ResumeRole"; }).length === 6, "RDM-179 all six pipe headers use ResumeRole");
  check(extractedText(basePrepared.bytes) === baseText, "RDM-179 released DOCX preserves exact content and order");

  var grammarText = [
    "Alex Exact", "alex.exact@example.test", "", "PROFESSIONAL EXPERIENCE",
    "Pipe Title | Pipe Employer", "Madison, WI | 2024 - Present", "\u2022 Pipe duty.", "",
    "Hyphen Title - Hyphen Employer", "2023", "\u2022 Hyphen duty.", "",
    "Em Title \u2014 Em Employer", "Remote", "\u2022 Em duty."
  ].join("\n");
  var grammarParagraphs = topsResumeDocxParagraphs(api.build(grammarText));
  ["Pipe Title | Pipe Employer", "Hyphen Title - Hyphen Employer", "Em Title \u2014 Em Employer"].forEach(function(line) {
    check(grammarParagraphs.find(function(paragraph) { return paragraph.text === line; }).styleId === "ResumeRole", "RDM-180 role grammar classifies " + line);
  });
  ["Madison, WI | 2024 - Present", "2023", "Remote"].forEach(function(line) {
    check(grammarParagraphs.find(function(paragraph) { return paragraph.text === line; }).styleId === "ResumeMetadata", "RDM-180 metadata remains metadata: " + line);
  });
  check(extractedText(api.build(grammarText)) === grammarText, "RDM-180 role grammar preserves every input byte");

  var baseRender = api.renderCheck(baseBytes);
  check(baseRender.ok && baseRender.pageCount <= 2 && baseRender.pageUsed.every(function(value) { return value > 0; }), "RDM-181 layout-capable browser executed the render gate");

  var legitimateSparse = null;
  for (var bodyCount = 35; bodyCount <= 90 && !legitimateSparse; bodyCount += 1) {
    var compactLines = ["Alex Exact", "alex.exact@example.test", "", "SUMMARY"];
    for (var bodyLine = 0; bodyLine < bodyCount; bodyLine += 1) compactLines.push("Supported compact body line " + bodyLine + ".");
    var compactText = compactLines.join("\n");
    var compactRender = api.renderCheck(api.build(compactText));
    if (compactRender.ok && compactRender.pageCount === 2 && compactRender.sparseTrailingPage) {
      var compactPrepared = api.prepare(compactText, fileName, api.mime);
      if (compactPrepared.ok && compactPrepared.balanceDisposition === "sparse_tail_not_proven_avoidable") legitimateSparse = { text: compactText, prepared: compactPrepared };
    }
  }
  check(legitimateSparse, "RDM-182A a legitimate sparse tail is not rejected without a safe alternative");
  check(extractedText(legitimateSparse.prepared.bytes) === legitimateSparse.text, "RDM-182A accepted compact artifact remains content-exact");

  var avoidableSparse = null;
  for (var extraWords = 0; extraWords <= 500 && !avoidableSparse; extraWords += 1) {
    var candidateText = liveFixture(extraWords);
    var candidateInitial = api.renderCheck(api.build(candidateText));
    if (candidateInitial.ok && candidateInitial.pageCount === 2 && candidateInitial.sparseTrailingPage) {
      var candidatePrepared = api.prepare(candidateText, fileName, api.mime);
      if (candidatePrepared.ok && candidatePrepared.balanceDisposition === "rebalanced") avoidableSparse = { text: candidateText, initial: candidateInitial, prepared: candidatePrepared };
    }
  }
  check(avoidableSparse, "RDM-182B an avoidable sparse tail has a safe balanced alternative");
  check(avoidableSparse.prepared.renderCheck.minimumPageUseRatio >= 0.25, "RDM-182B both balanced pages have substantive occupancy");
  check(avoidableSparse.prepared.renderCheck.pageBalanceSpread < avoidableSparse.initial.pageBalanceSpread, "RDM-182B automatic break improves page balance");
  check(avoidableSparse.prepared.renderCheck.orphan === false, "RDM-183 heading-role-metadata-first-bullet chains remain transitive");
  check(extractedText(avoidableSparse.prepared.bytes) === avoidableSparse.text, "RDM-184 balancing preserves exact content and order");
  check(api.validate(avoidableSparse.prepared.bytes, avoidableSparse.text, fileName, api.mime, avoidableSparse.prepared.options).ok, "RDM-184 final balanced DOCX revalidates byte-exact");

  var clippingText = ["Alex Exact", "alex.exact@example.test", "", "SUMMARY", Array(1200).join("X")].join("\n");
  var clippingRender = api.renderCheck(api.build(clippingText));
  check(!clippingRender.ok && clippingRender.overflow, "RDM-185 clipping remains blocked");

  var hiddenStyle = document.createElement("style");
  hiddenStyle.textContent = 'div[aria-hidden="true"] > div { display:none !important; }';
  document.head.appendChild(hiddenStyle);
  var hiddenRender = api.renderCheck(baseBytes);
  hiddenStyle.remove();
  check(!hiddenRender.ok && hiddenRender.hiddenText, "RDM-185 hidden text remains blocked");

  var overlapStyle = document.createElement("style");
  overlapStyle.textContent = 'div[aria-hidden="true"] > div { position:absolute !important; top:0 !important; }';
  document.head.appendChild(overlapStyle);
  var overlapRender = api.renderCheck(baseBytes);
  overlapStyle.remove();
  check(!overlapRender.ok && overlapRender.overlap, "RDM-185 overlapping text remains blocked");

  var longLines = ["Alex Exact", "alex.exact@example.test", "", "SUMMARY"];
  for (var longIndex = 0; longIndex < 220; longIndex += 1) longLines.push("Supported overflow control line " + longIndex + ".");
  var longRender = api.renderCheck(api.build(longLines.join("\n")));
  check(!longRender.ok && longRender.tooManyPages && longRender.pageCount > 2, "RDM-185 artifacts over two pages remain blocked");

  var orphanText = ["Alex Exact", "alex.exact@example.test", "", "PROFESSIONAL EXPERIENCE", "Orphan Title | Orphan Employer", "2024", "\u2022 Supported duty."].join("\n");
  var orphanIndex = orphanText.split("\n").indexOf("Orphan Title | Orphan Employer");
  var orphanRender = api.renderCheck(api.build(orphanText, { pageBreakBeforeParagraph: orphanIndex }));
  check(!orphanRender.ok && orphanRender.orphan, "RDM-185 orphaned role headers remain blocked");

  var compressedRender = api.renderCheck(tamperStyleSize(baseBytes, "ResumeBody", "19", "12"));
  check(!compressedRender.ok && compressedRender.unreadableCompression, "RDM-185 unreadable compression remains blocked");

  check(api.mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "RDM-186 DOCX MIME remains exact");
  return "PASS: RDM-179..RDM-186 actual browser layout; live-shaped DOCX, role grammar, evidence-based sparse-tail handling, safe balancing, transitive keeps, exact content, and negative gates verified";
}

function buildHarness(docxBlock) {
  return "<!doctype html><html><head><meta charset=\"utf-8\"><title>Transition OPS DOCX render regression</title></head><body><pre id=\"result\">RUNNING</pre><script>" + docxBlock + "</script><script>(function(){try{var message=(" + browserRegressionBody.toString() + ")();document.documentElement.setAttribute('data-rdm-result','PASS');document.getElementById('result').textContent=message;}catch(error){document.documentElement.setAttribute('data-rdm-result','FAIL');document.getElementById('result').textContent='FAIL: '+String(error&&error.stack||error);}})();</script></body></html>";
}

async function runRenderRegression() {
  const browser = findLayoutBrowser();
  if (!browser) {
    throw new Error("RDM-181 requires an executable Chrome or Edge browser; set TOPS_CHROME_BIN to its path.");
  }

  const uiSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const blockMatch = uiSource.match(/\/\/ RESUME_DOCX_START\n([\s\S]*?)\n\/\/ RESUME_DOCX_END/);
  assert.ok(blockMatch, "index.html contains one isolated resume DOCX implementation block");
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tops-resume-docx-"));
  const harnessPath = path.join(scratch, "render-regression.html");
  const profilePath = path.join(scratch, "chrome-profile");
  try {
    fs.writeFileSync(harnessPath, buildHarness(blockMatch[1]), "utf8");
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
    return { skipped: false, browser, message };
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

if (require.main === module) {
  runRenderRegression().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { findLayoutBrowser, runRenderRegression };
