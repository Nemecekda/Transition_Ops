# TRANSITION OPS — SKILL REGISTRY

Property book for the agentic team. The Orchestrator consults this before
delegating; force-mod maintains it. Every skill change updates this file in
the same commit.

Status codes: CODIFIED (written, validated) · PENDING (identified, not yet
written) · DEPRECATED (superseded — note by what)

| # | Skill | Owner | Status | Version | Validated | Location |
|---|-------|-------|--------|---------|-----------|----------|
| 1 | validation-gate | s3-devops | CODIFIED | 1.4 | 2026-08-05 | .claude/skills/validation-gate/ |
| 2 | deploy-discipline | s3-devops | CODIFIED | 1.4 | 2026-08-03 | .claude/skills/deploy-discipline/ (1.3 BURNED - see change log) |
| 3 | policy-verification | s2-intel | CODIFIED | 1.1 | 2026-08-02 | .claude/skills/policy-verification/ |
| 4 | brand-voice | pao-content | CODIFIED | 1.0 | 2026-07-31 | .claude/skills/brand-voice/ |
| 5 | resource-vetting | s2-vetting | PENDING | — | — | rubric currently embedded in s2-vetting agent prompt; extract to skill when S2 stands up (Build Step 3) |
| 6 | resume-drafter-maintenance | force-mod | PENDING | — | — | prompt QA + integrity rules for the in-app Resume Drafter |
| 7 | push-ops | s3-watch-officer | PENDING | — | — | OneSignal segments, test push procedure, delivery checks |
| 8 | outreach-correspondence | pao-content | PENDING | — | — | partner/employer email patterns (Legion, Michels-style prep) |
| 9 | proposal-onepager | pao-content | PENDING | — | — | capability statement + one-pager formats |
| 10 | brand-assets | pao-content | PENDING | — | — | Pillow pipeline, Poppins fonts, draw_letterspaced helper |
| 11 | push-worthy | pao-content | PENDING | — | — | **CRITERIA** for recommending a user push: gates G1–G5, criteria P1–P4, disqualifiers X1–X5, governors U1–U5. Doctrine drafted at `intel/scheduled-ops-design.md` §F, awaiting Commander ruling. PENDING until regression set PW-1…PW-9 + PW-X1…PW-X4 executes |

**Scope fence between #7 and #11 — read before extending either.** `push-ops`
(#7) owns **mechanics only**: OneSignal segments, send procedure, delivery and
opt-out telemetry, channel liveness testing. `push-worthy` (#11) owns **whether
a push is justified at all**. Criteria live in #11 and never in #7.

The fence exists because #7 is PENDING, names OneSignal, and is the row someone
will point at in three months to claim the gap is covered. It is not, and the
ownership matters: #7's owner is s3-watch-officer, a Haiku detection-and-report
agent. **The decision about what interrupts every user's phone must not end up
owned by the cheapest agent on the roster.** Same seam pattern as
validation-gate / deploy-discipline 1.1(d).

## CHANGE LOG
- 2026-08-05 — **#11 `push-worthy` added as PENDING; #7 `push-ops` fenced.**
  Coverage test returned **NONE**: no existing skill covers push-recommendation
  criteria, and the nearest doctrine (§D.4) is a *prohibition* on routing
  operator alerts through OneSignal — so an agent searching the registry finds
  "don't" and no rule saying when it may. That shape produces paralysis or
  improvisation. Doctrine drafted as design-doc **§F**, deliberately NOT as a
  §D.6: §D and N5 forbid a third severity tier, and PUSH-WORTHY is a different
  axis (§D grades how the machine reaches Dean; §F grades whether Dean reaches
  users). F0 carries the non-amendment clause. Commander's fourth candidate
  criterion, "major family/spouse development," **deleted** — a topic has no
  threshold, and it would have pushed the spouse-commission EO that the
  regression set requires to return NO. Orchestrator corrected force-mod's
  label-attachment rule, which excluded NO-APP-EXPOSURE and would have made its
  own VET TEC 2.0 YES case unreachable. Lane: **COMMANDER**, all of it — blast
  radius is every subscribed user's lock screen. Registration blocked on
  PW-1…PW-9 and PW-X1…PW-X4, plus V-17.
- 2026-07-31 — Registry established. Skills 1–4 codified from workflows
  reconstructed out of project session history (Phase 1, Build Step 1).
  Skills 5–10 scheduled for codification during Build Steps 2–5.
- 2026-07-31 - validation-gate 1.0 -> 1.1. (a) Adds INTEGRITY MODE: a defined
  procedure branch when `git status --porcelain` is empty, with prescribed
  substitute checks for the three diff-scoped steps (1 presence, 2 absence,
  5 untouched-region) plus explicit reporting rules that keep N/A as N/A.
  (b) Promotes `node --check` and `JSON.parse` to the primary structural check;
  brace/paren/bracket counting is demoted to a labeled fallback for when no
  parser is available or raw JSX is present. (c) Encoding check tightened to
  the real invariant: curly quotes and U+00A0 are hard zero, em/en dashes are
  legitimate in HTML text and are not defects. Driver: s3-devops read-only gate
  run at dd4e1f0 against a clean tree had to improvise substitute checks and
  fell back to brace counting. FAILURE RESPONSE and Evidence rules unchanged.
  Drafted by force-mod, validated by s3-devops regression cases R1-R4.
  Lane: COMMANDER (touches the deploy pipeline). Owner s3-devops.
  Open follow-up: regression case R5 (cross-skill non-interference vs
  deploy-discipline #2 and policy-verification #3) specified but not
  executed; tracked, not blocking.
- 2026-08-01 - deploy-discipline 1.0 -> 1.1. Adds a mandatory service-worker
  cache-bump requirement as FORWARD PATH step 2, placed before the
  validation gate so the bump is covered by a single gate run instead of
  triggering FAILURE RESPONSE rerun. (a) Defines the bump trigger as any
  change to a file backing an entry in the `sw.js` ASSETS list, enumerated
  as an entry-to-repo-file table (index.html, manifest.json, both icons,
  va-math/index.html, both vendor/react files) with a `git diff
  --name-only` trigger check, a `git diff | grep CACHE_NAME` proof check,
  and an ASSETS drift check that stops and flags force-mod if sw.js
  enumerates an asset the skill does not. (b) States the mechanism
  accurately: sw.js is NETWORK FIRST with a 3500 ms timeout and re-caches
  successful GETs, so online users self-heal; the exposed population is
  users on dead or >3.5s connections, who are served the install-time
  precached shell. Narrow and real, deliberately not inflated. (c) Firewalls
  `APP_VERSION` (index.html:2560): it is not the cache counter, it gates the
  What's New badge (read 4254, written 6439, coupled to WHATS_NEW[0].v), and
  bumping it re-shows the panel to every user. Three counters - CACHE_NAME,
  APP_VERSION, and the cosmetic PWA BUILD comment at index.html:497 - are
  documented as deliberately independent and MUST NOT be unified; APP_VERSION
  and WHATS_NEW are Dean's editorial call and require COMMANDER approval.
  (d) Adds a SKILL SEAM section splitting ownership with validation-gate 1.1:
  the gate owns parse, encoding, and untouched-region on sw.js; this skill
  owns whether a bump was required, whether the integer moved forward, and
  whether it was ever used. GATE PASS is explicitly not cache-bump
  clearance. (e) ROLLBACK gains a mandatory forward bump: a revert restores
  the prior CACHE_NAME, and a subsequent re-land at current+1 reproduces a
  cache name that already holds the defective shell byte-identically, so no
  worker update is detected and offline users keep the defect indefinitely.
  Next number is therefore derived from main's history (max ever + 1), never
  from the current file value; reverted integers are burned permanently.
  PROHIBITED list extended by four items. v1.0 content, numbering intent, and
  voice preserved; existing steps are verbatim, renumbered 2-5 to 3-6.
  Driver: force-mod cache-staleness gap note, corrected on severity framing
  by the Commander. Drafted by force-mod; regression spec R1-R6 in
  `deploy-discipline-coverage-v1.1.md`, executed by s3-devops.
  Lane: COMMANDER (deploy pipeline). Owner s3-devops.
  Closes the prior open follow-up on validation-gate R5 cross-skill
  non-interference for the deploy-discipline pair (R5 here); the
  policy-verification pair is covered by R6.
- 2026-08-02 - deploy-discipline 1.1 -> 1.2. Never-push doctrine. (a) PROHIBITED
  gains a new first entry: pushing to `origin` is prohibited on any branch in any
  circumstance; agents stage local commits and Dean merges and pushes. The
  rationale is recorded in the entry itself - "branches but not main" is a
  judgment call, `main` auto-publishes, and a rule requiring the agent to
  classify the target correctly every time is one mistake from a deploy.
  (b) FORWARD PATH step 4 rewritten from "Open a PR to `main`" (which implied
  push authority) to staging the branch locally for Dean to merge and push.
  Driver: the Commander set this as standing doctrine on 2026-08-02 after an
  agent attempted `git push -u origin <feature-branch>` to package a validated
  branch for review. That specific push was assessed harmless; the objection was
  to the rule it implied. Drafted by the Commander, applied by the Orchestrator -
  NOT routed through force-mod, and no regression cases were written or run.
  Lane: COMMANDER (deploy pipeline). Owner s3-devops.
  (c) FORWARD PATH steps 5 and 6 rewritten, because step 4 orphaned them. Both
  assumed a pushed branch - step 5 directed validation on a Netlify Deploy
  Preview URL, step 6 required handing over a "PR link, preview URL" - and
  neither artifact can exist at agent handoff once agents do not push. Step 5 is
  now local validation, with an explicit bar on claiming preview evidence that
  cannot exist. Step 6 now requires branch name, `git log --oneline`, diffstat,
  gate evidence, cache-bump line, blast radius, and a PREVIEW CALL.
  (d) Adds STEP 6 DETAIL - THE PREVIEW CALL. The handoff must state whether the
  diff warrants a pre-merge preview and why: default NO for doctrine and process
  ships (`.claude/**`, `skills-registry.md`, `intel/**`, `*.md`), default YES for
  anything user-facing (index.html, manifest.json, icons, va-math/, vendor/**,
  sw.js caching logic). When Dean wants one, HE publishes the branch from GitHub
  Desktop and validates before merging; agents still never push. Omitting the
  call is an incomplete handoff - silence reads as "not needed."
  Validation: the Commander accepted this doctrine as validated by his own
  review on 2026-08-02. No force-mod regression cases were written or run, by
  his explicit decision. The prior blocking follow-up on steps 5 and 6 is CLOSED.
- 2026-08-02 - policy-verification 1.0 -> 1.1. Walled-source doctrine. The skill
  assumed primary sources are reachable; in practice congress.gov, DFAS.mil,
  eCFR.gov, dcsa.mil, esd.whs.mil, veterans.house.gov and ftb.ca.gov return 403
  or bot-walls, and findings were sitting at PROBABLE for ACCESS reasons rather
  than EVIDENCE reasons. (a) Adds WALLED SOURCES: separates access failure from
  evidence failure and introduces a fourth rating, BLOCKED (source not read),
  with a required record of host, status, highest tier attempted, and date.
  BLOCKED does not ship and is not a resting state. (b) Adds ESCALATION LADDER:
  tier 1 WebFetch, tier 2 orchestrator-only Chrome browser
  (mcp__claude-in-chrome__navigate then get_page_text, proven 2026-08-02 against
  a congress.gov Cloudflare interstitial and veterans.house.gov), tier 3 human
  verification by Dean as a FULL citation of record with a mandatory auditable
  record format, tier 4 only then rate below CONFIRMED. CAPTCHA solving or
  bypass is PROHIBITED and a challenge demanding human interaction ends tier 2.
  Encodes the SUBAGENT LIMIT: s2-intel/s2-scanner/s2-vetting have no browser
  tools, so an analyst reports the wall and stops while the orchestrator runs
  tier 2 and hands page text down. (c) Adds the AMENDED-BILL RULE: an
  introduced-version summary is not evidence about a bill that passed as
  amended; "as amended" in the actions or a title change between versions voids
  it and the engrossed text settles content. Driver is a live production error -
  the app claimed H.R. 980 provided "monthly VA outreach" reasoned off the
  introduced-version CRS summary, while the engrossed text SEC. 4(a) is a
  contact-information requirement with no cadence anywhere in the bill.
  Distinguishes standalone CRS products (admissible; IF10260 carried the 3.8%
  pay raise) from version-scoped CRS bill summaries.
  Drafted by force-mod. Regression spec P1-P6 specified, NOT executed.
  Lane: COMMANDER (benefits/policy content). Owner s2-intel.
  (d) Charter patch, same branch: `.claude/agents/s2-intel.md` enumerated exactly
  CONFIRMED / PROBABLE / UNVERIFIED, which left the new BLOCKED rating
  unreachable by the agent that owns this skill. Its rating enumeration now
  carries BLOCKED, with the no-browser-tools constraint and an explicit bar on
  downgrading a wall to PROBABLE. Flagged by force-mod during the draft,
  authorized by the Commander 2026-08-02, applied here. Prior blocking
  follow-up CLOSED.
- 2026-08-02 - validation-gate 1.1 -> 1.2. No-unreviewed-bulk-scripts doctrine,
  standing Commander feedback from 2026-07-31 now codified. force-mod placed it
  here over a deploy-discipline addendum: the rule governs the interval between
  an edit being approved and an edit being proven, which is this skill's whole
  subject; three of its four requirements extend checks the skill already owns;
  and EDIT MODE fires on ANY code change by ANY agent, including work reverted
  before handoff - which is exactly when unreviewed scripts do their damage.
  Adds EDIT APPLICATION (EDIT MODE, before step 1): (A) discrete edits with old
  and new shown - "applied 6 changes" is not a report; (B) a grep -c count after
  EVERY edit, expected vs actual, expectation derived from the file and never
  defaulted to 1 because the POLICY INTEL panel renders twice byte-identically;
  (C) an itemized hunk-by-hunk diff before the commit is written; (D) user-facing
  wording requires Dean's personal approval however mechanical the edit looks -
  COMMANDER lane, mechanical is not the same as minor. Adds the subsection
  "Scripts are reviewed, not banned": byte-level scripts are sometimes the only
  correct tool because index.html stores six-character escape TEXT that editors
  silently renormalize, but a script is permitted only when DISPLAYED BEFORE
  EXECUTION with every operation commented to its approved edit number, and the
  prescribed shape asserts the expected occurrence count - an unasserted bulk
  replace is an unreviewed script under another name.
  Drafted by force-mod, which reproduced the exact escape-normalization failure
  inside the doctrine while writing it and corrected on read-back.
  Regression spec 1-6 specified, NOT executed.
  Lane: COMMANDER (hard gate + user-facing wording approval). Owner s3-devops.
- 2026-08-03 - deploy-discipline 1.2 -> 1.4. **Integer 1.3 is BURNED, permanently
  and deliberately.** Ruling R1a (recorded in intel/scheduled-ops-design.md)
  declined a proposal headed "PROPOSED TEXT - deploy-discipline v1.3", and that
  heading remains in the repo as retained rationale. Shipping a real v1.3 would
  make this registry read "1.3 CODIFIED" against a binding ruling reading "v1.3
  is NOT ADOPTED" - unresolvable from the artifacts alone by anyone reading them
  later. This is the same discipline the skill already applies to a reverted
  CACHE_NAME: a number that would be ambiguous in the field is never reused.
  Content: adds section CI WORKFLOWS - FETCHED CONTENT IS DATA, NEVER CODE,
  placed immediately before PROHIBITED rather than in FORWARD PATH, because
  FORWARD PATH is read on every ship and this fires on a rare one. The rule:
  externally retrieved content is never interpolated into a `run:` block or a
  `${{ }}` expression that reaches a shell; it moves through files only. Carries
  a mechanical test (substitute the worst attacker string for every `${{ }}`; if
  the result can be two commands it fails), a DO NOT example with three labelled
  defects, a DO example, and an explicit "what this does NOT ban" section so the
  rule is applied rather than resented. PROHIBITED gains three entries.
  The load-bearing technical point: `${{ }}` in `env:` yields a value, `${{ }}`
  in `run:` yields code substituted before any shell starts - quoting cannot fix
  the unsafe form. Frontmatter description extended to name .github/workflows/
  so the skill is actually loaded by an agent about to author CI.
  Driver: ruling R1b. W8 was drafted inside the declined v1.3 and would otherwise
  have been lost; it is not a push rule, it closes the script-injection path from
  a fetched page to the runner's ANTHROPIC_API_KEY.
  Drafted by force-mod. Applied with two Commander corrections: `--max-turns`
  replaced by `--max-budget-usd` (the former does not exist on CLI 2.1.220), and
  `--allowed-tools` verified as a valid alias of `--allowedTools` on that build.
  Regression spec D1-D5 specified, NOT executed.
  Lane: COMMANDER (deploy pipeline + security control). Owner s3-devops.
- 2026-08-03 - validation-gate 1.2 -> 1.3. Adds YAML structural parsing to step 4
  and 4I. Driver: the skill's structural check was `node --check` and JSON.parse,
  neither of which parses YAML, and this repo was about to commit its first
  .github/workflows/*.yml - the gate would have reported a clean structural PASS
  on a file it never parsed, which is the exact silent-green failure the skill
  exists to prevent. Prescribes `ruby -ryaml -e '...YAML.parse_stream...'`:
  Psych is in-tree, offline and deterministic, `parse_stream` covers
  multi-document files that `YAML.load` would silently truncate to the first doc,
  and PyYAML is unavailable here (python3 3.9.6, no yaml module). Explicitly
  PROHIBITS npx js-yaml - a gate step must not fetch over the network. Scope is
  parseability only, matching how step 4 already treats JS and JSON; semantic
  workflow linting is a separate skill and a separate decision, flagged to Dean
  and not bolted on. Records the YAML 1.1 trap (bare `on` parses as boolean
  true - verified, a workflow's top-level keys come back as ["name", true,
  "jobs"]) and a labelled no-Ruby FALLBACK. Block inventory now records the YAML
  set; the empty set is a valid fingerprint that must be reported, never omitted.
  Also adds DO NOT PIPE THIS COMMAND: `ruby ... | head` makes $? report head, so
  a Psych::SyntaxError prints while the step still exits 0. Found by executing
  the cases, not by reading them.
  Drafted by force-mod. Regression cases Y1-Y5 **EXECUTED**, evidence in
  intel/scheduled-ops-design.md section 8.4 - including the deliberate
  scope-boundary case (valid YAML, semantically garbage, must PASS). force-mod
  argued this item must close on execution rather than on the text landing,
  because it is the gate standing between this repo and its first workflow
  commit; that argument was accepted.
  Lane: COMMANDER (hard gate). Owner s3-devops.
- 2026-08-05 - **validation-gate 1.3 -> 1.4. Adds step 4S, `actionlint`, to EDIT
  MODE.** Driver: the J2 startup failure of 3 AUG 2026
  (`intel/scheduled-ops-design.md` section 8.10). A shell comment inside a `run:`
  block held an Actions expression with an empty body; GitHub substitutes
  expressions textually before any shell exists, so the leading `#` protected
  nothing and the file was rejected at startup with zero steps run. Every local
  layer passed - YAML parsed under Psych, Python compiled, governor regression
  7/7 - because none of them is GitHub's schema.
  (a) 4S fires only when the diff touches `.github/workflows/`, runs AFTER step
  4's Ruby parse and BEFORE staging. Neither layer replaces the other: step 4
  covers every YAML in the repo with an in-tree offline parser and remains the
  fallback authority when the binary is missing or its hash fails.
  (b) Pinned to v1.7.12, `actionlint_1.7.12_darwin_arm64.tar.gz`, SHA-256
  `aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f`, per the V-6
  discipline. **Hash verified before extraction on install and matched character
  for character.** `brew install` is non-conforming; `-version` is checked every
  run.
  (c) Carries the DO NOT PIPE warning forward from step 4 verbatim.
  (d) LOCAL gate, explicitly NOT a CI job (W-2).
  (e) Binding DISPOSITION RULE: zero findings is the only PASS, a hit inside a
  comment is still a hit, and "COMMENT (inert)" is a prohibited disposition - it
  is what cleared the 8.10 defect after the sweep had already found it.
  **(f) Non-coverage list, REWRITTEN FROM MEASURED EVIDENCE rather than carried
  over from the drafted text.** R0-R11 executed 5 AUG 2026, and three coverage
  claims in the draft did not survive execution and were struck before the text
  was applied: **shell analysis of `run:` bodies is INERT** - actionlint delegates
  to a separate `shellcheck` binary which is not installed, so section 8.9's gap
  stays OPEN (R6); **`github.event.*` payload is not validated against the
  trigger** - `github.event` is typed as a bare object (R4); and **`with:` input
  names are not checked on SHA-pinned refs** - the input dataset is tag-keyed, so
  the full-SHA form V-6 mandates silently disables input validation (R7).
  SHA-pinning of `uses:` is likewise not enforced by actionlint (R5), so 4S
  carries **its own mechanical SHA-pin assertion** as a separate bullet: full
  40-hex commit SHA required, local `./` actions exempt, a version comment is not
  a pin, and the check is pure `grep` so it still runs when the binary is
  unavailable. The V-6 control is now asserted by the gate rather than only
  cross-referenced from it. Regression R11 (unpinned MUST FAIL, negative control
  against the live files, self-certifying `@tag # pinned` case). Commander ruling
  3 AUG 2026, flag 2 of the W-2 package resolved as option (b).
  (g) Section 8.4's scope-boundary case (valid YAML, semantically garbage as a
  workflow) still PASSES step 4 and now FAILS the gate (R9). The verdict change is
  deliberate and recorded here so a future reader does not read it as a
  regression.
  **Regression evidence: R0-R11 executed 5 AUG 2026, full results at
  `intel/scheduled-ops-design.md` section 8.14. The registry advanced on
  execution, not on approval.**
  Basis: Commander ruling W-2, 3 AUG 2026, `intel/scheduled-ops-design.md`
  section 8.5. Drafted by force-mod in
  `intel/patch-2026-08-03-validation-gate-1.4-actionlint.md`; corrected against
  evidence and applied by the Orchestrator, 5 AUG 2026.
  Lane: COMMANDER (hard gate). Owner s3-devops.
