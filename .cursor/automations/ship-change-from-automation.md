# Excalidraw: In Progress (Agent) — ship change from automation

This automation implements a Linear ticket end-to-end. It is triggered by a **Webhook** from the `Create Linear Ticket` automation (see `.cursor/automations/create-linear-ticket.md`). The Linear-native triggers are not used here because issues created by bot/automation identities don't reliably fire them.

## Trigger

Webhook. Expected JSON body:

```json
{
  "linear_issue_id": "LUC-XX",
  "linear_issue_url": "https://linear.app/...",
  "linear_issue_title": "[bug] ...",
  "type": "Feature | Bugfix | Refactor/Infra",
  "risk": "Low | Medium | High",
  "branch": "demo-bug-fix-base"
}
```

## Instructions

A build request arrived via webhook. The trigger context is the JSON payload above.

1. **Sanity check the payload.**
   - If `linear_issue_id` is missing or empty, stop. Post a short failure note to Slack and exit.
   - If `branch` is missing, default to `demo-bug-fix-base`.

2. **Fetch the full Linear ticket.**
   Use the Linear MCP to load the issue identified by `linear_issue_id`. You need the full body — PRD / acceptance criteria / key files / task-specific notes / (for bugs) repro steps. The webhook payload only carries metadata; Linear is the source of truth for the spec.

3. **Check the status is actually "In Progress (Agent)".**
   Defense in depth — if someone manually moved the ticket back to a different state between ticket creation and this run, stop and do nothing. The webhook is meant to fire only for tickets the creation automation routed to "In Progress (Agent)".

4. **Invoke the `ship-change-from-automation` skill and follow it end-to-end.**
   The skill at `.cursor/skills/ship-change-from-automation/SKILL.md` owns the full procedure: understand → research → implement → demo with computer use → open PR with embedded artifacts → Slack summary → move Linear to In Review.

## What this automation does NOT do

- It does not re-specify the shipping process — the skill owns that.
- It does not decide risk, write a PRD, or triage — the upstream `Create Linear Ticket` automation did that already.
- It does not trigger other automations downstream.

## Known-good configuration

- **Triggers:** Webhook only. Remove any Linear triggers.
- **Environment:** Enabled (the skill runs tests, starts the dev server, and demos in the VM browser).
- **Secrets required:** none directly — the Linear MCP is configured at the workspace level and `gh`/`git` auth comes from the VM image.
- **Model:** as configured in the dashboard (Opus 4.6 High at time of writing).
