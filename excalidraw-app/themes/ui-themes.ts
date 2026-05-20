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
    light: {},
    dark: {},
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
