import { STICKY_NOTE_DEFAULT_BACKGROUND } from "@excalidraw/common";
import {
  isStickyNoteElement,
  newStickyNoteElement,
  refreshStickyNoteText,
} from "@excalidraw/element";

import { SHAPES } from "../components/shapes";
import { Excalidraw } from "../index";
import { API } from "./helpers/api";
import { render, unmountComponent } from "./test-utils";

unmountComponent();

describe("sticky note", () => {
  beforeEach(async () => {
    await render(<Excalidraw handleKeyboardGlobally={true} />);
    API.setElements([]);
  });

  it("registers the sticky note tool in the shape toolbar", () => {
    expect(SHAPES.some((shape) => shape.value === "stickyNote")).toBe(true);
  });

  it("creates a sticky note element with default styling", () => {
    const element = API.createElement({
      type: "stickyNote",
      x: 100,
      y: 100,
    });

    expect(isStickyNoteElement(element)).toBe(true);
    expect(element.backgroundColor).toBe(STICKY_NOTE_DEFAULT_BACKGROUND);
    expect(element.width).toBeGreaterThan(0);
    expect(element.height).toBeGreaterThan(0);
    expect(element.text).toBe("");
  });

  it("wraps text within sticky note bounds", () => {
    const element = newStickyNoteElement({
      x: 0,
      y: 0,
      text: "one two three four five six seven eight",
    });

    expect(element.text).toContain("\n");
    expect(element.width).toBeGreaterThan(0);
  });

  it("updates wrapped text when original text changes", () => {
    const element = newStickyNoteElement({
      x: 0,
      y: 0,
      text: "short",
    });

    const updated = refreshStickyNoteText(element, "a longer line of sticky note text");
    expect(updated.text).toContain("\n");
    expect(updated.originalText).toBe(
      "a longer line of sticky note text",
    );
  });

});
