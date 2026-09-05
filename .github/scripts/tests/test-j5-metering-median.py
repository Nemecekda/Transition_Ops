#!/usr/bin/env python3
"""Tests for j5-metering-median.py. Run: python3 test-j5-metering-median.py"""
import json, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, "..", "j5-metering-median.py")
fails = []


def rec(agent, run_id, steps, start="2026-09-01T00:00:00Z", end="2026-09-01T00:01:00Z",
        status="success", attempt="1", schema="tops.metering.v1"):
    return {"schema": schema, "agent": agent, "run_id": run_id, "run_attempt": attempt,
            "workflow": "w", "event": "schedule", "started": start, "ended": end,
            "status": status, "model": "m", "model_steps_ran": steps, "dry_run": "0"}


def run(records, raw_extra=None):
    d = tempfile.mkdtemp()
    for i, r in enumerate(records):
        with open(os.path.join(d, "r%02d.json" % i), "w") as fh:
            json.dump(r, fh)
    for i, txt in enumerate(raw_extra or []):
        with open(os.path.join(d, "x%02d.json" % i), "w") as fh:
            fh.write(txt)
    md = os.path.join(d, "out.md"); js = os.path.join(d, "out.json")
    p = subprocess.run([sys.executable, SCRIPT, d, md, js], capture_output=True, text=True)
    return p.returncode, open(md).read(), json.load(open(js))


def check(name, cond, detail=""):
    print(("  PASS  " if cond else "  FAIL  ") + name + ("" if cond else "  " + detail))
    if not cond:
        fails.append(name)


print("== j5-metering-median ==")

# 1. a clear outlier is flagged
recs = [rec("j1", str(i), 1) for i in range(5)] + [rec("j1", "99", 5)]
rc, md, js = run(recs)
check("outlier run flagged", "FLAG run 99" in md, md)
check("median computed from the quiet majority", abs(js["agents"]["j1"]["median_cost_usd"] - 0.065) < 1e-9)

# 2. uniform runs produce no flags
rc, md, js = run([rec("j2", str(i), 1) for i in range(5)])
check("uniform runs produce no flags", js["agents"]["j2"]["flags"] == [])

# 3. below the sample minimum there is no median at all
rc, md, js = run([rec("j4", "1", 1), rec("j4", "2", 1)])
check("fewer than 3 samples -> no median", js["agents"]["j4"]["samples_below_minimum"] is True)
check("says so in the rendered text", "no median yet" in md, md)

# 4. failed runs are counted, not dropped
rc, md, js = run([rec("j3", "1", 0, status="failure"), rec("j3", "2", 0), rec("j3", "3", 0)])
check("failed runs counted", js["agents"]["j3"]["failed_runs"] == 1)
check("failed runs still contribute a record", js["agents"]["j3"]["runs"] == 3)

# 5. a re-run of the same run id does not double count
same = [rec("j5", "7", 1), rec("j5", "7", 1), rec("j5", "8", 1), rec("j5", "9", 1)]
rc, md, js = run(same)
check("duplicate run id deduped", js["agents"]["j5"]["runs"] == 3, str(js["agents"]["j5"]["runs"]))

# 6. a re-ATTEMPT is a distinct record
rc, md, js = run([rec("j5", "7", 1, attempt="1"), rec("j5", "7", 1, attempt="2")])
check("distinct attempts kept separate", js["agents"]["j5"]["runs"] == 2)

# 7. hostile / malformed input must degrade, never crash
rc, md, js = run([rec("j1", "1", 1), rec("j1", "2", 1), rec("j1", "3", 1)],
                 raw_extra=["{not json", "[]", json.dumps({"schema": "other.v9"}),
                            json.dumps({"schema": "tops.metering.v1"})])
check("malformed input does not crash", rc == 0, "rc=%d" % rc)
check("unreadable records counted", js["unreadable"] == 4, str(js["unreadable"]))
check("good records still analysed", js["agents"]["j1"]["runs"] == 3)

# 8. a broken timestamp must not sink the cost median
bad_ts = [rec("j2", "1", 1, end="not-a-date"), rec("j2", "2", 1), rec("j2", "3", 1)]
rc, md, js = run(bad_ts)
check("bad timestamp tolerated", rc == 0 and js["agents"]["j2"]["median_cost_usd"] is not None)

# 9. duration outlier flagged with its cause named
slow = [rec("j4", str(i), 1, end="2026-09-01T00:01:00Z") for i in range(4)]
slow.append(rec("j4", "99", 1, end="2026-09-01T00:20:00Z"))
rc, md, js = run(slow)
check("duration outlier flagged", any("duration" in c for f in js["agents"]["j4"]["flags"] for c in f["causes"]), md)

# 10. empty directory
rc, md, js = run([])
check("empty input is not an error", rc == 0 and "no metering records" in md)

print(("\nALL CHECKS PASSED" if not fails else "\n%d FAILURE(S): %s" % (len(fails), fails)))
sys.exit(1 if fails else 0)
