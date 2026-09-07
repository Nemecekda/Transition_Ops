const fs = require('node:fs');
const cp = require('node:child_process');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const base = cp.execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
assert.equal(base, '9f3903467d3407b8b31f4185f18430a9f30773d2');
const old = cp.execFileSync('git', ['show', base + ':netlify/functions/resume.mjs'], {encoding:'utf8'});
const current = fs.readFileSync('netlify/functions/resume.mjs','utf8');
const pattern = /^  function semanticTerms\(text\) \{[\s\S]*?^  \}\n/gm;
const oldFn = [...old.matchAll(pattern)], newFn = [...current.matchAll(pattern)];
assert.equal(oldFn.length, 1); assert.equal(newFn.length, 1);
assert.equal(old.replace(oldFn[0][0], newFn[0][0]), current);
const addition = '.flatMap(function (term) {\n      const parts = term.split("-");\n      return parts.length > 1 && parts.every(function (part) { return part.length >= 3; }) ? parts : [term];\n    })';
assert.equal(newFn[0][0].replace(addition,''),oldFn[0][0]);
function api(source) {
  const start = source.indexOf('  function semanticTerms(text) {');
  const end = source.indexOf('  function validateAudit(',start);
  assert.ok(start >= 0 && end > start);
  return vm.runInNewContext(source.slice(start,end) + '\n({semanticTerms,hasPostingOnlySemanticCure})');
}
const before = api(old), after = api(current);
for(const phrase of ['equipment records','work orders','Workday','project scheduling','recordkeeping','un-paid work','de-icing','X-ray','e-mail','re-signing','re-cover','go-live','IT-support','end-to-end','word--word','trailing-']) {
  assert.equal(JSON.stringify(before.semanticTerms(phrase)),JSON.stringify(after.semanticTerms(phrase)),phrase);
}
for(const transform of ['exact','reordered','format_only']) {
  for(const [claim,fact] of [['Performed un-paid work.','Performed paid work.'],['Performed de-icing.','Performed icing.']]) {
    assert.equal(before.hasPostingOnlySemanticCure(claim,[fact],[claim],transform),true);
    assert.equal(after.hasPostingOnlySemanticCure(claim,[fact],[claim],transform),true);
  }
}
assert.equal(before.hasPostingOnlySemanticCure('Tracked work-orders.',['Tracked work orders.'],['work-orders'],'format_only'),true);
assert.equal(after.hasPostingOnlySemanticCure('Tracked work-orders.',['Tracked work orders.'],['work-orders'],'format_only'),false);
console.log('PASS actual parent/current functions: hyphen false positive removed; short-prefix withholding and 16 nonaffected term sets preserved');
console.log('PASS full runtime byte comparison: only selective hyphen splitting added to semanticTerms; stopwords, stemming, filters, predicates, prompts and call graph unchanged');
for (const file of ['index.html','netlify/functions/navigator.mjs','netlify/functions/_shared/openai-client.cjs','netlify/functions/_shared/openai-budget.cjs','package.json','package-lock.json','netlify.toml','pwa-sw.js','sw.js','scripts/resume-docx-render-regression.js']) {
  const bytes = fs.readFileSync(file);
  assert.ok(bytes.equals(cp.execFileSync('git',['show',base+':'+file])));
  console.log('UNCHANGED '+file+' sha256='+crypto.createHash('sha256').update(bytes).digest('hex'));
}
console.log('PASS no candidate rewriting, identity normalization, extra call/retry, storage/logging, dependency or cache change; active cache v152');
