import { useCallback, useLayoutEffect, useState } from "react";

import { STORAGE_KEYS } from "./app_constants";
import {
  DEFAULT_UI_COLOR_THEME_ID,
  isUIColorThemeId,
  type UIColorThemeId,
} from "./themes/ui-themes";

export const useHandleUIColorTheme = () => {
  const [uiColorTheme, setUIColorTheme] = useState<UIColorThemeId>(() => {
    const stored = localStorage.getItem(
      STORAGE_KEYS.LOCAL_STORAGE_UI_COLOR_THEME,
    );
    return stored && isUIColorThemeId(stored)
      ? stored
      : DEFAULT_UI_COLOR_THEME_ID;
  });

  useLayoutEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.LOCAL_STORAGE_UI_COLOR_THEME,
      uiColorTheme,
    );
  }, [uiColorTheme]);

  const colorThemeClassName =
    uiColorTheme === DEFAULT_UI_COLOR_THEME_ID
      ? undefined
      : `color-theme--${uiColorTheme}`;

  const onUIColorThemeChange = useCallback((themeId: UIColorThemeId) => {
    setUIColorTheme(themeId);
  }, []);

  return {
    uiColorTheme,
    setUIColorTheme: onUIColorThemeChange,
    colorThemeClassName,
  };
};
