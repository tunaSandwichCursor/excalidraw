#!/usr/bin/env bash
# require-demo-artifact.sh
#
# Stop hook for the Excalidraw fork.
#
# Policy: if the agent opened a PR on the current branch, the PR body MUST
# contain evidence of a demo artifact (embedded image, video, or an explicit
# "No user-visible UI change" note). Otherwise, this hook re-prompts the agent
# to produce one using computer use before finishing.
#
# Called by Cursor on the `stop` event with JSON on stdin:
#   { "status": "completed" | "aborted" | "error", "loop_count": 0 }
#
# Responds with JSON on stdout:
#   {}                              -> let the agent finish cleanly
#   { "followup_message": "..." }   -> re-prompt the agent
#
# Safe by construction: if anything unexpected happens (no gh CLI, no PR,
# network blip), we exit cleanly — we never block a finished run we can't
# evaluate. This hook is a nudge, not a lock.

set -uo pipefail

emit() {
  # Emit a JSON response and exit 0. Stop hooks communicate via stdout.
  printf '%s\n' "$1"
  exit 0
}

emit_clean() {
  emit '{}'
}

emit_followup() {
  # Serialize the followup message as a JSON string safely.
  local msg="$1"
  if command -v jq >/dev/null 2>&1; then
    printf '{"followup_message": %s}\n' "$(jq -Rn --arg m "$msg" '$m')"
  else
    # Minimal JSON escaping fallback if jq isn't installed.
    local escaped
    escaped=$(printf '%s' "$msg" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))' 2>/dev/null || true)
    if [ -z "$escaped" ]; then
      # Last-resort: give up and let the run finish rather than crash.
      emit_clean
    fi
    printf '{"followup_message": %s}\n' "$escaped"
  fi
  exit 0
}

# --- Parse stop-hook input ---------------------------------------------------

STDIN_JSON=$(cat || true)

# Only enforce when the agent finished normally. Don't pile on after an abort
# or a hard error — the user will have enough noise to sort through already.
STATUS=$(printf '%s' "$STDIN_JSON" | python3 -c 'import json,sys
try:
    print(json.loads(sys.stdin.read() or "{}").get("status",""))
except Exception:
    print("")' 2>/dev/null || echo "")

if [ "$STATUS" != "completed" ]; then
  emit_clean
fi

# --- Require tooling ---------------------------------------------------------

if ! command -v gh >/dev/null 2>&1; then
  # No GitHub CLI in this environment — nothing to check. Exit clean.
  emit_clean
fi

if ! command -v git >/dev/null 2>&1; then
  emit_clean
fi

# --- Find the PR for the current branch --------------------------------------

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)
if [ -z "$BRANCH" ] || [ "$BRANCH" = "HEAD" ]; then
  emit_clean
fi

# `gh pr view` with an explicit branch. If there's no PR on this branch at all,
# the agent didn't ship anything shippable — nothing to enforce.
PR_JSON=$(gh pr view "$BRANCH" --json body,url,number,state 2>/dev/null || true)
if [ -z "$PR_JSON" ]; then
  emit_clean
fi

PR_STATE=$(printf '%s' "$PR_JSON" | python3 -c 'import json,sys
try:
    print(json.loads(sys.stdin.read()).get("state",""))
except Exception:
    print("")')
PR_URL=$(printf '%s' "$PR_JSON" | python3 -c 'import json,sys
try:
    print(json.loads(sys.stdin.read()).get("url",""))
except Exception:
    print("")')
PR_BODY=$(printf '%s' "$PR_JSON" | python3 -c 'import json,sys
try:
    print(json.loads(sys.stdin.read()).get("body","") or "")
except Exception:
    print("")')

# Don't hassle closed/merged PRs — the review already happened.
if [ "$PR_STATE" != "OPEN" ]; then
  emit_clean
fi

# --- Detect demo-artifact evidence in the PR body ----------------------------
#
# "Evidence" = any ONE of:
#   - Embedded markdown image:     ![alt](...)
#   - Embedded HTML image/video:   <img ...> or <video ...>
#   - Cursor artifact URL pattern: cloud-agent-artifacts / cursor-agent-artifacts
#   - Direct video file link:      .mp4, .webm, .mov, .gif
#   - Explicit opt-out phrase:     "No user-visible UI change"

has_evidence=0

check() {
  if printf '%s' "$PR_BODY" | grep -Eiq "$1"; then
    has_evidence=1
  fi
}

check '!\[[^]]*\]\([^)]+\)'
check '<img[[:space:]]'
check '<video[[:space:]]'
check '(cloud-agent-artifacts|cursor-agent-artifacts)'
check '\.(mp4|webm|mov|gif)([?)"]|$)'
check 'No user-visible UI change'

if [ "$has_evidence" = "1" ]; then
  emit_clean
fi

# --- No evidence: ask the agent to go capture the demo -----------------------

read -r -d '' MSG <<EOF || true
Your PR $PR_URL does not contain a demo artifact.

The ship-change-from-automation skill requires a screen recording and
screenshots before a PR is considered complete. Go do this now:

1. Confirm the dev server is running at http://localhost:3000 in your VM.
   (It's started by .cursor/environment.json. Check the terminal panes
   before restarting it.)
2. Open http://localhost:3000 in the browser inside your VM using computer
   use. Do NOT use a headless browser tool — the demo must be captured by
   the VM's screen recorder.
3. Walk through the change you made as a real user would. Pause ~1 second
   between actions so the recording is easy to follow. For bugfixes, show
   the before/after contrast.
4. Capture a screen recording of the walkthrough and at least one
   screenshot of the key state.
5. Edit the PR body at $PR_URL to embed the recording and screenshot using
   GitHub image markdown. Follow the template in
   .cursor/skills/ship-change-from-automation/pr.md.

If this change genuinely has no user-visible UI surface (e.g. a pure refactor
or infra change), add a "## Demo" section to the PR body with the exact
phrase "No user-visible UI change" and explain how you verified the change.

This is a blocking requirement. Do not stop again until the PR body contains
an embedded image or video, or the "No user-visible UI change" opt-out.
EOF

emit_followup "$MSG"
