import { state } from "./state.js";
import { writeAddress } from "./address.js";
import { el, esc } from "./dom.js";
import { masthead } from "./layout.js";
import { setupNotBegun } from "./screens/about.js";
import { copyText, saveDraft } from "./screens/setup.js";
import { exportSettings } from "./settings-file.js";
import { storageGet, storageSet } from "./storage.js";
import { LEGAL_PAGES } from "./i18n.js";
import { legalDate, legalPlaceholders, publicPageAddress, publicPageTitle } from "./pages.js";
import { t } from "./text.js";

// A real link, so a new tab or a copied address still work; a plain click is
// handled in the page by the delegated listener.
export function legalLink(page, html) {
  return (
    '<a href="' +
    publicPageAddress(state.lang, page) +
    '" data-legal="' +
    page +
    '">' +
    (html || t("legal." + page + "Link")) +
    "</a>"
  );
}

function linkHtml(href, label) {
  const external = href.startsWith("mailto:") ? "" : ' rel="nofollow noopener noreferrer"';
  return '<a href="' + esc(href) + '"' + external + ">" + esc(label) + "</a>";
}

export function renderFooter() {
  const links = [legalLink("privacy"), legalLink("terms")];
  if (state.site.contact)
    links.push('<a href="mailto:' + esc(state.site.contact) + '">' + t("legal.contactLink") + "</a>");
  if (state.site.source)
    links.push(
      '<a href="' +
        esc(state.site.source) +
        '" rel="nofollow noopener noreferrer">' +
        t("legal.sourceLink") +
        "</a>",
    );
  el("foot").innerHTML =
    '<div class="links">' +
    links.join("") +
    "</div>" +
    "<div>" +
    t("legal.poweredBy", {
      link: '<a href="https://www.last.fm" rel="nofollow noopener noreferrer">Last.fm</a>',
    }) +
    " · " +
    t("legal.spotify") +
    "</div>";
}

export function screenLegal(page) {
  state.screenSeq++;
  state.bar.classList.remove("on");
  // Settles a variant such as /Privacy/ on the plain address.
  writeAddress({ screen: "legal", page: page }, false);
  state.rerender = function () {
    renderLegal(page);
  };
  renderLegal(page);
  window.scrollTo(0, 0);
}

function renderLegal(page) {
  // Without a public repository, the AGPL source is offered on request.
  const vars = legalPlaceholders(state.site, t, linkHtml);
  let html = "";
  for (let i = 1; i <= LEGAL_PAGES[page]; i++) html += "<p>" + t(page + "." + i, vars) + "</p>";
  const prevails = t("legal.englishPrevails");
  state.view.innerHTML =
    masthead(t(page + ".title"), t("legal.updated", { date: legalDate(state.lang) }), "", null) +
    '<div class="legal">' +
    (prevails ? '<div class="notice">' + prevails + "</div>" : "") +
    html +
    "</div>";
  document.title = publicPageTitle(page, t);
}

export function openLegal(page) {
  // Whatever was typed into the guide stays as its progress.
  saveDraft();
  writeAddress({ screen: "legal", page: page }, true);
  screenLegal(page);
}

// Shown on an old address to visitors who already set the app up there. The
// order of the steps matters: loading the file leads straight to Spotify
// sign-in, which fails until the new address is in the visitor's Spotify app.

const MOVED_KEY = "moved_notice_hidden";

export function renderMoved() {
  const box = el("moved");
  if (!state.site.moved || setupNotBegun() || storageGet(MOVED_KEY)) {
    box.innerHTML = "";
    return;
  }
  const target = "https://" + state.site.primary + "/";
  const domainLink = '<a href="' + esc(target) + '">' + esc(state.site.primary) + "</a>";
  box.innerHTML =
    '<div class="notice">' +
    t("moved.lead", { domain: domainLink }) +
    '<ol class="steps">' +
    '<li><a href="#" id="movedExport">' +
    t("setup.exportSettings") +
    "</a></li>" +
    "<li>" +
    t("setup.redirectNotice") +
    '<div class="copyrow"><code>' +
    esc(target) +
    "</code>" +
    '<button type="button" class="btn" id="movedCopy">' +
    t("setup.copy") +
    "</button></div></li>" +
    "<li>" +
    t("moved.open", { domain: domainLink }) +
    "</li></ol>" +
    '<button type="button" class="btn" id="movedHide">' +
    t("moved.hide") +
    "</button></div>";
  el("movedExport").onclick = function (e) {
    e.preventDefault();
    exportSettings();
  };
  el("movedCopy").onclick = function () {
    copyText(target);
  };
  el("movedHide").onclick = function () {
    storageSet(MOVED_KEY, "1");
    box.innerHTML = "";
  };
}
