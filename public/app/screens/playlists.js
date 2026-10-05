import { state } from "../state.js";
import { esc } from "../dom.js";
import { CACHE_SEP, PLAYLISTS_TTL_MS, cacheDrop, cacheGet, cachePut } from "../lastfm-cache.js";
import { masthead } from "../layout.js";
import { screenAnalyse } from "./analysis.js";
import { sp } from "../spotify.js";
import { t } from "../text.js";

export function playlistsCacheKey() {
  return ["playlists", state.me.id].join(CACHE_SEP);
}

export async function loadPlaylists() {
  if (state.playlistsLoaded) return;

  const cached = await cacheGet("meta", playlistsCacheKey());
  if (cached) {
    state.playlists = cached;
    state.playlistsLoaded = true;
    return;
  }

  let items = [];
  let url = "/me/playlists?limit=50";
  while (url) {
    const page = await sp(url.replace("https://api.spotify.com/v1", ""));
    items = items.concat(page.items.filter(Boolean));
    url = page.next;
  }
  // Spotify returns playlist tracks only for own/collaborative playlists
  state.playlists = items.filter(function (p) {
    return p.owner.id === state.me.id || p.collaborative;
  });
  state.playlistsLoaded = true;
  // Only what the two screens read, so a long library stays a small record.
  cachePut(
    "meta",
    playlistsCacheKey(),
    state.playlists.map(function (p) {
      return {
        id: p.id,
        name: p.name,
        collaborative: p.collaborative,
        owner: { id: p.owner.id, display_name: p.owner.display_name },
        items: { total: p.items && p.items.total != null ? p.items.total : null },
      };
    }),
    PLAYLISTS_TTL_MS,
  );
}

export function dropPlaylists() {
  state.playlists = [];
  state.playlistsLoaded = false;
  cacheDrop("meta", playlistsCacheKey());
}

export async function screenPlaylists() {
  const seq = ++state.screenSeq;
  state.bar.classList.remove("on");
  state.picked.clear();
  state.currentPlaylist = null;
  state.rerender = renderPlaylistsLoading;
  renderPlaylistsLoading();

  await loadPlaylists();
  if (seq !== state.screenSeq) return;
  state.rerender = renderPlaylists;
  renderPlaylists();
}

function renderPlaylistsLoading() {
  state.view.innerHTML =
    masthead(t("playlists.title"), "", "", "list") + '<div class="state">' + t("common.loading") + "</div>";
}

function renderPlaylists() {
  let html = masthead(t("playlists.title"), "", "", "list");

  if (state.listNotice) html += '<div class="notice">' + t(state.listNotice) + "</div>";
  html += '<div class="notice">' + t("playlists.radarNote") + "</div>";

  html += state.playlists
    .map(function (p) {
      const editable = p.owner.id === state.me.id;
      return (
        '<div class="pl-row" data-id="' +
        esc(p.id) +
        '">' +
        '<span class="nm"><b>' +
        esc(p.name) +
        "</b><span>" +
        esc(p.owner.display_name || p.owner.id) +
        "</span></span>" +
        (editable ? "" : '<span class="tag">' + t("playlists.readOnly") + "</span>") +
        '<span class="ct">' +
        (p.items && p.items.total != null ? Number(p.items.total) : "—") +
        "</span></div>"
      );
    })
    .join("");

  state.view.innerHTML = html;

  Array.prototype.forEach.call(state.view.querySelectorAll(".pl-row"), function (row) {
    row.onclick = function () {
      state.listNotice = null;
      screenAnalyse(row.dataset.id, { push: true });
    };
  });
}
