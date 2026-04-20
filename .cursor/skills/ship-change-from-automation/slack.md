# Slack message template

Use this for the Step 6 Slack post. Channel: `D0AT4D7PS1K`.

## Template

```
[LUC-XXX] <issue title>

<One-sentence summary of what changed, user-facing.>

• Type: <Feature | Bugfix | Refactor>
• PR: <github.com/...>
• Linear: <linear.app/...>
• Status: In Review

<Optional: one sentence on anything a reviewer should pay special attention to — risky area, known flake, follow-up task.>
```

## Rules

- Keep it short — 5–8 lines max. Slack is not the PR description; it's the ping.
- Always include the Linear identifier as the leading `[LUC-XXX]` so the channel can scan.
- The PR link must resolve (don't post before the PR exists).
- Don't @-mention anyone unless the Linear issue explicitly asked for a specific reviewer.

## What NOT to include

- Code snippets, diffs, or file lists.
- The screen recording (it lives in the PR).
- A long "why" — that's in the PR body. Slack is a pointer.
