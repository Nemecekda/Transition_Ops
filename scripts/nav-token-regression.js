#!/usr/bin/env node
// NAVIGATOR CITATION-TOKEN REGRESSION
//
// Ordered by the Commander, 5 AUG 2026. Guards the principle behind session 3.5:
// we never send a user looking for something we can link them to.
//
// WHY IT READS THE SHIPPED FILES INSTEAD OF RESTATING THEM. A harness that
// retypes the regex or the token list tests the harness, not the app. Both
// regexes, the MAP, and the manifest's live-token list are extracted from
// index.html and netlify/functions/navigator.js as they actually ship. So this
// cannot pass against a fix that was never applied, and it fails the moment
// either file drifts from the other.
//
// It exists because the first drift check compared token LISTS and never
// exercised the regexes — which is exactly how [DD214] stayed broken: the token
// was present in every list and still failed the pattern on its digits, the
// same defect family as V-19 in sw.js.
//
// Run:  node scripts/nav-token-regression.js
// Exit: 0 all assertions pass · 1 any failure

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const NAV = path.join(ROOT, "netlify", "functions", "navigator.js");

let failures = 0;
const fail = (msg) => { failures++; console.log("  FAIL  " + msg); };
const pass = (msg) => console.log("  PASS  " + msg);

const indexSrc = fs.readFileSync(INDEX, "utf8");
const navSrc = fs.readFileSync(NAV, "utf8");

// ---------------------------------------------------------------- extraction
// The app's real tab whitelist. A citation that lands on a tab not in this list
// falls back to "dashboard", which is a silent wrong answer.
const validTabsM = /var validTabs = \[([^\]]*)\]/.exec(indexSrc);
if (!validTabsM) { console.log("FATAL: validTabs not found in index.html"); process.exit(1); }
const validTabs = validTabsM[1].split(",").map(s => s.trim().replace(/^"|"$/g, "")).filter(Boolean);

// renderNavText's MAP: citation token -> tab id
const mapM = /var MAP = \{([^}]*)\}/.exec(indexSrc);
if (!mapM) { console.log("FATAL: renderNavText MAP not found in index.html"); process.exit(1); }
const mapPairs = [...mapM[1].matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)].map(m => [m[1], m[2]]);

// BOTH regexes, lifted verbatim from the shipped source.
// The bracket-match regex specifically. renderNavText also holds a BOLD matcher
// (/^\*\*([^*]+)\*\*$/) that appears FIRST in the source, so the extraction must
// anchor on the bracket form or it silently tests the wrong pattern — which it
// did on first run, reporting all 16 tokens dead.
const splitM = /text\.split\(\/(.+?)\/\)/.exec(indexSrc);
const matchM = /p\.match\(\/(\^\\\[.+?)\/\)/.exec(indexSrc);
if (!splitM || !matchM) { console.log("FATAL: could not extract split/match regexes from index.html"); process.exit(1); }
const SPLIT = new RegExp(splitM[1]);
const MATCH = new RegExp(matchM[1]);

// The manifest's live-token list, from the line following the LIVE CITATION LINKS header.
const manM = /LIVE CITATION LINKS[^\n]*\n(\[[^\n]*)/.exec(navSrc);
const manifestTokens = manM ? [...manM[1].matchAll(/\[([^\]]+)\]/g)].map(m => m[1]) : [];

console.log("extracted from shipped files:");
console.log("  split regex   /" + splitM[1] + "/");
console.log("  match regex   /" + matchM[1] + "/");
console.log("  MAP tokens    " + mapPairs.length + "  -> " + new Set(mapPairs.map(p => p[1])).size + " distinct tabs");
console.log("  validTabs     " + validTabs.length);
console.log("  manifest      " + manifestTokens.length + " tokens");

// ------------------------------------------------- A. every MAP key survives
// BOTH regexes. This is the assertion the list-only check was missing.
console.log("\nA. every MAP key survives BOTH the split and match regexes");
for (const [token, tab] of mapPairs) {
  const wrapped = "[" + token + "]";
  const survivesSplit = ("see " + wrapped + " here").split(SPLIT).includes(wrapped);
  const m = MATCH.exec(wrapped);
  const survivesMatch = !!m && m[1] === token;
  if (survivesSplit && survivesMatch) pass(wrapped + " -> " + tab);
  else fail(wrapped + "  split:" + (survivesSplit ? "ok" : "DROPPED") +
            "  match:" + (survivesMatch ? "ok" : "NO CAPTURE") +
            "  (renders as dead text)");
}

// ------------------------------------------------- B. every target is a real tab
console.log("\nB. every MAP target is a real tab");
for (const [token, tab] of mapPairs) {
  if (validTabs.includes(tab)) pass(token + " -> " + tab);
  else fail(token + " -> " + tab + "  NOT IN validTabs (would fall back to dashboard)");
}

// ------------------------------------------------- C. every tab is reachable
console.log("\nC. every tab is reachable by some token (the Commander's principle)");
const mapped = new Set(mapPairs.map(p => p[1]));
for (const tab of validTabs) {
  if (mapped.has(tab)) pass(tab);
  else fail(tab + "  has NO citation token — users get sent looking for it");
}

// ------------------------------------------------- D. MAP and MANIFEST agree
console.log("\nD. MAP and MANIFEST token lists agree");
const mapSet = new Set(mapPairs.map(p => p[0]));
const manSet = new Set(manifestTokens);
for (const t of mapSet) if (!manSet.has(t)) fail("[" + t + "] in MAP but NOT in the manifest — the model will never emit it");
for (const t of manSet) if (!mapSet.has(t)) fail("[" + t + "] in the manifest but NOT in MAP — renders as dead text");
if (mapSet.size === manSet.size && [...mapSet].every(t => manSet.has(t))) pass("in sync, " + mapSet.size + " tokens both sides");

// ------------------------------------------------- E. no stale "no live token"
console.log("\nE. manifest carries no stale 'no live token' claims");
const stale = (navSrc.match(/no live token/g) || []).length;
if (stale === 0) pass("none");
else fail(stale + " occurrence(s) of 'no live token' remain — every tab now has one");

console.log("\nRESULT: " + (failures === 0 ? "ALL ASSERTIONS PASS" : failures + " FAILED"));
process.exit(failures ? 1 : 0);
