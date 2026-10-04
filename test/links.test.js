import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const APP = new URL("../public/app/", import.meta.url).pathname;

function sources(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? sources(join(dir, entry.name))
      : entry.name.endsWith(".js")
        ? [join(dir, entry.name)]
        : [],
  );
}

test("links to other sites are not followed by crawlers", () => {
  for (const file of sources(APP)) {
    const code = readFileSync(file, "utf8");
    for (const rel of code.match(/rel="[^"]*"/g) || []) {
      assert.equal(rel, 'rel="nofollow noopener noreferrer"', file);
    }
    for (const link of code.match(/<a href="https?:[^"]*"[^>]*>/g) || []) {
      assert.match(link, /rel="nofollow noopener noreferrer"/, file);
    }
    for (const line of code.split("\n").filter((l) => l.includes('target="_blank"'))) {
      assert.match(line, /rel="nofollow noopener noreferrer"/, file);
    }
  }
});
