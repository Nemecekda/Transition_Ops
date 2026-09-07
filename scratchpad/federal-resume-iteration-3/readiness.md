# Iteration 3 - federal number ownership

Approved by Dean: "fix and approved". Parent candidate: 3347fb69dd56fff2577adc40d5eccae714234bb5. Branch: codex/federal-resume-readiness.

The approved fix is complete locally. The federal generation request now explicitly contains the role-quantity attribution rule already enforced by the audit and validator. Only that one federal instruction changed in application code. Overall federal release remains BLOCKED: no new hosted candidate was exercised, and a separate existing punctuation comparison weakness was discovered and remains unfixed.

## Results and evidence

| Measure | Before | After / disposition |
| --- | --- | --- |
| Federal generation request explicitly names global quantity attribution requirement | Absent in 3347fb6 | Present in actual handler requests |
| Ownership fixtures added this iteration | Not previously covered as this federal matrix | 8/8 pass: three exact releases, five withholds; exact shared numeric tokens |
| Prior metadata / missing-field / TIP protection | Existing passing local fixtures | Retained and pass |
| Prescribed five local suites | Earlier candidate evidence | All five completed with exit 0 after fixture corrections |
| Actual Word-compatible rendering | Existing civilian DOCX path | LibreOffice regression passes; no new federal hosted artifact claim |
| Actual Netlify package | Existing locked versions | Pass: CLI 26.1.0, packager 14.7.1, both AI functions have required modules, jobs excludes them |
| Structural checks | Tracked inventory | 24 JS files, 16 JSON files, six YAML files, one inline JS and one JSON-LD parse; intended new JSON additionally checked before commit |
| Shared comparator with a terminal period | Pre-existing weakness | Still FAIL as an ownership safeguard for the preserved counterexample; BLOCKED-TECHNICAL |
| Hosted federal acceptance | PR #59 at 3347fb6 returned HTTP 502 | Not rerun; old failure retained |
| Manual assistive technology | Pending | Pending |

The eight cases exercise the real handler, clause inventory, and reference validator with provider responses stubbed: role-local quantities; global claims naming exact title/employer; unnamed and wrongly named global claims; wrong-role experience reference; education year citing a role date; and a redundant role-date reference. Every case makes exactly two stubbed calls (generation and audit), with no retry. Successful cases retain ten score dimensions and exact candidate text. These fixtures are not evidence that the hosted reviewer will always ground claims correctly.

No actual OpenAI call or live notification/send was made in this iteration. The explicit attribution rule's hosted effectiveness is still unverified. Five-suite PASS is local command evidence, not full federal release clearance.

## Failed attempts retained

1. iteration-3-openai.txt: test script did not parse because a new variable collided with an existing fixture name. A lexical block isolated the new fixtures; application code was not changed for it.
2. iteration-3-openai-retry.txt: the synthetic employer ending in a numeric identifier plus a comma triggered the pre-existing unsupported-number check. The fixture removed that comma so it exercises ownership rather than unrelated token punctuation. No existing assertion or application guard was weakened.
3. iteration-3-openai-final.txt: a real diagnostic counterexample, not a disposable fixture failure. An education year ending in a period was incorrectly accepted with a role-date reference under a stubbed PASS audit. This remains a failed adversarial outcome. The final eight-case matrix separately exercises identical numeric tokens; removing punctuation for those cases is not claimed to fix or clear the original counterexample.
4. iteration-3-openai-verified.txt: final required suite passes after the above fixture corrections. Other successful outputs have their corresponding suite names. The manifest preserves every original output's hash and size.

## BLOCKED-TECHNICAL - terminal punctuation in shared quantity comparison

At netlify/functions/resume.mjs:631, quantifiedValues includes terminal periods/commas in its numeric token. At lines 1043-1044, equality compares those raw tokens. Thus the same year with a sentence-ending period fails to match the bare year in role metadata, so the global-role ownership check is skipped for that reference. The full-handler counterexample returned HTTP 200 rather than the expected HTTP 502. A read-only diagnostic proves the tokenizer is byte-identical to 3347fb6, an exact shared year matches, and a period-ended equivalent does not.

This affects a shared validator and predates this federal instruction change. No production behavior was sampled to estimate frequency. A malicious or mistaken reviewer reference plus coincident numerical text is enough to demonstrate the deterministic guard's limit; a stubbed model PASS is deliberately insufficient proof of valid ownership.

The adjacent proposed-punctuation-comparison.patch is a concrete, unapplied two-line follow-up. It removes terminal periods/commas only from tokens used by this ownership comparison, preserving internal separators, decimal digits, resume/fact bytes, prompts, model settings, and export. Before accepting it, verify named/unnamed global and wrong-role behavior in both federal and civilian modes, terminal punctuation, legitimate decimals/grouping/percent/currency, repeated quantities, and same-year education references, including the exact retained counterexample. Re-run required local gates. It has not been applied or tested as a fix. Dean's approval is required because this changes shared validation; the current approval preserved that validator.

## Scope, cache, and next step

Application diff: one line in federal generation instructions. Additional files: tests and evidence. The shared validator, civilian generation/display/export, Navigator, provider configuration, models, caps, retries, transport, privacy, dependencies, workflows, schedules, and workers remain byte-identical to the parent. The known metadata/TIP fixes remain. No precached asset changed; active cache remains transition-ops-v152 and no bump is required.

One local commit records this iteration. Nothing is pushed, merged, or published by the agent. PR #59's hosted head stays 3347fb6 until Dean pushes the branch; the previous failed immutable preview was not retried. Keep PR #59 unmerged while the shared comparison issue and independent hosted federal acceptance remain unresolved. Manual Safari/VoiceOver, Chrome/NVDA, Edge/JAWS, and Android Chrome/TalkBack evidence remains pending. No new policy copy was proposed outside the approved Resume instruction change.
