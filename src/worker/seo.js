// What crawlers and link previewers read: head tags, the robots file, the
// sitemap and the text served inside the page for readers that do not run
// scripts. The public pages (start screen, Privacy, Terms) are served in the
// language their address names; every other address gets the English start
// screen.

import { esc } from "../../public/app/html.js";
import { DICTIONARIES, LANGUAGES, LEGAL_PAGES, PRODUCT_NAME } from "../../public/app/i18n.js";
import { legalDate, legalPlaceholders, publicPageAddress, publicPageTitle } from "../../public/app/pages.js";

// The form link previewers expect, which differs from the page's language code.
const PREVIEW_LOCALES = {
  en: "en_US",
  es: "es_ES",
  "pt-BR": "pt_BR",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  pl: "pl_PL",
  tr: "tr_TR",
  ja: "ja_JP",
  ru: "ru_RU",
};

const PUBLIC_PAGES = ["", ...Object.keys(LEGAL_PAGES)];

// Texts in a language, escaped for HTML. Values put into placeholders are
// expected to be escaped already.
function htmlText(lang) {
  const dict = DICTIONARIES[lang];
  return (key, vars) => {
    let s = esc(dict[key] ?? DICTIONARIES.en[key]);
    for (const [name, value] of Object.entries(vars || {})) s = s.split("{" + name + "}").join(value);
    return s;
  };
}

// The page's language versions, with English also standing in for languages
// the site does not have.
function alternates(origin, page) {
  const links = LANGUAGES.map(
    ({ code }) =>
      '<link rel="alternate" hreflang="' +
      code +
      '" href="' +
      esc(origin + publicPageAddress(code, page)) +
      '">',
  );
  links.push(
    '<link rel="alternate" hreflang="x-default" href="' + esc(origin + publicPageAddress("en", page)) + '">',
  );
  return links.join("\n");
}

// named: { lang, page } for a public page, or null for any other address,
// which is presented as the English start screen at the site root.
export function headTags(origin, named) {
  const lang = named ? named.lang : "en";
  const page = named ? named.page : "";
  const text = htmlText(lang);
  const address = esc(origin + publicPageAddress(lang, page));
  const title = publicPageTitle(page, text);
  const description = text((page || "about") + ".description");
  const image = esc(origin + "/img/preview.png");
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
    '<meta property="og:locale" content="' +
    PREVIEW_LOCALES[lang] +
    '">\n' +
    '<meta name="description" content="' +
    description +
    '">\n' +
    '<meta property="og:description" content="' +
    description +
    '">\n' +
    '<link rel="canonical" href="' +
    address +
    '">\n' +
    (named ? alternates(origin, page) + "\n" : "") +
    '<meta property="og:url" content="' +
    address +
    '">\n' +
    '<meta property="og:image" content="' +
    image +
    '">\n' +
    '<meta property="og:image:width" content="1200">\n' +
    '<meta property="og:image:height" content="630">\n' +
    '<meta property="og:image:alt" content="' +
    text("about.shot") +
    '">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta name="twitter:image" content="' +
    image +
    '">'
  );
}

// The start screen in every language, built once, for crawlers and previewers
// that read the page without running it. An inline snippet clears it before
// the first paint.
const SERVED_START = Object.fromEntries(
  LANGUAGES.map(({ code }) => {
    const text = htmlText(code);
    const html =
      '<div class="hero"><h2>' +
      text("about.headline") +
      "</h2>" +
      '<p class="lead">' +
      text("about.lead") +
      "</p>" +
      '<ul class="benefits"><li>' +
      text("about.benefit1") +
      "</li><li>" +
      text("about.benefit2") +
      "</li><li>" +
      text("about.benefit3") +
      "</li></ul>" +
      "<h3>" +
      text("about.howTitle") +
      '</h3><p class="how">' +
      text("about.how") +
      "</p>" +
      "<p>" +
      text("about.privacy") +
      '</p><p class="fineprint">' +
      text("about.setupTime") +
      "</p></div>";
    return [code, html];
  }),
);

// A Privacy or Terms text as the app draws it, with the contact and source
// as plain text: the app draws the real links.
function servedLegal(lang, page, site) {
  const text = htmlText(lang);
  const vars = legalPlaceholders(site, text, (href, label) => esc(label));
  const prevails = text("legal.englishPrevails");
  let html = '<div class="legal"><h2>' + text(page + ".title") + "</h2>";
  if (prevails) html += '<div class="notice">' + prevails + "</div>";
  for (let i = 1; i <= LEGAL_PAGES[page]; i++) html += "<p>" + text(page + "." + i, vars) + "</p>";
  return (
    html + '<p class="fineprint">' + text("legal.updated", { date: esc(legalDate(lang)) }) + "</p></div>"
  );
}

export function servedText(named, site) {
  if (named && named.page) return servedLegal(named.lang, named.page, site);
  return SERVED_START[named ? named.lang : "en"];
}

export function robotsTxt(origin) {
  return "User-agent: *\nAllow: /\nSitemap: " + origin + "/sitemap.xml\n";
}

export function sitemapXml(origin) {
  const entries = PUBLIC_PAGES.flatMap((page) => {
    const links = LANGUAGES.map(
      ({ code }) =>
        '<xhtml:link rel="alternate" hreflang="' +
        code +
        '" href="' +
        esc(origin + publicPageAddress(code, page)) +
        '"/>',
    ).join("");
    const fallback =
      '<xhtml:link rel="alternate" hreflang="x-default" href="' +
      esc(origin + publicPageAddress("en", page)) +
      '"/>';
    return LANGUAGES.map(
      ({ code }) =>
        "<url><loc>" + esc(origin + publicPageAddress(code, page)) + "</loc>" + links + fallback + "</url>",
    );
  });
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    entries.join("") +
    "</urlset>\n"
  );
}
