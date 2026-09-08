# Transition OPS — social drafts for Commander review

Prepared 2026-09-08. Drafts only; nothing published or sent.

## LinkedIn — employers, HR, veteran ERGs, transition partners

The updated Transition OPS Resume Drafter is live: civilian and federal formats, a fact-review step, and a Word-compatible download for editing.

For employers, HR teams, veteran ERG leaders, and transition partners, this is a free resource to refer transitioning members to. Members enter their experience, review the extracted facts, and use the drafter to prepare a resume they can review and revise for their job search.

The app also includes a transition timeline, checklists, and reminders members can use themselves as their plans change. A new target role or an accomplishment missing from an earlier draft gives them a concrete reason to revisit the Resume tool.

Refer a transitioning member to the updated Resume Drafter: https://transitionops.org/

## Facebook — service members and families

The updated Transition OPS Resume Drafter is live, with civilian and federal formats and a Word-compatible download you can edit.

It starts with your experience and a fact-review step before drafting. That gives you a chance to check what the tool pulled from your input before using it in your resume. The download gives you a draft to review and revise for the job you want.

Transition OPS is free and serves members and families across every branch. The app also has a transition timeline, checklists, reminders, and Critical Windows for your planning. A different target job or an accomplishment you left out is a practical reason to revisit your resume.

Start your next resume draft at https://transitionops.org/

## Conditional update — deferred

Future improvement copy will be drafted after final implementation and production evidence arrive. Neither post announces unimplemented return features.

## Internal claim ledger — not for posting

Release anchor supplied by the commissioning task: production https://transitionops.org/ verified at merged PR46, commit e9a84fe2c94cecd4b76b70880fc3a76a36e1e469, with the same tree as root 0fd3c45. Local HEAD inspected: 0fd3c45233c4c21437d55d646a310e6333d6825b. This drafting pass inspected local implementation; it did not independently repeat production verification.

Source root: /Users/deannemecek/Documents/Documents - Dean’s MacBook Pro/GitHub/Transition_Ops.

| Claim or framing | Source / function / release anchor | Scope of claim |
| --- | --- | --- |
| Free Transition OPS tool | Mission context supplied with assignment; known live release above | No assertion of unlimited AI generations. |
| AI Resume Drafter; civilian and federal formats | index.html:8273–8286, aiR.mode; netlify/functions/resume.mjs:1169–1172, createOpenAIClient and OpenAI model selection (actual path verified with rg --files); index.html:8273, fact-review-before-drafting description; known live release | Availability of draft formats only; no acceptance, hiring, ATS, or quality guarantee. OpenAI is the implementation provider; no endorsement implied. |
| Word-compatible download for review and editing | index.html:4656, buildTransitionOpsResumeDocx; index.html:8435, Federal_Resume_Draft.doc; index.html:8440, Resume_Draft.docx | Deliberately says Word-compatible; does not label both formats native DOCX. |
| Timeline and checklists | index.html:8138, timeline navigation; index.html:8225, checklist rendering and m.tasks | Existing tools; no new workflow announced. |
| Reminders and Critical Windows | index.html:3433, generateCriticalWindowReminders; index.html:7582–7583, reminder navigation; index.html:14529–14530, completion/restore; index.html:14538 onward, Critical Windows tab | Feature existence only; no benefits dates, amounts, eligibility conclusions, or guaranteed delivery of notifications. |
| Privacy dialog is live | index.html:15422, Privacy control; commissioning task release evidence | Internal release context only. Public copy makes no data-handling, security, or compliance claim. |
| Useful reasons to return | Editorial suggestions: revisit open tasks, changed plans, target jobs, and omitted accomplishments | Proposed member behavior, not measured usage or outcomes. Actual retention is UNMEASURED. |
| Future return improvements | No implementation evidence yet | Conditional copy is deferred pending final implementation evidence. No public percentage improvement claim. |

## Channel and voice check

- LinkedIn: employer/HR/veteran ERG/transition-partner audience only; one CTA, to refer a transitioning member to the updated Resume Drafter. Members operate the app themselves; no employer access to saved plans or shared employer dashboard is implied.
- Facebook: service-member/family audience only; every-branch language; no branch-specific separation terminology needed. One CTA, to start a resume draft.
- Both: direct opening, practical use, no engagement bait, invented partnerships, testimonials, outcome metrics, or benefits promises. No federal-acceptance guarantee. No outreach sign-off needed for these social posts.
- Skill used: .agents/skills/brand-voice/SKILL.md. Registry row 4: brand-voice, pao-content, CODIFIED, v1.0, validated 2026-07-31. Registry lists the legacy .claude/skills/brand-voice/ location; this assignment explicitly directed the .agents skill. No registry changes made.

## Optional visual brief — no generation requested

Use an actual screenshot of the verified live release with fictional demonstration inputs and no personal information. Keep text large and contrast strong; avoid benefits amounts or dates in the crop.

- LinkedIn: headline “Updated Resume Drafter.” Show the live resume format controls and download option with demonstration content. Small footer: Transition OPS. No partner logos or endorsement cues.
- Facebook: headline “Your next resume draft starts here.” Show the live Resume tool with demonstration content. Small footer: Transition OPS.
- Draft alt text after choosing the actual screenshot, describing the visible tool and task. Keep the post's CTA as the single ask; add no second ask to the graphic.
