# Tasks: Star shape tool

Ordered so every step leaves `yarn test:typecheck` green. Each task lists the requirement IDs from [`spec.md`](./spec.md) it satisfies. Tick as you go.

## Phase 0 — Types (compile-first)

- [ ] T0.1 Add `ExcalidrawStarElement`; extend `ExcalidrawGenericElement`, `ExcalidrawBindableElement`, `ExcalidrawTextContainer`, `ConvertibleGenericTypes` (`packages/element/src/types.ts`). → R6.2
- [ ] T0.2 Add `"star"` to `ToolType` (`packages/excalidraw/types.ts`) and `TOOL_TYPE` (`packages/common/src/constants.ts`). → R1
- [ ] T0.3 Add `star: Drawable` to `ElementShapes` (`packages/excalidraw/scene/types.ts`). → R5.2
- [ ] T0.4 Follow the compiler: `isExcalidrawElement`, `isBindableElement`, `isTextBindableContainer`, `comparisons.ts` helpers, `restore.ts`, `transform.ts`. Do **not** add to roundness helpers or `canChangeRoundness`. → R3.1, R3.2, R5.1

## Phase 1 — Geometry and rendering

- [ ] T1.1 `getStarPoints(element)` in `bounds.ts` per `plan.md` §3, with a table-driven unit test. → R2.1, R2.4
- [ ] T1.2 `_generateElementShape` + `generateRoughOptions` star branches (`shape.ts`); `getElementShape` → polygon. → R3.1, R3.3
- [ ] T1.3 `deconstructStarElement` in `utils.ts`; collision and distance branches; test concave-notch miss. → R4.1
- [ ] T1.4 Canvas, SVG and interactive-scene render branches. → R5.2
- [ ] T1.5 `packages/utils` polygon helpers. → R4.2

## Phase 2 — Toolbar and tool

- [ ] T2.1 `StarIcon` in `icons.tsx` (Tabler `star`, 1.5 stroke). → R1.1
- [ ] T2.2 `SHAPES` entry after ellipse (`key: KEYS.W`, `numericKey: null`, `fillable: true`). → R1.1, R1.2, R1.4
- [ ] T2.3 Fix tooltip composition for `numericKey === null` in `ShapesSwitcher` (`Star — W`). → R1.3
- [ ] T2.4 `en.json` `toolBar.star` / `element.star`; `HelpDialog` row. → R1.6, R1.7
- [ ] T2.5 Mobile toolbar popover entry. → R1.5
- [ ] T2.6 `getCurrentItemRoundness` returns `null` for star; verify Edges is hidden. → R3.2
- [ ] T2.7 `snapping.ts` eligibility. → R4.2

## Phase 3 — Binding, text, shape switch

- [ ] T3.1 `binding.ts`: outline binding on star polygon; elbow fallback to bounding box; `heading.ts` bounding-box heading. → R4.3
- [ ] T3.2 `textElement.ts` container maths per `plan.md` §4 with tests. → R4.4
- [ ] T3.3 `ConvertElementTypePopup` `GENERIC_TYPES` + icon; roundness reset when converting _to_ star. → R4.5

## Phase 4 — Verification and shipping

- [ ] T4.1 `yarn test:typecheck`. → R6.2
- [ ] T4.2 Focused vitest runs listed in `plan.md` §7; update snapshots only where the star is intentionally present.
- [ ] T4.3 Record the demo flow from `spec.md` §6 in the VM (light + dark), attach to the PR.
- [ ] T4.4 PR description: link this spec, list requirement IDs covered, note the compatibility caveat (`plan.md` §6). Move LUC-1 to _In Review_.

## Traceability

| Requirement           | Tasks                       |
| --------------------- | --------------------------- |
| R1 Toolbar            | T0.2, T2.1–T2.5             |
| R2 Creation           | T1.1, T1.2                  |
| R3 Styling            | T0.4, T1.2, T2.6            |
| R4 Interaction        | T1.3, T1.5, T2.7, T3.1–T3.3 |
| R5 Persistence/export | T0.3, T0.4, T1.4            |
| R6 Non-functional     | T0.1, T4.1                  |
