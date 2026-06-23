import { actionToggleTheme } from "../../actions";

import type { CommandPaletteItem } from "./types";

export const toggleTheme: CommandPaletteItem = {
  ...actionToggleTheme,
  category: "App",
  label: "Cycle theme",
  keywords: ["toggle", "dark", "light", "sunset", "mode", "theme"],
  perform: ({ actionManager }) => {
    actionManager.executeAction(actionToggleTheme, "commandPalette");
  },
};
