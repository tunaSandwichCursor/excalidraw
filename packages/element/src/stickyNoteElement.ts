import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_ALIGN,
  DEFAULT_VERTICAL_ALIGN,
  STICKY_NOTE_DEFAULT_BACKGROUND,
  STICKY_NOTE_DEFAULT_HEIGHT,
  STICKY_NOTE_DEFAULT_WIDTH,
  STICKY_NOTE_PADDING,
  getFontString,
  getLineHeight,
  ROUNDNESS,
} from "@excalidraw/common";

import { normalizeText } from "./textMeasurements";
import { wrapText } from "./textWrapping";

import type { ExcalidrawStickyNoteElement } from "./types";

export const refreshStickyNoteText = (
  element: ExcalidrawStickyNoteElement,
  nextOriginalText: string,
): Pick<ExcalidrawStickyNoteElement, "text" | "originalText"> => {
  const originalText = nextOriginalText;
  const text = wrapText(
    normalizeText(originalText),
    getFontString(element),
    Math.max(0, element.width - STICKY_NOTE_PADDING * 2),
  );

  return {
    originalText,
    text,
  };
};

export const getStickyNoteTextAreaBounds = (
  element: ExcalidrawStickyNoteElement,
) => ({
  x: element.x + STICKY_NOTE_PADDING,
  y: element.y + STICKY_NOTE_PADDING,
  width: Math.max(0, element.width - STICKY_NOTE_PADDING * 2),
  height: Math.max(0, element.height - STICKY_NOTE_PADDING * 2),
});

export const getDefaultStickyNoteAttributes = () => ({
  width: STICKY_NOTE_DEFAULT_WIDTH,
  height: STICKY_NOTE_DEFAULT_HEIGHT,
  backgroundColor: STICKY_NOTE_DEFAULT_BACKGROUND,
  fillStyle: "solid" as const,
  roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
  boundElements: null,
});
