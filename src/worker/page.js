// The HTML shell of the page. The app itself is a set of browser modules and a
// stylesheet under /app/, served as static files; the shell adds what depends
// on the request: the language, head tags, the text for readers that do not
// run scripts, and the site settings.

import { headTags, servedText } from "./seo.js";

// Every module the page loads, announced up front so the browser fetches them
// in parallel instead of one import level at a time.
export const APP_MODULES = [
  "main",
  "state",
  "storage",
  "i18n",
  "text",
  "layout",
  "theme",
  "dom",
  "html",
  "combo",
  "legal",
  "spotify",
  "lastfm",
  "lastfm-cache",
  "picks",
  "totals",
  "address",
  "pages",
  "settings-file",
  "actions",
  "albums",
  "account",
  "screens/about",
  "screens/setup",
  "screens/playlists",
  "screens/analysis",
];

// Escape "<" so no value can end the data block early.
export function escapeScriptJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const PRELOADS = APP_MODULES.map((name) => '<link rel="modulepreload" href="/app/' + name + '.js">').join(
  "\n",
);

// The two inline scripts the page policy allows by hash. The shell is built
// from these constants, so the hashed text is the served text.
const THEME_SNIPPET = `
// Applies the saved theme before the first paint, so the page never flashes the
// wrong one. The app owns every change after this.
(function () {
  var pref = null;
  try { pref = localStorage.getItem("theme"); } catch (e) { /* storage blocked: fall back to system */ }
  if (pref !== "light" && pref !== "dark") pref = "system";
  var dark = pref === "dark" ||
    (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  document.getElementById("themeColor").content = dark ? "#131519" : "#f3f4f6";
})();
`;
const CLEAR_SNIPPET = 'document.getElementById("view").innerHTML = "";';

let snippetHashes = null;

async function sha256(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return btoa(String.fromCharCode(...new Uint8Array(digest)));
}

// Worker start-up cannot wait for the hashes, so the first page request starts
// them and later ones share the result; a failure is forgotten and retried.
export function inlineScriptHashes() {
  snippetHashes ??= Promise.all([THEME_SNIPPET, CLEAR_SNIPPET].map(sha256)).catch((err) => {
    snippetHashes = null;
    throw err;
  });
  return snippetHashes;
}

const SHELL = `<!DOCTYPE html>
<html lang="<!--__LANG__-->">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" id="themeColor" content="#f3f4f6">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<!--__HEAD__-->
<script>${THEME_SNIPPET}</script>
<link rel="stylesheet" href="/app/app.css">
<!--__PRELOADS__-->
<script type="application/json" id="site"><!--__SITE__--></script>
<script type="module" src="/app/main.js"></script>
</head>
<body>
<div class="wrap">
  <div id="moved"></div>
  <div id="view"><!--__SERVED__--></div>
  <!-- The served text is for readers that do not run scripts; cleared before
       the first paint, the app draws the screen once its modules arrive. -->
  <script>${CLEAR_SNIPPET}</script>
  <footer class="foot" id="foot"></footer>
</div>

<div class="actionbar" id="bar">
  <span class="n" id="pickedN">0</span>
  <button class="btn risky hidden" id="doRemove"></button>
  <button class="btn hidden" id="doAddHere" disabled></button>
  <span id="targetSlot"></span>
  <button class="btn" id="doAdd" disabled></button>
  <button class="btn" id="doMove" disabled></button>
  <button class="btn" id="doSave"></button>
  <button class="btn" id="doClear"></button>
</div>
</body>
</html>
`;

// named: { lang, page } for a public page, or null for any other address.
export function renderPage({ origin, named, site }) {
  // A replacer function keeps "$" sequences in texts literal.
  return SHELL.replace("<!--__LANG__-->", () => (named ? named.lang : "en"))
    .replace("<!--__HEAD__-->", () => headTags(origin, named))
    .replace("<!--__PRELOADS__-->", () => PRELOADS)
    .replace("<!--__SITE__-->", () => escapeScriptJson(site))
    .replace("<!--__SERVED__-->", () => servedText(named, site));
}
