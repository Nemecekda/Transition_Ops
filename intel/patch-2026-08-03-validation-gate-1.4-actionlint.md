# PATCH PACKAGE — validation-gate 1.3 -> 1.4, `actionlint` IN EDIT MODE

**Status: STAGED, NOT APPLIED. AWAITING COMMANDER.**
Drafted by force-mod, 3 AUG 2026, per the W-2 tasking (`intel/scheduled-ops-design.md`
section 8.5). Nothing in this file is applied. `validation-gate` remains at **1.3**
and `skills-registry.md` is untouched until Dean rules.

**Lane: COMMANDER.** It changes a hard gate. Classified by blast radius, not by file
type - the file being edited is a skill, but the thing being changed is the control
standing between this repo and a pushed workflow.

**Basis:** Commander ruling W-2, 3 AUG 2026 - "`actionlint` is adopted into
`validation-gate` EDIT mode, hash-pinned per the V-6 discipline... a local gate,
**not** a CI job." Defect of record: section 8.10, J2 startup failure.

**Target:** `.claude/skills/validation-gate/SKILL.md`, EDIT MODE.
**Owner (unchanged):** s3-devops.

---

## 1. THE PIN — VERSION AND HASH

`actionlint` **v1.7.12**, published **2026-03-30**.

This machine is macOS **arm64**. The sanctioned artifact is:

| Field | Value |
|---|---|
| Asset | `actionlint_1.7.12_darwin_arm64.tar.gz` |
| SHA-256 | `aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f` |
| Checksums source | the release's own `actionlint_1.7.12_checksums.txt` |

Recorded now for future CI/runner use, **not** installed on this machine:

| Field | Value |
|---|---|
| Asset | `actionlint_1.7.12_linux_amd64.tar.gz` |
| SHA-256 | `8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8` |

**Why pin.** This is the V-6 discipline applied to a binary instead of an action ref.
V-6 pinned `actions/checkout` and `actions/upload-artifact` to full commit SHAs because
a floating tag is third-party mutable and makes a job non-reproducible. A linter is the
same class of problem with a worse failure mode: an action that changes behaviour breaks
loudly at runtime, while a linter that changes behaviour **stops reporting a defect** and
the gate goes green on a file it no longer checks. A gate whose own tool floats is not a
pin, it is a habit.

**VERIFY BEFORE USE - mandatory, every acquisition.**

    shasum -a 256 actionlint_1.7.12_darwin_arm64.tar.gz

Compare to the pinned value above, character for character. **Mismatch = do not use, do
not extract, do not "just proceed."** A mismatch is a full stop and a report to Dean; it
is not a retry condition and it is not resolved by downloading again from the same place.
The pinned value in this document is the authority. The release's `checksums.txt` is a
cross-check only - anyone able to serve you a bad tarball can serve you a matching
checksums file, so verifying the artifact against the file that shipped beside it proves
nothing on its own.

**Uncertainty stated plainly:** the pinned hash is for the **tarball**. The extracted
binary has its own, different sha256, which is not published in this package and which I
cannot compute offline. Procedure below therefore records the extracted binary's hash at
install time as a local first-use fingerprint and compares against it thereafter. That
fingerprint is derived from a verified artifact; it is not an independently published
value, and it must be labelled as such wherever it is recorded.

---

## 2. INSTALL PATH

Single static Go binary. No runtime, no interpreter, no package manager.

**Install outside the repo tree.** An `actionlint` binary committed or left inside the
working tree dirties `git status --porcelain` and breaks the skill's own MODE SELECT -
the same rule the skill already states for extraction artifacts.

    # 1. Fetch the pinned asset from the official v1.7.12 release page.
    #    NOTE: no download URL is recorded in this package. force-mod is offline and
    #    will not assert a URL it cannot verify. The pinned identifiers are the tag
    #    (v1.7.12), the asset filename, and the SHA-256 above - obtain the asset from
    #    the project's official release for that tag and verify by hash, not by URL.
    cd "$(mktemp -d)"
    # ... download actionlint_1.7.12_darwin_arm64.tar.gz here ...

    # 2. VERIFY BEFORE USE. Mismatch = stop.
    shasum -a 256 actionlint_1.7.12_darwin_arm64.tar.gz
    # expect: aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f

    # 3. Extract and place.
    tar -xzf actionlint_1.7.12_darwin_arm64.tar.gz actionlint
    mkdir -p "$HOME/.local/bin"
    mv actionlint "$HOME/.local/bin/actionlint"
    chmod +x "$HOME/.local/bin/actionlint"

    # 4. Record the install fingerprint in the gate evidence, ONCE, labelled as a
    #    first-use fingerprint derived from the verified tarball.
    "$HOME/.local/bin/actionlint" -version
    shasum -a 256 "$HOME/.local/bin/actionlint"

Every subsequent gate run pastes `actionlint -version` into the evidence and confirms it
reads `1.7.12`. A version line that is not `1.7.12` is a FAIL of the gate itself, not of
the file under test.

**`brew install actionlint` is NOT the sanctioned path.** It is recorded here only so
nobody proposes it as an improvement. Homebrew installs whatever version its formula
currently points at and `brew upgrade` moves it silently as a side effect of unrelated
maintenance. That is precisely the floating-tag behaviour V-6 exists to forbid, and it
would mean the gate's tool could change on a Tuesday because something else was updated.
Convenience, non-conforming, not permitted in the gate.

---

## 3. PLACEMENT IN EDIT MODE

**New step 4S, immediately after step 4, before step 5.**

Lettered, not renumbered. Renumbering 5 and 6 would ripple into INTEGRITY MODE's
`1I`-`6I` mapping and into the REPORTING RULES line that names "steps 1, 2, 5" as N/A -
cost with no benefit. The letter also carries meaning: **4S is conditional.** It fires
only when the diff touches `.github/workflows/`.

**Order is load-bearing: YAML parse FIRST, actionlint SECOND, both BEFORE staging.**

A file that is not valid YAML gives actionlint nothing coherent to report. Its schema and
expression analysis presuppose a parsed document; run it first on a broken file and you
get a syntax complaint at best and a cascade of derived nonsense at worst, and the
operator spends time on the wrong line. Psych's `Psych::SyntaxError` names line, column,
and problem - that is the better instrument for that failure, and the skill already
requires it be reported verbatim. So: step 4 answers *does it parse*, and only if it does
is 4S asked *is it a valid workflow*.

**Neither layer replaces the other. State this explicitly in the patch text, because the
adoption will otherwise be read as making the Ruby step redundant.**

| Layer | Catches what the other cannot |
|---|---|
| Step 4, Ruby/Psych `parse_stream` | Every `.yml`/`.yaml` **anywhere in the repo**, not just `.github/workflows/`. Multi-document files. Runs with zero third-party binaries - it is the layer that still works when the pinned binary is missing, its hash fails, or the machine is rebuilt. It is in-tree, offline, deterministic, and it is the fallback authority when 4S cannot be run |
| Step 4S, actionlint | GitHub's **schema** and **expression grammar** - the layer no local tool currently evaluates. Empty and malformed `${{ }}`, **including inside shell comments**. Context validity against the trigger. `cron` field validity. Unknown `with:` keys, invalid `needs:`, bad `runs-on`. Deprecated syntax. Plus shell analysis of `run:` bodies (see the caveat at R6) |

The Ruby step's SCOPE paragraph currently reads "Semantic linting is a different tool and
a different decision." That decision has now been made. The paragraph is amended to point
at 4S rather than deleted - **the boundary itself is still correct.** Step 4 stays
parseability-only, and "a workflow that parses cleanly and does the wrong thing is a PASS
at this gate" stays true of step 4 specifically. It is no longer true of the gate as a
whole. See R9, which is exactly this verdict change and must be recorded as intended
rather than as a regression.

**Shell coverage.** actionlint applies shellcheck rules to `run:` blocks, which is the
gap section 8.9 recorded as *not run* - shellcheck is not installed on this machine and
the shell steps of three live workflows have never been statically analysed. If R6
confirms the shell layer is live, that gap closes as a side effect of this adoption. **If
R6 shows it is not live, the gap does NOT close and must not be recorded as closed.** See
R6 for why this is genuinely uncertain.

### Proposed patch text, step 4S

> **4S. Schema and expression check - `actionlint` (workflow files only).**
> Fires when the diff touches any path under `.github/workflows/`. Skipped, and
> reported as `4S N/A - no workflow files in diff`, otherwise. Runs AFTER step 4
> and BEFORE anything is staged.
>
>     "$HOME/.local/bin/actionlint" -version      # must read 1.7.12
>     "$HOME/.local/bin/actionlint" .github/workflows/*.yml
>
> Pass every changed workflow path as an argument. PASS = no output and exit 0.
> FAIL = one or more findings and a non-zero exit; paste them verbatim, do not
> paraphrase and do not summarise the count.
>
> - **DO NOT PIPE THIS COMMAND.** `actionlint ... | head` makes `$?` report `head`,
>   so findings print and the step still exits 0. This is the identical trap already
>   documented for the Ruby parse in step 4, and it has bitten this gate before. Run
>   it unpiped and check the exit code, or capture to a file and inspect.
> - **Version is checked every run.** A binary that is not 1.7.12 fails the gate
>   itself. Pinned per the V-6 discipline; acquisition and hash verification are in
>   `intel/patch-2026-08-03-validation-gate-1.4-actionlint.md`.
> - **PROHIBITED:** `brew install actionlint`, or any unpinned acquisition. A gate
>   tool that floats is not pinned.
> - **SCOPE:** local gate, run before staging. This is explicitly **NOT** a CI job -
>   a workflow that validates workflows sits downstream of the push it exists to
>   prevent. Do not "improve" this step by moving it into Actions.
> - **DISPOSITION RULE - binding.** Zero findings is the only PASS. Every finding is
>   FIXED, or it is suppressed only with Dean's explicit approval recorded in the
>   evidence. **A hit inside a comment is still a hit. There is no comment exemption
>   for anything Actions interpolates** - GitHub substitutes expressions textually
>   before any shell exists, so a leading `#` protects nothing. "COMMENT (inert)" is
>   a prohibited disposition; it is the exact reasoning that cleared the defect at
>   section 8.10 and cost a startup failure.
> - **FALLBACK (binary unavailable or hash mismatch):** there is none that is
>   equivalent. Run the section 8.10 ad-hoc scan for empty and malformed expressions
>   across every workflow file, label it FALLBACK, and state in the evidence that the
>   schema layer was not checked. A workflow change validated without 4S is weaker
>   evidence and is never PASS-equivalent for a `.github/workflows/` edit.

---

## 4. SCOPE GUARD

- **Applies to:** any file under `.github/workflows/`. Currently `j1-*.yml`,
  `j2-weekly-analysis.yml`, `j3-*.yml`.
- **Does not apply to:** every other `.yml`/`.yaml` in the repo. Those are covered by
  step 4 and only by step 4. actionlint reads workflow files; pointing it at an
  unrelated YAML file is a category error.
- **LOCAL gate, run before staging.** Not a CI job, not a pre-commit hook installed into
  `.git/hooks` (a hook is invisible to review and silently absent on a fresh clone), not
  a Netlify step. Per W-2: a workflow that validates workflows spends Actions minutes to
  learn, after the push, what a local binary answers in milliseconds before it.

---

## 5. REGRESSION CASES

Not yet executed. Execution is s3-devops work on Dean's approval, and the registry entry
lands on execution, not on the text.

Test workflow files go in a scratchpad directory outside the repo. Writing them into the
tree dirties `git status --porcelain` and breaks MODE SELECT.

### R0 - The pin is enforced, not decorative
**Input:** compare the downloaded tarball's `shasum -a 256` against a deliberately
altered expected value.
**Expected:** operator declares MISMATCH and stops. No extraction, no install, no
"downloaded it again and it was fine."
**Proves:** the verify-before-use step is a real halt condition. A pin nobody would ever
stop for is documentation, not a control.

### R1 - MANDATORY. Replay of the section 8.10 defect
**Input:** a workflow file containing, inside a `run:` block, a **shell comment**
carrying an Actions expression **with an empty body** - the exact construction that failed
J2's startup validation on first push. Reconstruct it in the scratchpad; do not
reintroduce it into a live workflow file to test it.
**Expected: FAIL.** actionlint reports an expression parse error on that line and exits
non-zero.
**Proves:** the case that justifies the entire adoption. A gate adopted **because** it
would have caught a specific defect is not adopted until it is regression-tested against
that defect. If R1 does not fail, the premise of W-2 is wrong and the adoption must be
reconsidered rather than shipped - and the section 8.10 ad-hoc scan remains the primary
control for this class, not a fallback.
**Second assertion inside R1:** the finding must be reported even though the expression
sits inside a comment. If actionlint were to skip comment context, it would miss the very
defect of record, and this package would be recommending a tool for a property it does
not have.

### R2 - The corrected live file passes clean
**Input:** the current, corrected `.github/workflows/j2-weekly-analysis.yml` at HEAD.
**Expected: PASS**, zero findings, exit 0.
**Proves:** the gate is usable. A linter that fires on the repo's own corrected,
reviewed, live workflow is a linter that will be routed around within a week. If R2
produces findings, they are triaged individually before adoption - each is either a real
defect in a live workflow (report to Dean immediately; J2 is running weekly) or grounds
to narrow the check. It is not grounds to add a blanket suppression.
**Run R2 against `j1-*.yml` and `j3-*.yml` as well.** All three are live; all three should
be clean, and any finding in a job currently running on a schedule is a live-system issue,
not a test result.

### R3 - Malformed `cron`
**Input:** a copy of a live workflow with the schedule expression corrupted - e.g. an
out-of-range field or the wrong number of fields (`'0 12 * * 8'`, `'0 12 * *'`).
**Expected: FAIL**, with the cron field named.
**Proves:** coverage of a defect class that is otherwise **invisible until the job
silently never runs**. A bad cron on a weekly job is a silent week, which is the failure
mode W-2 was raised about.

### R4 - Invalid context for the trigger
**Input:** a copy of a `schedule`-only workflow with a step referencing
`github.event.pull_request.number`.
**Expected: FAIL**, naming the context as unavailable for the trigger.
**Proves:** the context-validity layer. Nothing local evaluates this today; the file is
valid YAML with a well-formed expression that always resolves to empty at runtime, so the
job does the wrong thing quietly rather than failing.

### R5 - Unpinned `uses:` on a floating tag - HONEST RESULT REQUIRED
**Input:** a copy of a live workflow with `uses: actions/checkout@v7` in place of the
pinned `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1`.
**Expected: PASS.** I expect actionlint **does not** flag this, and this case exists to
record that fact rather than to discover it comfortably. actionlint validates that a
`uses:` value is well-formed (`owner/repo@ref`) and that the action's inputs are correct.
Whether the ref is a full commit SHA is a **policy** question, not a schema question, and
actionlint is not a policy engine. Separate tools exist for SHA pinning; none is proposed
here.
**Proves - and this is the point of the case:** adoption must not silently drop an
existing control. **The V-6 SHA-pin requirement REMAINS in force and is not covered by
4S.** Record the actual result verbatim. If actionlint surprises us and does flag it, say
so and keep the manual check anyway - a tool's incidental coverage is not a control.

**Related finding, flagged not fixed.** I searched `validation-gate/SKILL.md` and found
**no explicit SHA-pin check step in the gate at all.** The control lives in the V-6
verification item, in `deploy-discipline` v1.4, and in the pre-push sweep - not in the
gate. So "the existing manual SHA check must remain in the gate" is, strictly, a check
that is not written into the gate today. Two options, Dean's call, **not decided here:**
(a) accept that V-6/`deploy-discipline` owns it and add a one-line cross-reference in 4S
so no reader infers 4S covers it; or (b) write an explicit `uses:` SHA-pin assertion into
4S as its own bullet. I lean (b) - the gate is where a workflow edit is proven, and a
control that lives only in a design document is one reorganisation from being lost - but
that is scope beyond W-2's approved text and I am not drafting it unasked.

### R6 - Is the shell layer actually live? UNCERTAIN, and the case exists to settle it
**Input:** a copy of a live workflow with a deliberate, shellcheck-detectable defect in a
`run:` block - e.g. an unquoted variable used as a word (`for f in $(ls out)`), or a
`test` on an unquoted possibly-empty variable.
**Expected: FAIL or WARN** if the shell layer is active.
**The uncertainty, stated plainly:** W-2's evaluation table records that actionlint
"bundles `shellcheck`." I cannot verify offline whether the `darwin_arm64` release binary
embeds shellcheck or whether it shells out to a separate `shellcheck` executable on
`PATH`. Section 8.9 records that **shellcheck is not installed on this machine.** If
actionlint delegates rather than embeds, R6 will pass silently and the shell layer will
be inert while everyone believes it is running - the worst of all outcomes, and precisely
the silent-green failure this skill exists to prevent.
**Disposition:** if R6 produces no finding, **do not record section 8.9's shellcheck gap
as closed.** Report it as still open, note that installing `shellcheck` separately (also
pinned, also hashed) is a follow-on decision for Dean, and strike the shell-coverage claim
from the 4S patch text before it is applied.

### R7 - Schema layer: unknown key and invalid runner
**Input:** a copy of a live workflow with (a) a misspelled `with:` key on
`actions/checkout` (e.g. `persist-credential:`), and (b) `runs-on: ubuntu-latests`.
**Expected: FAIL** on both, each named.
**Proves:** the two most mundane members of the class W-2 enumerated. (a) is especially
worth proving: `persist-credentials: false` is a **security property** of J2 - a
misspelling silently restores a usable token in `.git/config` for the rest of the job and
nothing else on this machine would notice.

### R8 - Non-workflow diff: the step reports N/A, it does not invent a result
**Input:** an ordinary `index.html` edit, no workflow files in the diff. Run the full
gate.
**Expected:** steps 1-4 and 5-6 behave exactly as at v1.3. 4S reports
`4S N/A - no workflow files in diff`. actionlint is not invoked.
**Proves:** the conditional step does not change the cost or the verdict of the ordinary
case, which is the overwhelming majority of gate runs. Also confirms the N/A stays N/A -
a skipped 4S is never written as PASS.

### R9 - Cross-skill, `validation-gate`'s own Y1-Y5 (section 8.4): a DELIBERATE verdict change
**Input:** re-run the section 8.4 YAML regression set, in particular the scope-boundary
case - valid YAML that is semantically garbage as a workflow, which under v1.3 **must
PASS**.
**Expected:** step 4 still PASSES it, unchanged and byte-for-byte the same evidence. 4S
now **FAILS** it, so the **gate verdict for that file changes from GATE PASS to GATE
FAIL.**
**Proves:** the seam holds and the change is understood. This is not a regression, it is
the adoption working - but it is a real change in what the gate says about a file it
previously cleared, and it must be recorded in the changelog explicitly, or a future
reader will find section 8.4's evidence contradicting a live gate run and reasonably
conclude something broke. Step 4's scope statement is what keeps the two consistent: step
4 answers parseability and its answer is unchanged; the gate answers more than step 4
does now.

### R10 - Cross-skill, `deploy-discipline`: non-interference
**Input:** a workflow-only change staged through `deploy-discipline`'s FORWARD PATH.
**Expected:** the cache-bump trigger check is unaffected - no `.github/workflows/` path
backs an entry in the `sw.js` ASSETS list, so no `CACHE_NAME` bump is required and none is
performed. The ASSETS drift check behaves identically. `GATE PASS` is still not cache-bump
clearance, and 4S does not become a second opinion on the bump question.
**Proves:** the SKILL SEAM between the two skills survives the patch. Adding a workflow
check to the gate must not create a phantom deploy obligation, and must not tempt anyone
to read 4S as covering the deploy step.

---

## 6. WHAT `actionlint` STILL DOES NOT CATCH

Adoption is not coverage. Section 8.10's reusable lesson is that **a gate that surfaces a
hit is only as good as the rule for dispositioning it**; the mirror of that is that a gate
is only as good as the honest list of what it never looks at. This list belongs in the
patch text, not just in this package.

1. **SHA-pinning of `uses:`** - see R5. V-6 / `deploy-discipline` control, unchanged.
2. **Script injection.** `deploy-discipline` v1.4's rule - fetched content is data, never
   code - and its mechanical test (substitute the worst attacker string for every
   `${{ }}`; if the result can be two commands, it fails) are **untouched and still
   required.** actionlint checks that an expression is well-formed. A perfectly
   well-formed expression interpolating an untrusted issue body into a `run:` block is
   exactly the defect W8 exists to prevent, and 4S will pass it.
3. **Permissions correctness.** That J2 holds `contents: read` and not `contents: write`
   is a design safety property. actionlint validates the key, not the judgment.
4. **Python inside heredocs.** The four embedded Python blocks in J2 are a heredoc body -
   text, as far as any shell or workflow linter is concerned. `py_compile` remains the
   only thing that has ever checked them, and it was run ad hoc in section 8.9, **not as
   a prescribed gate step.** Flagged as a separate gap; not fixed here.
5. **External CLI flags.** Nothing validates `gh issue create --body-file` or
   `claude --max-budget-usd`. `--max-turns` did not exist on CLI 2.1.220 and cost a
   Commander correction; that class of defect is still caught only by a human or a run.
6. **Intent.** A syntactically perfect `cron` that fires at the wrong hour, a budget cap
   with wrong arithmetic, a governor with inverted logic - all PASS. The Y1-Y7 governor
   regression remains the only thing that checks J2's logic.
7. **Secrets existence.** `${{ secrets.ANTHROPIC_API_KEY }}` is well-formed whether or
   not the secret is set.

### Binding disposition rule - carry into the patch text

- Zero findings is the only PASS. A non-zero exit is a FAIL and triggers FAILURE RESPONSE:
  fix, then rerun the **entire** gate from step 1.
- **A hit inside a comment is still a hit.** There is no comment exemption for anything
  Actions interpolates. `#` is a shell construct; expression substitution happens before
  any shell exists.
- **"COMMENT (inert)" and "reasoned away as harmless" are prohibited dispositions.** That
  disposition is what cleared the section 8.10 defect after the scan had already found it.
  The tool did its job; the rule for reading it did not exist.
- Suppression requires Dean, in writing, in the evidence, per finding. Never a blanket
  ignore, never a config file added quietly alongside the binary.
- A finding the operator believes is a false positive is still a FAIL until Dean rules. It
  is escalated, not absorbed.

---

## 7. REGISTRY ENTRY - APPLY ON DEAN'S APPROVAL, NOT NOW

**NOT APPLIED. `skills-registry.md` is unmodified by this package.**

Table row 1, replace:

    | 1 | validation-gate | s3-devops | CODIFIED | 1.3 | 2026-08-03 | .claude/skills/validation-gate/ |

with:

    | 1 | validation-gate | s3-devops | CODIFIED | 1.4 | 2026-08-03 | .claude/skills/validation-gate/ |

The `Validated` date is the date **R0-R10 execute**, not the date Dean approves. If
execution slips past 3 AUG, the date moves with it. Do not pre-fill it from the approval.

CHANGE LOG entry, appended at the end of the file:

    - 2026-08-03 - validation-gate 1.3 -> 1.4. Adds step 4S, `actionlint`, to EDIT
      MODE: GitHub's workflow schema and expression grammar, checked locally before
      staging. Driver: the J2 startup failure of 3 AUG 2026 (intel/scheduled-ops-design.md
      section 8.10). A shell comment inside a `run:` block held an Actions expression with
      an empty body; GitHub substitutes expressions textually before any shell exists, so
      the leading `#` protected nothing and the file was rejected at startup with zero
      steps run. Every local layer passed - the YAML parsed under Psych, the Python
      compiled, the governor regression was 7/7 - because none of them is GitHub's schema.
      The gate proved the file was well-formed YAML containing well-formed Python, which
      it was, and which was never the question. (a) Step 4S fires only when the diff
      touches `.github/workflows/`, runs AFTER step 4's Ruby parse (a file that is not
      valid YAML gives actionlint nothing coherent to report) and BEFORE staging. Neither
      layer replaces the other: step 4 covers every YAML file in the repo with an in-tree
      offline parser and remains the fallback authority; 4S covers the schema layer, empty
      and malformed expressions **including inside comments**, context validity against
      the trigger, `cron` fields, unknown `with:` keys, `needs:`, `runs-on`, and shell
      analysis of `run:` bodies. (b) Pinned to v1.7.12 (published 2026-03-30),
      `actionlint_1.7.12_darwin_arm64.tar.gz`, SHA-256
      `aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f`, per the V-6
      discipline - a linter that silently changes behaviour is the same class of problem
      as a floating action tag, with a worse failure mode, because it stops reporting
      instead of breaking loudly. Hash verified before use; mismatch is a full stop.
      `brew install` is explicitly non-conforming - it floats the version, which defeats
      the pin. `actionlint -version` is checked on every run. (c) Carries forward the DO
      NOT PIPE warning from step 4 verbatim: piping makes `$?` report the pipe tail and a
      failing check exits 0. (d) LOCAL gate only, explicitly NOT a CI job - a workflow
      that validates workflows sits downstream of the push it exists to prevent (W-2).
      (e) Adds a binding DISPOSITION RULE: zero findings is the only PASS, and a hit
      inside a comment is still a hit. "COMMENT (inert)" is a prohibited disposition -
      it is what cleared the section 8.10 defect after the pre-push sweep had already
      found it. A gate that surfaces a hit is only as good as the rule for dispositioning
      it. (f) Adds an explicit non-coverage list so adoption is not read as total
      coverage: SHA-pinning of `uses:` is NOT enforced by actionlint and the V-6 control
      remains in force; `deploy-discipline` v1.4's script-injection rule is untouched and
      still required; Python heredoc bodies, external CLI flags, permissions judgment, and
      intent are all outside it. (g) Step 4's SCOPE paragraph amended to point at 4S
      rather than at "a different decision" - the boundary stands, step 4 is still
      parseability-only, but the GATE now asserts workflow semantics where step 4 does
      not. Section 8.4's scope-boundary case (valid YAML, semantically garbage) still
      PASSES step 4 and now FAILS the gate; that verdict change is deliberate and
      recorded here so a future reader does not read it as a regression.
      Basis: Commander ruling W-2, 3 AUG 2026, intel/scheduled-ops-design.md section 8.5.
      Drafted by force-mod in intel/patch-2026-08-03-validation-gate-1.4-actionlint.md.
      Regression cases R0-R10 specified; **executed status: [FILL ON EXECUTION]**,
      including R1 (replay of the section 8.10 empty-expression defect - MUST FAIL),
      R9 (cross-skill, section 8.4 Y-cases, deliberate verdict change) and R10
      (cross-skill, deploy-discipline cache-bump non-interference).
      Lane: COMMANDER (hard gate). Owner s3-devops.

If R6 shows the shell layer is inert on this machine, add to (a): *"shellcheck coverage
was NOT confirmed - section 8.9's gap remains open,"* and strike the shell-analysis clause.
Do not ship the claim unproven.

---

## 8. WHAT DEAN IS BEING ASKED

1. **Approve or amend the step 4S text** at section 3.
2. **Rule on R5's related finding** (section 5): cross-reference V-6 from 4S (option a),
   or write an explicit SHA-pin assertion into 4S (option b). force-mod leans (b) and did
   not draft it, because it is beyond the approved W-2 scope.
3. **Note the open items** force-mod is not fixing unasked: `py_compile` on workflow
   heredoc Python is not a prescribed gate step; 4S is drafted for EDIT MODE only, and
   whether INTEGRITY MODE gains a `4SI` over the full tracked workflow set is a separate
   call - W-2 approved EDIT mode, so this package does not extend it.

On approval: s3-devops installs the pinned binary, executes R0-R10, and applies the
SKILL.md patch and the registry entry in the same commit. Agents do not push; Dean merges.
