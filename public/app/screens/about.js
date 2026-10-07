import { state } from "../state.js";
import { decideScreen, writeAddress } from "../address.js";
import { el, esc } from "../dom.js";
import { masthead } from "../layout.js";
import { legalLink } from "../legal.js";
import { publicPageTitle } from "../pages.js";
import { draftGet, saveDraft, screenSetup } from "./setup.js";
import { I18N, t } from "../text.js";
import { countView } from "../visits.js";

// Nothing typed anywhere yet. The guide saves its progress on every redraw,
// a language switch included, so a progress record of empty fields says
// nothing about intent; language, theme, cache and session do not count.
export function setupNotBegun() {
  if (state.cfg.clientId || state.cfg.lfmUser || state.cfg.lfmKey) return false;
  const draft = draftGet();
  return !["clientId", "lfmUser", "lfmKey"].some(function (k) {
    return String(draft[k] || "").trim() !== "";
  });
}

export function screenAbout() {
  state.screenSeq++;
  state.bar.classList.remove("on");
  state.rerender = renderAbout;
  renderAbout();
  countView("start");
}

function renderAbout() {
  const fresh = setupNotBegun();
  state.view.innerHTML =
    masthead(esc(I18N.product), "", "", "about") +
    '<div class="hero">' +
    "<h2>" +
    t("about.headline") +
    "</h2>" +
    '<p class="lead">' +
    t("about.lead") +
    "</p>" +
    '<ul class="benefits"><li>' +
    t("about.benefit1") +
    "</li><li>" +
    t("about.benefit2") +
    "</li><li>" +
    t("about.benefit3") +
    "</li></ul>" +
    "<h3>" +
    t("about.howTitle") +
    "</h3>" +
    '<p class="how">' +
    t("about.how") +
    "</p>" +
    '<div class="notice">' +
    legalLink("privacy", t("about.privacy")) +
    "</div>" +
    '<p class="fineprint">' +
    t("about.setupTime") +
    "</p>" +
    '<p><button class="btn primary" id="aboutGo">' +
    t(fresh ? "about.start" : "about.continue") +
    "</button></p>" +
    shot("analysis", 880, 900, t("about.shot")) +
    shot("album", 880, 774, t("about.albumShot")) +
    "</div>";
  document.title = publicPageTitle("", t);

  el("aboutGo").onclick = function () {
    if (setupNotBegun()) {
      writeAddress({ screen: "setup", step: "spotify" }, true);
      return screenSetup(null, "spotify");
    }
    writeAddress({ screen: "list" }, true);
    decideScreen({ screen: "list" });
  };
}

// A light and a dark picture of the app; the theme decides which is shown.
function shot(name, width, height, caption) {
  const img = function (theme) {
    return (
      '<img class="for-' +
      theme +
      '" src="/img/' +
      name +
      "-" +
      theme +
      '.webp" width="' +
      width +
      '" height="' +
      height +
      '" loading="lazy" alt="' +
      caption +
      '">'
    );
  };
  return (
    '<figure class="shot">' + img("light") + img("dark") + "<figcaption>" + caption + "</figcaption></figure>"
  );
}

export function openAbout() {
  // Whatever was typed into the guide stays as its progress.
  saveDraft();
  writeAddress({ screen: "about" }, true);
  screenAbout();
}
