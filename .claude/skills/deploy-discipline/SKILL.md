---
name: deploy-discipline
description: Deployment and rollback procedure for Transition OPS. Governs the path from feature branch to production, including the service-worker cache bump. Owner - s3-devops.
---
# DEPLOY DISCIPLINE — SOP

Terrain: Netlify auto-publishes `main`. Therefore `main` IS production.
Treat every merge as a live deployment to serving veterans.

## FORWARD PATH
1. All work on a feature branch, named for the work (e.g. `s2-va-rates-update`).
2. Cache bump check. If the branch changes any precached asset, bump
   `CACHE_NAME` in `sw.js` NOW, before the gate. See STEP 2 DETAIL.
3. Run the validation-gate skill. Attach evidence.
4. Stage the branch locally; Dean merges and pushes. Agents stop at the local
   commit. Do not push, do not open the PR, do not ask for a one-time exception.
   See PROHIBITED — this is a bright line, not a judgment call.
5. Local validation: exercise the changed feature locally and confirm the
   service worker registers and OneSignal initializes. There is no Deploy
   Preview at this stage — the branch is unpushed. Do not claim preview
   evidence you cannot have.
6. Hand off to Dean: branch name, `git log --oneline`, `git diff --stat
   main..<branch>`, validation evidence, cache-bump line (old value -> new
   value, or "no precached asset changed"), one-line summary of blast radius,
   and the PREVIEW CALL (see STEP 6 DETAIL). DEAN MERGES AND PUSHES. Agents
   never merge to main and never push.

Step 2 comes BEFORE step 3 on purpose. The bump writes a file. Bumping after
the gate triggers validation-gate FAILURE RESPONSE (a fix writes files, rerun
the entire gate). Bump first, gate once.

## STEP 6 DETAIL - THE PREVIEW CALL

Agents never push, so no Netlify Deploy Preview exists at handoff. The handoff
package must therefore carry a recommendation, not a request: state whether the
diff warrants a pre-merge preview, and why.

- Default NO PREVIEW: doctrine and process ships - `.claude/**`,
  `skills-registry.md`, `intel/**`, `*.md`. Nothing a service member sees
  renders from them.
- Default PREVIEW WARRANTED: anything changing what a service member sees or how
  the app behaves - `index.html` content or logic, `manifest.json`, the icons,
  `va-math/`, `vendor/**`, or `sw.js` caching logic.

If Dean wants the preview, HE publishes the branch from GitHub Desktop and
validates it before merging. Agents still never push - the preview is his lever,
not a workaround. Make the call plainly, let Dean overrule it, and never omit it:
a handoff with no preview call is incomplete, and silence reads as "not needed."

## STEP 2 DETAIL - SERVICE WORKER CACHE BUMP

### Why
`sw.js` is not in its own ASSETS list. The browser detects a worker update by
byte-comparing `sw.js`. So the bump does two jobs:
- Changes `sw.js` bytes, which is what makes the browser reinstall at all and
  re-run `cache.addAll(ASSETS)` against the network.
- Renames the cache, so `activate` purges the old one (`sw.js:44` deletes every
  key that is not the current `CACHE_NAME` or `tops-intent`) instead of writing
  new entries into a cache that may hold stale ones.

Change index.html with no `sw.js` change and NEITHER job happens: no reinstall,
no purge, no re-precache.

### Exposure if you skip it - stated accurately
`sw.js` is NETWORK FIRST with a 3500 ms timeout (`sw.js:49-62`), and the fetch
handler re-caches every successful GET into the current cache (`sw.js:53-58`).
An online user with a healthy connection therefore self-heals on the next load
even with no bump. Do not claim otherwise.

The population that does NOT self-heal: users whose connection is dead or
slower than 3.5s. They lose the race, fall to `caches.match`, and are served
the shell precached at install time. For deployed and low-connectivity service
members this is a real population, and they hold the stale shell until they get
one clean fast load. That is the harm this step prevents. It is narrow and it
is real. Do not inflate it - an alarmist step gets skipped, and a skipped step
is worse than no step.

### Bump trigger - the ASSETS list
Bump if the branch changes ANY file backing an entry in `ASSETS`
(`sw.js:23-33`). Mapping from cache entry to repo file:

| ASSETS entry | Repo file |
|---|---|
| `/` | `index.html` |
| `/index.html` | `index.html` |
| `/manifest.json` | `manifest.json` |
| `/icon-192.png` | `icon-192.png` |
| `/icon-512.png` | `icon-512.png` |
| `/va-math/` | `va-math/index.html` |
| `/vendor/react.production.min.js` | `vendor/react.production.min.js` |
| `/vendor/react-dom.production.min.js` | `vendor/react-dom.production.min.js` |
| Google Fonts `css2?family=...` URL | remote - no repo file; changing the URL string is itself an `sw.js` change |

`/va-math/` and the two `vendor/` files are the ones agents forget. They are
triggers. So is `manifest.json`. So are the icons.

Also bump when you change caching logic in `sw.js` itself (fetch handler,
timeout, ASSETS list, install/activate). The old cache was built by the old
logic; do not inherit it.

NOT triggers - no bump, and do not invent one: `.md` files, `.claude/**` agent
prompts and skills, `skills-registry.md`, `netlify/functions/**`,
`OneSignalSDKWorker.js`, `README`, anything untracked by `ASSETS`. Note that
nearly every content ship touches `index.html`, so in practice the bump is the
normal case, not the exception. That is expected. It is still checked, never
assumed.

### Verify the trigger
Committed branch work, against main:

    git diff --name-only main...HEAD -- index.html manifest.json icon-192.png icon-512.png va-math/index.html vendor/react.production.min.js vendor/react-dom.production.min.js

Uncommitted working tree:

    git diff --name-only HEAD -- index.html manifest.json icon-192.png icon-512.png va-math/index.html vendor/react.production.min.js vendor/react-dom.production.min.js

Any output = bump REQUIRED. Empty output = bump not required; say so explicitly
in the handoff rather than staying silent.

Drift check, every run - the list above is a copy and copies rot:

    grep -n -A 12 "const ASSETS" sw.js

If `sw.js` has an entry this skill does not enumerate, STOP. Flag force-mod for
a patch. Do not improvise a mapping.

### Where and how to bump
One line, `sw.js:22`:

    const CACHE_NAME = 'transition-ops-v102';

Convention: `transition-ops-vNNN`, integer only, monotonic, never reused. Never
change the prefix, never add suffixes, never use dates or branch names.

The next number is derived from history, not from the current file value:

    git log -p main -- sw.js | grep -oE "transition-ops-v[0-9]+" | sed 's/.*-v//' | sort -n | tail -1

Next = that number + 1. Normally this equals current + 1. After a rollback it
does not (see ROLLBACK), and deriving from history is what makes both cases the
same procedure. Scope to `main` - unmerged branches are not shipped numbers.

If two branches are in flight and both bump to the same number, the second one
to reach handoff re-bumps. Resolve at PR time, not after merge.

### Prove the bump
    git diff main...HEAD -- sw.js | grep -E "^[-+].*CACHE_NAME"

Expect exactly one `-` line and one `+` line, and the `+` integer must be
GREATER than the `-` integer. Two `+` lines, a decrease, or no output when the
trigger check was non-empty = STOP, do not hand off.

## DO NOT TOUCH - APP_VERSION AND THE BUILD COMMENT

`index.html:2560` `const APP_VERSION = "v94";` is NOT the cache counter and is
NOT a deploy step. It is functionally load-bearing for a different system: it
gates the What's New badge, read at `index.html:4254`
(`window.__safeGet("tops_whatsnew_seen") !== APP_VERSION`) and written back at
`index.html:6439`. Bumping it re-shows the What's New panel to every user who
has already dismissed it. It is also coupled to `WHATS_NEW[0].v`
(`index.html:2563+`) - bump `APP_VERSION` without adding a matching entry and
users get a badge pointing at release notes they have already read.

The three counters are deliberately independent and MUST NOT be unified:

| Counter | Location | Trigger | Owner |
|---|---|---|---|
| `CACHE_NAME` | `sw.js:22` | any precached asset changed | s3-devops, every qualifying ship |
| `APP_VERSION` | `index.html:2560` | there is a What's New entry worth surfacing | Dean, editorial |
| `PWA BUILD v3.0` | `index.html:497` comment | nothing - cosmetic | nobody |

Unifying them looks tidy and would spam the What's New badge on every typo fix.
A future agent proposing to "reconcile the version numbers" is proposing a
user-facing regression. Refuse and cite this table.

Agents do not modify `APP_VERSION` or `WHATS_NEW` without COMMANDER approval.
`index.html:497` is a comment; leave it alone, and never treat it as evidence
of anything.

## SKILL SEAM - WHAT VALIDATION-GATE DOES NOT KNOW

validation-gate v1.1 proves the edit is structurally sound. It has no model of
cache semantics. Neither skill infers the other's result.

validation-gate OWNS:
- `sw.js` still parses (`node --check sw.js`, step 4 / 4I).
- No curly quotes or U+00A0 in the changed line (step 3).
- `sw.js` appearing in the diff was intended (step 5 untouched-region).
- Literal presence/absence of the strings you claim you wrote (steps 1-2).

deploy-discipline OWNS:
- Whether a bump was REQUIRED at all (trigger check vs the ASSETS list).
- Whether the integer moved FORWARD.
- Whether that integer was ever shipped before.
- The rollback re-bump.

A `GATE PASS` is not cache-bump clearance: a syntactically perfect `sw.js` with
a missing or backwards bump passes the gate cleanly. Cache-bump clearance is
not a `GATE PASS`. Handoff requires both, reported separately. The clean-tree
analog is `INTEGRITY PASS`, and it is not cache-bump clearance either - neither
gate verdict, in either mode, says anything about the cache number. If you find
yourself wanting the gate to check the bump, that is a force-mod patch request,
not an improvisation.

## ROLLBACK
Production defect detected → `git revert` the offending commit and hand Dean
the revert branch/PR immediately. Seconds, not minutes. Diagnosis happens
AFTER production is clean, never on the live app. This is established
doctrine; hold it even when the fix "looks easy."

### Cache handling on rollback - MANDATORY FORWARD BUMP
Revert first. Then bump forward. Never let a revert restore an old
`CACHE_NAME`.

A `git revert` of a commit that bumped v102 -> v103 restores the literal text
`transition-ops-v102`. That is wrong, for two reasons:

1. Name reuse destroys diagnosability. `transition-ops-v102` would then exist
   in the field holding two different content sets: the pre-defect shell (users
   who never took the bad commit) and the post-revert shell. The cache name no
   longer identifies what a user is holding.
2. The re-land collision, which is the one that actually hurts users. After the
   revert sits at v102, Dean fixes the defect and re-lands with current + 1 =
   v103 again. Every user who took the BAD commit already has a populated
   `transition-ops-v103` containing the DEFECTIVE shell. When they return, the
   browser byte-compares `sw.js`: the re-landed `sw.js` is byte-identical to
   the bad commit's `sw.js` (same CACHE_NAME line, nothing else changed). No
   update is detected. `install` never runs. `activate` never purges. They keep
   the defective cache indefinitely and only recover via a network-first load
   that beats the 3.5s timeout - which is exactly the population that could not
   do that in the first place.

Procedure:
1. `git revert <sha>`. Do not hand-edit files. Speed is the priority.
2. Second commit on the same revert branch: set `CACHE_NAME` to
   (highest ever shipped on main) + 1, using the history command in STEP 2
   DETAIL. With v103 as the highest shipped, the revert branch ships v104.
   Never v102. Never v103. Those integers are burned permanently.
3. Confirm the revert branch is "reverted-to content plus one new cache
   number" and nothing else:

       git diff <sha>~1 -- . ":(exclude)sw.js"

   must be empty, and

       git diff <sha>~1 -- sw.js

   must show only the `CACHE_NAME` line.
4. Hand Dean ONE PR containing both commits. The bump is one line and does not
   slow the rollback.
5. If the situation is hot enough that Dean merges the bare revert alone, the
   forward bump is a MANDATORY immediate follow-on PR, not cleanup. Log it as
   an open item until merged.

Same rule for a re-land after a revert: derive from history, never from the
current file. The reverted-to file value will be lower than what shipped.

Post-rollback confirmation runs validation-gate INTEGRITY MODE (clean tree).
INTEGRITY MODE does not check the cache number - verify the forward bump here,
in this skill, and report it separately.

## PROHIBITED
- Pushing to `origin` — any branch, any circumstance. Agents never push. Work is
  staged as local commits; Dean merges and pushes. "Branches but not main" is not
  the rule and never was: `main` auto-publishes, so a rule that depends on
  correctly classifying the target every time is one mistake from a deploy.
- Direct commits to main
- Force pushes anywhere
- Merging with a failed or skipped validation gate
- Debugging live production
- Shipping a changed precached asset without a `CACHE_NAME` bump
- Reusing or decreasing a `CACHE_NAME` integer, including via revert
- Touching `APP_VERSION`, `WHATS_NEW`, or the `PWA BUILD` comment without
  COMMANDER approval
- Unifying the three version counters
