#!/usr/bin/env python3
"""Trailing-median efficiency check over tops.metering.v1 records.

Reads a directory of metering records (one per run, written by
.github/scripts/emit-metering.sh and collected from run artifacts), groups them
by agent, and flags any run costing or lasting more than 2x that agent's own
trailing median. The median is per-agent on purpose: J1 runs daily and cheap,
J4 monthly and slow, and a fleet-wide median would flag the shape of the
schedule rather than a real anomaly.

Fail-soft by design. J5 is the agent that reports on the others; a malformed
record must degrade this section, never take the spend check down with it.

Usage: j5-metering-median.py <records-dir> <out.md> [out.json]
"""
import json, os, sys, glob, statistics

# Per-model-invocation cost estimate, matching J5's existing firing-event basis.
# ESTIMATE, NOT AN INVOICE -- the Console is the only authority on real spend.
UNIT_COST_USD = 0.0650
FLAG_MULTIPLE = 2.0
MIN_SAMPLES = 3          # below this a "median" is noise, not a baseline


def load(records_dir):
    recs, bad = [], 0
    for p in sorted(glob.glob(os.path.join(records_dir, "**", "*.json"), recursive=True)):
        try:
            with open(p) as fh:
                d = json.load(fh)
        except Exception:
            bad += 1
            continue
        if not isinstance(d, dict) or d.get("schema") != "tops.metering.v1":
            bad += 1
            continue
        if not d.get("agent") or not d.get("run_id"):
            bad += 1
            continue
        recs.append(d)
    # One record per run id + attempt. A re-run overwrites rather than double-counts.
    dedup = {}
    for r in recs:
        dedup[(r["agent"], r["run_id"], str(r.get("run_attempt", "1")))] = r
    return list(dedup.values()), bad


def duration_s(rec):
    import datetime
    try:
        f = "%Y-%m-%dT%H:%M:%SZ"
        a = datetime.datetime.strptime(rec["started"], f)
        b = datetime.datetime.strptime(rec["ended"], f)
        d = (b - a).total_seconds()
        return d if d >= 0 else None
    except Exception:
        return None


def analyse(recs):
    agents = {}
    for r in recs:
        agents.setdefault(r["agent"], []).append(r)
    out = {}
    for agent, rs in sorted(agents.items()):
        costs = [int(r.get("model_steps_ran") or 0) * UNIT_COST_USD for r in rs]
        durs = [d for d in (duration_s(r) for r in rs) if d is not None]
        med_cost = statistics.median(costs) if len(costs) >= MIN_SAMPLES else None
        med_dur = statistics.median(durs) if len(durs) >= MIN_SAMPLES else None
        flags = []
        for r in rs:
            c = int(r.get("model_steps_ran") or 0) * UNIT_COST_USD
            d = duration_s(r)
            causes = []
            if med_cost is not None and med_cost > 0 and c > FLAG_MULTIPLE * med_cost:
                causes.append("cost $%.4f vs median $%.4f" % (c, med_cost))
            if med_dur is not None and med_dur > 0 and d is not None and d > FLAG_MULTIPLE * med_dur:
                causes.append("duration %ds vs median %ds" % (int(d), int(med_dur)))
            if causes:
                flags.append({"run_id": r["run_id"], "attempt": r.get("run_attempt", "1"),
                              "status": r.get("status"), "causes": causes})
        out[agent] = {
            "runs": len(rs),
            "failed_runs": sum(1 for r in rs if r.get("status") not in ("success", None)),
            "median_cost_usd": med_cost,
            "median_duration_s": med_dur,
            "samples_below_minimum": med_cost is None,
            "flags": flags,
        }
    return out


def render(res, bad):
    L = ["EFFICIENCY — trailing median per agent (estimate, not an invoice)", ""]
    if not res:
        L.append("  no metering records collected this window")
    for agent, a in res.items():
        if a["samples_below_minimum"]:
            L.append("  %-4s %2d run(s), %d failed — fewer than %d samples, no median yet"
                     % (agent, a["runs"], a["failed_runs"], MIN_SAMPLES))
            continue
        L.append("  %-4s %2d run(s), %d failed — median $%.4f, median %ds"
                 % (agent, a["runs"], a["failed_runs"], a["median_cost_usd"],
                    int(a["median_duration_s"] or 0)))
        for f in a["flags"]:
            L.append("       FLAG run %s attempt %s (%s): %s"
                     % (f["run_id"], f["attempt"], f["status"], "; ".join(f["causes"])))
    total = sum(len(a["flags"]) for a in res.values())
    L += ["", "  %d run(s) exceeded %.0fx their agent's median." % (total, FLAG_MULTIPLE)]
    if bad:
        L.append("  %d record(s) unreadable or not tops.metering.v1 and were skipped." % bad)
    return "\n".join(L) + "\n"


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    recs, bad = load(sys.argv[1])
    res = analyse(recs)
    with open(sys.argv[2], "w") as fh:
        fh.write(render(res, bad))
    if len(sys.argv) > 3:
        with open(sys.argv[3], "w") as fh:
            json.dump({"agents": res, "unreadable": bad}, fh, indent=2)
    sys.stdout.write(render(res, bad))
    return 0


if __name__ == "__main__":
    sys.exit(main())
