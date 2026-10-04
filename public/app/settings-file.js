import { state } from "./state.js";
import { toast } from "./dom.js";
import { clearCache } from "./lastfm-cache.js";
import { PICKS_KEY } from "./picks.js";
import { DRAFT_KEY, markKeyBad } from "./screens/setup.js";
import { storageDrop, storageSet } from "./storage.js";
import { LANG_KEY, hasLanguage, t } from "./text.js";
import { THEME_KEY, THEME_PREFS } from "./theme.js";

// The Spotify session is deliberately left out: a file in a downloads folder
// holding a long-lived key to someone's library is worse than signing in again.

// Kept from the old product name so files exported before the rename still import.
const SETTINGS_MARK = "scrobble-triage-settings";

export function exportSettings() {
  const payload = {
    kind: SETTINGS_MARK,
    clientId: state.cfg.clientId,
    lfmUser: state.cfg.lfmUser,
    lfmKey: state.cfg.lfmKey,
    lang: state.lang,
    theme: state.themePref,
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "playlist-checker-settings.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 1000);
}

const SETTINGS_MAX_BYTES = 10 * 1024;
const HEX32_RE = /^[0-9a-f]{32}$/i;

// No spaces or control characters.
function plainName(value) {
  if (value.length > 64) return false;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code <= 32 || code === 127) return false;
  }
  return true;
}

// Empty fields come from an export made mid-setup; a missing language or
// theme from older files. Anything else must look exactly like what the app
// itself writes, so a crafted file cannot break the page.
export function validSettings(data) {
  if (!data || typeof data !== "object" || data.kind !== SETTINGS_MARK) return false;
  const fields = ["clientId", "lfmUser", "lfmKey", "lang", "theme"];
  for (let i = 0; i < fields.length; i++) {
    const v = data[fields[i]];
    if (v != null && typeof v !== "string") return false;
  }
  if (data.clientId && !HEX32_RE.test(data.clientId)) return false;
  if (data.lfmKey && !HEX32_RE.test(data.lfmKey)) return false;
  if (data.lfmUser && !plainName(data.lfmUser)) return false;
  if (data.lang && !hasLanguage(data.lang)) return false;
  if (data.theme && THEME_PREFS.indexOf(data.theme) < 0) return false;
  return true;
}

export async function importSettings(file) {
  if (!file) return;
  if (file.size > SETTINGS_MAX_BYTES) return toast(t("setup.importBad"));
  let data = null;
  try {
    data = JSON.parse(await file.text());
  } catch (e) {
    // Not JSON: refused below like any other malformed file.
  }
  if (!validSettings(data)) return toast(t("setup.importBad"));
  if (!confirm(t("setup.importConfirm", { clientId: data.clientId || "—" }))) return;

  state.cfg.clientId = String(data.clientId || "");
  state.cfg.lfmUser = String(data.lfmUser || "");
  state.cfg.lfmKey = String(data.lfmKey || "");
  localStorage.setItem("sp_client_id", state.cfg.clientId);
  localStorage.setItem("lfm_user", state.cfg.lfmUser);
  localStorage.setItem("lfm_key", state.cfg.lfmKey);
  if (data.lang) storageSet(LANG_KEY, data.lang);
  if (data.theme) storageSet(THEME_KEY, data.theme);

  // The previous sign-in belongs to the previous Client ID, and the cached
  // play counts to the previous Last.fm username.
  markKeyBad(false);
  storageDrop(DRAFT_KEY);
  storageDrop("sp_token");
  storageDrop(PICKS_KEY);
  state.token = null;
  await clearCache();
  location.href = state.redirectUri;
}
