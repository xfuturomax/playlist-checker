import { state } from "./state.js";
import { absorbAdded, openAlbums, reopenAlbums } from "./albums.js";
import { comboMarkup, mountCombo } from "./combo.js";
import { el, toast } from "./dom.js";
import { picksDrop } from "./picks.js";
import { renderAnalysis, screenAnalyse } from "./screens/analysis.js";
import { dropPlaylists, loadPlaylists } from "./screens/playlists.js";
import { sp } from "./spotify.js";
import { t } from "./text.js";
import { countTotals, withoutTracks } from "./totals.js";

export function syncBar() {
  el("pickedN").textContent = t("bar.picked", { n: state.picked.size });
  state.bar.classList.toggle("on", state.picked.size > 0);
  el("doRemove").classList.toggle("hidden", !state.canEdit);

  let hasInPl = false,
    hasNotInPl = false;
  state.picked.forEach(function (p) {
    if (p.inPl) hasInPl = true;
    else hasNotInPl = true;
  });

  el("doAddHere").classList.toggle("hidden", !state.canEdit);
  el("doAddHere").disabled = !hasNotInPl;

  const targetVal = targetCombo ? targetCombo.value : "";
  el("doAdd").disabled = !targetVal;
  el("doMove").disabled = !targetVal || !state.canEdit || !hasInPl;
}

// The picker is rebuilt whenever its list or its language changes; the chosen
// playlist survives a rebuild as long as it is still in the list.
let targetItems = [];
let targetCombo = null;

export function buildTargetCombo() {
  const keep = targetCombo ? targetCombo.value : "";
  el("targetSlot").innerHTML = comboMarkup("target", t("bar.targetPlaceholder"));
  const stillThere = targetItems.some(function (it) {
    return it.value === keep;
  });
  targetCombo = mountCombo("target", targetItems, stillThere ? keep : "", function () {
    syncBar();
  });
  syncBar();
}

export async function loadTargets() {
  await loadPlaylists();
  targetItems = state.playlists
    .filter(function (p) {
      if (p.owner.id !== state.me.id) return false;
      return !(state.currentPlaylist && p.id === state.currentPlaylist.id);
    })
    .map(function (p) {
      return { value: p.id, label: p.name };
    });
  buildTargetCombo();
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

// After tracks leave the current playlist: forget them and recount the summary.
function dropFromView(uris) {
  state.artists = withoutTracks(state.artists, uris);
  state.totals = countTotals(state.artists, state.totals.tracks - uris.length);
  state.picked.clear();
  picksDrop();
  renderAnalysis();
  dropPlaylists();
}

export async function clonePlaylist() {
  const name = prompt(t("prompt.copyName"), state.currentPlaylist.name + " — " + t("copy.suffix"));
  if (!name) return;
  try {
    const created = await sp("/me/playlists", {
      method: "POST",
      body: JSON.stringify({ name: name, public: false }),
    });
    const uris = [];
    state.artists.forEach(function (a) {
      a.tracks.forEach(function (track) {
        uris.push(track.uri);
      });
    });
    const parts = chunk(uris, 100);
    for (let i = 0; i < parts.length; i++) {
      await sp("/playlists/" + created.id + "/items", {
        method: "POST",
        body: JSON.stringify({ uris: parts[i] }),
      });
    }
    dropPlaylists();
    toast(t("toast.copyCreated"));
    screenAnalyse(created.id, { push: true });
  } catch (err) {
    toast(err.message);
  }
}

export function initActionBar() {
  el("doClear").onclick = function () {
    state.picked.clear();
    picksDrop();
    renderAnalysis();
  };
  el("doAdd").onclick = async function () {
    const target = targetCombo ? targetCombo.value : "";
    if (!target) return;
    const uris = Array.from(state.picked.values()).map(function (p) {
      return p.uri;
    });
    if (!uris.length) return;
    try {
      const parts = chunk(uris, 100);
      for (let i = 0; i < parts.length; i++) {
        await sp("/playlists/" + target + "/items", {
          method: "POST",
          body: JSON.stringify({ uris: parts[i] }),
        });
      }
      dropPlaylists();
      toast(t("toast.added", { n: uris.length }));
    } catch (err) {
      toast(err.message);
    }
  };
  // Adds tracks that aren't in the CURRENT playlist yet — e.g. ones found
  // by expanding an album.
  el("doAddHere").onclick = async function () {
    const uris = Array.from(state.picked.values())
      .filter(function (p) {
        return !p.inPl;
      })
      .map(function (p) {
        return p.uri;
      });
    if (!uris.length) return;
    try {
      const parts = chunk(uris, 100);
      for (let i = 0; i < parts.length; i++) {
        await sp("/playlists/" + state.currentPlaylist.id + "/items", {
          method: "POST",
          body: JSON.stringify({ uris: parts[i] }),
        });
      }
      dropPlaylists();
      toast(t("toast.addedHere", { n: uris.length }));
      const panels = openAlbums();
      const absorbed = await absorbAdded(uris);
      state.picked.clear();
      picksDrop();
      if (!absorbed) return screenAnalyse(state.currentPlaylist.id);
      renderAnalysis();
      reopenAlbums(panels);
    } catch (err) {
      toast(err.message);
    }
  };
  // Move = add to the target playlist and remove from the current one.
  // Only affects tracks actually present in the current playlist.
  el("doMove").onclick = async function () {
    const target = targetCombo ? targetCombo.value : "";
    if (!target || !state.canEdit) return;
    const uris = Array.from(state.picked.values())
      .filter(function (p) {
        return p.inPl;
      })
      .map(function (p) {
        return p.uri;
      });
    if (!uris.length) return;
    try {
      const parts = chunk(uris, 100);
      for (let i = 0; i < parts.length; i++) {
        await sp("/playlists/" + target + "/items", {
          method: "POST",
          body: JSON.stringify({ uris: parts[i] }),
        });
      }
      for (let j = 0; j < parts.length; j++) {
        await sp("/playlists/" + state.currentPlaylist.id + "/items", {
          method: "DELETE",
          body: JSON.stringify({
            items: parts[j].map(function (u) {
              return { uri: u };
            }),
          }),
        });
      }
      dropFromView(uris);
      toast(t("toast.moved", { n: uris.length }));
    } catch (err) {
      toast(err.message);
    }
  };
  el("doSave").onclick = async function () {
    const uris = Array.from(state.picked.values()).map(function (p) {
      return p.uri;
    });
    try {
      const parts = chunk(uris, 50);
      for (let i = 0; i < parts.length; i++) {
        await sp("/me/library", { method: "PUT", body: JSON.stringify({ uris: parts[i] }) });
      }
      toast(t("toast.saved", { n: uris.length }));
    } catch (err) {
      toast(err.message);
    }
  };
  el("doRemove").onclick = async function () {
    const uris = Array.from(state.picked.values())
      .filter(function (p) {
        return p.inPl;
      })
      .map(function (p) {
        return p.uri;
      });
    if (!uris.length) return toast(t("toast.nothingInPlaylist"));
    if (!confirm(t("confirm.remove", { n: uris.length }))) return;
    try {
      const parts = chunk(uris, 100);
      for (let i = 0; i < parts.length; i++) {
        await sp("/playlists/" + state.currentPlaylist.id + "/items", {
          method: "DELETE",
          body: JSON.stringify({
            items: parts[i].map(function (u) {
              return { uri: u };
            }),
          }),
        });
      }
      dropFromView(uris);
      toast(t("toast.removed", { n: uris.length }));
    } catch (err) {
      toast(err.message);
    }
  };
}
