// What the deployment says about itself: its domain, contact and source, read
// from the variables in wrangler.toml and checked before use.

// CONTACT_EMAIL counts only when it looks like an address, so the footer
// never offers a broken mail link.
export function contactEmail(env) {
  const value = String((env && env.CONTACT_EMAIL) || "").trim();
  return /^[^@\s"<>]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(value) ? value : "";
}

export function sourceUrl(env) {
  const value = String((env && env.SOURCE_URL) || "").trim();
  return /^https:\/\/[^\s"<>]+$/.test(value) ? value : "";
}

export function isLocalHost(hostname) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost")
  );
}

// PRIMARY_DOMAIN is a bare host name; anything else counts as unset, so a typo
// can never point search engines or visitors at a wrong address.
export function primaryDomain(env) {
  const value = String((env && env.PRIMARY_DOMAIN) || "")
    .trim()
    .toLowerCase();
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(value) ? value : "";
}

// Addresses given to search engines and previews are https, whatever the
// request came in on, so a plain-http request cannot start a second copy.
// Once a primary domain is set, every public address names it.
export function siteOrigin(url, primary) {
  if (isLocalHost(url.hostname)) return url.protocol + "//" + url.host;
  return "https://" + (primary || url.host);
}
