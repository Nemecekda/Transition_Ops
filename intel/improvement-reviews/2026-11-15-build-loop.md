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
| 4 | VBS roles block with end dates | See named roles, Wisconsin first | A list Dean controls | WATCH: needs Dean's roles and disclosure line | Mechanism can be built; shows nothing until roles exist |
| 5 | Replace the hand-kept SkillBridge feed with the official check | Avoid acting on a stale opening | None | ADOPT | Queued |
| 6 | HIRE Vets Medallion: links to the official recipient list, national and Wisconsin | Find employers with federal recognition | None; the member's browser opens a federal site | ADOPT | Cycle 4 |
| 7 | Start-date planner | Know and state when civilian work can start | Device-local | LOCAL SYNTHETIC TEST | Queued |
| 8 | Starting points for every state | Find the state veterans agency and job bank | None | WATCH until S2 verifies the links | Queued |
| 9 | JST and VMET reading beside the DD214 | Turn records into resume evidence | Device-local read; member-approved excerpts to AI | LOCAL SYNTHETIC TEST; design packet first under `resume-drafter-maintenance` | Queued |
| 10 | What's New and the verified stamp | See what changed since the last visit | None | WATCH: needs Dean's ruling | Parked |
| 11 | Best Military Resume link | Resume and interview practice | Third-party account | REJECT for now: s2-vetting found no verifiable legal entity; reopens on Dean's outreach to the founder | Parked |
| 12 | "Returning to Wisconsin" landing page | Be found by search | Widens the public build allowlist | WATCH: deploy pipeline ruling | Parked |
| 13 | Repair three stale job-search browser harnesses, and diagnose `wisconsin-pathway-browser-regression` | Keep the safety net honest | None; tests only until the cause is known | AUTO lane for tests; any app fix returns to Dean | Queued |

## Needs Dean
- Best Military Resume: legal entity name and registration, current free and paid terms, whether a mock interview tool exists, and what "Partner Organizations" receive. The current site gives a free account 2 tailored resumes and 2 company research reports; cover letters are paid; resume building needs an account.
- The first VBS roles to post, and the disclosure line for who pays VBS.
- Ruling on What's New and the "verified 1 AUG 2026" stamp.
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

Baseline note from cycle 4's gate: `wisconsin-pathway-browser-regression` fails while waiting for a "For this visit" status after the member chooses to use a plan for one visit. The same failure occurs on `main` at `5543926` and at `92fb1a8`, the commit before today's first merge, so this cycle did not cause it. The cause is not yet diagnosed. Either the harness is stale or the status does not render. Backlog row 13 covers it.

One layout fix inside this cycle: the first browser check showed the job-search note running straight into the paragraph after it. The note now carries a 14 px bottom margin.
