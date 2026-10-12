#!/usr/bin/env python3
"""Render a useful review packet; raw model output stays in the run artifact.

No network, model calls, verification or distribution. The companion context is
built before drafting from workflow identity and the unchanged pinned baseline.
"""
import datetime as dt
import hashlib
import json
import re
import sys
from pathlib import Path

SOURCES = ["out/pao-baseline.json", "index.html", "intel/verification-log.md",
           ".claude/pao-context.md", ".claude/skills/brand-voice/SKILL.md",
           ".claude/pao-task-evidence.json", "out/pao-run-context.json"]
CHANNELS = {"tops-facebook": "TOPS Facebook", "vbs-facebook": "VBS Facebook",
            "vbs-linkedin": "VBS LinkedIn", "cvso-email": "CVSO / partner email"}
CITATION = re.compile(r"\[src: ([A-Za-z0-9][A-Za-z0-9:/._#?=&%+ -]{0,239})\]")
VOICE_DENYLIST = ["excited to announce", "thrilled", "proud to share", "game-changer",
                  "delighted", "honored to", "humbled to"]
MAX_BYTES = 2_000_000


def text(value, limit=1000):
    return (isinstance(value, str) and 0 < len(value.strip()) <= limit
            and not re.search(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", value))


def day(value):
    if not isinstance(value, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        raise ValueError("invalid date")
    return dt.date.fromisoformat(value)


def read_json(path):
    raw = Path(path).read_bytes()
    if len(raw) > MAX_BYTES:
        raise ValueError("input too large")
    return json.loads(raw)


def fence_for(value):
    runs = [len(m[0]) for m in re.finditer(r"`+", value)]
    return "`" * max(3, max(runs, default=0) + 1)


def quoted(value):
    fence = fence_for(value)
    return fence + "\n" + value + "\n" + fence


def make_context(baseline_path, packet_date, source_commit, run_id):
    date = day(packet_date)
    if not re.fullmatch(r"[0-9a-f]{40}", source_commit) or not re.fullmatch(r"[0-9]+", run_id):
        raise ValueError("invalid workflow identity")
    baseline = read_json(baseline_path)
    required = {"packet_date", "last_whatsnew_version", "last_v_entry", "last_resources_count"}
    if not isinstance(baseline, dict) or not required.issubset(baseline):
        raise ValueError("baseline fields missing")
    if day(baseline["packet_date"]) > date:
        raise ValueError("baseline is in the future")
    if not re.fullmatch(r"v[0-9]+", str(baseline["last_whatsnew_version"])):
        raise ValueError("invalid baseline version")
    if not re.fullmatch(r"V-[A-Za-z0-9-]+", str(baseline["last_v_entry"])):
        raise ValueError("invalid baseline verification marker")
    if type(baseline["last_resources_count"]) is not int or baseline["last_resources_count"] < 0:
        raise ValueError("invalid baseline count")
    return {"schema_version": 1, "packet_date": packet_date,
            "period_start": str(date - dt.timedelta(days=6)), "period_end": packet_date,
            "source_commit": source_commit, "run_id": run_id,
            "app_index_sha256": hashlib.sha256((Path(__file__).resolve().parents[2] / "index.html").read_bytes()).hexdigest(),
            "repository": "Nemecekda/Transition_Ops", "baseline_issue": 22,
            "baseline": {key: baseline[key] for key in sorted(required)},
            "baseline_sha256": hashlib.sha256(Path(baseline_path).read_bytes()).hexdigest(),
            "source_paths": SOURCES}


def validate_context(context, packet_date, run_id):
    if not isinstance(context, dict):
        return False
    try:
        date = day(packet_date)
        return (context.get("schema_version") == 1 and context.get("packet_date") == packet_date
                and context.get("run_id") == run_id and re.fullmatch(r"[0-9]+", run_id)
                and context.get("repository") == "Nemecekda/Transition_Ops"
                and context.get("baseline_issue") == 22 and context.get("source_paths") == SOURCES
                and context.get("period_start") == str(date - dt.timedelta(days=6))
                and context.get("period_end") == packet_date
                and re.fullmatch(r"[0-9a-f]{40}", context.get("source_commit", ""))
                and re.fullmatch(r"[0-9a-f]{64}", context.get("baseline_sha256", ""))
                and re.fullmatch(r"[0-9a-f]{64}", context.get("app_index_sha256", ""))
                and day(context["baseline"]["packet_date"]) <= date
                and isinstance(context["baseline"]["last_whatsnew_version"], str)
                and re.fullmatch(r"v[0-9]+", context["baseline"]["last_whatsnew_version"])
                and isinstance(context["baseline"]["last_v_entry"], str)
                and re.fullmatch(r"V-[A-Za-z0-9-]+", context["baseline"]["last_v_entry"])
                and type(context["baseline"]["last_resources_count"]) is int
                and context["baseline"]["last_resources_count"] >= 0)
    except (KeyError, TypeError, ValueError):
        return False


def extract_payload(envelope):
    if not isinstance(envelope, dict) or envelope.get("is_error", False) is not False:
        return None
    if envelope.get("subtype", "success") != "success":
        return None
    result = envelope.get("result")
    if not isinstance(result, str):
        return None
    match = re.search(r"```(?:json)?\s*\n(.*?)\n\s*```", result, re.S)
    try:
        parsed = json.loads(match.group(1) if match else result.strip())
        return parsed if isinstance(parsed, dict) else None
    except (TypeError, ValueError, RecursionError):
        return None


def current_tasks(evidence, context):
    """Only repo-reviewed, dated task observations, never inferred from index.html."""
    accepted, errors = {}, []
    if not isinstance(evidence, dict) or evidence.get("schema_version") != 1:
        return {}, ["task_evidence_invalid"]
    records = evidence.get("tasks")
    if not isinstance(records, list) or len(records) > 8:
        return {}, ["task_evidence_invalid"]
    seen = set()
    for record in records:
        if not isinstance(record, dict):
            errors.append("task_record_invalid")
            continue
        identity = record.get("id")
        valid = isinstance(identity, str) and re.fullmatch(r"[a-z0-9-]{1,100}", identity)
        valid = valid and identity not in seen
        if isinstance(identity, str) and identity in seen:
            accepted.pop(identity, None)
        if isinstance(identity, str):
            seen.add(identity)
        fields = ("task", "entry_url", "release_identity", "result", "limitations",
                  "evidence_ref", "reviewed_by")
        valid = valid and all(text(record.get(key)) for key in fields)
        valid = valid and record.get("accepted") is True and record.get("kind") in ("existing_product", "verified_change")
        valid = valid and text(record.get("reviewed_copy"), 5000)
        valid = valid and record.get("app_index_sha256") == context.get("app_index_sha256")
        if record.get("kind") == "verified_change":
            primary = record.get("primary_verification_refs")
            valid = valid and isinstance(primary, list) and 1 <= len(primary) <= 8 and all(text(ref, 500) for ref in primary)
            valid = valid and text(record.get("conditions"))
            try:
                valid = valid and day(context["period_start"]) <= day(record.get("release_date")) <= day(context["period_end"])
            except (ValueError, TypeError, KeyError):
                valid = False
        valid = valid and record.get("audience") in ("member", "institution")
        steps = record.get("steps")
        valid = valid and isinstance(steps, list) and 1 <= len(steps) <= 6 and all(text(s, 500) for s in steps)
        try:
            observed = day(record.get("observed_date"))
            expires = day(record.get("valid_through"))
            valid = valid and observed <= day(context["period_end"]) <= expires
            valid = valid and observed <= expires <= observed + dt.timedelta(days=14)
        except (ValueError, TypeError, KeyError):
            valid = False
        if valid and record["entry_url"].startswith("https://transitionops.org/"):
            accepted[identity] = record
        else:
            # Expired observations are retained as history, never promoted to current.
            errors.append("task_record_not_current_or_accepted")
    return accepted, errors


def check_draft(draft, tasks, channel=None):
    if not isinstance(draft, dict):
        return None, "draft_shape_invalid"
    channel = channel or draft.get("channel")
    if not isinstance(channel, str) or channel not in CHANNELS:
        return None, "draft_channel_invalid"
    clean, annotated = draft.get("body_clean"), draft.get("body_annotated")
    if not text(clean, 5000) or not text(annotated, 6500):
        return None, "draft_body_invalid"
    refs = draft.get("evidence_ids")
    if not isinstance(refs, list) or len(refs) != 1 or not isinstance(refs[0], str) or refs[0] not in tasks:
        return None, "draft_current_task_evidence_missing"
    record = tasks[refs[0]]
    if draft.get("kind") != record["kind"]:
        return None, "draft_evidence_class_mismatch"
    if clean != record["reviewed_copy"]:
        return None, "draft_wording_needs_editorial_review"
    expected_audience = "institution" if channel == "vbs-linkedin" else "member"
    if record["audience"] != expected_audience:
        return None, "draft_channel_audience_mismatch"
    citations = CITATION.findall(annotated)
    if not citations or set(citations) != {"task:" + refs[0]}:
        return None, "draft_citations_invalid"
    if "[src:" in clean or CITATION.sub("", annotated) != clean:
        return None, "draft_clean_copy_mismatch"
    if re.search(r"\[src:", CITATION.sub("", annotated)):
        return None, "draft_citations_invalid"
    if "!" in clean or any(phrase in clean.lower() for phrase in VOICE_DENYLIST):
        return None, "draft_voice_review_needed"
    return dict(draft, channel=channel), None


def evaluate(payload, context, evidence, packet_date, run_id):
    errors, drafts = [], []
    context_ok = validate_context(context, packet_date, run_id)
    if not context_ok:
        return "FAILED", [], {}, ["run_context_invalid"]
    tasks, task_errors = current_tasks(evidence, context)
    if not isinstance(payload, dict):
        return "FAILED", [], tasks, ["packet_unparsed"] + task_errors
    if (payload.get("packet_date") != packet_date
            or payload.get("source_commit") != context["source_commit"]
            or payload.get("baseline_sha256") != context["baseline_sha256"]
            or payload.get("period_start") != context["period_start"]
            or payload.get("period_end") != context["period_end"]):
        errors.append("model_context_mismatch")
    read, total, failed, paths = (payload.get(k) for k in
                                ("sources_read", "sources_total", "sources_failed", "source_paths_read"))
    if (type(read) is not int or type(total) is not int or read != len(SOURCES)
            or total != len(SOURCES) or failed != [] or paths != SOURCES):
        errors.append("input_coverage_incomplete_or_invalid")
    delta = payload.get("delta")
    if not isinstance(delta, dict) or any(not isinstance(delta.get(k), list)
        or len(delta[k]) > 100 or any(not text(item, 160) for item in delta[k])
        for k in ("whatsnew", "v_entries", "resources")):
        errors.append("delta_shape_invalid")
    items = payload.get("drafts")
    if not isinstance(items, list) or len(items) > 3:
        errors.append("draft_collection_invalid")
    email = payload.get("cvso_email")
    if email is not None and not isinstance(email, dict):
        errors.append("email_shape_invalid")
    if errors:
        return "FAILED", [], tasks, errors + task_errors
    errors += task_errors
    gaps = payload.get("comparison_gaps", [])
    if not isinstance(gaps, list) or len(gaps) > 8 or any(not text(gap, 500) for gap in gaps):
        return "FAILED", [], tasks, errors + ["comparison_gaps_invalid"]
    if gaps:
        errors.append("historical_comparison_limited")
    channels = set()
    for item in items + ([dict(email, channel="cvso-email")] if email is not None else []):
        valid, error = check_draft(item, tasks)
        if error:
            errors.append(error)
        elif valid["channel"] in channels:
            errors.append("draft_channel_duplicate")
        else:
            channels.add(valid["channel"])
            drafts.append(valid)
    return ("REVIEW" if drafts else "ACTION_REQUIRED"), drafts, tasks, errors


def render(envelope, context, evidence, packet_date, run_id):
    payload = extract_payload(envelope)
    status, drafts, tasks, errors = evaluate(payload, context, evidence, packet_date, run_id)
    if status == "FAILED":
        lead = "Hold distribution and repair the packet evidence."
        why = "The packet's input coverage, run context or structure did not pass validation."
        owner = "S3"
        action = "Inspect pao-validation.json and the retained inputs; correct the named gap before drafting again. Do not advance the baseline."
    elif drafts:
        lead = "Review the evidence-backed draft below for a partner handoff."
        why = ("It explains an observed existing product task; it is not a new-release or policy announcement."
               if all(d["kind"] == "existing_product" for d in drafts)
               else "A current-change draft is tied to a dated, reviewed release and primary verification record.")
        owner = "Dean, with PAO"
        action = "Check the draft against its dated task record, choose the useful channel, then distribute manually if approved."
    elif tasks:
        lead = "Turn the observed product task into a short partner guide."
        why = "A recent task observation is available, but this packet has no usable distribution copy."
        owner = "PAO"
        action = "Review proposed wording against the accepted task record, or use its reviewed copy. Prepare one caseworker handoff with the checked steps, result and limits."
    else:
        lead = "Verify one useful live journey before drafting a partner handoff."
        why = "The source comparison supplies history, but no recent accepted product-task observation supports distribution."
        owner = "S3, then PAO"
        action = "Walk Career without a resume through choosing a role and opening jobs by area. Record the public URL, observed build, steps, result and limits; PAO can then draft one practical guide."
    s = ["**Recommendation: " + lead + "**", why]
    for draft in sorted(drafts, key=lambda d: d["channel"] != "cvso-email"):
        record = tasks[draft["evidence_ids"][0]]
        s += ["### " + CHANNELS[draft["channel"]] + " - draft for Dean's review",
              ("Existing-feature how-to. Observed " if record["kind"] == "existing_product" else "Verified-change candidate. Observed ") + record["observed_date"]
              + "; this drafting run did not recheck production. Tested steps and limits are in the evidence record.", quoted(draft["body_clean"])]
    s += ["**Owner:** " + owner + ". **Next task:** " + action,
          "**Packet status:** " + status + ". " + str(len(drafts)) + " draft(s) eligible for human review; nothing posted or sent."]
    if validate_context(context, packet_date, run_id):
        baseline = context["baseline"]
        s.append("**Evidence window:** " + context["period_start"] + " through " + packet_date
                 + " (UTC). Source checkout `" + context["source_commit"][:12] + "` is not production verification.")
        s.append("**Baseline:** [issue #22](https://github.com/Nemecekda/Transition_Ops/issues/22), "
                 + baseline["packet_date"] + " (" + baseline["last_whatsnew_version"] + ", "
                 + baseline["last_v_entry"] + ", " + str(baseline["last_resources_count"]) + " resources), unchanged.")
        if isinstance(payload, dict) and isinstance(payload.get("delta"), dict):
            delta = payload["delta"]
            if all(isinstance(delta.get(key), list) for key in ("whatsnew", "v_entries", "resources")):
                s.append("Model-reported comparison since that baseline: %d changelog entries, %d verification records, %d appended listings. These are not weekly shipping counts; detailed deltas and any historical status claims require dated/amendment review in the artifact. An unchanged resource count does not prove unchanged content." % tuple(len(delta[key]) for key in ("whatsnew", "v_entries", "resources")))
    if errors:
        s.append("**Evidence gaps:** " + ", ".join(sorted(set(errors))) + ". A task observation does not verify benefits, policy, outcomes or the entire reporting week.")
    s.append("Distribution is manual. The PAO cannot post, send or schedule. Shape and citation checks do not replace factual or editorial approval.")
    if re.fullmatch(r"[0-9]+", run_id):
        s.append("[Run evidence](https://github.com/Nemecekda/Transition_Ops/actions/runs/" + run_id
                 + ") - look for `pao-evidence-" + run_id + "`: raw SDK output, annotated copy, image briefs, run context, task observations and validation receipt. Upload status is shown on the run.")
    else:
        s.append("Run identity is invalid; inspect the local evidence files. No evidence URL inferred.")
    receipt = {"status": status, "errors": errors, "drafts_for_review": len(drafts),
               "accepted_task_ids": list(tasks), "packet_date": packet_date,
               "checks": "structural and citation only; no semantic approval, live verification or distribution"}
    return "\n\n".join(s) + "\n", status, receipt


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--context":
        baseline, output, date, sha, run_id = sys.argv[2:]
        Path(output).write_text(json.dumps(make_context(baseline, date, sha, run_id), indent=2) + "\n")
        return
    payload_path, out_path, date, run_id, status_path = sys.argv[1:6]
    context_path = sys.argv[6] if len(sys.argv) > 6 else None
    evidence_path = sys.argv[7] if len(sys.argv) > 7 else None
    inputs = []
    for path in (payload_path, context_path, evidence_path):
        try:
            inputs.append(read_json(path) if path else None)
        except (ValueError, OSError, TypeError, RecursionError):
            inputs.append(None)
    body, status, receipt = render(*inputs, date, run_id)
    Path(out_path).write_text(body, encoding="utf-8")
    Path(status_path).write_text(status + "\n")
    Path(out_path).with_name("pao-validation.json").write_text(json.dumps(receipt, indent=2) + "\n")


if __name__ == "__main__":
    main()
