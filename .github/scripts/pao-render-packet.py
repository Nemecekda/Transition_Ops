#!/usr/bin/env python3
"""Render the PAO weekly packet payload into a GitHub issue body.

Built with J1's corrections already applied rather than retrofitted after an
incident:

  * status is derived FROM THE PAYLOAD, never templated and never taken from
    argv. J1 filed "NO ACTION NEEDED - detected changes in 3 source(s)" over a
    payload reporting 0 of 0 read, because the headline came from the command
    line while the coverage came from the model. Those are different
    provenances and they must never be conflated.
  * a degraded packet says so in its first line. No all-clear language is
    emitted on any failure path.
  * fenced blocks are measured before they are written, so model output
    containing a fence cannot break out of the block that quotes it.

usage: pao-render-packet.py <payload.json> <out.md> <packet_date> <run_id> [status_file]
"""
import json
import re
import sys

VOICE_DENYLIST = [
    "excited to announce", "thrilled", "proud to share", "game-changer",
    "we're thrilled", "delighted", "honored to", "humbled to",
]


def fence_for(text):
    """Widest backtick run in the text, plus one, minimum three.

    TOTAL BY CONSTRUCTION. Run 32030211413 died on this function's first line:
    cvso_email arrived as an OBJECT, re.finditer refused it, and the packet went
    down with a TypeError. A fence width is a formatting detail. It must never
    be the thing that takes a packet down, whatever the drafter hands it.
    """
    if not isinstance(text, str):
        text = "" if text is None else str(text)
    runs = [len(m.group(0)) for m in re.finditer(r"`+", text)]
    return "`" * max(3, (max(runs) + 1) if runs else 3)


def extract_payload(envelope):
    if not isinstance(envelope, dict):
        return None, None
    result = envelope.get("result")
    if not isinstance(result, str):
        return None, None
    m = re.search(r"```(?:json)?\s*\n(.*?)\n\s*```", result, re.S)
    inner = m.group(1) if m else result.strip()
    try:
        payload = json.loads(inner)
    except (ValueError, TypeError):
        return None, None
    return (payload, inner) if isinstance(payload, dict) else (None, None)


def packet_status(payload):
    """OK / QUIET / FAILED, decided only from the payload.

    QUIET is a real, healthy outcome: every input read, nothing shipped. It is
    NOT a failure and must not be reported as one - but it also must not be
    reported as a packet with content.
    """
    if not isinstance(payload, dict):
        return "FAILED", "packet output could not be parsed into a payload"

    total = payload.get("sources_total")
    read = payload.get("sources_read")
    failed = payload.get("sources_failed")
    failed = failed if isinstance(failed, list) else []

    if not isinstance(read, int) or not isinstance(total, int):
        return "FAILED", "payload did not report sources_read / sources_total"
    if read == 0:
        return "FAILED", "zero inputs read - the packet saw nothing"
    if read < total:
        return "FAILED", "partial inputs: %d of %d read" % (read, total)
    if failed:
        names = ", ".join(str(f.get("path", "?")) for f in failed if isinstance(f, dict))
        return "FAILED", "input failures recorded (%s)" % (names or "unknown")

    delta = payload.get("delta") or {}
    counts = [len(delta.get(k) or []) for k in ("whatsnew", "v_entries", "resources")]
    if sum(counts) == 0:
        return "QUIET", "all inputs read; nothing shipped this week"
    return "OK", ""


def voice_violations(payload):
    """Cheap, deterministic gate. Not a substitute for Dean reading it."""
    out = []
    for d in payload.get("drafts") or []:
        if not isinstance(d, dict):
            continue
        ch = d.get("channel", "?")
        clean = d.get("body_clean") or ""
        ann = d.get("body_annotated") or ""
        if "[src:" in clean:
            out.append("%s: body_clean still contains [src: markers" % ch)
        if ann and "[src:" not in ann:
            out.append("%s: body_annotated carries no citation" % ch)
        if "!" in clean:
            out.append("%s: exclamation mark in body_clean" % ch)
        low = clean.lower()
        for phrase in VOICE_DENYLIST:
            if phrase in low:
                out.append("%s: performative phrase %r" % (ch, phrase))
    return out


def render_drafts(payload):
    s = ["## DRAFTS\n"]
    drafts = payload.get("drafts")
    if not isinstance(drafts, list) or not drafts:
        s.append("No drafts in this packet.\n")
        return "\n".join(s)
    for d in drafts:
        if not isinstance(d, dict):
            continue
        s.append("### %s\n" % d.get("channel", "unknown channel"))
        clean = d.get("body_clean") or ""
        ann = d.get("body_annotated") or ""
        f = fence_for(clean)
        s.append("**Post this** (citations already removed):\n")
        s.append(f + "\n" + clean + "\n" + f + "\n")
        s.append("<details>\n<summary>Annotated copy — verify against this</summary>\n")
        fa = fence_for(ann)
        s.append("\n" + fa + "\n" + ann + "\n" + fa + "\n\n</details>\n")
        if d.get("note"):
            s.append("_Note: %s_\n" % d["note"])
    return "\n".join(s)


def render_briefs(payload):
    s = ["## IMAGE BRIEFS\n"]
    briefs = payload.get("image_briefs")
    if not isinstance(briefs, list) or not briefs:
        s.append("No image briefs in this packet.\n")
        return "\n".join(s)
    s.append("Render with `python3 tools/make-social-card.py <brief.json> <out.png>`. "
             "The generator refuses an overflowing card rather than truncating it.\n")
    body = json.dumps(briefs, indent=2, ensure_ascii=False)
    f = fence_for(body)
    s.append(f + "json\n" + body + "\n" + f + "\n")
    return "\n".join(s)


def render_flags(payload):
    s = ["## FLAGS — dates inside 21 days\n"]
    flags = payload.get("flags")
    if not isinstance(flags, list) or not flags:
        s.append("None.\n")
        return "\n".join(s)
    for fl in flags:
        if isinstance(fl, dict):
            s.append("- **%s** — %s _(%s)_" % (fl.get("date", "?"), fl.get("what", "?"),
                                               fl.get("why_now", "")))
    s.append("")
    return "\n".join(s)


def render_cvso(payload):
    """The CVSO/partner email, in whichever shape the drafter produced.

    THE GAP THAT KILLED RUN 32030211413. The prompt's OUTPUT block only ever
    illustrated `"cvso_email": null`, so the POPULATED shape was never specified
    and no fixture ever exercised one. Every green harness run had been testing
    the null path and the declined path. The drafter, handed an underspecified
    field, produced the shape every other body in the packet uses -
    {body_annotated, body_clean, note} - which is the reasonable answer, and the
    renderer was written for a bare string.

    Both shapes are accepted here. The prompt has since been made explicit, and
    this still stays permissive: a renderer that handles only the shape it was
    promised is a renderer that files a FLASH the next time the drafter is
    reasonable in a way nobody predicted. Rendering something Dean can read
    beats being right about a schema.
    """
    email = payload.get("cvso_email")
    clean = annotated = note = raw = ""

    if isinstance(email, dict):
        clean = email.get("body_clean") or ""
        annotated = email.get("body_annotated") or ""
        note = email.get("note") or ""
        # Annotated-only is still a sendable email once Dean strips markers;
        # showing it beats showing nothing and claiming the week was declined.
        if not clean and annotated:
            clean, annotated = annotated, ""
            note = (note + " " if note else "") + \
                "RENDERER: no body_clean in this packet - the copy above is the " \
                "ANNOTATED body and still carries [src: markers. Strip them before sending."
    elif isinstance(email, str):
        clean = email
    elif email:
        # Some third shape entirely. Render it verbatim rather than dropping it:
        # an awkward email in the packet is recoverable, a silently missing one
        # is not, and silence is what a FLASH exists to prevent.
        raw = json.dumps(email, indent=2, ensure_ascii=False, default=str)

    if raw:
        f = fence_for(raw)
        return ("## CVSO / PARTNER EMAIL\n\n**Unrecognized shape - rendered raw so "
                "nothing is lost.**\n\n" + f + "json\n" + raw + "\n" + f + "\n")

    if clean.strip():
        s = ["## CVSO / PARTNER EMAIL\n"]
        f = fence_for(clean)
        s.append("**Send this** (citations already removed):\n")
        s.append(f + "\n" + clean + "\n" + f + "\n")
        if annotated:
            s.append("<details>\n<summary>Annotated copy — verify against this</summary>\n")
            fa = fence_for(annotated)
            s.append("\n" + fa + "\n" + annotated + "\n" + fa + "\n\n</details>\n")
        if note:
            s.append("_Note: %s_\n" % note)
        return "\n".join(s)

    if payload.get("cvso_email_declined"):
        return ("## CVSO / PARTNER EMAIL\n\nDeclined this week: %s\n"
                % payload["cvso_email_declined"])
    return ""


def main():
    payload_path, out_path, packet_date, run_id = sys.argv[1:5]
    status_file = sys.argv[5] if len(sys.argv) > 5 else None

    raw = open(payload_path, encoding="utf-8", errors="replace").read()
    try:
        envelope = json.loads(raw)
    except (ValueError, TypeError):
        envelope = None
    payload, inner = extract_payload(envelope) if envelope is not None else (None, None)

    status, reason = packet_status(payload)
    s = []

    if status == "FAILED":
        s.append("PAO PACKET FAILED — inputs unread: %s. Nothing below is a "
                 "complete picture of the week, and no draft here should be "
                 "posted without checking what was missed.\n" % reason)
    elif status == "QUIET":
        s.append("QUIET WEEK — no action needed: every input was read and nothing "
                 "shipped that warrants distribution. No drafts were written, "
                 "deliberately.\n")
    else:
        d = payload.get("delta") or {}
        s.append("PAO PACKET %s — %d shipped change(s), %d verification entr(ies), "
                 "%d new listing(s). Drafts below are for review; nothing has been "
                 "posted or sent.\n"
                 % (packet_date, len(d.get("whatsnew") or []),
                    len(d.get("v_entries") or []), len(d.get("resources") or [])))

    if payload is not None:
        d = payload.get("delta") or {}
        s.append("## WHAT SHIPPED\n")
        s.append("Coverage: %s of %s inputs read.\n"
                 % (payload.get("sources_read"), payload.get("sources_total")))
        for label, key in (("WHATS_NEW", "whatsnew"), ("Verification entries", "v_entries"),
                           ("New listings", "resources")):
            items = d.get(key) or []
            s.append("- **%s:** %s" % (label, ", ".join(map(str, items)) if items else "none"))
        s.append("")
        if status != "QUIET":
            s.append(render_drafts(payload))
            s.append(render_briefs(payload))
        s.append(render_flags(payload))
        cvso = render_cvso(payload)
        if cvso:
            s.append(cvso)

        viol = voice_violations(payload)
        if viol:
            s.append("## VOICE GATE — %d issue(s), read before posting\n" % len(viol))
            for v in viol:
                s.append("- %s" % v)
            s.append("")
    else:
        s.append("## WHAT SHIPPED\n")
        s.append("**Could not parse the packet output.** The complete raw output is "
                 "preserved below — nothing was dropped.\n")

    s.append("## DISTRIBUTION IS MANUAL\n")
    s.append("The PAO holds no platform credential and cannot post, send, or schedule. "
             "Dean distributes. Strip nothing: `body_clean` is already clean.\n")

    s.append("## Evidence\n")
    s.append("Run: %s" % run_id)
    body = raw.rstrip()
    f = fence_for(body)
    if inner is not None:
        fi = fence_for(inner)
        s.append(fi + "json\n" + inner + "\n" + fi + "\n")
        s.append("<details>\n<summary>Full SDK envelope</summary>\n\n"
                 + f + "json\n" + body + "\n" + f + "\n\n</details>\n")
    else:
        s.append("<details>\n<summary>Raw output (unparsed)</summary>\n\n"
                 + f + "json\n" + body + "\n" + f + "\n\n</details>\n")

    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(s))

    if status_file:
        with open(status_file, "w", encoding="utf-8") as fh:
            fh.write(status + "\n")


if __name__ == "__main__":
    main()
