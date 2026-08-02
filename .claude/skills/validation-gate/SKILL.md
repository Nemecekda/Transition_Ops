---
name: validation-gate
description: Validation battle drill for Transition OPS. EDIT mode runs pre-commit on any code change and before any PR, and governs how edits are applied - discrete edits, per-edit counts, reviewed scripts. INTEGRITY mode runs against a clean tree for structural and encoding audits. Owner - s3-devops.
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
   - Standalone files: `node --check` on sw.js, OneSignalSDKWorker.js,
     netlify/functions/*.js. `JSON.parse` on manifest.json.
   - Record the block inventory (count, line ranges, sizes). At dd4e1f0 that is
     4 inline blocks (1 JSON-LD + 3 JS) plus 3 src-only tags. An inventory
     change the diff does not explain is a full stop.
   - APPLICABILITY: the app calls `React.createElement` directly and loads no
     Babel, so inline blocks are parseable JS as-is. If raw JSX is ever
     introduced, `node --check` will report a syntax error that is not a real
     defect. Do not report that as FAIL - drop to the fallback and say why.
   - FALLBACK (no parser available, or JSX present): count opening vs closing
     braces, parens, and brackets in the changed block and require equality.
     Label it FALLBACK in the evidence. Balanced counts prove nothing about
     placement; a file can balance perfectly and still be broken. Fallback is
     weaker evidence and never PASS-equivalent for a structural change.
5. **Untouched-region check.** `git diff --stat` - confirm ONLY intended
   files/regions changed. Any unexpected diff is a full stop.
6. **Evidence.** Report the actual command output, not a summary of it.
   "Validated" without pasted evidence does not clear the gate.

## INTEGRITY MODE (clean tree)
Use for post-revert confirmation, scheduled audit, and pre-handoff checks.
Scope: file integrity only. INTEGRITY MODE NEVER CERTIFIES AN EDIT.

1I. Presence: **N/A** (no insertions exist). SUBSTITUTE - anchor inventory.
    `grep -c` each and record the count; a zero is a real FAIL, not an N/A:
    `JOBS_LIVE` / `navigator.serviceWorker.register("/sw.js")` /
    `OneSignal.init(` / `G-RE7CRR2ZBB` / `ReactDOM.render(` / `rel="manifest"`
2I. Absence: **N/A** (nothing was removed). SUBSTITUTE - prohibited-pattern
    sweep, all must be zero: merge conflict markers
    (`grep -n -e '^<<<<<<<' -e '^=======' -e '^>>>>>>>'`), curly quotes, U+00A0.
3I. Encoding: literal PASS/FAIL, whole file. Curly quotes and U+00A0 zero.
    Record em/en dash counts as a fingerprint; nonzero is expected and fine.
4I. Structural: literal PASS/FAIL. Step 4 primary parse run over every inline
    block and every tracked .js / .json file.
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
