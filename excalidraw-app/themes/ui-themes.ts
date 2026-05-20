export type UIColorThemeId = "default" | "sunset";

export type UIColorThemeCSSVariables = Record<string, string>;

export type UIColorThemeDefinition = {
  id: UIColorThemeId;
  name: string;
  lightBackground: string;
  darkBackground: string;
  light: UIColorThemeCSSVariables;
  dark: UIColorThemeCSSVariables;
};

export const UI_COLOR_THEMES: UIColorThemeDefinition[] = [
  {
    id: "default",
    name: "Default",
    lightBackground: "#ffffff",
    darkBackground: "#121212",
    light: {},
    dark: {},
  },
  {
    id: "sunset",
    name: "Sunset",
    lightBackground: "#fff6f0",
    darkBackground: "#1a1218",
    light: {
      "--color-primary": "#c44d6e",
      "--color-primary-darker": "#a83d5c",
      "--color-primary-darkest": "#8f3350",
      "--color-primary-light": "#ffe0e8",
      "--color-primary-light-darker": "#ffd0dc",
      "--color-primary-hover": "#b84462",
      "--color-selection": "#c44d6e",
      "--color-logo-icon": "#c44d6e",
      "--color-logo-text": "#5c1830",
      "--color-surface-high": "#ffe8dc",
      "--color-surface-mid": "#fff0e8",
      "--color-surface-low": "#ffe4d6",
      "--color-surface-lowest": "#fffaf6",
      "--color-on-surface": "#3d1f28",
      "--color-brand-hover": "#b84462",
      "--color-on-primary-container": "#5c1830",
      "--color-surface-primary-container": "#ffd8e4",
      "--color-brand-active": "#a83d5c",
      "--color-border-outline": "#9a6b78",
      "--color-border-outline-variant": "#e8c4b8",
      "--default-bg-color": "#fff6f0",
      "--island-bg-color": "#fffaf6",
      "--island-bg-color-alt": "#fff6f0",
      "--input-bg-color": "#fffaf6",
      "--input-hover-bg-color": "#ffe8dc",
      "--input-border-color": "#e8c4b8",
      "--popup-secondary-bg-color": "#ffe8dc",
      "--button-gray-1": "#ffe8dc",
      "--button-gray-2": "#f5d4c4",
      "--button-gray-3": "#e8c4b8",
      "--link-color": "#b84462",
      "--link-color-hover": "#a83d5c",
      "--link-color-active": "#8f3350",
      "--select-highlight-color": "#f4a574",
      "--focus-highlight-color": "#f4c49a",
      "--color-promo": "#c44d6e",
      "--color-primary-contrast-offset": "#b84462",
    },
    dark: {
      "--color-primary": "#f4a574",
      "--color-primary-darker": "#f8b88a",
      "--color-primary-darkest": "#fcc89e",
      "--color-primary-light": "#4a3540",
      "--color-primary-light-darker": "#3d2a35",
      "--color-primary-hover": "#f8b88a",
      "--color-selection": "#d4586a",
      "--color-logo-icon": "#f4a574",
      "--color-logo-text": "#ffe0d0",
      "--color-surface-high": "#3d2a35",
      "--color-surface-mid": "#2e2228",
      "--color-surface-low": "#261c22",
      "--color-surface-lowest": "#1a1218",
      "--color-on-surface": "#f5e6e0",
      "--color-brand-hover": "#f8b88a",
      "--color-on-primary-container": "#ffe0d0",
      "--color-surface-primary-container": "#4a3540",
      "--color-brand-active": "#fcc89e",
      "--color-border-outline": "#9a7a88",
      "--color-border-outline-variant": "#4a3540",
      "--default-bg-color": "#1a1218",
      "--island-bg-color": "#261c22",
      "--island-bg-color-alt": "#2e2228",
      "--input-bg-color": "#1a1218",
      "--input-hover-bg-color": "#2e2228",
      "--input-border-color": "#4a3540",
      "--popup-secondary-bg-color": "#2e2228",
      "--button-gray-1": "#3d2a35",
      "--button-gray-2": "#2e2228",
      "--button-gray-3": "#261c22",
      "--link-color": "#f4a574",
      "--link-color-hover": "#f8b88a",
      "--link-color-active": "#fcc89e",
      "--select-highlight-color": "#d4586a",
      "--focus-highlight-color": "#c44d6e",
      "--color-promo": "#f4a574",
      "--color-primary-contrast-offset": "#f8b88a",
    },
  },
];

export const DEFAULT_UI_COLOR_THEME_ID: UIColorThemeId = "default";

export const getUIColorThemeById = (
  id: UIColorThemeId,
): UIColorThemeDefinition => {
  return UI_COLOR_THEMES.find((theme) => theme.id === id) ?? UI_COLOR_THEMES[0];
};

export const isUIColorThemeId = (value: string): value is UIColorThemeId => {
  return UI_COLOR_THEMES.some((theme) => theme.id === value);
};
