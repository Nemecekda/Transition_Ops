'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const helpers=app.slice(app.indexOf('function topsCalendarText('),app.indexOf('function topsDeadlineICS('))+app.slice(app.indexOf('function topsFollowDate('),app.indexOf('function topsFollowRead('))+app.slice(app.indexOf('function topsPersonalStepICS('),app.indexOf('function downloadDeadlineICS('));
const build=new Function(helpers+'; return topsPersonalStepICS;')();
const uid='0123456789abcdef0123456789abcdef',now=new Date('2026-10-09T12:34:56Z');
const text='SYNTHETIC café 😀, plan; call\\office\r\nBEGIN:VEVENT\nATTENDEE:mailto:private@example.invalid';
for(const tz of ['America/Chicago','Pacific/Honolulu','Europe/Berlin']){process.env.TZ=tz;for(const date of ['2028-02-29','2027-03-14','2027-11-07','2027-01-31','2027-12-31']){const ics=build(text,date,uid,now);assert.ok(ics.endsWith('\r\n'));assert.ok(!/(?<!\r)\n/.test(ics));for(const line of ics.split('\r\n'))assert.ok(Buffer.byteLength(line,'utf8')<=75);const unfolded=ics.replace(/\r\n /g,'');assert.equal(unfolded.split('\r\n').filter(x=>x==='BEGIN:VEVENT').length,1);assert.equal(unfolded.split('\r\n').filter(x=>x==='BEGIN:VALARM').length,2);assert.ok(unfolded.includes('DTSTART;VALUE=DATE:'+date.replaceAll('-','')));assert.ok(unfolded.includes('TRIGGER:-P7D\r\n'));assert.ok(unfolded.includes('TRIGGER:-P1D\r\n'));assert.ok(unfolded.includes('SUMMARY:SYNTHETIC café 😀\\, plan\\; call\\\\office\\nBEGIN:VEVENT\\nATTENDEE:mailto:private@example.invalid'));assert.ok(unfolded.includes('UID:'+uid+'@transitionops.org'));assert.ok(!unfolded.split('\r\n').some(x=>x.startsWith('ATTENDEE:')));}}
for(const date of ['',null,'2027-02-29','2028-02-30','2027-13-01','2027-01-01T12:00:00Z'])assert.equal(build('Step',date,uid,now),null);
for(const bad of ['', 'x'.repeat(241),null])assert.equal(build(bad,'2027-01-01',uid,now),null);
assert.equal(build('Step','2027-01-01',uid+'\r\nEND:VEVENT',now),null);assert.equal(build('Step','2027-01-01',uid,new Date(NaN)),null);
console.log('PERSONAL ICS PASS: single bounded event, two requested alarms, CRLF/UTF8 folding, escaped injection, exact all-day dates across DST/leap/year boundaries, invalid input rejection.');
