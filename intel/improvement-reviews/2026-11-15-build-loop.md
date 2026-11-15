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
| 1 | TAMP Guard/Reserve eligibility and reimbursement | Use a health benefit the member has earned | None | SHIP - ACT | Cycle 1 |
| 2 | CareerOneStop Job Finder and Veterans Job Matcher links | Find private-sector openings by role and area | The member's browser opens a federal site | ADOPT | Next |
| 3 | Candidate introduction to VBS carries role, location, availability and member-chosen experience | Reach a recruiter with a usable summary | The member's own email app; the app sends nothing | LOCAL SYNTHETIC TEST | Queued |
| 4 | VBS roles block with end dates | See named roles, Wisconsin first | A list Dean controls | WATCH: needs Dean's roles and disclosure line | Mechanism can be built; shows nothing until roles exist |
| 5 | Replace the hand-kept SkillBridge feed with the official check | Avoid acting on a stale opening | None | ADOPT | Queued |
| 6 | HIRE Vets Medallion: official awardee table, Wisconsin rows | Find employers with federal recognition | None | WATCH until the 2026 table is read at Tier 2 | Queued |
| 7 | Start-date planner | Know and state when civilian work can start | Device-local | LOCAL SYNTHETIC TEST | Queued |
| 8 | Starting points for every state | Find the state veterans agency and job bank | None | WATCH until S2 verifies the links | Queued |
| 9 | JST and VMET reading beside the DD214 | Turn records into resume evidence | Device-local read; member-approved excerpts to AI | LOCAL SYNTHETIC TEST; design packet first under `resume-drafter-maintenance` | Queued |
| 10 | What's New and the verified stamp | See what changed since the last visit | None | WATCH: needs Dean's ruling | Parked |
| 11 | Best Military Resume link | Resume and interview practice | Third-party account | REJECT for now: s2-vetting found no verifiable legal entity; reopens on Dean's outreach to the founder | Parked |
| 12 | "Returning to Wisconsin" landing page | Be found by search | Widens the public build allowlist | WATCH: deploy pipeline ruling | Parked |

## Needs Dean
- Best Military Resume: legal entity name and registration, current free and paid terms, whether a mock interview tool exists, and what "Partner Organizations" receive. The current site gives a free account 2 tailored resumes and 2 company research reports; cover letters are paid; resume building needs an account.
- The first VBS roles to post, and the disclosure line for who pays VBS.
- Ruling on What's New and the "verified 1 AUG 2026" stamp.
- Rulings still open from 14 November: per-tool counters and push.
- The organization name on Air Tech's SkillBridge MOU.

## Reconciliation at loop start
`origin/main` was `92fb1a8`. Published branches not merged into `main`: the three Claude pull request branches combined in the base, and 14 older `codex/` branches dated 7 September to 25 October whose names match merged pull requests. Those older branches were not re-audited. No `codex/` branch is newer than 25 October.

## Cycle 1 - TAMP Guard/Reserve eligibility and reimbursement
Why first: accuracy outranks features, and Guard and Reserve members are a core audience.

Finding: a DoD memo (corrected copy stamped 27 AUG 2026, first issued 10 AUG 2026) says Reserve Component members called or ordered to, or retained on, active duty for at least 31 days under 10 U.S.C. 12304b or a contingency operation, including those who volunteered under 10 U.S.C. 12301(d), do not need to show a connection to a war, contingency operation or national emergency. Members found ineligible on or after 24 APR 2020 for that reason may request reimbursement from the Defense Health Agency by email.

How it was verified: s2-intel searched at Tier 1 and correctly rated the press lead UNVERIFIED. The orchestrator then read the memo itself and an Air Force Reserve notice at Tier 2, and confirmed that tricare.mil/TAMP still shows the earlier wording with a "Last Updated 5/15/2025" stamp. Records: V-2026-11-15-TAMP-RESERVE-ELIGIBILITY and V-2026-11-15-TAMP-REIMBURSEMENT.

What changed: the TAMP eligibility list, note, heading, action steps and sources in Critical Windows; the Guard/Reserve demobilization line; the Navigator corpus line; one new policy entry. Nine regression checks were added, including one that fails if the superseded wording returns on any surface.

Tooling note: the Navigator text lives in an OpenAI entry function, which triggers gate step 4N. `netlify-cli` 26.1.0, the version in the project's records, was installed in the Claude workspace before the gate so that step could run as written.

Gate evidence and the hosted preview check are in the pull request.
