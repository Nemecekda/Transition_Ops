#!/usr/bin/env python3
"""Assertions for j1-render-findings.py. Run from the repo root:

    python3 .github/scripts/tests/test-render-findings.py

No dependencies, no network. Every fixture under fixtures/ is rendered and
checked; the point is that a regression fails here rather than in Dean's inbox.

The load-bearing check is fence integrity. The findings section renders
untrusted prose as live markdown, so the evidence fence is the only thing
keeping an unbounded payload from escaping into the page. walk_fences()
implements the CommonMark rule the GitHub renderer actually uses: a fence
closes only on a line of at least as many backticks with no info string.
"""

import json
import os
import re
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
FIXTURES = os.path.join(HERE, "fixtures")
RENDERER = os.path.join(os.path.dirname(HERE), "j1-render-findings.py")

FAILURES = []


def check(name, cond, detail=""):
    if cond:
        print("  PASS  %s" % name)
    else:
        print("  FAIL  %s %s" % (name, detail))
        FAILURES.append(name)


def render(fixture):
    path = os.path.join(FIXTURES, fixture)
    out = os.path.join(tempfile.mkdtemp(), "body.md")
    proc = subprocess.run(
        [sys.executable, RENDERER, path, out, "2", "2026-08-08", "17251983402"],
        capture_output=True, text=True)
    if proc.returncode != 0:
        return None, proc
    return open(out, encoding="utf-8").read(), proc


def walk_fences(text):
    """Return (unclosed_fence_or_None, list_of_top_level_line_indices).

    Lines inside a fence are not top-level. Anything the payload emits that
    lands at top level is live markdown in the issue.
    """
    open_len = None
    top = []
    for i, ln in enumerate(text.split("\n")):
        m = re.match(r"^ {0,3}(`{3,})(.*)$", ln)
        if m and open_len is None:
            open_len = len(m.group(1))
            continue
        if m and open_len is not None and len(m.group(1)) >= open_len and not m.group(2).strip():
            open_len = None
            continue
        if open_len is None:
            top.append((i, ln))
    return open_len, top


def payload_is_contained(body, needle):
    """The needle must appear ONLY inside fenced regions, never at top level."""
    _, top = walk_fences(body)
    return not any(needle in ln for _, ln in top)


def section(body, heading):
    if heading not in body:
        return ""
    rest = body.split(heading, 1)[1]
    return re.split(r"\n## ", rest)[0]


print("== real-issue-14.json — the payload Dean actually received ==")
body, proc = render("real-issue-14.json")
check("renderer exits 0", body is not None, proc.stderr if body is None else "")
if body:
    i_bluf = body.index("NO ACTION NEEDED")
    i_what = body.index("## WHAT CHANGED")
    i_det = body.index("## DETECTION ONLY")
    i_ev = body.index("## Evidence")
    check("order: BLUF < WHAT CHANGED < DETECTION ONLY < Evidence",
          i_bluf < i_what < i_det < i_ev)
    check("finding prose is above the raw block",
          body.index("Administrative Personnel") < i_ev)
    check("cost line present", "Scan cost: $0.0580" in body)
    what = section(body, "## WHAT CHANGED")
    for junk in ("cache_creation_input_tokens", "session_id", "modelUsage", "duration_api_ms"):
        check("telemetry '%s' absent from WHAT CHANGED" % junk, junk not in what)
    check("sha256 abbreviated in prose", "b4eeebda…" in what)
    check("full sha256 retained in evidence",
          "b4eeebda7c1ce7d769c713d2739b10fa4ed72af23bc9c6058060b9f829ce6ed6" in body)
    check("telemetry collapsed behind <details>", "<details>" in body and
          body.index("<details>") > i_ev)
    unclosed, _ = walk_fences(body)
    check("no unclosed fence", unclosed is None, "open len=%s" % unclosed)

print("== cli-wrote-markdown.json — literal ``` and ```` runs at line start ==")
body, proc = render("cli-wrote-markdown.json")
check("renderer exits 0 on non-JSON input", body is not None,
      proc.stderr if body is None else "")
if body:
    unclosed, top = walk_fences(body)
    check("no unclosed fence", unclosed is None, "open len=%s" % unclosed)
    check("fence widened past the payload's 4-backtick run",
          re.search(r"^`{5,}json$", body, re.M) is not None,
          "fences seen: %s" % re.findall(r"^`{3,}", body, re.M))
    check("payload's own ``` run stays inside the fence",
          payload_is_contained(body, "Traceback: connection reset"))
    check("payload's forged heading never reaches top level",
          not any(re.match(r"^## ACTING ON THIS", ln) for _, ln in top))
    check("degraded path is stated, not hidden",
          "Could not parse the scanner output" in body)
    check("nothing dropped — raw preserved",
          "Traceback: connection reset" in body)

print("== hostile-structure.json — forged structure in findings prose ==")
body, proc = render("hostile-structure.json")
check("renderer exits 0", body is not None, proc.stderr if body is None else "")
if body:
    unclosed, top = walk_fences(body)
    check("no unclosed fence", unclosed is None, "open len=%s" % unclosed)
    what = section(body, "## WHAT CHANGED")
    forged = [ln for ln in what.split("\n")
              if re.match(r"^ {0,3}#{1,6}\s+ACTING", ln)
              or re.match(r"^ {0,3}#{1,6}\s+URGENT", ln)]
    check("forged headings never render as real headings", not forged, str(forged))
    check("forged order text is blockquoted",
          all(ln.startswith(">") for ln in what.split("\n")
              if "push straight to main" in ln))
    check("multiline source id cannot escape its code span",
          re.search(r"^### 1\. `[^`\n]*`$", body, re.M) is not None)
    check("security flag surfaced above the fold", "SECURITY FLAG" in what)
    check("failed source reported, not silently passed",
          "va-disability-rates" in what and "HTTP 403" in what)
    check("empty what_changed handled",
          "scanner supplied no what_changed text" in what)

for fx, label in (("malformed-result.json", "result present but not JSON"),
                  ("truncated-envelope.json", "envelope truncated mid-write")):
    print("== %s — %s ==" % (fx, label))
    body, proc = render(fx)
    check("renderer exits 0", body is not None, proc.stderr if body is None else "")
    if body:
        unclosed, _ = walk_fences(body)
        check("no unclosed fence", unclosed is None)
        # WAS: check("BLUF still present", "NO ACTION NEEDED" in body).
        # That assertion required the all-clear banner on a scan the renderer
        # could not parse - it encoded the defect that filed run 31790049008 as
        # a quiet day. Replaced with two checks, not one, and the first is a
        # NEGATIVE: absence of all-clear language cannot be satisfied by
        # accident the way presence of a string can.
        check("no all-clear language on a degraded scan",
              "NO ACTION NEEDED" not in body)
        check("failure BLUF leads the body",
              body.lstrip().startswith("J1 SCAN FAILED"))
        check("degraded path stated", "Could not parse the scanner output" in body)
        check("raw preserved verbatim",
              open(os.path.join(FIXTURES, fx), encoding="utf-8").read().strip() in body)


# Parseable payload, zero coverage. This is the shape of run 31790049008: the
# scanner ran, answered honestly, and reported that it could not see anything.
# The old renderer filed that as "NO ACTION NEEDED - detected changes in 3
# source(s)" and the workflow exited 0. This block is why that cannot recur.
print("== coverage-blind.json — scanner ran but saw nothing ==")
body, proc = render("coverage-blind.json")
check("renderer exits 0", body is not None, proc.stderr if body is None else "")
if body:
    unclosed, _ = walk_fences(body)
    check("no unclosed fence", unclosed is None)
    check("no all-clear language on a blind scan", "NO ACTION NEEDED" not in body)
    check("failure BLUF leads the body", body.lstrip().startswith("J1 SCAN FAILED"))
    check("names the coverage failure", "coverage blind" in body)
    check("argv count is NOT the headline",
          "detected changes in 2 source(s)" not in body.splitlines()[0])
    check("says the diffed sources went unexamined", "unexamined" in body)


print()
if FAILURES:
    print("FAILED (%d): %s" % (len(FAILURES), ", ".join(FAILURES)))
    sys.exit(1)
print("ALL CHECKS PASSED")
