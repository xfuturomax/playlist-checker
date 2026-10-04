import { test } from "node:test";
import assert from "node:assert/strict";
import { DICTIONARIES, LANGUAGES } from "../public/app/i18n.js";

// Translations are inserted into the page as HTML, so markup in one of them
// would run on every visitor's page.
const FORBIDDEN = /[<>"]/;

function texts(value) {
  return typeof value === "string" ? [value] : Object.values(value);
}

test("every language has a dictionary", () => {
  for (const { code } of LANGUAGES) assert.ok(DICTIONARIES[code], code);
});

test("no translation contains markup or double quotes", () => {
  for (const [lang, dict] of Object.entries(DICTIONARIES)) {
    for (const [key, value] of Object.entries(dict)) {
      for (const text of texts(value)) {
        assert.ok(!FORBIDDEN.test(text), `${lang} ${key}: ${text}`);
      }
    }
  }
});

test("every language has every English text", () => {
  const english = Object.keys(DICTIONARIES.en);
  for (const [lang, dict] of Object.entries(DICTIONARIES)) {
    const missing = english.filter((key) => !(key in dict));
    assert.deepEqual(missing, [], `${lang} is missing texts`);
  }
});
