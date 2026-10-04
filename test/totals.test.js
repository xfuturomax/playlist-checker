import { test } from "node:test";
import assert from "node:assert/strict";
import { countTotals, withoutTracks } from "../public/app/totals.js";

const artists = [
  {
    artist: "Known",
    plays: 12,
    tracks: [
      { uri: "a", status: "heard" },
      { uri: "b", status: "new" },
    ],
  },
  { artist: "Fresh", plays: 0, tracks: [{ uri: "c", status: "new" }] },
];

test("totals count new artists and unheard tracks", () => {
  assert.deepEqual(countTotals(artists, 3), { tracks: 3, artists: 2, newArtists: 1, newTracks: 2 });
});

test("removing tracks drops emptied artists and recounts", () => {
  const left = withoutTracks(artists, ["c", "b"]);
  assert.deepEqual(
    left.map((a) => a.artist),
    ["Known"],
  );
  assert.deepEqual(
    left[0].tracks.map((t) => t.uri),
    ["a"],
  );
  assert.deepEqual(countTotals(left, 1), { tracks: 1, artists: 1, newArtists: 0, newTracks: 0 });
});

test("removing the only unheard track leaves nothing unheard", () => {
  const one = [{ artist: "Fresh", plays: 0, tracks: [{ uri: "c", status: "new" }] }];
  assert.deepEqual(countTotals(withoutTracks(one, ["c"]), 0), {
    tracks: 0,
    artists: 0,
    newArtists: 0,
    newTracks: 0,
  });
});
