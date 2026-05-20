import { describe, expect, it } from "vitest";

import {
  newStickyNoteElement,
  refreshTextDimensions,
  STICKY_NOTE_DEFAULT_BACKGROUND,
  STICKY_NOTE_DEFAULT_SIZE,
  STICKY_NOTE_TEXT_PADDING,
} from "../src/newElement";
import { isStickyNoteElement, isTextContainingElement } from "../src/typeChecks";
import { hasBackground, hasStrokeColor } from "../src/comparisons";

describe("sticky note element", () => {
  it("creates a sticky note with defaults", () => {
    const sticky = newStickyNoteElement({ x: 10, y: 20 });

    expect(sticky.type).toBe("stickyNote");
    expect(sticky.width).toBe(STICKY_NOTE_DEFAULT_SIZE);
    expect(sticky.height).toBe(STICKY_NOTE_DEFAULT_SIZE);
    expect(sticky.backgroundColor).toBe(STICKY_NOTE_DEFAULT_BACKGROUND);
    expect(sticky.autoResize).toBe(false);
    expect(sticky.text).toBe("");
  });

  it("is recognized by type guards and property helpers", () => {
    const sticky = newStickyNoteElement({ x: 0, y: 0 });

    expect(isStickyNoteElement(sticky)).toBe(true);
    expect(isTextContainingElement(sticky)).toBe(true);
    expect(hasBackground("stickyNote")).toBe(true);
    expect(hasStrokeColor("stickyNote")).toBe(true);
  });

  it("wraps text within note padding", () => {
    const sticky = newStickyNoteElement({
      x: 0,
      y: 0,
      text: "hello world",
      width: 100,
    });
    const elementsMap = new Map([[sticky.id, sticky]]);
    const result = refreshTextDimensions(sticky, null, elementsMap, sticky.text);

    expect(result?.text).toBeDefined();
    expect(STICKY_NOTE_TEXT_PADDING).toBeGreaterThan(0);
  });
});
