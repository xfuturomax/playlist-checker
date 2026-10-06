import { state } from "./state.js";
import { storageGet, storageSet } from "./storage.js";
import { DICTIONARIES, LANGUAGES, PRODUCT_NAME } from "./i18n.js";

export const I18N = {
  product: PRODUCT_NAME,
  languages: LANGUAGES,
  dictionaries: DICTIONARIES,
};

export const LANG_KEY = "lang";

// Exact locale first ("pt-BR"), then base language ("pt-PT" -> "pt-BR").
function matchLang(code) {
  const wanted = String(code || "").toLowerCase();
  if (!wanted) return null;
  const base = wanted.split("-")[0];
  const langs = I18N.languages;
  for (let i = 0; i < langs.length; i++) {
    if (langs[i].code.toLowerCase() === wanted) return langs[i].code;
  }
  for (let j = 0; j < langs.length; j++) {
    if (langs[j].code.toLowerCase().split("-")[0] === base) return langs[j].code;
  }
  return null;
}

// Own entries only: "constructor" is a property of every object.
export function hasLanguage(code) {
  return Object.prototype.hasOwnProperty.call(I18N.dictionaries, code);
}

// A language named by the address wins over everything and is remembered.
export function resolveLang(named) {
  if (named && hasLanguage(named)) {
    storageSet(LANG_KEY, named);
    return named;
  }
  const saved = storageGet(LANG_KEY);
  if (saved && hasLanguage(saved)) return saved;
  const prefs =
    navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  for (let i = 0; i < prefs.length; i++) {
    const found = matchLang(prefs[i]);
    if (found) return found;
  }
  return "en";
}

export function t(key, vars) {
  const dict = I18N.dictionaries;
  let s = dict[state.lang] && dict[state.lang][key] != null ? dict[state.lang][key] : dict.en[key];
  if (s == null) return key;
  if (typeof s === "object") {
    const category = new Intl.PluralRules(state.lang).select(vars && vars.n != null ? vars.n : 0);
    s = s[category] != null ? s[category] : s.other;
  }
  if (vars) {
    Object.keys(vars).forEach(function (k) {
      s = s.split("{" + k + "}").join(String(vars[k]));
    });
  }
  return s;
}

// App-authored errors keep their key so the setup screen can re-translate them.
export function appError(key) {
  const err = new Error(t(key));
  err.i18nKey = key;
  return err;
}

export function errorMessage(err) {
  return err.i18nKey ? { key: err.i18nKey } : { text: err.message };
}

export function langPicker() {
  return (
    '<select class="langsel" id="langSel" aria-label="' +
    t("lang.label") +
    '">' +
    I18N.languages
      .map(function (l) {
        return (
          '<option value="' +
          l.code +
          '"' +
          (l.code === state.lang ? " selected" : "") +
          ">" +
          l.name +
          "</option>"
        );
      })
      .join("") +
    "</select>"
  );
}
