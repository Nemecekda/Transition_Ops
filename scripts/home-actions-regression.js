"use strict";

// Execute the actual Home selection/rendering with synthetic reminder state.
// This exercises route selection without an AI call or a browser dependency.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const source = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const palette = {};
const themeStart = source.indexOf("const THEMES = {");
vm.runInNewContext(source.slice(themeStart, source.indexOf("\n};", themeStart) + 3) + "\nthis.themes = THEMES;", palette);
const selection = source.match(/var urgentReminders = [^\n]+;/)[0];
const renderStart = source.indexOf("      (urgentReminders.length > 0 || extraFollowups.length > 0) && React.createElement(\"section\", { className: \"tops-home-actions\"");
assert.ok(renderStart > 0);
const renderEnd = source.indexOf("      // ═══ v49 INSTRUMENT", renderStart);
const render = source.slice(renderStart, renderEnd);
const reminders = [
  { id: "early", mo: 12, pri: "CRITICAL", title: "Too early" },
  { id: "first", mo: 6, pri: "CRITICAL", cat: "HEALTH", title: "First action", brief: "Only if eligible.", deadline: "Confirm the actual date." },
  { id: "second", mo: 5, pri: "CRITICAL", cat: "BENEFITS", title: "Second action", brief: "Service approval required.", deadline: "Before leaving eligible service." },
  { id: "third", mo: 4, pri: "HIGH", cat: "CAREER", title: "Third action", brief: "Check your own status." },
  { id: "fourth", mo: 7, pri: "MEDIUM", title: "Fourth action" },
  { id: "expired", mo: 1, pri: "CRITICAL", title: "Outside relevance window" }
];
function run(months, dismissed, data = reminders) {
  const calls = [];
  const sandbox = {
    extraFollowups: [], followProgress: {}, topsFollowLabel: () => "", etsMonths: months, dismissedReminders: dismissed, SMART_REMINDERS: data, C: palette.themes.tactical,
    React: { createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }) },
    openPlanRoute: (...args) => calls.push(args)
  };
  vm.runInNewContext(selection + '\nthis.tree = React.createElement("div", null,\n' + render + 'null);', sandbox);
  function all(node) { return !node || typeof node !== "object" ? [] : [node, ...node.children.flatMap(all)]; }
  return { calls, nodes: all(sandbox.tree) };
}
const normal = run(5, {});
const buttons = normal.nodes.filter(n => n.type === "button");
assert.equal(buttons.length, 3);
assert.equal(buttons[0].props.id, "tops-home-next-action");
buttons.forEach(button => button.props.onClick());
assert.deepEqual(normal.calls, [
  ["reminders", "tops-reminder-first", "tops-home-next-action"],
  ["reminders", "tops-reminder-second", "tops-home-secondary-second"],
  ["reminders", "tops-reminder-third", "tops-home-secondary-third"]
]);
for (const text of [reminders[1].deadline, reminders[2].deadline]) {
  assert.ok(normal.nodes.some(n => n.children.includes(text)), "Critical context remains untruncated: " + text);
}
assert.ok(!normal.nodes.some(n => n.children.includes(reminders[1].brief)), "Home does not promote additional brief claims");
const reordered = run(5, {}, [reminders[3], reminders[4], reminders[1], reminders[2]]);
reordered.nodes.find(n => n.type === "button").props.onClick();
assert.equal(reordered.calls[0][1], "tops-reminder-first", "Existing critical priority outranks earlier high/medium items");
const realStart = source.indexOf("const SMART_REMINDERS = [");
const realEnd = source.indexOf("\n];", realStart) + 3;
const real = {};
vm.runInNewContext(source.slice(realStart, realEnd) + "\nthis.reminders = SMART_REMINDERS;", real);
const t140 = run(140 / 30.44, {}, real.reminders);
t140.nodes.find(n => n.type === "button").props.onClick();
assert.ok(/bdd/.test(t140.calls[0][1]), "T-140 prioritizes the existing BDD critical reminder");
assert.equal(run(null, {}).nodes.filter(n => n.type === "button").length, 0);
const dismissed = run(5, { first: true });
dismissed.nodes.find(n => n.type === "button").props.onClick();
assert.equal(dismissed.calls[0][1], "tops-reminder-second");
assert.equal(run(5, {}, [reminders[1]]).nodes.filter(n => n.type === "button").length, 1);
assert.equal(run(5, {}, [reminders[1], reminders[1], reminders[2]]).nodes.filter(n => n.type === "button").length, 2);
assert.equal(run(5, {}, [reminders[1], reminders[2], reminders[2]]).nodes.filter(n => n.type === "button").length, 2);
assert.ok(source.indexOf('id: "tops-home-actions-title"') < source.indexOf('// ═══ v49 INSTRUMENT'));
assert.ok(source.includes('React.createElement("strong", null, "Next step"), w.actionSteps[0]'));
assert.ok(source.includes('React.createElement("strong", null, "Timing"), w.shortDesc'));
assert.ok(source.includes('"aria-controls":"tops-window-detail-" + w.id'));
assert.ok(source.includes('id:"tops-window-detail-" + w.id, hidden:!isExpanded'));
console.log("HOME ACTIONS PASS: existing priorities, stable ties, T-140 BDD, date exclusions, full deadlines, primary and secondary routes, no date, dismissal, fewer items, duplicate exclusion, TRICARE disclosure wiring");
