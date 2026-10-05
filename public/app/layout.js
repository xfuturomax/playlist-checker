import { state } from "./state.js";
import { buildTargetCombo } from "./actions.js";
import { followLanguage } from "./address.js";
import { el, esc } from "./dom.js";
import { renderFooter, renderMoved } from "./legal.js";
import { storageGet, storageSet } from "./storage.js";
import { I18N, LANG_KEY, hasLanguage, langPicker, t } from "./text.js";
import { themePicker } from "./theme.js";

const BAR_TEXTS = {
  doRemove: "bar.remove",
  doAddHere: "bar.addHere",
  doAdd: "bar.add",
  doMove: "bar.move",
  doSave: "bar.save",
  doClear: "bar.clear",
};

// The same bar on every screen; only the highlighted item changes. current:
// "setup", "list", "about" or null. signedIn decides Setup or Playlists and
// where the product name leads; account is the signed-in Spotify account
// when this tab already knows it.
export function topBar(current, signedIn, account) {
  function item(nav, href, label) {
    return (
      '<a href="' +
      href +
      '" data-nav="' +
      nav +
      '"' +
      (nav === current ? ' aria-current="page"' : "") +
      ">" +
      label +
      "</a>"
    );
  }
  return (
    '<header class="topbar">' +
    '<a class="brand" href="' +
    (signedIn ? "/" : "/about") +
    '" data-nav="home">' +
    esc(I18N.product) +
    "</a>" +
    '<nav class="tb-nav" aria-label="' +
    t("nav.label") +
    '">' +
    (signedIn ? item("list", "/", t("playlists.title")) : item("setup", "/setup", t("setup.title"))) +
    item("about", "/about", t("about.link")) +
    "</nav>" +
    (account ? accountMenu(account) : "") +
    '<span class="tb-prefs">' +
    langPicker() +
    themePicker() +
    "</span></header>"
  );
}

// A disclosure rather than an application menu: its entries are ordinary
// links and buttons reached with Tab. The account module closes it and
// handles the entries.
function accountMenu(account) {
  return (
    '<details class="acct" id="acct">' +
    "<summary>" +
    esc(account.display_name || account.id) +
    "</summary>" +
    '<div class="acct-panel" role="group" aria-label="' +
    t("nav.account") +
    '">' +
    '<a href="/setup/spotify" data-nav="settings">' +
    t("playlists.settings") +
    "</a>" +
    '<button type="button" data-acct="signOut">' +
    t("playlists.signOut") +
    "</button>" +
    '<span id="acctReset"><button type="button" class="danger" data-acct="reset">' +
    t("playlists.reset") +
    "</button></span></div></details>"
  );
}

// The bar, then the screen's own header: its title as the page's main
// heading, a line of details and the screen's actions. Without a title only
// the bar is drawn. Every screen draws one, so this is where the tab title
// returns to the product name; the start screen and the legal screens then set
// their own.
export function masthead(titleHtml, metaHtml, actionHtml, current) {
  document.title = I18N.product;
  const bar = topBar(current || null, !!storageGet("sp_token"), state.me);
  if (!titleHtml) return bar;
  return (
    bar +
    '<div class="masthead"><h1>' +
    titleHtml +
    "</h1>" +
    (metaHtml ? '<span class="meta">' + metaHtml + "</span>" : "") +
    (actionHtml || "") +
    "</div>"
  );
}

// Shown while the sign-in is checked or completed, so the bar never vanishes.
export function screenChecking(current) {
  state.rerender = function () {
    screenChecking(current);
  };
  state.view.innerHTML =
    masthead("", "", "", current) + '<div class="state">' + t("common.loading") + "</div>";
}

export function applyStaticTexts() {
  document.documentElement.lang = state.lang;
  Object.keys(BAR_TEXTS).forEach(function (id) {
    el(id).textContent = t(BAR_TEXTS[id]);
  });
  buildTargetCombo();
  el("pickedN").textContent = t("bar.picked", { n: state.picked.size });
  renderMoved();
  renderFooter();
}

// Without redrawing the screen: for start-up and back or forward, where the
// screen is drawn next anyway.
export function useLang(code) {
  state.lang = code;
  storageSet(LANG_KEY, code);
  applyStaticTexts();
}

export function setLang(code) {
  if (!hasLanguage(code)) return;
  useLang(code);
  if (state.rerender) state.rerender();
  followLanguage();
}
