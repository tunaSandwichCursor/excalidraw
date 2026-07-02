# This is the grind loop. Runs typecheck only (fast).
# If it fails, it sends the error output back to the agent
# with a followup_message and the agent keeps working.
# If it passes, it returns empty JSON and the agent is done.

#!/bin/bash
# grind.sh — The agent doesn't get to say it's done. Your CI standards do.
# Runs checks after the agent finishes. If anything fails, sends it back.

set -euo pipefail

MAX_ITERATIONS=5

# Log to a file next to this script so we can confirm the hook is firing.
# We never log to stdout: stdout is reserved for the JSON the hook returns.
LOG_FILE="$(dirname "$0")/grind.log"
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >>"$LOG_FILE"
}

INPUT=$(cat)
STATUS=$(echo "$INPUT" | jq -r '.status // "unknown"')
LOOP_COUNT=$(echo "$INPUT" | jq -r '.loop_count // 0')

log "fired: status=$STATUS loop_count=$LOOP_COUNT"

# Only check on normal completion
if [ "$STATUS" != "completed" ] || [ "$LOOP_COUNT" -ge "$MAX_ITERATIONS" ]; then
  log "skipping checks (status!=completed or max iterations reached)"
  echo '{}'
  exit 0
fi

# ── Run your checks (adjust these to match your project) ─────
log "running typecheck"
ERRORS=$(yarn test:typecheck 2>&1) || {
  log "typecheck FAILED, sending followup"
  TRIMMED=$(echo "$ERRORS" | head -40)
  FOLLOWUP="[Grind · Pass $((LOOP_COUNT + 1))/$MAX_ITERATIONS] Typecheck failed. Fix these errors:\n\n$TRIMMED"
  echo "{\"followup_message\": $(echo "$FOLLOWUP" | jq -Rs .)}"
  exit 0
}

# Typecheck passed — agent is done
log "typecheck passed, agent done"
echo '{}'