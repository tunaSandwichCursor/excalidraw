import { API } from "@excalidraw/excalidraw/tests/helpers/api";

import {
  isBindableElement,
  isExcalidrawElement,
  isRectanguloidElement,
  isRectangularElement,
  isTextBindableContainer,
  isUsingAdaptiveRadius,
} from "../src/typeChecks";
import {
  hasBackground,
  hasStrokeColor,
  hasStrokeWidth,
  hasStrokeStyle,
  canChangeRoundness,
} from "../src/comparisons";

describe("Sticky Note Element", () => {
  describe("type checks", () => {
    it("should be recognized as a valid Excalidraw element", () => {
      const element = API.createElement({ type: "stickyNote" });
      expect(isExcalidrawElement(element)).toBe(true);
    });

    it("should be bindable", () => {
      const element = API.createElement({ type: "stickyNote" });
      expect(isBindableElement(element)).toBe(true);
    });

    it("should be a rectanguloid element", () => {
      const element = API.createElement({ type: "stickyNote" });
      expect(isRectanguloidElement(element)).toBe(true);
    });

    it("should be a rectangular element", () => {
      const element = API.createElement({ type: "stickyNote" });
      expect(isRectangularElement(element)).toBe(true);
    });

    it("should be a text bindable container", () => {
      const element = API.createElement({ type: "stickyNote" });
      expect(isTextBindableContainer(element)).toBe(true);
    });

    it("should use adaptive radius", () => {
      expect(isUsingAdaptiveRadius("stickyNote")).toBe(true);
    });
  });

  describe("property comparisons", () => {
    it("should have background", () => {
      expect(hasBackground("stickyNote")).toBe(true);
    });

    it("should have stroke color", () => {
      expect(hasStrokeColor("stickyNote")).toBe(true);
    });

    it("should have stroke width", () => {
      expect(hasStrokeWidth("stickyNote")).toBe(true);
    });

    it("should have stroke style", () => {
      expect(hasStrokeStyle("stickyNote")).toBe(true);
    });

    it("should allow changing roundness", () => {
      expect(canChangeRoundness("stickyNote")).toBe(true);
    });
  });

  describe("element creation", () => {
    it("should create a sticky note element with correct type", () => {
      const element = API.createElement({ type: "stickyNote" });
      expect(element.type).toBe("stickyNote");
    });

    it("should support bound text elements", () => {
      const element = API.createElement({
        type: "stickyNote",
        boundElements: [{ type: "text", id: "text-id" }],
      });
      expect(element.boundElements).toEqual([
        { type: "text", id: "text-id" },
      ]);
    });
  });
});
