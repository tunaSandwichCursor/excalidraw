import { vi } from "vitest";

import { convertToExcalidrawElements } from "../src/transform";
import { isExcalidrawElement } from "../src/typeChecks";
import {
  isBindableElement,
  isRectanguloidElement,
  isRectangularElement,
  isTextBindableContainer,
  isUsingAdaptiveRadius,
} from "../src/typeChecks";
import { hasBackground, hasStrokeColor, hasStrokeWidth, hasStrokeStyle } from "../src/comparisons";
import { newElement } from "../src/newElement";

import type { ExcalidrawElementSkeleton } from "../src/transform";

describe("Sticky Note Element", () => {
  describe("type checks", () => {
    const stickyNote = newElement({
      type: "stickyNote",
      x: 0,
      y: 0,
      strokeColor: "transparent",
      backgroundColor: "#FDEFA3",
      fillStyle: "solid",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
      roundness: { type: 3 },
      locked: false,
    });

    it("should be recognized as a valid excalidraw element", () => {
      expect(isExcalidrawElement(stickyNote)).toBe(true);
    });

    it("should be bindable", () => {
      expect(isBindableElement(stickyNote)).toBe(true);
    });

    it("should be rectanguloid", () => {
      expect(isRectanguloidElement(stickyNote)).toBe(true);
    });

    it("should be rectangular", () => {
      expect(isRectangularElement(stickyNote)).toBe(true);
    });

    it("should be a text bindable container", () => {
      expect(isTextBindableContainer(stickyNote)).toBe(true);
    });

    it("should use adaptive radius", () => {
      expect(isUsingAdaptiveRadius("stickyNote")).toBe(true);
    });
  });

  describe("comparisons", () => {
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
  });

  describe("transform", () => {
    it("should create a sticky note element via convertToExcalidrawElements", () => {
      const elements = [
        {
          type: "stickyNote",
          x: 100,
          y: 100,
          id: "sticky-1",
        },
      ];

      const data = convertToExcalidrawElements(
        elements as ExcalidrawElementSkeleton[],
        { regenerateIds: false },
      );

      expect(data.length).toBe(1);
      expect(data[0].type).toBe("stickyNote");
      expect(data[0].id).toBe("sticky-1");
      expect(data[0].x).toBe(100);
      expect(data[0].y).toBe(100);
    });

    it("should create a sticky note with custom dimensions", () => {
      const elements = [
        {
          type: "stickyNote",
          x: 50,
          y: 50,
          width: 300,
          height: 300,
          id: "sticky-2",
        },
      ];

      const data = convertToExcalidrawElements(
        elements as ExcalidrawElementSkeleton[],
        { regenerateIds: false },
      );

      expect(data.length).toBe(1);
      expect(data[0].type).toBe("stickyNote");
      expect(data[0].width).toBe(300);
      expect(data[0].height).toBe(300);
    });
  });
});
