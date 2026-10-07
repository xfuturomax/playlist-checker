// The anonymous visit count: the page sends a short note to /hit when it shows
// a screen of a new kind, and this stores it in Workers Analytics Engine. A
// note holds only fixed words, a language, a device class and a referring host
// name; the country comes from Cloudflare. No address, cookie or identifier is
// kept: the visitor's address is used only for the rate limit.

import { LANGUAGES } from "../../public/app/i18n.js";

export const VISIT_PATH = "/hit";

const KINDS = new Set(["start", "setup", "list", "analysis", "privacy", "terms"]);
const DEVICES = new Set(["phone", "large"]);
const LANGS = new Set(LANGUAGES.map((l) => l.code));
const HOST_RE = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;
const MAX_HOST_LENGTH = 253;
const MAX_BODY_BYTES = 512;

// Every request to /hit gets this, whatever happened, so probing learns nothing.
function noContent() {
  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
}

export async function visit(request, env, url, primary) {
  try {
    await record(request, env, url, primary);
  } catch (err) {
    /* counting is never worth an error */
  }
  return noContent();
}

async function record(request, env, url, primary) {
  if (await overLimit(request, env)) return;
  if (!primary || url.hostname !== primary || !env || !env.VISITS) return;
  if (request.method !== "POST") return;
  if (request.headers.get("origin") !== "https://" + primary) return;
  if (request.headers.get("sec-fetch-site") !== "same-origin") return;
  const note = readNote(await readCapped(request));
  if (!note) return;
  env.VISITS.writeDataPoint({
    blobs: [note.kind, note.lang, note.device, country(request), note.ref],
    doubles: [1],
    indexes: [note.kind],
  });
}

// Soft, like the relay's: a missing or failing limiter lets the note through.
async function overLimit(request, env) {
  const address = request.headers.get("cf-connecting-ip");
  if (!env || !env.VISIT_LIMITER || !address) return false;
  try {
    const { success } = await env.VISIT_LIMITER.limit({ key: address });
    return !success;
  } catch (err) {
    return false;
  }
}

// Stops reading once the body is longer than any note can be.
async function readCapped(request) {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, at);
    at += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

export function readNote(body) {
  if (!body) return null;
  let data;
  try {
    data = JSON.parse(body);
  } catch (err) {
    return null;
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const { kind, lang, device } = data;
  const ref = data.ref === undefined ? "" : data.ref;
  if (!KINDS.has(kind) || !LANGS.has(lang) || !DEVICES.has(device)) return null;
  if (typeof ref !== "string") return null;
  if (ref && (ref.length > MAX_HOST_LENGTH || !HOST_RE.test(ref))) return null;
  return { kind, lang, device, ref };
}

// XX is Cloudflare's "unknown", T1 is Tor.
function country(request) {
  const code = request.cf && request.cf.country;
  return typeof code === "string" && /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : "unknown";
}
