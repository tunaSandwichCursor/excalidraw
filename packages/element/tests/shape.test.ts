import { ROUNDNESS } from "@excalidraw/common";

import { generateRoughOptions } from "../src/shape";

import type { ExcalidrawElement } from "../src/types";

const makeElement = (
  type: ExcalidrawElement["type"],
  overrides: Partial<ExcalidrawElement> = {},
): ExcalidrawElement =>
  ({
    type,
    seed: 1,
    strokeColor: "#1e1e1e",
    backgroundColor: "#ffc9c9",
    fillStyle: "solid",
    strokeStyle: "solid",
    strokeWidth: 1,
    roundness: { type: ROUNDNESS.PROPORTIONAL_RADIUS },
    roughness: 1,
    opacity: 100,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    angle: 0,
    ...overrides,
  } as ExcalidrawElement);

describe("generateRoughOptions", () => {
  it("renders a rectangle with a visible stroke and fill", () => {
    const options = generateRoughOptions(makeElement("rectangle"));

    // a rectangle must use its own stroke color, not a transparent (invisible)
    // stroke, otherwise it does not show up on the canvas
    expect(options.stroke).toBe("#1e1e1e");
    expect(options.stroke).not.toBe("transparent");
    expect(options.fill).toBe("#ffc9c9");
  });

  it("gives a rectangle the same stroke handling as other shapes", () => {
    const rectangle = generateRoughOptions(makeElement("rectangle"));
    const ellipse = generateRoughOptions(makeElement("ellipse"));
    const diamond = generateRoughOptions(makeElement("diamond"));

    expect(rectangle.stroke).toBe(ellipse.stroke);
    expect(rectangle.stroke).toBe(diamond.stroke);
  });

  it("omits the fill only when the background is transparent", () => {
    const options = generateRoughOptions(
      makeElement("rectangle", { backgroundColor: "transparent" }),
    );

    expect(options.stroke).toBe("#1e1e1e");
    expect(options.fill).toBeUndefined();
  });
});
