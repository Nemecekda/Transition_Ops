---
name: validation-gate
description: Validation battle drill for Transition OPS. EDIT mode runs pre-commit on any code change and before any PR, and governs how edits are applied - discrete edits, per-edit counts, reviewed scripts. INTEGRITY mode runs against a clean tree for structural and encoding audits. Owner - s3-devops.
metadata:
  version: "1.10"
  status: CODIFIED
  owner: s3-devops
  validated: "2026-09-03"
---
# VALIDATION GATE - BATTLE DRILL

Purpose: no edit is "done" until it is proven present, proven correct, and
proven non-destructive. This drill encodes checks Dean previously ran by hand
and has caught real insertion mistakes. Do not skip steps to save time.

## MODE SELECT (run first, always)
    git status --porcelain
- Output present -> EDIT MODE. Steps 1-6. All diff-scoped checks are literal.
- Output empty -> INTEGRITY MODE. Steps 1I-6I. Steps 1, 2, and 5 have no diff
  to evaluate and are N/A; prescribed substitutes below stand in.

Paste the porcelain output and declare the mode as the first line of evidence.
Never run EDIT-mode wording against a clean tree, and never improvise a
substitute check that this skill does not prescribe.

Extraction artifacts (script blocks pulled out for parsing) go to a scratchpad
directory. Never write them into the repo tree - that dirties the tree and
breaks mode select.

## EDIT APPLICATION (EDIT MODE, before step 1)
The gate proves the result. This proves the method. Both are required, and a
result that cannot say how it was produced is not evidence.

A. **Discrete edits.** Apply and report one change at a time, old text and new
   text shown. "Applied 6 changes" is not a report; six shown edits is.
B. **Count after EVERY edit, not once at the end.** `grep -c` the new string and
   the old string, expected vs actual, before starting the next edit:
   `new expect 2 / actual 2 - old expect 0 / actual 0`. A mismatch stops the run
   there. Derive the expectation from the file, never default to 1: the POLICY
   INTEL panel renders twice byte-identically, so edits inside it correctly
   match twice.
C. **Itemized diff before the commit is written.** Show `git diff` hunk by hunk.
   The operator sees what is actually going in, not a summary of it.
D. **User-facing wording is Dean's call.** Text a service member reads - benefits,
   figures, labels, headings, button copy - gets his personal approval before it
   is applied, however mechanical the edit looks. COMMANDER lane. Mechanical is
   not the same as minor.

### Scripts are reviewed, not banned
A byte-level script is sometimes the only correct tool. index.html stores some
characters as six-character escape TEXT - backslash u 2014, backslash u 2022 -
not as the glyphs. Editors that normalize escapes rewrite the pattern and break
the match silently, so python3 over raw bytes is the right instrument. This
paragraph itself cannot spell those escapes literally without a tool renormalizing
them, which is the whole problem in one line.

Permitted only when the full script is DISPLAYED BEFORE EXECUTION with every
operation commented with the approved edit number it implements. An unshown
script, or an operation mapping to no approved edit, is prohibited. Prescribed
shape - assert the count, never trust a silent replace:

    # EDIT 3: <approved edit>
    n = src.count(OLD); print("before", n); assert n == 2
    src = src.replace(OLD, NEW); print("after", src.count(NEW))

The assert is the point: without it a normalized escape yields a zero-match
no-op that reports success. An unasserted bulk replace is an unreviewed script
under another name.

## EDIT MODE
1. **Presence check.** For every insertion, grep for a unique string from the
   new code and confirm it appears exactly the expected number of times:
   `grep -c "UNIQUE_STRING" index.html`
2. **Absence check.** For every removal or replacement, grep the old string
   and confirm zero (or expected reduced) matches.
3. **Encoding check.** Curly quotes (U+2018/2019/201C/201D) and non-breaking
   space (U+00A0) are a HARD ZERO across the repo. Scan the added lines:
   `git diff -U0 | perl -CSD -ne 'print if /^\+/ && /[\x{2018}\x{2019}\x{201C}\x{201D}\x{00A0}]/'`
   Any output = FAIL. No-perl fallback:
   `LC_ALL=C grep -n -e $'\xe2\x80\x98' -e $'\xe2\x80\x99' -e $'\xe2\x80\x9c' -e $'\xe2\x80\x9d' -e $'\xc2\xa0' index.html`
   Em dash (U+2014) and en dash (U+2013) occur legitimately in HTML text,
   titles, and comments. Nonzero dash counts are NOT a failure. Do not "fix"
   them. Patches transit as .md files to prevent quote corruption - verify anyway.
4. **Structural check - real parse (PRIMARY).**
   - index.html: find boundaries with `grep -n '<script\|</script>' index.html`.
     For each opening tag with NO `src=` attribute, extract the body
     (`sed -n "A,Bp" index.html > "$T/bA.js"`, A=open+1, B=close-1) and run
     `node --check "$T/bA.js"`. Report byte size and OK/FAIL per block.
   - `type="application/ld+json"` block: validate as JSON instead -
     `node -e 'JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));console.log("JSON OK")' "$T/jsonld.json"`
   - Standalone files: build an explicit inventory of every tracked `.js` file
     and every intended untracked `.js` addition, then run `node --check` on
     each. This includes active PWA, legacy, dedicated push, script, vendor, and
     Netlify Function files regardless of filename or directory. Do not rely on
     `git diff --name-only` alone because it omits untracked additions. Run
     `JSON.parse` on `manifest.json`.
   - YAML files (`.yml` / `.yaml`, anywhere in the repo, `.github/workflows/**`
     in particular): parse with Ruby. Ruby ships with macOS and its YAML parser
     is Psych, in-tree, offline, deterministic:
     `ruby -ryaml -e 'ARGV.each{|f| YAML.parse_stream(File.read(f)); puts "YAML OK #{f} #{File.size(f)} bytes"}' .github/workflows/*.yml`
     Pass every changed YAML path as an argument. PASS = one `YAML OK` line per
     file and exit 0. FAIL = `Psych::SyntaxError` naming line, column, and
     problem, and exit 1; report it verbatim, do not paraphrase it. One bad file
     among several fails the whole invocation (verified).
     `parse_stream` builds the node tree for every document without resolving
     aliases or constructing objects - it answers parseability and nothing else.
     It is also why multi-document files are covered: `YAML.load` returns only
     the first document and would silently skip the rest.
   - DO NOT PIPE THIS COMMAND. `ruby ... | head` makes `$?` report `head`, not
     Ruby, so a `Psych::SyntaxError` prints and the step still exits 0. Run it
     unpiped and check the exit code, or capture to a file and inspect. This is
     the same silent-green failure mode step 6 exists to prevent, and it has
     bitten this gate before.
   - PROHIBITED for this bullet: `npx js-yaml` or any other network-fetched
     parser. `js-yaml` is not on PATH; `npx` would fetch over the network. A gate
     step must be deterministic and offline. Do not "improve" this step by
     reaching for npx. PyYAML is also unavailable - `python3` is 3.9.6 and
     `import yaml` raises ImportError. Ruby is the prescribed parser.
   - SCOPE - parseability only. Do NOT assert workflow semantics here (that
     `on:` exists, that `jobs:` is non-empty, that a runner label is valid).
     Step 4 asks the same question of YAML that it asks of JS and JSON: does the
     file parse. Semantic linting is a different tool and a different decision.
     A workflow that parses cleanly and does the wrong thing is a PASS at this
     gate and a defect somewhere else.
   - YAML 1.1 TRAP - the bare token `on` parses as boolean `true`, not the
     string `"on"`. Verified on Psych 3.1.0: a workflow's top-level keys come
     back as `["name", true, "jobs"]`. Structural parse is unaffected; this is
     why the prescribed check is a parse and not an assertion. Any assertion
     written against a key literally named `on` will fail confusingly. Do not
     quote keys in a workflow file to make such an assertion pass - the file was
     never broken, the assertion was.
   - FALLBACK (no Ruby available): scan the changed YAML for tab characters -
     `grep -n -e $'\t' FILE` - and require zero, since YAML forbids tabs in
     indentation; confirm every top-level key sits at column 0 and every nested
     line is space-indented. Label it FALLBACK in the evidence. This detects the
     single most common YAML defect and proves nothing about structure beyond
     it; a tab-free file can be malformed in a dozen other ways. Fallback is
     weaker evidence and never PASS-equivalent for a structural change.
   - Record the block inventory (count, line ranges, sizes). At dd4e1f0 that is
     4 inline blocks (1 JSON-LD + 3 JS) plus 3 src-only tags. Record the YAML
     inventory alongside it: every tracked `.yml` / `.yaml` path with its byte
     size and document count. At 87d9f48 that set is EMPTY - confirmed with
     `git ls-files '*.yml' '*.yaml'`, which returns zero files; the first
     `.github/workflows/*.yml` is the first entry and must be stated as such. An
     inventory change the diff does not explain is a full stop, YAML included.
   - APPLICABILITY: the app calls `React.createElement` directly and loads no
     Babel, so inline blocks are parseable JS as-is. If raw JSX is ever
     introduced, `node --check` will report a syntax error that is not a real
     defect. Do not report that as FAIL - drop to the fallback and say why.
   - FALLBACK (no parser available, or JSX present): count opening vs closing
     braces, parens, and brackets in the changed block and require equality.
     Label it FALLBACK in the evidence. Balanced counts prove nothing about
     placement; a file can balance perfectly and still be broken. Fallback is
     weaker evidence and never PASS-equivalent for a structural change.
4S. **Schema and expression check - `actionlint` (workflow files only).**
   Fires when the diff touches any path under `.github/workflows/`. Skipped, and
   reported as `4S N/A - no workflow files in diff`, otherwise. Runs AFTER step 4
   and BEFORE anything is staged.

       "$HOME/.local/bin/actionlint" -version      # must read 1.7.12
       "$HOME/.local/bin/actionlint" .github/workflows/*.yml

   Pass every changed workflow path as an argument. PASS = no output and exit 0.
   FAIL = one or more findings and a non-zero exit; paste them verbatim, do not
   paraphrase and do not summarise the count.

   - **DO NOT PIPE THIS COMMAND.** `actionlint ... | head` makes `$?` report
     `head`, so findings print and the step still exits 0. This is the identical
     trap already documented for the Ruby parse in step 4, and it has bitten this
     gate before. Run it unpiped and check the exit code, or capture to a file.
   - **Version is checked every run.** A binary that is not 1.7.12 fails the gate
     itself. Pinned per the V-6 discipline; acquisition and hash verification are
     in `intel/patch-2026-08-03-validation-gate-1.4-actionlint.md`.
   - **PROHIBITED:** `brew install actionlint`, or any unpinned acquisition. A
     gate tool that floats is not pinned.
   - **SCOPE:** local gate, run before staging. This is explicitly **NOT** a CI
     job - a workflow that validates workflows sits downstream of the push it
     exists to prevent. Do not "improve" this step by moving it into Actions.
   - **WHAT 4S ACTUALLY COVERS - measured 5 AUG 2026, not claimed.** Actions
     **expression grammar**, including empty and malformed `${{ }}` **inside
     shell comments** (R1, the defect of record). `cron` field validity (R3).
     Workflow **schema**: missing `on:`/`jobs:`, unexpected top-level keys,
     invalid `runs-on:` labels (R7, R9). **Context names and typed-context
     properties** - an undefined context, a misspelled `github.sha`, or a
     `needs.x` with no `needs:` declared are all caught (R4 variants).
   - **WHAT 4S DOES NOT COVER - measured. Each clause below was struck from the
     drafted patch text because the evidence did not support it:**
     - **Shell analysis of `run:` bodies is INERT on this machine.** actionlint
       delegates to a separate `shellcheck` executable rather than embedding one,
       and `shellcheck` is not installed (R6). The shell layer reports nothing and
       must not be described as coverage. Installing a pinned, hashed `shellcheck`
       is a separate Commander decision, and section 8.9's gap stays OPEN.
     - **`github.event.*` payload shape is NOT validated against the trigger.**
       `github.event` is typed as a bare object, so
       `github.event.pull_request.number` on a `schedule`-only workflow passes
       clean (R4). Context *names* are checked; event *payload* is not.
     - **`with:` input names are NOT checked on SHA-pinned actions.** actionlint
       resolves inputs from a tag-keyed dataset, so a full-SHA ref - which V-6
       mandates - resolves to nothing and input validation is silently skipped.
       A misspelled `persist-credential:` passes on the pinned form and is caught
       only on a floating tag (R7). **Pinning is the stronger control and stays;
       the gap is named here so nobody reads 4S as covering it.**
     - **SHA-pinning of `uses:`** - not enforced by actionlint (R5). The bullet
       below is the gate's own check.
   - **DISPOSITION RULE - binding.** Zero findings is the only PASS. Every finding
     is FIXED, or suppressed only with Dean's explicit approval recorded in the
     evidence, per finding. **A hit inside a comment is still a hit. There is no
     comment exemption for anything Actions interpolates** - GitHub substitutes
     expressions textually before any shell exists, so a leading `#` protects
     nothing. "COMMENT (inert)" is a prohibited disposition; it is the exact
     reasoning that cleared the section 8.10 defect after the scan had already
     found it, and it cost a startup failure. A finding the operator believes is a
     false positive is still a FAIL until Dean rules - escalated, not absorbed.
     Never a blanket ignore, never a config file added quietly beside the binary.
   - **FALLBACK (binary unavailable or hash mismatch):** there is none that is
     equivalent. Run the section 8.10 ad-hoc scan for empty and malformed
     expressions across every workflow file, label it FALLBACK, and state in the
     evidence that the schema layer was not checked. A workflow change validated
     without 4S is weaker evidence and is never PASS-equivalent.
   - **SHA-PIN ASSERTION - the gate's own check, not `actionlint`'s.** Every
     `uses:` in a changed workflow file must reference a **full 40-hex commit
     SHA**. `actionlint` does NOT enforce this (R5); V-6 requires it; this bullet
     is where the gate asserts it. Runs whenever 4S runs, and runs **even when the
     binary is unavailable** - it is `grep`, offline and in-tree.

         UNPINNED=$(grep -nE '^[[:space:]]*-?[[:space:]]*uses:' .github/workflows/*.yml \
           | grep -vE 'uses:[[:space:]]*\./' \
           | grep -vE '@[0-9a-f]{40}[[:space:]]*(#.*)?$' || true)
         if [ -n "$UNPINNED" ]; then
           printf '%s\n' "$UNPINNED"
           echo "4S-PIN FAIL - the refs above are not full 40-hex commit SHAs"
           exit 1
         fi
         echo "4S-PIN PASS - every uses: is pinned to a full commit SHA"

     - The trailing **`|| true` is load-bearing.** `grep -v` exits 1 when nothing
       matches, and nothing matching is precisely the PASS case. Without it, under
       `set -e`, the clean case aborts the step and the operator debugs a passing
       repo. Same exit-code trap as DO NOT PIPE, arriving from the opposite
       direction.
     - **Local actions (`uses: ./path`) are exempt** and only those. They are
       in-tree, they move with the diff, and they are reviewed as part of it. A
       third-party ref is exempt from nothing.
     - **A version comment is not a pin.** `@3d3c42e5...  # v7.0.1` is pinned
       because of the SHA; the comment is a courtesy to the reader. `@v7.0.1
       # pinned` is NOT pinned, and the assertion catches exactly that
       self-certifying form.
     - **Disposition:** zero unpinned refs is the only PASS. A finding is FIXED,
       or suppressed only with Dean's explicit written approval in the evidence,
       per finding. "It's a trusted publisher" is a prohibited disposition - V-6
       pinned `actions/checkout` precisely because trust in the publisher is not
       trust in a mutable tag.

4P. **PRE-MAIN Phase 1 semantic regressions.** Fires when the diff touches
    `index.html`, an OpenAI Netlify Function or shared client/guard, an active,
    legacy, or dedicated worker, `scripts/**`, `package.json`, or `netlify.toml`.
    Governance-only changes under `.claude/**`, `.agents/**`, and
    `skills-registry.md` are N/A.
    Run each command separately and unpiped; a missing script, nonzero exit,
    skipped required case, or fallback result is FAIL:

       npm run test:openai-migration
       npm run test:sw-privacy
       npm run test:privacy-network
       npm run test:runtime-ai-spend
       npm run test:accessibility-release

    The privacy/network suite must prove zero GA and Kit runtime requests, no
    browser-side email credential or member-derived Navigator Blob path, zero
    OneSignal request/SDK/worker/subscription behavior for new and migrated
    browsers while production push is off, and a separately reported legacy
    cohort. It must not require any exact removed credential value.

    The spend suite must execute request-byte and exact stage-output boundaries,
    closed models/options, atomic concurrent admission, cutoff equality and
    denial, accounting failure, crash/failure charge retention, UTC rollover,
    aggregate-ledger sentinels, every Navigator/Resume path, and zero provider
    calls on pre-call denial. Static source matches alone cannot satisfy these
    behaviors.

    The accessibility command establishes local automated evidence only. It
    cannot report manual assistive-technology or hosted release acceptance;
    those remain owned by `accessibility-release-validation`.

4N. **Netlify AI package boundary - real artifact.** Fires when the diff touches
    `netlify.toml`, `package.json`, `package-lock.json`, either OpenAI entry
    function, or the shared OpenAI client. Run after 4P and before step 5.
    Static source assertions do not clear this step. Package both AI functions
    with the installed Netlify CLI's packager into a scratch directory. Resolve
    only the `netlify` executable already on `PATH`, follow its real path, and
    accept only the nearest ancestor `package.json` when it is a regular file
    naming `netlify-cli` with a semantic version. A missing executable, broken
    real path, absent manifest, symlink/nonregular manifest, malformed JSON,
    wrong package name, or malformed version is a hard failure. Do not search a
    second installation, call `npm root -g`, invoke `npx`, install, download, or
    use a fallback. After resolution, load OpenAI and Blobs and resolve the two
    required Blobs dependencies separately from each generated artifact without
    constructing a client or store, accessing credentials, or invoking a
    function:

       TOPS_NETLIFY_BIN="$(command -v netlify 2>/dev/null)" || {
         echo "4N FAIL - installed netlify executable not found on PATH"
         exit 1
       }
       TOPS_NETLIFY_CLI_ROOT="$(node -e 'const fs=require("node:fs");const path=require("node:path");try{const executable=fs.realpathSync(process.argv[1]);let cursor=path.dirname(executable);for(;;){const manifest=path.join(cursor,"package.json");if(fs.existsSync(manifest)){const stat=fs.lstatSync(manifest);if(stat.isSymbolicLink()||!stat.isFile())throw new Error();const parsed=JSON.parse(fs.readFileSync(manifest,"utf8"));if(parsed.name!=="netlify-cli"||typeof parsed.version!=="string"||!/^[0-9]+\.[0-9]+\.[0-9]+(?:[-+][0-9A-Za-z.-]+)?$/.test(parsed.version))throw new Error();process.stdout.write(cursor);process.exit(0)}const parent=path.dirname(cursor);if(parent===cursor)throw new Error();cursor=parent}}catch(error){process.exit(1)}' "$TOPS_NETLIFY_BIN")" || {
         echo "4N FAIL - PATH netlify executable does not resolve to a valid netlify-cli package"
         exit 1
       }
       TOPS_PACKAGE_SCRATCH="$(mktemp -d /tmp/tops-netlify-package.XXXXXX)"
       node -e 'console.log(require(process.argv[1]).version)' "$TOPS_NETLIFY_CLI_ROOT/package.json"
       node -e 'console.log(require(process.argv[1]).version)' "$TOPS_NETLIFY_CLI_ROOT/node_modules/@netlify/zip-it-and-ship-it/package.json"
       node --input-type=module -e 'import fs from "node:fs";import path from "node:path";import {pathToFileURL} from "node:url";const cli=process.argv[1];const out=process.argv[2];const root=process.cwd();const tomlModule=await import(pathToFileURL(path.join(cli,"node_modules/@iarna/toml/toml.js")));const configModule=await import(pathToFileURL(path.join(cli,"dist/lib/functions/config.js")));const zipModule=await import(pathToFileURL(path.join(cli,"node_modules/@netlify/zip-it-and-ship-it/dist/main.js")));const parsed=(tomlModule.default||tomlModule).parse(fs.readFileSync(path.join(root,"netlify.toml"),"utf8"));const isObjectTable=(value)=>value!==null&&typeof value==="object"&&!Array.isArray(value);const shapeFail=()=>{throw new Error("4N_INVALID_FUNCTIONS_CONFIG_SHAPE")};const rawFunctions=parsed.functions;if(!isObjectTable(rawFunctions)||!Object.prototype.hasOwnProperty.call(rawFunctions,"directory")||rawFunctions.directory!=="netlify/functions")shapeFail();const functionEntries=[];for(const [pattern,value] of Object.entries(rawFunctions)){if(pattern==="directory")continue;if(!isObjectTable(value))shapeFail();functionEntries.push([pattern,value])}const functionsConfig=Object.fromEntries(functionEntries);for(const required of ["navigator","resume"]){if(!Object.prototype.hasOwnProperty.call(functionsConfig,required))shapeFail()}const config=configModule.normalizeFunctionsConfig({functionsConfig,projectRoot:root});await zipModule.zipFunctions(path.join(root,"netlify/functions"),out,{archiveFormat:"none",config,manifest:path.join(out,"manifest.json")});console.log("4N PACKAGE PASS actual netlify.toml");' "$TOPS_NETLIFY_CLI_ROOT" "$TOPS_PACKAGE_SCRATCH"
       node -e 'const assert=require("node:assert/strict");const fs=require("node:fs");const path=require("node:path");const {createRequire}=require("node:module");const out=process.argv[1];const required={openai:"7.8.0","@netlify/blobs":"10.7.13","@netlify/otel":"6.0.6","@netlify/runtime-utils":"2.3.0"};for(const name of ["navigator","resume"]){const base=path.join(out,name);const artifactRequire=createRequire(path.join(base,"package.json"));const openaiPkg=require(path.join(base,"node_modules/openai/package.json"));assert.equal(openaiPkg.version,required.openai);const openai=artifactRequire("openai");assert.equal(typeof (openai.OpenAI||openai.default||openai),"function");const blobsPkg=require(path.join(base,"node_modules/@netlify/blobs/package.json"));assert.equal(blobsPkg.version,required["@netlify/blobs"]);const blobs=artifactRequire("@netlify/blobs");assert.equal(typeof blobs.getStore,"function");for(const moduleName of ["@netlify/otel","@netlify/runtime-utils"]){const modulePkg=require(path.join(base,"node_modules",...moduleName.split("/"),"package.json"));assert.equal(modulePkg.version,required[moduleName]);assert.equal(typeof artifactRequire.resolve(moduleName),"string");}console.log("4N PASS",name,"openai="+openaiPkg.version,"blobs="+blobsPkg.version,"otel="+required["@netlify/otel"],"runtime-utils="+required["@netlify/runtime-utils"]);}for(const packageName of Object.keys(required)){assert.equal(fs.existsSync(path.join(out,"jobs/node_modules",...packageName.split("/"))),false);}console.log("4N PASS jobs excludes all four package paths");' "$TOPS_PACKAGE_SCRATCH"

    `netlify functions:build` alone is prohibited as 4N evidence: CLI 26.1.0
    was measured to call the packager without normalized per-function config,
    silently omitting `included_files`. Record both displayed tool versions, the
    package PASS, the two AI artifact PASS lines, and the jobs-exclusion PASS
    line. Missing or malformed PATH-resolved CLI/package, configuration parse or
    normalization failure, packaging failure, absent OpenAI or Blobs package,
    version drift, failed module resolution, failed OpenAI-constructor or
    Blobs-`getStore` API shape, any of the four package paths in `jobs`, any
    alternate installation search, download, or fallback is FAIL. This
    module-only smoke test must perform zero credential access, client or store
    construction, provider calls, network activity, model requests, function
    invocations, or hosted actions.

    The source regression must also enforce one exact function-scoped
    `included_files = ["node_modules/openai/**", "node_modules/@netlify/blobs/**", "node_modules/@netlify/otel/**", "node_modules/@netlify/runtime-utils/**"]`
    rule for each of Navigator and Resume; zero global `included_files` rule or
    broad bare `node_modules/**` inclusion; and zero `node_bundler`,
    `external_node_modules`, or `ignored_node_modules` override. Missing,
    reordered, duplicated, extra, or wrong package paths fail the exact rule.
    Artifact PASS proves only local package presence, API shape, and module
    resolution. Hosted Navigator and Resume acceptance remain separate
    deploy-discipline evidence.

5. **Untouched-region check.** `git diff --stat` - confirm ONLY intended
   files/regions changed. Any unexpected diff is a full stop.
6. **Evidence.** Report the actual command output, not a summary of it.
   "Validated" without pasted evidence does not clear the gate.

## INTEGRITY MODE (clean tree)
Use for post-revert confirmation, scheduled audit, and pre-handoff checks.
Scope: file integrity only. INTEGRITY MODE NEVER CERTIFIES AN EDIT.

1I. Presence: **N/A** (no insertions exist). SUBSTITUTE - approved-state anchor
    inventory. Record expected and actual counts for `JOBS_LIVE`,
    `navigator.serviceWorker.register(`, `ReactDOM.render(`, `rel="manifest"`,
    and exactly one literal `const TOPS_PUSH_ENABLED = false;`. Report every
    matched service-worker registration URL. Do not require a GA measurement ID,
    `OneSignal.init(`, a Kit form ID, or any credential as a positive anchor.
2I. Absence: **N/A** (nothing was removed). SUBSTITUTE - prohibited-pattern
    sweep. Merge conflict markers, curly quotes, and U+00A0 remain hard zero.
    In production-bound browser code also require zero GA loader/config/runtime
    definitions, Kit/ConvertKit endpoints and browser-side `api_key` submission,
    static OneSignal App-ID UUID assignment, clone/test origin literals, clone or
    test-site production copy, and any assignment enabling production push.
    Detect credential and UUID shapes semantically; never encode an exact removed
    credential as the invariant. Run the Phase 1 commands from 4P as the semantic
    substitute; source absence cannot replace executed network/budget behavior.
3I. Encoding: literal PASS/FAIL, whole file. Curly quotes and U+00A0 zero.
    Record em/en dash counts as a fingerprint; nonzero is expected and fine.
4I. Structural: literal PASS/FAIL. Step 4 primary parse run over every inline
    block, every tracked .js / .json file, and every tracked .yml / .yaml file.
    In INTEGRITY MODE the YAML argument list is the full tracked set, not a diff
    subset. Record the YAML inventory as a fingerprint - path, byte size,
    document count. An empty set is a valid fingerprint and must be reported as
    `YAML: 0 tracked files`, never omitted; a set that grows without a
    corresponding commit is a full stop.
4PI. PRE-MAIN Phase 1 semantic regressions: once any Phase 1 application or
    test artifact exists, run all five 4P commands against the clean tree. A
    missing command or nonzero result is `INTEGRITY FAIL`. This substitute
    remains automated local evidence only and cannot become manual or hosted
    accessibility acceptance.
5I. Untouched-region: **N/A** (no diff to scope). SUBSTITUTE - cleanliness
    proof: `git status --porcelain` empty, `git diff HEAD --stat` empty, and
    `git rev-parse HEAD` recorded in the evidence. Any output means the tree is
    not clean - stop and rerun in EDIT MODE.
6I. Evidence: same rule as step 6. Pasted output, never a summary.

## REPORTING RULES
- N/A stays N/A. A passing substitute NEVER converts an N/A step into PASS.
  Write it as: `N/A - SUBSTITUTE passed: <check>`.
- Label every substitute as SUBSTITUTE. Never present one as the prescribed check.
- Verdict line: EDIT MODE reports `GATE PASS` / `GATE FAIL`. INTEGRITY MODE
  reports `INTEGRITY PASS (steps 1,2,5 N/A)` / `INTEGRITY FAIL`. There is no
  path from INTEGRITY MODE to `GATE PASS`.
- If a run needs a check this skill does not prescribe, run it, label it
  UNPRESCRIBED, and flag force-mod for a patch.

## FAILURE RESPONSE
Any check fails -> fix, then rerun the ENTIRE gate from step 1 (or 1I) in the
correct mode. Partial re-validation is how corruption ships. A fix writes
files, so an INTEGRITY run that produces a fix becomes an EDIT run - rerun in
EDIT MODE.

## VERSION 1.9 GOVERNANCE CALIBRATION

- **VG-19-1:** all seven v1.8 package-boundary cases and the v1.6 privacy,
  push-state, semantic-regression, spend, and ownership cases remain PASS
  without weakening. PASS.
- **VG-19-2:** a valid installed `netlify` executable is found only through
  `PATH`; a symlinked executable resolves through its real path to the nearest
  regular `netlify-cli/package.json` with a semantic version. PASS.
- **VG-19-3:** missing, broken, empty, relative-to-nowhere, or otherwise
  unresolvable PATH executables fail closed before packaging. PASS.
- **VG-19-4:** absent, symlink, nonregular, malformed, misnamed, or
  malformed-version nearest manifests fail closed; the resolver never skips to
  another installation. PASS.
- **VG-19-5:** no discovery branch invokes `npm root -g`, `npx`, package
  installation, download, network access, or fallback resolution. PASS.
- **VG-19-6:** both generated AI artifacts still must load OpenAI 7.8.0 and
  Blobs 10.7.13 with the required API shapes and resolve OTel 6.0.6 and
  runtime-utils 2.3.0. PASS.
- **VG-19-7:** `jobs` still must exclude all four package paths, while exact
  function-scoped source inclusion and bundler-override prohibitions remain
  unchanged. PASS.
- **VG-19-8:** package smoke remains module-only with zero client/store
  construction, credential access, function invocation, network, provider,
  model, hosted, deploy, merge, or production action. PASS.

Governance calibration executed 8/8 PASS on 2026-09-02. PATH and real-path
fixtures covered valid, missing, broken, malformed, misnamed, and
malformed-version CLI boundaries. Existing artifact/API/dependency/jobs checks
remain intact. No package download, client, store, credential, function,
provider path, model request, network request, hosted artifact, deployment,
merge, or production behavior was executed or certified.

## VERSION 1.10 GOVERNANCE CALIBRATION

- **VG-110-1:** VG-19-1 through VG-19-8 remain unchanged and PASS.
- **VG-110-2:** a mixed raw TOML fixture containing `directory`, `navigator`,
  and `resume` must extract exactly the two function tables and normalize them
  successfully. PASS.
- **VG-110-3:** missing, null, or array roots; missing, invalid, or changed
  directory values; missing required AI tables; null, scalar, or array function
  values; and unexpected scalar siblings must fail with only
  `4N_INVALID_FUNCTIONS_CONFIG_SHAPE` before normalizer or packager invocation.
  PASS.
- **VG-110-4:** the corrected complete 4N command must pass against the actual
  `netlify.toml`, including both AI artifacts, all four package/API boundaries,
  `jobs` exclusion, and module-only zero-credential/zero-provider behavior.
  PASS.

Governance calibration executed 4/4 PASS on 2026-09-02. Sixteen malformed
mixed-shape fixtures failed before normalization; the valid mixed fixture
normalized exactly `navigator` and `resume`; Netlify CLI 26.1.0 with packager
14.7.1 produced both required artifacts and passed every package/API and `jobs`
exclusion check. Canonical and mirror are byte-identical. No credential,
client, store, function, network, provider, model, hosted, deploy, merge, or
production action was used. Version 1.10 is CODIFIED by Commander approval
dated 2026-09-03. `deploy-discipline` continues to own hosted artifact
identity and release authority.
