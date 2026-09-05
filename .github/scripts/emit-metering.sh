# shellcheck shell=bash
# Sourced by an `if: always()` step so EVERY run emits exactly one metering
# record — success, failure, cancelled, and the quiet runs that used to emit
# nothing at all. J5 previously inferred cost by counting findings issues, which
# meant a run that filed no issue was also a run with no cost record.
#
# emit_metering <agent> <model_steps_ran> <model> <status>
#   agent            j1|j2|j3|j4|j5|pao
#   model_steps_ran  integer; 0 for a quiet run or a model-free job
#   model            model id, or "none"
#   status           the job status string from the workflow
#
# Labeled and non-ambiguous by construction: one record per run id, and the run
# id is the primary key. A second record for the same run overwrites rather than
# double-counts.
emit_metering() {
  local agent="$1" steps="$2" model="$3" status="$4"
  mkdir -p out
  cat > out/metering.json <<JSON
{
  "schema": "tops.metering.v1",
  "agent": "${agent}",
  "run_id": "${GITHUB_RUN_ID:-unknown}",
  "run_attempt": "${GITHUB_RUN_ATTEMPT:-1}",
  "workflow": "${GITHUB_WORKFLOW:-unknown}",
  "event": "${GITHUB_EVENT_NAME:-unknown}",
  "started": "${METER_STARTED:-unknown}",
  "ended": "$(date -u +%FT%TZ)",
  "status": "${status}",
  "model": "${model}",
  "model_steps_ran": ${steps},
  "dry_run": "${DRY_RUN:-0}"
}
JSON
  # One greppable line in the log too, so a record survives even if the artifact
  # upload is the thing that failed.
  echo "METER agent=${agent} run=${GITHUB_RUN_ID:-unknown} attempt=${GITHUB_RUN_ATTEMPT:-1} status=${status} model=${model} model_steps=${steps} dry_run=${DRY_RUN:-0}"
}
