// Playlist Checker: finds what is new in a Spotify playlist using Last.fm
// listening history. The worker serves the page shell and relays Last.fm; the
// app's code and images are static files served before the worker is asked.
// It has no storage and no secrets: the Spotify Client ID, the Last.fm key and
// username, and the cache of Last.fm answers all live in the visitor's browser.

import { pageSecurityHeaders, withSecurityHeaders } from "./headers.js";
import { inlineScriptHashes, renderPage } from "./page.js";
import { lastfm } from "./relay.js";
import { json, text } from "./responses.js";
import { robotsTxt, sitemapXml } from "./seo.js";
import { contactEmail, isLocalHost, legalPage, primaryDomain, siteOrigin, sourceUrl } from "./site.js";

// Sign-in values are only valid where the sign-in started; never carry them on.
const SIGN_IN_PARAMS = ["code", "state", "error"];

function withoutSignIn(searchParams) {
  const params = new URLSearchParams(searchParams);
  for (const name of SIGN_IN_PARAMS) params.delete(name);
  const query = params.toString();
  return query ? "?" + query : "";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    return withSecurityHeaders(await route(request, env, url), url, primaryDomain(env));
  },
};

async function route(request, env, url) {
  const primary = primaryDomain(env);

  if (primary && url.hostname === "www." + primary) {
    return Response.redirect("https://" + primary + url.pathname + withoutSignIn(url.searchParams), 301);
  }

  const plainHttp = url.protocol === "http:" && !isLocalHost(url.hostname);

  if (url.pathname === "/lastfm") {
    if (request.method !== "GET") return json({ error: "http_method_not_allowed" }, 405);
    // The key has already crossed the network in the clear; do not use it.
    if (plainHttp) return json({ error: "https_required" }, 403);
    try {
      return await lastfm(url, request, env);
    } catch (err) {
      return json({ error: "lastfm_unavailable" }, 502);
    }
  }

  // 308 keeps the method.
  if (plainHttp) {
    return Response.redirect("https://" + url.host + url.pathname + withoutSignIn(url.searchParams), 308);
  }

  // Existing app files never reach the worker; a missing one is an error, not the page.
  // Browsers ask for /favicon.ico on their own; the icon is /favicon.svg.
  if (url.pathname.startsWith("/app/") || url.pathname === "/favicon.ico") {
    return new Response("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  if (url.pathname === "/robots.txt") {
    return text(robotsTxt(siteOrigin(url, primary)), "text/plain; charset=utf-8");
  }
  if (url.pathname === "/sitemap.xml") {
    return text(sitemapXml(siteOrigin(url, primary)), "application/xml; charset=utf-8");
  }

  // The page sends first-time visitors on an old address to the primary
  // domain and tells everyone else there that the app has moved.
  const site = {
    primary,
    moved: Boolean(primary) && !isLocalHost(url.hostname) && url.hostname !== primary,
    contact: contactEmail(env),
    source: sourceUrl(env),
  };
  const html = renderPage({ origin: siteOrigin(url, primary), page: legalPage(url.pathname), site });
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      ...pageSecurityHeaders(await inlineScriptHashes()),
    },
  });
}
