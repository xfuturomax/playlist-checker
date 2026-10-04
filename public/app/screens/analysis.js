import { state } from "../state.js";
import { clonePlaylist, loadTargets, syncBar } from "../actions.js";
import { writeAddress, writeAnalysisAddress } from "../address.js";
import { artistLinks, expandAlbum } from "../albums.js";
import { comboMarkup, mountCombo } from "../combo.js";
import { albumTypeLabel, el, esc, pool } from "../dom.js";
import { isBusyError, lastfmAlbumUrl, lastfmArtistUrl, lastfmTrackUrl } from "../lastfm.js";
import { artistInfo, trackPlays } from "../lastfm-cache.js";
import { masthead } from "../layout.js";
import { picksDrop, picksOutside, picksRestore, picksSave } from "../picks.js";
import { screenPlaylists } from "./playlists.js";
import { isKeyRefusalError, keyRefusedDuringUse } from "./setup.js";
import { ensureFreshSession, sp } from "../spotify.js";
import { I18N, t } from "../text.js";
import { countTotals } from "../totals.js";

const LIMIT = 200;

// opts: { fresh, filter, genre, byAddress, push }. A playlist reached by
// address has no list behind it, so a failure there returns to the list;
// one opened from the list is reported in place, one step away from it.
export async function screenAnalyse(playlistId, opts) {
  opts = opts || {};
  const seq = ++state.screenSeq;
  function left() {
    return seq !== state.screenSeq;
  }
  state.rerender = null;
  state.picked.clear();
  state.bar.classList.remove("on");
  state.albumCache.clear();
  state.cacheBypass = !!opts.fresh;
  state.filter = opts.filter || "all";
  state.genre = opts.genre || "";
  state.analysisProgress = null;
  state.analysisTruncated = false;
  state.analysisByAddress = !!opts.byAddress;

  let pl;
  try {
    pl = await sp("/playlists/" + playlistId + "?fields=id,name,owner,items.total");
  } catch (err) {
    if (left()) return;
    return analysisUnavailable(playlistId);
  }
  if (left()) return;
  state.currentPlaylist = pl;
  state.canEdit = pl.owner.id === state.me.id;
  writeAnalysisAddress(!!opts.push);

  state.rerender = renderAnalyseProgress;
  renderAnalyseProgress();

  // 1. playlist tracks (Spotify returns them only for own/collaborative playlists)
  let raw = [];
  try {
    let next =
      "/playlists/" +
      playlistId +
      "/items?limit=100&fields=next,items(item(id,uri,name,artists(name),album(id,name,total_tracks,album_type)))";
    while (next && raw.length < LIMIT) {
      const page = await sp(next.replace("https://api.spotify.com/v1", ""));
      page.items.forEach(function (it) {
        if (it.item && it.item.id) raw.push(it.item);
      });
      next = page.next;
    }
  } catch (err) {
    if (left()) return;
    state.cacheBypass = false;
    return analysisUnavailable(playlistId);
  }
  if (left()) return;
  state.analysisTruncated = raw.length >= LIMIT && pl.items && pl.items.total > LIMIT;
  raw = raw.slice(0, LIMIT);

  // 2. group by lead artist
  const groups = new Map();
  raw.forEach(function (track) {
    const name = track.artists.length ? track.artists[0].name : "—";
    const key = name.toLowerCase();
    if (!groups.has(key)) groups.set(key, { artist: name, tracks: [], plays: 0, tags: [] });
    groups.get(key).tracks.push({
      id: track.id,
      uri: track.uri,
      name: track.name,
      artists: track.artists.map(function (a) {
        return a.name;
      }),
      album: track.album.name,
      albumId: track.album.id,
      albumTracks: track.album.total_tracks,
      albumType: track.album.album_type,
      plays: 0,
      status: "new",
    });
  });

  state.artists = Array.from(groups.values());

  // Renew before the parallel work rather than during it.
  await ensureFreshSession();
  if (left()) return;

  // 3. one request per artist: both play count and genres
  state.analysisProgress = { done: 0, total: state.artists.length };
  function tick() {
    if (left()) return;
    state.analysisProgress.done++;
    const p = el("pbar");
    if (p) p.style.width = progressPercent() + "%";
    const s = el("progress");
    if (s) s.textContent = progressLabel();
  }

  try {
    await pool(state.artists, 4, async function (a) {
      if (left()) return;
      const info = await artistInfo(a.artist);
      a.plays = info.plays;
      a.tags = info.tags;
      tick();
    });

    // 4. check tracks only for familiar artists — for new ones everything is new anyway
    const toCheck = [];
    state.artists.forEach(function (a) {
      if (a.plays > 0)
        a.tracks.forEach(function (track) {
          toCheck.push({ a: a, t: track });
        });
    });

    state.analysisProgress.total += toCheck.length;
    await pool(toCheck, 4, async function (pair) {
      if (left()) return;
      pair.t.plays = await trackPlays(pair.a.artist, pair.t.name);
      pair.t.status = pair.t.plays > 0 ? "heard" : "new";
      tick();
    });
  } catch (err) {
    // A left analysis leaves shared state alone: a newer one owns it now.
    if (left()) return;
    // Results built on a refused key would show everything as unfamiliar.
    if (isKeyRefusalError(err)) return keyRefusedDuringUse();
    state.cacheBypass = false;
    if (isBusyError(err)) {
      state.rerender = function () {
        renderAnalyseBusy(playlistId);
      };
      return renderAnalyseBusy(playlistId);
    }
    state.rerender = renderAnalyseError;
    renderAnalyseError();
    return;
  }

  if (left()) return;
  state.cacheBypass = false;

  state.totals = countTotals(state.artists, raw.length);

  picksRestore(playlistId);

  state.rerender = renderAnalysis;
  renderAnalysis();
  loadTargets();
}

export function backLink() {
  return '<a class="back" href="#" id="back">' + t("analysis.back") + "</a>";
}

export function wireBack() {
  el("back").onclick = function (e) {
    e.preventDefault();
    // Stepping back keeps history honest when we pushed the analysis
    // ourselves; arriving by address leaves nothing behind to step to.
    if (history.state && history.state.fromList) return history.back();
    writeAddress({ screen: "list" }, false);
    screenPlaylists();
  };
}

function progressPercent() {
  if (!state.analysisProgress || !state.analysisProgress.total) return 0;
  return Math.round((state.analysisProgress.done / state.analysisProgress.total) * 100);
}

function progressLabel() {
  return state.analysisProgress ? t("analysis.progress", state.analysisProgress) : t("analysis.reading");
}

function renderAnalyseProgress() {
  state.view.innerHTML =
    backLink() +
    masthead(esc(state.currentPlaylist.name)) +
    '<div class="state" id="progress">' +
    progressLabel() +
    "</div>" +
    '<div class="bar"><i id="pbar"></i></div>';
  el("pbar").style.width = progressPercent() + "%";
  wireBack();
}

// Last.fm asked to slow down; what was asked so far is cached, so a retry
// continues rather than starts over.
function renderAnalyseBusy(playlistId) {
  state.view.innerHTML =
    backLink() +
    masthead(state.currentPlaylist ? esc(state.currentPlaylist.name) : esc(I18N.product)) +
    '<div class="notice">' +
    t("err.lfmBusy") +
    "</div>" +
    '<p><button class="btn primary" id="retryAnalysis">' +
    t("analysis.retry") +
    "</button></p>";
  wireBack();
  el("retryAnalysis").onclick = function () {
    screenAnalyse(playlistId, { byAddress: state.analysisByAddress });
  };
}

function renderAnalyseError() {
  state.view.innerHTML =
    backLink() +
    masthead(state.currentPlaylist ? esc(state.currentPlaylist.name) : esc(I18N.product)) +
    '<div class="notice">' +
    t("analysis.readError") +
    "</div>";
  wireBack();
}

// A playlist that cannot be opened. Reached by address there is no list behind
// it, so the list is shown with an explanation; opened from the list, the
// failure is reported in place through the screen the track read already uses.
function analysisUnavailable(playlistId) {
  if (!state.analysisByAddress) {
    if (!state.currentPlaylist) state.currentPlaylist = { id: playlistId, name: "" };
    state.rerender = renderAnalyseError;
    renderAnalyseError();
    return;
  }
  state.currentPlaylist = null;
  state.listNotice = "nav.playlistUnavailable";
  writeAddress({ screen: "list" }, false);
  return screenPlaylists();
}

function visible() {
  return state.artists.filter(function (a) {
    if (state.filter === "unknown" && a.plays > 0) return false;
    if (state.filter === "known" && a.plays === 0) return false;
    if (state.genre && a.tags.indexOf(state.genre) === -1) return false;
    return true;
  });
}

function ticks(plays) {
  if (!plays) return '<span class="ticks"></span>';
  const n = Math.min(plays, 8);
  let out = "";
  for (let i = 0; i < n; i++) out += "<i></i>";
  return '<span class="ticks">' + out + "</span>";
}

export function gauge(plays) {
  return '<span class="gauge">' + ticks(plays) + '<span class="count">' + (plays || "—") + "</span></span>";
}

export function renderAnalysis() {
  state.genres = [];
  state.artists.forEach(function (a) {
    a.tags.forEach(function (tag) {
      if (state.genres.indexOf(tag) === -1) state.genres.push(tag);
    });
  });
  state.genres.sort();

  const summary = t("analysis.summary", {
    tracks: t("count.tracks", { n: state.totals.tracks }),
    newArtists: t("count.newArtists", { n: state.totals.newArtists }),
    unheard: t("count.unheard", { n: state.totals.newTracks }),
  });
  const recheckLabel = esc(t("filter.recheck"));
  let html =
    backLink() +
    masthead(
      esc(state.currentPlaylist.name),
      summary,
      '<button type="button" class="icobtn" id="recheck" title="' +
        recheckLabel +
        '" aria-label="' +
        recheckLabel +
        '">↻</button>',
    );

  if (state.analysisTruncated) {
    html += '<div class="notice">' + t("analysis.truncated", { n: LIMIT }) + "</div>";
  }
  if (!state.canEdit) {
    html +=
      '<div class="notice">' +
      t("analysis.spotifyOwned") +
      " " +
      '<button class="btn clone" id="clone">' +
      t("analysis.makeCopy") +
      "</button></div>";
  }

  html +=
    '<div class="filters">' +
    '<button class="chip" data-f="all" aria-pressed="' +
    (state.filter === "all") +
    '">' +
    t("filter.all") +
    "</button>" +
    '<button class="chip" data-f="unknown" aria-pressed="' +
    (state.filter === "unknown") +
    '">' +
    t("filter.unknown") +
    "</button>" +
    '<button class="chip" data-f="known" aria-pressed="' +
    (state.filter === "known") +
    '">' +
    t("filter.known") +
    "</button>" +
    comboMarkup("genreSel", t("filter.anyGenre")) +
    "</div>" +
    '<div class="filters">' +
    '<button class="chip" id="pickNew">' +
    t("filter.pickNew") +
    "</button>" +
    '<button class="chip" id="pickHeard">' +
    t("filter.pickHeard") +
    "</button>" +
    '<button class="chip" id="pickNone">' +
    t("filter.pickNone") +
    "</button></div>";

  const outside = picksOutside();
  if (outside) {
    html +=
      '<div class="notice" id="outsideNote">' +
      t("picks.outside", { n: outside }) +
      ' <a href="#" id="clearOutside">' +
      t("picks.clearOutside") +
      "</a></div>";
  }

  const shown = visible();
  if (!shown.length) {
    html += '<div class="state">' + t("analysis.empty") + "</div>";
  } else {
    html += shown
      .map(function (a) {
        const known = a.plays > 0;
        const newN = a.tracks.filter(function (track) {
          return track.status === "new";
        }).length;
        const head =
          '<a class="who" href="' +
          lastfmArtistUrl(a.artist) +
          '" target="_blank" rel="noopener">' +
          esc(a.artist) +
          "</a>" +
          (known
            ? '<span class="badge old">' + t("badge.known", { n: a.plays }) + "</span>"
            : '<span class="badge fresh">' + t("badge.newArtist") + "</span>") +
          '<span class="badge old">' +
          t("badge.unheard", { n: newN, total: a.tracks.length }) +
          "</span>" +
          '<span class="tags">' +
          (a.tags.length
            ? a.tags
                .map(function (track) {
                  return "<b>" + esc(track) + "</b>";
                })
                .join("")
            : "") +
          "</span>";

        const rows = a.tracks
          .map(function (trk) {
            const typeLabel = albumTypeLabel(trk.albumType, trk.albumTracks);
            return (
              '<div class="row ' +
              (trk.status === "new" ? "is-new" : "is-heard") +
              (state.picked.has(trk.uri) ? " picked" : "") +
              '">' +
              '<input type="checkbox" data-uri="' +
              esc(trk.uri) +
              '" data-id="' +
              esc(trk.id) +
              '" data-inpl="1"' +
              (state.picked.has(trk.uri) ? " checked" : "") +
              ">" +
              '<div><div class="title"><a href="' +
              lastfmTrackUrl(a.artist, trk.name) +
              '" target="_blank" rel="noopener">' +
              esc(trk.name) +
              "</a></div>" +
              artistLinks(trk.artists) +
              '<div class="sub"><button class="albumbtn" data-album="' +
              esc(trk.albumId) +
              '" data-artist="' +
              esc(a.artist) +
              '" data-name="' +
              esc(trk.album) +
              '">' +
              esc(trk.album) +
              (typeLabel ? " · " + typeLabel : "") +
              " · " +
              t("album.tracksShort", { n: Number(trk.albumTracks) }) +
              " ▾</button>" +
              ' <a class="albumlink" href="' +
              lastfmAlbumUrl(a.artist, trk.album) +
              '" target="_blank" rel="noopener" title="' +
              t("album.openOnLastfm") +
              '">↗</a></div></div>' +
              gauge(trk.plays) +
              "</div>" +
              '<div class="album-slot"></div>'
            );
          })
          .join("");

        return (
          '<section class="artist ' +
          (known ? "known" : "unknown") +
          '">' +
          '<header class="artist-head">' +
          head +
          "</header>" +
          rows +
          "</section>"
        );
      })
      .join("");
  }

  state.view.innerHTML = html;
  wireAnalysis();
  syncBar();
}

function wireAnalysis() {
  wireBack();

  Array.prototype.forEach.call(state.view.querySelectorAll(".chip[data-f]"), function (c) {
    c.onclick = function () {
      state.filter = c.dataset.f;
      writeAnalysisAddress(false);
      renderAnalysis();
    };
  });
  mountCombo(
    "genreSel",
    [{ value: "", label: t("filter.anyGenre") }].concat(
      state.genres.map(function (g) {
        return { value: g, label: g };
      }),
    ),
    state.genre,
    function (v) {
      state.genre = v;
      writeAnalysisAddress(false);
      renderAnalysis();
    },
  );
  el("pickNew").onclick = function () {
    pickWhere(function (track) {
      return track.status === "new";
    });
  };
  el("pickHeard").onclick = function () {
    pickWhere(function (track) {
      return track.status !== "new";
    });
  };
  el("pickNone").onclick = function () {
    state.picked.clear();
    picksDrop();
    renderAnalysis();
  };
  el("recheck").onclick = function () {
    screenAnalyse(state.currentPlaylist.id, { fresh: true });
  };

  const co = el("clearOutside");
  if (co)
    co.onclick = function (e) {
      e.preventDefault();
      state.picked.forEach(function (pick, key) {
        if (!pick.inPl) state.picked.delete(key);
      });
      picksSave();
      renderAnalysis();
    };

  const cl = el("clone");
  if (cl) cl.onclick = clonePlaylist;

  Array.prototype.forEach.call(state.view.querySelectorAll(".albumbtn"), function (b) {
    b.onclick = function () {
      expandAlbum(b);
    };
  });

  state.view.onchange = function (e) {
    const box = e.target;
    if (!box.dataset || !box.dataset.uri) return;
    if (box.checked)
      state.picked.set(box.dataset.uri, {
        uri: box.dataset.uri,
        id: box.dataset.id,
        inPl: box.dataset.inpl === "1",
      });
    else state.picked.delete(box.dataset.uri);
    const row = box.closest(".row");
    if (row) row.classList.toggle("picked", box.checked);
    picksSave();
    syncBar();
  };
}

function pickWhere(test) {
  visible().forEach(function (a) {
    a.tracks.filter(test).forEach(function (track) {
      state.picked.set(track.uri, { uri: track.uri, id: track.id, inPl: true });
    });
  });
  picksSave();
  renderAnalysis();
}
