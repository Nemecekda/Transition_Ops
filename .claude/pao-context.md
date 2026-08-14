# PAO STANDING CONTEXT

Operational context for the weekly PAO packet. **`brand-voice` is the source of
record for voice, conventions, channel discipline, and the quality gate.** This
file does not restate it. It carries only what `brand-voice` does not: the
channel roster, image specs, the two doctrines below, and the citation policy.

**DRIFT RULE.** If `.claude/skills/brand-voice/SKILL.md` changes, this file is
reviewed in the same commit. The two are one standard split across two files;
letting them drift is how a future packet cites a rule that no longer exists.
Same failure the ASSETS mapping table hit on 14 AUG 2026.

---

## CHANNEL ROSTER

| Channel | Entity | Audience | Card |
|---|---|---|---|
| TOPS Facebook | Transition OPS | service members, veterans, families | square, `tops-facebook` |
| VBS LinkedIn | Veteran Bridge Solutions | employers, institutions, B2B | landscape, `vbs-linkedin` |
| VBS Facebook | Veteran Bridge Solutions | mixed, short variant | square, `vbs-facebook` |
| CVSO / partner email | Veteran Bridge Solutions | caseworkers, VSO staff | none |

`brand-voice` CHANNEL DISCIPLINE governs what may cross-post. Employer content
does not go to Facebook. That rule is not restated here because it is not
this file's to own.

**CVSO email criterion — the only test.** *Would a caseworker hand this to a
member?* If the week's ships do not clear that bar, the packet says so and
drafts no email. A packet that manufactures an email to fill a slot trains
partners to ignore the channel.

---

## ORIGINATED DOCTRINE

Both rules below were **originated 14 AUG 2026 from Commander tasking**. They
were not previously written down anywhere in this repo. Labelled so a future
reader does not cite this file as though it were derived from an older source.

### 1. THE CATCH LEADS

**Every offer post surfaces the fine print before the benefit.** Not after, not
in a closing caveat, not in a comment.

This is the differentiator and it is deliberate. Any account can post that
something is free. The post that says *"free for a year, then it bills you at
the standard rate unless you cancel"* is the one a member forwards to someone
they care about, because it is the one that respects them.

Applied: the ChatGPT Plus card leads with the renewal term, not the free year.
A draft that buries the catch is returned, not edited.

### 2. FACEBOOK ALGORITHM GUARDRAIL

**At most one non-informational post per channel per calendar month.**

A non-informational post is anything that does not carry an actionable fact: a
milestone note, a thank-you, an anniversary. They are not banned — reach decays
without any human signal at all — but they are rationed, and they never
displace an informational post in the same week.

Every post beyond that budget must carry a fact a member can act on. If the
packet cannot find one, it drafts fewer posts. **Fewer, denser posts is the
correct failure mode; filler is not.**

---

## IMAGE BRIEF FIELDS

The packet emits one brief per draft, consumed by `tools/make-social-card.py`:

```json
{
  "channel": "tops-facebook",
  "headline": "one line, the claim",
  "chips": ["FREE", "ACTIVE", "VETERAN"],
  "panel_lines": ["the catch, first", "the second fact"],
  "footer": "transitionops.org"
}
```

Constraints the generator **enforces** — a brief that violates them is an error,
not a truncation: at most 5 chips, at most 4 panel lines, no word too wide for
the card, and total content must clear the footer. Run
`python3 tools/make-social-card.py --self-test` after changing the generator.

Chips mirror the app's eligibility vocabulary (`FREE`, `ACTIVE`, `VETERAN`,
`SPOUSE`, `GUARD/RESERVE`) so a card and a resource card read the same.

---

## CITATION POLICY

**Every factual claim in a draft traces to the app, a V-entry, or a primary
source.** Drafts carry citations inline for verification and are delivered in
two forms:

- `body_annotated` — inline `[src: ...]` markers. What Dean verifies against.
- `body_clean` — identical prose, markers removed. What Dean posts.

Two renderings, not one, and the packet produces both. Asking a human to strip
citations by hand before posting is where a wrong claim survives the edit.

Valid `src` values: a WHATS_NEW version (`v95`), a V-entry (`V-2026-013`), a
RESOURCES id (`chatgpt-plus-veterans`), or a primary-source URL. **A claim with
no traceable source does not go in the draft.** The PAO does not verify — it
cites what S2 already verified, and says so when nothing covers a claim.

---

## WHAT THE PAO NEVER DOES

Never posts, sends, publishes, schedules, or holds a credential to any
platform. It writes a packet; Dean distributes. Same relationship to comms that
J1 has to policy: detection and drafting, never action.
