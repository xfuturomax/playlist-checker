import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/worker/index.js";
import { parseAddress } from "../public/app/address.js";
import { DICTIONARIES, LANGUAGES } from "../public/app/i18n.js";
import { legalDate, publicPageAddress, readPublicPage } from "../public/app/pages.js";

const ENV = { PRIMARY_DOMAIN: "playlistchecker.com", CONTACT_EMAIL: "hello@playlistchecker.com" };
const SOURCE = "https://github.com/xfuturomax/playlist-checker";
const ORIGIN = "https://playlistchecker.com";

async function page(path, env = ENV, base = ORIGIN) {
  const res = await worker.fetch(new Request(base + path), env);
  return { res, html: await res.text() };
}

function alternatesOf(html) {
  return [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map(
    (m) => m[1] + " " + m[2],
  );
}

function canonicalOf(html) {
  return html.match(/<link rel="canonical" href="([^"]+)">/)[1];
}

function expectedAlternates(origin, pageName) {
  return [
    ...LANGUAGES.map(({ code }) => code + " " + origin + publicPageAddress(code, pageName)),
    "x-default " + origin + publicPageAddress("en", pageName),
  ];
}

test("public pages are read from their addresses in every language", () => {
  assert.deepEqual(readPublicPage("/"), { lang: "en", page: "", prefixed: false });
  assert.deepEqual(readPublicPage("/privacy"), { lang: "en", page: "privacy", prefixed: false });
  assert.deepEqual(readPublicPage("/ru"), { lang: "ru", page: "", prefixed: true });
  assert.deepEqual(readPublicPage("/DE/Privacy/"), { lang: "de", page: "privacy", prefixed: true });
  assert.deepEqual(readPublicPage("/pt-br/terms"), { lang: "pt-BR", page: "terms", prefixed: true });
  assert.deepEqual(readPublicPage("/en/terms"), { lang: "en", page: "terms", prefixed: true });
  for (const path of ["/about", "/zh/privacy", "/ru/setup", "/ru/privacy/x", "/playlist/abc", "/pt"]) {
    assert.equal(readPublicPage(path), null, path);
  }
  for (const { code } of LANGUAGES) {
    for (const pageName of ["", "privacy", "terms"]) {
      const address = publicPageAddress(code, pageName);
      const expected = { lang: code, page: pageName, prefixed: code !== "en" };
      assert.deepEqual(readPublicPage(address), expected, address);
    }
  }
});

test("no app address is a language code", () => {
  for (const word of ["about", "setup", "playlist", "lastfm", "app", "img"]) {
    assert.ok(!LANGUAGES.some(({ code }) => code.toLowerCase() === word), word);
  }
});

test("the app reads the language from the address", () => {
  assert.deepEqual(parseAddress("/ru", ""), { screen: "about", lang: "ru" });
  assert.deepEqual(parseAddress("/JA/Terms/", ""), { screen: "legal", page: "terms", lang: "ja" });
  assert.deepEqual(parseAddress("/privacy", ""), { screen: "legal", page: "privacy" });
  assert.deepEqual(parseAddress("/", ""), { screen: "list" });
  assert.deepEqual(parseAddress("/about", ""), { screen: "about" });
  assert.deepEqual(parseAddress("/ru/setup", ""), { screen: "list" });
});

test("a language start screen is served in its language with its own preferred address", async () => {
  const { html } = await page("/ja");
  assert.match(html, /<html lang="ja">/);
  assert.ok(html.includes("<title>Playlist Checker — " + DICTIONARIES.ja["about.headline"] + "</title>"));
  assert.ok(
    html.includes('<meta name="description" content="' + DICTIONARIES.ja["about.description"] + '">'),
  );
  assert.ok(html.includes('<meta property="og:locale" content="ja_JP">'));
  assert.ok(html.includes("<h2>" + DICTIONARIES.ja["about.headline"] + "</h2>"));
  assert.equal(canonicalOf(html), ORIGIN + "/ja");
  assert.deepEqual(alternatesOf(html), expectedAlternates(ORIGIN, ""));
});

test("the root stays English and names its language versions", async () => {
  const { html } = await page("/");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>Playlist Checker — Find what’s new in any playlist<\/title>/);
  assert.ok(html.includes('<meta property="og:locale" content="en_US">'));
  assert.equal(canonicalOf(html), ORIGIN + "/");
  assert.deepEqual(alternatesOf(html), expectedAlternates(ORIGIN, ""));
});

test("app addresses name the root and no language versions", async () => {
  for (const path of ["/about", "/playlist/abc", "/setup/lastfm", "/zh/privacy", "/ru/setup"]) {
    const { html } = await page(path);
    assert.match(html, /<html lang="en">/, path);
    assert.equal(canonicalOf(html), ORIGIN + "/", path);
    assert.deepEqual(alternatesOf(html), [], path);
    assert.ok(html.includes("<h2>Find what’s new in any playlist</h2>"), path);
  }
});

test("a variant of a language address names the plain one", async () => {
  const { html } = await page("/DE/Privacy/?x=1");
  assert.match(html, /<html lang="de">/);
  assert.equal(canonicalOf(html), ORIGIN + "/de/privacy");
  assert.ok(html.includes("<title>" + DICTIONARIES.de["privacy.title"] + " — Playlist Checker</title>"));
  assert.deepEqual(alternatesOf(html), expectedAlternates(ORIGIN, "privacy"));
});

test("every public page names the same versions", async () => {
  for (const pageName of ["", "privacy", "terms"]) {
    for (const { code } of LANGUAGES) {
      const { html } = await page(publicPageAddress(code, pageName));
      assert.deepEqual(alternatesOf(html), expectedAlternates(ORIGIN, pageName), code + " " + pageName);
    }
  }
});

function servedLegal(html) {
  const start = html.indexOf('<div class="legal">');
  return html.slice(start, html.indexOf("</div>\n", start));
}

test("translated legal text is complete as the app shows it", async () => {
  const cases = [
    { env: { ...ENV, SOURCE_URL: SOURCE }, contact: "hello@playlistchecker.com", source: SOURCE },
    {
      env: { PRIMARY_DOMAIN: "playlistchecker.com", SOURCE_URL: SOURCE },
      contact: SOURCE + "/issues",
      source: SOURCE,
    },
    { env: ENV, contact: "hello@playlistchecker.com", onRequest: true },
  ];
  for (const { env, contact, source, onRequest } of cases) {
    for (const { code } of LANGUAGES) {
      const dict = DICTIONARIES[code];
      const text = servedLegal((await page(publicPageAddress(code, "terms"), env)).html);
      assert.ok(!text.includes("{"), code + ": no placeholder left");
      assert.ok(!text.includes("<a "), code + ": no links");
      assert.ok(text.includes("<h2>" + dict["terms.title"] + "</h2>"), code);
      if (dict["legal.englishPrevails"]) assert.ok(text.includes(dict["legal.englishPrevails"]), code);
      assert.ok(text.includes(dict["legal.updated"].replace("{date}", legalDate(code))), code + ": date");
      assert.ok(text.includes(dict["terms.6"].replace("{contact}", contact)), code + ": contact");
      const expectedSource = onRequest ? dict["legal.sourceOnRequest"].replace("{contact}", contact) : source;
      assert.ok(text.includes(dict["terms.5"].replace("{source}", expectedSource)), code + ": source");
    }
  }
});

test("English-prefixed addresses redirect once to the plain ones, without sign-in values", async () => {
  const cases = [
    ["https://playlistchecker.com/en", "https://playlistchecker.com/", 301],
    ["https://playlistchecker.com/EN/Privacy/?code=x&f=1", "https://playlistchecker.com/privacy?f=1", 301],
    ["https://www.playlistchecker.com/EN/terms/", "https://playlistchecker.com/terms", 301],
    ["http://playlistchecker.com/en/terms", "https://playlistchecker.com/terms", 308],
  ];
  for (const [from, to, status] of cases) {
    const res = await worker.fetch(new Request(from), ENV);
    assert.equal(res.status, status, from);
    assert.equal(res.headers.get("location"), to, from);
  }
});

test("the sitemap lists every language version with its alternates", async () => {
  for (const [base, origin] of [
    [ORIGIN, ORIGIN],
    ["https://playlist-checker.example.workers.dev", ORIGIN],
    ["http://localhost:8787", "http://localhost:8787"],
  ]) {
    const { html: body } = await page("/sitemap.xml", ENV, base);
    assert.match(body, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
    const entries = [...body.matchAll(/<url><loc>([^<]+)<\/loc>(.*?)<\/url>/g)];
    assert.equal(entries.length, 30, base);
    for (const pageName of ["", "privacy", "terms"]) {
      const expected = expectedAlternates(origin, pageName);
      for (const { code } of LANGUAGES) {
        const loc = origin + publicPageAddress(code, pageName);
        const entry = entries.find((m) => m[1] === loc);
        assert.ok(entry, loc);
        const links = [...entry[2].matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(
          (m) => m[1] + " " + m[2],
        );
        assert.deepEqual(links, expected, loc);
      }
    }
    assert.ok(!body.includes("/about"), "the start screen's own address stays out");
  }
});

function stubBrowser(pathname) {
  const writes = [];
  globalThis.location = { pathname, search: "" };
  globalThis.history = {
    state: null,
    replaceState: (entry, title, url) => writes.push(url),
    pushState: () => assert.fail("a language switch adds no history step"),
  };
  return writes;
}

test("a language switch moves language addresses and leaves others", async () => {
  const { followLanguage } = await import("../public/app/address.js");
  const { state } = await import("../public/app/state.js");
  const cases = [
    ["/ru", "de", ["/de"]],
    ["/ru", "en", ["/about"]],
    ["/ru/terms", "de", ["/de/terms"]],
    ["/terms", "fr", ["/fr/terms"]],
    ["/de/privacy", "en", ["/privacy"]],
    ["/about", "ru", []],
    ["/", "ru", []],
    ["/setup/lastfm", "ru", []],
  ];
  try {
    for (const [from, lang, expected] of cases) {
      const writes = stubBrowser(from);
      state.lang = lang;
      followLanguage();
      assert.deepEqual(writes, expected, from + " → " + lang);
    }
  } finally {
    delete globalThis.location;
    delete globalThis.history;
    state.lang = "en";
  }
});
