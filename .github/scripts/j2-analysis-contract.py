"""Offline-only J2 response boundary. Never salvages inner objects or emits prose."""
import hashlib
import json
from pathlib import Path

MAX_BYTES = 2 * 1024 * 1024
PAYLOAD_KEYS = {"j1_issues_consumed", "sources_correlated", "coverage_note", "findings"}
FINDING_KEYS = {"verdict", "source_id", "subject", "source_excerpt", "app_line",
                "app_excerpt", "what_differs", "amended_bill_trigger",
                "needs_ladder_reason", "contains_instruction_like_text"}


class ContractError(ValueError):
    pass


def _pairs(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ContractError("duplicate_key")
        result[key] = value
    return result


def _constant(_value):
    raise ContractError("nonfinite_number")


def _json(text):
    try:
        return json.loads(text, object_pairs_hook=_pairs, parse_constant=_constant)
    except (ValueError, TypeError, RecursionError):
        raise ContractError("invalid_json") from None


def _text(value, maximum):
    return (isinstance(value, str) and len(value) <= maximum
            and not any(ord(c) < 32 and c not in "\n\r\t" for c in value)
            and not any(0xD800 <= ord(c) <= 0xDFFF for c in value))


def decode_result(envelope, gathered):
    if (not isinstance(envelope, dict) or envelope.get("is_error") is not False
            or envelope.get("subtype") != "success"
            or not isinstance(envelope.get("result"), str)):
        raise ContractError("invalid_envelope")
    text = envelope["result"].strip()
    form = "json"
    if text.startswith("```json\n") and text.endswith("\n```"):
        text = text[len("```json\n"):-len("\n```")]
        form = "json_fence"
    payload = _json(text)
    if not isinstance(payload, dict) or set(payload) != PAYLOAD_KEYS:
        raise ContractError("invalid_payload_shape")
    ids = payload["j1_issues_consumed"]
    if (not isinstance(ids, list) or len(ids) > 100
            or any(type(n) is not int or n <= 0 for n in ids)
            or len(set(ids)) != len(ids) or not set(ids).issubset(gathered)):
        raise ContractError("invalid_consumed_ids")
    if (type(payload["sources_correlated"]) is not int
            or not 0 <= payload["sources_correlated"] <= 10000
            or not _text(payload["coverage_note"], 4000)):
        raise ContractError("invalid_coverage")
    findings = payload["findings"]
    if not isinstance(findings, list) or len(findings) > 100:
        raise ContractError("invalid_findings")
    for item in findings:
        if not isinstance(item, dict) or set(item) != FINDING_KEYS:
            raise ContractError("invalid_finding_shape")
        # Vocabulary and source character/verification governors remain downstream.
        for key, maximum in {"verdict": 40, "source_id": 80, "subject": 500,
                             "source_excerpt": 16000, "app_excerpt": 16000,
                             "what_differs": 8000, "needs_ladder_reason": 4000}.items():
            if not _text(item[key], maximum):
                raise ContractError("invalid_finding_text")
        if item["app_line"] is not None and (type(item["app_line"]) is not int or item["app_line"] <= 0):
            raise ContractError("invalid_app_line")
        if any(type(item[k]) is not bool for k in ("amended_bill_trigger", "contains_instruction_like_text")):
            raise ContractError("invalid_finding_flag")
    return payload, form


def load_analysis(result_path, index_path):
    receipt = {"schema": "tops.j2-parse.v1", "status": "rejected", "reason": "unreadable_input",
               "format": None, "gathered_count": None, "accepted_count": 0,
               "response_bytes": None, "response_sha256": None}
    try:
        with Path(index_path).open("rb") as stream:
            index_bytes = stream.read(MAX_BYTES + 1)
        if len(index_bytes) > MAX_BYTES:
            raise ContractError("invalid_gathered_index")
        index = _json(index_bytes)
        if (not isinstance(index, list) or len(index) > 100
                or any(not isinstance(row, dict) or type(row.get("number")) is not int
                       or row["number"] <= 0 for row in index)):
            raise ContractError("invalid_gathered_index")
        gathered = [row["number"] for row in index]
        if len(set(gathered)) != len(gathered):
            raise ContractError("invalid_gathered_index")
        receipt["gathered_count"] = len(gathered)
        receipt["response_bytes"] = Path(result_path).stat().st_size
        if receipt["response_bytes"] > MAX_BYTES:
            raise ContractError("response_too_large")
        with Path(result_path).open("rb") as stream:
            raw = stream.read(MAX_BYTES + 1)
        if len(raw) > MAX_BYTES:
            raise ContractError("response_too_large")
        receipt["response_sha256"] = hashlib.sha256(raw).hexdigest()
        payload, form = decode_result(_json(raw), set(gathered))
        receipt.update(status="accepted", reason="none", format=form,
                       accepted_count=len(payload["j1_issues_consumed"]))
        return payload, receipt
    except ContractError as error:
        receipt["reason"] = str(error)
    except (OSError, UnicodeError, RecursionError):
        pass
    return None, receipt
