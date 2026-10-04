# Working on Playlist Checker

Instructions for coding agents and contributors. What the app does, how it stores data and
how to run your own copy are in the [README](README.md).

## Commands

- Node 22 or later; Node 20 cannot find the tests.
- `npm install`, then `npm run dev` and open http://127.0.0.1:8787/. Spotify refuses
  `localhost` as a Redirect URI, and `127.0.0.1` keeps its own browser storage.
- `npm run check` — formatting, lint and tests; it must pass before a change is done.
  `npm run format` fixes formatting.

## Shape of the code

- No build step and no runtime dependencies: plain ES modules, served as they are.
- `src/worker/` is the Cloudflare Worker (routing, the Last.fm relay, headers, the page
  shell); `public/app/` is the browser app, one module per area; `test/` uses Node's
  built-in test runner. The README's Development section has the full layout.
- The server keeps nothing: no database, no logs, no analytics, no cookies. User data stays
  in the browser. Do not add anything that stores or sends it elsewhere.

## Rules that are easy to break

- **Content Security Policy.** The page allows only its own files and exactly two inline
  snippets, by hash. No new inline scripts or styles, no third-party scripts, and
  connections only to the site and Spotify. The tests check the policy and the hashes.
- **Translations.** Every interface text goes into `public/app/i18n.js` for all ten
  languages; English is the reference. Texts must not contain double quotes or `<`.
  Countable phrases use plural categories, placeholders use `{name}`.
- **Legal texts.** When the Privacy or Terms texts change, update `LEGAL_UPDATED` (and
  `LEGAL_PAGES` when a paragraph is added or removed).
- **Changelog.** A user-visible change gets an entry under `Unreleased` in `CHANGELOG.md`.

## Commits

Conventional commit messages (`feat:`, `fix:`, `docs:`, `chore:`…), specific about what
changed and why.
