// Start-up: the only module that does anything when loaded. Every other
// module only declares; this one wires them up in order.

import { initState, state } from "./state.js";
import { initActionBar } from "./actions.js";
import { initAccountMenu } from "./account.js";
import { decideScreen, parseAddress, readAddress, writeAddress } from "./address.js";
import { applyStaticTexts, screenChecking, setLang } from "./layout.js";
import { openLegal } from "./legal.js";
import { openAbout, setupNotBegun } from "./screens/about.js";
import { saveDraft } from "./screens/setup.js";
import { handleSignInReturn, takeSignInReturn } from "./spotify.js";
import { resolveLang } from "./text.js";
import { initTheme, setTheme } from "./theme.js";

function isPlainClick(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

// The bar's links and Settings: real links, so a new tab or a copied address
// still work; a plain click stays in the page and adds a history step.
function followNav(href) {
  const route = parseAddress(href, "");
  if (route.screen === "about") return openAbout();
  // Whatever was typed into the guide stays as its progress.
  saveDraft();
  writeAddress(route, true);
  decideScreen(route);
}

function initPageListeners() {
  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "langSel") setLang(e.target.value);
  });
  // Delegated: the bar is rebuilt on every screen change and language switch.
  document.addEventListener("click", function (e) {
    const nav = e.target && e.target.closest ? e.target.closest("[data-nav]") : null;
    if (nav && isPlainClick(e)) {
      e.preventDefault();
      return followNav(nav.getAttribute("href"));
    }
    const legal = e.target && e.target.closest ? e.target.closest("[data-legal]") : null;
    if (legal && isPlainClick(e)) {
      e.preventDefault();
      return openLegal(legal.getAttribute("data-legal"));
    }
    const btn = e.target && e.target.closest ? e.target.closest("[data-theme-pref]") : null;
    if (btn) setTheme(btn.getAttribute("data-theme-pref"));
  });
  window.addEventListener("popstate", function () {
    decideScreen(readAddress());
  });
}

initState();
state.lang = resolveLang();
initTheme();
initActionBar();
initPageListeners();
initAccountMenu();
applyStaticTexts();

const signInReturn = takeSignInReturn();

(async function () {
  // A first-time visitor on an old address has nothing here to lose.
  if (state.site.moved && setupNotBegun()) {
    return location.replace(
      "https://" + state.site.primary + location.pathname + location.search + location.hash,
    );
  }

  if (signInReturn) screenChecking(null);
  if (await handleSignInReturn(signInReturn)) return;
  decideScreen(readAddress());
})();
