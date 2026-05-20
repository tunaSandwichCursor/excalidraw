import { describe, expect, it } from "vitest";

import {
  DEFAULT_UI_COLOR_THEME_ID,
  getUIColorThemeById,
  isUIColorThemeId,
  UI_COLOR_THEMES,
} from "./ui-themes";

describe("ui-themes", () => {
  it("includes default and sunset themes", () => {
    expect(UI_COLOR_THEMES.map((t) => t.id)).toEqual(["default", "sunset"]);
  });

  it("validates theme ids", () => {
    expect(isUIColorThemeId("sunset")).toBe(true);
    expect(isUIColorThemeId("invalid")).toBe(false);
  });

  it("returns sunset theme with light and dark variants", () => {
    const sunset = getUIColorThemeById("sunset");
    expect(sunset.name).toBe("Sunset");
    expect(sunset.light["--color-primary"]).toBe("#c44d6e");
    expect(sunset.dark["--color-primary"]).toBe("#f4a574");
    expect(sunset.lightBackground).toBeTruthy();
    expect(sunset.darkBackground).toBeTruthy();
  });

  it("falls back to default for unknown id", () => {
    expect(getUIColorThemeById(DEFAULT_UI_COLOR_THEME_ID).id).toBe("default");
  });
});
