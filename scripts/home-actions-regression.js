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
const timing = source.slice(source.indexOf("var RUNG_DAY_TRIGGERS ="), source.indexOf("var __rungFiredThisOpen ="));
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
function run(months, dismissed, data = reminders, days = months === null ? null : Math.round(months * 30.44)) {
  const calls = [];
  const sandbox = {
    separationDate: months === null ? "" : "synthetic",
    daysToETSDate: () => days, moToETS: () => months,
    extraFollowups: [], followProgress: {}, topsFollowLabel: () => "", etsMonths: months, dismissedReminders: dismissed, SMART_REMINDERS: data, C: palette.themes.tactical,
    React: { createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }) },
    openPlanRoute: (...args) => calls.push(args)
  };
  vm.runInNewContext(timing + selection + '\nthis.tree = React.createElement("div", null,\n' + render + 'null);', sandbox);
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
for (const [id, cases] of [
  ["r-6-bdd2", [[181, false], [180, true], [140, true], [90, true], [89, false], [30, false]]],
  ["r-p5-dental", [[-149, false], [-150, true], [-164, true], [-165, false], [-180, false]]],
  ["r-1-fedvip", [[32, false], [31, true], [17, true], [16, false]]],
  ["r-p1-fedvip", [[-29, false], [-30, true], [-44, true], [-45, false]]],
  ["r-0-ets", [[1, false], [0, true], [-1, false], [-14, false]]]
]) {
  const record = real.reminders.find(r => r.id === id);
  for (const [days, expected] of cases) {
    const result = run(Math.round(days / 30.44), {}, [record], days);
    assert.equal(result.nodes.some(n => n.type === "button"), expected, id + " days=" + days);
    const context = { SMART_REMINDERS: [record], separationDate: "synthetic",
      etsMonths: Math.round(days / 30.44), daysToETSDate: () => days,
      moToETS: () => Math.round(days / 30.44), dismissedReminders: {},
      reminderTimedOnly: false, r: { id: "another-task" } };
    const banner = source.match(/var urgentR = [^\n]+;/)[0];
    const next = source.match(/var nextReminder = [^\n]+;/)[0];
    vm.runInNewContext(timing + banner + next + '\nthis.due = dueRungs(separationDate, {});', context);
    assert.equal(!!context.nextReminder, expected, "Next action " + id + " days=" + days);
    assert.equal(context.urgentR.length > 0, expected && record.pri === "CRITICAL", "Banner " + id + " days=" + days);
    assert.equal(context.due.length > 0, expected, "Timed list " + id + " days=" + days);
    const note = context.reminderTimingContext(record, "synthetic");
    assert.equal(note === "", expected, "Timing context " + id + " days=" + days);
    if (!expected) {
      assert.match(note, /not a current alert or an eligibility decision/);
      assert.match(note, days > (id === "r-6-bdd2" ? 180 : context.rungTriggerDay(record)) ? /scheduled for later/ : /scheduled period has passed/);
    }
  }
}
assert.equal(run(0, {}, real.reminders, NaN).nodes.filter(n => n.type === "button").length, 0);
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
