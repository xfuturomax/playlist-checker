import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/worker/index.js";

const ENV = { PRIMARY_DOMAIN: "playlistchecker.com", CONTACT_EMAIL: "hello@playlistchecker.com" };
const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
});

function request(path, init) {
  return worker.fetch(new Request("https://playlistchecker.com" + path, init), ENV);
}

function assertSecurityHeaders(res) {
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.equal(res.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  // The exact policies, page and short, are checked in csp.test.js.
  assert.match(res.headers.get("content-security-policy"), /frame-ancestors 'none'/);
  assert.match(res.headers.get("content-security-policy"), /base-uri 'none'/);
}

function stubLastfm(handler) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push(String(url));
    return handler(url, init);
  };
  return calls;
}

for (const path of ["/", "/privacy", "/robots.txt", "/sitemap.xml"]) {
  test(`security headers on ${path}`, async () => {
    const res = await request(path);
    assert.equal(res.status, 200);
    assertSecurityHeaders(res);
  });
}

test("www redirects with security headers and without sign-in values", async () => {
  const res = await worker.fetch(
    new Request("https://www.playlistchecker.com/terms?code=x&state=y&f=new"),
    ENV,
  );
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://playlistchecker.com/terms?f=new");
  assertSecurityHeaders(res);
});

test("relay refuses methods other than GET without calling Last.fm", async () => {
  const calls = stubLastfm(() => new Response("{}"));
  const res = await request("/lastfm?method=artist.getInfo", {
    method: "POST",
    headers: { "x-lastfm-key": "k" },
  });
  assert.equal(res.status, 405);
  assert.deepEqual(await res.json(), { error: "http_method_not_allowed" });
  assert.equal(calls.length, 0);
  assertSecurityHeaders(res);
});

test("relay refuses Last.fm methods outside the allow-list", async () => {
  const res = await request("/lastfm?method=user.getInfo", { headers: { "x-lastfm-key": "k" } });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: "method_not_allowed" });
  assertSecurityHeaders(res);
});

test("relay passes the Last.fm answer through, with the key in the address only upstream", async () => {
  const calls = stubLastfm(() => new Response('{"artist":{}}', { status: 200 }));
  const res = await request("/lastfm?method=artist.getInfo&artist=Slim&api_key=ignored", {
    headers: { "x-lastfm-key": "visitor-key" },
  });
  assert.equal(res.status, 200);
  assert.equal(await res.text(), '{"artist":{}}');
  assert.match(calls[0], /api_key=visitor-key/);
  assertSecurityHeaders(res);
});

test("relay reports an unreachable Last.fm without detail", async () => {
  stubLastfm(() => Promise.reject(new DOMException("timed out", "TimeoutError")));
  const res = await request("/lastfm?method=artist.getInfo&artist=Slim", {
    headers: { "x-lastfm-key": "k" },
  });
  assert.equal(res.status, 502);
  assert.deepEqual(await res.json(), { error: "lastfm_unavailable" });
});

test("relay gives Last.fm a time limit", async () => {
  let signal;
  stubLastfm((url, init) => {
    signal = init.signal;
    return new Response("{}");
  });
  await request("/lastfm?method=artist.getInfo&artist=Slim", { headers: { "x-lastfm-key": "k" } });
  assert.ok(signal instanceof AbortSignal);
});

test("sitemap lists the root and the legal pages", async () => {
  const body = await (await request("/sitemap.xml")).text();
  for (const loc of ["/", "/privacy", "/terms"]) {
    assert.ok(body.includes("<loc>https://playlistchecker.com" + loc + "</loc>"), loc);
  }
});

test("legal addresses serve their own text and preferred address", async () => {
  const body = await (await request("/Terms/")).text();
  assert.match(body, /<title>Terms — Playlist Checker<\/title>/);
  assert.match(body, /<link rel="canonical" href="https:\/\/playlistchecker.com\/terms">/);
  assert.match(body, /<div class="legal"><h2>Terms<\/h2>/);
});

function relay(
  query,
  { headers = {}, env = ENV, base = "https://playlistchecker.com", method = "GET" } = {},
) {
  return worker.fetch(
    new Request(base + "/lastfm?" + query, {
      method,
      headers: { "x-lastfm-key": "k", ...headers },
    }),
    env,
  );
}

test("relay refuses a repeated method", async () => {
  const calls = stubLastfm(() => new Response("{}"));
  const res = await relay("method=artist.getInfo&method=user.getRecentTracks&user=victim");
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: "method_not_allowed" });
  assert.equal(calls.length, 0);
});

test("relay refuses a missing method and album.getInfo", async () => {
  for (const query of ["artist=Slim", "method=album.getInfo&artist=Slim&album=X"]) {
    const res = await relay(query);
    assert.equal(res.status, 400, query);
  }
});

test("relay forwards only the values the page needs", async () => {
  const calls = stubLastfm(() => new Response("{}"));
  await relay(
    "method=track.getInfo&artist=A&track=B&username=u&autocorrect=0&sk=s&api_sig=x&callback=f&lang=de",
  );
  const sent = new URL(calls[0]);
  assert.deepEqual([...sent.searchParams.keys()].sort(), [
    "api_key",
    "artist",
    "autocorrect",
    "format",
    "method",
    "track",
    "username",
  ]);
  assert.equal(sent.searchParams.get("autocorrect"), "0");
});

test("relay refuses an over-long value", async () => {
  const calls = stubLastfm(() => new Response("{}"));
  const res = await relay("method=artist.getInfo&artist=" + "a".repeat(513));
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: "bad_request" });
  assert.equal(calls.length, 0);
});

test("relay refuses cross-site and same-site requests, not others", async () => {
  stubLastfm(() => new Response("{}"));
  for (const site of ["cross-site", "same-site"]) {
    const res = await relay("method=artist.getInfo&artist=A", { headers: { "sec-fetch-site": site } });
    assert.equal(res.status, 403, site);
    assert.deepEqual(await res.json(), { error: "cross_site" });
  }
  for (const site of ["same-origin", "none", null]) {
    const headers = site ? { "sec-fetch-site": site } : {};
    const res = await relay("method=artist.getInfo&artist=A", { headers });
    assert.equal(res.status, 200, String(site));
  }
});

test("relay applies the limiter per address and fails open", async () => {
  const calls = stubLastfm(() => new Response("{}"));
  const keys = [];
  const limited = {
    ...ENV,
    RELAY_LIMITER: { limit: async ({ key }) => (keys.push(key), { success: false }) },
  };
  const res = await relay("method=artist.getInfo&artist=A", {
    env: limited,
    headers: { "cf-connecting-ip": "203.0.113.5" },
  });
  assert.equal(res.status, 429);
  assert.deepEqual(await res.json(), { error: "rate_limited" });
  assert.deepEqual(keys, ["203.0.113.5"]);
  assert.equal(calls.length, 0);

  const broken = {
    ...ENV,
    RELAY_LIMITER: {
      limit: async () => {
        throw new Error("down");
      },
    },
  };
  const passed = await relay("method=artist.getInfo&artist=A", {
    env: broken,
    headers: { "cf-connecting-ip": "203.0.113.5" },
  });
  assert.equal(passed.status, 200);
});

test("plain http moves to https without sign-in values", async () => {
  const res = await worker.fetch(new Request("http://playlistchecker.com/privacy?code=x&state=y&f=new"), ENV);
  assert.equal(res.status, 308);
  assert.equal(res.headers.get("location"), "https://playlistchecker.com/privacy?f=new");
});

test("http www reaches the primary domain in one step", async () => {
  const res = await worker.fetch(new Request("http://www.playlistchecker.com/terms"), ENV);
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://playlistchecker.com/terms");
});

test("relay over plain http is refused", async () => {
  const calls = stubLastfm(() => new Response("{}"));
  for (const method of ["GET", "POST"]) {
    const res = await relay("method=artist.getInfo&artist=A", { base: "http://playlistchecker.com", method });
    assert.equal(res.status, method === "GET" ? 403 : 405, method);
  }
  assert.equal(calls.length, 0);
});

test("HSTS covers subdomains on the primary domain only, and is absent locally", async () => {
  assert.equal(
    (await request("/")).headers.get("strict-transport-security"),
    "max-age=86400; includeSubDomains",
  );
  const dev = await worker.fetch(new Request("https://playlist-checker.example.workers.dev/"), ENV);
  assert.equal(dev.headers.get("strict-transport-security"), "max-age=86400");
  const local = await worker.fetch(new Request("http://localhost:8787/"), ENV);
  assert.equal(local.status, 200);
  assert.equal(local.headers.get("strict-transport-security"), null);
});
