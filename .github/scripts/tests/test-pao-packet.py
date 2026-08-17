#!/usr/bin/env python3
"""PAO packet renderer harness. No dependencies, no network.

Every fixture is rendered and asserted. Built with the J1 harness corrections
already applied:

  * fixtures carry REAL newlines in the fenced result, so they exercise the
    parsed path rather than silently falling through to the unparsed one.
  * failure cases assert the ABSENCE of all-clear language. A negative cannot
    be satisfied by accident the way presence of a string can.
  * the card generator's own self-test is invoked here, so a brief schema
    change that breaks rendering fails this harness too.

    python3 .github/scripts/tests/test-pao-packet.py
"""
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
FIXTURES = os.path.join(HERE, "fixtures")
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
RENDERER = os.path.join(REPO, ".github", "scripts", "pao-render-packet.py")
CARD = os.path.join(REPO, "tools", "make-social-card.py")

FAILURES = []


def check(name, cond, detail=""):
    print(("  PASS  " if cond else "  FAIL  ") + name + (("  " + detail) if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def render(fixture, date="2026-08-17"):
    d = tempfile.mkdtemp()
    out = os.path.join(d, "packet.md")
    stf = os.path.join(d, "status.txt")
    proc = subprocess.run(
        [sys.executable, RENDERER, os.path.join(FIXTURES, fixture), out, date, "999", stf],
        capture_output=True, text=True,
    )
    body = open(out, encoding="utf-8").read() if os.path.exists(out) else None
    status = open(stf, encoding="utf-8").read().strip() if os.path.exists(stf) else ""
    return body, status, proc


print("== packet-normal.json — full week, three drafts ==")
body, status, proc = render("packet-normal.json")
check("renderer exits 0", body is not None, proc.stderr)
if body:
    check("status OK", status == "OK", "was %r" % status)
    check("headline counts come from the payload",
          "1 shipped change(s), 2 verification entr(ies), 1 new listing(s)" in body)
    check("no failure banner", "PACKET FAILED" not in body)
    check("all three channels present",
          all(c in body for c in ("tops-facebook", "vbs-linkedin", "vbs-facebook")))
    check("clean copy is offered for posting", "**Post this**" in body)
    check("annotated copy is collapsed, not primary", "Annotated copy" in body)
    check("body_clean carries no citation markers",
          "renews at the standard paid rate unless you cancel. Veterans" in body)
    check("image briefs rendered", "IMAGE BRIEFS" in body and "make-social-card.py" in body)
    check("flags rendered with the date", "2026-09-02" in body)
    check("cvso email included when warranted", "CVSO / PARTNER EMAIL" in body)
    check("distribution-is-manual notice present", "cannot post, send, or schedule" in body)
    check("voice gate found nothing", "VOICE GATE" not in body)

print("== packet-quiet.json — everything read, nothing shipped ==")
body, status, proc = render("packet-quiet.json", "2026-08-24")
if body:
    check("status QUIET", status == "QUIET", "was %r" % status)
    check("quiet week is NOT reported as a failure", "PACKET FAILED" not in body)
    check("quiet week states no drafts were written, deliberately",
          "deliberately" in body and "QUIET WEEK" in body)
    check("no drafts section content", "**Post this**" not in body)

print("== packet-inputs-unread.json — degraded coverage ==")
body, status, proc = render("packet-inputs-unread.json", "2026-08-31")
if body:
    check("status FAILED", status == "FAILED", "was %r" % status)
    check("NO all-clear language on a degraded packet",
          "NO ACTION NEEDED" not in body and "QUIET WEEK" not in body)
    check("failure BLUF leads the body", body.lstrip().startswith("PAO PACKET FAILED"))
    check("names the unread inputs", "3 of 5 read" in body)
    check("warns against posting from it", "should be posted without checking" in body)

print("== packet-no-cvso.json — email correctly declined ==")
body, status, proc = render("packet-no-cvso.json", "2026-09-07")
if body:
    check("status OK", status == "OK", "was %r" % status)
    check("email declined, with the reason stated",
          "Declined this week" in body and "caseworker" in body)
    check("no email body rendered", "Colleagues —" not in body)

print("== packet-voice-violations.json — the gate must catch these ==")
body, status, proc = render("packet-voice-violations.json", "2026-09-14")
if body:
    check("voice gate fired", "VOICE GATE" in body)
    check("caught leaked citation marker", "still contains [src:" in body)
    check("caught exclamation mark", "exclamation mark" in body)
    check("caught performative phrase", "performative phrase" in body)

print("== packet-malformed.json — result present but not JSON ==")
body, status, proc = render("packet-malformed.json", "2026-09-21")
if body:
    check("renderer exits 0", proc.returncode == 0)
    check("status FAILED", status == "FAILED", "was %r" % status)
    check("NO all-clear language", "NO ACTION NEEDED" not in body and "QUIET WEEK" not in body)
    check("failure BLUF leads the body", body.lstrip().startswith("PAO PACKET FAILED"))
    check("raw output preserved, nothing dropped",
          "could not produce a packet" in body.lower())

print("== packet-cvso-object.json — RUN 32030211413, the payload that killed the renderer ==")
# Regression fixture. This is the real envelope from the failed run, byte for
# byte, not a reconstruction. Before the fix this raised TypeError at
# fence_for() and the renderer exited 1 without writing a status file, which is
# why the workflow's default FAILED held and a FLASH went up over a packet that
# was actually fine. Every assertion below failed to exist that morning.
body, status, proc = render("packet-cvso-object.json")
check("renderer exits 0 on the payload that crashed it", body is not None, proc.stderr)
check("no TypeError from fence_for", "TypeError" not in (proc.stderr or ""), proc.stderr)
if body:
    check("status OK", status == "OK", "was %r" % status)
    # (a) populated cvso_email is an OBJECT, not a string. No fixture had ever
    # exercised one: the prompt only ever illustrated null, so the null path and
    # the declined path were the only paths under test.
    check("object-shaped cvso_email renders", "CVSO / PARTNER EMAIL" in body)
    check("clean copy offered for sending", "**Send this**" in body)
    check("annotated copy collapsed, not primary",
          body.count("Annotated copy") == 4)  # 3 drafts + the email
    check("email body_clean carries no citation markers",
          "**Veterans Forge** — Free hands-on AI" in body)
    check("email note surfaced", "caseworker criterion" in body)
    check("NOT dumped as a raw unrecognized shape", "Unrecognized shape" not in body)
    # (b) the model appended a BRIEF after the fenced block despite the prompt
    # saying "a single JSON object in a fenced block, nothing else". Extraction
    # has to survive that, and the primary evidence block has to stay clean.
    check("trailing BRIEF did not defeat extraction",
          "Could not parse the packet output" not in body)
    check("parsed path taken, envelope collapsed below it", "Full SDK envelope" in body)
    inner_block = body.split("## Evidence", 1)[-1].split("<details>", 1)[0]
    check("BRIEF is NOT inside the primary evidence JSON", "BRIEF" not in inner_block)
    check("BRIEF is preserved in the full envelope", "BRIEF" in body)
    check("flags survived to the packet", "2026-09-02" in body)

print("== packet-resources-unchanged.json — count unchanged, delta is empty ==")
# The DELTA half of the same incident. Run 32030211413 named two RESOURCES ids
# as new while const RESOURCES still held 47 entries against a baseline of 47.
# An empty resources delta beside a non-empty whatsnew delta must stay OK: a
# renderer that collapsed it into QUIET would bury a real shipped change.
body, status, proc = render("packet-resources-unchanged.json")
if body:
    check("status OK, NOT quiet", status == "OK", "was %r" % status)
    check("empty resources delta is not a quiet week", "QUIET WEEK" not in body)
    check("headline reports 0 new listings from the payload",
          "1 shipped change(s), 0 verification entr(ies), 0 new listing(s)" in body)
    check("new listings line reads none", "**New listings:** none" in body)
    check("the one real change is still reported", "**WHATS_NEW:** v96" in body)
    check("drafts still rendered for the change that did ship", "**Post this**" in body)

print("== tools/make-social-card.py — brief schema still renders ==")
proc = subprocess.run([sys.executable, CARD, "--self-test"], capture_output=True, text=True)
check("card generator self-test passes", proc.returncode == 0,
      proc.stdout.strip().splitlines()[-1] if proc.stdout else proc.stderr)

print()
if FAILURES:
    print("FAILED (%d): %s" % (len(FAILURES), ", ".join(FAILURES)))
    sys.exit(1)
print("ALL CHECKS PASSED")
