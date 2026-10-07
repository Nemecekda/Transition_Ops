"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const cp = require("node:child_process");
const source = fs.readFileSync(require("node:path").join(__dirname, "../index.html"), "utf8");
const code = source.slice(source.indexOf("function topsCalendarText("), source.indexOf("function TIcon("));
const api = vm.runInNewContext(code + ";({build:topsDeadlineICS,text:topsCalendarText,fold:topsCalendarFold,download:downloadDeadlineICS})", { Blob });
const stamp = new Date("2026-10-04T12:34:56Z");
const offsets = [-365,-180,-90,-30,0,90,120,180,200,240,180,420];
for (const date of ["2026-10-04", "2028-02-29", "2027-12-31", "2026-03-08", "2026-11-01"]) {
  const ics = api.build(date, stamp);
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  assert.doesNotMatch(ics.replace(/\r\n/g, ""), /[\r\n]/);
  for (const line of ics.split("\r\n")) assert.ok(Buffer.byteLength(line, "utf8") <= 75);
  const unfolded = ics.replace(/\r\n[ \t]/g, "");
  const events = unfolded.split("BEGIN:VEVENT\r\n").slice(1);
  assert.equal(events.length, 12);
  assert.equal(new Set([...unfolded.matchAll(/^UID:(.*)$/gm)].map(m=>m[1])).size, 12);
  events.forEach((event, i) => {
    const expected = new Date(date + "T00:00:00Z"); expected.setUTCDate(expected.getUTCDate() + offsets[i]);
    assert.ok(event.includes("DTSTART;VALUE=DATE:" + expected.toISOString().slice(0,10).replace(/-/g,"")));
    assert.ok(event.includes("UID:tops-" + date + "-" + i + "@transitionops.org"), "Existing event identifiers must remain stable");
    assert.equal((event.match(/BEGIN:VALARM/g)||[]).length, 2);
    assert.equal((event.match(/ACTION:DISPLAY/g)||[]).length, 2);
    assert.ok(event.includes("TRIGGER:-P7D\r\n")); assert.ok(event.includes("TRIGGER:-P1D\r\n"));
    assert.ok(event.indexOf("END:VALARM") < event.indexOf("END:VEVENT"));
  });
}
for (const bad of [null, "", "2026-02-30", "2026-13-01", "2026-1-01", "not-a-date", "2026-10-04\r\nBEGIN:VEVENT"]) assert.equal(api.build(bad,stamp), null);
assert.equal(api.text("comma,semi;slash\\\r\nline"), "comma\\,semi\\;slash\\\\\\nline");
const unicode = "DESCRIPTION:" + "a".repeat(60) + "🧭é漢字".repeat(20);
const folded = api.fold(unicode);
assert.equal(folded.replace(/\r\n /g,""), unicode);
for (const line of folded.split("\r\n")) assert.ok(Buffer.byteLength(line) <= 75);
const reference = api.build("2026-10-04", stamp);
const reminders = source.slice(source.indexOf("const SMART_REMINDERS ="), source.indexOf("var RUNG_LEDGER_KEY ="));
let days = -150;
const ladder = vm.runInNewContext(reminders + ';({dental:SMART_REMINDERS.find(r=>r.id==="r-p5-dental"),due:dueRungs})', {daysToETSDate:()=>days,moToETS:()=>Math.round(days/30.44)});
assert.match(ladder.dental.brief,/does not establish coverage/);
for (const [day,expected] of [[-149,false],[-150,true],[-164,true],[-165,false],[-181,false]]) {
  days=day;assert.equal(ladder.due("synthetic",{}).some(r=>r.id==="r-p5-dental"),expected);
}
days=-150;assert.equal(ladder.due("synthetic",{"r-p5-dental":true}).some(r=>r.id==="r-p5-dental"),false);
const dentalEvent = reference.replace(/\r\n /g, "").split("BEGIN:VEVENT").find(event=>event.includes("VA Class II dental:"));
assert.match(dentalEvent,/DTSTART;VALUE=DATE:20270402/);
assert.match(dentalEvent,/90 days of active duty/);
assert.match(dentalEvent,/does not establish coverage/);
const vgliReview = reference.replace(/\r\n /g, "").split("BEGIN:VEVENT").find(event=>event.includes("VGLI: confirm application deadline"));
assert.match(vgliReview,/DTSTART;VALUE=DATE:20271128/);
assert.match(vgliReview,/one year and 120 days/);
assert.match(vgliReview,/not the application deadline or proof of coverage/);
assert.match(vgliReview,/Guard and Reserve members should confirm/);
assert.match(vgliReview,/800-419-1473/);
assert.doesNotMatch(vgliReview,/485|486|permanently ineligible/i);
for (const zone of ["Pacific/Kiritimati", "Pacific/Pago_Pago", "America/Chicago", "UTC"]) {
  const result = cp.execFileSync(process.execPath, ["-e", code + ';process.stdout.write(topsDeadlineICS("2026-10-04",new Date("2026-10-04T12:34:56Z")))'], { env: {...process.env,TZ:zone}, encoding:"utf8" });
  assert.equal(result, reference, zone + " preserves calendar dates");
}
let blob, clicks=0, tracks=0;
const sandbox = {Blob, URL:{createObjectURL(value){blob=value;return "blob:synthetic";},revokeObjectURL(){}}, document:{createElement(){return {click(){clicks++;}};},body:{appendChild(){},removeChild(){}}},setTimeout(){}};
vm.runInNewContext(code,sandbox);
assert.equal(sandbox.downloadDeadlineICS("2026-10-04",()=>tracks++),true);
assert.equal(clicks,1);assert.equal(tracks,1);assert.equal(blob.type,"text/calendar;charset=utf-8");
assert.equal(sandbox.downloadDeadlineICS("bad",()=>tracks++),false);assert.equal(clicks,1);assert.equal(tracks,1);
console.log("CALENDAR EXPORT PASS: 12 events / 24 alarms; stable UIDs, qualified VGLI planning check, CRLF, UTF-8 folding, escaping, leap/DST dates, four timezones, invalid-input rejection and download path. Client import and notification delivery remain untested.");
