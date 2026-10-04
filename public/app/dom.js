import { t } from "./text.js";

export { esc } from "./html.js";

export function el(id) {
  return document.getElementById(id);
}

// Spotify has no separate "EP" type — only album / single / compilation.
// Singles with 4+ tracks are almost always EPs in practice, so they are labelled
// that way; this is a heuristic, not an exact API field.
export function albumTypeLabel(type, totalTracks) {
  if (type === "single") return totalTracks >= 4 ? t("type.ep") : t("type.single");
  if (type === "compilation") return t("type.compilation");
  if (type === "album") return t("type.album");
  return "";
}

export function toast(text) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = text;
  document.body.appendChild(node);
  setTimeout(function () {
    node.remove();
  }, 2800);
}

export function sleep(ms) {
  return new Promise(function (r) {
    setTimeout(r, ms);
  });
}

// The first failure stops the other runners from taking new items, so a busy
// Last.fm or a refused key is not asked again for the rest of the run.
export async function pool(items, limit, worker, onProgress) {
  let done = 0;
  let i = 0;
  let failed = false;
  const results = new Array(items.length);
  async function run() {
    while (!failed && i < items.length) {
      const idx = i++;
      try {
        results[idx] = await worker(items[idx], idx);
      } catch (err) {
        failed = true;
        throw err;
      }
      done++;
      if (onProgress) onProgress(done, items.length);
    }
  }
  const runners = [];
  for (let k = 0; k < Math.min(limit, items.length); k++) runners.push(run());
  await Promise.all(runners);
  return results;
}
