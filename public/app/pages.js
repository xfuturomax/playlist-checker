// The public pages (the start screen, Privacy and Terms) have an address in
// every language: English keeps the plain addresses, every other language puts
// its code, in lowercase, in front (/ru, /ru/privacy, /pt-br/terms). Shared by
// the worker and the app, so both agree on which addresses exist and on what
// these pages say.

import { LANGUAGES, LEGAL_UPDATED, PRODUCT_NAME, isLegalPage } from "./i18n.js";

const BY_PREFIX = new Map(LANGUAGES.map((l) => [l.code.toLowerCase(), l.code]));

// page: "" for the start screen, or a legal page. prefixed: the address names
// its language. Variants (case, trailing slashes) read as the plain address.
// "/" is the English start screen; anything that is not a public page is null.
export function readPublicPage(pathname) {
  const parts = pathname.toLowerCase().split("/").filter(Boolean);
  const lang = parts.length > 0 ? BY_PREFIX.get(parts[0]) : undefined;
  const rest = lang ? parts.slice(1) : parts;
  if (rest.length > 1) return null;
  const page = rest.length ? rest[0] : "";
  if (page && !isLegalPage(page)) return null;
  return { lang: lang || "en", page, prefixed: Boolean(lang) };
}

export function publicPageAddress(lang, page) {
  const prefix = lang === "en" ? "" : "/" + lang.toLowerCase();
  if (page) return prefix + "/" + page;
  return prefix || "/";
}

// text(key, vars) gives a translated text in the page's language; the product
// name has nothing to escape.
export function publicPageTitle(page, text) {
  return page ? text(page + ".title") + " — " + PRODUCT_NAME : PRODUCT_NAME + " — " + text("about.headline");
}

export function legalDate(lang) {
  try {
    return new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(
      new Date(LEGAL_UPDATED + "T00:00:00Z"),
    );
  } catch (e) {
    return LEGAL_UPDATED;
  }
}

// What {contact} and {source} stand for in the legal texts: the contact
// address, else the issue tracker; the repository, else the source on request.
// link(href, label) draws a link, or plain text for readers of the served page.
export function legalPlaceholders(site, text, link) {
  let contact = "";
  if (site.contact) contact = link("mailto:" + site.contact, site.contact);
  else if (site.source) contact = link(site.source + "/issues", site.source + "/issues");
  const source = site.source ? link(site.source, site.source) : text("legal.sourceOnRequest", { contact });
  return { contact, source };
}
