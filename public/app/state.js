// Page-wide state shared by the modules. Values that need the browser are
// filled in by initState() at start-up; everything else starts here.
export const state = {
  // From the page's settings block: { primary, moved, contact, source }.
  // moved: this is an old address and the app now lives at the primary domain.
  // contact: the operator's email, or "" when none is set. source: the public
  // source code.
  site: null,
  view: null,
  bar: null,
  redirectUri: "",
  cfg: { clientId: "", lfmUser: "", lfmKey: "" },
  lang: "en",
  themePref: "system",

  token: null,
  me: null,
  artists: [],
  totals: {},
  filter: "all",
  genre: "",
  // Collected while the analysis renders; the genre picker is wired up afterwards.
  genres: [],
  picked: new Map(),
  albumCache: new Map(),
  currentPlaylist: null,
  canEdit: false,
  playlists: [],
  // Held for the life of the tab: the list screen and the target picker on the
  // analysis screen read the same playlists. Dropped whenever we change a
  // playlist ourselves, and by the cache link.
  playlistsLoaded: false,
  analysisProgress: null,
  analysisTruncated: false,
  analysisByAddress: false,
  // A key, not a text: the list is re-rendered on a language switch.
  listNotice: null,
  // Redraws the current screen after a language switch; each screen sets it.
  rerender: null,
  // Bumped by every screen that loads before it draws. A load that finds the
  // number moved on has been left and must not draw over what replaced it.
  screenSeq: 0,
  cacheBypass: false,
};

export function initState() {
  state.site = JSON.parse(document.getElementById("site").textContent);
  state.view = document.getElementById("view");
  state.bar = document.getElementById("bar");
  state.redirectUri = location.origin + "/";
  state.cfg = {
    clientId: localStorage.getItem("sp_client_id") || "",
    lfmUser: localStorage.getItem("lfm_user") || "",
    lfmKey: localStorage.getItem("lfm_key") || "",
  };
}
