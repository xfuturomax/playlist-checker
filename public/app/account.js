// The account menu in the top bar: Sign out and Reset, and the closing rules
// the browser's disclosure element does not have on its own. Wired once for
// the page, since the bar is redrawn with every screen.

import { state } from "./state.js";
import { el } from "./dom.js";
import { cacheDrop, clearCache } from "./lastfm-cache.js";
import { PICKS_KEY } from "./picks.js";
import { playlistsCacheKey } from "./screens/playlists.js";
import { screenSetup } from "./screens/setup.js";
import { SIGNIN_STATE_KEY, VERIFIER_KEY } from "./spotify.js";
import { sessionTake, storageDrop } from "./storage.js";
import { t } from "./text.js";

const SPOTIFY_APPS_URL = "https://www.spotify.com/account/apps/";

// Ends the Spotify session in this browser and keeps everything needed to
// sign in again. The Last.fm details stay; Reset is the way to remove them.
async function signOut() {
  if (state.me) await cacheDrop("meta", playlistsCacheKey());
  storageDrop("sp_token");
  storageDrop(PICKS_KEY);
  sessionTake(SIGNIN_STATE_KEY);
  sessionTake(VERIFIER_KEY);
  state.token = null;
  state.me = null;
  state.playlists = [];
  state.playlistsLoaded = false;
  state.picked.clear();
  state.currentPlaylist = null;
  state.albumCache.clear();
  screenSetup({ key: "signOut.notice", link: { href: SPOTIFY_APPS_URL, label: "signOut.revoke" } }, "signin");
}

async function reset() {
  await clearCache();
  localStorage.clear();
  location.href = state.redirectUri;
}

function resetEntry() {
  return '<button type="button" class="danger" data-acct="reset">' + t("playlists.reset") + "</button>";
}

// Reset erases everything, so it asks first, in place; focus lands on Cancel
// so a stray Enter erases nothing.
function askReset() {
  el("acctReset").innerHTML =
    '<span class="acct-q">' +
    t("nav.resetQuestion") +
    "</span>" +
    '<button type="button" class="danger" data-acct="resetConfirm">' +
    t("nav.resetConfirm") +
    "</button>" +
    '<button type="button" data-acct="resetCancel">' +
    t("nav.resetCancel") +
    "</button>";
  el("acctReset").querySelector('[data-acct="resetCancel"]').focus();
}

function asking() {
  return !!(el("acctReset") && el("acctReset").querySelector('[data-acct="resetConfirm"]'));
}

function keepReset(focus) {
  if (!asking()) return;
  el("acctReset").innerHTML = resetEntry();
  if (focus) el("acctReset").querySelector("button").focus();
}

function closeMenu(focusName) {
  const menu = el("acct");
  if (!menu || !menu.open) return;
  menu.open = false;
  if (focusName) menu.querySelector("summary").focus();
}

const ACTIONS = {
  signOut: function () {
    closeMenu(false);
    signOut();
  },
  reset: askReset,
  resetConfirm: reset,
  resetCancel: function () {
    keepReset(true);
  },
};

export function initAccountMenu() {
  document.addEventListener("click", function (e) {
    const menu = el("acct");
    if (menu && menu.open && !menu.contains(e.target)) closeMenu(false);
    const action = e.target && e.target.closest ? e.target.closest("[data-acct]") : null;
    if (action) ACTIONS[action.getAttribute("data-acct")]();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (asking()) return keepReset(true);
    closeMenu(true);
  });
  // Only a move to something else on the page closes it: a click that does
  // not focus its target (Safari's buttons) must still reach the entry.
  document.addEventListener("focusout", function (e) {
    const menu = el("acct");
    if (menu && menu.open && menu.contains(e.target) && e.relatedTarget && !menu.contains(e.relatedTarget)) {
      closeMenu(false);
    }
  });
  // Toggle does not bubble; captured here, closing however it happens.
  document.addEventListener(
    "toggle",
    function (e) {
      if (e.target.id === "acct" && !e.target.open) keepReset(false);
    },
    true,
  );
}
