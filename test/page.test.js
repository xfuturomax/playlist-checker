import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import worker from "../src/worker/index.js";
import { APP_MODULES, escapeScriptJson } from "../src/worker/page.js";

const ENV = { PRIMARY_DOMAIN: "playlistchecker.com", CONTACT_EMAIL: "hello@playlistchecker.com" };

async function page(path) {
  const res = await worker.fetch(new Request("https://playlistchecker.com" + path), ENV);
  return { res, html: await res.text() };
}

function siteBlock(html) {
  const match = html.match(/<script type="application\/json" id="site">([^<]*)<\/script>/);
  assert.ok(match, "settings block present");
  return JSON.parse(match[1]);
}

test("page loads the app from files and carries its settings as data", async () => {
  const { html } = await page("/");
  assert.match(html, /<link rel="stylesheet" href="\/app\/app\.css">/);
  assert.match(html, /<script type="module" src="\/app\/main\.js"><\/script>/);
  assert.match(html, /<script>document\.getElementById\("view"\)\.innerHTML = "";<\/script>/);
  assert.deepEqual(siteBlock(html), {
    primary: "playlistchecker.com",
    moved: false,
    contact: "hello@playlistchecker.com",
    source: "",
  });
  assert.doesNotMatch(html, /"dictionaries"/);
});

test("served text is cleared before the app draws", async () => {
  const { html } = await page("/");
  const view = html.indexOf('<div id="view">');
  const clear = html.indexOf('<script>document.getElementById("view")');
  assert.ok(view > 0 && clear > view);
  assert.ok(html.indexOf("Find what", view) < clear, "served text sits inside the view");
});

test("every preloaded and entry module exists", async () => {
  const { html } = await page("/");
  const paths = [...html.matchAll(/(?:href|src)="(\/app\/[^"]+)"/g)].map((m) => m[1]);
  assert.ok(paths.length > 20);
  for (const path of paths) assert.ok(existsSync("public" + path), path + " exists");
});

test("every app module is preloaded", () => {
  const files = readdirSync("public/app", { recursive: true })
    .filter((path) => path.endsWith(".js"))
    .map((path) => path.slice(0, -3));
  assert.deepEqual([...APP_MODULES].sort(), files.sort());
});

test("a value with markup cannot end the settings block", () => {
  const value = { contact: "</script><script>alert(1)</script>" };
  const html = '<script type="application/json" id="site">' + escapeScriptJson(value) + "</script>";
  assert.deepEqual(siteBlock(html), value);
});

test("the page names its icon, and the icon exists", async () => {
  const { html } = await page("/");
  assert.match(html, /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml">/);
  assert.ok(existsSync("public/favicon.svg"));
});

test("a missing app file is 404 with security headers, not the page", async () => {
  for (const path of ["/app/missing.js", "/app/", "/favicon.ico"]) {
    const { res, html } = await page(path);
    assert.equal(res.status, 404, path);
    assert.doesNotMatch(html, /<!DOCTYPE html>/);
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.equal(res.headers.get("content-security-policy"), "frame-ancestors 'none'; base-uri 'none'");
  }
  const { res } = await page("/app");
  assert.equal(res.status, 200);
});

test("app files are revalidated on every load and keep the site-wide headers", () => {
  const rules = readFileSync("public/_headers", "utf8");
  assert.match(rules, /^\/\*\n( {2}.+\n)* {2}X-Content-Type-Options: nosniff/m);
  assert.match(rules, /^\/app\/\*\n {2}Cache-Control: no-cache$/m);
});
