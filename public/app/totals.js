// The summary under the playlist name. tracks is passed in rather than counted:
// the playlist can hold items that never make it into an artist group.
export function countTotals(artists, tracks) {
  return {
    tracks: tracks,
    artists: artists.length,
    newArtists: artists.filter(function (a) {
      return a.plays === 0;
    }).length,
    newTracks: artists.reduce(function (n, a) {
      return (
        n +
        a.tracks.filter(function (t) {
          return t.status === "new";
        }).length
      );
    }, 0),
  };
}

export function withoutTracks(artists, uris) {
  const gone = {};
  uris.forEach(function (u) {
    gone[u] = true;
  });
  return artists
    .map(function (a) {
      return Object.assign({}, a, {
        tracks: a.tracks.filter(function (t) {
          return !gone[t.uri];
        }),
      });
    })
    .filter(function (a) {
      return a.tracks.length;
    });
}
