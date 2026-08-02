# TRANSITION OPS — SKILL REGISTRY

Property book for the agentic team. The Orchestrator consults this before
delegating; force-mod maintains it. Every skill change updates this file in
the same commit.

Status codes: CODIFIED (written, validated) · PENDING (identified, not yet
written) · DEPRECATED (superseded — note by what)

| # | Skill | Owner | Status | Version | Validated | Location |
|---|-------|-------|--------|---------|-----------|----------|
| 1 | validation-gate | s3-devops | CODIFIED | 1.1 | 2026-07-31 | .claude/skills/validation-gate/ |
| 2 | deploy-discipline | s3-devops | CODIFIED | 1.2 | 2026-08-02 | .claude/skills/deploy-discipline/ |
| 3 | policy-verification | s2-intel | CODIFIED | 1.0 | 2026-07-31 | .claude/skills/policy-verification/ |
| 4 | brand-voice | pao-content | CODIFIED | 1.0 | 2026-07-31 | .claude/skills/brand-voice/ |
| 5 | resource-vetting | s2-vetting | PENDING | — | — | rubric currently embedded in s2-vetting agent prompt; extract to skill when S2 stands up (Build Step 3) |
| 6 | resume-drafter-maintenance | force-mod | PENDING | — | — | prompt QA + integrity rules for the in-app Resume Drafter |
| 7 | push-ops | s3-watch-officer | PENDING | — | — | OneSignal segments, test push procedure, delivery checks |
| 8 | outreach-correspondence | pao-content | PENDING | — | — | partner/employer email patterns (Legion, Michels-style prep) |
| 9 | proposal-onepager | pao-content | PENDING | — | — | capability statement + one-pager formats |
| 10 | brand-assets | pao-content | PENDING | — | — | Pillow pipeline, Poppins fonts, draw_letterspaced helper |

## CHANGE LOG
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
