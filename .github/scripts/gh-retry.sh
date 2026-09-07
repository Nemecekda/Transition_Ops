# shellcheck shell=bash
# Sourced at the top of any run: block that calls gh. Defines a `gh` shell
# function that wraps the real binary (reached via `command gh`) with bounded
# retries, so every workflow gains retry coverage from one line per block
# instead of ~60 individual edits.
#
# THE DUPLICATE PROBLEM, AND WHY IT IS HANDLED RATHER THAN AVOIDED.
# `gh issue create` is not idempotent. A retry after a response that was lost in
# transit — but whose request succeeded — files the issue twice. Simply not
# retrying creates is the wrong answer: a missing FLASH is invisible, and
# invisible is the failure mode this whole fleet exists to prevent. So creates
# ARE retried, but before each retry the title is looked up; if it is already
# there, the first attempt did land and the retry reports success instead of
# filing again.
GH_RETRY_ATTEMPTS="${GH_RETRY_ATTEMPTS:-3}"

__gh_title_exists() {
  # $1 = exact title. Read-only, and its own failure is not fatal: if the lookup
  # cannot run we fall through and retry the create, because a duplicate beats a
  # dropped alert.
  local t="$1" found
  found=$(command gh issue list --state all --limit 100 --search "$t" \
            --json title --jq '.[].title' 2>/dev/null) || return 1
  printf '%s\n' "$found" | grep -Fxq "$t"
}

__gh_extract_title() {
  # Pull the --title value out of an argument list.
  while [ $# -gt 0 ]; do
    case "$1" in
      --title) printf '%s' "${2:-}"; return 0 ;;
      --title=*) printf '%s' "${1#--title=}"; return 0 ;;
    esac
    shift
  done
  return 1
}

gh() {
  local n=0 rc=0 is_create=0 title=""
  if [ "${1:-}" = "issue" ] && [ "${2:-}" = "create" ]; then
    is_create=1
    title=$(__gh_extract_title "$@") || title=""
  fi
  while :; do
    n=$((n + 1))
    # The else branch is load-bearing: `rc=$?` placed AFTER a bare `if` reads
    # the exit status of the if-construct, which is 0 whenever the condition
    # fails and there is no else. That silently turned every give-up into a
    # success. Capture inside the else, where $? is still the condition's.
    if command gh "$@"; then
      return 0
    else
      rc=$?
    fi
    if [ "$n" -ge "$GH_RETRY_ATTEMPTS" ]; then
      echo "::warning::gh failed after $n attempt(s) (exit $rc): gh $*" >&2
      return "$rc"
    fi
    # Idempotency guard: if the create actually landed, stop.
    if [ "$is_create" = "1" ] && [ -n "$title" ] && __gh_title_exists "$title"; then
      echo "gh issue create appears to have succeeded despite exit $rc; not filing again" >&2
      return 0
    fi
    sleep $((n * 2))
    echo "retrying gh (attempt $((n + 1)) of $GH_RETRY_ATTEMPTS) after exit $rc" >&2
  done
}
