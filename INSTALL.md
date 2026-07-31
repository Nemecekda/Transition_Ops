# INSTALL — TRANSITION OPS AGENT TEAM (Build Step 1)

Execute on the MacBook Pro. Estimated time: 15 minutes. Nothing here touches
index.html or production — these files are purely additive.

## 1. INSTALL NODE.JS (one-time; Claude Code requires it)
Your MacBook does not have Node installed. Get the LTS installer:
- Go to https://nodejs.org → download the macOS LTS installer → run it.
- Verify in Terminal:
```
node --version
```
Any v18+ result is a pass.

## 2. INSTALL CLAUDE CODE (one-time)
```
npm install -g @anthropic-ai/claude-code
claude --version
```
Docs if anything fights you: https://docs.claude.com/en/docs/claude-code/overview

## 3. EMPLACE THE TEAM FILES
Unzip transition-ops-agents.zip. Drag its CONTENTS into the repo root:
`/Users/deannemecek/Documents/GitHub/Transition_Ops/`

After the move, the repo should contain (alongside your existing files):
```
Transition_Ops/
├── CLAUDE.md                  ← Orchestrator standing orders
├── skills-registry.md         ← the property book
├── INSTALL.md                 ← this file
└── .claude/
    ├── agents/                ← 7 staff officers
    └── skills/                ← 4 codified SOPs
```
Note: .claude is a hidden folder. In Finder, Cmd+Shift+. toggles hidden
files visible if you need to confirm placement.

## 4. COMMIT (your normal workflow)
GitHub Desktop → review the added files → commit to main → push.
This is safe: no code files changed, so the Netlify build redeploys the
identical app. (If you prefer zero deploys, commit to a branch and merge
at your convenience — Commander's call.)

## 5. FIRST SESSION
```
cd /Users/deannemecek/Documents/GitHub/Transition_Ops
claude
```
Sign in with your claude.ai account when prompted. Then try, in order:

1. `Read CLAUDE.md and skills-registry.md and give me a SITREP on the team's current state.`
   — confirms the Orchestrator loaded its standing orders.
2. `Have s3-devops run the validation gate against the current working tree and report evidence.`
   — first live delegation. Watch it hand off to the subagent.
3. `A user reports the app shows a TRICARE premium that looks outdated. Walk me through how the team would handle it — don't execute, just brief the plan.`
   — dry-fires the recursive loop: S2 verification, gate classification,
   S3 staging, your approval point.

## COST NOTES
- Interactive sessions like the above run under your claude.ai subscription
  login — they do not burn the $75–100 API budget. The API budget activates
  at Build Step 3 when GitHub Actions runs scheduled sweeps headless with an
  API key.
- Main-session model: default is fine for routine work. For architecture and
  planning sessions, start with `claude --model opus` deliberately — that is
  the Opus tier doing what you pay Opus for, on purpose, not by accident.

## WHAT'S DELIBERATELY NOT HERE YET (per build order)
- Step 2: automated pre-merge tests + GitHub Actions PR validation (S3)
- Step 3: Neon Postgres via Netlify, S2 cron sweeps, email/Twilio alerting
- Step 4: force-mod regression case library
- Step 5: remaining PAO skills (8, 9, 10 in the registry)
