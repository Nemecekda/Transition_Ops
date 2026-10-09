"use strict";

// Execute the actual checklist renderer with synthetic answers, without providers.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(require("node:path").join(__dirname, "..", "index.html"), "utf8");
const catsStart = source.indexOf("const READINESS_CATS = [");
const catsEnd = source.indexOf("\n];", catsStart) + 3;
const start = source.indexOf('    var totalQ = READINESS_CATS.reduce', source.indexOf('activeTab === "readiness" &&'));
const end = source.indexOf('\n  })()),', start);
assert.ok(catsStart > 0 && catsEnd > catsStart && start > 0 && end > start);
const render = source.slice(start, end);
assert.doesNotMatch(render, /calcReadiness|calcCatScore|getScoreLabel|CRITICAL|HIGH IMPACT|significant gaps|saves thousands/);
function run(answers = {}, open = null) {
  const context = {
    READINESS_TOOLS: {}, openReadinessTool: () => {}, C: {}, readinessAnswers: { ...answers }, readinessCatOpen: open,
    React: { createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }) },
    setReadinessAnswers: change => { context.readinessAnswers = change(context.readinessAnswers); },
    setReadinessCatOpen: id => { context.readinessCatOpen = id; },
    requestAnimationFrame: fn => fn(),
    document: { getElementById: id => ({ focus: () => { context.focused = id; } }) },
    topsKeyboardActivate: event => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }
  };
  vm.runInNewContext(source.slice(catsStart, catsEnd) + '\nthis.cats = READINESS_CATS;\nthis.tree = (function(){\n' + render + '\n})();', context);
  function walk(node) { return !node || typeof node !== "object" ? [] : [node, ...node.children.flatMap(walk)]; }
  function text(node) { return typeof node === "string" || typeof node === "number" ? String(node) : node && node.children ? node.children.map(text).join(" ") : ""; }
  return { context, nodes: walk(context.tree), text: text(context.tree) };
}
const fresh = run();
const questions = fresh.context.cats.flatMap(cat => cat.qs);
assert.equal(questions.length, 34);
assert.match(fresh.text, /No items confirmed yet/);
assert.match(fresh.text, /34 items remain unconfirmed/);
assert.match(fresh.text, /does not mean you are unprepared or ineligible/);
const next = fresh.nodes.find(node => node.type === "button" && !node.props.id);
assert.ok(next);
next.props.onClick();
assert.equal(fresh.context.readinessCatOpen, fresh.context.cats[0].id);
assert.equal(fresh.context.focused, "tops-readiness-category-" + fresh.context.cats[0].id);
const partial = run({ [questions[0].id]: true, [questions[1].id]: false, unknown: true });
assert.match(partial.text, /1 of 34 items confirmed/);
assert.match(partial.text, /33 items remain unconfirmed/);
assert.equal(partial.nodes.filter(node => node.props.role === "checkbox").length, 34);
const check = partial.nodes.find(node => node.props.role === "checkbox");
assert.equal(check.props["aria-checked"], true);
check.props.onClick();
assert.equal(partial.context.readinessAnswers[questions[0].id], false);
assert.equal(partial.context.readinessAnswers.unknown, true);
const completed = run(Object.fromEntries(questions.map(q => [q.id, true])));
assert.match(completed.text, /34 of 34 items confirmed/);
assert.match(completed.text, /does not verify eligibility or guarantee an outcome/);
assert.equal(completed.nodes.filter(node => node.type === "button" && !node.props.id).length, 0);
for (const state of [fresh, partial, completed]) {
  for (const button of state.nodes.filter(node => node.props["aria-controls"])) {
    const panel = state.nodes.find(node => node.props.id === button.props["aria-controls"]);
    assert.ok(panel);
    assert.equal(panel.props.hidden, !button.props["aria-expanded"]);
    assert.equal(button.type, "button");
    assert.ok(button.props.style.minHeight >= 44);
  }
  for (const q of questions) assert.ok(state.text.includes(q.t), q.id + " unchanged question present");
}
const recovered = run(JSON.parse(JSON.stringify({ [questions[3].id]: true })));
assert.match(recovered.text, /1 of 34 items confirmed/);
console.log("PASS readiness checklist: fresh, partial, complete, recovery, known-ID counts, preserved questions, focus and control wiring");
