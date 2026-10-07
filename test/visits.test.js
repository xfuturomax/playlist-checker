import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/worker/index.js";

const ORIGIN = "https://playlistchecker.com";
const NOTE = { kind: "start", lang: "ru", device: "phone", ref: "www.google.com" };

function setup(extra = {}) {
  const written = [];
  const env = {
    PRIMARY_DOMAIN: "playlistchecker.com",
    VISITS: { writeDataPoint: (point) => written.push(point) },
    ...extra,
  };
  return { env, written };
}

function noteRequest(body, { base = ORIGIN, method = "POST", headers = {}, cf } = {}) {
  const init = {
    method,
    headers: { origin: ORIGIN, "sec-fetch-site": "same-origin", "cf-connecting-ip": "1.2.3.4", ...headers },
  };
  if (method === "POST") init.body = typeof body === "string" ? body : JSON.stringify(body);
  const req = new Request(base + "/hit", init);
  if (cf) Object.defineProperty(req, "cf", { value: cf });
  return req;
}

async function send(req, env) {
  const res = await worker.fetch(req, env);
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("cache-control"), "no-store");
  assert.equal(await res.text(), "");
  return res;
}

test("a valid note is stored with exactly the expected fields", async () => {
  const { env, written } = setup();
  await send(noteRequest(NOTE, { cf: { country: "DE" } }), env);
  assert.deepEqual(written, [
    { blobs: ["start", "ru", "phone", "DE", "www.google.com"], doubles: [1], indexes: ["start"] },
  ]);
});

test("a note without a referring site stores an empty host", async () => {
  const { env, written } = setup();
  await send(
    noteRequest({ kind: "analysis", lang: "pt-BR", device: "large" }, { cf: { country: "BR" } }),
    env,
  );
  assert.deepEqual(written[0].blobs, ["analysis", "pt-BR", "large", "BR", ""]);
});

test("an unknown or anonymous country is stored as unknown", async () => {
  for (const cf of [undefined, { country: "XX" }, { country: "T1" }, { country: "" }]) {
    const { env, written } = setup();
    await send(noteRequest(NOTE, { cf }), env);
    assert.equal(written[0].blobs[3], "unknown", JSON.stringify(cf));
  }
});

test("forged and malformed notes are dropped with the same answer", async () => {
  const cases = [
    noteRequest(NOTE, { headers: { origin: "https://evil.example" } }),
    noteRequest(NOTE, { headers: { "sec-fetch-site": "cross-site" } }),
    noteRequest(NOTE, { headers: { "sec-fetch-site": "" } }),
    noteRequest(NOTE, { method: "GET" }),
    noteRequest({ ...NOTE, kind: "admin" }),
    noteRequest({ ...NOTE, lang: "zh" }),
    noteRequest({ ...NOTE, device: "tv" }),
    noteRequest({ ...NOTE, ref: "https://www.google.com/search?q=me" }),
    noteRequest({ ...NOTE, ref: "localhost" }),
    noteRequest({ ...NOTE, ref: "a".repeat(250) + ".com" }),
    noteRequest({ ...NOTE, ref: 5 }),
    noteRequest("not json"),
    noteRequest("[]"),
    noteRequest(JSON.stringify({ ...NOTE, pad: "x".repeat(600) })),
  ];
  for (const req of cases) {
    const { env, written } = setup();
    await send(req, env);
    assert.deepEqual(written, [], req.method + " " + JSON.stringify([...req.headers]));
  }
});

test("notes over the limit are dropped", async () => {
  const keys = [];
  const { env, written } = setup({
    VISIT_LIMITER: { limit: async ({ key }) => (keys.push(key), { success: false }) },
  });
  await send(noteRequest(NOTE), env);
  assert.deepEqual(written, []);
  assert.deepEqual(keys, ["1.2.3.4"]);
});

test("nothing is counted off the primary domain or without the storage", async () => {
  for (const base of [
    "https://playlist-checker.example.workers.dev",
    "https://www.playlistchecker.com",
    "http://localhost:8787",
  ]) {
    const { env, written } = setup();
    await send(noteRequest(NOTE, { base }), env);
    assert.deepEqual(written, [], base);
  }
  await send(noteRequest(NOTE), { PRIMARY_DOMAIN: "playlistchecker.com" });
  await send(noteRequest(NOTE), {});
});

test("the note address is never the app and never redirects", async () => {
  const { env } = setup();
  for (const url of [
    ORIGIN + "/hit",
    "http://playlistchecker.com/hit",
    "https://www.playlistchecker.com/hit",
  ]) {
    await send(new Request(url), env);
  }
});

test("a failing storage does not change the answer", async () => {
  const env = {
    PRIMARY_DOMAIN: "playlistchecker.com",
    VISITS: {
      writeDataPoint: () => {
        throw new Error("quota");
      },
    },
  };
  await send(noteRequest(NOTE), env);
});

test("the served Privacy text describes the visit count in every language", async () => {
  const { DICTIONARIES, LANGUAGES } = await import("../public/app/i18n.js");
  const { publicPageAddress } = await import("../public/app/pages.js");
  const { esc } = await import("../public/app/html.js");
  for (const { code } of LANGUAGES) {
    const res = await worker.fetch(new Request(ORIGIN + publicPageAddress(code, "privacy")), setup().env);
    const html = await res.text();
    assert.ok(html.includes("<p>" + esc(DICTIONARIES[code]["privacy.5"]) + "</p>"), code);
    assert.ok(DICTIONARIES[code]["privacy.5"].includes("Global Privacy Control"), code);
  }
});
