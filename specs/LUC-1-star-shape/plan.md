# Plan: Star shape tool — technical design

Implements [`spec.md`](./spec.md). Section numbers are referenced from the spec. Guardrails: `CLAUDE.md` / `AGENTS.md` (monorepo layout, `yarn test:typecheck`, focused vitest runs; `yarn test:update` is flaky on unrelated suites).

## 1. Approach

Treat `star` as a fourth **generic shape**, modelled on `diamond`. Diamond is the closest precedent: a non-rectangular polygon with custom geometry, bindable, fillable, a text container, and switchable via the shape-switch popover. Every place `"diamond"` is handled becomes a `"star"` case, except roundness (§5). No new abstractions; no plugin system.

## 2. Touchpoints (by package)

`packages/common`

- `src/constants.ts` — `TOOL_TYPE.star`.
- `src/keys.ts` — `KEYS.W` already exists; no change.

`packages/element`

- `src/types.ts` — `ExcalidrawStarElement`; add to `ExcalidrawGenericElement`, `ExcalidrawBindableElement`, `ExcalidrawTextContainer`, `ConvertibleGenericTypes`. Not added to `ExcalidrawFlowchartNodeElement`.
- `src/typeChecks.ts` — `isExcalidrawElement` switch, `isBindableElement`, `isTextBindableContainer`. Not `isUsingProportionalRadius` / `isUsingAdaptiveRadius` (§5).
- `src/comparisons.ts` — `hasBackground`, `hasStrokeColor`, `hasStrokeWidth`, `hasStrokeStyle`. Not `canChangeRoundness` (§5).
- `src/bounds.ts` — new `getStarPoints(element)` (§3); include in `getElementBounds` / outline-segment helpers next to the diamond branch.
- `src/shape.ts` — `generateRoughOptions` (fill group with rect/diamond/ellipse); `_generateElementShape` → `generator.polygon(getStarPoints(...))`; `getElementShape` → `getPolygonShape`.
- `src/utils.ts` — `deconstructStarElement` (10 line segments, cached like `deconstructDiamondElement`).
- `src/collision.ts`, `src/distance.ts` — polygon intersection / distance using the deconstructed segments.
- `src/binding.ts` — bindable outline = star polygon; elbow-arrow routing uses the bounding box (same fallback rectangles use). No new `SHAPE_CONFIGS` entry.
- `src/heading.ts` — bounding-box heading (rectangle behaviour), no diamond-style vertex heading.
- `src/textElement.ts` — `VALID_CONTAINER_TYPES`; container maths (§4).
- `src/renderElement.ts` — canvas + export branches alongside diamond.
- `src/transform.ts` — skeleton `case "star"` so `convertToExcalidrawElements` accepts stars.

`packages/utils`

- `src/shape.ts`, `src/withinBounds.ts` — star vertices for polygon helpers.

`packages/excalidraw`

- `types.ts` — `ToolType` union.
- `scene/types.ts` — `ElementShapes.star: Drawable`.
- `components/icons.tsx` — `StarIcon` (Tabler `star`, `strokeWidth 1.5`, `tablerIconProps`, `// tabler-icons: star`).
- `components/shapes.tsx` — insert after ellipse: `{ icon: StarIcon, value: "star", key: KEYS.W, numericKey: null, fillable: true, toolbar: true }`.
- `components/Actions.tsx` — tooltip composition must not print `null` when `numericKey` is null (`Star — W`, not `Star — W or null`).
- `components/MobileToolBar.tsx` — add to generic-shape popover.
- `components/HelpDialog.tsx` — shortcut row.
- `components/ConvertElementTypePopup.tsx` — `GENERIC_TYPES`, icon map.
- `components/App.tsx` — `getCurrentItemRoundness` returns `null` for star.
- `data/restore.ts` — `case "star"` (otherwise the element is dropped).
- `renderer/staticSvgScene.ts`, `renderer/interactiveScene.ts` — draw + binding highlight branches.
- `snapping.ts` — include star in shape-tool snap eligibility.
- `locales/en.json` — `toolBar.star`, `element.star`.

## 3. Geometry (R2)

Unit star: outer vertices at angles `−90° + 72°·k`, radius 1; inner vertices at `−54° + 72°·k`, radius `1/φ² ≈ 0.381966`. Order alternates outer/inner so the 10 points form a simple closed polygon.

Fitting to the element box: normalise the unit star's own bounds to `[0,1]` on each axis, then scale by `width` / `height`. Resulting points for `w × h` (top-left origin), rounded:

| #   | kind  | x       | y       |
| --- | ----- | ------- | ------- |
| 0   | outer | 0.500·w | 0       |
| 1   | inner | 0.618·w | 0.382·h |
| 2   | outer | 1.000·w | 0.382·h |
| 3   | inner | 0.691·w | 0.618·h |
| 4   | outer | 0.809·w | 1.000·h |
| 5   | inner | 0.500·w | 0.764·h |
| 6   | outer | 0.191·w | 1.000·h |
| 7   | inner | 0.309·w | 0.618·h |
| 8   | outer | 0       | 0.382·h |
| 9   | inner | 0.382·w | 0.382·h |

The `+1` nudge used by `getDiamondPoints` to avoid zero-size rough.js input is not needed because no two star vertices coincide for `w, h ≥ 1`.

The same table, the hit-testing cases for R4.1 and the bound-text box from §4 are drawn to scale on the Figma [Spec page](https://www.figma.com/design/T0ErM6Q3BIgmGCnPz6H6j7/Untitled?node-id=4-5); the Canvas page renders the polygon through rough.js with the diamond's options so reviewers can compare against the running app.

Data model: `ExcalidrawStarElement = _ExcalidrawElementBase & { type: "star" }`. No `points`/`spikes` field in this ticket; if configurable stars land later they can add optional fields with a `restore` default, keeping old files valid.

## 4. Bound text container (R4.4)

Largest axis-aligned rectangle inside the star sits between the two side arms' level and the two lower inner vertices; its edges land on golden-ratio fractions of the box:

- max text width = `w / φ²` ≈ `0.382·w` − 2·`BOUND_TEXT_PADDING`
- max text height = `h / φ³` ≈ `0.236·h` − 2·`BOUND_TEXT_PADDING`
- text-box top-left offset = `(0.309·w, 0.382·h)`; horizontally centred.

Container growth (`computeContainerDimensionForBoundText`): inverse of the above (`textWidth / 0.382 + padding`, `textHeight / 0.236 + padding`). Same pattern as the diamond's `/2` and `*2`.

## 5. Decisions

| # | Decision | Alternatives considered | Why |
| --- | --- | --- | --- |
| D1 | Shortcut `W`, no numeric key | `S` (intuitive but bound to _stroke colour_ popup and `Shift+S` eyedropper in `App.tsx` `onKeyDown`); renumbering `5–0` (breaks muscle memory and every published shortcut list); no shortcut (hurts keyboard users) | `W` is unused, sits on the same QWERTY row as `R`/`E`, and precedent exists for letter-only tools (`hand`, `laser`) |
| D2 | No roundness in v1 | Proportional radius like diamond | Rounded concave/convex vertices need a bespoke 10-corner path builder; not needed to ship the tool. Hiding **Edges** is one union omission. Follow-up ticket. |
| D3 | Inline toolbar button, not a "shapes" popover | Group rect/diamond/ellipse/star behind one button | Toolbar has room at ≥ 450 px (shrinks buttons below that today). Grouping changes muscle memory for three existing tools — separate design decision. Shown as Option B in Figma for the record. |
| D4 | Fixed regular pentagram | Configurable points / inner radius | Ticket scope. Model leaves room (§3). |
| D5 | Elbow arrows route around the bounding box | Full polygon-aware routing | Matches rectangle behaviour; polygon routing for concave shapes is a research task. |

## 6. Compatibility

- Files saved with stars open fine in this build and later.
- Older clients drop `star` elements on load (`restore.ts` returns `null` for unknown types). This is existing behaviour for any new type; called out in the changelog.
- `@excalidraw/excalidraw` public API: `ExcalidrawElementType` and `ToolType` gain a member — additive, non-breaking for consumers that use the unions; exhaustive `switch` statements in consumer code may need a case.

## 7. Test strategy

Unit (`yarn vitest <path> --run`)

- `packages/element/tests/bounds.test.ts` — `getStarPoints` table above.
- `packages/element/tests/collision.test.ts` — R4.1 concave-notch miss / arm hit.
- `packages/element/tests/textElement.test.ts` — container maths §4.
- `packages/excalidraw/tests/dragCreate.test.tsx` — R2.1–R2.3.
- `packages/excalidraw/tests/regressionTests.test.tsx` — `W` selects star; `S` still opens stroke popup.
- `packages/excalidraw/tests/data/restore.test.ts` — R5.1.
- `packages/excalidraw/tests/scene/export.test.ts` — R5.2 SVG snapshot.
- Shape-switch test — R4.5.

Manual (recorded in the VM, both themes): toolbar placement, tooltip text, hover/selected states, arrow binding on outline, label editing, PNG export.
