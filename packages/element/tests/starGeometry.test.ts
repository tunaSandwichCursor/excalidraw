import { describe, expect, it } from "vitest";

import { getStarVerticesLocal, pointFrom } from "@excalidraw/math";
import type { GlobalPoint, Radians } from "@excalidraw/math";

import { distanceToElement } from "../src/distance";
import { ElementBounds } from "../src/bounds";

import type { ElementsMap } from "../src/types";

const emptyMap = new Map() as ElementsMap;

describe("star geometry", () => {
  it("getStarVerticesLocal returns 10 vertices in local space", () => {
    const v = getStarVerticesLocal(100, 100);
    expect(v).toHaveLength(10);
    expect(v[0][0]).toBeCloseTo(50, 5);
    expect(v[0][1]).toBeCloseTo(0, 5);
  });

  it("bounds of a star match vertex extent", () => {
    const element = {
      type: "star" as const,
      id: "s1",
      x: 10,
      y: 20,
      width: 100,
      height: 80,
      angle: 0 as Radians,
      strokeColor: "#000",
      backgroundColor: "transparent",
      fillStyle: "hachure" as const,
      strokeWidth: 1,
      strokeStyle: "solid" as const,
      roughness: 1,
      opacity: 100,
      roundness: null,
      seed: 1,
      version: 1,
      versionNonce: 0,
      index: null,
      isDeleted: false,
      groupIds: [],
      frameId: null,
      boundElements: null,
      updated: 0,
      link: null,
      locked: false,
    };
    const b = ElementBounds.getBounds(element, emptyMap);
    const verts = getStarVerticesLocal(100, 80).map(([lx, ly]) => [
      10 + lx,
      20 + ly,
    ]);
    const minX = Math.min(...verts.map((p) => p[0]));
    const maxX = Math.max(...verts.map((p) => p[0]));
    const minY = Math.min(...verts.map((p) => p[1]));
    const maxY = Math.max(...verts.map((p) => p[1]));
    expect(b[0]).toBeCloseTo(minX, 5);
    expect(b[1]).toBeCloseTo(minY, 5);
    expect(b[2]).toBeCloseTo(maxX, 5);
    expect(b[3]).toBeCloseTo(maxY, 5);
  });

  it("distanceToElement is small near an outer vertex", () => {
    const element = {
      type: "star" as const,
      id: "s2",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      angle: 0 as Radians,
      strokeColor: "#000",
      backgroundColor: "transparent",
      fillStyle: "hachure" as const,
      strokeWidth: 1,
      strokeStyle: "solid" as const,
      roughness: 1,
      opacity: 100,
      roundness: null,
      seed: 1,
      version: 1,
      versionNonce: 0,
      index: null,
      isDeleted: false,
      groupIds: [],
      frameId: null,
      boundElements: null,
      updated: 0,
      link: null,
      locked: false,
    };
    const top = getStarVerticesLocal(100, 100)[0];
    const d = distanceToElement(
      element,
      emptyMap,
      pointFrom<GlobalPoint>(top[0], top[1] - 2),
    );
    expect(d).toBeLessThan(3);
  });
});
