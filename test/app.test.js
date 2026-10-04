import { test } from "node:test";
import assert from "node:assert/strict";
import { parseAddress } from "../public/app/address.js";
import { isBusy, isBusyError, isKeyRefusal } from "../public/app/lastfm.js";
import { validSettings } from "../public/app/settings-file.js";

test("addresses name screens", () => {
  assert.deepEqual(parseAddress("/", ""), { screen: "list" });
  assert.deepEqual(parseAddress("/about", ""), { screen: "about" });
  assert.deepEqual(parseAddress("/Privacy", ""), { screen: "legal", page: "privacy" });
  assert.deepEqual(parseAddress("/setup/lastfm", ""), { screen: "setup", step: "lastfm" });
  assert.deepEqual(parseAddress("/setup", ""), { screen: "setup", step: null });
});

test("a playlist address carries its narrowing, decoded", () => {
  assert.deepEqual(parseAddress("/playlist/37i9dQZF1DX0", "?f=new&g=indie%20%26%20folk%2Frock"), {
    screen: "analysis",
    id: "37i9dQZF1DX0",
    filter: "new",
    genre: "indie & folk/rock",
  });
  assert.deepEqual(parseAddress("/playlist/abc", ""), {
    screen: "analysis",
    id: "abc",
    filter: "all",
    genre: "",
  });
});

test("a malformed playlist identifier is unreachable", () => {
  for (const id of ["%E0%A4%A", "a%2Fb", "a.b", "x".repeat(65)]) {
    assert.deepEqual(parseAddress("/playlist/" + id, ""), { screen: "list", unreachable: true }, id);
  }
  assert.deepEqual(parseAddress("/playlist/a/b", ""), { screen: "list" });
});

const MARK = "scrobble-triage-settings";
const HEX = "0123456789abcdef0123456789abcdef";

test("settings files must look exactly like what the app writes", () => {
  assert.equal(
    validSettings({ kind: MARK, clientId: HEX, lfmUser: "someone", lfmKey: HEX, lang: "ru", theme: "dark" }),
    true,
  );
  assert.equal(validSettings({ kind: MARK, clientId: "", lfmUser: "", lfmKey: "" }), true);
  assert.equal(validSettings({ kind: "other" }), false);
  assert.equal(validSettings(null), false);
  assert.equal(validSettings({ kind: MARK, clientId: "not-hex" }), false);
  assert.equal(validSettings({ kind: MARK, lfmUser: "two words" }), false);
  assert.equal(
    validSettings({ kind: MARK, lfmUser: "<b>" }),
    true,
    "markup is escaped on display, not refused",
  );
  assert.equal(validSettings({ kind: MARK, lang: "constructor" }), false);
  assert.equal(validSettings({ kind: MARK, theme: "blue" }), false);
  assert.equal(validSettings({ kind: MARK, lfmKey: 42 }), false);
});

test("a busy Last.fm or relay is told apart from a refused key", () => {
  assert.equal(isBusy({ status: 429 }, {}), true);
  assert.equal(isBusy({ status: 200 }, { error: 29 }), true);
  assert.equal(isBusy({ status: 400 }, { error: "rate_limited" }), true);
  assert.equal(isBusy({ status: 200 }, { error: 6 }), false);
  assert.equal(isKeyRefusal({ error: 10 }), true);
  assert.equal(isKeyRefusal({ error: 26 }), true);
  assert.equal(isKeyRefusal({ error: "no_lastfm_key" }), true);
  assert.equal(isKeyRefusal({ error: 6 }), false);
  assert.equal(isBusyError(Object.assign(new Error("x"), { i18nKey: "err.lfmBusy" })), true);
  assert.equal(isBusyError(new Error("x")), false);
});
