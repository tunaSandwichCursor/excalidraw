import { describe, expect, it } from "vitest";

import { API } from "./helpers/api";
import "./helpers/ui";

describe("sticky note tool", () => {
  it("creates sticky note elements with expected defaults", () => {
    const sticky = API.createElement({
      type: "stickyNote",
      x: 50,
      y: 50,
      text: "My note",
    });

    expect(sticky.type).toBe("stickyNote");
    expect(sticky.backgroundColor).toBe("#FDEFA3");
    expect(sticky.text).toBe("My note");
    expect(sticky.autoResize).toBe(false);
  });
});
