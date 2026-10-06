# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Changed

- One top bar on every screen: the product name, Setup or Playlists, About, the account menu,
  language and theme. The separate "← Playlists" and "← Back" links are gone; the bar and
  the browser's back button take their place
- Settings, Sign out and Reset moved from the playlist list into a menu under the account
  name, available on every screen
- Reset asks for confirmation before erasing anything
- On a phone the bar takes two rows instead of spilling over the screen

## [0.1.0] — 2026-10-04

First public release.

### Added

- Analysis of a Spotify playlist against your Last.fm history: tracks grouped by artist,
  with play counts for every artist and track, and a count of new artists and unheard tracks
- Artists and tracks whose Last.fm name redirects to another (an alias) are asked again
  under the literal name, so their plays are not lost
- Filters by familiar or unfamiliar artist and by genre, kept in the address
- Album panels: open a release from the list to see what you have heard from the rest of it
  and pick tracks from it
- Actions on selected tracks: add to another playlist, move, remove, add to the open
  playlist, save to Liked Songs; a copy of a playlist; tracks with several performers credit
  all of them
- A selection survives a reload for a day, for the playlist most recently analysed
- Every screen has its own address; back and forward move between screens
- A start screen for first-time visitors and a three-step setup guide that checks the
  Last.fm key live and opens wherever something is missing
- Settings can be saved to a file and loaded back, to survive Safari's storage clean-up or
  move to another browser
- Last.fm answers cached in the browser for a week (an hour for unknown tracks); the playlist
  list kept for fifteen minutes
- Interface in 10 languages with correct plural forms; light, dark and system themes,
  applied before the first paint
- Privacy and Terms pages in every language, and a footer with contact, source and
  attribution
- Search engines and link previews get a served English text, a robots file, a sitemap and
  a preview picture; a primary domain setting with a notice for visitors of an old address
- A site icon

### Security

- No server-side storage: settings, session and cache live in the visitor's browser; no
  logs, analytics or cookies
- Spotify sign-in with PKCE, tied to the tab that started it; sign-in values never stay in
  the address
- The Last.fm relay forwards only the two methods and five values the page uses, refuses
  other sites, limits use per address and keeps the key out of addresses
- Plain http moves to https, with HSTS
- A strict Content Security Policy on the page: only its own code and two known inline
  snippets run, connections go only to the site and Spotify; unused browser features such
  as camera, microphone and location are denied
- Data from Spotify, Last.fm and settings files is checked and escaped wherever it enters
  the page

[Unreleased]: https://github.com/xfuturomax/playlist-checker/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/xfuturomax/playlist-checker/releases/tag/v0.1.0
