# TRANSITION OPS — SKILL REGISTRY

Property book for the agentic team. The Orchestrator consults this before
delegating; force-mod maintains it. Every skill change updates this file in
the same commit.

Status codes: CODIFIED (written, validated) · PENDING (identified, not yet
written) · DEPRECATED (superseded — note by what)

| # | Skill | Owner | Status | Version | Validated | Location |
|---|-------|-------|--------|---------|-----------|----------|
| 1 | validation-gate | s3-devops | CODIFIED | 1.0 | 2026-07-31 | .claude/skills/validation-gate/ |
| 2 | deploy-discipline | s3-devops | CODIFIED | 1.0 | 2026-07-31 | .claude/skills/deploy-discipline/ |
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
