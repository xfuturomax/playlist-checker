import { state } from "./state.js";
import { sweepCache } from "./lastfm-cache.js";
import { isLegalPage } from "./i18n.js";
import { screenChecking } from "./layout.js";
import { screenLegal } from "./legal.js";
import { screenAbout, setupNotBegun } from "./screens/about.js";
import { screenAnalyse } from "./screens/analysis.js";
import { screenPlaylists } from "./screens/playlists.js";
import { firstMissingStep, screenSetup } from "./screens/setup.js";
import { loadToken, sp } from "./spotify.js";

// The playlist list lives at the site root, an analysis at /playlist/<id>.
// The narrowing rides in the query rather than in further path segments:
// a genre is a Last.fm tag, free text that routinely contains spaces and
// slashes, and a path segment would split it. Anything that does not match
// the playlist shape is the list — the Last.fm relay path never reaches here.

// Spotify playlist identifiers are letters and digits only.
const PLAYLIST_ID_RE = /^[A-Za-z0-9]{1,64}$/;

function decodePart(part) {
  try {
    return decodeURIComponent(part);
  } catch (e) {
    return null;
  }
}

export function readAddress() {
  return parseAddress(location.pathname, location.search);
}

export function parseAddress(pathname, search) {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 1 && isLegalPage(parts[0].toLowerCase())) {
    return { screen: "legal", page: parts[0].toLowerCase() };
  }

  if (parts.length === 1 && parts[0] === "about") return { screen: "about" };

  if (parts[0] === "setup") {
    return { screen: "setup", step: parts.length > 1 ? decodePart(parts[1]) : null };
  }

  if (parts.length !== 2 || parts[0] !== "playlist") return { screen: "list" };
  const id = decodePart(parts[1]);
  // Checked after decoding, so an encoded slash cannot reach a Spotify path.
  if (!id || !PLAYLIST_ID_RE.test(id)) return { screen: "list", unreachable: true };
  const q = new URLSearchParams(search);
  return { screen: "analysis", id: id, filter: q.get("f") || "all", genre: q.get("g") || "" };
}

function addressOf(route) {
  if (route.screen === "about") return "/about";
  if (route.screen === "legal") return "/" + route.page;
  if (route.screen === "setup") return "/setup" + (route.step ? "/" + route.step : "");
  if (route.screen !== "analysis") return "/";
  const q = new URLSearchParams();
  if (route.filter && route.filter !== "all") q.set("f", route.filter);
  if (route.genre) q.set("g", route.genre);
  const query = q.toString();
  return "/playlist/" + encodeURIComponent(route.id) + (query ? "?" + query : "");
}

// Opening a playlist is navigation and adds a step; adjusting the narrowing
// is not, and replaces the current one — otherwise back unwinds filter clicks
// one at a time instead of reaching the list.
export function writeAddress(route, push) {
  const entry = push ? { fromList: true } : history.state;
  try {
    if (push) history.pushState(entry, "", addressOf(route));
    else history.replaceState(entry, "", addressOf(route));
  } catch (e) {
    /* addresses are a convenience, never a blocker */
  }
}

// The screen decision shared by start-up, back and forward, and Continue on
// the start screen: the start screen first, then the setup guide while
// something is missing, then sign-in, then the address. A return from
// Spotify's sign-in page is handled before this, at start-up.
export async function decideScreen(route) {
  if (route.screen === "about") return screenAbout();
  // Readable in any state of setup, and never a reason to sign in.
  if (route.screen === "legal") return screenLegal(route.page);
  // A setup-step address is honoured as far as it is reachable, so someone
  // who chose Start stays in the guide on reload and on forward.
  if (route.screen !== "setup" && setupNotBegun()) {
    writeAddress({ screen: "about" }, false);
    return screenAbout();
  }
  if (firstMissingStep() !== "signin") return screenSetup(null, route.screen === "setup" ? route.step : null);

  // A later navigation during the sign-in check owns the screen.
  const seq = ++state.screenSeq;
  if (!state.me && loadToken())
    screenChecking(route.screen === "analysis" || route.screen === "list" ? "list" : null);
  const problem = await signInProblem();
  if (seq !== state.screenSeq) return;
  if (problem) return screenSetup(problem.msg, problem.step);
  routeTo(route);
}

// Loads the session and asks Spotify who is signed in, once per tab: back
// and forward then cost no request. Resolves to null when signed in, or to
// what the sign-in step should say.
async function signInProblem() {
  if (state.me) return null;
  state.token = loadToken();
  if (!state.token) return { msg: { key: "start.connectSpotify" }, step: "signin" };

  sweepCache();

  try {
    state.me = await sp("/me");
  } catch (err) {
    localStorage.removeItem("sp_token");
    state.token = null;
    return { msg: { key: "start.signInAgain" } };
  }
  return null;
}

// The one way into a screen from an address once the visitor is known — the
// analysis rebuilds itself from scratch either way.
function routeTo(route) {
  if (route.screen === "setup") return screenSetup(null, route.step);
  if (route.screen === "analysis") {
    return screenAnalyse(route.id, { filter: route.filter, genre: route.genre, byAddress: true });
  }
  state.listNotice = route.unreachable ? "nav.playlistUnavailable" : null;
  writeAddress({ screen: "list" }, false);
  return screenPlaylists();
}

export function writeAnalysisAddress(push) {
  if (!state.currentPlaylist) return;
  writeAddress(
    { screen: "analysis", id: state.currentPlaylist.id, filter: state.filter, genre: state.genre },
    push,
  );
}
