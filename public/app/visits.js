// The anonymous visit count: one short note to the site when a screen of a
// new kind is shown. It names only the kind of screen, the language, phone or
// larger and, for a real arrival, the host of the site the visitor came from.
// Browsers that ask not to be tracked send nothing.

import { state } from "./state.js";

const SPOTIFY_SIGN_IN_HOST = "accounts.spotify.com";
const SIGN_IN_PARAMS = ["code", "state", "error"];

let lastKind = null;
let pendingKind = null;
let firstNote = true;
let arrivedFrom = null;

// Read at start-up, before the sign-in return tidies the address.
export function initVisits() {
  arrivedFrom = arrivalHost();
  document.addEventListener("visibilitychange", sendPending);
  document.addEventListener("prerenderingchange", sendPending);
}

function optedOut() {
  return navigator.globalPrivacyControl === true || navigator.doNotTrack === "1" || window.doNotTrack === "1";
}

// The referring host, only for a page reached by a link or a typed address,
// from another site, and never the way back from Spotify's sign-in.
function arrivalHost() {
  try {
    const params = new URLSearchParams(location.search);
    if (SIGN_IN_PARAMS.some((name) => params.has(name))) return "";
    const nav = performance.getEntriesByType("navigation")[0];
    if (nav && nav.type !== "navigate") return "";
    if (!document.referrer) return "";
    const host = new URL(document.referrer).hostname.toLowerCase();
    if (host === location.hostname || host === SPOTIFY_SIGN_IN_HOST) return "";
    // The site's own old addresses, which send first-time visitors on here.
    if (host === "www." + location.hostname || host.endsWith(".workers.dev")) return "";
    return host;
  } catch (e) {
    return "";
  }
}

function hidden() {
  return document.prerendering === true || document.visibilityState !== "visible";
}

function send(kind) {
  const note = {
    kind,
    lang: state.lang,
    device: window.matchMedia("(max-width: 600px)").matches ? "phone" : "large",
  };
  if (firstNote && arrivedFrom) note.ref = arrivedFrom;
  firstNote = false;
  lastKind = kind;
  try {
    navigator.sendBeacon("/hit", JSON.stringify(note));
  } catch (e) {
    /* a lost note is never the visitor's problem */
  }
}

function sendPending() {
  if (!pendingKind || hidden()) return;
  const kind = pendingKind;
  pendingKind = null;
  if (kind !== lastKind) send(kind);
}

// kind: start, setup, list, analysis, privacy or terms. Called whenever a
// screen is drawn; only a change of kind is counted. A page restored from the
// back-forward cache draws nothing, so it sends nothing.
export function countView(kind) {
  if (arrivedFrom === null || optedOut() || kind === lastKind) return;
  pendingKind = kind;
  sendPending();
}
