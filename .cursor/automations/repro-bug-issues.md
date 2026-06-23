# Excalidraw: Repro Bug Issues

This automation reproduces bug reports posted in `#demo-bug-automation`, posts evidence as
a live status card, and on a confirmed repro hands off to `ship-change-from-automation` to
fix the bug and open a PR. It is the middle of a three-part chain modeled on a real
internal automation (triage -> repro -> fix).

This is the dashboard-config companion to the skill at
`.cursor/skills/repro-bug-issues/SKILL.md`, which owns the full procedure.

## Trigger

- **Any Message** from **Anyone** in **#demo-bug-automation** (`C0BDFGEA81E`).
- React with **No Emoji** upon completion.

The skill's pre-gate drops non-reports (FYIs, questions, chatter) silently, so a broad
"any message" trigger is fine.

## Agent instructions (paste into the dashboard)

```
# Repro Bug Issues

You are the Repro Bug Issues automation. A new message in #demo-bug-automation
(`C0BDFGEA81E`) triggered this run.

Read `.cursor/skills/repro-bug-issues/SKILL.md` from this repo
(tunaSandwichCursor/excalidraw) in full, then follow it exactly to handle the report that
triggered this run. That skill is the single source of truth for this automation.

If the skill file is missing or unreadable, stop without posting anything.
```

## Known-good configuration

- **Repo checkout:** `tunaSandwichCursor/excalidraw` (NOT everysphere). The skill lives in
  this repo.
- **Branches (two-branch demo model):**
  - `demo-bug-automation-repro-bug` — the WORK branch. The agent checks it out, reproduces
    on it, commits the fix to it. Must contain this skill + the planted bug.
  - `demo-bug-automation-main` — the PR BASE. Must contain the same planted bug so the PR
    diff is exactly the fix.
  - Both branches are identical at run start (same base, same bug, same `.cursor/`). The
    skill opens the PR with `--head demo-bug-automation-repro-bug --base demo-bug-automation-main`.
  - Commit and push the `.cursor/` changes and the bug to BOTH branches before running, or
    the agent will not see them.
  - Re-run reset: `git checkout demo-bug-automation-repro-bug && git reset --hard demo-bug-automation-main && git push -f origin demo-bug-automation-repro-bug`.
- **Environment:** Enabled. The repro and the fix both drive the running app, so the VM and
  the dev server must be up. `.cursor/environment.json` starts it.
  - **Port is 3001.** `.env.development` sets `VITE_APP_PORT=3001`, which overrides vite's
    `|| 3000` default, so the dev server serves on `http://localhost:3001`. All skill,
    `demo.md`, hook, and `environment.json` references are aligned to 3001.
- **Tools:** keep it lean.
  - `Send to Slack` (to #demo-bug-automation) and `Read Public Slack Channels` — required.
  - `Slack` MCP — required for thread reads, `chat.getPermalink`, and (token path)
    `chat.update` / `conversations.history` verification.
  - `Linear` — only if you wire the upstream triage/ticket step. Optional for repro+PR.
  - Drop `Sentry`, `Datadog`, `Databricks SQL`, `Notion` unless a specific report needs
    them. (Datadog showed as "Failing" and is unused here.)
- **Secrets:**
  - `$DEMO_SLACK_BOT_TOKEN` (optional) — a Slack Web API bearer token for a bot in this
    workspace. If set, the skill posts a single editable status card. If absent, it falls
    back to `SendSlackMessage` and posts a short thread. Either works.
  - `gh` / `git` auth comes from the VM image (used by the fix phase).
- **Model:** as configured in the dashboard (a high-reasoning model; the original ran on an
  xhigh tier).

## What this automation does NOT do

- It does not run triage. Classifying the report and filing a Linear ticket is the upstream
  `create-linear-ticket.md` slot (described as a talking point; not required for repro+PR).
- It does not re-specify the fix process. `ship-change-from-automation` owns implement ->
  demo -> PR -> Slack summary.
- It does not verify existing fix PRs (no verify-mode). That was Glass-specific and is
  dropped here.

## Relationship to the other automations

| Chain step | Automation / skill | Status |
|---|---|---|
| Triage (classify + file ticket) | `create-linear-ticket.md` | stub / talking point |
| Repro (reproduce + evidence) | this automation + `repro-bug-issues` skill | the new piece |
| Fix (implement + PR) | `ship-change-from-automation` | already built |

For the demo this run does repro and fix in one pass, so the single status card advances
Reproducing -> Reproduced -> opened PR.
