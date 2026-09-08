# Spec: Star shape tool

|  |  |
| --- | --- |
| Ticket | [LUC-1 — Add a star shape to the shape toolbar](https://linear.app/anysphere/issue/LUC-1/add-a-star-shape-to-the-shape-toolbar) |
| PRD | [Notion](https://app.notion.com/p/cursorai/3d5da74ef045805e94bacf9ce400b48c) |
| Design | [Figma — Star shape](https://www.figma.com/design/T0ErM6Q3BIgmGCnPz6H6j7/Untitled) |
| Status | Draft → ready for `plan.md` review |
| Companion docs | [`plan.md`](./plan.md) (technical design) · [`tasks.md`](./tasks.md) (implementation checklist) |

This spec is the source of truth for the change. Implementation, tests and the PR description trace back to the requirement IDs below (`R1`, `R2`, …). Anything not listed under _In scope_ is out of scope for this ticket.

## 1. Problem

Excalidraw ships three fillable generic shapes — rectangle, diamond, ellipse. Users who want a star (ratings, highlights, "favourite" markers, flowchart decorations) draw one with the line tool or import an image. Both lose the hand-drawn styling, fill patterns, arrow binding and bound text that the built-in shapes get for free.

## 2. Goal

Add a **Star** tool to the shape toolbar that behaves like the existing generic shapes in every user-visible way: same creation gesture, same styling panel, same selection/resize/rotate, same export, same theming.

## 3. Users and scenarios

- **Whiteboarder** picks Star from the toolbar (or presses its shortcut), drags on the canvas and gets a five-point star that fills the drag rectangle.
- **Diagrammer** binds an arrow to a star and types a label inside it; the label stays centred as the star is resized or moved.
- **Existing-file user** opens an older `.excalidraw` file: nothing changes. Opens a _new_ file containing a star in an older client: the star is dropped (documented compatibility behaviour, see `plan.md` §6).

## 4. Requirements

Acceptance criteria use EARS phrasing (`WHEN … THE SYSTEM SHALL …`) so each one maps to a test.

### R1 — Toolbar entry

- R1.1 WHEN the toolbar renders THE SYSTEM SHALL show a **Star** button immediately after **Ellipse** and before **Arrow**, using the Tabler `star` outline icon at the toolbar's existing icon size and stroke weight.
- R1.2 WHEN the Star tool is active THE SYSTEM SHALL render the button in the selected state with the icon **filled** (same `fillable` treatment as rectangle/diamond/ellipse).
- R1.3 WHEN a user hovers the button THE SYSTEM SHALL show the tooltip `Star — W`. The keybinding badge in the button corner shows `W`.
- R1.4 WHEN a user presses `W` with no text editor focused THE SYSTEM SHALL activate the Star tool. There is no numeric shortcut (`0–9` are all taken; see `plan.md` §5 for the decision).
- R1.5 WHEN the mobile toolbar renders THE SYSTEM SHALL include Star in the generic-shape popover alongside rectangle, diamond and ellipse.
- R1.6 WHEN the Help dialog opens THE SYSTEM SHALL list `Star` with shortcut `W` next to the other shape tools.
- R1.7 The button SHALL have `aria-label="Star"` and the label SHALL be provided through i18n (`toolBar.star`, `element.star`), English only in this ticket.

### R2 — Creation

- R2.1 WHEN the user drags on the canvas with the Star tool THE SYSTEM SHALL create a `star` element whose five outer vertices touch all four sides of the drag rectangle (top vertex on the top edge, two vertices on the bottom edge, one each on the left and right edges).
- R2.2 WHEN the user clicks without dragging THE SYSTEM SHALL create a star of the default size used for other generic shapes.
- R2.3 WHEN Shift is held while dragging THE SYSTEM SHALL constrain the star to a square bounding box (existing generic-shape behaviour).
- R2.4 The star SHALL be a regular five-point star: inner-vertex radius equals outer radius × 1/φ² (≈ 0.382), top vertex pointing up, before being fitted to the bounding box. Non-square bounding boxes stretch the star non-uniformly, exactly as the ellipse and diamond stretch.

### R3 — Styling parity

- R3.1 WHEN a star is selected THE SYSTEM SHALL offer stroke colour, background colour, fill style (hachure / cross-hatch / solid), stroke width, stroke style (solid / dashed / dotted), sloppiness and opacity — the same controls as the diamond.
- R3.2 The **Edges** (roundness) control SHALL be hidden for stars in this ticket. Stars always render with sharp vertices (see `plan.md` §5).
- R3.3 WHEN rendered in dark theme THE SYSTEM SHALL apply the same colour inversion filter as other shapes.

### R4 — Interaction parity

- R4.1 WHEN the user clicks inside the star's filled region, or on its stroke, THE SYSTEM SHALL select the star. WHEN the user clicks inside the bounding box but in a concave notch between two arms THE SYSTEM SHALL NOT select the star (hit-testing follows the star outline, not the bounding box).
- R4.2 The star SHALL support move, resize (all eight handles), rotate, flip, duplicate, group, lock, align/distribute, z-order and undo/redo without special-casing.
- R4.3 WHEN an arrow is dragged onto a star THE SYSTEM SHALL bind it; the arrow endpoint SHALL sit on the star outline, not on the bounding box.
- R4.4 WHEN a user double-clicks a star, or presses Enter with it selected, THE SYSTEM SHALL open a bound-text editor centred in the star's inner region; text wraps within that region and the star grows to fit longer text.
- R4.5 WHEN a rectangle, diamond or ellipse is selected THE SYSTEM SHALL offer **Star** in the shape-switch popover (and vice-versa), preserving styling and bound text.

### R5 — Persistence and export

- R5.1 WHEN a scene containing a star is saved and reloaded (`.excalidraw`, local storage, clipboard, library) THE SYSTEM SHALL restore it with all properties intact.
- R5.2 WHEN exported to PNG, SVG or clipboard image THE SYSTEM SHALL render the star identically to the canvas (rough.js output, fills, dark-mode filter).

### R6 — Non-functional

- R6.1 No measurable regression in canvas render time for scenes without stars (star adds one `case` to hot switches only).
- R6.2 `yarn test:typecheck` passes; the element `type` union is extended, not widened to `string`.
- R6.3 No new dependency.

## 5. Out of scope (explicit)

- Configurable point count (6-, 8-point stars) or inner radius — geometry is fixed to the regular pentagram. The data model leaves room for this later (see `plan.md` §3).
- Rounded star vertices (roundness) — deferred, see `plan.md` §5.
- Star as a flowchart node (Alt+Arrow auto-layout creation).
- Translations other than English.
- Changes to Mermaid → Excalidraw conversion.

## 6. Success criteria

- All acceptance criteria above have a passing automated test or a recorded manual check, listed in `tasks.md`.
- A screen recording shows: pick Star → drag → style → bind arrow → add label → export PNG → reload, in both themes.

## 7. Open questions

None blocking. Decisions that were open during drafting are recorded with rationale in `plan.md` §5 so reviewers can challenge them in the PR.
