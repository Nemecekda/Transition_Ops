# Build loop - 2026-11-15

## Intent and authority
Dean's order in chat on 15 November 2026, 07:31 Central: "your job is to create a loop and continuously build this app to beat anything on the market today and leave it for free, no cost to veterans and still helps me find veterans for roles as well. that is the key for my VBS side of the business to find qualified folks moving back to Wisconsin first, then all the rest of the states as well."

The order covers continuous staged builds. It changes none of the standing gates:
- Nothing merges to `main` without Dean's order for that pull request.
- No benefits, policy or dollar figure ships without primary-source verification.
- User-facing wording is approved by Dean at merge. Each pull request lists old and new wording.
- Production push stays OFF. No accounts, member identifiers, telemetry or ads.
- No force pushes. `APP_VERSION`, `WHATS_NEW` and the verified stamp are not touched without Dean's ruling.

"Beat anything on the market" is the direction of work. Under `member-return-benchmarking` it is not a claim the app or its outreach may make: Transition OPS retention is unmeasured and no compared product publishes comparable numbers.

## Method, each cycle
1. Observe: take the top backlog item that can move. Check production, the open stack and published branches from both assistants.
2. Orient: name the member job, the data dependency and the skill seams. Research runs with s2 staff in parallel; Tier 2 browser reads are done by the orchestrator.
3. Decide: stay inside standing rulings. An item that needs a new ruling is parked under "Needs Dean" and the loop takes the next item.
4. Act: count-asserted edits, tests that fail without the change, the full gate, a new cache integer, commit, push, pull request, hosted preview check.
5. Record: this file, `intel/verification-log.md` where a claim is rated, and the pull request.

Stop conditions: Dean says halt; no backlog item can move without a ruling; two gate failures in a row; the environment fails.

## Stack
Each cycle is its own pull request against `main`, built on the previous cycle's branch. Merging one pull request brings in everything beneath it. Cache integers rise with the stack, so merging in order keeps the numbers moving forward. Fixes land as new commits on top.

The base of the stack combines the three pull requests that were already held: #216 (TRICARE wording), #217 (test portability) and #218 (partner employers). Merging the first loop pull request merges those three.

## Backlog
Dispositions use the closed set in `member-return-benchmarking`, except row 1, which is a policy finding rated under `member-impact`.

| # | Item | Member job | Data dependency | Disposition | State |
|---|---|---|---|---|---|
| 1 | TAMP Guard/Reserve eligibility and reimbursement | Use a health benefit the member has earned | None | SHIP - ACT | Cycle 1, merged as #219 |
| 2 | CareerOneStop Job Finder and Veterans Job Matcher links | Find private-sector openings by role and area | The member's browser opens a federal site | ADOPT | Cycle 2, merged as #220 |
| 3 | Candidate handoff to VBS: link to the FRONTLINE Cadre intake form in the recruiter contact section | Reach a recruiter with a usable profile | A separate VBS site the member chooses to open; the app passes nothing | ADOPT on Dean's order of 15 November | Cycle 3, merged as #221 |
| 4 | VBS roles: link to the live open roles page on the VBS site | See the roles VBS is filling, Wisconsin first | A page Dean already controls; the app passes nothing | ADOPT on Dean's order of 15 November | Cycle 7 |
| 5 | SkillBridge feed states its age and points to the official list | Avoid acting on a stale opening | None | ADOPT | Cycle 6 |
| 6 | HIRE Vets Medallion: links to the official recipient list, national and Wisconsin | Find employers with federal recognition | None; the member's browser opens a federal site | ADOPT | Cycle 4 |
| 7 | Start-date planner | Know and state when civilian work can start | Device-local | LOCAL SYNTHETIC TEST | Queued |
| 8 | Starting points for every state | Find the state veterans agency and job bank | None; the member's browser opens a state site | ADOPT: both federal lists read at Tier 2 on 15 November | Cycle 12, merged as #231 |
| 9 | JST and VMET reading beside the DD214 | Turn records into resume evidence | Device-local read; member-approved excerpts to AI | LOCAL SYNTHETIC TEST; design packet first under `resume-drafter-maintenance` | Queued |
| 10 | What's New and the verified stamp | See what changed since the last visit | None | ADOPT on Dean's order of 15 November, 10:30 | Cycle 9, merged as #228 |
| 11 | Best Military Resume link | Resume and interview practice | Third-party account | REJECT for now: s2-vetting found no verifiable legal entity; reopens on Dean's outreach to the founder | Parked |
| 12 | "Returning to Wisconsin" landing page | Be found by search | Widens the public build allowlist | WATCH: deploy pipeline ruling | Parked |
| 13 | Repair stale browser test scripts | Keep the safety net honest | None; tests only | AUTO lane | Cycle 5 repaired `wisconsin-pathway`; three job-search test scripts remain, diagnosed below; cycle 13's gate found four more; cycle 14 repaired two of those and found the other two are right; cycle 15 fixes the app for both; cycle 21 repaired two and steadied two; cycle 22 repaired two more and dated the Career family's cause |
| 14 | TRICARE 2027 costs: a Policy Intel entry and a costs link in the open season notice | Choose a 2027 plan with the costs in hand before 8 DEC 2026 | None; the member's browser opens tricare.mil | SHIP - ACT under `member-impact` | Cycle 10, merged as #229 |
| 15 | Dated notice for Federal Benefits Open Season (FEDVIP dental and vision) | Enroll before the window closes on 14 DEC 2026 | None; the member's browser opens benefeds.gov | SHIP - ACT under `member-impact` | Cycle 11, merged as #230 |
| 16 | Share a deadline or one state's links; reachable app share | Pass a useful, specific thing to another service member | None; fixed text and one address, no tracking | ADOPT on Dean's order of 15 November, 12:36 | Cycle 13 |
| 17 | Family step in the retirement FEDVIP reminders | Keep a family member's vision coverage across the sponsor's retirement | None | SHIP - ACT under `member-impact` | Cycle 16 |
| 18 | Distinct labels on the Home next-move card | Tell six controls apart at a glance | None | ADOPT on Dean's order of 15 November, 13:57 | Cycle 17, merged as #237 |
| 19 | Find a job or a new role on Home | Reach job search and role exploration from Home in one press | None; the two existing Career routes | ADOPT on Dean's order of 15 November, 14:18 | Cycle 18 |
| 20 | Welcome screen returns until a start is picked | See the starting choices on a first real visit to the front door | None; reads keys the app already writes | ADOPT on Dean's order of 15 November, 14:18 | Cycle 19 |

## Needs Dean
- Best Military Resume: legal entity name and registration, current free and paid terms, whether a mock interview tool exists, and what "Partner Organizations" receive. The current site gives a free account 2 tailored resumes and 2 company research reports; cover letters are paid; resume building needs an account.
- The first VBS roles to post, and the disclosure line for who pays VBS.
- A full dataset review. It is what lets the "1 AUG 2026" full-review date move.
- Whether each release adds a What's New line. Cycle 10 left What's New alone, because each touch needs his approval.
- The title of reminder `r-9-tri26` before 1 JAN 2027. It carries "TRICARE 2026", and its copays hold through 2027.
- Rulings still open from 14 November: per-tool counters and push.
- The organization name on Air Tech's SkillBridge MOU.
- The VBS intake page says applicant information is never handed to anyone else; its privacy notice says it goes to a prospective employer at the serious-candidate stage. One of the two should change.
- `member-return-benchmarking` lists "commercial lead generation" among things not to recommend. Dean's order of 15 November makes disclosed, member-chosen referral to VBS part of the mission. force-mod should patch the skill to say so once Dean confirms.

## Reconciliation at loop start
`origin/main` was `92fb1a8`. Published branches not merged into `main`: the three Claude pull request branches combined in the base, and 14 older `codex/` branches dated 7 September to 25 October whose names match merged pull requests. Those older branches were not re-audited. No `codex/` branch is newer than 25 October.

## Cycle 1 - TAMP Guard/Reserve eligibility and reimbursement
Why first: accuracy outranks features, and Guard and Reserve members are a core audience.

Finding: a DoD memo (corrected copy stamped 27 AUG 2026, first issued 10 AUG 2026) says Reserve Component members called or ordered to, or retained on, active duty for at least 31 days under 10 U.S.C. 12304b or a contingency operation, including those who volunteered under 10 U.S.C. 12301(d), do not need to show a connection to a war, contingency operation or national emergency. Members found ineligible on or after 24 APR 2020 for that reason may request reimbursement from the Defense Health Agency by email.

How it was verified: s2-intel searched at Tier 1 and correctly rated the press lead UNVERIFIED. The orchestrator then read the memo itself and an Air Force Reserve notice at Tier 2, and confirmed that tricare.mil/TAMP still shows the earlier wording with a "Last Updated 5/15/2025" stamp. Records: V-2026-11-15-TAMP-RESERVE-ELIGIBILITY and V-2026-11-15-TAMP-REIMBURSEMENT.

What changed: the TAMP eligibility list, note, heading, action steps and sources in Critical Windows; the Guard/Reserve demobilization line; the Navigator corpus line; one new policy entry. Nine regression checks were added, including one that fails if the superseded wording returns on any surface.

Tooling note: the Navigator text lives in an OpenAI entry function, which triggers gate step 4N. `netlify-cli` 26.1.0, the version in the project's records, was installed in the Claude workspace before the gate so that step could run as written.

Gate evidence and the hosted preview check are in the pull request.

Outcome: staged as #219 on top of #216, #217 and #218. Dean ordered "merge all and keep building" in chat at 07:55 Central. Merged at head `658f5df`; `main` became `a59ba9f`. Production served the merged files with cache v322 at 13:59 UTC. The order was read as covering what was staged at that moment; later cycles wait for their own order.

## Cycle 2 - CareerOneStop Job Finder and Veterans Job Matcher links
Member job: find private-sector openings by role and area. Before this cycle the app searched federal openings and linked out to LinkedIn, USAJOBS and the state job bank directory.

What changed: Career job search now prepares a CareerOneStop Job Finder search from the same role and area, with one line saying what the site is. A Veterans Job Matcher link sits beside the state job banks link. Two summaries name CareerOneStop.

Evidence: both tools were read at Tier 2. A test search for "logistics" near Green Bay returned 92 listings on CareerOneStop; the same search inside the app on 14 November returned one federal opening. Record: V-2026-11-15-CAREERONESTOP-JOB-LINKS.

Data dependency: none new. The link is an ordinary anchor; the role and area travel in the address from the member's browser, as they already do for LinkedIn and USAJOBS. The in-app listing feed stays off until the Jobs API request is approved.

Disposition: ADOPT. Six content checks and one browser regression were added. Gate evidence and the hosted preview check are in the pull request.

Baseline note from cycle 2's gate: three older browser regressions fail the same way on untouched `main` (`career-job-search-flow`, `federal-jobs-browser`, `career-home-search-continuity`). Each looks for an element id the Career redesign removed. Backlog row 13 covers the repair.

## Cycle 3 - FRONTLINE Cadre intake link in the recruiter contact section
Member job: reach a recruiter with a profile the recruiter can act on. Business job, stated by Dean: find qualified people moving back to Wisconsin first, then the other states.

Before this cycle the section offered a 30-minute call and a member-sent email. The email carries roles, location and availability. The VBS intake form already collects more of what a placement needs: state, career areas, availability, willingness to relocate, military job, separation timing and SkillBridge interest.

What changed: one link to that form, one note, and an opening sentence that names all three options. The note says the form is Veteran Bridge Solutions' own, on a separate site; what it requires; that employers pay VBS and joining costs nothing; and that the member should read the form's privacy notice first. Because the section appears in Career job search for any area, the link is national. The Wisconsin guide carries it too.

Data dependency: none in the app. The link passes no data and no referrer. Collection happens on the VBS site under its own consent and privacy notice, which was read at Tier 2. Record: V-2026-11-15-VBS-TALENT-NETWORK.

Not done here, by design: no roles list. That needs Dean's roles. No change to the email path or its permission wording.

Disposition: ADOPT on Dean's order. Five content checks were added and the contact browser regression now covers the link. Gate evidence and the hosted preview check are in the pull request.

## Merge record, 15 November 2026
- 07:55 Central: Dean ordered "merge all and keep building". #219 merged, carrying #216, #217 and #218. Production moved from v319 to v322.
- 08:16 Central: Dean ordered "merge all". #221 merged at head `022c16d`, carrying #220. Production moved to v324; served bytes matched `main` at 14:31 UTC.
- Each order covered what was staged at that moment. Later cycles stage and wait for the next order.

Cycle 4 onward is built on `main` at `5543926`.

## Cycle 4 - HIRE Vets Medallion links, national and Wisconsin
Member job: find employers with a record of hiring veterans in the state the member is moving to. It recurs when the target area changes and each November, when the Department of Labor posts a new award year.

What changed: Career job search gains one link to the Department of Labor's recipient list, with a note on who gives the award, how to filter it and what an award does not establish. The Wisconsin guide gains a section after Vets Ready that opens the same list filtered to Wisconsin.

Why links and no names: the Vets Ready section set the pattern of linking to the issuer's list. A federal list is TIER 1. Naming seven commercial employers inside the app would be an inclusion decision for `s2-vetting` and Dean, and the names would age each November. The seven 2026 Wisconsin recipients are recorded in V-2026-11-15-HIREVETS-MEDALLION for Dean's own use.

Data dependency: none. Two ordinary links. The app passes no search term to the list.

Disposition: ADOPT. Six content checks were added, and two browser regressions now cover the links. Gate evidence and the hosted preview check are in the pull request.

Baseline note from cycle 4's gate: `wisconsin-pathway-browser-regression` fails while waiting for a "For this visit" status after the member chooses to use a plan for one visit. The same failure occurs on `main` at `5543926` and at `92fb1a8`, the commit before today's first merge, so this cycle did not cause it. The cause is not yet diagnosed. Either the test script is stale or the status does not render. Backlog row 13 covers it.

One layout fix inside this cycle: the first browser check showed the job-search note running straight into the paragraph after it. The note now carries a 14 px bottom margin.

## Cycle 5 - Stale test repair (tests only)
`wisconsin-pathway-browser-regression` waited for a status containing "For this visit". Commit `90611aa` (#156, "Clarify saved and temporary next steps") changed that message to "This step is not saved." and left the test behind. The app behaves as #156 designed it. The test now expects the current wording and passes end to end. One expectation changed; it is as strict as before.

Three job-search test scripts still fail on `main`. Each needs a decision about intended behavior, so they stay queued:
- `career-job-search-flow`: `#tops-career-find-jobs` exists but does not take focus when the test calls `focus()` (line 15).
- `federal-jobs-browser`: a helper reads `parentElement` of an element that is no longer on the page (line 12).
- `career-home-search-continuity`: waits for `#career-starter-resume` at `/?tool=pathway&case=timeline`, and that element does not render there (line 40).

No app file changed. No cache bump.

## Cycle 6 - SkillBridge feed states its age
Member job: avoid planning a SkillBridge window around an opening that has closed. It recurs through the whole SkillBridge planning period.

Finding: the feed is kept by hand and its newest batch is "1-9 JUL 2026". On 15 November that batch was 129 days old, and Home still called it the latest batch.

What changed: the app reads the last date in the newest batch label. Past 45 days, Home swaps the company teaser for a pointer to the official SkillBridge list, and the full feed gains a dated caution above its batches. When someone refreshes the feed, both notices clear on their own. No feed entry changed.

Why a rule and no refresh: a refresh fixes today and goes stale again. The rule keeps the app honest between refreshes. A refresh of the entries themselves is S2 work with per-entry verification and stays open.

Data dependency: none. The check uses the device clock and the batch label.

Disposition: ADOPT. Six content checks were added, one of which runs the date reader. Record: V-2026-11-15-SKILLBRIDGE-FEED-AGE. Gate evidence and the hosted preview check are in the pull request.

## Cycle 7 - Link to the VBS open roles page
Member job: see real roles a recruiter is filling. Business job, stated by Dean: find qualified people for roles, Wisconsin first.

Finding: the VBS intake site already has a live roles page that Dean controls. On 15 November it listed one Wisconsin role. An in-app roles list would be a second copy that goes stale; the page is the source.

What changed: one link and one note in the recruiter contact section, after the talent network link, and an opening sentence that names all four options. The app names no role and no client.

A catch worth recording: my first draft gave the link the id `tops-talent-roles`, which the email form's roles field already owns. The count check in the edit script exposed it before any test ran. The link's id is now `tops-talent-open-roles`, and a content check guards the split.

Data dependency: none in the app. The link passes no data and no referrer. Record: V-2026-11-15-VBS-OPEN-ROLES.

Disposition: ADOPT on Dean's order. Five content checks were added, two existing checks were updated for the fourth option and the second VBS address, and the contact browser regression covers the link.

## Merge record, continued
- 10:04 Central: Dean ordered "merge all and keep working the loop". #225 merged at head `eaf2c2b`, carrying #222, #223 and #224. Production moved from v324 to v327; served bytes matched `main` at 16:07 UTC.

Cycle 8 onward is built on `main` at `9aaec96`.

## Cycle 8 - Reminder for the one-year mark on a VA disability claim
Standing instruction from the project: add reminders for timing on things members should be thinking about.

Review: all eight windows in the critical windows brief already carry reminders, and the VA dental 180-day window has one. The gap is the stretch between month 6 and month 12 after separation. A veteran who has not filed a VA claim gets no warning that the one-year mark affects the effective date, and the month 12 review arrives too late.

Verification: s2-intel confirmed the rule on VA.gov at Tier 1 and flagged that it had the regulation and statute from a mirror only. The orchestrator read VA.gov, eCFR 3.400(b)(2)(i) and 38 U.S.C. 5110(b)(1) at Tier 2. Record: V-2026-11-15-VA-CLAIM-ONE-YEAR.

What changed: one reminder, current from day 270 to day 360 after separation. It tells a veteran who has not filed to get the claim to VA before the first anniversary. It leaves out intent to file, Guard and Reserve periods, presumptive conditions and any dollar figure, because none of those cleared verification.

Two design corrections inside the cycle, both caught by the existing Home actions regression before anything staged:
- A month-based reminder would have stayed on Home past the anniversary. The reminder now has its own window, modeled on the BDD reminder.
- The banner tolerates a narrower month range than Home. The reminder sits in month 10 so every day of its window falls inside both.

Not done: the calendar export does not carry this reminder yet. `guard-reserve-regression` cannot run from a fresh clone because it reads commit `b9b11a2`, which the remote does not have.

Disposition: ADOPT. Content checks and a nine-point day ladder were added. Gate evidence and the hosted preview check are in the pull request.

## Cycle 9 - What's New, a verified stamp with a time, and the seven Medallion employers
Dean's order, 10:30 Central: "lets add whats new and verified with a time stamp, the seven medallion employers and keep building".

What's New: one entry, v99, dated 15 NOV 2026, covering today's changes. The app version moves with it because the release check requires the two to match.

Verified stamp: the full-review date stays at 1 AUG 2026, because no full review has happened since. A second stamp carries the newest primary-source read with its time, 15 NOV 2026, 16:13 UTC. A content check ties that stamp to the newest dated entry in the verification log. Record: V-2026-11-15-VERIFIED-STAMP.

Medallion employers: the Wisconsin guide now names the seven 2026 recipients as the Department of Labor lists them, with a caption that gives the award year and the read date. s2-vetting screened all seven: 5 CLEAR, 2 CLEAR WITH NOTE, 0 HOLD. The listing expires when the 2027 award year posts. Record: V-2026-11-15-HIREVETS-MEDALLION-NAMES.

Also in flight: issue #226 from the J1 scan points at the CY 2027 TRICARE cost notice, effective 1 JAN 2027. s2-intel rated its figures PROBABLE and held them for a Tier 2 read. That is the next cycle.

## Merge record, continued (2)
- 10:45 Central: Dean ordered "Merge all and keep building". #228 merged at head `f43855b`, carrying #227. Merge commit `1d8f94c`. Production moved from v327 to v329; served bytes matched the commit at 16:51 UTC. v328 was served on a preview origin only.

Cycle 10 onward is built on `main` at `1d8f94c`.

## Cycle 10 - TRICARE 2027 costs published
Source: J1 scan issue #226. s2-intel held the figures. The orchestrator read six primary pages at Tier 2. Record: V-2026-11-15-TRICARE-2027-COSTS.

What the read found: the app already carries the open season act. A dated notice in Reminders shipped on 14 November (#211) and expires on its own after 8 DEC 2026. The app shows no Prime or Select cost, so nothing goes stale on 1 JAN 2027.

What ships: one Policy Intel entry that says 2027 costs are published and links TRICARE's Health Plan Costs page, plus one sentence and one link in the open season notice. No dollar figure. A member who returns after a day or more sees "1 new policy change tracked" on Home.

Tests: the notice had no regression coverage. The content regression now checks its text, its links and its date window.

Left for Dean: the title of reminder `r-9-tri26`, and whether each release adds a What's New line.

Next: a dated notice for Federal Benefits Open Season (FEDVIP dental and vision), which closes December 14, 2026. OPM's dates are confirmed. Eligibility needs a Tier 2 read before any wording.

## Cycle 11 - Federal Benefits Open Season notice (FEDVIP)
Built on the cycle 10 branch at `8d839ad`. Record: V-2026-11-15-FEDVIP-OPEN-SEASON.

Why now: the window closes at 11:59 pm Eastern on 14 DEC 2026, six days after TRICARE Open Season. The app named the season by month only.

What ships: one disclosure in Reminders under the TRICARE notice. It gives the deadline with its time zone, BENEFEDS.gov and its phone number, who is eligible for dental and vision, who is eligible for vision only, and the line that active duty service members are not eligible. It is collapsed while the TRICARE notice shows and open once it stands alone. It ends at the Eastern deadline on every device.

Sources: s2-intel's Tier 1 pass could not read BENEFEDS, so the orchestrator read six live pages at Tier 2.

Left out: survivor and former-spouse rules (linked), TTY and international numbers, premiums.

Staff tooling: s2-intel reported no Grep tool on both taskings today, although its definition lists one. Correlation against the app fell back to the orchestrator both times. force-mod should check the agent definition.

Open lead: s2-intel's Tier 1 read of a BENEFEDS FAQ says retirement is not a qualifying life event and gives the 31-day and 60-day enrollment window. Reminders `r-1-fedvip` and `r-p1-fedvip` rest on that window. A Tier 2 read of the FAQ is queued before either reminder is touched.

## Merge record, continued (3)
- 11:54 Central: Dean ordered "merge and keep impriving. best app for veterans". #230 merged at head `bd47d50`, carrying #229. Merge commit `0b47bc9`. Production moved from v329 to v331; served bytes matched the commit at 18:02 UTC. v330 was served on a preview origin only.

Cycle 12 onward is built on `main` at `0b47bc9`.

## Cycle 12 - Starting points for every state
Record: V-2026-11-15-STATE-STARTING-POINTS.

Why: outside Wisconsin, State and local help sent every member to one VA directory page. Dean's mission names Wisconsin first and then every other state.

What ships: one control in the "All states" view. A member picks a state or territory and gets its veterans office and its job bank, 55 rows in all. The choice is held for the visit and saved nowhere.

Sources: VA's directory of state veterans affairs offices and CareerOneStop's state job bank list, both read in the browser. A hash of each list as the page held it proves the copy.

What the read caught: VA's New Hampshire link is dead, and the app uses the address NH.gov gives. New Mexico's office and Colorado's job bank now sit on .gov hosts, and the app links those.

Vetting: s2-vetting screened the 27 hosts outside .gov and held five. The orchestrator read all five in the browser and each one is linked from its state's own site.

Upkeep: the weekly J4 link audit will crawl the 109 new addresses. A re-read of either list compares with its hash in one step.

Staff tooling: s2-vetting's fetch tool was refused by all 27 hosts, so its screen rested on state pages and search. The browser read is what cleared the holds.

## Merge record, continued (4)
- 12:36 Central: Dean ordered "merge and keep making this better. i want veterans to want to share it beacuse its so good". #231 merged at head `1649eb2`. Merge commit `4729654`. Production moved from v331 to v332; served bytes matched the commit at 18:38 UTC.

Cycle 13 onward is built on `main` at `4729654`.

## Cycle 13 - Make the useful things shareable
Record: V-2026-11-15-SHARE-TEXT.

What a probe found: the app share button was about 4,400 pixels down Home under a closed disclosure. Nothing but the Wisconsin guide could be shared on its own. Four handlers assumed a clipboard.

What ships:
- One share control: the device's share sheet, then the clipboard, then a link to select by hand. It sends fixed text and one address.
- "Share this deadline" on the TRICARE and FEDVIP notices.
- "Share these links" for a chosen state. The link opens with that state chosen.
- "Share Transition OPS" in the More tools menu, two taps from any screen.
- The older share and copy buttons check for a clipboard and say what to copy when there is none.
- The app share handler no longer calls a tracking hook that nothing defines.

Why these: people pass along a date or a link that helps someone today. A general pitch for an app travels less.

Drafting: pao-content wrote the share text options. The deadline texts ship with the year added and with no eligibility line.

Left for Dean: the app-wide share line still reads as it did. pao-content offered three replacements. One is quoted in the pull request; the other two were not kept. Cycle 20 stages that one.

Baseline note from cycle 13's gate: five older regressions fail the same way on untouched `main` at `4729654`, so this cycle did not cause them. Four of the five are new to this record. Backlog row 13 covers the repair.
- `career-home-search-continuity-browser`: already recorded under cycle 2.
- `tool-url-continuity-browser`: every scenario passes through line 34. The last one, at line 35, expects a visitor with saved work and no `tops_onboarded` key to keep an address with no `tool` value. The app treats saved work as a returning visitor and writes `tool=dashboard`.
- `navigation-refresh`: the script renders the bottom navigation in a sandbox that has no `subTab` variable, and the navigation code now reads one.
- `guard-reserve-browser`: stops at "reload Guard" on line 20.
- `profile-access-browser`: stops at "Home heading focus" on line 19.

`home-visual-browser` passed 4 of 6 runs on this branch and 5 of 5 on `main`. Both failures were the "Invalid InterceptionId" request race recorded in earlier cycles.

Lead from the same probe, same on `main`: the welcome screen shows on a visitor's first load of the root address only. The first load writes `taskProgress` and `docProgress`, and the app reads either key as a returning visitor. A visitor who reloads before choosing a starting point lands on Home.

## Cycle 14 - Repair two stale test scripts
Tests only. No app file changes. No cache bump.

What cycle 13's gate showed: five older regressions fail on untouched `main`. Each was diagnosed against the app.

Repaired here:
- `navigation-refresh`: the bottom navigation reads `subTab`, and the script's sandbox never defined it. The script now defines it and checks five Resources sub-views. Documents belongs to My Plan. The other four belong to Benefits.
- `tool-url-continuity-browser`: the last scenario expected the welcome screen for a visitor with saved work. Since #163 (21 OCT) saved work marks a returning visitor. The scenario now states each rule on its own, and adds the linked-state address rules from cycle 13.
- `home-visual-browser`: its paused-request handler now ignores Chrome's "Invalid InterceptionId" answer for a request whose page has reloaded, as 58 of the 93 browser regressions already do. It rethrows anything else.

One pin for Dean's ruling: the address script pins today's first-visit behavior. The welcome screen shows on the first load only, and a reload before any choice lands on Home. If Dean rules that the welcome screen should return, the app and that pin change together.

Found, and carried to cycle 15: the two other failing scripts are right. Each caught a defect on Guard and Reserve Home that dates from October.
- `profile-access-browser`: saving a service profile change between Guard or Reserve and any other profile rebuilds the editor. The save then throws an error, focus drops to the page body, and "Service profile updated." never shows. Since `5f96b7c` (7 OCT).
- `guard-reserve-browser`: "Open transition timeline" on Guard and Reserve Home opens the My Plan hub. Since `d071539` (10 OCT). Two of its steps also reload from the career plan and expect Home, which went stale with tool addresses on 9 OCT.

Still failing after this cycle: those two scripts, until cycle 15 merges, and the three job-search scripts in row 13.

Evidence: `navigation-refresh` 1 of 1, `tool-url-continuity-browser` 3 of 3, `home-visual-browser` 4 of 4. Run against untouched `main`, the repaired address script fails at the linked-state step, as it should before #233.

## Cycle 15 - Two Guard and Reserve Home fixes
No policy claim and no new wording. Cache v334.

Both defects were found by regressions that had been failing since October.

1. Service profile save. Home has two layouts: one for Guard and Reserve, one for everyone else. A save that crosses between them rebuilds Home, and the editor with it. Since `5f96b7c` (7 OCT) that save threw "Cannot read properties of null (reading 'focus')", dropped keyboard focus to the page body, and never showed "Service profile updated."
   - Fix: the save moves focus to the Service profile heading that is on the page after Home settles. The editor being replaced hands its confirmation to the one that replaces it. The new editor shows it a moment after it is on the page, so the status line changes and a screen reader can announce it. A note older than two seconds is dropped.
2. "Open transition timeline" on Guard and Reserve Home. Since `d071539` (10 OCT) it opened the My Plan hub and left focus on the page body.
   - Fix: it opens the timeline the way Home's own timeline control does. Focus lands on the timeline, and returns to the control when the member comes back to Home.

Test repairs in the same change:
- `profile-access-browser` now requires the confirmation after every save, including the two that rebuild Home. Its last scenario evaluated 2,750 lines of app source in isolation and broke on a name defined above them. It now evaluates the profile list and the editor only.
- `guard-reserve-browser`: two steps reloaded from the career plan and expected Home. They now return Home first and wait for the address to follow. The timeline step now requires focus on the timeline.
- The three scripts that have shown the paused-request race now tolerate both of its forms: a request whose page reloaded, and a request left paused while Chrome closes.

Proof that the scripts test the fix: run against the app without it, the repaired profile script stops at "Home heading focus" with one uncaught error, and the repaired Guard script stops at "Timeline".

Evidence: `profile-access-browser` passes 3 of 3 and `guard-reserve-browser` 4 of 4. A browser check of both fixes passes 45 of 45 across two themes and two widths. The six gate commands and the build exit 0. Fifteen other related regressions pass.

Baseline note from cycle 15's gate: three more Home regressions fail the same way on untouched `main` at `4729654`. They are not yet diagnosed.
- `member-loop-browser`: stops at "first visit welcome".
- `member-action-hierarchy-browser`: an assertion at line 25.
- `member-priority-browser`: an assertion at line 54.

Two of the four scripts diagnosed so far were right about the app, so these three are next. A run of every script against `main` was started to map the rest.

## Cycle 16 - One family step in the retirement FEDVIP reminders
Record: V-2026-11-15-FEDVIP-RETIREMENT-WINDOW.

Why: a lead left open in cycle 11. A Tier 2 read of four BENEFEDS pages closed it. Every FEDVIP statement in the two retirement reminders matches BENEFEDS, and BENEFEDS's line that retirement is not a qualifying life event does not conflict with them.

What the read found that the app did not carry: a family member who enrolled in FEDVIP vision while the sponsor was on active duty cannot keep that enrollment after the sponsor retires. BENEFEDS must be notified. The sponsor enrolls as a retired uniformed service member and adds the family member as a dependent. Two BENEFEDS pages state it.

What ships: two checklist lines in `r-1-fedvip` and one in `r-p1-fedvip`. The latest-check stamp moves to 19:18 UTC.

Left out on purpose: belated enrollment and the loss-of-other-insurance window. Each needs one more read before an act can be written. The log entry says which.

Same hour, from s2-intel's rung 1 pass on issue #232: the Dole grants rule is BLOCKED at rung 1 and needs a Tier 2 read. OPM's direct final rule on FMLA (document 2026-21104) is PROBABLE: it says certain honorable active military service counts toward FMLA eligibility in a title 5 federal job. It takes effect 14 DEC 2026 unless OPM withdraws it. A Tier 2 read and a `member-impact` pass are queued.

## Cycle 17 - One job and one label for each control on the next-move card
Order: Dean, 13:57 Central on 15 November, with a phone screenshot of Home: "These options look similar? Fix it".

What the screenshot showed, after a member picks a starting point:
- The heading and both actions began with "Review".
- Four options followed, and they read as two pairs. "Change priority" and "Choose my direction" both pick what to work on. "Stuck or need a different approach?" and "Get help choosing my next step" both ask for help.
- With the check-in open, two buttons on the card carried the same label for two different steps.

What changed. Labels and the order of two options. No control was added or removed, and nothing behaves differently.

| Control | Before | After |
|---|---|---|
| Second action after a starting point | Review this as my next step | Choose this next step |
| Check-in | Stuck or need a different approach? | I'm stuck on this step |
| Button inside the check-in | Review this as my next step | Use this step instead |
| Navigator draft | Get help choosing my next step | Draft a question for Navigator |
| Direction editor, nothing saved | Choose my direction | Set my direction, role and goal |

Unchanged: "Change priority", "Choose a priority (optional)", "Review or change my direction", and each starting point's own button.

"Choose this next step" was already the label for the same action in two other states of the card. The options now run priority, stuck, direction, Navigator, so on a phone the left column holds what the member is working on and the right column holds help.

Aligned with the change:
- The four test scripts that named the old shared label. Each reference now names the button it means. All four already fail on `main` for other reasons, recorded below.
- The Wisconsin Guard leadership demo walkthrough, which names three of these labels.

New test: `scripts/next-move-options-browser-regression.js`. Until now no script named any of the four option labels.

Left for Dean: the labels are distinct, and two of the options still overlap in substance. "Change priority" picks one of four starting points for the visit. "Set my direction, role and goal" picks one of four directions to save, with a role and a goal. A member answers nearly the same question twice. Merging them into one picker is a behavior change and needs his call.

Diagnosed while here, all three stale and all three failing on `main`:
- `member-loop-browser` waits for the old first-visit button, which #163 replaced.
- `member-priority-browser` passes every step and then requires zero function requests. The jobs screen now asks the federal jobs function whether search is configured, a request that carries no member detail.
- `member-action-hierarchy-browser` caps the card heading at 32 px. The product-shell design sets it larger.

## Full baseline of the regression scripts, 15 November
One run of all 123 scripts against untouched `main` at `4729654`, with a rerun of the three that stopped on the paused-request race: 77 pass and 46 fail.
- 30 of the 45 `career-*` scripts fail. Most look for a control that the October Career changes renamed or removed, such as "Open my current career plan" or "Return to my draft".
- 16 others fail. Four are repaired or fixed in cycles 14 and 15. Two cannot run in this workspace because they need commits that are not present (`guard-reserve-regression`, `vgli-window-regression`). Three are the Home scripts above. Seven are not yet diagnosed: `counselor-preparation`, `federal-jobs-browser`, `my-jobs-browser`, `personal-guide-browser`, `support-compact-review-browser`, `tap-integration` and `tap-worksheet-browser`.
- The six gate commands pass. They do not run these scripts.
- Each failure was seen once, apart from the reruns named here. A repair cycle starts by confirming it.

Two of the first four failures diagnosed were real defects in the app. Backlog row 13 now covers the whole set.

## Merge record, continued (5)
- 14:18 Central: Dean ordered "fix them all and merge. I also want. lets find a new role or job or someting on that page." #237 merged at its verified head `45ddc06`, carrying #233, #234, #235 and #236. Merge commit `6e676a4`. Production moved from v332 to v336; served bytes matched the commit at 20:24 UTC. v333, v334 and v335 were preview-only.
- The merge covered the five pull requests staged at that moment. Work built after it is staged for a new order, because its wording had not been in front of Dean.

Cycle 18 onward is built on `main` at `6e676a4`.

## Cycle 18 - Find a job or a new role on Home
Order: the second sentence of Dean's 14:18 message, and the overlap that cycle 17 left for his call.

What ships:
- A block under the next-move card: "Find a job or a new role", with two tiles. "Search jobs by area" opens job search. "Find roles from my experience" opens the Career start that works from a resume or from experience. Both use routes the card already had. When the member comes back to Home, focus returns to the tile they used.
- The block stays out where it would repeat the card: before a starting point is chosen, when the four starting points are open, and after "Find work soon" or "Explore a different career", when the card's own button leads to the same place.
- The direction editor now starts from the starting point the member just chose. Before, a member who chose "Prepare to leave service" opened it and was asked to choose a direction again from a nearly identical list.
- Its label with nothing saved changes from "Set my direction, role and goal" to "Add a target role or goal", which names what is left to add.

Unchanged: what is saved and when. "Use for this visit" still saves nothing, and with no starting point and nothing saved the editor still asks for a direction first.

Why a block under the card and why two tiles: the card held no path to a job once a member chose "Prepare to leave service" or "Grow in my current career". From the card, the two routes were behind "Change priority". The tiles carry the look of "Tools for your next step", so Home gains one pattern it already has.

Structure note: the card's route handler was an inline function. It is now `memberLoopRoute`, with the same body, so Home can call the same routes.

Test: `next-move-options-browser-regression.js` now also covers where the block shows, both routes, the return of focus, one control per label on Home, the tile height at 320 and 393 px, and the direction editor's starting value for three starting points.

Changed assertion: the script used to end by requiring zero requests to a server function. That rule still runs at full strength for every scenario that existed before. The job-route scenario runs last, because opening job search asks the federal jobs function whether it is set up (`?config=1`, no member content). After it, that one address is the only function request the script accepts.

Checked in a browser against the built files: the block on the Guard and Reserve Home, the block for four saved directions with no label repeated on Home, and the second tile's destination, which opens on the heading "Start with your experience".

Gate on the final tree: structural gate exit 0. Six semantic commands and the public build pass. Of 28 related browser regressions, 27 pass.

The one failure: `wisconsin-pathway-browser` timed out once waiting for the Home card after a reload. Its script reloads right after pressing Home, with no wait for Home's address to settle. That is the race form repaired in `guard-reserve-browser` in cycle 15 and the likely cause here; the failing run left no address in its log to confirm it. The script passed in the full run made before the options test was reordered, and 3 of 3 times alone afterward. The app files are identical across those runs. It joins the test repair list.

## Cycle 19 - The welcome screen returns until the visitor picks a start
Order: Dean's 14:18 "fix them all". The welcome screen was on the fix list sent to him at 14:19.

What was wrong:
- A first visit to the front door shows the welcome screen. That same load saves the plan and the document list with nothing checked.
- The rule that decides who is a returning member counted those two keys as saved work. A visitor who reloaded or came back before choosing went to Home, and the welcome screen never showed again in that browser.
- The same rule named a saved-jobs key the app has never written, `tops_member_jobs_v1`. The app writes `tops_my_jobs_v1`. The two first-load keys masked the mistake, because every visitor already counted as returning.

What ships:
- The welcome screen shows at the front door until the visitor picks one of its starts or presses "Explore all tools".
- A member with saved work still goes to Home with no onboarding flag. The new helper `topsMemberHasSavedWork` lists what counts: a direction, a chosen step, a career worksheet, a job list, comparison notes, reminder progress, a separation date and a service profile. A checked task or a document marked obtained counts too.
- A deep link into a tool is unchanged. It never shows the welcome screen.

Who notices:
- A visitor who left the welcome screen without choosing sees it again at the front door.
- A visitor who first arrived by a shared link and saved nothing sees it the first time they open the front door.

A member with saved work sees no change. No wording changed.

Test: the pin of the old behavior in `tool-url-continuity-browser-regression.js` is replaced by the rule. The script now covers the reload, a checked task, an obtained document, a saved job list, a saved profile, a saved date, a deep link followed by the front door, and "Explore all tools".

Browser check on the built files: 38 checks pass, including each member-written key alone and the first-load keys alone. On the live build the same check confirms the old behavior.

Gate: structural gate exit 0. Six semantic commands and the public build pass.

Sweep of the 82 scripts that pass on `main` or were repaired in this loop: 79 pass. Three failed once and pass alone.
- `career-direction-browser` and `service-career-browser` hit the request-interception race ("Invalid InterceptionId") and pass 3 of 3 alone.
- `personal-step-calendar-browser` fails about 1 run in 6 with a missing calendar button. It fails at the same rate on the cycle 18 tree, so the cause predates this cycle.

Found for the test repair list:
- 13 scripts keep `tops_member_jobs_v1` in their saved-bytes snapshot, so none of them watches the real saved-jobs key.
- The three scripts above, plus `wisconsin-pathway-browser` from cycle 18.

## Cycle 20 - The app share line
Order: Dean's 14:18 "fix them all". The app share line was on the fix list sent to him at 14:19.

What ships: the text a member's share sheet receives when they share Transition OPS itself.
- Before: a line naming VA Math, VA Pay, SkillBridge, state tax intel and personalized timelines, closing with "Built by a veteran." It held a dash.
- After: "A free transition app from a retired Army officer: VA disability math, benefit deadlines, state veterans office and job bank links, and resume tools."

The line is pao-content's draft from cycle 13, shipped as drafted. Each part it names has its tool in the build, and the log record V-2026-11-15-APP-SHARE-LINE ties each one to its place.

Unchanged: the title "Transition OPS", the address https://transitionops.org and the two toast lines shown when no share sheet exists. With no share sheet the app copies the address alone, so the line travels only through a share sheet.

Test: four new assertions in `policy-content-regression.js`, now 205. They pin the line, its length and characters, the absence of the old line, the four tools it names and the log record.

Browser check on the built files: 10 checks pass across a share sheet, a clipboard and neither. Sharing sends no request.

Gate: structural gate exit 0. Six semantic commands, the public build and six Home regressions pass, 13 lines in all.

Still open on this subject: the page title and the link preview card describe the app in their own words, and those claims have not been checked against the build.

## Cycle 21 - Test repairs, batch 1
Order: Dean's 14:18 "fix them all". Tests only. No app file changed, so the cache stays at v339.

Each failure was confirmed and diagnosed before its script was edited. No assertion was loosened.

| Script | What was wrong | Repair |
|---|---|---|
| `member-priority-browser` | It required zero requests to a server function. Job search sends one content-free check, `federal-jobs?config=1`, twice in the run and nothing else. | The rule accepts that one address with no body, and nothing else. |
| `member-action-hierarchy-browser` | It capped a saved step's heading at 32 px. The 29 October design (`179e987`) sets 29 px on phones and 3.6vw up to 40 px above them. | The size is pinned exactly at each width, and the variant is pinned too. |
| `personal-step-calendar-browser` | It failed about 1 run in 6. A render between its storage patch and its click used up the reads it counts. A debug copy showed the count at 2 before the click. | The patch and the click run in one evaluation, in both places. 18 of 18 runs pass. |
| `wisconsin-pathway-browser` | It reloaded right after pressing Home, before Home's address settled. | It waits for Home's address first. 6 of 6 runs pass. |
| Shared browser client | 91 of the 94 browser scripts had no guard for the request-interception race, so any of them could fail on it. | An async handler whose only failure is that race no longer ends the run. Each ignored outcome is written to the error stream. Every other failure still ends the run. |
| 13 scripts | Their saved-bytes snapshot watched `tops_member_jobs_v1`, a key the app has never written. | Each now watches `tops_my_jobs_v1`. All 13 still pass. |

The shared client lives in `privacy-network-regression.js`, which is also a gate command. Its own assertions are unchanged.

Evidence: structural gate exit 0. Six semantic commands and the public build pass. Of 84 scripts swept, 83 pass.

Found and left for the next batch:
- `dd214-upload-browser` stalls loading the upload screen about 1 run in 6. It did so before this change too, 1 run in 6 on the cycle 20 tree.
- `personal-guide-browser` failed on the race in the baseline. With the race handled it fails on a missing control at its line 94.
- `career-action-browser` is the same story. It now fails on a wait named "keyboard disclosure".
- `counselor-preparation` pins a SHA-256 of everything above `TOPS_GAP_KEY` against a 20 September commit. It is a point-in-time preservation proof, and every later approved change in that span breaks it. Whether to keep re-pinning it or file it as historical evidence is Dean's call.
- `member-loop-browser` opens with the welcome screen that #163 replaced. It needs its first block rewritten.
- 11 Career scripts fail on one control, "Open my current career plan". One cause may repair many.

Standing after this batch: 124 scripts, 84 pass, 40 fail. The 40 are 30 Career scripts and 10 others, two of which cannot run in this workspace.

## Cycle 22 - Test repairs, batch 2
Order: Dean's 14:18 "fix them all", continued at the 16:36 check-in. Tests only. The cache stays at v339.

| Script | What was wrong | Repair |
|---|---|---|
| `personal-guide-browser` | Last edited 8 October. Four later changes passed it by: Home search results put the name before its type; the topic picker gained State benefits and local help (#154); the document checklist moved into My Plan (#148); and the picker is absent on that checklist. | Four edits. The count is exact at 11, nine topics are checked in the picker, and the two that open their own page are each checked for where they land. |
| `career-action-browser` | The career guide panel shows only on the Other Career tools screen since 10 October (`017b87c`). A downloaded plan backup is version 4 with a `memberJobs` section since 9 October (`0cbb657`). | The script opens that screen first. Its version 1 and version 2 fixtures drop `memberJobs`, as they already dropped the other later sections. |

Both pass 3 of 3. Structural gate exit 0. Six semantic commands, the public build and four related scripts pass.

### The Career family, dated
- 29 Career scripts still fail. They were written for the Career that existed before two redesigns.
- `42b6c78` on 10 October opens a coherent saved plan directly and removed "Back to career choices".
- #147 (`f948e3b`) on 13 October removed "Review and save", "Continue my career draft", "Return to my draft" and "Start with my experience".

11 of the 29 stop at "Open my current career plan", a press Career now skips. I probed four of them past that point and each failed again: three on a control #147 removed, one on a draft panel that no longer shows.

A one-for-one repair means rewriting each script against today's Career. The cheaper path is to decide which of those features still exist, cover them with a smaller set of current scripts, and file the rest. Filing removes assertions, so the choice is Dean's.

### Other open scripts, with the first thing each one fails on
| Script | First failure |
|---|---|
| `member-loop-browser` | Its first block tests the welcome screen that #163 replaced |
| `my-jobs-browser` | Looks for "Return to my draft", removed by #147 |
| `federal-jobs-browser` | A control lookup returns nothing at its line 12 |
| `support-compact-review-browser` | A layout budget: the save control sits lower than its 572 or 668 px limit |
| `tap-worksheet-browser` | Waits for a worksheet that does not render |
| `tap-integration` | Pins the text of the transition milestones, which later approved cycles changed |
| `counselor-preparation` | Point-in-time hash of the source above `TOPS_GAP_KEY` |
| `guard-reserve-regression`, `vgli-window-regression` | Need commits this workspace does not hold |

`dd214-upload-browser` passes and still stalls about 1 run in 6.

Standing after this batch: 124 scripts, 86 pass, 38 fail. The 38 are 29 Career scripts and 9 others.

## Merge record, continued (6)
- 17:21 Central: Dean ordered "merge". #242 merged at its verified head `9b6d16c`, carrying #238, #239, #240 and #241. Merge commit `a78cfb3`. Production moved from v336 to v339; served bytes matched the commit at 23:22 UTC. v337 and v338 were preview-only.
- The order answered a status report that listed all five pull requests and their wording. It approved cycles 18 to 22 as staged.

Cycle 23 onward is built on `main` at `a78cfb3`.

## Cycle 23 - Federal jobs: active service counts toward family leave
Lead: J1 scan issue #232, queued as a Tier 2 read since the morning.

Finding: honorable active service counts toward the 12 months of service a federal civilian employee needs for FMLA leave under title 5, and so for paid parental leave. It has been law since 22 December 2023. OPM published a rule on 15 October 2026 that writes it into the regulations. Record: V-2026-11-15-FMLA-MILITARY-SERVICE, CONFIRMED at Tier 2 against four primary pages.

Impact: SHIP - ACT. The act is to ask the agency's servicing human resources office to count active service when invoking FMLA leave, and to elect paid parental leave for a birth or placement. The cost of not knowing is money: up to 12 workweeks of paid parental leave that cannot be used after the 12 months following the birth or placement.

What ships: one Policy Intel entry, second in the list, dated 15 OCT 2026. The latest-check stamp moves to 23:33 UTC. Cache v340 at staging, v350 after the 16 November reconciliation below.

What the entry leaves out, on purpose: any document step, because no source read named one; the rule's effective date and comment deadline, which would go stale within a month; and dual-status technicians, whose coverage was not read.

Left unread: OPM memorandum CPM 2024-05, which the browser showed without readable text. Every claim rests on the four pages that were read.

Test: six new assertions in `policy-content-regression.js`, now 211. Browser check on the built files: 13 checks pass at 393 px and 320 px, in both themes.

Gate: structural gate exit 0. Six semantic commands, the public build and seven Home regressions pass, 14 lines in all.

Open: the entry runs 1,136 characters. That is long for a phone, and the exclusions make up a third of it. The length is Dean's call.

Queued: the Dole State and Tribal Outreach Grant Program rule publishes 16 November. A recheck of this rule belongs on or after 14 December 2026, its effective date.

## Reconciliation with main, 16 November (cycle 23)
Main moved overnight. Dean merged eight Codex pull requests, #244 to #251, between 18:07 Central 15 November and 07:33 Central 16 November. Main went from `a78cfb3` (v339) to `59619aa` (v348). #243 at `dc1a563` carried v340, which production had passed, and it conflicted in `pwa-sw.js`.

Method, per `SHARED_DEVELOPMENT.md`: one merge of `origin/main` into the cycle 23 branch, with no file replaced and no forced push. Merge base `a78cfb3`. Main's side is 22 commits, eight of them merges. This side is one commit, `dc1a563`.

Accounting:
- Preserved from main: every change in #244 to #251. `index.html` merged without conflict.
- Preserved from this branch: the Policy Intel entry, the 23:33 UTC stamp, record V-2026-11-15-FMLA-MILITARY-SERVICE, six assertions and this record.
- Conflict: `pwa-sw.js`, line 1. Each side changed the cache integer and no other byte. Resolved as main's file with a new integer.
- Adapted: one assertion in `policy-content-regression.js`, described below.

After the merge the tree differs from main in five files: two hunks in `index.html`, the log entry, this record, the cache line and the content test.

Cache v350. v348 is production (#251), and #251 names 349 as its rollback. No pushed branch carries 349 or 350. An integer different from the one Codex is likely to take next also means git reports a conflict for whichever pull request merges second, so two candidates cannot ship under one cache name by accident.

Content gate on main: `npm run test:policy-content` has exited 1 on main since #246 (`cbcf6ab`) and still did at `42d7fb2`, the last commit where it was run on main alone. #251 did not touch the test or the link. One assertion fails: "CareerOneStop search opens in a new tab and is described by the sharing notice". #246 renamed the link and filled it. #250 restyled it again and added a short label for the compact results view. The link still opens in a new tab, and both notices it points to still render in the compact view.

The assertion now pins what its message states: one link, the new-tab attributes, both descriptions defined once each, and a "(new tab)" label in each view. It no longer pins the style value, the part that broke twice in a day. With the repair the content test passes at 211 assertions on the merged tree.

Gate on the final tree, the merge with `59619aa`: structural gate exit 0. Six semantic commands and the public build pass.

Sweep: 93 scripts, the 86 that passed at `a78cfb3` and the seven Codex added through #250. It ran on the merge with `42d7fb2`, and #251 merged while it ran. 84 pass. Nine fail, and the same nine fail with the same first error on main alone at `42d7fb2`.
- First failing at #244 (`e823a79`): `due-followup`, `focused-action`, `home-actions`, `home-search-handoff-browser`, `next-move-browser`, `talent-contact-browser`.
- First failing at #245 (`0331010`): `career-value-first-browser`, `location-only-search-browser`.
- First failing at #249 (`6c53997`): `tool-url-continuity-browser`. Its welcome scenario looks for the legend "Where would you like to start?", which #249 replaced. The rule it protects, `topsMemberHasSavedWork`, is still in the code, and #249 uses it in one more place.

`dd214-upload-browser` failed once in the sweep and passed three reruns. That is the known intermittent stall.

After #251: the nine were rerun on the final tree and fail as before. The two scripts #251 touched, `saved-job-learning-browser` and `learning-follow-through-browser`, pass.

Standing: 132 scripts. 85 pass. 47 fail: the 38 from before, which were not rerun, and these nine.

Repairs stay paused. The screens these scripts cover changed eight times in under 14 hours, and a repair made now would likely break again today. The nine join the standing question on the 29 Career scripts, which is Dean's call.

If main moves again before a merge order, the same steps repeat and one line is added here.
