import { describe, expect, it } from "vitest";

import {
  getStarPointsLocal,
  STAR_INNER_RADIUS_RATIO,
} from "../src/bounds";

describe("star geometry", () => {
  it("uses inner radius ratio 0.5 for outer/inner alternation", () => {
    expect(STAR_INNER_RADIUS_RATIO).toBe(0.5);
  });

  it("returns 10 vertices for a 5-point star", () => {
    const pts = getStarPointsLocal(100, 100);
    expect(pts).toHaveLength(10);
  });

  it("places the first outer vertex at top center for a square bbox", () => {
    const pts = getStarPointsLocal(100, 100);
    expect(pts[0][0]).toBeCloseTo(50, 5);
    expect(pts[0][1]).toBeCloseTo(0, 5);
  });
});
