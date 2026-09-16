"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const source = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const start = source.indexOf("    // Focused Home action:");
const end = source.indexOf('\n    return React.createElement("div", null,', start);
assert.ok(start > 0 && end > start);
const render = source.slice(start, end);
const dataStart = source.indexOf("const SMART_REMINDERS = [");
const ctx = {};
vm.runInNewContext(source.slice(dataStart, source.indexOf("\n];", dataStart) + 3) + "\nthis.data = SMART_REMINDERS;", ctx);
const bdd = ctx.data.find(r => /bdd/i.test(r.id));
assert.ok(bdd);
const state = { focusedReminderId: bdd.id, dismissedReminders: {}, reminderNotice: "", etsMonths: 140 / 30.44 };
const sandbox = Object.assign(state, {
  SMART_REMINDERS: ctx.data, C: {}, continuationFocus: { current: null }, continuationReturn: { current: null },
  React: { createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }) },
  setDismissedReminders: fn => { state.dismissedReminders = fn(state.dismissedReminders); },
  setFocusedReminderId: id => { state.focusedReminderId = id; },
  setReminderNotice: value => { state.reminderNotice = value; },
  setActiveTab: value => { state.activeTab = value; },
  setReminderExpanded: value => { state.reminderExpanded = value; },
  setShowDismissed: value => { state.showDismissed = value; }
});
function nodes(node) { return !node || typeof node !== "object" ? [] : [node, ...node.children.flatMap(nodes)]; }
function view() { return nodes(vm.runInNewContext("(function(){" + render + "})()", sandbox)); }
function button(label) { const found = view().find(n => n.type === "button" && n.children.some(x => typeof x === "string" && x.startsWith(label))); assert.ok(found, label); return found; }
let initial = view();
for (const exact of [bdd.title, bdd.brief, ...bdd.items, bdd.deadline, bdd.why].filter(Boolean)) assert.ok(initial.some(n => n.children.includes(exact)), "exact reminder text retained");
assert.equal(initial.find(n => n.type === "a").props.href, bdd.link);
button("Mark reminder complete").props.onClick();
assert.equal(state.dismissedReminders[bdd.id], true);
assert.equal(state.reminderNotice, "Reminder marked complete.");
assert.equal(state.continuationFocus.current, "tops-focused-undo");
const next = button("Next action:");
button("Undo").props.onClick();
assert.equal(state.dismissedReminders[bdd.id], undefined);
assert.equal(state.continuationFocus.current, "tops-focused-title");
button("Mark reminder complete").props.onClick();
next.props.onClick();
assert.notEqual(state.focusedReminderId, bdd.id);
assert.equal(state.continuationFocus.current, "tops-focused-title");
// Execute the app's actual persistence effect and reload initializer.
let saved;
sandbox.window = { __safeSet: (key, value) => { assert.equal(key, "tops_dismissed_reminders"); saved = value; }, __safeGet: key => { assert.equal(key, "tops_dismissed_reminders"); return saved; } };
sandbox.useEffect = fn => fn();
vm.runInNewContext(source.match(/  useEffect\(function\(\) \{ try \{ window\.__safeSet\("tops_dismissed_reminders"[^\n]+/)[0], sandbox);
sandbox.useState = fn => [fn(), () => {}];
vm.runInNewContext(source.match(/  const \[dismissedReminders, setDismissedReminders\] = useState[^\n]+/)[0].replace("const [dismissedReminders, setDismissedReminders]", "var [reloaded, setter]") + "\nthis.restored = reloaded;", sandbox);
assert.equal(sandbox.restored[bdd.id], true);
state.focusedReminderId = bdd.id;
state.dismissedReminders = Object.fromEntries(ctx.data.map(r => [r.id, true]));
assert.ok(view().some(n => n.children.includes("No remaining reminders currently match your Home action window. You can review all reminders or restore this reminder.")));
assert.ok(!view().some(n => n.type === "button" && n.children.some(x => typeof x === "string" && x.startsWith("Next action:"))));
button("All reminders").props.onClick();
assert.equal(state.focusedReminderId, null);
assert.equal(state.showDismissed, true);
assert.equal(state.continuationFocus.current, "tops-reminder-" + bdd.id);
console.log("FOCUSED ACTION PASS: exact full content/resource; completion; Undo; next eligible; focus intents; existing storage reload; all-done window; completed-list restore access");
