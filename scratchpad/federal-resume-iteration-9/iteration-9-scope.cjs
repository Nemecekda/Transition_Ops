const fs = require('node:fs');
const cp = require('node:child_process');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const base = '964a93e7712e2b89075cbad803fac583503f04de';
assert.equal(cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),base);
const old = cp.execFileSync('git',['show',base+':netlify/functions/resume.mjs'],{encoding:'utf8'});
const current = fs.readFileSync('netlify/functions/resume.mjs','utf8');
const helper = /^  function canonicalExtractedFactHeaders\(facts, source\) \{[\s\S]*?^  \}\n\n/gm;
const matches = [...current.matchAll(helper)];
assert.equal(matches.length,1);
const restored = current.replace(helper,'')
  .replace('const rawText = action === "facts" ? canonicalExtractedFactHeaders(responseText(response), factSourceBlock) : responseText(response);','const rawText = responseText(response);')
  .replace('const repairedText = canonicalExtractedFactHeaders(responseText(repairResponse), factSourceBlock);','const repairedText = responseText(repairResponse);');
assert.equal(restored,old);
function api(source, after) {
  const start=source.indexOf('  function factRoles(facts) {');
  const end=source.indexOf('  function factIssueWarnings(issues) {',start);
  assert.ok(start>=0&&end>start);
  return vm.runInNewContext(source.slice(start,end)+'\n({factSheetIssues'+(after?',canonicalExtractedFactHeaders':'')+'})');
}
const before=api(old,false), after=api(current,true);
const hosted=JSON.parse(fs.readFileSync('scratchpad/federal-hosted-964a93e/facts.json','utf8'));
const expected=hosted.fact_sheet.replace(/^EDUCATION$/m,'EDUCATION (EXACT OR MISSING):').replace(/^CERTIFICATIONS$/m,'CERTIFICATIONS (EXACT OR MISSING):');
assert.equal(JSON.stringify(before.factSheetIssues(hosted.fact_sheet,hosted.source)),JSON.stringify(['invalid duty atom structure','invalid exact item structure']));
assert.equal(after.canonicalExtractedFactHeaders(hosted.fact_sheet,hosted.source),expected);
assert.equal(JSON.stringify(before.factSheetIssues(expected,hosted.source)),'[]');
assert.equal(JSON.stringify(after.factSheetIssues(expected,hosted.source)),'[]');
assert.equal(after.canonicalExtractedFactHeaders(expected,hosted.source),expected);
assert.equal(after.canonicalExtractedFactHeaders('',hosted.source),'');
console.log('PASS actual parent/current replay: observed two structure blockers become zero, with only two standalone header labels changed');
console.log('PASS all role identities, payload bytes, numbers and order preserved; canonical result already passes the unmodified parent parser');
console.log('PASS complete runtime comparison: one helper and two extraction call sites only; all validators, prompts, generation/audit, limits, models, APIs and failure responses unchanged');
for (const file of ['index.html','netlify/functions/navigator.mjs','netlify/functions/_shared/openai-client.cjs','netlify/functions/_shared/openai-budget.cjs','package.json','package-lock.json','netlify.toml','pwa-sw.js','sw.js','scripts/resume-docx-render-regression.js']) {
  const bytes=fs.readFileSync(file);
  assert.ok(bytes.equals(cp.execFileSync('git',['show',base+':'+file])));
  console.log('UNCHANGED '+file+' sha256='+crypto.createHash('sha256').update(bytes).digest('hex'));
}
console.log('PASS no dependency, skill, cache, public wording, notifications or policy change; cache remains v152');
