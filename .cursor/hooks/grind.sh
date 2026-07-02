#!/usr/bin/env bash
# grind.sh — The agent doesn't get to say it's done. Your CI standards do.
# Runs typecheck after the agent finishes. If it fails, sends a followup.
# If tooling isn't available, exits cleanly (never blocks on env setup).

set -euo pipefail

MAX_ITERATIONS=5

# Never log to stdout: stdout is reserved for the JSON the hook returns.
LOG_FILE="$(cd "$(dirname "$0")" && pwd)/grind.log"
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >>"$LOG_FILE"
}

# Hooks run with a minimal PATH. Rebuild one that can resolve yarn/node/tsc.
bootstrap_path() {
  local login_path=""
  local shell="${SHELL:-/bin/zsh}"
  if [ -x "$shell" ]; then
    login_path="$("$shell" -lic 'printenv PATH' 2>/dev/null || true)"
  fi

  # Start from login PATH only if present; always prepend known tool locations
  # so a stripper host PATH cannot hide them.
  if [ -n "$login_path" ]; then
    export PATH="$login_path"
  fi

  export PATH="\
$HOME/.local/node/bin:\
$HOME/.local/bin:\
$HOME/.yarn/bin:\
$HOME/.volta/bin:\
$HOME/.asdf/shims:\
$HOME/.local/share/mise/shims:\
$HOME/.mise/shims:\
/opt/homebrew/bin:\
/usr/local/bin:\
$PATH"

  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # shellcheck disable=SC1091
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # nvm prints to stdout; keep it off the hook's stdout channel.
    . "$NVM_DIR/nvm.sh" >/dev/null 2>&1 || true
  elif [ -d "$NVM_DIR/versions/node" ]; then
    # Fallback when nvm.sh isn't sourced: use the latest installed node.
    local latest
    latest="$(ls -1d "$NVM_DIR/versions/node"/v* 2>/dev/null | sort -V | tail -1 || true)"
    if [ -n "$latest" ]; then
      export PATH="$latest/bin:$PATH"
    fi
  fi

  if command -v fnm >/dev/null 2>&1; then
    eval "$(fnm env)" >/dev/null 2>&1 || true
  fi

  if command -v mise >/dev/null 2>&1; then
    eval "$(mise activate bash)" >/dev/null 2>&1 || true
  fi
}

repo_root() {
  # .cursor/hooks/grind.sh -> repo root is ../..
  cd "$(dirname "$0")/../.." && pwd
}

run_typecheck() {
  local root="$1"
  cd "$root"

  # Prefer the repo-local TypeScript binary — needs node on PATH.
  if [ -x "$root/node_modules/.bin/tsc" ] && command -v node >/dev/null 2>&1; then
    log "using node=$(command -v node) tsc=$root/node_modules/.bin/tsc"
    "$root/node_modules/.bin/tsc"
    return
  fi

  if command -v yarn >/dev/null 2>&1; then
    log "using yarn=$(command -v yarn) node=$(command -v node || echo none)"
    yarn test:typecheck
    return
  fi

  if command -v npx >/dev/null 2>&1; then
    log "using npx=$(command -v npx)"
    npx --no-install tsc
    return
  fi

  log "no typecheck runner found (node=$(command -v node || echo none) yarn=$(command -v yarn || echo none))"
  return 127
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

bootstrap_path
ROOT="$(repo_root)"
log "repo_root=$ROOT"
log "path=$PATH"
log "resolved node=$(command -v node || echo none) yarn=$(command -v yarn || echo none)"

log "running typecheck"
set +e
ERRORS=$(run_typecheck "$ROOT" 2>&1)
RC=$?
set -e

if [ "$RC" -eq 127 ]; then
  # Tooling isn't installed in this environment — don't loop the agent forever.
  log "typecheck tooling not found (yarn/tsc), skipping"
  echo '{}'
  exit 0
fi

if [ "$RC" -ne 0 ]; then
  log "typecheck FAILED (rc=$RC), sending followup"
  TRIMMED=$(printf '%s\n' "$ERRORS" | head -40)
  FOLLOWUP="[Grind · Pass $((LOOP_COUNT + 1))/$MAX_ITERATIONS] Typecheck failed. Fix these errors:

$TRIMMED"
  echo "{\"followup_message\": $(printf '%s' "$FOLLOWUP" | jq -Rs .)}"
  exit 0
fi

log "typecheck passed, agent done"
echo '{}'
