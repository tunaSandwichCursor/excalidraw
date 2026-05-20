import { describe, expect, it } from "vitest";

import {
  getUIColorThemeById,
  isUIColorThemeId,
  UI_COLOR_THEMES,
  type UIColorThemeId,
} from "./ui-themes";

describe("ui-themes", () => {
  it("includes default and sunset themes", () => {
    expect(UI_COLOR_THEMES.map((t) => t.id)).toEqual(["default", "sunset"]);
  });

  it("validates theme ids", () => {
    expect(isUIColorThemeId("sunset")).toBe(true);
    expect(isUIColorThemeId("invalid")).toBe(false);
  });

  it("returns sunset theme with expected metadata", () => {
    const sunset = getUIColorThemeById("sunset");
    expect(sunset.name).toBe("Sunset");
    expect(sunset.lightBackground).toBe("#fff6f0");
    expect(sunset.darkBackground).toBe("#1a1218");
  });

  it("falls back to default for unknown id", () => {
    expect(
      getUIColorThemeById("nonexistent" as unknown as UIColorThemeId).id,
    ).toBe("default");
  });
});
