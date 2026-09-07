const fs = require('node:fs');
const vm = require('node:vm');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const diagnostic = fs.readFileSync('scratchpad/federal-hosted-1b6b586/hosted-1b6b586-diagnostic.cjs', 'utf8');
const fixtureSource = diagnostic.match(/^const factSheet = (.+);$/m)[1];
const facts = vm.runInNewContext(fixtureSource);
const parent = cp.execFileSync('git', ['show', '5ee0047:netlify/functions/resume.mjs'], { encoding: 'utf8' });
const current = fs.readFileSync('netlify/functions/resume.mjs', 'utf8');
function inspect(source) {
  const names = ['roleDutyAtomRecords', 'globalExactItemRecords', 'hasExactBoundaryOccurrence', 'exactQuantityTokens', 'factCatalog', 'draftEligibleFacts'];
  const functions = names.map(name => {
    const matches = Array.from(source.matchAll(new RegExp('^  function ' + name + '\\([^\\n]*\\) \\{[\\s\\S]*?^  \\}', 'gm')));
    assert.equal(matches.length, 1);
    return matches[0][0];
  }).join('\n');
  const specs = source.match(/  const GLOBAL_EXACT_ITEM_SPECS = \[[\s\S]*?\n  \];/g);
  assert.equal(specs.length, 1);
  const context = {};
  vm.runInNewContext(specs[0] + '\n' + functions, context);
  const catalog = context.factCatalog(facts);
  return {
    unassigned: JSON.parse(JSON.stringify(catalog.find(fact => fact.text === '26 years of service'))),
    owned: JSON.parse(JSON.stringify(catalog.find(fact => fact.text === '12 teams'))),
    eligibleUnassigned: ['standard', 'federal'].map(mode => context.draftEligibleFacts(catalog, mode).some(fact => fact.text === '26 years of service'))
  };
}
const before = inspect(parent), after = inspect(current);
assert.deepEqual(before.eligibleUnassigned, [true, true]);
assert.deepEqual(after.eligibleUnassigned, [false, false]);
assert.equal(before.unassigned.unlinked_number, false);
assert.equal(after.unassigned.unlinked_number, true);
assert.equal(before.owned.owner, 'global');
assert.equal(after.owned.owner, 'R1');
assert.equal(after.owned.unlinked_number, false);
console.log(JSON.stringify({ before, after }, null, 2));
console.log('PASS actual parent/current function comparison: unassigned eligible 1 -> 0 in both modes; exact role-owned quantity global -> R1; zero provider calls');
