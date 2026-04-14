import React from "react";

import { reseed } from "@excalidraw/common";

import { Excalidraw } from "../index";

import { render, fireEvent, screen, unmountComponent } from "./test-utils";

unmountComponent();

beforeEach(() => {
  reseed(7);
});

const { h } = window;

describe("star shape tool", () => {
  it("creates a star from center using drag", async () => {
    const { container } = await render(<Excalidraw />);
    const starTool = await screen.findByTestId("toolbar-star");
    fireEvent.click(starTool);
    const canvas = container.querySelector("canvas.interactive")!;

    fireEvent.pointerDown(canvas, { clientX: 30, clientY: 20 });
    fireEvent.pointerMove(canvas, { clientX: 60, clientY: 70 });
    fireEvent.pointerUp(canvas);

    expect(h.elements.length).toEqual(1);
    expect(h.elements[0].type).toEqual("star");
    expect(h.elements[0].x).toEqual(0);
    expect(h.elements[0].y).toEqual(-30);
    expect(h.elements[0].width).toEqual(60);
    expect(h.elements[0].height).toEqual(100);
  });
});
