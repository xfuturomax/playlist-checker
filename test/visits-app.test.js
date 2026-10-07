import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { state } from "../public/app/state.js";

const GLOBALS = ["document", "navigator", "location", "performance", "window"];
const saved = Object.fromEntries(
  GLOBALS.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]),
);
let loads = 0;

afterEach(() => {
  for (const name of GLOBALS) {
    if (saved[name]) Object.defineProperty(globalThis, name, saved[name]);
    else delete globalThis[name];
  }
  state.lang = "en";
});

function define(name, value) {
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
}

// A fresh copy of the module per browser, with what that browser reports.
async function browser({
  referrer = "",
  search = "",
  navType = "navigate",
  visibility = "visible",
  prerendering = false,
  gpc = false,
  dnt = null,
  phone = false,
} = {}) {
  const sent = [];
  const listeners = {};
  const doc = {
    referrer,
    visibilityState: visibility,
    prerendering,
    addEventListener: (type, fn) => (listeners[type] = fn),
  };
  define("document", doc);
  define("location", { hostname: "playlistchecker.com", search });
  define("performance", { getEntriesByType: () => [{ type: navType }] });
  define("navigator", {
    globalPrivacyControl: gpc,
    doNotTrack: dnt,
    sendBeacon: (url, body) => sent.push([url, JSON.parse(body)]),
  });
  define("window", { matchMedia: () => ({ matches: phone }) });
  const visits = await import("../public/app/visits.js?load=" + ++loads);
  visits.initVisits();
  return { ...visits, sent, doc, fire: (type) => listeners[type]() };
}

test("a search arrival on a phone sends one note with the search engine", async () => {
  state.lang = "ru";
  const b = await browser({ referrer: "https://www.google.com/", phone: true });
  b.countView("start");
  assert.deepEqual(b.sent, [["/hit", { kind: "start", lang: "ru", device: "phone", ref: "www.google.com" }]]);
});

test("only a change of kind is counted, and only the first note names the referring site", async () => {
  const b = await browser({ referrer: "https://duckduckgo.com/" });
  for (const kind of ["start", "start", "setup", "setup", "setup", "list", "analysis", "analysis", "list"]) {
    b.countView(kind);
  }
  assert.deepEqual(
    b.sent.map(([, note]) => note.kind + (note.ref ? " " + note.ref : "")),
    ["start duckduckgo.com", "setup", "list", "analysis", "list"],
  );
});

test("an analysis note carries nothing about the playlist", async () => {
  const b = await browser();
  b.countView("analysis");
  assert.deepEqual(Object.keys(b.sent[0][1]).sort(), ["device", "kind", "lang"]);
});

test("no referring site for reloads, history moves, sign-in returns, the site itself and old addresses", async () => {
  const cases = [
    { referrer: "https://www.google.com/", navType: "reload" },
    { referrer: "https://www.google.com/", navType: "back_forward" },
    { referrer: "https://accounts.spotify.com/" },
    { referrer: "https://www.google.com/", search: "?code=x&state=y" },
    { referrer: "https://playlistchecker.com/privacy" },
    { referrer: "https://www.playlistchecker.com/" },
    { referrer: "https://playlist-checker.someone.workers.dev/" },
    { referrer: "not a url" },
  ];
  for (const options of cases) {
    const b = await browser(options);
    b.countView("list");
    assert.equal(b.sent.length, 1, JSON.stringify(options));
    assert.equal(b.sent[0][1].ref, undefined, JSON.stringify(options));
  }
});

test("hidden and prerendered pages wait until shown", async () => {
  const hidden = await browser({ visibility: "hidden" });
  hidden.countView("start");
  assert.equal(hidden.sent.length, 0);
  hidden.doc.visibilityState = "visible";
  hidden.fire("visibilitychange");
  hidden.fire("visibilitychange");
  assert.equal(hidden.sent.length, 1);

  const prerendered = await browser({ prerendering: true });
  prerendered.countView("privacy");
  assert.equal(prerendered.sent.length, 0);
  prerendered.doc.prerendering = false;
  prerendered.fire("prerenderingchange");
  assert.deepEqual(prerendered.sent[0][1].kind, "privacy");
});

test("a page closed while hidden sends nothing", async () => {
  const b = await browser({ visibility: "hidden" });
  b.countView("start");
  b.countView("setup");
  assert.equal(b.sent.length, 0);
});

test("do-not-track signals stop every note", async () => {
  for (const options of [{ gpc: true }, { dnt: "1" }]) {
    const b = await browser(options);
    b.countView("start");
    b.countView("list");
    assert.equal(b.sent.length, 0, JSON.stringify(options));
  }
});

test("a failing beacon is ignored", async () => {
  const b = await browser();
  globalThis.navigator.sendBeacon = () => {
    throw new Error("blocked");
  };
  assert.doesNotThrow(() => b.countView("start"));
});
