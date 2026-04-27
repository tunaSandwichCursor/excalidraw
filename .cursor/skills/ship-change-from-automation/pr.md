# PR template

Use this structure for the pull request opened in Step 5.

## Title

Exactly the Linear issue title (e.g. `LUC-6: Implement first-class sticky note tool with single-click capture`). This makes the Linear ↔ GitHub link obvious in both directions.

## Body

Fill in the template below. Every section is required unless marked optional.

```markdown
## Summary

<One paragraph. What changed, from a user's perspective. Not a code diff summary.>

## Linear issue

<LUC-XXX>: <issue title> — <link to Linear issue>

## Type

- [ ] Feature
- [ ] Bugfix
- [ ] Refactor / infra (non-user-visible)

## Demo

<Embed the screen recording captured in Step 4. Use GitHub's image markdown; the artifact URL comes from the Cloud Agent run. For non-visual changes, write an explicit "No user-visible UI change" note here and explain how you verified.>

![demo](<recording URL>)

### Screenshots

<At least one screenshot from Step 4. Before/after for bugfixes.>

![state-1](<screenshot URL>)

## What changed

<Short bulleted list of the concrete code changes. One bullet per meaningful file or subsystem. Don't paste the diff.>

- …
- …

## Why

<Why this approach? Call out any trade-offs or alternatives considered. Keep it honest — if you picked the quick path, say so.>

## Testing

- `yarn test:typecheck` — <pass/fail>
- Focused tests: `yarn vitest <paths> --run` — <pass/fail, list file paths>
- Manual verification: see Demo above.

<If `yarn test:update` failed on unrelated pre-existing flaky suites, note it here explicitly so reviewers don't think this PR broke them.>

## Risk

<One or two sentences. What could this break? What did you verify to mitigate?>
```

## Rules for the PR body

- **Demo section must contain an embedded image or video**, not just a text description. The `stop` hook will detect embedded media and gate on it.
- **Do not** paste giant diffs or file trees.
- **Do not** pad with filler. Reviewers are scanning — every section should be load-bearing.
- Reference the Linear issue identifier (`LUC-XXX`) in the body so GitHub ↔ Linear sync picks it up.
