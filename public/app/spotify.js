import { state } from "./state.js";
import { readAddress } from "./address.js";
import { screenSetup } from "./screens/setup.js";
import { sessionSet, sessionTake, storageDrop } from "./storage.js";
import { appError, errorMessage } from "./text.js";

const SCOPES =
  "playlist-read-private playlist-read-collaborative " +
  "playlist-modify-private playlist-modify-public user-library-modify";

// Spotify's own wording tells a non-developer nothing. Each refusal we can
// recognise becomes one concrete thing to correct.
function spotifyRefusal(code) {
  if (code === "access_denied") return { key: "err.spotifyDeclined" };
  return { key: "start.spotifyRefused", vars: { error: code } };
}

function exchangeMessage(err) {
  const text = String((err && err.message) || "");
  if (/redirect/i.test(text)) return { key: "err.redirectMismatch", vars: { uri: state.redirectUri } };
  if (/client/i.test(text)) return { key: "err.unknownClient" };
  return errorMessage(err);
}

function randomString(n) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  for (let i = 0; i < n; i++) out += chars[bytes[i] % chars.length];
  return out;
}

async function challenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bin = String.fromCharCode.apply(null, new Uint8Array(hash));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const VERIFIER_KEY = "pkce_verifier";
export const SIGNIN_STATE_KEY = "sp_signin_state";

// The state value ties a return from Spotify to a sign-in this tab started,
// so a crafted link cannot sign the visitor into someone else's account.
export async function login() {
  const signInState = randomString(32);
  const verifier = randomString(64);
  if (!sessionSet(SIGNIN_STATE_KEY, signInState) || !sessionSet(VERIFIER_KEY, verifier)) {
    return screenSetup({ key: "err.storageBlocked" }, "signin");
  }
  const params = new URLSearchParams({
    state: signInState,
    response_type: "code",
    client_id: state.cfg.clientId,
    scope: SCOPES,
    redirect_uri: state.redirectUri,
    code_challenge_method: "S256",
    code_challenge: await challenge(verifier),
  });
  location.href = "https://accounts.spotify.com/authorize?" + params.toString();
}

async function exchange(code, verifier) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: state.redirectUri,
      client_id: state.cfg.clientId,
      code_verifier: verifier,
    }),
  });
  const data = await res.json();
  if (!res.ok)
    throw data.error_description ? new Error(data.error_description) : appError("err.tokenRefused");
  saveToken(data);
}

function saveToken(data) {
  state.token = {
    access: data.access_token,
    refresh: data.refresh_token || (state.token && state.token.refresh),
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };
  localStorage.setItem("sp_token", JSON.stringify(state.token));
}

// Renewing the session invalidates the refresh token that was used, so two
// renewals started at once kill each other's chain and sign the user out in the
// middle of an analysis. Every renewal therefore goes through a single attempt:
// within this tab through sessionRenewal, between tabs through a named lock.
const SESSION_LOCK = "sp-session-renewal";
const SESSION_PREFLIGHT_MS = 5 * 60 * 1000;
let sessionRenewal = null;

export function loadToken() {
  try {
    const raw = localStorage.getItem("sp_token");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function withLock(name, fn) {
  if (navigator.locks && navigator.locks.request) return navigator.locks.request(name, fn);
  return Promise.resolve().then(fn);
}

// Picks up a session stored by another tab: newer than the one we tried, and
// still usable. Returns false when there is nothing better than what we have.
function adoptStoredSession(attempted) {
  const stored = loadToken();
  if (!stored || !stored.refresh || stored.refresh === attempted) return false;
  if (Date.now() > stored.expires) return false;
  state.token = stored;
  return true;
}

function renewSession() {
  if (sessionRenewal) return sessionRenewal;
  const attempted = state.token && state.token.refresh;
  sessionRenewal = withLock(SESSION_LOCK, async function () {
    // Another tab may have renewed while we were waiting for the lock.
    if (adoptStoredSession(attempted)) return;
    try {
      await requestRenewal();
    } catch (err) {
      // Where the lock is unavailable two tabs can still collide. A renewal
      // rejected because the other tab got there first is not a lost session.
      if (adoptStoredSession(attempted)) return;
      throw err;
    }
  });
  const clear = function () {
    sessionRenewal = null;
  };
  sessionRenewal.then(clear, clear);
  return sessionRenewal;
}

async function requestRenewal() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: state.token.refresh,
      client_id: state.cfg.clientId,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw appError("err.sessionExpired");
  saveToken(data);
}

// Renews before a burst of parallel requests, so they don't all run into an
// expired session at the same moment.
export async function ensureFreshSession() {
  if (state.token && Date.now() > state.token.expires - SESSION_PREFLIGHT_MS) await renewSession();
}

export async function sp(path, options) {
  if (!state.token) throw appError("err.notSignedIn");
  if (Date.now() > state.token.expires) await renewSession();
  const opt = options || {};
  opt.headers = Object.assign({ Authorization: "Bearer " + state.token.access }, opt.headers || {});
  if (opt.body) opt.headers["Content-Type"] = "application/json";
  const res = await fetch("https://api.spotify.com/v1" + path, opt);
  if (res.status === 204) return null;
  const data = await res.json().catch(function () {
    return {};
  });
  if (!res.ok)
    throw data.error && data.error.message ? new Error(data.error.message) : appError("err.spotify");
  return data;
}

// Reads what Spotify sent back and takes it out of the address at once, so no
// redirect carries it and a reload cannot replay it. The rest of the address
// stays. Null when this load is not a return from Spotify.
export function takeSignInReturn() {
  // Earlier versions kept the verifier in local storage.
  storageDrop(VERIFIER_KEY);
  const params = new URLSearchParams(location.search);
  if (!params.has("code") && !params.has("error") && !params.has("state")) return null;
  const ret = {
    code: params.get("code"),
    state: params.get("state"),
    error: params.get("error"),
    expected: sessionTake(SIGNIN_STATE_KEY),
    verifier: sessionTake(VERIFIER_KEY),
  };
  ["code", "state", "error"].forEach(function (k) {
    params.delete(k);
  });
  const query = params.toString();
  history.replaceState(history.state, "", location.pathname + (query ? "?" + query : "") + location.hash);
  return ret;
}

// Errors Spotify may return (RFC 6749 §4.1.2.1). Anything else in the address
// was not written by Spotify and is never shown.
const OAUTH_ERRORS = [
  "access_denied",
  "invalid_request",
  "unauthorized_client",
  "unsupported_response_type",
  "invalid_scope",
  "server_error",
  "temporarily_unavailable",
];

// True when the return decided the screen. A verified code always counts;
// anything else is noise to a visitor who already has a session.
export async function handleSignInReturn(ret) {
  if (!ret || readAddress().screen === "legal") return false;
  const verified = !!ret.state && ret.state === ret.expected;
  if (ret.code && verified) {
    if (!state.cfg.clientId) {
      screenSetup({ key: "start.settingsLost" });
      return true;
    }
    try {
      await exchange(ret.code, ret.verifier);
    } catch (err) {
      screenSetup(exchangeMessage(err));
      return true;
    }
    return false;
  }
  if (loadToken()) return false;
  if (verified && OAUTH_ERRORS.indexOf(ret.error) >= 0) screenSetup(spotifyRefusal(ret.error));
  else screenSetup({ key: "err.signInUnverified" }, "signin");
  return true;
}
