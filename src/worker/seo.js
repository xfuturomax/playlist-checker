// What crawlers and link previewers read: head tags, the robots file, the
// sitemap and the English text served inside the page for readers that do not
// run scripts.

import { esc } from "../../public/app/html.js";
import { DICTIONARIES, LEGAL_PAGES, LEGAL_UPDATED, PRODUCT_NAME } from "../../public/app/i18n.js";

const TITLE = PRODUCT_NAME + " — " + DICTIONARIES.en["about.headline"];
const DESCRIPTION =
  "See which tracks in a Spotify playlist you have already heard on Last.fm, " +
  "and keep only the new ones. Nothing is stored on the server.";

export function headTags(origin, page) {
  const en = DICTIONARIES.en;
  const root = esc(origin + "/" + (page || ""));
  const title = esc(page ? en[page + ".title"] + " — " + PRODUCT_NAME : TITLE);
  const description = esc(page ? en[page + ".description"] : DESCRIPTION);
  const image = esc(origin + "/img/preview.png");
  const alt = esc(DICTIONARIES.en["about.shot"]);
  return (
    "<title>" +
    title +
    "</title>\n" +
    '<meta property="og:title" content="' +
    title +
    '">\n' +
    '<meta property="og:site_name" content="' +
    esc(PRODUCT_NAME) +
    '">\n' +
    '<meta name="description" content="' +
    description +
    '">\n' +
    '<meta property="og:description" content="' +
    description +
    '">\n' +
    '<link rel="canonical" href="' +
    root +
    '">\n' +
    '<meta property="og:url" content="' +
    root +
    '">\n' +
    '<meta property="og:image" content="' +
    image +
    '">\n' +
    '<meta property="og:image:width" content="1200">\n' +
    '<meta property="og:image:height" content="630">\n' +
    '<meta property="og:image:alt" content="' +
    alt +
    '">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta name="twitter:image" content="' +
    image +
    '">'
  );
}

// The start screen in English, built once, for crawlers and previewers that
// read the page without running it. An inline snippet clears it before the first paint.
export const SERVED_TEXT = (() => {
  const en = (key) => esc(DICTIONARIES.en[key]);
  return (
    '<div class="hero"><h2>' +
    en("about.headline") +
    "</h2>" +
    '<p class="lead">' +
    en("about.lead") +
    "</p>" +
    '<ul class="benefits"><li>' +
    en("about.benefit1") +
    "</li><li>" +
    en("about.benefit2") +
    "</li><li>" +
    en("about.benefit3") +
    "</li></ul>" +
    "<h3>" +
    en("about.howTitle") +
    '</h3><p class="how">' +
    en("about.how") +
    "</p>" +
    "<p>" +
    en("about.privacy") +
    '</p><p class="fineprint">' +
    en("about.setupTime") +
    "</p></div>"
  );
})();

// The Privacy and Terms texts in English, for the same readers. Their links
// are left out: the app draws the real ones.
export const SERVED_LEGAL = Object.fromEntries(
  Object.entries(LEGAL_PAGES).map(([page, count]) => {
    const en = DICTIONARIES.en;
    let html = '<div class="legal"><h2>' + esc(en[page + ".title"]) + "</h2>";
    for (let i = 1; i <= count; i++) {
      html += "<p>" + esc(en[page + "." + i].replace(/\s*\{(contact|source)\}/g, "")) + "</p>";
    }
    html +=
      '<p class="fineprint">' + esc(en["legal.updated"].replace("{date}", LEGAL_UPDATED)) + "</p></div>";
    return [page, html];
  }),
);

export function robotsTxt(origin) {
  return "User-agent: *\nAllow: /\nSitemap: " + origin + "/sitemap.xml\n";
}

export function sitemapXml(origin) {
  const entries = ["", ...Object.keys(LEGAL_PAGES)]
    .map((path) => "<url><loc>" + esc(origin + "/" + path) + "</loc></url>")
    .join("");
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    entries +
    "</urlset>\n"
  );
}
