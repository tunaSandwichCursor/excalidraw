import { pointFrom } from "./point";

import type { LocalPoint, Radians } from "./types";

/** Inner radius / outer radius for a regular 5-pointed star (golden ratio). */
const INNER_RATIO_STAR = (3 - Math.sqrt(5)) / 2;

/** Vertices in element-local space (0,0)–(width,height), starting at top outer point, clockwise. */
export const getStarVerticesLocal = (
  width: number,
  height: number,
): LocalPoint[] => {
  const cx = width / 2;
  const cy = height / 2;
  const rOuterX = Math.abs(width) / 2;
  const rOuterY = Math.abs(height) / 2;
  const rInnerX = rOuterX * INNER_RATIO_STAR;
  const rInnerY = rOuterY * INNER_RATIO_STAR;
  const points: LocalPoint[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (-Math.PI / 2 + (i * Math.PI) / 5) as Radians;
    const isOuter = i % 2 === 0;
    const rx = isOuter ? rOuterX : rInnerX;
    const ry = isOuter ? rOuterY : rInnerY;
    points.push(
      pointFrom<LocalPoint>(
        cx + Math.cos(angle) * rx,
        cy + Math.sin(angle) * ry,
      ),
    );
  }
  return points;
};
