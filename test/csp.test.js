import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import worker from "../src/worker/index.js";

const ENV = { PRIMARY_DOMAIN: "playlistchecker.com" };
const SHORT_POLICY = "frame-ancestors 'none'; base-uri 'none'";
const PERMISSIONS =
  "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), hid=(), midi=(), " +
  "display-capture=(), clipboard-read=()";

function fetchPath(url, init) {
  return worker.fetch(new Request(url, init), ENV);
}

function sha256(text) {
  return createHash("sha256").update(text, "utf8").digest("base64");
}

function browserFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return browserFiles(path);
    return path.endsWith(".js") ? [path] : [];
  });
}

test("page addresses carry the strict policy and the feature policy", async () => {
  for (const path of ["/", "/privacy", "/terms"]) {
    const res = await fetchPath("https://playlistchecker.com" + path);
    const html = await res.text();
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    assert.equal(scripts.length, 2, path + ": exactly two inline scripts");
    assert.equal(html.match(/<script\b/g).length, 4, path + ": plus the data block and the entry module");
    const hashes = scripts.map((code) => "'sha256-" + sha256(code) + "'").join(" ");
    assert.equal(
      res.headers.get("content-security-policy"),
      "default-src 'none'; script-src 'self' " +
        hashes +
        "; style-src 'self'; img-src 'self'; " +
        "connect-src 'self' https://accounts.spotify.com https://api.spotify.com; " +
        "base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      path,
    );
    assert.equal(res.headers.get("permissions-policy"), PERMISSIONS, path);
  }
});

test("everything but the page keeps the short policy", async () => {
  const responses = [
    await fetchPath("https://www.playlistchecker.com/"),
    await fetchPath("http://playlistchecker.com/"),
    await fetchPath("https://playlistchecker.com/robots.txt"),
    await fetchPath("https://playlistchecker.com/sitemap.xml"),
    await fetchPath("https://playlistchecker.com/lastfm", { method: "POST" }),
    await fetchPath("https://playlistchecker.com/app/missing.js"),
  ];
  for (const res of responses) {
    assert.equal(res.headers.get("content-security-policy"), SHORT_POLICY, res.url || String(res.status));
    assert.equal(res.headers.get("permissions-policy"), null);
  }
});

test("the browser code puts no inline styles in markup", () => {
  for (const path of browserFiles("public/app")) {
    const code = readFileSync(path, "utf8");
    assert.doesNotMatch(code, /style=/, path);
    assert.doesNotMatch(code, /setAttribute\(\s*["']style/, path);
  }
});
