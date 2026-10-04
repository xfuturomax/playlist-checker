// Start-up: the only module that does anything when loaded. Every other
// module only declares; this one wires them up in order.

import { initState, state } from "./state.js";
import { initActionBar } from "./actions.js";
import { decideScreen, readAddress } from "./address.js";
import { applyStaticTexts, setLang } from "./layout.js";
import { openLegal } from "./legal.js";
import { openAbout, setupNotBegun } from "./screens/about.js";
import { handleSignInReturn, takeSignInReturn } from "./spotify.js";
import { resolveLang } from "./text.js";
import { initTheme, setTheme } from "./theme.js";

function isPlainClick(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

function initPageListeners() {
  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "langSel") setLang(e.target.value);
  });
  // Delegated: the masthead is rebuilt on every screen change and language switch.
  document.addEventListener("click", function (e) {
    // A real link, so a new tab or a copied address still work; a plain click
    // stays in the page.
    const about = e.target && e.target.closest ? e.target.closest("#aboutLink") : null;
    if (about && isPlainClick(e)) {
      e.preventDefault();
      return openAbout();
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
applyStaticTexts();

const signInReturn = takeSignInReturn();

(async function () {
  // A first-time visitor on an old address has nothing here to lose.
  if (state.site.moved && setupNotBegun()) {
    return location.replace(
      "https://" + state.site.primary + location.pathname + location.search + location.hash,
    );
  }

  if (await handleSignInReturn(signInReturn)) return;
  decideScreen(readAddress());
})();
