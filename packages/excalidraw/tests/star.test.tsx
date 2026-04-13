import React from "react";
import { vi } from "vitest";

import { reseed } from "@excalidraw/common";

import { Excalidraw } from "../index";
import * as InteractiveScene from "../renderer/interactiveScene";
import * as StaticScene from "../renderer/staticScene";

import {
  getByTestId,
  render,
  fireEvent,
  unmountComponent,
  waitFor,
} from "./test-utils";

import "./helpers/api";

unmountComponent();

const renderInteractiveScene = vi.spyOn(
  InteractiveScene,
  "renderInteractiveScene",
);
const renderStaticScene = vi.spyOn(StaticScene, "renderStaticScene");

beforeEach(() => {
  if (typeof localStorage?.clear === "function") {
    localStorage.clear();
  }
  renderInteractiveScene.mockClear();
  renderStaticScene.mockClear();
  reseed(7);
});

const { h } = window;

describe("star shape", () => {
  it("creates star via toolbar drag", async () => {
    const { container } = await render(<Excalidraw />);
    const starButton = await waitFor(() =>
      getByTestId(container, "toolbar-star"),
    );
    fireEvent.click(starButton);

    const canvas = container.querySelector("canvas.interactive")!;

    fireEvent.pointerDown(canvas, { clientX: 30, clientY: 20 });
    fireEvent.pointerMove(canvas, { clientX: 60, clientY: 70 });
    fireEvent.pointerUp(canvas);

    expect(renderInteractiveScene.mock.calls.length).toMatchInlineSnapshot(`5`);
    expect(renderStaticScene.mock.calls.length).toMatchInlineSnapshot(`5`);
    expect(h.state.selectionElement).toBeNull();

    expect(h.elements.length).toEqual(1);
    expect(h.elements[0].type).toEqual("star");
    expect(h.elements[0].x).toEqual(30);
    expect(h.elements[0].y).toEqual(20);
    expect(h.elements[0].width).toEqual(30);
    expect(h.elements[0].height).toEqual(50);

    expect(h.elements.length).toMatchSnapshot();
    h.elements.forEach((element) => expect(element).toMatchSnapshot());
  });
});
