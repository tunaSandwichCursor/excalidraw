import { THEME, DARK_THEME_FILTER, SUNSET_THEME_FILTER } from "./constants";

import type { ValueOf } from "./utility-types";

type ThemeValue = ValueOf<typeof THEME>;

export interface ThemeConfig {
  /** Display label translation key */
  labelKey: string;
  /** CSS class applied to the excalidraw root and portal containers */
  cssClass: string;
  /** Whether this theme behaves like dark mode for canvas rendering
   *  (color inversion, dark backgrounds, etc.) */
  isDarkLike: boolean;
  /** CSS filter string applied via --theme-filter for SVG images etc. */
  cssFilter: string;
  /** Canvas-side color-transform function name, or null for identity */
  canvasFilterType: "dark" | "sunset" | null;
}

const THEME_REGISTRY: Record<ThemeValue, ThemeConfig> = {
  [THEME.LIGHT]: {
    labelKey: "labels.theme_light",
    cssClass: "",
    isDarkLike: false,
    cssFilter: "none",
    canvasFilterType: null,
  },
  [THEME.DARK]: {
    labelKey: "labels.theme_dark",
    cssClass: "theme--dark",
    isDarkLike: true,
    cssFilter: DARK_THEME_FILTER,
    canvasFilterType: "dark",
  },
  [THEME.SUNSET]: {
    labelKey: "labels.theme_sunset",
    cssClass: "theme--sunset",
    isDarkLike: true,
    cssFilter: SUNSET_THEME_FILTER,
    canvasFilterType: "sunset",
  },
};

export const getThemeConfig = (theme: ThemeValue): ThemeConfig =>
  THEME_REGISTRY[theme] ?? THEME_REGISTRY[THEME.LIGHT];

export const isDarkLikeTheme = (theme: ThemeValue): boolean =>
  getThemeConfig(theme).isDarkLike;

export const getThemeCssClass = (theme: ThemeValue): string =>
  getThemeConfig(theme).cssClass;

export const getThemeCssFilter = (theme: ThemeValue): string =>
  getThemeConfig(theme).cssFilter;

/**
 * Ordered list of explicit built-in themes for cycling (excludes "system").
 */
export const EXPLICIT_BUILT_IN_THEMES: readonly ThemeValue[] = [
  THEME.LIGHT,
  THEME.DARK,
  THEME.SUNSET,
] as const;

/**
 * Returns the next theme in the cycle: light -> dark -> sunset -> light.
 * If the current theme is not in the cycle, starts from light.
 */
export const getNextTheme = (current: ThemeValue): ThemeValue => {
  const idx = EXPLICIT_BUILT_IN_THEMES.indexOf(current);
  if (idx === -1) {
    return THEME.LIGHT;
  }
  return EXPLICIT_BUILT_IN_THEMES[
    (idx + 1) % EXPLICIT_BUILT_IN_THEMES.length
  ];
};

/**
 * Validates a stored theme value against the registry.
 * Returns the value if valid, otherwise falls back to THEME.LIGHT.
 */
export const validateThemeValue = (
  value: string | null | undefined,
): ThemeValue => {
  if (value && value in THEME_REGISTRY) {
    return value as ThemeValue;
  }
  return THEME.LIGHT;
};

/**
 * Validates a stored theme-or-system value.
 * Returns "system" if that's the value, otherwise validates as ThemeValue.
 */
export const validateAppThemeValue = (
  value: string | null | undefined,
): ThemeValue | "system" => {
  if (value === "system") {
    return "system";
  }
  return validateThemeValue(value);
};
