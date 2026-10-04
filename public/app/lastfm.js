import { state } from "./state.js";
import { esc, sleep } from "./dom.js";
import { appError } from "./text.js";

function lfmSlug(s) {
  return encodeURIComponent(s).replace(/%20/g, "+");
}

// Escaped as well as encoded: the results go straight into href attributes.
export function lastfmArtistUrl(artist) {
  return esc("https://www.last.fm/music/" + lfmSlug(artist));
}
export function lastfmAlbumUrl(artist, album) {
  return esc("https://www.last.fm/music/" + lfmSlug(artist) + "/" + lfmSlug(album));
}
export function lastfmTrackUrl(artist, track) {
  return esc("https://www.last.fm/music/" + lfmSlug(artist) + "/_/" + lfmSlug(track));
}

// Soft rate limiter: about 4 requests per second, with headroom below the Last.fm limit.
let lastCall = 0;
async function gate() {
  const now = Date.now();
  const wait = Math.max(0, lastCall + 250 - now);
  lastCall = now + wait;
  if (wait) await sleep(wait);
}

// Last.fm answers 10 for an invalid key and 26 for a suspended one; the relay
// answers "no_lastfm_key" when a request carries none. Everything else — an
// unknown artist, a hiccup — leaves the analysis running.
export function isKeyRefusal(data) {
  return data.error === 10 || data.error === 26 || data.error === "no_lastfm_key";
}

// The relay's own limit, or Last.fm's (error 29). Thrown before anything is
// cached, so a busy moment never turns into "never heard".
export function isBusy(res, data) {
  return res.status === 429 || data.error === "rate_limited" || data.error === 29;
}

// The relay refuses longer values; a long title is cut rather than lost.
const LFM_MAX_VALUE = 512;

export async function lfm(params) {
  await gate();
  params.username = state.cfg.lfmUser;
  ["artist", "track"].forEach(function (k) {
    if (params[k] != null) params[k] = String(params[k]).slice(0, LFM_MAX_VALUE);
  });
  const res = await fetch("/lastfm?" + new URLSearchParams(params).toString(), {
    cache: "no-store",
    headers: { "x-lastfm-key": state.cfg.lfmKey },
  });
  const data = await res.json().catch(function () {
    return {};
  });
  if (isKeyRefusal(data)) throw appError("err.lfmKeyRefused");
  if (isBusy(res, data)) throw appError("err.lfmBusy");
  if (!res.ok || data.error) return null;
  return data;
}

export function isBusyError(err) {
  return !!err && err.i18nKey === "err.lfmBusy";
}
