---
name: validation-gate
description: Pre-commit validation procedure for all code edits to Transition OPS. Run before declaring any edit complete and before any PR is opened. Owner - s3-devops.
---
# VALIDATION GATE — BATTLE DRILL

Purpose: no edit is "done" until it is proven present, proven correct, and
proven non-destructive. This drill encodes checks Dean previously ran by hand
and has caught real insertion mistakes. Do not skip steps to save time.

## PROCEDURE
1. **Presence check.** For every insertion, grep for a unique string from the
   new code and confirm it appears exactly the expected number of times:
   `grep -c "UNIQUE_STRING" index.html`
2. **Absence check.** For every removal or replacement, grep the old string
   and confirm zero (or expected reduced) matches.
3. **Encoding check.** Scan changed lines for curly quotes and smart dashes
   that corrupt JS. Patches transit as .md files specifically to prevent
   this — verify anyway.
4. **Structural check.** Confirm balanced braces/parens in the edited region.
   For React.createElement chains, count opening vs closing parens in the
   changed block.
5. **Untouched-region check.** `git diff --stat` — confirm ONLY intended
   files/regions changed. Any unexpected diff is a full stop.
6. **Evidence.** Report the actual command output, not a summary of it.
   "Validated" without pasted evidence does not clear the gate.

## FAILURE RESPONSE
Any check fails → fix, then rerun the ENTIRE gate from step 1. Partial
re-validation is how corruption ships.
