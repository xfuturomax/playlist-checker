import { state } from "./state.js";
import { lfm } from "./lastfm.js";

// Only what the interface reads is kept, not the raw answers: an artist answer
// carries a biography of several kilobytes where the app shows a play count and
// four tags. Records belong to one Last.fm username, because play counts are
// personal — which is also why a changed username empties the whole cache.
const CACHE_DB = "lastfm-cache";
const CACHE_STORES = ["artists", "tracks", "meta"];
const CACHE_DB_VERSION = 2;
// Bumped whenever the shape of a stored record changes, so records written by
// an older version of the app are refetched instead of served incomplete.
const CACHE_SHAPE = 1;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
// An answer of "Last.fm does not know this one" is worth keeping too, or every
// analysis asks again for tracks whose answer cannot change on its own. It is
// kept far more briefly than a real answer, because that state is the quickest
// to go stale: a brand new track is unknown to Last.fm only until its first
// scrobble in the world, which may well be the listener's own.
const CACHE_MISS_TTL_MS = 60 * 60 * 1000;
// The playlist list belongs to the Spotify account, not to the Last.fm user,
// and it is the one thing here the listener changes outside this app. Kept
// briefly, so a playlist renamed in Spotify cannot look wrong for long.
export const PLAYLISTS_TTL_MS = 15 * 60 * 1000;
let cacheOpening = null;

function openCache() {
  if (cacheOpening) return cacheOpening;
  cacheOpening = new Promise(function (resolve) {
    let req;
    try {
      req = indexedDB.open(CACHE_DB, CACHE_DB_VERSION);
    } catch (e) {
      return resolve(null);
    }
    req.onupgradeneeded = function () {
      const db = req.result;
      CACHE_STORES.forEach(function (name) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name).createIndex("expires", "expires");
        }
      });
    };
    req.onsuccess = function () {
      resolve(req.result);
    };
    // Private windows, blocked storage, a full disk: work without the cache.
    req.onerror = function () {
      resolve(null);
    };
    req.onblocked = function () {
      resolve(null);
    };
  });
  return cacheOpening;
}

// A separator that cannot occur in an artist or track name, and that needs no
// escaping inside the page template.
export const CACHE_SEP = String.fromCharCode(31);

function cacheKey(kind, a, b) {
  return [state.cfg.lfmUser, kind, a, b || ""].join(CACHE_SEP).toLowerCase();
}

export async function cacheGet(store, key) {
  if (state.cacheBypass) return null;
  const db = await openCache();
  if (!db) return null;
  return new Promise(function (resolve) {
    try {
      const tx = db.transaction(store, "readonly");
      const req = tx.objectStore(store).get(key);
      tx.onerror = tx.onabort = function () {
        resolve(null);
      };
      tx.oncomplete = function () {
        const rec = req.result;
        if (!rec || rec.shape !== CACHE_SHAPE || rec.expires <= Date.now()) return resolve(null);
        resolve(rec.data);
      };
    } catch (e) {
      resolve(null);
    }
  });
}

export function cachePut(store, key, data, ttl) {
  openCache().then(function (db) {
    if (!db) return;
    try {
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).put(
        { shape: CACHE_SHAPE, expires: Date.now() + (ttl || CACHE_TTL_MS), data: data },
        key,
      );
      tx.onerror = tx.onabort = function () {
        /* the cache is never the only copy */
      };
    } catch (e) {
      /* same */
    }
  });
}

export function cacheDrop(store, key) {
  return openCache().then(function (db) {
    if (!db) return;
    try {
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).delete(key);
      tx.onerror = tx.onabort = function () {};
    } catch (e) {
      /* nothing to drop */
    }
  });
}

// Expired records go in one pass at start-up, through the index on the expiry.
export function sweepCache() {
  openCache().then(function (db) {
    if (!db) return;
    CACHE_STORES.forEach(function (name) {
      try {
        const tx = db.transaction(name, "readwrite");
        const req = tx.objectStore(name).index("expires").openCursor(IDBKeyRange.upperBound(Date.now()));
        req.onsuccess = function () {
          const cursor = req.result;
          if (!cursor) return;
          cursor.delete();
          cursor.continue();
        };
        tx.onerror = tx.onabort = function () {};
      } catch (e) {
        /* nothing to sweep */
      }
    });
  });
}

export function clearCache() {
  return openCache().then(function (db) {
    if (!db) return;
    return new Promise(function (resolve) {
      try {
        const tx = db.transaction(CACHE_STORES, "readwrite");
        CACHE_STORES.forEach(function (name) {
          tx.objectStore(name).clear();
        });
        tx.oncomplete = function () {
          resolve();
        };
        tx.onerror = tx.onabort = function () {
          resolve();
        };
      } catch (e) {
        resolve();
      }
    });
  });
}

function num(v) {
  const n = parseInt(v, 10);
  return isNaN(n) ? 0 : n;
}

// Last.fm keeps aliases that redirect to a canonical name, and the play count
// follows the redirect while the scrobbles stay behind on the alias. So a name
// that answers "never heard" is asked a second time verbatim — the same thing
// the +noredirect address does on the site — and the larger count wins.
export async function artistInfo(name) {
  const key = cacheKey("artist", name);
  const cached = await cacheGet("artists", key);
  if (cached) return cached;
  let data = await lfm({ method: "artist.getInfo", artist: name });
  if (!data || !data.artist || !num(data.artist.stats && data.artist.stats.userplaycount)) {
    const literal = await lfm({ method: "artist.getInfo", artist: name, autocorrect: "0" });
    if (literal && literal.artist && num(literal.artist.stats && literal.artist.stats.userplaycount)) {
      data = literal;
    }
  }
  if (!data || !data.artist) {
    const unknown = { plays: 0, tags: [] };
    cachePut("artists", key, unknown, CACHE_MISS_TTL_MS);
    return unknown;
  }
  const a = data.artist;
  const tags = [];
  let raw = (a.tags && a.tags.tag) || [];
  if (!Array.isArray(raw)) raw = [raw];
  for (let i = 0; i < raw.length && tags.length < 4; i++) {
    const nm = (raw[i].name || "").toLowerCase();
    if (nm && JUNK.indexOf(nm) === -1) tags.push(nm);
  }
  const info = { plays: num(a.stats && a.stats.userplaycount), tags: tags };
  cachePut("artists", key, info);
  return info;
}

const JUNK = [
  "seen live",
  "favorites",
  "favourites",
  "awesome",
  "beautiful",
  "love",
  "cool",
  "good",
  "great",
  "best",
  "amazing",
  "epic",
  "spotify",
  "vinyl",
  "male vocalists",
  "female vocalists",
  "under 2000 listeners",
  "10s",
  "00s",
  "90s",
  "80s",
  "70s",
  "60s",
  "2020s",
  "2010s",
];

export async function trackPlays(artist, title) {
  const key = cacheKey("track", artist, title);
  const cached = await cacheGet("tracks", key);
  if (cached) return cached.plays;
  let data = await lfm({ method: "track.getInfo", artist: artist, track: title });
  if (!data || !data.track || !num(data.track.userplaycount)) {
    // Same redirect trap as with artists: ask again for the literal name.
    const literal = await lfm({
      method: "track.getInfo",
      artist: artist,
      track: title,
      autocorrect: "0",
    });
    if (literal && literal.track && num(literal.track.userplaycount)) data = literal;
  }
  if (!data || !data.track) {
    cachePut("tracks", key, { plays: 0 }, CACHE_MISS_TTL_MS);
    return 0;
  }
  const plays = num(data.track.userplaycount);
  cachePut("tracks", key, { plays: plays });
  return plays;
}
