import { state } from "./state.js";
import { el } from "./dom.js";
import { storageGet, storageSet } from "./storage.js";
import { t } from "./text.js";

export const THEME_KEY = "theme";
export const THEME_PREFS = ["light", "dark", "system"];
const THEME_ICONS = { light: "☀", dark: "☾", system: "◐" };
const THEME_COLORS = { light: "#f3f4f6", dark: "#131519" };
let darkQuery = null;

function resolveThemePref() {
  const saved = storageGet(THEME_KEY);
  return saved === "light" || saved === "dark" ? saved : "system";
}

function resolvedTheme() {
  if (state.themePref !== "system") return state.themePref;
  return darkQuery.matches ? "dark" : "light";
}

function applyTheme() {
  const theme = resolvedTheme();
  document.documentElement.setAttribute("data-theme", theme);
  el("themeColor").content = THEME_COLORS[theme];
  const buttons = document.querySelectorAll("[data-theme-pref]");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].setAttribute(
      "aria-pressed",
      buttons[i].getAttribute("data-theme-pref") === state.themePref ? "true" : "false",
    );
  }
}

export function setTheme(pref) {
  if (THEME_PREFS.indexOf(pref) < 0) return;
  state.themePref = pref;
  storageSet(THEME_KEY, pref);
  applyTheme();
}

export function themePicker() {
  return (
    '<span class="themesel" role="group" aria-label="' +
    t("theme.label") +
    '">' +
    THEME_PREFS.map(function (p) {
      const label = t("theme." + p);
      return (
        '<button type="button" class="themebtn" data-theme-pref="' +
        p +
        '" title="' +
        label +
        '" aria-label="' +
        label +
        '" aria-pressed="' +
        (p === state.themePref ? "true" : "false") +
        '">' +
        THEME_ICONS[p] +
        "</button>"
      );
    }).join("") +
    "</span>"
  );
}

// The pre-paint snippet in the page has already applied the saved theme.
export function initTheme() {
  darkQuery = matchMedia("(prefers-color-scheme: dark)");
  state.themePref = resolveThemePref();
  darkQuery.addEventListener("change", function () {
    if (state.themePref === "system") applyTheme();
  });
}
