import { pointFrom } from "@excalidraw/math";

import {
  convertToExcalidrawElements,
  type ExcalidrawElementSkeleton,
} from "../transform";

import { getStarPoints } from "../bounds";
import { distanceToElement } from "../distance";
import { getElementShape } from "../shape";
import { isExcalidrawElement, isBindableElement } from "../typeChecks";
import {
  hasBackground,
  hasStrokeColor,
  hasStrokeWidth,
  hasStrokeStyle,
} from "../comparisons";
import { newElement } from "../newElement";

import type { ElementsMap, ExcalidrawStarElement } from "../types";

const opts = { regenerateIds: false };

describe("Star shape", () => {
  describe("getStarPoints", () => {
    it("should return 10 points for a 5-pointed star", () => {
      const element = {
        width: 100,
        height: 100,
      } as any;

      const points = getStarPoints(element);
      expect(points).toHaveLength(10);
    });

    it("should have the top point at center-x, near y=0", () => {
      const element = {
        width: 100,
        height: 100,
      } as any;

      const points = getStarPoints(element);
      // First outer point should be at top (center x, y near 0)
      expect(points[0][0]).toBeCloseTo(50, 0);
      expect(points[0][1]).toBeCloseTo(0, 0);
    });

    it("should scale with element dimensions", () => {
      const small = { width: 50, height: 50 } as any;
      const large = { width: 200, height: 200 } as any;

      const smallPts = getStarPoints(small);
      const largePts = getStarPoints(large);

      // The large star should have points spread wider
      const smallMaxX = Math.max(...smallPts.map((p) => p[0]));
      const largeMaxX = Math.max(...largePts.map((p) => p[0]));
      expect(largeMaxX).toBeGreaterThan(smallMaxX);
    });

    it("should support non-square aspect ratios", () => {
      const element = {
        width: 200,
        height: 100,
      } as any;

      const points = getStarPoints(element);
      const xs = points.map((p) => p[0]);
      const ys = points.map((p) => p[1]);
      const xRange = Math.max(...xs) - Math.min(...xs);
      const yRange = Math.max(...ys) - Math.min(...ys);

      // Width range should be approximately double the height range
      expect(xRange).toBeGreaterThan(yRange);
    });
  });

  describe("type system", () => {
    it("should be recognized as a valid Excalidraw element", () => {
      expect(isExcalidrawElement({ type: "star" })).toBe(true);
    });

    it("should be recognized as a bindable element", () => {
      const element = { type: "star", locked: false } as any;
      expect(isBindableElement(element)).toBe(true);
    });

    it("should support background, stroke color, width, and style", () => {
      expect(hasBackground("star")).toBe(true);
      expect(hasStrokeColor("star")).toBe(true);
      expect(hasStrokeWidth("star")).toBe(true);
      expect(hasStrokeStyle("star")).toBe(true);
    });
  });

  describe("convertToExcalidrawElements", () => {
    it("should transform a star element", () => {
      const elements = [
        {
          type: "star" as const,
          x: 100,
          y: 100,
          id: "star-1",
        },
      ];
      const data = convertToExcalidrawElements(
        elements as ExcalidrawElementSkeleton[],
        opts,
      );
      expect(data.length).toBe(1);
      expect(data[0].type).toBe("star");
      expect(data[0].id).toBe("star-1");
      expect(data[0].x).toBe(100);
      expect(data[0].y).toBe(100);
    });

    it("should create star with default dimensions", () => {
      const elements = [
        {
          type: "star" as const,
          x: 0,
          y: 0,
          id: "star-2",
        },
      ];
      const data = convertToExcalidrawElements(
        elements as ExcalidrawElementSkeleton[],
        opts,
      );
      expect(data[0].width).toBeGreaterThan(0);
      expect(data[0].height).toBeGreaterThan(0);
    });

    it("should create star with a label", () => {
      const elements = [
        {
          type: "star" as const,
          x: 100,
          y: 100,
          id: "star-label",
          label: {
            text: "Hello",
          },
        },
      ];
      const data = convertToExcalidrawElements(
        elements as ExcalidrawElementSkeleton[],
        opts,
      );
      // Star + text element
      expect(data.length).toBe(2);
      expect(data[0].type).toBe("star");
      expect(data[1].type).toBe("text");
    });
  });

  describe("shape geometry", () => {
    it("should return a polygon shape", () => {
      const element = newElement({
        type: "star",
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      }) as ExcalidrawStarElement;

      const elementsMap = new Map([
        [element.id, element],
      ]) as ElementsMap;

      const shape = getElementShape(element, elementsMap);
      expect(shape.type).toBe("polygon");
    });
  });
});
