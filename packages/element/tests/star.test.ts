import { arrayToMap } from "@excalidraw/common";

import { lineSegment, pointFrom, type GlobalPoint } from "@excalidraw/math";

import { getElementBounds, getStarPoints } from "../src/bounds";
import { intersectElementWithLineSegment } from "../src/collision";
import { newElement } from "../src/newElement";

describe("star geometry", () => {
  it("builds a 10-point star around the element center", () => {
    const element = newElement({
      type: "star",
      x: 10,
      y: 20,
      width: 100,
      height: 80,
    });

    const points = getStarPoints(element);

    expect(points).toHaveLength(10);
    expect(points[0][0]).toBeCloseTo(50);
    expect(points[0][1]).toBeCloseTo(0);
    expect(points[2][0]).toBeCloseTo(97.5528);
    expect(points[2][1]).toBeCloseTo(27.6393);
    expect(points[4][0]).toBeCloseTo(79.3893);
    expect(points[4][1]).toBeCloseTo(72.3607);
  });

  it("bounds the rendered star outline", () => {
    const element = newElement({
      type: "star",
      x: 10,
      y: 20,
      width: 100,
      height: 80,
    });

    const [x1, y1, x2, y2] = getElementBounds(element, arrayToMap([element]));

    expect(x1).toBeCloseTo(12.4472);
    expect(y1).toBeCloseTo(20);
    expect(x2).toBeCloseTo(107.5528);
    expect(y2).toBeCloseTo(92.3607);
  });

  it("applies radial offsets to star points", () => {
    const element = newElement({
      type: "star",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });

    const [topPoint] = getStarPoints(element, 10);

    expect(topPoint[0]).toBeCloseTo(50);
    expect(topPoint[1]).toBeCloseTo(-10);
  });

  it("uses the binding offset when intersecting star outlines", () => {
    const element = newElement({
      type: "star",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
    const elementsMap = arrayToMap([element]);
    const line = lineSegment(
      pointFrom<GlobalPoint>(50, -20),
      pointFrom<GlobalPoint>(50, 50),
    );

    const [intersection] = intersectElementWithLineSegment(
      element,
      elementsMap,
      line,
      10,
      true,
    );

    expect(intersection[0]).toBeCloseTo(50);
    expect(intersection[1]).toBeCloseTo(-10);
  });
});
