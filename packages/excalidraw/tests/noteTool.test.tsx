import React from "react";

import {
  FONT_FAMILY,
  KEYS,
  TEXT_ALIGN,
  resolvablePromise,
} from "@excalidraw/common";

import { Excalidraw } from "../index";

import { act, fireEvent, render, waitFor } from "./test-utils";

import type {
  ExcalidrawElement,
  ExcalidrawTextElement,
} from "@excalidraw/element/types";
import type { ExcalidrawImperativeAPI } from "../types";

const getCanvas = () => document.querySelector("canvas.interactive")!;

const getLatestNote = () =>
  window.h.elements.filter((el) => el.type === "note").at(-1)!;

const getBoundText = (containerId: ExcalidrawElement["id"]) =>
  window.h.elements.find(
    (el): el is ExcalidrawTextElement =>
      el.type === "text" && el.containerId === containerId,
  )!;

describe("note tool", () => {
  let excalidrawAPI: ExcalidrawImperativeAPI;

  beforeEach(async () => {
    const excalidrawAPIPromise = resolvablePromise<ExcalidrawImperativeAPI>();
    await render(
      <Excalidraw
        onExcalidrawAPI={(api) => excalidrawAPIPromise.resolve(api as any)}
        handleKeyboardGlobally={true}
      />,
    );
    excalidrawAPI = await excalidrawAPIPromise;
  });

  it("is visible in toolbar and activates via shortcut", async () => {
    expect(window.h.state.activeTool.type).toBe("selection");

    const noteTool = window.h.app
      ? document.querySelector(`[data-testid="toolbar-note"]`)
      : null;
    expect(noteTool).not.toBeNull();

    fireEvent.keyDown(document, { key: KEYS.N });
    fireEvent.keyUp(document, { key: KEYS.N });

    await waitFor(() => {
      expect(window.h.state.activeTool.type).toBe("note");
    });
  });

  it("creates fixed-size note and enters inline editing on single click", async () => {
    act(() => {
      excalidrawAPI.setActiveTool({ type: "note" });
    });

    const canvas = getCanvas();
    fireEvent.pointerDown(canvas, { clientX: 120, clientY: 140 });
    fireEvent.pointerUp(canvas, { clientX: 120, clientY: 140 });

    await waitFor(() => {
      expect(window.h.elements.some((el) => el.type === "note")).toBe(true);
      expect(window.h.state.editingTextElement).not.toBeNull();
    });

    const note = getLatestNote();
    expect(note.width).toBe(200);
    expect(note.height).toBe(200);
    expect(window.h.state.editingTextElement?.containerId).toBe(note.id);
    expect(window.h.state.activeTool.type).toBe("selection");
  });

  it("single-click selects existing note and double-click edits it", async () => {
    act(() => {
      excalidrawAPI.setActiveTool({ type: "note" });
    });

    const canvas = getCanvas();
    const clickX = 220;
    const clickY = 220;
    fireEvent.pointerDown(canvas, { clientX: clickX, clientY: clickY });
    fireEvent.pointerUp(canvas, { clientX: clickX, clientY: clickY });

    await waitFor(() => {
      expect(window.h.state.editingTextElement).not.toBeNull();
    });

    const openEditor = document.querySelector("textarea")!;
    fireEvent.keyDown(openEditor, { key: KEYS.ESCAPE });
    fireEvent.keyUp(openEditor, { key: KEYS.ESCAPE });

    await waitFor(() => {
      expect(window.h.state.editingTextElement).toBeNull();
    });

    const note = getLatestNote();

    fireEvent.pointerDown(canvas, { clientX: clickX, clientY: clickY });
    fireEvent.pointerUp(canvas, { clientX: clickX, clientY: clickY });

    await waitFor(() => {
      expect(window.h.state.editingTextElement).toBeNull();
    });

    fireEvent.doubleClick(canvas, { clientX: clickX, clientY: clickY });

    await waitFor(() => {
      expect(window.h.state.editingTextElement?.containerId).toBe(note.id);
    });
  });

  it("inherits current style controls for note and bound text", async () => {
    act(() => {
      excalidrawAPI.updateScene({
        appState: {
          currentItemStrokeColor: "#2f9e44",
          currentItemBackgroundColor: "#ffd43b",
          currentItemFillStyle: "hachure",
          currentItemStrokeWidth: 4,
          currentItemStrokeStyle: "dashed",
          currentItemOpacity: 60,
          currentItemRoughness: 2,
          currentItemFontFamily: FONT_FAMILY.Cascadia,
          currentItemFontSize: 28,
          currentItemTextAlign: TEXT_ALIGN.CENTER,
        },
      });
      excalidrawAPI.setActiveTool({ type: "note" });
    });

    const canvas = getCanvas();
    fireEvent.pointerDown(canvas, { clientX: 320, clientY: 220 });
    fireEvent.pointerUp(canvas, { clientX: 320, clientY: 220 });

    await waitFor(() => {
      expect(window.h.state.editingTextElement).not.toBeNull();
    });

    const note = getLatestNote();
    const noteText = getBoundText(note.id);

    expect(note).toMatchObject({
      strokeColor: "#2f9e44",
      backgroundColor: "#ffd43b",
      fillStyle: "hachure",
      strokeWidth: 4,
      strokeStyle: "dashed",
      opacity: 60,
      roughness: 2,
    });

    expect(noteText).toMatchObject({
      strokeColor: "#2f9e44",
      backgroundColor: "#ffd43b",
      fillStyle: "hachure",
      strokeWidth: 4,
      strokeStyle: "dashed",
      opacity: 60,
      fontFamily: FONT_FAMILY.Cascadia,
      fontSize: 28,
      textAlign: TEXT_ALIGN.CENTER,
    });
  });
});
