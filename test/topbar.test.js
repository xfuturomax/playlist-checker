import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { topBar } from "../public/app/layout.js";

const APP = new URL("../public/app/", import.meta.url).pathname;

function links(html) {
  return [...html.matchAll(/<a [^>]*>[^<]*<\/a>/g)].map((m) => m[0]);
}

function current(html) {
  return links(html)
    .filter((a) => a.includes('aria-current="page"'))
    .map((a) => a.replace(/<[^>]+>/g, ""));
}

test("before a Spotify session the bar offers Setup, and the name leads to the start screen", () => {
  const html = topBar("setup", false, null);
  assert.match(html, /<a class="brand" href="\/about" data-nav="home">/);
  assert.match(html, /<a href="\/setup" data-nav="setup" aria-current="page">Setup<\/a>/);
  assert.doesNotMatch(html, /data-nav="list"/);
  assert.doesNotMatch(html, /id="acct"/);
});

test("with a Spotify session the bar offers Playlists, and the name leads to the list", () => {
  const html = topBar("list", true, { id: "u1", display_name: "Ann" });
  assert.match(html, /<a class="brand" href="\/" data-nav="home">/);
  assert.match(html, /<a href="\/" data-nav="list" aria-current="page">Playlists<\/a>/);
  assert.doesNotMatch(html, /data-nav="setup"/);
});

test("only the screen in view is marked, and never the product name", () => {
  assert.deepEqual(current(topBar("about", true, null)), ["About"]);
  assert.deepEqual(current(topBar("list", true, null)), ["Playlists"]);
  assert.deepEqual(current(topBar(null, true, null)), []);
  // The setup guide opened as Settings: the bar shows Playlists, nothing is current.
  assert.deepEqual(current(topBar("setup", true, null)), []);
});

test("the account menu appears only for a known account, with its name escaped", () => {
  assert.doesNotMatch(topBar("list", true, null), /id="acct"/);
  const html = topBar("list", true, { id: "u1", display_name: "<b>Ann</b>" });
  assert.match(html, /<summary>&lt;b&gt;Ann&lt;\/b&gt;<\/summary>/);
  assert.match(html, /<a href="\/setup\/spotify" data-nav="settings">Settings<\/a>/);
  assert.match(html, /data-acct="signOut"/);
  assert.match(html, /class="danger" data-acct="reset"/);
  assert.match(topBar("list", true, { id: "u1", display_name: "" }), /<summary>u1<\/summary>/);
});

test("the product name in the bar is not a heading", () => {
  assert.doesNotMatch(topBar("about", false, null), /<h[1-6]/);
});

test("no screen draws a link back of its own", () => {
  for (const dir of [APP, join(APP, "screens")]) {
    for (const name of readdirSync(dir).filter((n) => n.endsWith(".js"))) {
      assert.doesNotMatch(readFileSync(join(dir, name), "utf8"), /class="back"/, name);
    }
  }
});
