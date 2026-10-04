import { state } from "./state.js";
import { syncBar } from "./actions.js";
import { esc, pool } from "./dom.js";
import { isBusyError, lastfmAlbumUrl, lastfmArtistUrl, lastfmTrackUrl } from "./lastfm.js";
import { artistInfo, trackPlays } from "./lastfm-cache.js";
import { picksSave } from "./picks.js";
import { gauge } from "./screens/analysis.js";
import { isKeyRefusalError, keyRefusedDuringUse } from "./screens/setup.js";
import { ensureFreshSession, sp } from "./spotify.js";
import { t } from "./text.js";
import { countTotals } from "./totals.js";

export async function expandAlbum(btn) {
  const slot = btn.closest(".row").nextElementSibling;
  if (slot.innerHTML) {
    slot.innerHTML = "";
    return;
  }
  slot.innerHTML = '<div class="album-panel"><h4>' + t("album.loading") + "</h4></div>";

  const albumId = btn.dataset.album;
  const artistName = btn.dataset.artist;
  let data = state.albumCache.get(albumId);
  if (!data) {
    const album = await sp("/albums/" + albumId);
    const tracks = album.tracks.items.map(function (track) {
      return {
        id: track.id,
        uri: track.uri,
        name: track.name,
        number: track.track_number,
        plays: 0,
        artists: track.artists.map(function (a) {
          return a.name;
        }),
      };
    });
    // Last.fm album.getInfo doesn't return per-track play counts, only one for
    // the whole album. So track.getInfo is called for each track separately,
    // just like in the main playlist analysis.
    await ensureFreshSession();
    try {
      await pool(tracks, 4, async function (track) {
        track.plays = await trackPlays(artistName, track.name);
      });
    } catch (err) {
      if (isKeyRefusalError(err)) return keyRefusedDuringUse();
      if (isBusyError(err)) {
        slot.innerHTML = '<div class="album-panel"><h4>' + t("err.lfmBusy") + "</h4></div>";
        return;
      }
      throw err;
    }
    data = {
      name: album.name,
      tracks: tracks,
      total: album.total_tracks,
      type: album.album_type,
    };
    state.albumCache.set(albumId, data);
  }

  const inPl = {};
  state.artists.forEach(function (a) {
    a.tracks.forEach(function (track) {
      inPl[track.uri] = true;
    });
  });
  const heard = data.tracks.filter(function (track) {
    return track.plays > 0;
  }).length;

  slot.innerHTML =
    '<div class="album-panel"><h4><a href="' +
    lastfmAlbumUrl(btn.dataset.artist, data.name) +
    '" target="_blank" rel="nofollow noopener noreferrer">' +
    esc(data.name) +
    "</a> — " +
    t("album.known", { n: heard, total: data.tracks.length }) +
    "</h4>" +
    '<div class="album-picks">' +
    '<button class="chip" data-pick="all">' +
    t("album.pickAll") +
    "</button>" +
    '<button class="chip" data-pick="invert">' +
    t("album.pickInvert") +
    "</button>" +
    '<button class="chip" data-pick="none">' +
    t("filter.pickNone") +
    "</button>" +
    '<button class="chip" data-pick="new">' +
    t("filter.pickNew") +
    "</button>" +
    '<button class="chip" data-pick="heard">' +
    t("filter.pickHeard") +
    "</button></div>" +
    data.tracks
      .map(function (trk) {
        return (
          '<div class="sub-row ' +
          (trk.plays ? "is-heard" : "is-new") +
          '">' +
          '<input type="checkbox" data-uri="' +
          esc(trk.uri) +
          '" data-id="' +
          esc(trk.id) +
          '" data-inpl="' +
          (inPl[trk.uri] ? 1 : 0) +
          '"' +
          (state.picked.has(trk.uri) ? " checked" : "") +
          ">" +
          '<span><a href="' +
          lastfmTrackUrl(btn.dataset.artist, trk.name) +
          '" target="_blank" rel="nofollow noopener noreferrer">' +
          esc(trk.name) +
          "</a>" +
          artistLinks(trk.artists) +
          (inPl[trk.uri] ? " · " + t("album.inPlaylist") : "") +
          "</span>" +
          gauge(trk.plays) +
          "</div>"
        );
      })
      .join("") +
    "</div>";

  const panel = slot.firstChild;
  Array.prototype.forEach.call(panel.querySelectorAll(".chip[data-pick]"), function (c) {
    c.onclick = function () {
      pickInPanel(panel, c.dataset.pick);
    };
  });
}

// Selection shortcuts scoped to one expanded album, applied straight to the
// checkboxes so the panel stays open instead of being re-rendered.
function pickInPanel(panel, mode) {
  Array.prototype.forEach.call(panel.querySelectorAll("input[type=checkbox]"), function (box) {
    const row = box.closest(".sub-row");
    const heard = row.classList.contains("is-heard");
    const on =
      mode === "all"
        ? true
        : mode === "none"
          ? false
          : mode === "invert"
            ? !box.checked
            : mode === "new"
              ? !heard || box.checked
              : heard || box.checked;
    if (on === box.checked) return;
    box.checked = on;
    if (on)
      state.picked.set(box.dataset.uri, {
        uri: box.dataset.uri,
        id: box.dataset.id,
        inPl: box.dataset.inpl === "1",
      });
    else state.picked.delete(box.dataset.uri);
  });
  picksSave();
  syncBar();
}

// Every performer on a track, each linking to its own Last.fm page. Spotify
// credits features on the track itself, so a row lists them all rather than
// only the lead the group is filed under.
export function artistLinks(names) {
  if (!names || names.length < 2) return "";
  return (
    '<div class="perf">' +
    names
      .map(function (n) {
        return (
          '<a href="' +
          lastfmArtistUrl(n) +
          '" target="_blank" rel="nofollow noopener noreferrer">' +
          esc(n) +
          "</a>"
        );
      })
      .join('<span class="sep">·</span>') +
    "</div>"
  );
}

// Everything known about a track offered by an expanded album panel. Tracks
// can only be added to the current playlist from such a panel, so this is
// always enough to build the same row the analysis would have built.
function albumTrackInfo(uri) {
  let found = null;
  state.albumCache.forEach(function (data, albumId) {
    if (found) return;
    data.tracks.forEach(function (trk) {
      if (found || trk.uri !== uri) return;
      found = {
        id: trk.id,
        uri: trk.uri,
        name: trk.name,
        artists: trk.artists.slice(),
        album: data.name,
        albumId: albumId,
        albumTracks: data.total,
        albumType: data.type,
        plays: trk.plays,
        status: trk.plays > 0 ? "heard" : "new",
      };
    });
  });
  return found;
}

// Places freshly added tracks into the analysis in place. An artist not yet
// in the analysis — a compilation track, say — costs one Last.fm read.
export async function absorbAdded(uris) {
  const rows = uris.map(albumTrackInfo).filter(Boolean);
  if (rows.length !== uris.length) return false;

  const byArtist = new Map();
  state.artists.forEach(function (a) {
    byArtist.set(a.artist.toLowerCase(), a);
  });

  for (let i = 0; i < rows.length; i++) {
    const lead = rows[i].artists[0];
    let group = byArtist.get(lead.toLowerCase());
    if (!group) {
      const info = await artistInfo(lead);
      group = { artist: lead, tracks: [], plays: info.plays, tags: info.tags };
      state.artists.push(group);
      byArtist.set(lead.toLowerCase(), group);
    }
    group.tracks.push(rows[i]);
  }

  state.totals = countTotals(state.artists, state.totals.tracks + rows.length);
  return true;
}

// Album panels are closed by a re-render; the answers behind them are cached,
// so reopening them costs nothing and keeps the reader where they were.
export function openAlbums() {
  const ids = [];
  Array.prototype.forEach.call(state.view.querySelectorAll(".album-slot"), function (slot) {
    if (!slot.innerHTML) return;
    const btn = slot.previousElementSibling && slot.previousElementSibling.querySelector(".albumbtn");
    if (btn && ids.indexOf(btn.dataset.album) === -1) ids.push(btn.dataset.album);
  });
  return ids;
}

export function reopenAlbums(ids) {
  ids.forEach(function (id) {
    const btn = state.view.querySelector('.albumbtn[data-album="' + CSS.escape(id) + '"]');
    if (btn) expandAlbum(btn);
  });
}
