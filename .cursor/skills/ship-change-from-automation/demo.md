# Demo procedure

This is the demo step for `ship-change-from-automation`. Cloud agents run in an Ubuntu VM with a full desktop; the VM's screen is recorded while you drive it via computer use, and that recording becomes the demo artifact attached to your PR.

## Preconditions (already true)

- The dev server was started by `.cursor/environment.json` and is listening on `http://localhost:3000`.
- `yarn test:typecheck` and your focused tests passed in Step 3.

If the dev server isn't running, check the tmux/terminal panes for a failure in `yarn start` before re-running it — don't kick off a duplicate process.

## Procedure

1. **Open the app.** Use computer use to open a browser inside your VM and navigate to `http://localhost:3000`. Wait for Excalidraw to fully load.
2. **Set up the scene.** If your change needs prior state (e.g. existing elements on the canvas, a selected tool), create it first. Do this deliberately so the recording has clear context.
3. **Demonstrate the change.** Pause ~1 second between actions so the recording is easy to follow.
   - **For a feature:** walk through the primary user flow as a real user would. Then demonstrate at least one edge case or alternate state if the issue description mentions one.
   - **For a bugfix:** first reproduce the old broken behavior's setup (the steps from the Linear issue), then show the corrected behavior. The contrast is the demo.
4. **Capture screenshots** of at least:
   - The initial state before the change takes effect.
   - The key moment that shows the change working.
   - Any important edge-case state.
5. **Sanity check.** Open the browser devtools console and confirm no new errors were introduced by your change. Capture a screenshot of the clean console.

## Acceptance criteria

A good demo:

- Shows the feature/fix from a user's perspective, not from the code.
- Is slow enough to follow (deliberate pauses between actions).
- Includes the before/after contrast for bugfixes.
- Produces both a video artifact (the recording) AND at least one screenshot.
- Has no unrelated console errors visible in the final state.

## Non-visual changes

If the issue is a refactor, performance change, or a change to a non-UI code path that genuinely has no user-visible surface:

- Still open the app and navigate to the area that exercises the changed code, to prove nothing regressed visibly.
- In the PR body, add a `## Demo` section that explicitly says *"No user-visible UI change — this is a [refactor / perf / infra] change. Verified by: X tests, Y benchmark."* Include test output or benchmark numbers as the "artifact."

Do NOT use "non-visual change" as an escape hatch for UI work. If the Linear issue touches a visible surface, the demo is mandatory.

## Common failure modes

- **Agent skips this step entirely.** Most common cause of missing artifacts. The `stop` hook will re-prompt you if you try to finish without one.
- **Dev server not running.** Check the terminal panes before navigating.
- **Demo too fast to follow.** Re-record with deliberate pauses.
- **Recording shows the wrong tab/window.** Make sure the Excalidraw tab is focused for the whole walkthrough.
