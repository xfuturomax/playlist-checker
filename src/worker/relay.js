// The Last.fm relay: Last.fm sends no CORS headers, so the page asks it
// through here. The visitor's key rides in a request header, never in the address.

import { json } from "./responses.js";

const LASTFM_KEY_HEADER = "x-lastfm-key";
const LASTFM_TIMEOUT_MS = 10000;

const ALLOWED_METHODS = new Set(["artist.getInfo", "track.getInfo"]);
// Only these reach Last.fm; anything else in the request is dropped, so the
// relay cannot be steered to other methods or signed calls.
const FORWARDED_PARAMS = ["artist", "track", "username"];
const MAX_VALUE_LENGTH = 512;

// Browsers mark requests from other sites; the page's own calls are same-origin.
function crossSite(request) {
  const site = request.headers.get("sec-fetch-site");
  return site === "cross-site" || site === "same-site";
}

// Soft and per location; a missing or failing limiter lets the request through.
async function overLimit(request, env) {
  const address = request.headers.get("cf-connecting-ip");
  if (!env || !env.RELAY_LIMITER || !address) return false;
  try {
    const { success } = await env.RELAY_LIMITER.limit({ key: address });
    return !success;
  } catch (err) {
    return false;
  }
}

export async function lastfm(url, request, env) {
  if (crossSite(request)) return json({ error: "cross_site" }, 403);
  if (await overLimit(request, env)) return json({ error: "rate_limited" }, 429);

  const methods = url.searchParams.getAll("method");
  if (methods.length !== 1 || !ALLOWED_METHODS.has(methods[0])) {
    return json({ error: "method_not_allowed" }, 400);
  }
  const values = FORWARDED_PARAMS.filter((name) => url.searchParams.has(name)).map((name) => [
    name,
    url.searchParams.get(name),
  ]);
  if (values.some(([, value]) => value.length > MAX_VALUE_LENGTH)) {
    return json({ error: "bad_request" }, 400);
  }

  // The key belongs to whoever is using the app; the worker has none. It
  // travels in a header so it stays out of request logs and browser history.
  const key = request.headers.get(LASTFM_KEY_HEADER);
  if (!key) return json({ error: "no_lastfm_key" }, 400);

  const target = new URL("https://ws.audioscrobbler.com/2.0/");
  target.searchParams.set("method", methods[0]);
  for (const [name, value] of values) target.searchParams.set(name, value);
  // Last.fm reads keys only from the address, so it goes back in here.
  target.searchParams.set("api_key", key);
  target.searchParams.set("format", "json");
  // Name correction is on unless the page asks for the literal name: an artist
  // that redirects (SLIMUS -> Slim) answers with the play count of the target,
  // which is not where the scrobbles under the alias live.
  target.searchParams.set("autocorrect", url.searchParams.get("autocorrect") === "0" ? "0" : "1");

  const res = await fetch(target, {
    headers: { "User-Agent": "playlist-checker" },
    signal: AbortSignal.timeout(LASTFM_TIMEOUT_MS),
  });

  // Passed through untouched, status included: the page needs to tell a
  // refused key apart from an artist Last.fm simply does not know.
  return new Response(await res.text(), {
    status: res.status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
