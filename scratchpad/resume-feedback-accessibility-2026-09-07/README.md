# Resume feedback fix and release readiness

Date: 2026-09-07. Branch: `codex/resume-error-accessibility`.
Base: `f63ace2e41afcb01893ce5c2e7706c4881051b11`, the merged PR59 candidate on
`ops/openai-parallel-clone`. PR46 remains open into main. Main was last read at
`d82516389ed5906febad467cfe57887acda97053`. This is local fix acceptance, not
production release clearance.

## Defect and correction

On the immutable f63 preview, opening Career > AI Resume Drafter and submitting
empty input displayed the existing validation message, but it was outside any
alert/live region. Chrome reported the document body as the focused element.
The only live region was the empty global toast. The form fit 375 and 320 CSS
pixel widths without horizontal overflow; the browser error log was empty.

Before editing, the expected result was announced error text, retained keyboard
focus, and at most one request while busy. The local baseline stopped on its
first required busy-button assertion. Unlike the visible Chrome click test,
headless Chrome temporarily retained focus on the natively disabled button;
the test did not treat this platform difference as proof of reliable focus.

The shipped handler now keeps a native button focusable, sets `aria-disabled`
while busy, and rejects repeat activations with the existing loading state.
The existing error text updates a persistent atomic alert, associated with the
button through `aria-describedby`. Completion does not move focus, including
when the tester deliberately tabs elsewhere during the request.

The extended test also exposed the old busy color pairing at 1.27:1. The button
now retains its normal readable colors while its label and unavailable state
indicate progress. No error messages, policy text, Resume prompts, API payloads,
provider code, dependencies, or schedules changed. Notifications remain OFF.

The active worker advances once from v152 to v153 in this fix. The legacy
compatibility worker is unchanged. `fix-scope.json` proves every index.html byte
outside the three planned feedback edits is identical to f63.

## Executed evidence

All six final commands exited zero. The structural check also exited zero.
Raw outputs are alongside this report.

| Check | Result and scope |
| --- | --- |
| Accessibility | LOCAL AUTOMATION PASS: 96 error cases, both formats, four response classes, 12 viewport/orientation/zoom scenarios; 24 additional busy visual checks |
| Keyboard repeat activation | Every delayed error case made one intercepted request despite extra Enter/Space activations; focus survived completion or remained at the tester's new focus target |
| Error semantics | Every error case exposed exact response text as an atomic alert; Chrome's accessibility tree reported an assertive live alert |
| OpenAI migration | PASS, including existing grounding, transport, browser-only header, federal, DOCX, and actual LibreOffice rendering regressions |
| Worker and public build | PASS, including the exact 22-file publish boundary |
| Privacy/network | PASS for new and migrated browser cohorts; zero external provider requests |
| Runtime AI spend | PASS, including existing pre-call rejection, concurrency, accounting, and bounded-stage cases |
| Policy content | PASS: 96 assertions and 1,110 parity vectors |
| Structural/encoding | PASS: 29 standalone JS/CJS/MJS, 44 existing JSON, six YAML, one inline JS and one inline JSON; no changed-line forbidden quotes/NBSP or conflict markers |

Browser: Chrome 152.0.7977.82, isolated headless profile. These tests use synthetic
local responses, do not contact OpenAI, and do not prove real VoiceOver speech,
hosted provider denial, or production behavior. The scenarios use CSS zoom;
native browser zoom and device assistive technology remain manual checks.

Failure history is retained: the first sandboxed run could not bind localhost;
the authorized isolated run reproduced the missing busy semantics; an initial
fix run exposed low contrast. A diagnostic rerun passed before the color fix,
so that timing-sensitive pass was not accepted as resolution. The final change
removes the low-contrast pairing and tests the held-busy presentation before
releasing each validation response. No failing check was suppressed.

All pre-write old-string counts were exactly one. Per-edit post-write counts
matched expectations. The application and test diff was reviewed before commit.
The only runtime files changed are index.html and pwa-sw.js. Existing locked
dependencies were temporarily linked for testing; that link was removed. No
dependency or skill was added. No application revert was needed.

## Earlier candidate checks closed during this review

These results are explicitly for f63, not a newly hosted execution of this fix.

1. `policy-provenance.json`: nine exact-source preservation checks passed.
   Main's OPM RULES/CORPUS wording and the three main reminder objects are
   retained; the remaining Navigator policy blocks and manifest match reviewed
   clone 0433f333. The former f63 index hash matches the recorded weekend
   integration. Existing verification-log records V-2026-016/017/018 are read
   within their explicit CLONE-0433 and MAIN-d825 source qualifiers. This is
   provenance reconciliation, not a fresh primary-source currency rating.
2. `resolved-build-log.txt` and `resolved-build-config.json`: Netlify deploy
   `6a9f2e3981fbb90008098f68` used the repository netlify.toml, ran
   `npm run build:public`, produced 22 files, packaged netlify/functions, and
   deployed from dist. The previous effective-configuration uncertainty is
   resolved. No Netlify setting was changed.
3. `hosted-rejections.json`: 12/12 real hosted pre-provider rejection cases
   passed across Navigator and Resume: method, preflight, malformed/empty
   input, endpoint-specific invalid input, and oversized request. These are
   input-boundary tests. They do not establish hosted provider-timeout or
   budget-exhaustion behavior. Matching inspected handler branches reject
   before client creation; provider account counters were not inspected.

## Remaining release work

- Publish this branch and create a PR into `ops/openai-parallel-clone`, then
  verify the new immutable deploy, public file inventory, worker v153, and
  Resume empty-submission behavior. Dean owns push/merge. Do not merge this
  branch directly into main.
- Run the [Mac/iPhone script](manual-voiceover.md) on that new candidate.
  Dean reported Mac/iPhone only. Safari/VoiceOver is PENDING execution;
  Chrome/NVDA, Edge/JAWS, and Android Chrome/TalkBack are PENDING because the
  required devices/testers are unavailable. No row has been waived.
- Complete remaining hosted provider-failure/status coverage and the bounded
  federal acceptance evidence. Earlier source-equivalent federal generation
  passed 49 facts, 30 trace references, and two-page export checks. It does not
  become an execution on this new deploy. Actual provider-stage/repair counts
  remain unverified; an earlier merged function bundle digest also differed
  from the functionally tested preview, for an unestablished reason.
- Rebind the emergency cache recovery to the final candidate. The prior
  f63-bound recovery artifact proposes v153 and is superseded by this fix;
  it must not be applied as the recovery for a v153 release. Recheck both live
  cache histories and use a strictly newer recovery version.
- Final candidate/origin freshness, policy source currency disposition, and
  production handoff remain separate from local automation.

The release verdict remains BLOCKED under
`.agents/skills/accessibility-release-validation/SKILL.md`: "An unavailable row
is `PENDING`, never an inferred PASS." The same skill requires automation,
manual rows, visual checks, and the hosted artifact to pass on the same
candidate. No skill exception or major skill addition is proposed here.

## Architecture and exposure findings retained

Both assistants can author the same GitHub repository following
SHARED_DEVELOPMENT.md. The OpenAI clone is a deployed content snapshot; it is
not a live-read ChatGPT/MCP distribution server. A merge of reviewed changes
is required to update each deployed branch. No new distribution architecture
was implemented in this task.

The earlier anonymous probes found the live main site's static Navigator source
and intel record publicly accessible; the f63 candidate returned 404 at those
static paths and preserved the function API boundary. The GitHub repository
itself remains public, so this is a website publish-boundary fix, not source
confidentiality. No secret-key exposure was established.

## Iteration log

| Iteration | Defect | Files | Before -> after | Verdict |
| --- | --- | --- | --- | --- |
| 1 | Resume failure feedback missing alert semantics and reliable focus | index.html, pwa-sw.js, accessibility regression, evidence | Hosted visual-only error and baseline test failure -> 96/96 local error cases plus 24 busy visual cases pass | LOCAL AUTOMATION PASS; hosted/manual acceptance pending |

Nothing pushed or merged by the agent. Main, the shared working checkout, and
its pre-existing stashes were not changed. This evidence and fix are intended
for one local commit on the branch named above.
