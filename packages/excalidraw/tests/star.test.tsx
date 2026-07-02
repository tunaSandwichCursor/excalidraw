import React from "react";

import { KEYS, reseed } from "@excalidraw/common";

import { Excalidraw } from "../index";

import { fireEvent, render, unmountComponent, waitFor } from "./test-utils";

unmountComponent();

const { h } = window;

const clickTool = async (container: HTMLElement, tool: string) => {
  await waitFor(() => {
    const button = container.querySelector(`[data-testid="toolbar-${tool}"]`);
    if (!button) {
      throw new Error(`toolbar-${tool} not found`);
    }
  });

  fireEvent.click(container.querySelector(`[data-testid="toolbar-${tool}"]`)!);
};

const getInteractiveCanvas = async (container: HTMLElement) => {
  await waitFor(() => {
    const canvas = container.querySelector("canvas.interactive");
    if (!canvas) {
      throw new Error("interactive canvas not found");
    }
  });

  return container.querySelector("canvas.interactive")!;
};

beforeEach(() => {
  localStorage.clear();
  reseed(7);
});

describe("star tool", () => {
  it("creates a star from the pointer-down center to the dragged radius", async () => {
    const { container } = await render(<Excalidraw />);
    await clickTool(container, "star");

    const canvas = await getInteractiveCanvas(container);
    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(canvas, { clientX: 130, clientY: 140 });
    fireEvent.pointerUp(canvas);

    expect(h.elements).toHaveLength(1);
    expect(h.elements[0]).toMatchObject({
      type: "star",
      x: 70,
      y: 60,
      width: 60,
      height: 80,
    });
  });

  it("selects the star by its rendered outline", async () => {
    const { container } = await render(
      <Excalidraw handleKeyboardGlobally={true} />,
    );
    const canvas = await getInteractiveCanvas(container);

    await clickTool(container, "star");
    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(canvas, { clientX: 130, clientY: 140 });
    fireEvent.pointerUp(canvas);
    fireEvent.keyDown(document, { key: KEYS.ESCAPE });

    await clickTool(container, "selection");
    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 60 });
    fireEvent.pointerUp(canvas);

    expect(h.elements).toHaveLength(1);
    expect(h.state.selectedElementIds[h.elements[0].id]).toBeTruthy();
  });
});
