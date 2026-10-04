export function text(body, type) {
  return new Response(body, {
    headers: { "content-type": type, "cache-control": "public, max-age=86400" },
  });
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
