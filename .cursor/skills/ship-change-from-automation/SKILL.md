---
name: ship-change-from-automation
description: End-to-end procedure for shipping a change (feature or bugfix) assigned via a Linear "In Progress (Agent)" automation on the Excalidraw fork. Use when the cloud agent is triggered by a Linear issue moving to "In Progress (Agent)", or when the user asks you to implement and ship a Linear issue end-to-end. Covers understanding the issue, implementing the change, demoing it with a screen recording in the VM, opening a PR with artifacts, posting to Slack, and moving the issue to In Review.
---

# ship-change-from-automation

You are implementing a change (feature OR bugfix) for the Excalidraw fork. A Linear issue has been moved to **In Progress (Agent)** and you've been handed the trigger context.

## Gate: only run when invoked correctly

Check `status` in the trigger context. If the issue is NOT in **In Progress (Agent)**, stop immediately and do nothing. No side effects.

## Step 1 — Understand the task

Read the Linear issue title and description in the trigger context.

- If the issue describes a **bug**, identify: the broken behavior, steps to reproduce, and the expected behavior. You will need all three to demo the fix.
- If the issue describes a **feature**, identify: the user-facing surface it touches, the flows that should change, and any edge cases called out in the description.

If the intent is ambiguous, state your interpretation in one sentence before proceeding. Do not ask the user — this is an unattended automation.

## Step 2 — Explore the codebase

Search for the files, components, and tests most relevant to the issue. Recall any prior memories about this repo. Prefer reading existing patterns over inventing new ones. Excalidraw is a monorepo — changes usually touch `packages/excalidraw`, `packages/element`, or `packages/common`.

## Step 3 — Implement the change

Write clean code that matches the existing conventions in the files you're touching.

- **For bugfixes:** first write a failing test that reproduces the bug (or identify an existing test that should have caught it). Then fix the bug. Confirm the test passes.
- **For features:** add tests for the new behavior alongside the implementation.
- Run `yarn test:typecheck` — this MUST pass before shipping.
- Run the focused test files relevant to your change with `yarn vitest <paths> --run`. These MUST pass.
- `yarn test:update` is known to be broadly flaky on unrelated suites in this repo. Don't block on it; capture the relevant failures for the PR description if needed.

## Step 4 — Demo the change (REQUIRED — do not skip)

The dev server is already running at **http://localhost:3000** in your VM (launched by `.cursor/environment.json`). You MUST produce a visible demo of your change using computer use.

Follow **[demo.md](./demo.md)** — it contains the exact procedure, acceptance criteria, and what to do for non-visual changes.

The demo is a hard gate on opening the PR. A `stop` hook will re-prompt you if you push a PR without an artifact.

## Step 5 — Open the PR

Open a pull request using the template in **[pr.md](./pr.md)**. The PR description MUST embed the screen recording and at least one screenshot captured in Step 4.

## Step 6 — Post to Slack

Send a summary to Slack channel `D0AT4D7PS1K` using the template in **[slack.md](./slack.md)**.

## Step 7 — Move the Linear issue to "In Review"

Use the Linear MCP `save_issue` tool with the issue identifier from the trigger context. Set status to **In Review**. Verify the update succeeded in the response.

## Done criteria

You are done when ALL of the following are true:

- [ ] `yarn test:typecheck` passes.
- [ ] Focused tests for the change pass.
- [ ] A screen recording and screenshots exist as artifacts from the VM demo.
- [ ] A PR is open on GitHub with the recording embedded in the body.
- [ ] A Slack summary has been posted.
- [ ] The Linear issue is in **In Review**.

If any item is false, you are not done — go back and fix it.
