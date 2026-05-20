import { describe, expect, it } from "vitest";

import { API } from "@excalidraw/excalidraw/tests/helpers/api";
import { getElementBounds, getStarPoints } from "@excalidraw/element";
import { arrayToMap } from "@excalidraw/common";
import { dragNewElement } from "@excalidraw/element/dragElements";
import { Scene } from "@excalidraw/element/Scene";

describe("star element", () => {
  it("getStarPoints returns 10 vertices for a 5-pointed star", () => {
    const element = API.createElement({
      type: "star",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });

    const points = getStarPoints(element);
    expect(points.length).toBe(20);
  });

  it("getElementBounds accounts for star vertices", () => {
    const element = API.createElement({
      type: "star",
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    });

    const [x1, y1, x2, y2] = getElementBounds(element, arrayToMap([element]));

    expect(x1).toBeCloseTo(12, 0);
    expect(y1).toBeCloseTo(10, 0);
    expect(x2).toBeCloseTo(88, 0);
    expect(y2).toBeCloseTo(82.4, 0);
  });

  it("dragNewElement expands from center (click point)", () => {
    const element = API.createElement({
      type: "star",
      x: 50,
      y: 50,
      width: 0,
      height: 0,
    });
    const scene = new Scene();
    scene.insertElement(element);

    dragNewElement({
      newElement: element,
      elementType: "star",
      originX: 50,
      originY: 50,
      x: 90,
      y: 90,
      width: 0,
      height: 0,
      shouldMaintainAspectRatio: false,
      shouldResizeFromCenter: false,
      zoom: 1 as import("@excalidraw/excalidraw/types").NormalizedZoomValue,
      scene,
    });

    expect(element.x).toBe(10);
    expect(element.y).toBe(10);
    expect(element.width).toBe(80);
    expect(element.height).toBe(80);
    expect(element.x + element.width / 2).toBe(50);
    expect(element.y + element.height / 2).toBe(50);
  });
});
