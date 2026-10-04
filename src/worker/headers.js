import { isLocalHost } from "./site.js";

// Static files get the same headers from public/_headers.
const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
};

// For everything but the page: only documents run code, so this just stops
// framing and base-address changes.
const SHORT_POLICY = "frame-ancestors 'none'; base-uri 'none'";

// The page runs only its own files and the two inline snippets, and talks only
// to the site and Spotify (Last.fm goes through the site).
function pagePolicy(scriptHashes) {
  const scripts = ["'self'", ...scriptHashes.map((hash) => "'sha256-" + hash + "'")];
  return [
    "default-src 'none'",
    "script-src " + scripts.join(" "),
    "style-src 'self'",
    "img-src 'self'",
    "connect-src 'self' https://accounts.spotify.com https://api.spotify.com",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join("; ");
}

// Clipboard writing stays allowed: the copy buttons use it.
const PAGE_PERMISSIONS =
  "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), hid=(), midi=(), " +
  "display-capture=(), clipboard-read=()";

export function pageSecurityHeaders(scriptHashes) {
  return {
    "content-security-policy": pagePolicy(scriptHashes),
    "permissions-policy": PAGE_PERMISSIONS,
  };
}

// Short on purpose while it is new: a browser keeps the rule for this long.
const HSTS_MAX_AGE = 86400;

function hstsFor(url, primary) {
  if (isLocalHost(url.hostname)) return null;
  const subdomains = primary && url.hostname === primary ? "; includeSubDomains" : "";
  return "max-age=" + HSTS_MAX_AGE + subdomains;
}

// A fresh response: redirects cannot have their headers changed in place.
export function withSecurityHeaders(response, url, primary) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
  if (!headers.has("content-security-policy")) headers.set("content-security-policy", SHORT_POLICY);
  const hsts = hstsFor(url, primary);
  if (hsts) headers.set("strict-transport-security", hsts);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
