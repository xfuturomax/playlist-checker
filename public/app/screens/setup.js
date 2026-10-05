import { state } from "../state.js";
import { writeAddress } from "../address.js";
import { el, esc, toast } from "../dom.js";
import { isBusy, isKeyRefusal } from "../lastfm.js";
import { clearCache } from "../lastfm-cache.js";
import { masthead } from "../layout.js";
import { exportSettings, importSettings } from "../settings-file.js";
import { login } from "../spotify.js";
import { storageDrop, storageGet, storageSet } from "../storage.js";
import { t } from "../text.js";

// Three steps. Which one opens is decided by what is present and valid, never
// by a stored position: after an import, or after a key stops working, a
// stored position would describe a state that no longer exists.

const SETUP_STEPS = ["spotify", "lastfm", "signin"];
const CLIENT_ID_RE = /^[0-9a-f]{32}$/i;
export const DRAFT_KEY = "setup_draft";
const KEY_BAD_KEY = "lfm_key_bad";
let setupStep = null;
let setupBusy = false;

export function draftGet() {
  try {
    return JSON.parse(storageGet(DRAFT_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function draftSet(patch) {
  const draft = draftGet();
  Object.keys(patch).forEach(function (k) {
    draft[k] = patch[k];
  });
  storageSet(DRAFT_KEY, JSON.stringify(draft));
}

function keyMarkedBad() {
  return storageGet(KEY_BAD_KEY) === "1";
}

export function markKeyBad(bad) {
  if (bad) storageSet(KEY_BAD_KEY, "1");
  else storageDrop(KEY_BAD_KEY);
}

export function firstMissingStep() {
  if (!CLIENT_ID_RE.test(state.cfg.clientId)) return "spotify";
  if (!state.cfg.lfmUser || !state.cfg.lfmKey || keyMarkedBad()) return "lastfm";
  return "signin";
}

// A step in the address is a request, not an instruction. Asking for a step
// beyond what the stored credentials allow — a link to the Last.fm step with
// no Client ID, or a stale address after an import or a key that stopped
// working — opens the first step that is actually missing instead, and the
// address is corrected to say so.
function reachableStep(step) {
  const missing = firstMissingStep();
  const wanted = SETUP_STEPS.indexOf(step);
  if (wanted === -1) return missing;
  return wanted <= SETUP_STEPS.indexOf(missing) ? step : missing;
}

function copyRow() {
  return (
    '<div class="copyrow"><code>' +
    esc(state.redirectUri) +
    "</code>" +
    '<button type="button" class="btn" id="copyRedirect">' +
    t("setup.copy") +
    "</button></div>"
  );
}

export function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      function () {
        toast(t("setup.copied"));
      },
      function () {
        toast(t("setup.copyFailed"));
      },
    );
    return;
  }
  toast(t("setup.copyFailed"));
}

function field(id, label, value) {
  return (
    '<label for="' +
    id +
    '">' +
    label +
    "</label>" +
    '<input type="text" id="' +
    id +
    '" value="' +
    esc(value) +
    '" autocomplete="off" autocapitalize="off" spellcheck="false">'
  );
}

// msg: { key, vars } for app texts or { text } for texts from Spotify.
export function screenSetup(msg, step) {
  state.screenSeq++;
  state.bar.classList.remove("on");
  setupStep = reachableStep(step);
  // The guide owns its address, and writing the step actually shown is what
  // corrects an address that asked for one the visitor cannot reach yet.
  writeAddress({ screen: "setup", step: setupStep }, false);
  const text = msg ? (msg.key ? t(msg.key, msg.vars) : msg.text) : "";
  state.rerender = function () {
    saveDraft();
    screenSetup(msg, setupStep);
  };

  const titles = {
    spotify: t("setup.stepSpotify"),
    lastfm: t("setup.stepLastfm"),
    signin: t("setup.signIn"),
  };
  const draft = draftGet();
  // Signed in, the bar shows Playlists instead and nothing is highlighted.
  let html = masthead(
    t("setup.title"),
    t("setup.step", { n: SETUP_STEPS.indexOf(setupStep) + 1, total: SETUP_STEPS.length }) +
      " · " +
      esc(titles[setupStep]),
    "",
    "setup",
  );

  if (text) {
    html +=
      '<div class="notice">' +
      esc(text) +
      (msg.link
        ? ' <a href="' +
          esc(msg.link.href) +
          '" target="_blank" rel="nofollow noopener noreferrer">' +
          esc(t(msg.link.label)) +
          "</a>"
        : "") +
      "</div>";
  }

  if (setupStep === "spotify") {
    html +=
      '<ol class="steps">' +
      "<li>" +
      t("setup.spotify1") +
      ' <a href="https://developer.spotify.com/dashboard" target="_blank" rel="nofollow noopener noreferrer">' +
      t("setup.linkSpotifyApp") +
      "</a></li>" +
      "<li>" +
      t("setup.spotify2") +
      "</li>" +
      "<li>" +
      t("setup.redirectNotice") +
      copyRow() +
      "</li>" +
      "<li>" +
      t("setup.spotify4") +
      "</li></ol>" +
      field("f_clientId", "Spotify Client ID", draft.clientId != null ? draft.clientId : state.cfg.clientId) +
      '<p><button class="btn primary" id="stepNext">' +
      t("setup.continue") +
      "</button></p>" +
      '<p class="fineprint">' +
      t("setup.ownApp") +
      " " +
      t("setup.storedLocally") +
      "</p>";
  } else if (setupStep === "lastfm") {
    html +=
      '<ol class="steps"><li>' +
      t("setup.lastfm1") +
      ' <a href="https://www.last.fm/api/account/create" target="_blank" rel="nofollow noopener noreferrer">' +
      t("setup.linkLfmKey") +
      "</a></li>" +
      "<li>" +
      t("setup.lastfm2") +
      ' <a href="https://www.last.fm/api/accounts" target="_blank" rel="nofollow noopener noreferrer">' +
      t("setup.linkLfmKeys") +
      "</a></li></ol>" +
      field("f_lfmUser", t("setup.lfmUser"), draft.lfmUser != null ? draft.lfmUser : state.cfg.lfmUser) +
      field("f_lfmKey", t("setup.lfmKey"), draft.lfmKey != null ? draft.lfmKey : state.cfg.lfmKey) +
      '<p><button class="btn" id="stepBack">' +
      t("setup.back") +
      "</button> " +
      '<button class="btn primary" id="stepNext">' +
      t("setup.continue") +
      "</button></p>" +
      '<p class="fineprint">' +
      t("setup.storedLocally") +
      "</p>";
  } else {
    html +=
      '<div class="notice">' +
      t("setup.redirectHint") +
      copyRow() +
      "</div>" +
      '<p><button class="btn" id="stepBack">' +
      t("setup.back") +
      "</button> " +
      '<button class="btn primary" id="signIn">' +
      t("setup.submit") +
      "</button></p>";
  }

  html +=
    '<p class="fineprint"><a href="#" id="exportCfg">' +
    t("setup.exportSettings") +
    "</a> · " +
    '<a href="#" id="importCfg">' +
    t("setup.importSettings") +
    "</a>" +
    '<input type="file" id="importFile" accept="application/json,.json" hidden></p>';

  state.view.innerHTML = html;
  wireSetup();
}

export function saveDraft() {
  const patch = {};
  ["clientId", "lfmUser", "lfmKey"].forEach(function (name) {
    const input = el("f_" + (name === "clientId" ? "clientId" : name));
    if (input) patch[name] = input.value;
  });
  if (Object.keys(patch).length) draftSet(patch);
}

function wireSetup() {
  ["f_clientId", "f_lfmUser", "f_lfmKey"].forEach(function (id) {
    const input = el(id);
    // Saved as it is typed: the next step is on the Spotify dashboard, and
    // coming back should not mean starting over.
    if (input) input.oninput = saveDraft;
  });

  const copy = el("copyRedirect");
  if (copy)
    copy.onclick = function () {
      copyText(state.redirectUri);
    };

  const back = el("stepBack");
  if (back)
    back.onclick = function () {
      saveDraft();
      screenSetup(null, SETUP_STEPS[Math.max(0, SETUP_STEPS.indexOf(setupStep) - 1)]);
    };

  const next = el("stepNext");
  if (next) next.onclick = advanceSetup;

  const signIn = el("signIn");
  if (signIn)
    signIn.onclick = function () {
      login();
    };

  el("exportCfg").onclick = function (e) {
    e.preventDefault();
    exportSettings();
  };
  el("importCfg").onclick = function (e) {
    e.preventDefault();
    el("importFile").click();
  };
  el("importFile").onchange = function (e) {
    importSettings(e.target.files && e.target.files[0]);
  };
}

// The only credential that can be verified without leaving the page.
// Resolves to "ok", "refused" or "busy".
async function checkLfmKey(key) {
  const query = new URLSearchParams({ method: "artist.getInfo", artist: "Radiohead" });
  try {
    const res = await fetch("/lastfm?" + query.toString(), {
      cache: "no-store",
      headers: { "x-lastfm-key": key },
    });
    const data = await res.json().catch(function () {
      return {};
    });
    if (isBusy(res, data)) return "busy";
    return !isKeyRefusal(data) && data.artist ? "ok" : "refused";
  } catch (e) {
    return "refused";
  }
}

async function advanceSetup() {
  if (setupBusy) return;
  saveDraft();

  if (setupStep === "spotify") {
    const id = el("f_clientId").value.trim();
    if (!id) return toast(t("setup.needClientId"));
    // Checked here so a mis-paste is caught before a trip through Spotify.
    if (!CLIENT_ID_RE.test(id)) return toast(t("setup.clientIdBad"));
    state.cfg.clientId = id;
    localStorage.setItem("sp_client_id", id);
    return screenSetup(null, "lastfm");
  }

  const user = el("f_lfmUser").value.trim();
  const key = el("f_lfmKey").value.trim();
  if (!user) return toast(t("setup.needLfmUser"));
  if (!key) return toast(t("setup.needLfmKey"));

  const button = el("stepNext");
  setupBusy = true;
  button.textContent = t("setup.checking");
  const verdict = await checkLfmKey(key);
  setupBusy = false;
  button.textContent = t("setup.continue");
  if (verdict === "busy") return toast(t("err.lfmBusy"));
  if (verdict !== "ok") return toast(t("setup.keyRefused"));

  // Cached play counts belong to the username they were fetched for.
  if (state.cfg.lfmUser && state.cfg.lfmUser !== user) await clearCache();
  state.cfg.lfmUser = user;
  state.cfg.lfmKey = key;
  localStorage.setItem("lfm_user", user);
  localStorage.setItem("lfm_key", key);
  markKeyBad(false);
  storageDrop(DRAFT_KEY);
  screenSetup(null, "signin");
}

// Last.fm stopped accepting the key while the app was in use. Silently
// reporting every artist as unfamiliar would be worse than an error.
export function keyRefusedDuringUse() {
  markKeyBad(true);
  state.cacheBypass = false;
  screenSetup({ key: "err.lfmKeyRefused" }, "lastfm");
}

export function isKeyRefusalError(err) {
  return !!err && err.i18nKey === "err.lfmKeyRefused";
}
