import { state } from "./state.js";
import { buildTargetCombo } from "./actions.js";
import { el } from "./dom.js";
import { renderFooter, renderMoved } from "./legal.js";
import { storageSet } from "./storage.js";
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

// noAbout: the start screen itself carries no link to itself.
export function masthead(titleHtml, metaHtml, actionHtml, noAbout) {
  // The About link joins the meta line, separated like the links already in it.
  const about = noAbout ? "" : '<a href="/about" id="aboutLink">' + t("about.link") + "</a>";
  const meta = [metaHtml, about].filter(Boolean).join(" · ");
  return (
    '<div class="masthead"><h1>' +
    titleHtml +
    '</h1><span class="mh-side">' +
    (meta ? '<span class="meta">' + meta + "</span>" : "") +
    (actionHtml || "") +
    langPicker() +
    themePicker() +
    "</span></div>"
  );
}

export function applyStaticTexts() {
  document.documentElement.lang = state.lang;
  document.title = I18N.product;
  Object.keys(BAR_TEXTS).forEach(function (id) {
    el(id).textContent = t(BAR_TEXTS[id]);
  });
  buildTargetCombo();
  el("pickedN").textContent = t("bar.picked", { n: state.picked.size });
  renderMoved();
  renderFooter();
}

export function setLang(code) {
  if (!hasLanguage(code)) return;
  state.lang = code;
  storageSet(LANG_KEY, code);
  applyStaticTexts();
  if (state.rerender) state.rerender();
}
