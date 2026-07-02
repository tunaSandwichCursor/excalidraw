import { pointFrom } from "@excalidraw/math";

import { arrayToMap } from "@excalidraw/common";

import type { GlobalPoint } from "@excalidraw/math";

import { getElementBounds, getStarPoints } from "../src/bounds";
import { isPointInElement } from "../src/collision";
import { distanceToElement } from "../src/distance";
import { newElement } from "../src/newElement";
import { ShapeCache } from "../src/shape";
import { deconstructStarElement } from "../src/utils";

import type { ExcalidrawElement, ExcalidrawStarElement } from "../src/types";

const createStar = ({
  x = 0,
  y = 0,
  w = 100,
  h = 100,
  a = 0,
}: {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  a?: number;
}): ExcalidrawStarElement =>
  ({
    type: "star",
    strokeColor: "#000",
    backgroundColor: "#000",
    fillStyle: "solid",
    strokeWidth: 1,
    roundness: null,
    roughness: 0,
    opacity: 100,
    x,
    y,
    width: w,
    height: h,
    angle: a,
  } as ExcalidrawStarElement);

describe("getStarPoints", () => {
  it("returns 10 alternating (outer/inner) vertices", () => {
    const star = createStar({ w: 100, h: 100 });
    const points = getStarPoints(star);
    expect(points).toHaveLength(10);
  });

  it("normalizes the star so it exactly fills the bounding box", () => {
    const star = createStar({ w: 200, h: 120 });
    const points = getStarPoints(star);

    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);

    expect(Math.min(...xs)).toBeCloseTo(0);
    expect(Math.max(...xs)).toBeCloseTo(200);
    expect(Math.min(...ys)).toBeCloseTo(0);
    expect(Math.max(...ys)).toBeCloseTo(120);
  });

  it("places the first (top) point at the horizontal center of the box", () => {
    const star = createStar({ w: 100, h: 100 });
    const [top] = getStarPoints(star);
    expect(top[0]).toBeCloseTo(50);
    expect(top[1]).toBeCloseTo(0);
  });

  it("scales with the element's width and height", () => {
    const small = getStarPoints(createStar({ w: 50, h: 50 }));
    const large = getStarPoints(createStar({ w: 100, h: 100 }));

    for (let i = 0; i < small.length; i++) {
      expect(large[i][0]).toBeCloseTo(small[i][0] * 2);
      expect(large[i][1]).toBeCloseTo(small[i][1] * 2);
    }
  });
});

describe("deconstructStarElement", () => {
  it("produces 10 sides and no curves", () => {
    const star = createStar({ w: 100, h: 100 });
    const [sides, curves] = deconstructStarElement(star);
    expect(sides).toHaveLength(10);
    expect(curves).toHaveLength(0);
  });
});

describe("star hit-testing", () => {
  it("detects a point at the star's center as inside", () => {
    const star = createStar({ x: 0, y: 0, w: 100, h: 100 });
    const map = arrayToMap([star as ExcalidrawElement]);
    expect(
      isPointInElement(pointFrom<GlobalPoint>(50, 50), star, map),
    ).toBe(true);
  });

  it("does not detect a far-away point as inside", () => {
    const star = createStar({ x: 0, y: 0, w: 100, h: 100 });
    const map = arrayToMap([star as ExcalidrawElement]);
    expect(
      isPointInElement(pointFrom<GlobalPoint>(500, 500), star, map),
    ).toBe(false);
  });

  it("treats the concave notches between points as outside the shape", () => {
    const star = createStar({ x: 0, y: 0, w: 100, h: 100 });
    const map = arrayToMap([star as ExcalidrawElement]);
    // A point just inside the top edge of the bounding box but off to the side
    // falls in the empty region between two star points.
    expect(
      isPointInElement(pointFrom<GlobalPoint>(5, 5), star, map),
    ).toBe(false);
  });

  it("computes a finite distance to the outline", () => {
    const star = createStar({ x: 0, y: 0, w: 100, h: 100 });
    const map = arrayToMap([star as ExcalidrawElement]);
    const distance = distanceToElement(
      star,
      map,
      pointFrom<GlobalPoint>(-10, 50),
    );
    expect(Number.isFinite(distance)).toBe(true);
    expect(distance).toBeGreaterThan(0);
  });
});

describe("star element creation & rendering", () => {
  it("creates a star element via newElement", () => {
    const star = newElement({
      type: "star",
      x: 10,
      y: 20,
      width: 80,
      height: 60,
    });
    expect(star.type).toEqual("star");
    expect(star.width).toEqual(80);
    expect(star.height).toEqual(60);
  });

  it("generates a rough.js drawable shape without throwing", () => {
    const star = newElement({
      type: "star",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      backgroundColor: "#ffc9c9",
    }) as ExcalidrawStarElement;
    const shape = ShapeCache.generateElementShape(star, null);
    expect(shape).toBeTruthy();
  });

  it("renders correctly at extreme aspect ratios", () => {
    const wide = getStarPoints(createStar({ w: 400, h: 20 }));
    expect(Math.max(...wide.map((p) => p[0]))).toBeCloseTo(400);
    expect(Math.max(...wide.map((p) => p[1]))).toBeCloseTo(20);

    const tall = getStarPoints(createStar({ w: 20, h: 400 }));
    expect(Math.max(...tall.map((p) => p[0]))).toBeCloseTo(20);
    expect(Math.max(...tall.map((p) => p[1]))).toBeCloseTo(400);
  });
});

describe("star bounds", () => {
  it("bounding box matches the element box when unrotated", () => {
    const star = createStar({ x: 40, y: 30, w: 20, h: 10 });
    const [x1, y1, x2, y2] = getElementBounds(
      star,
      arrayToMap([star as ExcalidrawElement]),
    );
    expect(x1).toBeCloseTo(40);
    expect(y1).toBeCloseTo(30);
    expect(x2).toBeCloseTo(60);
    expect(y2).toBeCloseTo(40);
  });
});