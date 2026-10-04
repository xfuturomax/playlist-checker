import { state } from "./state.js";
import { toast } from "./dom.js";
import { storageDrop, storageGet, storageSet } from "./storage.js";
import { t } from "./text.js";

// A selection is a draft of an action, not a document: it survives a reload
// for a day, for the playlist most recently analysed, and no longer. Only the
// track addresses are kept — whether a track is still in the playlist is
// recomputed from the freshly read playlist, so a stored set can never drive
// an action against a picture that has since changed.

export const PICKS_KEY = "picked_tracks";
const PICKS_TTL_MS = 24 * 60 * 60 * 1000;

export function picksDrop() {
  storageDrop(PICKS_KEY);
}

export function picksSave() {
  if (!state.currentPlaylist) return;
  if (!state.picked.size) return picksDrop();
  const uris = [];
  state.picked.forEach(function (p) {
    uris.push(p.uri);
  });
  storageSet(PICKS_KEY, JSON.stringify({ playlist: state.currentPlaylist.id, at: Date.now(), uris: uris }));
}

function picksLoad(playlistId) {
  let rec;
  try {
    rec = JSON.parse(storageGet(PICKS_KEY) || "null");
  } catch (e) {
    return [];
  }
  if (!rec || !Array.isArray(rec.uris)) return [];
  if (rec.playlist !== playlistId) {
    picksDrop();
    return [];
  }
  if (!rec.at || Date.now() - rec.at > PICKS_TTL_MS) {
    picksDrop();
    return [];
  }
  return rec.uris;
}

// Rebuilds the selection from stored addresses against the playlist as it is
// now. Anything not found is kept but marked as outside the playlist, which is
// what the summary line above the list accounts for.
export function picksRestore(playlistId) {
  const uris = picksLoad(playlistId);
  if (!uris.length) return;

  const inPlaylist = new Map();
  state.artists.forEach(function (a) {
    a.tracks.forEach(function (trk) {
      inPlaylist.set(trk.uri, trk.id);
    });
  });

  uris.forEach(function (uri) {
    const here = inPlaylist.has(uri);
    state.picked.set(uri, { uri: uri, id: here ? inPlaylist.get(uri) : null, inPl: here });
  });

  const outside = picksOutside();
  toast(
    outside
      ? t("picks.restoredOutside", { n: state.picked.size, outside: outside })
      : t("picks.restored", { n: state.picked.size }),
  );
}

export function picksOutside() {
  let n = 0;
  state.picked.forEach(function (p) {
    if (!p.inPl) n++;
  });
  return n;
}
