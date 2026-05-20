import DropdownMenuItem from "@excalidraw/excalidraw/components/dropdownMenu/DropdownMenuItem";
import DropdownMenuSub from "@excalidraw/excalidraw/components/dropdownMenu/DropdownMenuSub";
import { palette } from "@excalidraw/excalidraw/components/icons";
import React from "react";

import { UI_COLOR_THEMES, type UIColorThemeId } from "../themes/ui-themes";

const ThemeSwatch = ({
  lightBackground,
  darkBackground,
}: {
  lightBackground: string;
  darkBackground: string;
}) => (
  <span
    className="ui-color-theme-swatch"
    aria-hidden
    style={{
      display: "inline-flex",
      width: "1rem",
      height: "1rem",
      borderRadius: "50%",
      overflow: "hidden",
      border: "1px solid var(--color-border-outline-variant)",
      flexShrink: 0,
    }}
  >
    <span
      style={{
        width: "50%",
        height: "100%",
        background: lightBackground,
      }}
    />
    <span
      style={{
        width: "50%",
        height: "100%",
        background: darkBackground,
      }}
    />
  </span>
);

export const UIColorThemeSubmenu: React.FC<{
  uiColorTheme: UIColorThemeId;
  onSelect: (themeId: UIColorThemeId) => void;
}> = ({ uiColorTheme, onSelect }) => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSub.Trigger icon={palette}>
        Color theme
      </DropdownMenuSub.Trigger>
      <DropdownMenuSub.Content>
        {UI_COLOR_THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            selected={uiColorTheme === theme.id}
            onSelect={(event) => {
              event.preventDefault();
              onSelect(theme.id);
            }}
            aria-label={theme.name}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ThemeSwatch
                lightBackground={theme.lightBackground}
                darkBackground={theme.darkBackground}
              />
              {theme.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuSub.Content>
    </DropdownMenuSub>
  );
};

UIColorThemeSubmenu.displayName = "UIColorThemeSubmenu";
