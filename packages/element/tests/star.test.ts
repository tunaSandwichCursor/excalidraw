import { arrayToMap, ROUNDNESS } from "@excalidraw/common";

import {
  getElementBounds,
  getStarPoints,
  STAR_INNER_RADIUS_RATIO,
} from "../src/bounds";

import type { ExcalidrawElement } from "../src/types";

const starElement = (
  x: number,
  y: number,
  w: number,
  h: number,
  a = 0,
): ExcalidrawElement =>
  ({
    type: "star",
    strokeColor: "#000",
    backgroundColor: "#000",
    fillStyle: "solid",
    strokeWidth: 1,
    roundness: { type: ROUNDNESS.PROPORTIONAL_RADIUS },
    roughness: 0,
    opacity: 100,
    x,
    y,
    width: w,
    height: h,
    angle: a,
  } as ExcalidrawElement);

describe("star geometry", () => {
  it("uses regular pentagram inner/outer radius ratio", () => {
    expect(STAR_INNER_RADIUS_RATIO).toBeCloseTo(
      Math.sin(Math.PI / 10) / Math.sin((3 * Math.PI) / 10),
      10,
    );
  });

  it("getStarPoints returns 10 vertices with top outer point and expected inner radius", () => {
    const el = starElement(0, 0, 200, 200);
    const pts = getStarPoints(el);
    expect(pts.length).toBe(10);
    expect(pts[0][0]).toBeCloseTo(100, 5);
    expect(pts[0][1]).toBeCloseTo(0, 5);
    const [ix, iy] = pts[1];
    const innerR = Math.hypot(ix - 100, iy - 100);
    expect(innerR / 100).toBeCloseTo(STAR_INNER_RADIUS_RATIO, 5);
  });

  it("axis-aligned bounds match bounding box", () => {
    const el = starElement(10, 20, 100, 80);
    const [x1, y1, x2, y2] = getElementBounds(el, arrayToMap([el]));
    expect(x1).toBeCloseTo(10, 5);
    expect(y1).toBeCloseTo(20, 5);
    expect(x2).toBeCloseTo(110, 5);
    expect(y2).toBeCloseTo(100, 5);
  });
});
