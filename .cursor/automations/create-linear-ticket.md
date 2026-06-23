# Excalidraw: Create Linear Ticket (triage) — STUB

Intentional stub. This is the **triage** step of the demo chain (triage -> repro -> fix).
It is described as a talking point, not run live.

When built, this automation would:

1. Trigger on a bug report in `#demo-bug-automation` (`C0BDFGEA81E`).
2. Classify it (Bug / Feature / Question) and decide risk.
3. File a Linear ticket in the Excalidraw project (`LUC-`) with repro steps / acceptance
   criteria.
4. Hand off downstream (post a verdict, or fire the repro/ship automations).

For the demo, triage is narrated and the `repro-bug-issues` automation treats the trigger
message itself as the report. See `.cursor/automations/repro-bug-issues.md` and
`.cursor/skills/repro-bug-issues/SKILL.md`.
