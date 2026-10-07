// UI translations. English is the reference and fallback dictionary.
// Countable phrases are objects keyed by Intl.PluralRules category;
// a missing category falls back to "other".
// Translations are injected into HTML as-is: never use double quotes or "<" in them.

// The product name is the same in every language and is never translated.
export const PRODUCT_NAME = "Playlist Checker";

// The date the Privacy and Terms texts last changed, shared by every language.
export const LEGAL_UPDATED = "2026-10-07";

// Paragraph counts of the Privacy and Terms texts, which are also their addresses.
export const LEGAL_PAGES = { privacy: 8, terms: 6 };

export function isLegalPage(name) {
  return Object.prototype.hasOwnProperty.call(LEGAL_PAGES, name);
}

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "pt-BR", name: "Português (Brasil)" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "pl", name: "Polski" },
  { code: "tr", name: "Türkçe" },
  { code: "ja", name: "日本語" },
  { code: "ru", name: "Русский" },
];

export const DICTIONARIES = {
  en: {
    "lang.label": "Language",
    "theme.label": "Theme",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "common.loading": "Loading…",
    "about.link": "About",
    "nav.label": "Main",
    "nav.account": "Account",
    "nav.resetQuestion": "Erase everything stored in this browser?",
    "nav.resetConfirm": "Erase",
    "nav.resetCancel": "Cancel",
    "about.headline": "Find what’s new in any playlist",
    "about.description":
      "See which tracks in a Spotify playlist you have already heard on Last.fm, and keep only the new ones. Nothing is stored on the server.",
    "about.lead":
      "See which tracks in a playlist you have already heard, and keep only the new ones. Your Last.fm history, applied to your Spotify playlists.",
    "about.benefit1": "Every track and artist in a playlist is checked against your Last.fm history.",
    "about.benefit2": "Familiar and new are shown apart, so the new stands out.",
    "about.benefit3": "Add, move and remove tracks right in Spotify.",
    "about.howTitle": "How it works",
    "about.how":
      "Connect your Spotify account and your Last.fm profile. The app reads your playlists from Spotify and your listening history from Last.fm, and puts them side by side.",
    "about.privacy":
      "Nothing is kept on the server: your settings, your session and cached answers stay in this browser.",
    "legal.privacyLink": "Privacy",
    "legal.termsLink": "Terms",
    "legal.contactLink": "Contact",
    "legal.sourceLink": "Source code",
    "legal.sourceOnRequest": "available on request from {contact}",
    "legal.poweredBy": "Powered by {link}",
    "legal.spotify": "Not affiliated with or endorsed by Spotify.",
    "legal.updated": "Last updated: {date}",
    "legal.englishPrevails": "",
    "privacy.title": "Privacy",
    "privacy.description": "What Playlist Checker keeps, where it keeps it, and how to erase it.",
    "privacy.1":
      "In short: Playlist Checker has no database and no accounts. Everything it needs stays in your browser.",
    "privacy.2":
      "Your browser’s local storage keeps your settings: the Spotify Client ID, your Last.fm username and API key, your Spotify session, your language and theme, the setup progress and, for a day, the tracks you selected. Your browser’s database keeps Last.fm answers for up to a week and your playlist list for a quarter of an hour, so repeated checks are fast. During sign-in, the tab keeps two one-time check values.",
    "privacy.3":
      "Spotify is contacted directly from your browser. Last.fm is contacted through this site’s server, because Last.fm does not accept calls from web pages. Those requests carry your Last.fm API key and username and the artist, track and album names being checked; the server passes them on, returns the answer and keeps nothing.",
    "privacy.4":
      "The site is hosted on Cloudflare, which processes technical request details such as your IP address to deliver it, under its own privacy policy.",
    "privacy.5":
      "Visits are counted anonymously on this site’s own server: each screen you open is noted with its kind (start, setup, playlist list, analysis, Privacy or Terms), the interface language, whether the screen is a phone’s, your country and, when you arrive from another site, that site’s name. No IP address, cookie or identifier is kept, so visits cannot be linked to you or to each other, and the notes are deleted after three months. If your browser asks sites not to track you (Global Privacy Control or Do Not Track), nothing is counted. There are no trackers, no advertising and no cookies.",
    "privacy.6": "A settings file you save contains your keys. Keep it private.",
    "privacy.7":
      "Sign out ends your Spotify session in this browser and keeps your Last.fm details. To erase everything, use Reset or clear this site’s data in your browser settings. Your Spotify playlists and Last.fm history are not affected. To revoke the app’s access to Spotify, remove it under Manage apps in your Spotify account.",
    "privacy.8": "This site is run by its owner as a personal, non-commercial project. Questions: {contact}.",
    "terms.title": "Terms",
    "terms.description": "The terms of using Playlist Checker.",
    "terms.1":
      "Playlist Checker is provided as is, free of charge and without any warranty. You use it at your own risk.",
    "terms.2":
      "It is not affiliated with, endorsed or sponsored by Spotify or Last.fm. Spotify and Last.fm are trademarks of their owners.",
    "terms.3":
      "You supply your own Spotify app and Last.fm API key. You are responsible for them and for following Spotify’s and Last.fm’s own terms.",
    "terms.4":
      "Adding, moving and removing tracks changes your real Spotify playlists. The site cannot undo these changes, so check before you confirm.",
    "terms.5":
      "The service may change or stop at any time. Its source code is published under the AGPL-3.0 licence: {source}.",
    "terms.6": "Questions: {contact}.",
    "about.setupTime":
      "Setup takes about five minutes: you create your own Spotify app and a Last.fm API key, and the guide walks you through both.",
    "about.start": "Start",
    "about.continue": "Continue",
    "about.shot": "A playlist after the check: familiar and new artists apart, unheard tracks selected.",
    "about.albumShot": "Open an album to see which of its tracks you have heard, and pick the rest.",

    "setup.title": "Setup",
    "setup.signIn": "Sign in",
    "setup.redirectNotice": "In your Spotify app settings, add this exact Redirect URI:",
    "setup.lfmUser": "Last.fm username",
    "setup.lfmKey": "Last.fm API key",
    "setup.storedLocally": "These values are stored only in this browser.",
    "setup.submit": "Sign in with Spotify",
    "setup.linkSpotifyApp": "Spotify app",
    "setup.linkLfmKey": "Last.fm key",
    "setup.needClientId": "Client ID is required",
    "setup.needLfmUser": "Last.fm username is required",
    "playlists.settings": "Settings",
    "playlists.radarNote":
      "Spotify's own playlists — Release Radar, Discover Weekly and the like — are not available through the API. Copy their tracks into a playlist of your own in the Spotify app, then analyse that one.",
    "setup.step": "Step {n} of {total}",
    "setup.stepSpotify": "Spotify app",
    "setup.stepLastfm": "Last.fm key",
    "setup.spotify1": "Open the Spotify developer dashboard and create an app:",
    "setup.spotify2": "Under Which API/SDKs are you planning to use, tick only Web API.",
    "setup.spotify4": "Copy the Client ID from the app page and paste it below.",
    "setup.copy": "Copy",
    "setup.copied": "Address copied",
    "setup.copyFailed": "Could not copy — select the address and copy it by hand",
    "setup.clientIdBad": "That does not look like a Client ID: 32 characters, digits and a–f.",
    "setup.lastfm1": "Fill in the Last.fm key form and copy the API key it gives you:",
    "setup.lastfm2": "Already created one? Your existing keys are listed here:",
    "setup.linkLfmKeys": "your Last.fm keys",
    "setup.needLfmKey": "Last.fm API key is required",
    "setup.checking": "Checking…",
    "setup.keyRefused": "Last.fm did not accept this key",
    "setup.continue": "Continue",
    "setup.back": "← Back",
    "setup.ownApp": "The app you create is your own and points at this site.",
    "setup.redirectHint":
      "If Spotify answers INVALID_CLIENT: Invalid redirect URI, this address is not registered in your app:",
    "setup.exportSettings": "Save settings to a file",
    "setup.importSettings": "Load settings from a file",
    "setup.importConfirm":
      "Replace the current settings with the ones in this file (Client ID {clientId})? You will be signed out of Spotify.",
    "setup.importBad": "This file is not a settings export",
    "err.lfmKeyRefused": "Last.fm no longer accepts your API key. Enter it again.",
    "err.spotifyDeclined": "You declined access in Spotify.",
    "err.lfmBusy": "Last.fm is busy right now. Wait a minute and try again.",
    "analysis.retry": "Try again",
    "playlists.signOut": "Sign out",
    "signOut.notice":
      "You are signed out of Spotify in this browser. Your Last.fm username and key are still kept here; Reset removes them too.",
    "signOut.revoke": "Remove the app’s access in your Spotify account",
    "err.signInUnverified": "Sign-in could not be confirmed. Please sign in again.",
    "err.storageBlocked":
      "Your browser does not let this site keep the data sign-in needs. Allow site data for this site and try again.",
    "err.redirectMismatch":
      "Spotify rejected the redirect address. In your Spotify app the Redirect URI must be exactly: {uri}",
    "err.unknownClient": "Spotify does not know this Client ID. Check it on your app page.",

    "start.spotifyRefused": "Spotify refused: {error}. This is usually a Redirect URI mismatch.",
    "start.settingsLost": "Settings were lost — please enter them again.",
    "start.connectSpotify": "Connect Spotify.",
    "start.signInAgain": "Please sign in again.",

    "err.tokenRefused": "Spotify refused to issue a token",
    "err.sessionExpired": "Session expired, please sign in again",
    "err.notSignedIn": "Not signed in to Spotify",
    "err.spotify": "Spotify error",

    "playlists.title": "Playlists",
    "playlists.reset": "Reset",
    "playlists.readOnly": "Read-only",
    "picks.outside": {
      one: "{n} selected track is not in this playlist.",
      other: "{n} selected tracks are not in this playlist.",
    },
    "picks.clearOutside": "Clear them",
    "picks.restored": {
      one: "Restored {n} selected track.",
      other: "Restored {n} selected tracks.",
    },
    "picks.restoredOutside": {
      one: "Restored {n} selected track — {outside} of them not in this playlist.",
      other: "Restored {n} selected tracks — {outside} of them not in this playlist.",
    },
    "nav.playlistUnavailable":
      "That playlist couldn’t be opened. It may have been deleted, or you may no longer have access to it.",

    "analysis.reading": "Reading playlist…",
    "analysis.progress": "Checking Last.fm… {done} of {total}",
    "analysis.readError":
      "Couldn’t read the tracks of this playlist. Spotify only returns the contents of playlists you own or collaborate on — other people’s playlists and Spotify-curated ones can no longer be analysed.",
    "analysis.summary": "{tracks} · {newArtists} · {unheard}",
    "analysis.truncated": {
      one: "Showing the first {n} track — going further would take too many Last.fm requests.",
      other: "Showing the first {n} tracks — going further would take too many Last.fm requests.",
    },
    "analysis.spotifyOwned": "This playlist is curated by Spotify, so nothing can be removed from it.",
    "analysis.makeCopy": "Make a copy",
    "analysis.empty": "Nothing matches the filter.",

    "count.tracks": { one: "{n} track", other: "{n} tracks" },
    "count.newArtists": { one: "{n} new artist", other: "{n} new artists" },
    "count.unheard": "{n} unheard",

    "filter.all": "All",
    "filter.unknown": "Unfamiliar artist",
    "filter.known": "Familiar artist",
    "filter.anyGenre": "Any genre",
    "filter.pickNew": "Select unheard",
    "filter.pickHeard": "Select heard",
    "filter.pickNone": "Clear",
    "album.pickAll": "Select all",
    "album.pickInvert": "Invert",
    "filter.recheck": "Re-check",

    "badge.known": "Familiar · {n}×",
    "badge.newArtist": "New artist",
    "badge.unheard": "{n} of {total} unheard",

    "album.tracksShort": "{n} tr.",
    "album.openOnLastfm": "Open album on Last.fm",
    "album.loading": "Loading release…",
    "album.known": "{n} of {total} heard",
    "album.inPlaylist": "In playlist",

    "type.single": "Single",
    "type.ep": "EP",
    "type.album": "Album",
    "type.compilation": "Compilation",

    "bar.picked": "Selected: {n}",
    "bar.remove": "Remove",
    "bar.addHere": "To this playlist",
    "bar.targetPlaceholder": "Playlist…",
    "combo.noMatch": "No matches",
    "bar.add": "Add",
    "bar.move": "Move",
    "bar.save": "Save to Liked",
    "bar.clear": "Clear",

    "toast.added": "Added: {n}",
    "toast.addedHere": "Added to playlist: {n}",
    "toast.moved": "Moved: {n}",
    "toast.saved": "Saved to Liked: {n}",
    "toast.removed": "Removed: {n}",
    "toast.nothingInPlaylist": "None of the selected tracks are in this playlist",
    "toast.copyCreated": "Copy created",
    "confirm.remove": {
      one: "Remove {n} track? This can’t be undone.",
      other: "Remove {n} tracks? This can’t be undone.",
    },
    "prompt.copyName": "Copy name:",
    "copy.suffix": "copy",
    "moved.lead": "Playlist Checker now lives at {domain}. To move with your settings:",
    "moved.open": "Open {domain} and load the settings file there.",
    "moved.hide": "Hide",
  },

  es: {
    "lang.label": "Idioma",
    "theme.label": "Tema",
    "theme.light": "Claro",
    "theme.dark": "Oscuro",
    "theme.system": "Sistema",
    "common.loading": "Cargando…",
    "about.link": "Acerca de",
    "nav.label": "Principal",
    "nav.account": "Cuenta",
    "nav.resetQuestion": "¿Borrar todo lo guardado en este navegador?",
    "nav.resetConfirm": "Borrar",
    "nav.resetCancel": "Cancelar",
    "about.headline": "Encuentra lo nuevo en cualquier playlist",
    "about.description":
      "Mira qué canciones de una playlist de Spotify ya escuchaste según Last.fm y quédate solo con las nuevas. Nada se guarda en el servidor.",
    "about.lead":
      "Descubre qué canciones de una playlist ya has escuchado y quédate solo con las nuevas. Tu historial de Last.fm, aplicado a tus playlists de Spotify.",
    "about.benefit1": "Cada canción y artista de la playlist se compara con tu historial de Last.fm.",
    "about.benefit2": "Lo conocido y lo nuevo se muestran por separado, para que lo nuevo destaque.",
    "about.benefit3": "Añade, mueve y quita canciones directamente en Spotify.",
    "about.howTitle": "Cómo funciona",
    "about.how":
      "Conecta tu cuenta de Spotify y tu perfil de Last.fm. La app lee tus playlists de Spotify y tu historial de escucha de Last.fm, y los pone uno junto al otro.",
    "about.privacy":
      "No se guarda nada en el servidor: tu configuración, tu sesión y las respuestas en caché se quedan en este navegador.",
    "legal.privacyLink": "Privacidad",
    "legal.termsLink": "Condiciones",
    "legal.contactLink": "Contacto",
    "legal.sourceLink": "Código fuente",
    "legal.sourceOnRequest": "disponible bajo petición en {contact}",
    "legal.poweredBy": "Con la tecnología de {link}",
    "legal.spotify": "Sin relación con Spotify ni respaldado por Spotify.",
    "legal.updated": "Última actualización: {date}",
    "legal.englishPrevails":
      "Esto es una traducción. Si difiere de la versión en inglés, prevalece la versión en inglés.",
    "privacy.title": "Privacidad",
    "privacy.description": "Qué guarda Playlist Checker, dónde lo guarda y cómo borrarlo.",
    "privacy.1":
      "En resumen: Playlist Checker no tiene base de datos ni cuentas. Todo lo que necesita se queda en tu navegador.",
    "privacy.2":
      "El almacenamiento local del navegador guarda tu configuración: el Client ID de Spotify, tu usuario y clave API de Last.fm, tu sesión de Spotify, tu idioma y tu tema, el progreso de la configuración y, durante un día, las canciones que seleccionaste. La base de datos del navegador guarda las respuestas de Last.fm hasta una semana y tu lista de playlists un cuarto de hora, para que las comprobaciones repetidas sean rápidas. Durante el inicio de sesión, la pestaña guarda dos valores de comprobación de un solo uso.",
    "privacy.3":
      "Con Spotify se conecta directamente desde tu navegador. Con Last.fm se conecta a través del servidor de este sitio, porque Last.fm no acepta llamadas desde páginas web. Esas peticiones llevan tu clave API y tu usuario de Last.fm y los nombres de artistas, canciones y álbumes que se comprueban; el servidor las reenvía, devuelve la respuesta y no guarda nada.",
    "privacy.4":
      "El sitio está alojado en Cloudflare, que procesa datos técnicos de las peticiones, como tu dirección IP, para servirlo, según su propia política de privacidad.",
    "privacy.5":
      "Las visitas se cuentan de forma anónima en el propio servidor de este sitio: de cada pantalla que abres se anota su tipo (inicio, configuración, lista de playlists, análisis, Privacidad o Condiciones), el idioma de la interfaz, si la pantalla es de un móvil, tu país y, si llegas desde otro sitio, el nombre de ese sitio. No se guarda ninguna dirección IP, cookie ni identificador, así que las visitas no pueden vincularse contigo ni entre sí, y las anotaciones se borran a los tres meses. Si tu navegador pide a los sitios que no te rastreen (Global Privacy Control o Do Not Track), no se cuenta nada. No hay rastreadores, ni publicidad, ni cookies.",
    "privacy.6": "Un archivo de configuración que guardes contiene tus claves. Mantenlo en privado.",
    "privacy.7":
      "Cerrar sesión termina tu sesión de Spotify en este navegador y conserva tus datos de Last.fm. Para borrarlo todo, usa Restablecer o elimina los datos de este sitio en la configuración del navegador. Tus listas de Spotify y tu historial de Last.fm no se ven afectados. Para retirar el acceso de la app a Spotify, quítala en Administrar apps de tu cuenta de Spotify.",
    "privacy.8":
      "Este sitio lo gestiona su propietario como proyecto personal y no comercial. Dudas: {contact}.",
    "terms.title": "Condiciones",
    "terms.description": "Las condiciones de uso de Playlist Checker.",
    "terms.1":
      "Playlist Checker se ofrece tal cual, gratis y sin ninguna garantía. Lo usas bajo tu propia responsabilidad.",
    "terms.2":
      "No está afiliado, respaldado ni patrocinado por Spotify ni por Last.fm. Spotify y Last.fm son marcas de sus propietarios.",
    "terms.3":
      "Tú aportas tu propia app de Spotify y tu clave API de Last.fm. Eres responsable de ellas y de cumplir las condiciones de Spotify y de Last.fm.",
    "terms.4":
      "Añadir, mover y quitar canciones cambia tus listas reales de Spotify. El sitio no puede deshacer esos cambios, así que revisa antes de confirmar.",
    "terms.5":
      "El servicio puede cambiar o dejar de funcionar en cualquier momento. Su código fuente se publica bajo la licencia AGPL-3.0: {source}.",
    "terms.6": "Dudas: {contact}.",
    "about.setupTime":
      "La configuración lleva unos cinco minutos: creas tu propia app de Spotify y una clave de API de Last.fm, y la guía te acompaña en ambos pasos.",
    "about.start": "Empezar",
    "about.continue": "Continuar",
    "about.shot":
      "Una playlist tras la comprobación: artistas conocidos y nuevos por separado, canciones sin escuchar seleccionadas.",
    "about.albumShot": "Abre un álbum para ver qué canciones ya has escuchado y elegir el resto.",

    "setup.title": "Configuración",
    "setup.signIn": "Iniciar sesión",
    "setup.redirectNotice": "En la configuración de tu app de Spotify, añade exactamente este Redirect URI:",
    "setup.lfmUser": "Usuario de Last.fm",
    "setup.lfmKey": "Clave de API de Last.fm",
    "setup.storedLocally": "Estos datos solo se guardan en este navegador.",
    "setup.submit": "Entrar con Spotify",
    "setup.linkSpotifyApp": "App de Spotify",
    "setup.linkLfmKey": "Clave de Last.fm",
    "setup.needClientId": "Falta el Client ID",
    "setup.needLfmUser": "Falta el usuario de Last.fm",
    "playlists.settings": "Ajustes",
    "playlists.radarNote":
      "Las listas propias de Spotify (Release Radar, Discover Weekly y similares) no están disponibles por la API. Copia sus canciones a una lista tuya en la aplicación de Spotify y analiza esa.",
    "setup.step": "Paso {n} de {total}",
    "setup.stepSpotify": "Aplicación de Spotify",
    "setup.stepLastfm": "Clave de Last.fm",
    "setup.spotify1": "Abre el panel de desarrollador de Spotify y crea una aplicación:",
    "setup.spotify2": "En Which API/SDKs are you planning to use marca solo Web API.",
    "setup.spotify4": "Copia el Client ID de la página de la aplicación y pégalo abajo.",
    "setup.copy": "Copiar",
    "setup.copied": "Dirección copiada",
    "setup.copyFailed": "No se pudo copiar: selecciona la dirección y cópiala a mano",
    "setup.clientIdBad": "Esto no parece un Client ID: 32 caracteres, dígitos y a–f.",
    "setup.lastfm1": "Rellena el formulario de clave de Last.fm y copia la API key que te dé:",
    "setup.lastfm2": "¿Ya tienes una? Tus claves existentes están aquí:",
    "setup.linkLfmKeys": "tus claves de Last.fm",
    "setup.needLfmKey": "La clave de API de Last.fm es obligatoria",
    "setup.checking": "Comprobando…",
    "setup.keyRefused": "Last.fm no aceptó esta clave",
    "setup.continue": "Continuar",
    "setup.back": "← Atrás",
    "setup.ownApp": "La aplicación que creas es tuya y apunta a este sitio.",
    "setup.redirectHint":
      "Si Spotify responde INVALID_CLIENT: Invalid redirect URI, esta dirección no está registrada en tu aplicación:",
    "setup.exportSettings": "Guardar ajustes en un archivo",
    "setup.importSettings": "Cargar ajustes desde un archivo",
    "setup.importConfirm":
      "¿Reemplazar los ajustes actuales por los de este archivo (Client ID {clientId})? Se cerrará tu sesión de Spotify.",
    "setup.importBad": "Este archivo no es una exportación de ajustes",
    "err.lfmKeyRefused": "Last.fm ya no acepta tu clave de API. Introdúcela de nuevo.",
    "err.spotifyDeclined": "Has denegado el acceso en Spotify.",
    "err.lfmBusy": "Last.fm está ocupado ahora. Espera un minuto y vuelve a intentarlo.",
    "analysis.retry": "Reintentar",
    "playlists.signOut": "Cerrar sesión",
    "signOut.notice":
      "Has cerrado sesión en Spotify en este navegador. Tu usuario y clave de Last.fm siguen guardados aquí; Restablecer también los elimina.",
    "signOut.revoke": "Quitar el acceso de la app en tu cuenta de Spotify",
    "err.signInUnverified": "No se pudo confirmar el inicio de sesión. Vuelve a iniciar sesión.",
    "err.storageBlocked":
      "Tu navegador no deja que este sitio guarde los datos que necesita el inicio de sesión. Permite los datos de este sitio y vuelve a intentarlo.",
    "err.redirectMismatch":
      "Spotify rechazó la dirección de redirección. En tu aplicación de Spotify el Redirect URI debe ser exactamente: {uri}",
    "err.unknownClient": "Spotify no conoce este Client ID. Compruébalo en la página de tu aplicación.",

    "start.spotifyRefused":
      "Spotify rechazó el acceso: {error}. Casi siempre se debe a que el Redirect URI no coincide.",
    "start.settingsLost": "Se perdió la configuración; vuelve a introducirla.",
    "start.connectSpotify": "Conecta Spotify.",
    "start.signInAgain": "Vuelve a iniciar sesión.",

    "err.tokenRefused": "Spotify no emitió el token",
    "err.sessionExpired": "La sesión caducó, vuelve a iniciar sesión",
    "err.notSignedIn": "No has iniciado sesión en Spotify",
    "err.spotify": "Error de Spotify",

    "playlists.title": "Playlists",
    "playlists.reset": "Restablecer",
    "playlists.readOnly": "Solo lectura",
    "picks.outside": {
      one: "{n} canción seleccionada no está en esta playlist.",
      other: "{n} canciones seleccionadas no están en esta playlist.",
    },
    "picks.clearOutside": "Quitarlas",
    "picks.restored": {
      one: "Se recuperó {n} canción seleccionada.",
      other: "Se recuperaron {n} canciones seleccionadas.",
    },
    "picks.restoredOutside": {
      one: "Se recuperó {n} canción seleccionada, {outside} de ellas fuera de esta playlist.",
      other: "Se recuperaron {n} canciones seleccionadas, {outside} de ellas fuera de esta playlist.",
    },
    "nav.playlistUnavailable":
      "No se pudo abrir esa playlist. Puede que se haya eliminado o que ya no tengas acceso a ella.",

    "analysis.reading": "Leyendo la playlist…",
    "analysis.progress": "Comparando con Last.fm… {done} de {total}",
    "analysis.readError":
      "No se pudieron leer las canciones de esta playlist. Spotify solo entrega el contenido de las playlists que te pertenecen o en las que colaboras; las de otros usuarios y las creadas por Spotify ya no se pueden analizar.",
    "analysis.summary": "{tracks} · {newArtists} · {unheard}",
    "analysis.truncated": {
      one: "Se muestra solo la primera canción: más allá harían falta demasiadas consultas a Last.fm.",
      other: "Se muestran las primeras {n} canciones: más allá harían falta demasiadas consultas a Last.fm.",
    },
    "analysis.spotifyOwned": "Esta playlist la gestiona Spotify; no se pueden quitar canciones.",
    "analysis.makeCopy": "Hacer una copia",
    "analysis.empty": "Nada coincide con el filtro.",

    "count.tracks": { one: "{n} canción", other: "{n} canciones" },
    "count.newArtists": { one: "{n} artista nuevo", other: "{n} artistas nuevos" },
    "count.unheard": "{n} sin escuchar",

    "filter.all": "Todos",
    "filter.unknown": "Artista desconocido",
    "filter.known": "Artista conocido",
    "filter.anyGenre": "Cualquier género",
    "filter.pickNew": "Seleccionar no escuchadas",
    "filter.pickHeard": "Seleccionar escuchadas",
    "filter.pickNone": "Deseleccionar",
    "album.pickAll": "Seleccionar todas",
    "album.pickInvert": "Invertir",
    "filter.recheck": "Volver a comprobar",

    "badge.known": "Conocido · {n}×",
    "badge.newArtist": "Artista nuevo",
    "badge.unheard": "{n} de {total} sin escuchar",

    "album.tracksShort": "{n} pist.",
    "album.openOnLastfm": "Abrir el álbum en Last.fm",
    "album.loading": "Cargando lanzamiento…",
    "album.known": "{n} de {total} escuchadas",
    "album.inPlaylist": "En la playlist",

    "type.single": "Sencillo",
    "type.ep": "EP",
    "type.album": "Álbum",
    "type.compilation": "Recopilatorio",

    "bar.picked": "Seleccionadas: {n}",
    "bar.remove": "Quitar",
    "bar.addHere": "A esta playlist",
    "bar.targetPlaceholder": "Playlist…",
    "combo.noMatch": "Sin coincidencias",
    "bar.add": "Añadir",
    "bar.move": "Mover",
    "bar.save": "Me gusta",
    "bar.clear": "Deseleccionar",

    "toast.added": "Añadidas: {n}",
    "toast.addedHere": "Añadidas a la playlist: {n}",
    "toast.moved": "Movidas: {n}",
    "toast.saved": "En Me gusta: {n}",
    "toast.removed": "Quitadas: {n}",
    "toast.nothingInPlaylist": "Nada de lo seleccionado está en esta playlist",
    "toast.copyCreated": "Copia creada",
    "confirm.remove": {
      one: "¿Quitar {n} canción? No se puede deshacer.",
      other: "¿Quitar {n} canciones? No se puede deshacer.",
    },
    "prompt.copyName": "Nombre de la copia:",
    "copy.suffix": "copia",
    "moved.lead": "Playlist Checker ahora está en {domain}. Para mudarte con tus ajustes:",
    "moved.open": "Abre {domain} y carga allí el archivo de ajustes.",
    "moved.hide": "Ocultar",
  },

  "pt-BR": {
    "lang.label": "Idioma",
    "theme.label": "Tema",
    "theme.light": "Claro",
    "theme.dark": "Escuro",
    "theme.system": "Sistema",
    "common.loading": "Carregando…",
    "about.link": "Sobre",
    "nav.label": "Principal",
    "nav.account": "Conta",
    "nav.resetQuestion": "Apagar tudo o que está guardado neste navegador?",
    "nav.resetConfirm": "Apagar",
    "nav.resetCancel": "Cancelar",
    "about.headline": "Encontre o que é novo em qualquer playlist",
    "about.description":
      "Veja quais faixas de uma playlist do Spotify você já ouviu segundo o Last.fm e fique só com as novas. Nada é guardado no servidor.",
    "about.lead":
      "Veja quais faixas de uma playlist você já ouviu e fique só com as novas. Seu histórico do Last.fm, aplicado às suas playlists do Spotify.",
    "about.benefit1": "Cada faixa e artista da playlist é comparado com seu histórico do Last.fm.",
    "about.benefit2": "O conhecido e o novo aparecem separados, para o novo se destacar.",
    "about.benefit3": "Adicione, mova e remova faixas direto no Spotify.",
    "about.howTitle": "Como funciona",
    "about.how":
      "Conecte sua conta do Spotify e seu perfil do Last.fm. O app lê suas playlists no Spotify e seu histórico de audição no Last.fm e coloca os dois lado a lado.",
    "about.privacy":
      "Nada fica guardado no servidor: suas configurações, sua sessão e as respostas em cache ficam neste navegador.",
    "legal.privacyLink": "Privacidade",
    "legal.termsLink": "Termos",
    "legal.contactLink": "Contato",
    "legal.sourceLink": "Código-fonte",
    "legal.sourceOnRequest": "disponível mediante pedido em {contact}",
    "legal.poweredBy": "Com tecnologia {link}",
    "legal.spotify": "Sem vínculo com o Spotify nem endosso dele.",
    "legal.updated": "Última atualização: {date}",
    "legal.englishPrevails": "Esta é uma tradução. Se divergir da versão em inglês, vale a versão em inglês.",
    "privacy.title": "Privacidade",
    "privacy.description": "O que o Playlist Checker guarda, onde guarda e como apagar.",
    "privacy.1":
      "Resumindo: o Playlist Checker não tem banco de dados nem contas. Tudo o que ele precisa fica no seu navegador.",
    "privacy.2":
      "O armazenamento local do navegador guarda suas configurações: o Client ID do Spotify, seu usuário e chave de API do Last.fm, sua sessão do Spotify, seu idioma e tema, o progresso da configuração e, por um dia, as faixas que você selecionou. O banco de dados do navegador guarda as respostas do Last.fm por até uma semana e sua lista de playlists por quinze minutos, para que verificações repetidas sejam rápidas. Durante a entrada, a aba guarda dois valores de verificação de uso único.",
    "privacy.3":
      "O Spotify é acessado diretamente pelo seu navegador. O Last.fm é acessado pelo servidor deste site, porque o Last.fm não aceita chamadas de páginas web. Essas requisições levam sua chave de API e seu usuário do Last.fm e os nomes de artistas, faixas e álbuns verificados; o servidor as repassa, devolve a resposta e não guarda nada.",
    "privacy.4":
      "O site é hospedado na Cloudflare, que processa dados técnicos das requisições, como seu endereço IP, para entregá-lo, conforme a própria política de privacidade.",
    "privacy.5":
      "As visitas são contadas de forma anônima no próprio servidor deste site: de cada tela que você abre são anotados o tipo (início, configuração, lista de playlists, análise, Privacidade ou Termos), o idioma da interface, se a tela é de celular, o seu país e, quando você chega de outro site, o nome desse site. Nenhum endereço IP, cookie ou identificador é guardado, então as visitas não podem ser ligadas a você nem umas às outras, e as anotações são apagadas após três meses. Se o seu navegador pede aos sites que não rastreiem você (Global Privacy Control ou Do Not Track), nada é contado. Não há rastreadores, publicidade nem cookies.",
    "privacy.6": "Um arquivo de configurações que você salvar contém suas chaves. Guarde-o em sigilo.",
    "privacy.7":
      "Sair encerra sua sessão do Spotify neste navegador e mantém seus dados do Last.fm. Para apagar tudo, use Redefinir ou limpe os dados deste site nas configurações do navegador. Suas playlists do Spotify e seu histórico do Last.fm não são afetados. Para revogar o acesso do app ao Spotify, remova-o em Gerenciar apps na sua conta do Spotify.",
    "privacy.8": "Este site é mantido pelo dono como projeto pessoal e não comercial. Dúvidas: {contact}.",
    "terms.title": "Termos",
    "terms.description": "Os termos de uso do Playlist Checker.",
    "terms.1":
      "O Playlist Checker é oferecido como está, gratuitamente e sem qualquer garantia. O uso é por sua conta e risco.",
    "terms.2":
      "Ele não é afiliado, endossado nem patrocinado pelo Spotify ou pelo Last.fm. Spotify e Last.fm são marcas de seus donos.",
    "terms.3":
      "Você fornece seu próprio app do Spotify e sua chave de API do Last.fm. Você é responsável por eles e por seguir os termos do Spotify e do Last.fm.",
    "terms.4":
      "Adicionar, mover e remover faixas altera suas playlists reais do Spotify. O site não pode desfazer essas mudanças, então confira antes de confirmar.",
    "terms.5":
      "O serviço pode mudar ou parar a qualquer momento. O código-fonte é publicado sob a licença AGPL-3.0: {source}.",
    "terms.6": "Dúvidas: {contact}.",
    "about.setupTime":
      "A configuração leva uns cinco minutos: você cria seu próprio app no Spotify e uma chave de API do Last.fm, e o guia acompanha os dois passos.",
    "about.start": "Começar",
    "about.continue": "Continuar",
    "about.shot":
      "Uma playlist depois da verificação: artistas conhecidos e novos separados, faixas não ouvidas selecionadas.",
    "about.albumShot": "Abra um álbum para ver quais faixas você já ouviu e escolher o resto.",

    "setup.title": "Configuração",
    "setup.signIn": "Entrar",
    "setup.redirectNotice": "Nas configurações do seu app do Spotify, adicione exatamente este Redirect URI:",
    "setup.lfmUser": "Usuário do Last.fm",
    "setup.lfmKey": "Chave da API do Last.fm",
    "setup.storedLocally": "Esses dados ficam salvos apenas neste navegador.",
    "setup.submit": "Entrar com o Spotify",
    "setup.linkSpotifyApp": "App do Spotify",
    "setup.linkLfmKey": "Chave do Last.fm",
    "setup.needClientId": "Informe o Client ID",
    "setup.needLfmUser": "Informe o usuário do Last.fm",
    "playlists.settings": "Configurações",
    "playlists.radarNote":
      "As listas do próprio Spotify (Release Radar, Discover Weekly e afins) não estão disponíveis pela API. Copie as faixas para uma lista sua no aplicativo do Spotify e analise essa.",
    "setup.step": "Etapa {n} de {total}",
    "setup.stepSpotify": "Aplicativo do Spotify",
    "setup.stepLastfm": "Chave do Last.fm",
    "setup.spotify1": "Abra o painel de desenvolvedor do Spotify e crie um aplicativo:",
    "setup.spotify2": "Em Which API/SDKs are you planning to use marque apenas Web API.",
    "setup.spotify4": "Copie o Client ID da página do aplicativo e cole abaixo.",
    "setup.copy": "Copiar",
    "setup.copied": "Endereço copiado",
    "setup.copyFailed": "Não foi possível copiar: selecione o endereço e copie manualmente",
    "setup.clientIdBad": "Isso não parece um Client ID: 32 caracteres, dígitos e a–f.",
    "setup.lastfm1": "Preencha o formulário de chave do Last.fm e copie a API key gerada:",
    "setup.lastfm2": "Já criou uma? Suas chaves existentes estão aqui:",
    "setup.linkLfmKeys": "suas chaves do Last.fm",
    "setup.needLfmKey": "A chave de API do Last.fm é obrigatória",
    "setup.checking": "Verificando…",
    "setup.keyRefused": "O Last.fm não aceitou esta chave",
    "setup.continue": "Continuar",
    "setup.back": "← Voltar",
    "setup.ownApp": "O aplicativo que você cria é seu e aponta para este site.",
    "setup.redirectHint":
      "Se o Spotify responder INVALID_CLIENT: Invalid redirect URI, este endereço não está registrado no seu aplicativo:",
    "setup.exportSettings": "Salvar configurações em um arquivo",
    "setup.importSettings": "Carregar configurações de um arquivo",
    "setup.importConfirm":
      "Substituir as configurações atuais pelas deste arquivo (Client ID {clientId})? Você sairá da sua conta do Spotify.",
    "setup.importBad": "Este arquivo não é uma exportação de configurações",
    "err.lfmKeyRefused": "O Last.fm não aceita mais sua chave de API. Informe-a novamente.",
    "err.spotifyDeclined": "Você negou o acesso no Spotify.",
    "err.lfmBusy": "O Last.fm está ocupado agora. Espere um minuto e tente de novo.",
    "analysis.retry": "Tentar de novo",
    "playlists.signOut": "Sair",
    "signOut.notice":
      "Você saiu do Spotify neste navegador. Seu usuário e chave do Last.fm continuam guardados aqui; Redefinir também os apaga.",
    "signOut.revoke": "Remover o acesso do app na sua conta do Spotify",
    "err.signInUnverified": "Não foi possível confirmar a entrada. Entre novamente.",
    "err.storageBlocked":
      "Seu navegador não deixa este site guardar os dados de que a entrada precisa. Permita os dados deste site e tente de novo.",
    "err.redirectMismatch":
      "O Spotify recusou o endereço de redirecionamento. No seu aplicativo do Spotify o Redirect URI precisa ser exatamente: {uri}",
    "err.unknownClient": "O Spotify não conhece este Client ID. Verifique na página do seu aplicativo.",

    "start.spotifyRefused": "O Spotify recusou: {error}. Geralmente o Redirect URI não confere.",
    "start.settingsLost": "As configurações se perderam — preencha de novo.",
    "start.connectSpotify": "Conecte o Spotify.",
    "start.signInAgain": "Entre novamente.",

    "err.tokenRefused": "O Spotify recusou o token",
    "err.sessionExpired": "A sessão expirou, entre novamente",
    "err.notSignedIn": "Você não entrou no Spotify",
    "err.spotify": "Erro do Spotify",

    "playlists.title": "Playlists",
    "playlists.reset": "Redefinir",
    "playlists.readOnly": "Somente leitura",
    "picks.outside": {
      one: "{n} faixa selecionada não está nesta playlist.",
      other: "{n} faixas selecionadas não estão nesta playlist.",
    },
    "picks.clearOutside": "Remover",
    "picks.restored": {
      one: "{n} faixa selecionada foi restaurada.",
      other: "{n} faixas selecionadas foram restauradas.",
    },
    "picks.restoredOutside": {
      one: "{n} faixa selecionada foi restaurada, {outside} delas fora desta playlist.",
      other: "{n} faixas selecionadas foram restauradas, {outside} delas fora desta playlist.",
    },
    "nav.playlistUnavailable":
      "Não foi possível abrir essa playlist. Ela pode ter sido excluída ou você pode não ter mais acesso a ela.",

    "analysis.reading": "Lendo a playlist…",
    "analysis.progress": "Comparando com o Last.fm… {done} de {total}",
    "analysis.readError":
      "Não foi possível ler as faixas desta playlist. O Spotify só fornece o conteúdo de playlists que são suas ou em que você colabora — playlists de outras pessoas e as feitas pelo Spotify não podem mais ser analisadas.",
    "analysis.summary": "{tracks} · {newArtists} · {unheard}",
    "analysis.truncated": {
      one: "Mostrando só a primeira faixa — além disso seriam requisições demais ao Last.fm.",
      other: "Mostrando as primeiras {n} faixas — além disso seriam requisições demais ao Last.fm.",
    },
    "analysis.spotifyOwned": "Esta playlist é montada pelo Spotify; não é possível remover faixas dela.",
    "analysis.makeCopy": "Fazer uma cópia",
    "analysis.empty": "Nada corresponde ao filtro.",

    "count.tracks": { one: "{n} faixa", other: "{n} faixas" },
    "count.newArtists": { one: "{n} artista novo", other: "{n} artistas novos" },
    "count.unheard": "{n} não ouvidas",

    "filter.all": "Todos",
    "filter.unknown": "Artista desconhecido",
    "filter.known": "Artista conhecido",
    "filter.anyGenre": "Qualquer gênero",
    "filter.pickNew": "Selecionar não ouvidas",
    "filter.pickHeard": "Selecionar ouvidas",
    "filter.pickNone": "Limpar",
    "album.pickAll": "Selecionar todas",
    "album.pickInvert": "Inverter",
    "filter.recheck": "Verificar de novo",

    "badge.known": "Conhecido · {n}×",
    "badge.newArtist": "Artista novo",
    "badge.unheard": "{n} de {total} não ouvidas",

    "album.tracksShort": "{n} fx.",
    "album.openOnLastfm": "Abrir o álbum no Last.fm",
    "album.loading": "Carregando lançamento…",
    "album.known": "{n} de {total} ouvidas",
    "album.inPlaylist": "Na playlist",

    "type.single": "Single",
    "type.ep": "EP",
    "type.album": "Álbum",
    "type.compilation": "Coletânea",

    "bar.picked": "Selecionadas: {n}",
    "bar.remove": "Remover",
    "bar.addHere": "Nesta playlist",
    "bar.targetPlaceholder": "Playlist…",
    "combo.noMatch": "Nenhum resultado",
    "bar.add": "Adicionar",
    "bar.move": "Mover",
    "bar.save": "Curtir",
    "bar.clear": "Limpar",

    "toast.added": "Adicionadas: {n}",
    "toast.addedHere": "Adicionadas à playlist: {n}",
    "toast.moved": "Movidas: {n}",
    "toast.saved": "Curtidas: {n}",
    "toast.removed": "Removidas: {n}",
    "toast.nothingInPlaylist": "Nenhuma faixa selecionada está nesta playlist",
    "toast.copyCreated": "Cópia criada",
    "confirm.remove": {
      one: "Remover {n} faixa? Não dá para desfazer.",
      other: "Remover {n} faixas? Não dá para desfazer.",
    },
    "prompt.copyName": "Nome da cópia:",
    "copy.suffix": "cópia",
    "moved.lead": "O Playlist Checker agora fica em {domain}. Para levar suas configurações:",
    "moved.open": "Abra {domain} e carregue lá o arquivo de configurações.",
    "moved.hide": "Ocultar",
  },

  de: {
    "lang.label": "Sprache",
    "theme.label": "Erscheinungsbild",
    "theme.light": "Hell",
    "theme.dark": "Dunkel",
    "theme.system": "System",
    "common.loading": "Wird geladen…",
    "about.link": "Über",
    "nav.label": "Hauptmenü",
    "nav.account": "Konto",
    "nav.resetQuestion": "Alles löschen, was in diesem Browser gespeichert ist?",
    "nav.resetConfirm": "Löschen",
    "nav.resetCancel": "Abbrechen",
    "about.headline": "Finde das Neue in jeder Playlist",
    "about.description":
      "Sieh, welche Titel einer Spotify-Playlist du laut Last.fm schon gehört hast, und behalte nur die neuen. Auf dem Server wird nichts gespeichert.",
    "about.lead":
      "Sieh, welche Titel einer Playlist du schon gehört hast – und behalte nur die neuen. Dein Last.fm-Verlauf, angewendet auf deine Spotify-Playlists.",
    "about.benefit1": "Alle Titel und Künstler einer Playlist werden mit deinem Last.fm-Verlauf abgeglichen.",
    "about.benefit2": "Bekanntes und Neues werden getrennt angezeigt, damit das Neue heraussticht.",
    "about.benefit3": "Titel direkt in Spotify hinzufügen, verschieben und entfernen.",
    "about.howTitle": "So funktioniert’s",
    "about.how":
      "Verbinde dein Spotify-Konto und dein Last.fm-Profil. Die App liest deine Playlists aus Spotify und deinen Hörverlauf aus Last.fm und stellt beides nebeneinander.",
    "about.privacy":
      "Auf dem Server wird nichts gespeichert: Einstellungen, Sitzung und zwischengespeicherte Antworten bleiben in diesem Browser.",
    "legal.privacyLink": "Datenschutz",
    "legal.termsLink": "Nutzungsbedingungen",
    "legal.contactLink": "Kontakt",
    "legal.sourceLink": "Quellcode",
    "legal.sourceOnRequest": "auf Anfrage erhältlich über {contact}",
    "legal.poweredBy": "Mit Daten von {link}",
    "legal.spotify": "Nicht mit Spotify verbunden und nicht von Spotify unterstützt.",
    "legal.updated": "Zuletzt aktualisiert: {date}",
    "legal.englishPrevails":
      "Dies ist eine Übersetzung. Weicht sie von der englischen Fassung ab, gilt die englische Fassung.",
    "privacy.title": "Datenschutz",
    "privacy.description": "Was Playlist Checker speichert, wo, und wie du es löschst.",
    "privacy.1":
      "Kurz gesagt: Playlist Checker hat keine Datenbank und keine Konten. Alles, was es braucht, bleibt in deinem Browser.",
    "privacy.2":
      "Der lokale Speicher deines Browsers enthält deine Einstellungen: die Spotify Client ID, deinen Last.fm-Benutzernamen und API-Schlüssel, deine Spotify-Sitzung, Sprache und Design, den Einrichtungsfortschritt und für einen Tag die ausgewählten Titel. Die Datenbank deines Browsers hält Last.fm-Antworten bis zu einer Woche und deine Playlist-Liste eine Viertelstunde vor, damit wiederholte Prüfungen schnell gehen. Während der Anmeldung hält der Tab zwei einmalige Prüfwerte.",
    "privacy.3":
      "Spotify wird direkt aus deinem Browser angesprochen. Last.fm wird über den Server dieser Seite angesprochen, weil Last.fm keine Aufrufe aus Webseiten zulässt. Diese Anfragen enthalten deinen Last.fm-API-Schlüssel und -Benutzernamen und die geprüften Künstler-, Titel- und Albumnamen; der Server leitet sie weiter, gibt die Antwort zurück und speichert nichts.",
    "privacy.4":
      "Die Seite wird bei Cloudflare gehostet. Cloudflare verarbeitet technische Anfragedaten wie deine IP-Adresse, um sie auszuliefern, nach eigener Datenschutzerklärung.",
    "privacy.5":
      "Besuche werden anonym auf dem eigenen Server dieser Seite gezählt: Für jede geöffnete Ansicht wird ihre Art (Start, Einrichtung, Playlist-Liste, Analyse, Datenschutz oder Nutzungsbedingungen) notiert, die Sprache der Oberfläche, ob es ein Handybildschirm ist, dein Land und, wenn du von einer anderen Seite kommst, deren Name. Es werden keine IP-Adresse, kein Cookie und keine Kennung gespeichert, daher lassen sich Besuche weder dir noch einander zuordnen, und die Einträge werden nach drei Monaten gelöscht. Wenn dein Browser Seiten bittet, dich nicht zu verfolgen (Global Privacy Control oder Do Not Track), wird nichts gezählt. Es gibt keine Tracker, keine Werbung und keine Cookies.",
    "privacy.6": "Eine gespeicherte Einstellungsdatei enthält deine Schlüssel. Gib sie nicht weiter.",
    "privacy.7":
      "Abmelden beendet deine Spotify-Sitzung in diesem Browser und behält deine Last.fm-Daten. Um alles zu löschen, nutze Zurücksetzen oder entferne die Daten dieser Seite in den Browser-Einstellungen. Deine Spotify-Playlists und dein Last.fm-Verlauf bleiben unberührt. Um der App den Zugriff auf Spotify zu entziehen, entferne sie unter Apps verwalten in deinem Spotify-Konto.",
    "privacy.8":
      "Diese Seite wird von ihrem Inhaber als privates, nicht kommerzielles Projekt betrieben. Fragen: {contact}.",
    "terms.title": "Nutzungsbedingungen",
    "terms.description": "Die Bedingungen für die Nutzung von Playlist Checker.",
    "terms.1":
      "Playlist Checker wird so bereitgestellt, wie es ist, kostenlos und ohne jede Gewährleistung. Die Nutzung erfolgt auf eigenes Risiko.",
    "terms.2":
      "Es ist weder mit Spotify noch mit Last.fm verbunden und wird von ihnen weder unterstützt noch gesponsert. Spotify und Last.fm sind Marken ihrer Inhaber.",
    "terms.3":
      "Du bringst deine eigene Spotify-App und deinen eigenen Last.fm-API-Schlüssel mit. Du bist für sie verantwortlich und dafür, die Bedingungen von Spotify und Last.fm einzuhalten.",
    "terms.4":
      "Hinzufügen, Verschieben und Entfernen von Titeln ändert deine echten Spotify-Playlists. Die Seite kann diese Änderungen nicht rückgängig machen, also prüfe vor dem Bestätigen.",
    "terms.5":
      "Der Dienst kann sich jederzeit ändern oder eingestellt werden. Der Quellcode ist unter der Lizenz AGPL-3.0 veröffentlicht: {source}.",
    "terms.6": "Fragen: {contact}.",
    "about.setupTime":
      "Die Einrichtung dauert etwa fünf Minuten: Du legst deine eigene Spotify-App und einen Last.fm-API-Schlüssel an, und die Anleitung führt dich durch beides.",
    "about.start": "Los geht’s",
    "about.continue": "Weiter",
    "about.shot":
      "Eine Playlist nach der Prüfung: bekannte und neue Künstler getrennt, ungehörte Titel ausgewählt.",
    "about.albumShot":
      "Öffne ein Album, um zu sehen, welche Titel du schon gehört hast, und wähle den Rest aus.",

    "setup.title": "Einrichtung",
    "setup.signIn": "Anmelden",
    "setup.redirectNotice": "Trage in den Einstellungen deiner Spotify-App genau diese Redirect URI ein:",
    "setup.lfmUser": "Last.fm-Benutzername",
    "setup.lfmKey": "Last.fm-API-Schlüssel",
    "setup.storedLocally": "Die Angaben werden nur in diesem Browser gespeichert.",
    "setup.submit": "Mit Spotify anmelden",
    "setup.linkSpotifyApp": "Spotify-App",
    "setup.linkLfmKey": "Last.fm-Schlüssel",
    "setup.needClientId": "Client ID fehlt",
    "setup.needLfmUser": "Last.fm-Benutzername fehlt",
    "playlists.settings": "Einstellungen",
    "playlists.radarNote":
      "Spotifys eigene Playlists (Release Radar, Discover Weekly und ähnliche) sind über die API nicht verfügbar. Kopiere ihre Titel in der Spotify-App in eine eigene Playlist und analysiere diese.",
    "setup.step": "Schritt {n} von {total}",
    "setup.stepSpotify": "Spotify-App",
    "setup.stepLastfm": "Last.fm-Schlüssel",
    "setup.spotify1": "Öffne das Spotify-Entwickler-Dashboard und lege eine App an:",
    "setup.spotify2": "Markiere unter Which API/SDKs are you planning to use nur Web API.",
    "setup.spotify4": "Kopiere die Client ID von der App-Seite und füge sie unten ein.",
    "setup.copy": "Kopieren",
    "setup.copied": "Adresse kopiert",
    "setup.copyFailed": "Kopieren nicht möglich: Adresse markieren und von Hand kopieren",
    "setup.clientIdBad": "Das sieht nicht nach einer Client ID aus: 32 Zeichen, Ziffern und a–f.",
    "setup.lastfm1": "Fülle das Last.fm-Schlüsselformular aus und kopiere den API-Key:",
    "setup.lastfm2": "Schon eine angelegt? Deine vorhandenen Schlüssel stehen hier:",
    "setup.linkLfmKeys": "deine Last.fm-Schlüssel",
    "setup.needLfmKey": "Der Last.fm-API-Schlüssel ist erforderlich",
    "setup.checking": "Prüfung…",
    "setup.keyRefused": "Last.fm hat diesen Schlüssel nicht akzeptiert",
    "setup.continue": "Weiter",
    "setup.back": "← Zurück",
    "setup.ownApp": "Die App, die du anlegst, gehört dir und zeigt auf diese Seite.",
    "setup.redirectHint":
      "Wenn Spotify mit INVALID_CLIENT: Invalid redirect URI antwortet, ist diese Adresse in deiner App nicht eingetragen:",
    "setup.exportSettings": "Einstellungen in eine Datei speichern",
    "setup.importSettings": "Einstellungen aus einer Datei laden",
    "setup.importConfirm":
      "Aktuelle Einstellungen durch die aus dieser Datei ersetzen (Client ID {clientId})? Du wirst bei Spotify abgemeldet.",
    "setup.importBad": "Diese Datei ist kein Einstellungs-Export",
    "err.lfmKeyRefused": "Last.fm akzeptiert deinen API-Schlüssel nicht mehr. Bitte neu eingeben.",
    "err.spotifyDeclined": "Du hast den Zugriff in Spotify abgelehnt.",
    "err.lfmBusy": "Last.fm ist gerade ausgelastet. Warte eine Minute und versuche es erneut.",
    "analysis.retry": "Erneut versuchen",
    "playlists.signOut": "Abmelden",
    "signOut.notice":
      "Du bist in diesem Browser bei Spotify abgemeldet. Dein Last.fm-Benutzername und -Schlüssel bleiben hier gespeichert; Zurücksetzen entfernt auch sie.",
    "signOut.revoke": "Zugriff der App in deinem Spotify-Konto entfernen",
    "err.signInUnverified": "Die Anmeldung konnte nicht bestätigt werden. Bitte melde dich erneut an.",
    "err.storageBlocked":
      "Dein Browser lässt diese Seite die für die Anmeldung nötigen Daten nicht speichern. Erlaube Websitedaten für diese Seite und versuche es erneut.",
    "err.redirectMismatch":
      "Spotify hat die Redirect-Adresse abgelehnt. In deiner Spotify-App muss die Redirect URI genau das sein: {uri}",
    "err.unknownClient": "Spotify kennt diese Client ID nicht. Prüfe sie auf der Seite deiner App.",

    "start.spotifyRefused": "Spotify hat abgelehnt: {error}. Meist passt die Redirect URI nicht.",
    "start.settingsLost": "Die Einstellungen sind verloren gegangen – bitte erneut eingeben.",
    "start.connectSpotify": "Verbinde Spotify.",
    "start.signInAgain": "Bitte melde dich erneut an.",

    "err.tokenRefused": "Spotify hat kein Token ausgestellt",
    "err.sessionExpired": "Sitzung abgelaufen, bitte erneut anmelden",
    "err.notSignedIn": "Nicht bei Spotify angemeldet",
    "err.spotify": "Spotify-Fehler",

    "playlists.title": "Playlists",
    "playlists.reset": "Zurücksetzen",
    "playlists.readOnly": "Nur lesen",
    "picks.outside": {
      one: "{n} ausgewählter Titel ist nicht in dieser Playlist.",
      other: "{n} ausgewählte Titel sind nicht in dieser Playlist.",
    },
    "picks.clearOutside": "Entfernen",
    "picks.restored": {
      one: "{n} ausgewählter Titel wiederhergestellt.",
      other: "{n} ausgewählte Titel wiederhergestellt.",
    },
    "picks.restoredOutside": {
      one: "{n} ausgewählter Titel wiederhergestellt, davon {outside} nicht in dieser Playlist.",
      other: "{n} ausgewählte Titel wiederhergestellt, davon {outside} nicht in dieser Playlist.",
    },
    "nav.playlistUnavailable":
      "Diese Playlist konnte nicht geöffnet werden. Vielleicht wurde sie gelöscht, oder du hast keinen Zugriff mehr darauf.",

    "analysis.reading": "Playlist wird gelesen…",
    "analysis.progress": "Abgleich mit Last.fm… {done} von {total}",
    "analysis.readError":
      "Die Titel dieser Playlist konnten nicht gelesen werden. Spotify liefert Inhalte nur für Playlists, die dir gehören oder an denen du mitarbeitest – fremde und von Spotify kuratierte Playlists lassen sich nicht mehr analysieren.",
    "analysis.summary": "{tracks} · {newArtists} · {unheard}",
    "analysis.truncated": {
      one: "Angezeigt wird nur der erste Titel – mehr würde zu viele Last.fm-Anfragen erfordern.",
      other: "Angezeigt werden die ersten {n} Titel – mehr würde zu viele Last.fm-Anfragen erfordern.",
    },
    "analysis.spotifyOwned":
      "Diese Playlist wird von Spotify zusammengestellt, daraus kann nichts entfernt werden.",
    "analysis.makeCopy": "Kopie erstellen",
    "analysis.empty": "Nichts passt zum Filter.",

    "count.tracks": { one: "{n} Titel", other: "{n} Titel" },
    "count.newArtists": { one: "{n} neuer Künstler", other: "{n} neue Künstler" },
    "count.unheard": "{n} nicht gehört",

    "filter.all": "Alle",
    "filter.unknown": "Künstler unbekannt",
    "filter.known": "Künstler bekannt",
    "filter.anyGenre": "Jedes Genre",
    "filter.pickNew": "Ungehörte auswählen",
    "filter.pickHeard": "Gehörte auswählen",
    "filter.pickNone": "Abwählen",
    "album.pickAll": "Alle auswählen",
    "album.pickInvert": "Umkehren",
    "filter.recheck": "Neu prüfen",

    "badge.known": "Bekannt · {n}×",
    "badge.newArtist": "Neuer Künstler",
    "badge.unheard": "{n} von {total} nicht gehört",

    "album.tracksShort": "{n} Tit.",
    "album.openOnLastfm": "Album auf Last.fm öffnen",
    "album.loading": "Release wird geladen…",
    "album.known": "{n} von {total} gehört",
    "album.inPlaylist": "In der Playlist",

    "type.single": "Single",
    "type.ep": "EP",
    "type.album": "Album",
    "type.compilation": "Compilation",

    "bar.picked": "Ausgewählt: {n}",
    "bar.remove": "Entfernen",
    "bar.addHere": "In diese Playlist",
    "bar.targetPlaceholder": "Playlist…",
    "combo.noMatch": "Keine Treffer",
    "bar.add": "Hinzufügen",
    "bar.move": "Verschieben",
    "bar.save": "Lieblingssongs",
    "bar.clear": "Abwählen",

    "toast.added": "Hinzugefügt: {n}",
    "toast.addedHere": "Zur Playlist hinzugefügt: {n}",
    "toast.moved": "Verschoben: {n}",
    "toast.saved": "In Lieblingssongs: {n}",
    "toast.removed": "Entfernt: {n}",
    "toast.nothingInPlaylist": "Keiner der ausgewählten Titel ist in dieser Playlist",
    "toast.copyCreated": "Kopie erstellt",
    "confirm.remove": {
      one: "{n} Titel entfernen? Das lässt sich nicht rückgängig machen.",
      other: "{n} Titel entfernen? Das lässt sich nicht rückgängig machen.",
    },
    "prompt.copyName": "Name der Kopie:",
    "copy.suffix": "Kopie",
    "moved.lead":
      "Playlist Checker ist jetzt unter {domain} zu finden. So nimmst du deine Einstellungen mit:",
    "moved.open": "Öffne {domain} und lade dort die Einstellungsdatei.",
    "moved.hide": "Ausblenden",
  },

  fr: {
    "lang.label": "Langue",
    "theme.label": "Thème",
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "theme.system": "Système",
    "common.loading": "Chargement…",
    "about.link": "À propos",
    "nav.label": "Principal",
    "nav.account": "Compte",
    "nav.resetQuestion": "Effacer tout ce qui est enregistré dans ce navigateur ?",
    "nav.resetConfirm": "Effacer",
    "nav.resetCancel": "Annuler",
    "about.headline": "Trouvez la nouveauté dans n’importe quelle playlist",
    "about.description":
      "Voyez quels titres d’une playlist Spotify vous avez déjà écoutés selon Last.fm, et ne gardez que les nouveaux. Rien n’est conservé sur le serveur.",
    "about.lead":
      "Voyez quels titres d’une playlist vous avez déjà écoutés et ne gardez que les nouveaux. Votre historique Last.fm, appliqué à vos playlists Spotify.",
    "about.benefit1": "Chaque titre et chaque artiste de la playlist est comparé à votre historique Last.fm.",
    "about.benefit2": "Le connu et le nouveau sont affichés à part, pour que le nouveau ressorte.",
    "about.benefit3": "Ajoutez, déplacez et retirez des titres directement dans Spotify.",
    "about.howTitle": "Comment ça marche",
    "about.how":
      "Connectez votre compte Spotify et votre profil Last.fm. L’app lit vos playlists sur Spotify et votre historique d’écoute sur Last.fm, puis les met côte à côte.",
    "about.privacy":
      "Rien n’est conservé sur le serveur : vos réglages, votre session et les réponses en cache restent dans ce navigateur.",
    "legal.privacyLink": "Confidentialité",
    "legal.termsLink": "Conditions",
    "legal.contactLink": "Contact",
    "legal.sourceLink": "Code source",
    "legal.sourceOnRequest": "disponible sur demande à {contact}",
    "legal.poweredBy": "Propulsé par {link}",
    "legal.spotify": "Non affilié à Spotify ni approuvé par Spotify.",
    "legal.updated": "Dernière mise à jour : {date}",
    "legal.englishPrevails":
      "Ceci est une traduction. En cas de différence avec la version anglaise, la version anglaise prévaut.",
    "privacy.title": "Confidentialité",
    "privacy.description": "Ce que Playlist Checker conserve, où, et comment l’effacer.",
    "privacy.1":
      "En bref : Playlist Checker n’a ni base de données ni comptes. Tout ce dont il a besoin reste dans ton navigateur.",
    "privacy.2":
      "Le stockage local du navigateur conserve tes réglages : le Client ID Spotify, ton nom d’utilisateur et ta clé API Last.fm, ta session Spotify, ta langue et ton thème, la progression de la configuration et, pendant un jour, les titres sélectionnés. La base de données du navigateur garde les réponses de Last.fm jusqu’à une semaine et ta liste de playlists un quart d’heure, pour que les vérifications répétées soient rapides. Pendant la connexion, l’onglet garde deux valeurs de contrôle à usage unique.",
    "privacy.3":
      "Spotify est contacté directement depuis ton navigateur. Last.fm est contacté via le serveur de ce site, car Last.fm n’accepte pas les appels depuis des pages web. Ces requêtes transportent ta clé API et ton nom d’utilisateur Last.fm et les noms d’artistes, de titres et d’albums vérifiés ; le serveur les transmet, renvoie la réponse et ne garde rien.",
    "privacy.4":
      "Le site est hébergé chez Cloudflare, qui traite des données techniques des requêtes, comme ton adresse IP, pour le servir, selon sa propre politique de confidentialité.",
    "privacy.5":
      "Les visites sont comptées de façon anonyme sur le propre serveur de ce site : pour chaque écran que tu ouvres, on note son type (accueil, configuration, liste des playlists, analyse, Confidentialité ou Conditions), la langue de l’interface, s’il s’agit d’un écran de téléphone, ton pays et, si tu arrives depuis un autre site, le nom de ce site. Aucune adresse IP, aucun cookie ni identifiant n’est conservé : les visites ne peuvent être reliées ni à toi ni entre elles, et les notes sont effacées au bout de trois mois. Si ton navigateur demande aux sites de ne pas te suivre (Global Privacy Control ou Do Not Track), rien n’est compté. Il n’y a ni traceurs, ni publicité, ni cookies.",
    "privacy.6": "Un fichier de réglages que tu enregistres contient tes clés. Garde-le pour toi.",
    "privacy.7":
      "Se déconnecter met fin à ta session Spotify dans ce navigateur et garde tes données Last.fm. Pour tout effacer, utilise Réinitialiser ou supprime les données de ce site dans les réglages du navigateur. Tes playlists Spotify et ton historique Last.fm ne sont pas touchés. Pour retirer l’accès de l’app à Spotify, supprime-la dans Gérer les applis de ton compte Spotify.",
    "privacy.8":
      "Ce site est tenu par son propriétaire comme projet personnel et non commercial. Questions : {contact}.",
    "terms.title": "Conditions",
    "terms.description": "Les conditions d’utilisation de Playlist Checker.",
    "terms.1":
      "Playlist Checker est fourni tel quel, gratuitement et sans aucune garantie. Tu l’utilises à tes propres risques.",
    "terms.2":
      "Il n’est ni affilié, ni approuvé, ni sponsorisé par Spotify ou Last.fm. Spotify et Last.fm sont des marques de leurs propriétaires.",
    "terms.3":
      "Tu fournis ta propre app Spotify et ta propre clé API Last.fm. Tu en es responsable, ainsi que du respect des conditions de Spotify et de Last.fm.",
    "terms.4":
      "Ajouter, déplacer et retirer des titres modifie tes vraies playlists Spotify. Le site ne peut pas annuler ces changements, alors vérifie avant de confirmer.",
    "terms.5":
      "Le service peut changer ou s’arrêter à tout moment. Son code source est publié sous licence AGPL-3.0 : {source}.",
    "terms.6": "Questions : {contact}.",
    "about.setupTime":
      "La configuration prend environ cinq minutes : vous créez votre propre app Spotify et une clé d’API Last.fm, et le guide vous accompagne pour les deux.",
    "about.start": "Commencer",
    "about.continue": "Continuer",
    "about.shot":
      "Une playlist après l’analyse : artistes connus et nouveaux à part, titres jamais écoutés sélectionnés.",
    "about.albumShot": "Ouvrez un album pour voir quels titres vous avez déjà écoutés et choisir les autres.",

    "setup.title": "Configuration",
    "setup.signIn": "Connexion",
    "setup.redirectNotice": "Dans les paramètres de ton app Spotify, ajoute exactement cette Redirect URI :",
    "setup.lfmUser": "Pseudo Last.fm",
    "setup.lfmKey": "Clé API Last.fm",
    "setup.storedLocally": "Ces valeurs ne sont stockées que dans ce navigateur.",
    "setup.submit": "Se connecter avec Spotify",
    "setup.linkSpotifyApp": "App Spotify",
    "setup.linkLfmKey": "Clé Last.fm",
    "setup.needClientId": "Le Client ID est requis",
    "setup.needLfmUser": "Le pseudo Last.fm est requis",
    "playlists.settings": "Paramètres",
    "playlists.radarNote":
      "Les playlists de Spotify (Release Radar, Discover Weekly et similaires) ne sont pas accessibles par l'API. Copiez leurs titres dans une playlist à vous depuis l'application Spotify, puis analysez celle-ci.",
    "setup.step": "Étape {n} sur {total}",
    "setup.stepSpotify": "Application Spotify",
    "setup.stepLastfm": "Clé Last.fm",
    "setup.spotify1": "Ouvrez le tableau de bord développeur Spotify et créez une application :",
    "setup.spotify2": "Dans Which API/SDKs are you planning to use, cochez uniquement Web API.",
    "setup.spotify4": "Copiez le Client ID depuis la page de l'application et collez-le ci-dessous.",
    "setup.copy": "Copier",
    "setup.copied": "Adresse copiée",
    "setup.copyFailed": "Copie impossible : sélectionnez l'adresse et copiez-la à la main",
    "setup.clientIdBad": "Cela ne ressemble pas à un Client ID : 32 caractères, chiffres et a–f.",
    "setup.lastfm1": "Remplissez le formulaire de clé Last.fm et copiez la clé API obtenue :",
    "setup.lastfm2": "Vous en avez déjà une ? Vos clés existantes sont ici :",
    "setup.linkLfmKeys": "vos clés Last.fm",
    "setup.needLfmKey": "La clé API Last.fm est obligatoire",
    "setup.checking": "Vérification…",
    "setup.keyRefused": "Last.fm n'a pas accepté cette clé",
    "setup.continue": "Continuer",
    "setup.back": "← Retour",
    "setup.ownApp": "L'application que vous créez vous appartient et pointe vers ce site.",
    "setup.redirectHint":
      "Si Spotify répond INVALID_CLIENT: Invalid redirect URI, cette adresse n'est pas enregistrée dans votre application :",
    "setup.exportSettings": "Enregistrer les paramètres dans un fichier",
    "setup.importSettings": "Charger les paramètres depuis un fichier",
    "setup.importConfirm":
      "Remplacer les paramètres actuels par ceux de ce fichier (Client ID {clientId}) ? Vous serez déconnecté de Spotify.",
    "setup.importBad": "Ce fichier n'est pas un export de paramètres",
    "err.lfmKeyRefused": "Last.fm n'accepte plus votre clé API. Saisissez-la de nouveau.",
    "err.spotifyDeclined": "Vous avez refusé l'accès dans Spotify.",
    "err.lfmBusy": "Last.fm est occupé pour le moment. Attends une minute et réessaie.",
    "analysis.retry": "Réessayer",
    "playlists.signOut": "Se déconnecter",
    "signOut.notice":
      "Tu es déconnecté de Spotify dans ce navigateur. Ton nom d’utilisateur et ta clé Last.fm restent enregistrés ici ; Réinitialiser les supprime aussi.",
    "signOut.revoke": "Retirer l’accès de l’appli dans ton compte Spotify",
    "err.signInUnverified": "La connexion n’a pas pu être confirmée. Reconnecte-toi.",
    "err.storageBlocked":
      "Ton navigateur empêche ce site de garder les données nécessaires à la connexion. Autorise les données de ce site et réessaie.",
    "err.redirectMismatch":
      "Spotify a refusé l'adresse de redirection. Dans votre application Spotify, le Redirect URI doit être exactement : {uri}",
    "err.unknownClient": "Spotify ne connaît pas ce Client ID. Vérifiez-le sur la page de votre application.",

    "start.spotifyRefused": "Spotify a refusé : {error}. Le plus souvent, la Redirect URI ne correspond pas.",
    "start.settingsLost": "Les paramètres ont été perdus, saisis-les à nouveau.",
    "start.connectSpotify": "Connecte Spotify.",
    "start.signInAgain": "Reconnecte-toi.",

    "err.tokenRefused": "Spotify a refusé de fournir un jeton",
    "err.sessionExpired": "Session expirée, reconnecte-toi",
    "err.notSignedIn": "Pas connecté à Spotify",
    "err.spotify": "Erreur Spotify",

    "playlists.title": "Playlists",
    "playlists.reset": "Réinitialiser",
    "playlists.readOnly": "Lecture seule",
    "picks.outside": {
      one: "{n} titre sélectionné n’est pas dans cette playlist.",
      other: "{n} titres sélectionnés ne sont pas dans cette playlist.",
    },
    "picks.clearOutside": "Les retirer",
    "picks.restored": {
      one: "{n} titre sélectionné restauré.",
      other: "{n} titres sélectionnés restaurés.",
    },
    "picks.restoredOutside": {
      one: "{n} titre sélectionné restauré, dont {outside} hors de cette playlist.",
      other: "{n} titres sélectionnés restaurés, dont {outside} hors de cette playlist.",
    },
    "nav.playlistUnavailable":
      "Cette playlist n’a pas pu être ouverte. Elle a peut-être été supprimée, ou tu n’y as plus accès.",

    "analysis.reading": "Lecture de la playlist…",
    "analysis.progress": "Vérification sur Last.fm… {done} sur {total}",
    "analysis.readError":
      "Impossible de lire les titres de cette playlist. Spotify ne fournit le contenu que des playlists qui t’appartiennent ou auxquelles tu collabores : celles des autres et celles de Spotify ne peuvent plus être analysées.",
    "analysis.summary": "{tracks} · {newArtists} · {unheard}",
    "analysis.truncated": {
      one: "Seul le premier titre est affiché : au-delà, il faudrait trop de requêtes Last.fm.",
      other: "Seuls les {n} premiers titres sont affichés : au-delà, il faudrait trop de requêtes Last.fm.",
    },
    "analysis.spotifyOwned": "Cette playlist est gérée par Spotify, impossible d’en retirer des titres.",
    "analysis.makeCopy": "Faire une copie",
    "analysis.empty": "Rien ne correspond au filtre.",

    "count.tracks": { one: "{n} titre", other: "{n} titres" },
    "count.newArtists": { one: "{n} nouvel artiste", other: "{n} nouveaux artistes" },
    "count.unheard": "{n} non écoutés",

    "filter.all": "Tous",
    "filter.unknown": "Artiste inconnu",
    "filter.known": "Artiste connu",
    "filter.anyGenre": "Tous les genres",
    "filter.pickNew": "Sélectionner les non écoutés",
    "filter.pickHeard": "Sélectionner les écoutés",
    "filter.pickNone": "Désélectionner",
    "album.pickAll": "Tout sélectionner",
    "album.pickInvert": "Inverser",
    "filter.recheck": "Revérifier",

    "badge.known": "Connu · {n}×",
    "badge.newArtist": "Nouvel artiste",
    "badge.unheard": "{n} sur {total} non écoutés",

    "album.tracksShort": "{n} tit.",
    "album.openOnLastfm": "Ouvrir l’album sur Last.fm",
    "album.loading": "Chargement de la sortie…",
    "album.known": "{n} sur {total} écoutés",
    "album.inPlaylist": "Dans la playlist",

    "type.single": "Single",
    "type.ep": "EP",
    "type.album": "Album",
    "type.compilation": "Compilation",

    "bar.picked": "Sélection : {n}",
    "bar.remove": "Retirer",
    "bar.addHere": "Dans cette playlist",
    "bar.targetPlaceholder": "Playlist…",
    "combo.noMatch": "Aucun résultat",
    "bar.add": "Ajouter",
    "bar.move": "Déplacer",
    "bar.save": "Titres likés",
    "bar.clear": "Désélectionner",

    "toast.added": "Ajoutés : {n}",
    "toast.addedHere": "Ajoutés à la playlist : {n}",
    "toast.moved": "Déplacés : {n}",
    "toast.saved": "Dans les titres likés : {n}",
    "toast.removed": "Retirés : {n}",
    "toast.nothingInPlaylist": "Aucun titre sélectionné n’est dans cette playlist",
    "toast.copyCreated": "Copie créée",
    "confirm.remove": {
      one: "Retirer {n} titre ? Action irréversible.",
      other: "Retirer {n} titres ? Action irréversible.",
    },
    "prompt.copyName": "Nom de la copie :",
    "copy.suffix": "copie",
    "moved.lead": "Playlist Checker est désormais sur {domain}. Pour y emporter tes paramètres :",
    "moved.open": "Ouvre {domain} et charges-y le fichier de paramètres.",
    "moved.hide": "Masquer",
  },

  it: {
    "lang.label": "Lingua",
    "theme.label": "Tema",
    "theme.light": "Chiaro",
    "theme.dark": "Scuro",
    "theme.system": "Sistema",
    "common.loading": "Caricamento…",
    "about.link": "Informazioni",
    "nav.label": "Principale",
    "nav.account": "Account",
    "nav.resetQuestion": "Cancellare tutto ciò che è salvato in questo browser?",
    "nav.resetConfirm": "Cancella",
    "nav.resetCancel": "Annulla",
    "about.headline": "Trova il nuovo in ogni playlist",
    "about.description":
      "Scopri quali brani di una playlist Spotify hai già ascoltato secondo Last.fm e tieni solo quelli nuovi. Nulla viene salvato sul server.",
    "about.lead":
      "Scopri quali brani di una playlist hai già ascoltato e tieni solo quelli nuovi. La tua cronologia Last.fm, applicata alle tue playlist Spotify.",
    "about.benefit1": "Ogni brano e artista della playlist viene confrontato con la tua cronologia Last.fm.",
    "about.benefit2": "Il già noto e il nuovo sono mostrati separati, così il nuovo salta all’occhio.",
    "about.benefit3": "Aggiungi, sposta e rimuovi brani direttamente in Spotify.",
    "about.howTitle": "Come funziona",
    "about.how":
      "Collega il tuo account Spotify e il tuo profilo Last.fm. L’app legge le tue playlist da Spotify e la tua cronologia di ascolto da Last.fm e le mette fianco a fianco.",
    "about.privacy":
      "Sul server non resta nulla: impostazioni, sessione e risposte in cache restano in questo browser.",
    "legal.privacyLink": "Privacy",
    "legal.termsLink": "Termini",
    "legal.contactLink": "Contatti",
    "legal.sourceLink": "Codice sorgente",
    "legal.sourceOnRequest": "disponibile su richiesta a {contact}",
    "legal.poweredBy": "Dati forniti da {link}",
    "legal.spotify": "Non affiliato a Spotify né approvato da Spotify.",
    "legal.updated": "Ultimo aggiornamento: {date}",
    "legal.englishPrevails":
      "Questa è una traduzione. In caso di differenze con la versione inglese, prevale la versione inglese.",
    "privacy.title": "Privacy",
    "privacy.description": "Cosa conserva Playlist Checker, dove, e come cancellarlo.",
    "privacy.1":
      "In breve: Playlist Checker non ha database né account. Tutto ciò che serve resta nel tuo browser.",
    "privacy.2":
      "La memoria locale del browser conserva le tue impostazioni: il Client ID di Spotify, il tuo nome utente e la chiave API di Last.fm, la sessione di Spotify, lingua e tema, l’avanzamento della configurazione e, per un giorno, i brani selezionati. Il database del browser conserva le risposte di Last.fm fino a una settimana e l’elenco delle playlist per un quarto d’ora, così i controlli ripetuti sono veloci. Durante l’accesso, la scheda conserva due valori di verifica monouso.",
    "privacy.3":
      "Spotify viene contattato direttamente dal tuo browser. Last.fm viene contattato tramite il server di questo sito, perché Last.fm non accetta chiamate dalle pagine web. Queste richieste contengono la tua chiave API e il nome utente di Last.fm e i nomi di artisti, brani e album controllati; il server le inoltra, restituisce la risposta e non conserva nulla.",
    "privacy.4":
      "Il sito è ospitato su Cloudflare, che tratta dati tecnici delle richieste, come il tuo indirizzo IP, per servirlo, secondo la propria informativa sulla privacy.",
    "privacy.5":
      "Le visite vengono contate in modo anonimo sul server stesso di questo sito: per ogni schermata che apri si annotano il tipo (inizio, configurazione, elenco delle playlist, analisi, Privacy o Termini), la lingua dell’interfaccia, se lo schermo è di un telefono, il tuo paese e, se arrivi da un altro sito, il nome di quel sito. Non viene conservato alcun indirizzo IP, cookie o identificativo, quindi le visite non possono essere collegate a te né tra loro, e le annotazioni vengono cancellate dopo tre mesi. Se il tuo browser chiede ai siti di non tracciarti (Global Privacy Control o Do Not Track), non viene contato nulla. Non ci sono tracker, pubblicità né cookie.",
    "privacy.6": "Un file di impostazioni salvato contiene le tue chiavi. Tienilo riservato.",
    "privacy.7":
      "Esci chiude la sessione di Spotify in questo browser e mantiene i dati di Last.fm. Per cancellare tutto, usa Reimposta o elimina i dati di questo sito nelle impostazioni del browser. Le tue playlist Spotify e la cronologia Last.fm non vengono toccate. Per revocare l’accesso dell’app a Spotify, rimuovila da Gestisci app nel tuo account Spotify.",
    "privacy.8":
      "Questo sito è gestito dal suo proprietario come progetto personale e non commerciale. Domande: {contact}.",
    "terms.title": "Termini",
    "terms.description": "I termini di utilizzo di Playlist Checker.",
    "terms.1":
      "Playlist Checker è fornito così com’è, gratuitamente e senza alcuna garanzia. Lo usi a tuo rischio.",
    "terms.2":
      "Non è affiliato, approvato né sponsorizzato da Spotify o Last.fm. Spotify e Last.fm sono marchi dei rispettivi proprietari.",
    "terms.3":
      "Fornisci tu la tua app Spotify e la tua chiave API di Last.fm. Ne sei responsabile, così come del rispetto dei termini di Spotify e Last.fm.",
    "terms.4":
      "Aggiungere, spostare e rimuovere brani modifica le tue vere playlist Spotify. Il sito non può annullare queste modifiche, quindi controlla prima di confermare.",
    "terms.5":
      "Il servizio può cambiare o interrompersi in qualsiasi momento. Il codice sorgente è pubblicato con licenza AGPL-3.0: {source}.",
    "terms.6": "Domande: {contact}.",
    "about.setupTime":
      "La configurazione richiede circa cinque minuti: crei una tua app Spotify e una chiave API Last.fm, e la guida ti accompagna in entrambi i passaggi.",
    "about.start": "Inizia",
    "about.continue": "Continua",
    "about.shot":
      "Una playlist dopo il controllo: artisti noti e nuovi separati, brani non ascoltati selezionati.",
    "about.albumShot": "Apri un album per vedere quali brani hai già ascoltato e scegliere gli altri.",

    "setup.title": "Configurazione",
    "setup.signIn": "Accesso",
    "setup.redirectNotice":
      "Nelle impostazioni della tua app Spotify aggiungi esattamente questo Redirect URI:",
    "setup.lfmUser": "Nome utente Last.fm",
    "setup.lfmKey": "Chiave API Last.fm",
    "setup.storedLocally": "Questi dati restano solo in questo browser.",
    "setup.submit": "Accedi con Spotify",
    "setup.linkSpotifyApp": "App Spotify",
    "setup.linkLfmKey": "Chiave Last.fm",
    "setup.needClientId": "Serve il Client ID",
    "setup.needLfmUser": "Serve il nome utente Last.fm",
    "playlists.settings": "Impostazioni",
    "playlists.radarNote":
      "Le playlist di Spotify (Release Radar, Discover Weekly e simili) non sono disponibili tramite API. Copia i brani in una playlist tua dall'app di Spotify e analizza quella.",
    "setup.step": "Passo {n} di {total}",
    "setup.stepSpotify": "App Spotify",
    "setup.stepLastfm": "Chiave Last.fm",
    "setup.spotify1": "Apri la dashboard per sviluppatori di Spotify e crea un'app:",
    "setup.spotify2": "In Which API/SDKs are you planning to use seleziona solo Web API.",
    "setup.spotify4": "Copia il Client ID dalla pagina dell'app e incollalo qui sotto.",
    "setup.copy": "Copia",
    "setup.copied": "Indirizzo copiato",
    "setup.copyFailed": "Copia non riuscita: seleziona l'indirizzo e copialo a mano",
    "setup.clientIdBad": "Non sembra un Client ID: 32 caratteri, cifre e a–f.",
    "setup.lastfm1": "Compila il modulo della chiave Last.fm e copia la API key ottenuta:",
    "setup.lastfm2": "Ne hai già una? Le tue chiavi esistenti sono qui:",
    "setup.linkLfmKeys": "le tue chiavi Last.fm",
    "setup.needLfmKey": "La chiave API di Last.fm è obbligatoria",
    "setup.checking": "Verifica…",
    "setup.keyRefused": "Last.fm non ha accettato questa chiave",
    "setup.continue": "Continua",
    "setup.back": "← Indietro",
    "setup.ownApp": "L'app che crei è tua e punta a questo sito.",
    "setup.redirectHint":
      "Se Spotify risponde INVALID_CLIENT: Invalid redirect URI, questo indirizzo non è registrato nella tua app:",
    "setup.exportSettings": "Salva le impostazioni in un file",
    "setup.importSettings": "Carica le impostazioni da un file",
    "setup.importConfirm":
      "Sostituire le impostazioni attuali con quelle di questo file (Client ID {clientId})? Verrai disconnesso da Spotify.",
    "setup.importBad": "Questo file non è un export delle impostazioni",
    "err.lfmKeyRefused": "Last.fm non accetta più la tua chiave API. Inseriscila di nuovo.",
    "err.spotifyDeclined": "Hai negato l'accesso in Spotify.",
    "err.lfmBusy": "Last.fm è occupato in questo momento. Aspetta un minuto e riprova.",
    "analysis.retry": "Riprova",
    "playlists.signOut": "Esci",
    "signOut.notice":
      "Sei uscito da Spotify in questo browser. Nome utente e chiave di Last.fm restano salvati qui; Reimposta rimuove anche quelli.",
    "signOut.revoke": "Rimuovi l’accesso dell’app nel tuo account Spotify",
    "err.signInUnverified": "Non è stato possibile confermare l’accesso. Accedi di nuovo.",
    "err.storageBlocked":
      "Il browser non consente a questo sito di conservare i dati necessari all’accesso. Consenti i dati di questo sito e riprova.",
    "err.redirectMismatch":
      "Spotify ha rifiutato l'indirizzo di reindirizzamento. Nella tua app Spotify il Redirect URI deve essere esattamente: {uri}",
    "err.unknownClient": "Spotify non conosce questo Client ID. Controllalo nella pagina della tua app.",

    "start.spotifyRefused": "Spotify ha rifiutato: {error}. Di solito il Redirect URI non corrisponde.",
    "start.settingsLost": "Le impostazioni sono andate perse: inseriscile di nuovo.",
    "start.connectSpotify": "Collega Spotify.",
    "start.signInAgain": "Accedi di nuovo.",

    "err.tokenRefused": "Spotify ha rifiutato il token",
    "err.sessionExpired": "Sessione scaduta, accedi di nuovo",
    "err.notSignedIn": "Accesso a Spotify non effettuato",
    "err.spotify": "Errore di Spotify",

    "playlists.title": "Playlist",
    "playlists.reset": "Reimposta",
    "playlists.readOnly": "Sola lettura",
    "picks.outside": {
      one: "{n} brano selezionato non è in questa playlist.",
      other: "{n} brani selezionati non sono in questa playlist.",
    },
    "picks.clearOutside": "Rimuovili",
    "picks.restored": {
      one: "Ripristinato {n} brano selezionato.",
      other: "Ripristinati {n} brani selezionati.",
    },
    "picks.restoredOutside": {
      one: "Ripristinato {n} brano selezionato, di cui {outside} fuori da questa playlist.",
      other: "Ripristinati {n} brani selezionati, di cui {outside} fuori da questa playlist.",
    },
    "nav.playlistUnavailable":
      "Non è stato possibile aprire questa playlist. Forse è stata eliminata o non hai più accesso.",

    "analysis.reading": "Lettura della playlist…",
    "analysis.progress": "Confronto con Last.fm… {done} di {total}",
    "analysis.readError":
      "Impossibile leggere i brani di questa playlist. Spotify fornisce il contenuto solo delle playlist che possiedi o in cui collabori: quelle di altri e quelle curate da Spotify non si possono più analizzare.",
    "analysis.summary": "{tracks} · {newArtists} · {unheard}",
    "analysis.truncated": {
      one: "È mostrato solo il primo brano: oltre servirebbero troppe richieste a Last.fm.",
      other: "Sono mostrati i primi {n} brani: oltre servirebbero troppe richieste a Last.fm.",
    },
    "analysis.spotifyOwned": "Questa playlist è gestita da Spotify, non si possono rimuovere brani.",
    "analysis.makeCopy": "Crea una copia",
    "analysis.empty": "Nessun risultato per questo filtro.",

    "count.tracks": { one: "{n} brano", other: "{n} brani" },
    "count.newArtists": { one: "{n} artista nuovo", other: "{n} artisti nuovi" },
    "count.unheard": "{n} mai ascoltati",

    "filter.all": "Tutti",
    "filter.unknown": "Artista sconosciuto",
    "filter.known": "Artista noto",
    "filter.anyGenre": "Qualsiasi genere",
    "filter.pickNew": "Seleziona non ascoltati",
    "filter.pickHeard": "Seleziona ascoltati",
    "filter.pickNone": "Deseleziona",
    "album.pickAll": "Seleziona tutte",
    "album.pickInvert": "Inverti",
    "filter.recheck": "Ricontrolla",

    "badge.known": "Noto · {n}×",
    "badge.newArtist": "Artista nuovo",
    "badge.unheard": "{n} di {total} mai ascoltati",

    "album.tracksShort": "{n} br.",
    "album.openOnLastfm": "Apri l’album su Last.fm",
    "album.loading": "Caricamento uscita…",
    "album.known": "{n} di {total} ascoltati",
    "album.inPlaylist": "Nella playlist",

    "type.single": "Singolo",
    "type.ep": "EP",
    "type.album": "Album",
    "type.compilation": "Raccolta",

    "bar.picked": "Selezionati: {n}",
    "bar.remove": "Rimuovi",
    "bar.addHere": "In questa playlist",
    "bar.targetPlaceholder": "Playlist…",
    "combo.noMatch": "Nessun risultato",
    "bar.add": "Aggiungi",
    "bar.move": "Sposta",
    "bar.save": "Mi piace",
    "bar.clear": "Deseleziona",

    "toast.added": "Aggiunti: {n}",
    "toast.addedHere": "Aggiunti alla playlist: {n}",
    "toast.moved": "Spostati: {n}",
    "toast.saved": "Tra i Mi piace: {n}",
    "toast.removed": "Rimossi: {n}",
    "toast.nothingInPlaylist": "Nessun brano selezionato è in questa playlist",
    "toast.copyCreated": "Copia creata",
    "confirm.remove": {
      one: "Rimuovere {n} brano? Non si può annullare.",
      other: "Rimuovere {n} brani? Non si può annullare.",
    },
    "prompt.copyName": "Nome della copia:",
    "copy.suffix": "copia",
    "moved.lead": "Playlist Checker ora si trova su {domain}. Per portare con te le impostazioni:",
    "moved.open": "Apri {domain} e carica lì il file delle impostazioni.",
    "moved.hide": "Nascondi",
  },

  pl: {
    "lang.label": "Język",
    "theme.label": "Motyw",
    "theme.light": "Jasny",
    "theme.dark": "Ciemny",
    "theme.system": "Systemowy",
    "common.loading": "Ładowanie…",
    "about.link": "O aplikacji",
    "nav.label": "Główne",
    "nav.account": "Konto",
    "nav.resetQuestion": "Usunąć wszystko, co zapisano w tej przeglądarce?",
    "nav.resetConfirm": "Usuń",
    "nav.resetCancel": "Anuluj",
    "about.headline": "Znajdź nowości w każdej playliście",
    "about.description":
      "Zobacz, które utwory z playlisty Spotify masz już w historii Last.fm, i zostaw tylko nowe. Nic nie jest zapisywane na serwerze.",
    "about.lead":
      "Zobacz, które utwory z playlisty są ci już znane, i zostaw tylko nowe. Twoja historia z Last.fm zastosowana do playlist w Spotify.",
    "about.benefit1": "Każdy utwór i wykonawca z playlisty jest sprawdzany w twojej historii Last.fm.",
    "about.benefit2": "Znane i nowe są pokazane osobno, więc nowe od razu rzuca się w oczy.",
    "about.benefit3": "Dodawaj, przenoś i usuwaj utwory bezpośrednio w Spotify.",
    "about.howTitle": "Jak to działa",
    "about.how":
      "Połącz konto Spotify i profil Last.fm. Aplikacja czyta twoje playlisty ze Spotify i historię słuchania z Last.fm i zestawia je obok siebie.",
    "about.privacy":
      "Na serwerze nic nie zostaje: ustawienia, sesja i zapisane odpowiedzi zostają w tej przeglądarce.",
    "legal.privacyLink": "Prywatność",
    "legal.termsLink": "Warunki",
    "legal.contactLink": "Kontakt",
    "legal.sourceLink": "Kod źródłowy",
    "legal.sourceOnRequest": "dostępny na prośbę pod adresem {contact}",
    "legal.poweredBy": "Dane: {link}",
    "legal.spotify": "Niepowiązane ze Spotify ani przez nie niepopierane.",
    "legal.updated": "Ostatnia aktualizacja: {date}",
    "legal.englishPrevails": "To jest tłumaczenie. W razie rozbieżności obowiązuje wersja angielska.",
    "privacy.title": "Prywatność",
    "privacy.description": "Co przechowuje Playlist Checker, gdzie i jak to usunąć.",
    "privacy.1":
      "W skrócie: Playlist Checker nie ma bazy danych ani kont. Wszystko, czego potrzebuje, zostaje w Twojej przeglądarce.",
    "privacy.2":
      "Pamięć lokalna przeglądarki przechowuje ustawienia: Client ID Spotify, nazwę użytkownika i klucz API Last.fm, sesję Spotify, język i motyw, postęp konfiguracji oraz przez dobę wybrane utwory. Baza danych przeglądarki przechowuje odpowiedzi Last.fm do tygodnia, a listę playlist przez kwadrans, żeby powtórne sprawdzenia były szybkie. Podczas logowania karta przechowuje dwie jednorazowe wartości kontrolne.",
    "privacy.3":
      "Ze Spotify przeglądarka łączy się bezpośrednio. Z Last.fm łączy się przez serwer tej strony, bo Last.fm nie przyjmuje zapytań ze stron internetowych. Te zapytania zawierają Twój klucz API i nazwę użytkownika Last.fm oraz sprawdzane nazwy wykonawców, utworów i albumów; serwer je przekazuje, zwraca odpowiedź i niczego nie zapisuje.",
    "privacy.4":
      "Strona działa na Cloudflare, który przetwarza techniczne dane zapytań, takie jak adres IP, aby ją dostarczyć, zgodnie z własną polityką prywatności.",
    "privacy.5":
      "Wizyty są liczone anonimowo na własnym serwerze tej strony: przy każdym otwartym ekranie zapisuje się jego rodzaj (start, konfiguracja, lista playlist, analiza, Prywatność lub Warunki), język interfejsu, czy to ekran telefonu, Twój kraj oraz, jeśli trafiasz tu z innej strony, jej nazwę. Nie jest przechowywany żaden adres IP, plik cookie ani identyfikator, więc wizyt nie da się powiązać z Tobą ani ze sobą nawzajem, a wpisy są usuwane po trzech miesiącach. Jeśli Twoja przeglądarka prosi strony, by Cię nie śledziły (Global Privacy Control lub Do Not Track), nic nie jest liczone. Nie ma śledzenia, reklam ani plików cookie.",
    "privacy.6": "Zapisany plik ustawień zawiera Twoje klucze. Nie udostępniaj go.",
    "privacy.7":
      "Wyloguj kończy sesję Spotify w tej przeglądarce i zachowuje dane Last.fm. Aby wszystko usunąć, użyj Resetuj albo wyczyść dane tej strony w ustawieniach przeglądarki. Twoje playlisty Spotify i historia Last.fm pozostaną nietknięte. Aby odebrać aplikacji dostęp do Spotify, usuń ją w sekcji Zarządzaj aplikacjami na koncie Spotify.",
    "privacy.8": "Stronę prowadzi jej właściciel jako prywatny, niekomercyjny projekt. Pytania: {contact}.",
    "terms.title": "Warunki",
    "terms.description": "Warunki korzystania z Playlist Checker.",
    "terms.1":
      "Playlist Checker jest udostępniany w obecnej postaci, bezpłatnie i bez żadnych gwarancji. Korzystasz z niego na własne ryzyko.",
    "terms.2":
      "Nie jest powiązany ze Spotify ani Last.fm, ani przez nie popierany czy sponsorowany. Spotify i Last.fm są znakami towarowymi ich właścicieli.",
    "terms.3":
      "Korzystasz z własnej aplikacji Spotify i własnego klucza API Last.fm. Odpowiadasz za nie oraz za przestrzeganie warunków Spotify i Last.fm.",
    "terms.4":
      "Dodawanie, przenoszenie i usuwanie utworów zmienia Twoje prawdziwe playlisty w Spotify. Strona nie może cofnąć tych zmian, więc sprawdź przed potwierdzeniem.",
    "terms.5":
      "Usługa może się zmienić lub przestać działać w dowolnym momencie. Jej kod źródłowy jest opublikowany na licencji AGPL-3.0: {source}.",
    "terms.6": "Pytania: {contact}.",
    "about.setupTime":
      "Konfiguracja zajmuje około pięciu minut: tworzysz własną aplikację Spotify i klucz API Last.fm, a przewodnik prowadzi cię przez oba kroki.",
    "about.start": "Zaczynamy",
    "about.continue": "Dalej",
    "about.shot":
      "Playlista po sprawdzeniu: znani i nowi wykonawcy osobno, nieprzesłuchane utwory zaznaczone.",
    "about.albumShot": "Otwórz album, aby zobaczyć, które utwory już znasz, i wybrać pozostałe.",

    "setup.title": "Konfiguracja",
    "setup.signIn": "Logowanie",
    "setup.redirectNotice": "W ustawieniach aplikacji Spotify dodaj dokładnie ten Redirect URI:",
    "setup.lfmUser": "Nazwa użytkownika Last.fm",
    "setup.lfmKey": "Klucz API Last.fm",
    "setup.storedLocally": "Te dane są przechowywane tylko w tej przeglądarce.",
    "setup.submit": "Zaloguj przez Spotify",
    "setup.linkSpotifyApp": "Aplikacja Spotify",
    "setup.linkLfmKey": "Klucz Last.fm",
    "setup.needClientId": "Podaj Client ID",
    "setup.needLfmUser": "Podaj nazwę użytkownika Last.fm",
    "playlists.settings": "Ustawienia",
    "playlists.radarNote":
      "Playlisty samego Spotify (Release Radar, Discover Weekly i podobne) nie są dostępne przez API. Skopiuj ich utwory do własnej playlisty w aplikacji Spotify i przeanalizuj tamtą.",
    "setup.step": "Krok {n} z {total}",
    "setup.stepSpotify": "Aplikacja Spotify",
    "setup.stepLastfm": "Klucz Last.fm",
    "setup.spotify1": "Otwórz panel dewelopera Spotify i utwórz aplikację:",
    "setup.spotify2": "W Which API/SDKs are you planning to use zaznacz tylko Web API.",
    "setup.spotify4": "Skopiuj Client ID ze strony aplikacji i wklej poniżej.",
    "setup.copy": "Kopiuj",
    "setup.copied": "Adres skopiowany",
    "setup.copyFailed": "Nie udało się skopiować: zaznacz adres i skopiuj ręcznie",
    "setup.clientIdBad": "To nie wygląda na Client ID: 32 znaki, cyfry i a–f.",
    "setup.lastfm1": "Wypełnij formularz klucza Last.fm i skopiuj otrzymany klucz API:",
    "setup.lastfm2": "Masz już klucz? Twoje klucze znajdziesz tutaj:",
    "setup.linkLfmKeys": "twoje klucze Last.fm",
    "setup.needLfmKey": "Klucz API Last.fm jest wymagany",
    "setup.checking": "Sprawdzanie…",
    "setup.keyRefused": "Last.fm nie przyjął tego klucza",
    "setup.continue": "Dalej",
    "setup.back": "← Wstecz",
    "setup.ownApp": "Aplikacja, którą tworzysz, należy do ciebie i wskazuje na tę stronę.",
    "setup.redirectHint":
      "Jeśli Spotify odpowie INVALID_CLIENT: Invalid redirect URI, ten adres nie jest zapisany w twojej aplikacji:",
    "setup.exportSettings": "Zapisz ustawienia do pliku",
    "setup.importSettings": "Wczytaj ustawienia z pliku",
    "setup.importConfirm":
      "Zastąpić bieżące ustawienia tymi z pliku (Client ID {clientId})? Nastąpi wylogowanie ze Spotify.",
    "setup.importBad": "Ten plik nie jest eksportem ustawień",
    "err.lfmKeyRefused": "Last.fm nie przyjmuje już twojego klucza API. Wpisz go ponownie.",
    "err.spotifyDeclined": "Odmówiono dostępu w Spotify.",
    "err.lfmBusy": "Last.fm jest teraz zajęty. Poczekaj minutę i spróbuj ponownie.",
    "analysis.retry": "Spróbuj ponownie",
    "playlists.signOut": "Wyloguj",
    "signOut.notice":
      "Wylogowano ze Spotify w tej przeglądarce. Nazwa użytkownika i klucz Last.fm nadal są tu zapisane; Resetuj usuwa także je.",
    "signOut.revoke": "Odbierz aplikacji dostęp na koncie Spotify",
    "err.signInUnverified": "Nie udało się potwierdzić logowania. Zaloguj się ponownie.",
    "err.storageBlocked":
      "Przeglądarka nie pozwala tej stronie zapisać danych potrzebnych do logowania. Zezwól na dane tej strony i spróbuj ponownie.",
    "err.redirectMismatch":
      "Spotify odrzucił adres przekierowania. W twojej aplikacji Spotify Redirect URI musi być dokładnie taki: {uri}",
    "err.unknownClient": "Spotify nie zna tego Client ID. Sprawdź go na stronie swojej aplikacji.",

    "start.spotifyRefused": "Spotify odmówił: {error}. Najczęściej to niezgodność Redirect URI.",
    "start.settingsLost": "Ustawienia zostały utracone — wpisz je ponownie.",
    "start.connectSpotify": "Połącz Spotify.",
    "start.signInAgain": "Zaloguj się ponownie.",

    "err.tokenRefused": "Spotify odmówił wydania tokenu",
    "err.sessionExpired": "Sesja wygasła, zaloguj się ponownie",
    "err.notSignedIn": "Brak logowania do Spotify",
    "err.spotify": "Błąd Spotify",

    "playlists.title": "Playlisty",
    "playlists.reset": "Resetuj",
    "playlists.readOnly": "Tylko odczyt",
    "picks.outside": {
      one: "{n} zaznaczony utwór nie jest na tej playliście.",
      few: "{n} zaznaczone utwory nie są na tej playliście.",
      many: "{n} zaznaczonych utworów nie ma na tej playliście.",
      other: "{n} zaznaczonych utworów nie ma na tej playliście.",
    },
    "picks.clearOutside": "Usuń je",
    "picks.restored": {
      one: "Przywrócono {n} zaznaczony utwór.",
      few: "Przywrócono {n} zaznaczone utwory.",
      many: "Przywrócono {n} zaznaczonych utworów.",
      other: "Przywrócono {n} zaznaczonych utworów.",
    },
    "picks.restoredOutside": {
      one: "Przywrócono {n} zaznaczony utwór, w tym {outside} spoza tej playlisty.",
      few: "Przywrócono {n} zaznaczone utwory, w tym {outside} spoza tej playlisty.",
      many: "Przywrócono {n} zaznaczonych utworów, w tym {outside} spoza tej playlisty.",
      other: "Przywrócono {n} zaznaczonych utworów, w tym {outside} spoza tej playlisty.",
    },
    "nav.playlistUnavailable":
      "Nie udało się otworzyć tej playlisty. Mogła zostać usunięta albo nie masz już do niej dostępu.",

    "analysis.reading": "Czytam playlistę…",
    "analysis.progress": "Sprawdzam w Last.fm… {done} z {total}",
    "analysis.readError":
      "Nie udało się odczytać utworów z tej playlisty. Spotify udostępnia zawartość tylko playlist, których jesteś właścicielem lub współtwórcą — cudzych i tworzonych przez Spotify nie da się już analizować.",
    "analysis.summary": "{tracks} · {newArtists} · {unheard}",
    "analysis.truncated": {
      one: "Pokazano tylko pierwszy utwór — dalej byłoby zbyt wiele zapytań do Last.fm.",
      few: "Pokazano pierwsze {n} utwory — dalej byłoby zbyt wiele zapytań do Last.fm.",
      many: "Pokazano pierwszych {n} utworów — dalej byłoby zbyt wiele zapytań do Last.fm.",
      other: "Pokazano pierwszych {n} utworów — dalej byłoby zbyt wiele zapytań do Last.fm.",
    },
    "analysis.spotifyOwned": "Tę playlistę tworzy Spotify, nie można z niej usuwać utworów.",
    "analysis.makeCopy": "Utwórz kopię",
    "analysis.empty": "Nic nie pasuje do filtra.",

    "count.tracks": { one: "{n} utwór", few: "{n} utwory", many: "{n} utworów", other: "{n} utworu" },
    "count.newArtists": {
      one: "{n} nowy artysta",
      few: "{n} nowi artyści",
      many: "{n} nowych artystów",
      other: "{n} nowego artysty",
    },
    "count.unheard": "Nieprzesłuchane: {n}",

    "filter.all": "Wszyscy",
    "filter.unknown": "Nieznany artysta",
    "filter.known": "Znany artysta",
    "filter.anyGenre": "Dowolny gatunek",
    "filter.pickNew": "Zaznacz nieprzesłuchane",
    "filter.pickHeard": "Zaznacz przesłuchane",
    "filter.pickNone": "Odznacz",
    "album.pickAll": "Zaznacz wszystkie",
    "album.pickInvert": "Odwróć",
    "filter.recheck": "Sprawdź ponownie",

    "badge.known": "Znany · {n}×",
    "badge.newArtist": "Nowy artysta",
    "badge.unheard": "Nieprzesłuchane: {n} z {total}",

    "album.tracksShort": "{n} utw.",
    "album.openOnLastfm": "Otwórz album w Last.fm",
    "album.loading": "Ładowanie wydania…",
    "album.known": "Przesłuchane: {n} z {total}",
    "album.inPlaylist": "W playliście",

    "type.single": "Singiel",
    "type.ep": "EP",
    "type.album": "Album",
    "type.compilation": "Kompilacja",

    "bar.picked": "Zaznaczono: {n}",
    "bar.remove": "Usuń",
    "bar.addHere": "Do tej playlisty",
    "bar.targetPlaceholder": "Playlista…",
    "combo.noMatch": "Brak wyników",
    "bar.add": "Dodaj",
    "bar.move": "Przenieś",
    "bar.save": "Do polubionych",
    "bar.clear": "Odznacz",

    "toast.added": "Dodano: {n}",
    "toast.addedHere": "Dodano do playlisty: {n}",
    "toast.moved": "Przeniesiono: {n}",
    "toast.saved": "W polubionych: {n}",
    "toast.removed": "Usunięto: {n}",
    "toast.nothingInPlaylist": "Żaden z zaznaczonych utworów nie jest w tej playliście",
    "toast.copyCreated": "Utworzono kopię",
    "confirm.remove": {
      one: "Usunąć {n} utwór? Tego nie można cofnąć.",
      few: "Usunąć {n} utwory? Tego nie można cofnąć.",
      many: "Usunąć {n} utworów? Tego nie można cofnąć.",
      other: "Usunąć {n} utworu? Tego nie można cofnąć.",
    },
    "prompt.copyName": "Nazwa kopii:",
    "copy.suffix": "kopia",
    "moved.lead": "Playlist Checker jest teraz pod adresem {domain}. Aby przenieść ustawienia:",
    "moved.open": "Otwórz {domain} i wczytaj tam plik z ustawieniami.",
    "moved.hide": "Ukryj",
  },

  tr: {
    "lang.label": "Dil",
    "theme.label": "Tema",
    "theme.light": "Açık",
    "theme.dark": "Koyu",
    "theme.system": "Sistem",
    "common.loading": "Yükleniyor…",
    "about.link": "Hakkında",
    "nav.label": "Ana menü",
    "nav.account": "Hesap",
    "nav.resetQuestion": "Bu tarayıcıda kayıtlı her şey silinsin mi?",
    "nav.resetConfirm": "Sil",
    "nav.resetCancel": "Vazgeç",
    "about.headline": "Her çalma listesinde yenileri bulun",
    "about.description":
      "Bir Spotify çalma listesindeki hangi şarkıları Last.fm’e göre zaten dinlediğinizi görün ve yalnızca yenileri tutun. Sunucuda hiçbir şey saklanmaz.",
    "about.lead":
      "Bir çalma listesindeki hangi parçaları zaten dinlediğinizi görün, yalnızca yenileri tutun. Last.fm geçmişiniz, Spotify çalma listelerinize uygulanır.",
    "about.benefit1": "Listedeki her parça ve sanatçı Last.fm geçmişinizle karşılaştırılır.",
    "about.benefit2": "Bildikleriniz ve yeniler ayrı gösterilir, böylece yeniler öne çıkar.",
    "about.benefit3": "Parçaları doğrudan Spotify'da ekleyin, taşıyın ve kaldırın.",
    "about.howTitle": "Nasıl çalışır",
    "about.how":
      "Spotify hesabınızı ve Last.fm profilinizi bağlayın. Uygulama çalma listelerinizi Spotify'dan, dinleme geçmişinizi Last.fm'den okur ve ikisini yan yana koyar.",
    "about.privacy":
      "Sunucuda hiçbir şey saklanmaz: ayarlarınız, oturumunuz ve önbelleğe alınan yanıtlar bu tarayıcıda kalır.",
    "legal.privacyLink": "Gizlilik",
    "legal.termsLink": "Koşullar",
    "legal.contactLink": "İletişim",
    "legal.sourceLink": "Kaynak kodu",
    "legal.sourceOnRequest": "{contact} adresinden talep üzerine sağlanır",
    "legal.poweredBy": "Veriler: {link}",
    "legal.spotify": "Spotify ile bağlantılı değildir ve Spotify tarafından onaylanmamıştır.",
    "legal.updated": "Son güncelleme: {date}",
    "legal.englishPrevails":
      "Bu bir çeviridir. İngilizce sürümle farklılık olursa İngilizce sürüm geçerlidir.",
    "privacy.title": "Gizlilik",
    "privacy.description": "Playlist Checker neyi, nerede saklar ve nasıl silinir.",
    "privacy.1":
      "Kısacası: Playlist Checker’ın veritabanı ve hesap sistemi yoktur. İhtiyaç duyduğu her şey tarayıcınızda kalır.",
    "privacy.2":
      "Tarayıcınızın yerel depolaması ayarlarınızı tutar: Spotify Client ID, Last.fm kullanıcı adınız ve API anahtarınız, Spotify oturumunuz, diliniz ve temanız, kurulum ilerlemesi ve bir gün boyunca seçtiğiniz şarkılar. Tarayıcınızın veritabanı Last.fm yanıtlarını en fazla bir hafta, çalma listesi listenizi on beş dakika saklar; böylece tekrar eden kontroller hızlı olur. Giriş sırasında sekme iki tek kullanımlık doğrulama değeri tutar.",
    "privacy.3":
      "Spotify’a doğrudan tarayıcınızdan bağlanılır. Last.fm’e bu sitenin sunucusu üzerinden bağlanılır, çünkü Last.fm web sayfalarından gelen çağrıları kabul etmez. Bu istekler Last.fm API anahtarınızı ve kullanıcı adınızı, kontrol edilen sanatçı, şarkı ve albüm adlarını taşır; sunucu bunları iletir, yanıtı döndürür ve hiçbir şey saklamaz.",
    "privacy.4":
      "Site Cloudflare üzerinde barındırılır; Cloudflare, siteyi sunmak için IP adresiniz gibi teknik istek bilgilerini kendi gizlilik politikasına göre işler.",
    "privacy.5":
      "Ziyaretler bu sitenin kendi sunucusunda anonim olarak sayılır: açtığınız her ekran için türü (başlangıç, kurulum, çalma listesi listesi, analiz, Gizlilik veya Koşullar), arayüz dili, ekranın telefon ekranı olup olmadığı, ülkeniz ve başka bir siteden geldiyseniz o sitenin adı kaydedilir. Hiçbir IP adresi, çerez veya tanımlayıcı saklanmaz; bu yüzden ziyaretler ne sizinle ne de birbirleriyle ilişkilendirilebilir ve kayıtlar üç ay sonra silinir. Tarayıcınız sitelerden sizi izlememelerini istiyorsa (Global Privacy Control veya Do Not Track) hiçbir şey sayılmaz. İzleyici, reklam ve çerez yoktur.",
    "privacy.6": "Kaydettiğiniz ayar dosyası anahtarlarınızı içerir. Kimseyle paylaşmayın.",
    "privacy.7":
      "Çıkış yap, bu tarayıcıdaki Spotify oturumunuzu kapatır ve Last.fm bilgilerinizi korur. Her şeyi silmek için Sıfırla’yı kullanın veya tarayıcı ayarlarından bu sitenin verilerini temizleyin. Spotify çalma listeleriniz ve Last.fm geçmişiniz etkilenmez. Uygulamanın Spotify erişimini kaldırmak için Spotify hesabınızda Uygulamaları yönet bölümünden kaldırın.",
    "privacy.8":
      "Bu site, sahibi tarafından kişisel ve ticari olmayan bir proje olarak yürütülür. Sorular: {contact}.",
    "terms.title": "Koşullar",
    "terms.description": "Playlist Checker kullanım koşulları.",
    "terms.1":
      "Playlist Checker olduğu gibi, ücretsiz ve hiçbir garanti olmadan sunulur. Kullanım sorumluluğu size aittir.",
    "terms.2":
      "Spotify veya Last.fm ile bağlantılı değildir; onlar tarafından onaylanmamış veya desteklenmemiştir. Spotify ve Last.fm sahiplerinin ticari markalarıdır.",
    "terms.3":
      "Kendi Spotify uygulamanızı ve Last.fm API anahtarınızı siz sağlarsınız. Bunlardan ve Spotify ile Last.fm’in kendi koşullarına uymaktan siz sorumlusunuz.",
    "terms.4":
      "Şarkı eklemek, taşımak ve kaldırmak gerçek Spotify çalma listelerinizi değiştirir. Site bu değişiklikleri geri alamaz; onaylamadan önce kontrol edin.",
    "terms.5":
      "Hizmet her an değişebilir veya durabilir. Kaynak kodu AGPL-3.0 lisansıyla yayımlanmıştır: {source}.",
    "terms.6": "Sorular: {contact}.",
    "about.setupTime":
      "Kurulum yaklaşık beş dakika sürer: kendi Spotify uygulamanızı ve bir Last.fm API anahtarı oluşturursunuz; rehber iki adımda da size eşlik eder.",
    "about.start": "Başla",
    "about.continue": "Devam et",
    "about.shot":
      "Kontrolden sonra bir çalma listesi: tanıdık ve yeni sanatçılar ayrı, dinlenmemiş parçalar seçili.",
    "about.albumShot": "Hangi parçalarını dinlediğinizi görmek ve kalanları seçmek için bir albümü açın.",

    "setup.title": "Kurulum",
    "setup.signIn": "Giriş",
    "setup.redirectNotice": "Spotify uygulamanızın ayarlarına tam olarak şu Redirect URI’yi ekleyin:",
    "setup.lfmUser": "Last.fm kullanıcı adı",
    "setup.lfmKey": "Last.fm API anahtarı",
    "setup.storedLocally": "Bu bilgiler yalnızca bu tarayıcıda saklanır.",
    "setup.submit": "Spotify ile giriş yap",
    "setup.linkSpotifyApp": "Spotify uygulaması",
    "setup.linkLfmKey": "Last.fm anahtarı",
    "setup.needClientId": "Client ID gerekli",
    "setup.needLfmUser": "Last.fm kullanıcı adı gerekli",
    "playlists.settings": "Ayarlar",
    "playlists.radarNote":
      "Spotify'ın kendi çalma listeleri (Release Radar, Discover Weekly ve benzerleri) API üzerinden kullanılamıyor. Parçaları Spotify uygulamasında kendi listenize kopyalayın ve onu inceleyin.",
    "setup.step": "Adım {n} / {total}",
    "setup.stepSpotify": "Spotify uygulaması",
    "setup.stepLastfm": "Last.fm anahtarı",
    "setup.spotify1": "Spotify geliştirici panosunu açın ve bir uygulama oluşturun:",
    "setup.spotify2": "Which API/SDKs are you planning to use bölümünde yalnızca Web API seçin.",
    "setup.spotify4": "Uygulama sayfasındaki Client ID değerini kopyalayıp aşağıya yapıştırın.",
    "setup.copy": "Kopyala",
    "setup.copied": "Adres kopyalandı",
    "setup.copyFailed": "Kopyalanamadı: adresi seçip elle kopyalayın",
    "setup.clientIdBad": "Bu bir Client ID gibi görünmüyor: 32 karakter, rakamlar ve a–f.",
    "setup.lastfm1": "Last.fm anahtar formunu doldurun ve verilen API anahtarını kopyalayın:",
    "setup.lastfm2": "Zaten oluşturduysanız mevcut anahtarlarınız burada:",
    "setup.linkLfmKeys": "Last.fm anahtarlarınız",
    "setup.needLfmKey": "Last.fm API anahtarı gerekli",
    "setup.checking": "Denetleniyor…",
    "setup.keyRefused": "Last.fm bu anahtarı kabul etmedi",
    "setup.continue": "Devam",
    "setup.back": "← Geri",
    "setup.ownApp": "Oluşturduğunuz uygulama sizindir ve bu siteyi gösterir.",
    "setup.redirectHint":
      "Spotify INVALID_CLIENT: Invalid redirect URI yanıtı veriyorsa bu adres uygulamanıza kayıtlı değildir:",
    "setup.exportSettings": "Ayarları dosyaya kaydet",
    "setup.importSettings": "Ayarları dosyadan yükle",
    "setup.importConfirm":
      "Geçerli ayarlar bu dosyadakilerle değiştirilsin mi (Client ID {clientId})? Spotify oturumunuz kapanacak.",
    "setup.importBad": "Bu dosya bir ayar dışa aktarımı değil",
    "err.lfmKeyRefused": "Last.fm API anahtarınızı artık kabul etmiyor. Yeniden girin.",
    "err.spotifyDeclined": "Spotify'da erişimi reddettiniz.",
    "err.lfmBusy": "Last.fm şu anda meşgul. Bir dakika bekleyip tekrar deneyin.",
    "analysis.retry": "Tekrar dene",
    "playlists.signOut": "Çıkış yap",
    "signOut.notice":
      "Bu tarayıcıda Spotify oturumunuz kapatıldı. Last.fm kullanıcı adınız ve anahtarınız burada saklanmaya devam ediyor; Sıfırla bunları da siler.",
    "signOut.revoke": "Uygulamanın erişimini Spotify hesabınızdan kaldırın",
    "err.signInUnverified": "Giriş doğrulanamadı. Lütfen yeniden giriş yapın.",
    "err.storageBlocked":
      "Tarayıcınız bu sitenin giriş için gereken verileri saklamasına izin vermiyor. Bu site için site verilerine izin verip tekrar deneyin.",
    "err.redirectMismatch":
      "Spotify yönlendirme adresini reddetti. Spotify uygulamanızda Redirect URI tam olarak şu olmalı: {uri}",
    "err.unknownClient": "Spotify bu Client ID değerini tanımıyor. Uygulama sayfanızdan denetleyin.",

    "start.spotifyRefused": "Spotify reddetti: {error}. Çoğu zaman sebep Redirect URI uyuşmazlığıdır.",
    "start.settingsLost": "Ayarlar kayboldu, lütfen yeniden girin.",
    "start.connectSpotify": "Spotify’ı bağlayın.",
    "start.signInAgain": "Lütfen yeniden giriş yapın.",

    "err.tokenRefused": "Spotify token vermeyi reddetti",
    "err.sessionExpired": "Oturumun süresi doldu, yeniden giriş yapın",
    "err.notSignedIn": "Spotify’a giriş yapılmadı",
    "err.spotify": "Spotify hatası",

    "playlists.title": "Çalma listeleri",
    "playlists.reset": "Sıfırla",
    "playlists.readOnly": "Salt okunur",
    "picks.outside": {
      one: "Seçili {n} parça bu çalma listesinde değil.",
      other: "Seçili {n} parça bu çalma listesinde değil.",
    },
    "picks.clearOutside": "Bunları kaldır",
    "picks.restored": {
      one: "Seçili {n} parça geri getirildi.",
      other: "Seçili {n} parça geri getirildi.",
    },
    "picks.restoredOutside": {
      one: "Seçili {n} parça geri getirildi, {outside} tanesi bu listede değil.",
      other: "Seçili {n} parça geri getirildi, {outside} tanesi bu listede değil.",
    },
    "nav.playlistUnavailable":
      "Bu çalma listesi açılamadı. Silinmiş olabilir ya da artık erişiminiz olmayabilir.",

    "analysis.reading": "Çalma listesi okunuyor…",
    "analysis.progress": "Last.fm ile karşılaştırılıyor… {done} / {total}",
    "analysis.readError":
      "Bu çalma listesindeki şarkılar okunamadı. Spotify yalnızca size ait veya ortak çalıştığınız listelerin içeriğini veriyor; başkalarının ve Spotify’ın hazırladığı listeler artık analiz edilemiyor.",
    "analysis.summary": "{tracks} · {newArtists} · {unheard}",
    "analysis.truncated": "İlk {n} şarkı gösteriliyor; daha fazlası Last.fm’e çok fazla istek gerektirir.",
    "analysis.spotifyOwned": "Bu listeyi Spotify hazırlıyor, içinden şarkı silinemez.",
    "analysis.makeCopy": "Kopyasını oluştur",
    "analysis.empty": "Filtreye uyan bir şey yok.",

    "count.tracks": "{n} şarkı",
    "count.newArtists": "{n} yeni sanatçı",
    "count.unheard": "{n} dinlenmemiş",

    "filter.all": "Tümü",
    "filter.unknown": "Sanatçı yeni",
    "filter.known": "Sanatçı tanıdık",
    "filter.anyGenre": "Her tür",
    "filter.pickNew": "Dinlenmemişleri seç",
    "filter.pickHeard": "Dinlenmişleri seç",
    "filter.pickNone": "Seçimi kaldır",
    "album.pickAll": "Tümünü seç",
    "album.pickInvert": "Tersine çevir",
    "filter.recheck": "Yeniden denetle",

    "badge.known": "Tanıdık · {n}×",
    "badge.newArtist": "Yeni sanatçı",
    "badge.unheard": "{total} şarkıdan {n} dinlenmemiş",

    "album.tracksShort": "{n} şarkı",
    "album.openOnLastfm": "Albümü Last.fm’de aç",
    "album.loading": "Yayın yükleniyor…",
    "album.known": "{total} şarkıdan {n} dinlenmiş",
    "album.inPlaylist": "Listede",

    "type.single": "Single",
    "type.ep": "EP",
    "type.album": "Albüm",
    "type.compilation": "Derleme",

    "bar.picked": "Seçili: {n}",
    "bar.remove": "Sil",
    "bar.addHere": "Bu listeye",
    "bar.targetPlaceholder": "Çalma listesi…",
    "combo.noMatch": "Sonuç yok",
    "bar.add": "Ekle",
    "bar.move": "Taşı",
    "bar.save": "Beğenilenlere",
    "bar.clear": "Seçimi kaldır",

    "toast.added": "Eklendi: {n}",
    "toast.addedHere": "Listeye eklendi: {n}",
    "toast.moved": "Taşındı: {n}",
    "toast.saved": "Beğenilenlerde: {n}",
    "toast.removed": "Silindi: {n}",
    "toast.nothingInPlaylist": "Seçilenlerin hiçbiri bu listede değil",
    "toast.copyCreated": "Kopya oluşturuldu",
    "confirm.remove": "{n} şarkı silinsin mi? Geri alınamaz.",
    "prompt.copyName": "Kopyanın adı:",
    "copy.suffix": "kopya",
    "moved.lead": "Playlist Checker artık {domain} adresinde. Ayarlarınızı taşımak için:",
    "moved.open": "{domain} adresini açın ve ayar dosyasını orada yükleyin.",
    "moved.hide": "Gizle",
  },

  ja: {
    "lang.label": "言語",
    "theme.label": "テーマ",
    "theme.light": "ライト",
    "theme.dark": "ダーク",
    "theme.system": "システム",
    "common.loading": "読み込み中…",
    "about.link": "このアプリについて",
    "nav.label": "メイン",
    "nav.account": "アカウント",
    "nav.resetQuestion": "このブラウザーに保存されたものをすべて消去しますか？",
    "nav.resetConfirm": "消去",
    "nav.resetCancel": "キャンセル",
    "about.headline": "どのプレイリストでも、新しい曲が見つかる",
    "about.description":
      "Spotify のプレイリストで Last.fm 上すでに聴いた曲を見分け、新しい曲だけを残せます。サーバーには何も保存されません。",
    "about.lead":
      "プレイリストのどの曲をもう聴いたかがわかり、新しい曲だけを残せます。Last.fm の再生履歴を Spotify のプレイリストに重ねて使います。",
    "about.benefit1": "プレイリストの曲とアーティストを、Last.fm の再生履歴と照らし合わせます。",
    "about.benefit2": "聴いたことのあるものと新しいものを分けて表示するので、新しい曲が一目でわかります。",
    "about.benefit3": "曲の追加・移動・削除を Spotify 上で直接行えます。",
    "about.howTitle": "しくみ",
    "about.how":
      "Spotify アカウントと Last.fm プロフィールを接続します。アプリは Spotify からプレイリストを、Last.fm から再生履歴を読み込み、並べて表示します。",
    "about.privacy":
      "サーバーには何も保存されません。設定・セッション・キャッシュはすべてこのブラウザーの中にあります。",
    "legal.privacyLink": "プライバシー",
    "legal.termsLink": "利用規約",
    "legal.contactLink": "お問い合わせ",
    "legal.sourceLink": "ソースコード",
    "legal.sourceOnRequest": "{contact} へのリクエストで提供します",
    "legal.poweredBy": "Powered by {link}",
    "legal.spotify": "Spotify とは提携しておらず、Spotify の承認も受けていません。",
    "legal.updated": "最終更新：{date}",
    "legal.englishPrevails": "これは翻訳です。英語版と異なる場合は英語版が優先されます。",
    "privacy.title": "プライバシー",
    "privacy.description": "Playlist Checker が何をどこに保存し、どう消去できるか。",
    "privacy.1":
      "要点：Playlist Checker にはデータベースもアカウントもありません。必要なものはすべてあなたのブラウザーの中にあります。",
    "privacy.2":
      "ブラウザーのローカルストレージには設定が保存されます：Spotify の Client ID、Last.fm のユーザー名と API キー、Spotify のセッション、言語とテーマ、セットアップの進行状況、そして 1 日間は選択した曲。ブラウザーのデータベースには Last.fm の応答が最長 1 週間、プレイリスト一覧が 15 分間保存され、繰り返しのチェックが速くなります。サインイン中、タブは使い捨ての確認値を 2 つ保持します。",
    "privacy.3":
      "Spotify にはブラウザーから直接接続します。Last.fm は Web ページからの呼び出しを受け付けないため、このサイトのサーバー経由で接続します。そのリクエストには Last.fm の API キーとユーザー名、チェックするアーティスト・曲・アルバム名が含まれます。サーバーはそれを転送して応答を返すだけで、何も保存しません。",
    "privacy.4":
      "このサイトは Cloudflare でホストされています。Cloudflare はサイトを配信するために IP アドレスなどの技術的なリクエスト情報を、自社のプライバシーポリシーに従って処理します。",
    "privacy.5":
      "訪問数はこのサイト自身のサーバーで匿名で数えています。開いた画面ごとに、その種類（スタート、セットアップ、プレイリスト一覧、分析、プライバシー、利用規約）、表示言語、スマートフォンの画面かどうか、国、そして他のサイトから来た場合はそのサイト名を記録します。IP アドレス、Cookie、識別子は一切保存しないため、訪問をあなたに結びつけたり訪問どうしを結びつけたりすることはできません。記録は 3 か月後に削除されます。ブラウザーがサイトに追跡しないよう求めている場合（Global Privacy Control または Do Not Track）は何も数えません。トラッカー、広告、Cookie は一切ありません。",
    "privacy.6": "保存した設定ファイルにはキーが含まれます。他人と共有しないでください。",
    "privacy.7":
      "サインアウトすると、このブラウザーの Spotify セッションが終了し、Last.fm の情報は残ります。すべて消去するには、リセットを使うか、ブラウザーの設定でこのサイトのデータを削除してください。Spotify のプレイリストと Last.fm の履歴には影響しません。Spotify へのアクセス権を取り消すには、Spotify アカウントの「アプリを管理」から削除してください。",
    "privacy.8":
      "このサイトは運営者が個人的な非営利プロジェクトとして運営しています。お問い合わせ：{contact}。",
    "terms.title": "利用規約",
    "terms.description": "Playlist Checker の利用規約。",
    "terms.1":
      "Playlist Checker は現状のまま無料で提供され、いかなる保証もありません。ご利用は自己責任でお願いします。",
    "terms.2":
      "Spotify および Last.fm とは提携しておらず、承認や後援も受けていません。Spotify と Last.fm は各所有者の商標です。",
    "terms.3":
      "Spotify アプリと Last.fm の API キーはご自身で用意します。それらの管理と、Spotify および Last.fm の規約の遵守はご自身の責任です。",
    "terms.4":
      "曲の追加・移動・削除は実際の Spotify プレイリストを変更します。サイトはこの変更を取り消せないため、確定する前に確認してください。",
    "terms.5":
      "サービスは予告なく変更・終了することがあります。ソースコードは AGPL-3.0 ライセンスで公開されています：{source}。",
    "terms.6": "お問い合わせ：{contact}。",
    "about.setupTime":
      "セットアップは5分ほどです。自分用の Spotify アプリと Last.fm の API キーを作成します。ガイドが両方の手順を案内します。",
    "about.start": "はじめる",
    "about.continue": "続ける",
    "about.shot":
      "チェック後のプレイリスト。知っているアーティストと新しいアーティストを分け、未再生の曲を選択した状態です。",
    "about.albumShot": "アルバムを開くと、どの曲をもう聴いたかがわかり、残りの曲を選べます。",

    "setup.title": "設定",
    "setup.signIn": "ログイン",
    "setup.redirectNotice": "Spotify アプリの設定に、次の Redirect URI をそのまま追加してください：",
    "setup.lfmUser": "Last.fm ユーザー名",
    "setup.lfmKey": "Last.fm API キー",
    "setup.storedLocally": "入力した値はこのブラウザにのみ保存されます。",
    "setup.submit": "Spotify でログイン",
    "setup.linkSpotifyApp": "Spotify アプリ",
    "setup.linkLfmKey": "Last.fm キー",
    "setup.needClientId": "Client ID を入力してください",
    "setup.needLfmUser": "Last.fm ユーザー名を入力してください",
    "playlists.settings": "設定",
    "playlists.radarNote":
      "Spotify 自身のプレイリスト（Release Radar、Discover Weekly など）は API から取得できません。Spotify アプリで曲を自分のプレイリストにコピーし、そちらを解析してください。",
    "setup.step": "ステップ {n} / {total}",
    "setup.stepSpotify": "Spotify アプリ",
    "setup.stepLastfm": "Last.fm キー",
    "setup.spotify1": "Spotify のデベロッパーダッシュボードを開き、アプリを作成します:",
    "setup.spotify2": "Which API/SDKs are you planning to use では Web API だけを選びます。",
    "setup.spotify4": "アプリのページから Client ID をコピーして下に貼り付けます。",
    "setup.copy": "コピー",
    "setup.copied": "アドレスをコピーしました",
    "setup.copyFailed": "コピーできません。アドレスを選択して手動でコピーしてください",
    "setup.clientIdBad": "Client ID ではないようです。32 文字、数字と a–f です。",
    "setup.lastfm1": "Last.fm のキー申請フォームに記入し、発行された API キーをコピーします:",
    "setup.lastfm2": "すでに作成済みなら、発行済みのキーはこちらにあります:",
    "setup.linkLfmKeys": "Last.fm のキー一覧",
    "setup.needLfmKey": "Last.fm の API キーが必要です",
    "setup.checking": "確認中…",
    "setup.keyRefused": "Last.fm はこのキーを受け付けませんでした",
    "setup.continue": "次へ",
    "setup.back": "← 戻る",
    "setup.ownApp": "作成するアプリはあなたのものであり、このサイトを指します。",
    "setup.redirectHint":
      "Spotify が INVALID_CLIENT: Invalid redirect URI と返す場合、このアドレスがアプリに登録されていません:",
    "setup.exportSettings": "設定をファイルに保存",
    "setup.importSettings": "設定をファイルから読み込み",
    "setup.importConfirm":
      "現在の設定をこのファイルの内容（Client ID {clientId}）で置き換えますか？Spotify からサインアウトします。",
    "setup.importBad": "このファイルは設定のエクスポートではありません",
    "err.lfmKeyRefused": "Last.fm が API キーを受け付けなくなりました。入力し直してください。",
    "err.spotifyDeclined": "Spotify でアクセスを拒否しました。",
    "err.lfmBusy": "Last.fm が混み合っています。1 分ほど待ってからもう一度お試しください。",
    "analysis.retry": "再試行",
    "playlists.signOut": "サインアウト",
    "signOut.notice":
      "このブラウザーで Spotify からサインアウトしました。Last.fm のユーザー名とキーはここに残っています。リセットするとそれらも削除されます。",
    "signOut.revoke": "Spotify アカウントでアプリのアクセスを削除",
    "err.signInUnverified": "サインインを確認できませんでした。もう一度サインインしてください。",
    "err.storageBlocked":
      "ブラウザーがサインインに必要なデータの保存をこのサイトに許可していません。このサイトのデータを許可して、もう一度お試しください。",
    "err.redirectMismatch":
      "Spotify がリダイレクトアドレスを拒否しました。Spotify アプリの Redirect URI は正確にこれである必要があります: {uri}",
    "err.unknownClient": "Spotify はこの Client ID を知りません。アプリのページで確認してください。",

    "start.spotifyRefused":
      "Spotify に拒否されました：{error}。多くの場合、Redirect URI の不一致が原因です。",
    "start.settingsLost": "設定が失われました。もう一度入力してください。",
    "start.connectSpotify": "Spotify を接続してください。",
    "start.signInAgain": "もう一度ログインしてください。",

    "err.tokenRefused": "Spotify がトークンを発行しませんでした",
    "err.sessionExpired": "セッションの有効期限が切れました。もう一度ログインしてください",
    "err.notSignedIn": "Spotify にログインしていません",
    "err.spotify": "Spotify のエラー",

    "playlists.title": "プレイリスト",
    "playlists.reset": "リセット",
    "playlists.readOnly": "閲覧のみ",
    "picks.outside": {
      other: "選択中の {n} 曲はこのプレイリストにありません。",
    },
    "picks.clearOutside": "解除する",
    "picks.restored": {
      other: "選択していた {n} 曲を復元しました。",
    },
    "picks.restoredOutside": {
      other: "選択していた {n} 曲を復元しました。うち {outside} 曲はこのプレイリストにありません。",
    },
    "nav.playlistUnavailable":
      "このプレイリストを開けませんでした。削除されたか、アクセスできなくなった可能性があります。",

    "analysis.reading": "プレイリストを読み込み中…",
    "analysis.progress": "Last.fm と照合中… {done} / {total}",
    "analysis.readError":
      "このプレイリストの曲を読み込めませんでした。Spotify が内容を返すのは、自分が所有しているか共同編集しているプレイリストだけです。他人のプレイリストや Spotify 公式のプレイリストは分析できなくなりました。",
    "analysis.summary": "{tracks} · {newArtists} · {unheard}",
    "analysis.truncated": "最初の {n} 曲のみ表示しています。これ以上は Last.fm へのリクエストが多すぎます。",
    "analysis.spotifyOwned": "このプレイリストは Spotify が管理しているため、曲を削除できません。",
    "analysis.makeCopy": "コピーを作成",
    "analysis.empty": "条件に合うものはありません。",

    "count.tracks": "{n} 曲",
    "count.newArtists": "新しいアーティスト {n}",
    "count.unheard": "未聴 {n}",

    "filter.all": "すべて",
    "filter.unknown": "知らないアーティスト",
    "filter.known": "知っているアーティスト",
    "filter.anyGenre": "すべてのジャンル",
    "filter.pickNew": "未聴を選択",
    "filter.pickHeard": "既聴を選択",
    "filter.pickNone": "選択解除",
    "album.pickAll": "すべて選択",
    "album.pickInvert": "選択を反転",
    "filter.recheck": "再取得",

    "badge.known": "既知 · {n}回",
    "badge.newArtist": "新しいアーティスト",
    "badge.unheard": "{total} 曲中 {n} 曲未聴",

    "album.tracksShort": "{n} 曲",
    "album.openOnLastfm": "Last.fm でアルバムを開く",
    "album.loading": "リリースを読み込み中…",
    "album.known": "{total} 曲中 {n} 曲既聴",
    "album.inPlaylist": "プレイリスト内",

    "type.single": "シングル",
    "type.ep": "EP",
    "type.album": "アルバム",
    "type.compilation": "コンピレーション",

    "bar.picked": "選択中：{n}",
    "bar.remove": "削除",
    "bar.addHere": "このプレイリストへ",
    "bar.targetPlaceholder": "プレイリスト…",
    "combo.noMatch": "一致なし",
    "bar.add": "追加",
    "bar.move": "移動",
    "bar.save": "お気に入りへ",
    "bar.clear": "選択解除",

    "toast.added": "追加しました：{n}",
    "toast.addedHere": "プレイリストに追加しました：{n}",
    "toast.moved": "移動しました：{n}",
    "toast.saved": "お気に入りに追加：{n}",
    "toast.removed": "削除しました：{n}",
    "toast.nothingInPlaylist": "選択した曲はこのプレイリストにありません",
    "toast.copyCreated": "コピーを作成しました",
    "confirm.remove": "{n} 曲を削除しますか？元に戻せません。",
    "prompt.copyName": "コピーの名前：",
    "copy.suffix": "コピー",
    "moved.lead": "Playlist Checker は {domain} に移転しました。設定を引き継ぐには：",
    "moved.open": "{domain} を開き、設定ファイルを読み込んでください。",
    "moved.hide": "閉じる",
  },

  ru: {
    "lang.label": "Язык",
    "theme.label": "Тема",
    "theme.light": "Светлая",
    "theme.dark": "Тёмная",
    "theme.system": "Системная",
    "common.loading": "Гружу…",
    "about.link": "О сервисе",
    "nav.label": "Основное",
    "nav.account": "Аккаунт",
    "nav.resetQuestion": "Стереть всё, что сохранено в этом браузере?",
    "nav.resetConfirm": "Стереть",
    "nav.resetCancel": "Отмена",
    "about.headline": "Найдите новое в любом плейлисте",
    "about.description":
      "Узнайте, какие треки плейлиста Spotify вы уже слышали по данным Last.fm, и оставьте только новые. На сервере ничего не хранится.",
    "about.lead":
      "Узнайте, какие треки из плейлиста вы уже слышали, и оставьте только новые. Ваша история Last.fm — для ваших плейлистов Spotify.",
    "about.benefit1": "Каждый трек и исполнитель плейлиста сверяется с вашей историей Last.fm.",
    "about.benefit2": "Знакомое и новое показаны отдельно — новое сразу видно.",
    "about.benefit3": "Добавляйте, переносите и удаляйте треки прямо в Spotify.",
    "about.howTitle": "Как это работает",
    "about.how":
      "Подключите аккаунт Spotify и профиль Last.fm. Приложение берёт плейлисты из Spotify, историю прослушиваний из Last.fm и сопоставляет их.",
    "about.privacy":
      "На сервере ничего не хранится: настройки, сессия и сохранённые ответы остаются в этом браузере.",
    "legal.privacyLink": "Конфиденциальность",
    "legal.termsLink": "Условия",
    "legal.contactLink": "Контакт",
    "legal.sourceLink": "Исходный код",
    "legal.sourceOnRequest": "предоставляется по запросу: {contact}",
    "legal.poweredBy": "Данные: {link}",
    "legal.spotify": "Не связан со Spotify и не одобрен Spotify.",
    "legal.updated": "Обновлено: {date}",
    "legal.englishPrevails": "Это перевод. Если он расходится с английской версией, действует английская.",
    "privacy.title": "Конфиденциальность",
    "privacy.description": "Что хранит Playlist Checker, где и как это стереть.",
    "privacy.1":
      "Коротко: у Playlist Checker нет базы данных и учётных записей. Всё, что ему нужно, остаётся в вашем браузере.",
    "privacy.2":
      "Локальное хранилище браузера держит настройки: Client ID Spotify, имя пользователя и API-ключ Last.fm, сессию Spotify, язык и тему, ход настройки и в течение суток выбранные треки. База данных браузера хранит ответы Last.fm до недели, а список плейлистов — четверть часа, чтобы повторные проверки шли быстро. Во время входа вкладка хранит два одноразовых проверочных значения.",
    "privacy.3":
      "К Spotify браузер обращается напрямую. К Last.fm — через сервер этого сайта, потому что Last.fm не принимает запросы с веб-страниц. В этих запросах передаются ваш API-ключ и имя пользователя Last.fm и названия проверяемых исполнителей, треков и альбомов; сервер пересылает их, возвращает ответ и ничего не сохраняет.",
    "privacy.4":
      "Сайт размещён на Cloudflare, который обрабатывает технические данные запросов, например IP-адрес, чтобы доставить сайт, по своей политике конфиденциальности.",
    "privacy.5":
      "Посещения считаются анонимно на собственном сервере сайта: для каждого открытого экрана отмечается его вид (стартовый экран, настройка, список плейлистов, анализ, Конфиденциальность или Условия), язык интерфейса, телефонный ли это экран, ваша страна и, если вы пришли с другого сайта, его название. IP-адрес, cookie и какой-либо идентификатор не сохраняются, поэтому посещения нельзя связать ни с вами, ни друг с другом, а записи удаляются через три месяца. Если ваш браузер просит сайты не отслеживать вас (Global Privacy Control или Do Not Track), ничего не считается. Здесь нет трекеров, рекламы и cookie.",
    "privacy.6": "Сохранённый файл настроек содержит ваши ключи. Не передавайте его другим.",
    "privacy.7":
      "«Выйти» завершает сессию Spotify в этом браузере и сохраняет данные Last.fm. Чтобы стереть всё, нажмите «Сброс» или очистите данные этого сайта в настройках браузера. Ваши плейлисты Spotify и история Last.fm не пострадают. Чтобы отозвать доступ приложения к Spotify, удалите его в разделе «Управление приложениями» аккаунта Spotify.",
    "privacy.8": "Сайт ведёт его владелец как личный некоммерческий проект. Вопросы: {contact}.",
    "terms.title": "Условия",
    "terms.description": "Условия использования Playlist Checker.",
    "terms.1":
      "Playlist Checker предоставляется как есть, бесплатно и без каких-либо гарантий. Вы пользуетесь им на свой риск.",
    "terms.2":
      "Сервис не связан со Spotify и Last.fm, не одобрен и не спонсируется ими. Spotify и Last.fm — товарные знаки их владельцев.",
    "terms.3":
      "Вы используете собственное приложение Spotify и собственный API-ключ Last.fm. Вы отвечаете за них и за соблюдение условий Spotify и Last.fm.",
    "terms.4":
      "Добавление, перемещение и удаление треков меняет ваши настоящие плейлисты Spotify. Сайт не может отменить эти изменения, поэтому проверяйте перед подтверждением.",
    "terms.5":
      "Сервис может измениться или прекратить работу в любой момент. Его исходный код опубликован под лицензией AGPL-3.0: {source}.",
    "terms.6": "Вопросы: {contact}.",
    "about.setupTime":
      "Настройка займёт около пяти минут: вы создадите своё приложение Spotify и ключ API Last.fm, мастер проведёт по обоим шагам.",
    "about.start": "Начать",
    "about.continue": "Продолжить",
    "about.shot":
      "Плейлист после проверки: знакомые и новые исполнители отдельно, непрослушанные треки выделены.",
    "about.albumShot":
      "Раскройте альбом, чтобы увидеть, какие треки из него вы уже слышали, и выбрать остальные.",

    "setup.title": "Настройка",
    "setup.signIn": "Вход",
    "setup.redirectNotice": "В настройках приложения Spotify добавь Redirect URI ровно такой:",
    "setup.lfmUser": "Ник на Last.fm",
    "setup.lfmKey": "Ключ Last.fm API",
    "setup.storedLocally": "Значения хранятся только в этом браузере.",
    "setup.submit": "Войти через Spotify",
    "setup.linkSpotifyApp": "Приложение Spotify",
    "setup.linkLfmKey": "Ключ Last.fm",
    "setup.needClientId": "Нужен Client ID",
    "setup.needLfmUser": "Нужен ник Last.fm",
    "playlists.settings": "Настройки",
    "playlists.radarNote":
      "Плейлисты самого Spotify (Release Radar, Discover Weekly и подобные) через API недоступны. Скопируйте их треки в свой плейлист в приложении Spotify и разбирайте его.",
    "setup.step": "Шаг {n} из {total}",
    "setup.stepSpotify": "Приложение Spotify",
    "setup.stepLastfm": "Ключ Last.fm",
    "setup.spotify1": "Откройте панель разработчика Spotify и создайте приложение:",
    "setup.spotify2": "В разделе Which API/SDKs are you planning to use отметьте только Web API.",
    "setup.spotify4": "Скопируйте Client ID со страницы приложения и вставьте ниже.",
    "setup.copy": "Копировать",
    "setup.copied": "Адрес скопирован",
    "setup.copyFailed": "Не удалось скопировать: выделите адрес и скопируйте вручную",
    "setup.clientIdBad": "Это не похоже на Client ID: 32 символа, цифры и a–f.",
    "setup.lastfm1": "Заполните форму ключа Last.fm и скопируйте выданный API key:",
    "setup.lastfm2": "Ключ уже есть? Выданные ключи перечислены здесь:",
    "setup.linkLfmKeys": "ваши ключи Last.fm",
    "setup.needLfmKey": "Нужен ключ API Last.fm",
    "setup.checking": "Проверяем…",
    "setup.keyRefused": "Last.fm не принял этот ключ",
    "setup.continue": "Дальше",
    "setup.back": "← Назад",
    "setup.ownApp": "Приложение, которое вы создаёте, принадлежит вам и указывает на этот сайт.",
    "setup.redirectHint":
      "Если Spotify отвечает INVALID_CLIENT: Invalid redirect URI, значит этот адрес не записан в вашем приложении:",
    "setup.exportSettings": "Сохранить настройки в файл",
    "setup.importSettings": "Загрузить настройки из файла",
    "setup.importConfirm":
      "Заменить текущие настройки теми, что в файле (Client ID {clientId})? Вход в Spotify будет сброшен.",
    "setup.importBad": "Это не файл с настройками",
    "err.lfmKeyRefused": "Last.fm больше не принимает ваш ключ API. Введите его заново.",
    "err.spotifyDeclined": "Вы отказали в доступе в Spotify.",
    "err.lfmBusy": "Last.fm сейчас перегружен. Подождите минуту и попробуйте снова.",
    "analysis.retry": "Повторить",
    "playlists.signOut": "Выйти",
    "signOut.notice":
      "Вы вышли из Spotify в этом браузере. Имя пользователя и ключ Last.fm по-прежнему хранятся здесь; «Сброс» удалит и их.",
    "signOut.revoke": "Отозвать доступ приложения в аккаунте Spotify",
    "err.signInUnverified": "Не удалось подтвердить вход. Войдите ещё раз.",
    "err.storageBlocked":
      "Браузер не даёт сайту сохранить данные, нужные для входа. Разрешите данные для этого сайта и попробуйте снова.",
    "err.redirectMismatch":
      "Spotify отклонил адрес возврата. В вашем приложении Spotify Redirect URI должен быть в точности таким: {uri}",
    "err.unknownClient": "Spotify не знает этот Client ID. Проверьте его на странице приложения.",

    "start.spotifyRefused": "Spotify отказал: {error}. Чаще всего это несовпадение Redirect URI.",
    "start.settingsLost": "Настройки потерялись — введи заново.",
    "start.connectSpotify": "Подключи Spotify.",
    "start.signInAgain": "Нужно войти заново.",

    "err.tokenRefused": "Spotify отказал в токене",
    "err.sessionExpired": "Сессия истекла, войди заново",
    "err.notSignedIn": "Нет входа в Spotify",
    "err.spotify": "Ошибка Spotify",

    "playlists.title": "Плейлисты",
    "playlists.reset": "Сброс",
    "playlists.readOnly": "Чтение",
    "picks.outside": {
      one: "{n} отмеченный трек не в этом плейлисте.",
      few: "{n} отмеченных трека не в этом плейлисте.",
      many: "{n} отмеченных треков не в этом плейлисте.",
      other: "{n} отмеченных треков не в этом плейлисте.",
    },
    "picks.clearOutside": "Снять их",
    "picks.restored": {
      one: "Восстановлен {n} отмеченный трек.",
      few: "Восстановлено {n} отмеченных трека.",
      many: "Восстановлено {n} отмеченных треков.",
      other: "Восстановлено {n} отмеченных треков.",
    },
    "picks.restoredOutside": {
      one: "Восстановлен {n} отмеченный трек, из них {outside} не в этом плейлисте.",
      few: "Восстановлено {n} отмеченных трека, из них {outside} не в этом плейлисте.",
      many: "Восстановлено {n} отмеченных треков, из них {outside} не в этом плейлисте.",
      other: "Восстановлено {n} отмеченных треков, из них {outside} не в этом плейлисте.",
    },
    "nav.playlistUnavailable":
      "Не получилось открыть этот плейлист. Возможно, он удалён или больше недоступен тебе.",

    "analysis.reading": "Читаю плейлист…",
    "analysis.progress": "Сверяю с Last.fm… {done} из {total}",
    "analysis.readError":
      "Не получилось прочитать треки этого плейлиста. Spotify отдаёт содержимое только для плейлистов, которыми ты владеешь или которые ведёшь как соавтор — чужие и курируемые Spotify плейлисты для разбора больше не подходят.",
    "analysis.summary": "{tracks} · {newArtists} · {unheard}",
    "analysis.truncated": {
      one: "Показан первый {n} трек — дальше запросов к Last.fm стало бы слишком много.",
      few: "Показаны первые {n} трека — дальше запросов к Last.fm стало бы слишком много.",
      many: "Показаны первые {n} треков — дальше запросов к Last.fm стало бы слишком много.",
      other: "Показаны первые {n} трека — дальше запросов к Last.fm стало бы слишком много.",
    },
    "analysis.spotifyOwned": "Плейлист собирает Spotify, удалять из него нельзя.",
    "analysis.makeCopy": "Сделать копию",
    "analysis.empty": "Под фильтр ничего не подошло.",

    "count.tracks": { one: "{n} трек", few: "{n} трека", many: "{n} треков", other: "{n} трека" },
    "count.newArtists": {
      one: "{n} новое имя",
      few: "{n} новых имени",
      many: "{n} новых имён",
      other: "{n} новых имени",
    },
    "count.unheard": "{n} не слушал",

    "filter.all": "Все",
    "filter.unknown": "Артист незнаком",
    "filter.known": "Артист знаком",
    "filter.anyGenre": "Любой жанр",
    "filter.pickNew": "Выделить непрослушанные",
    "filter.pickHeard": "Выделить прослушанные",
    "filter.pickNone": "Снять",
    "album.pickAll": "Выбрать все",
    "album.pickInvert": "Инвертировать",
    "filter.recheck": "Перепроверить",

    "badge.known": "Знаком · {n}×",
    "badge.newArtist": "Новый артист",
    "badge.unheard": "{n} из {total} не слушал",

    "album.tracksShort": "{n} тр.",
    "album.openOnLastfm": "Открыть альбом на Last.fm",
    "album.loading": "Гружу релиз…",
    "album.known": "{n} из {total} знакомы",
    "album.inPlaylist": "В плейлисте",

    "type.single": "Сингл",
    "type.ep": "EP",
    "type.album": "Альбом",
    "type.compilation": "Сборник",

    "bar.picked": "Выбрано {n}",
    "bar.remove": "Удалить",
    "bar.addHere": "В этот плейлист",
    "bar.targetPlaceholder": "Плейлист…",
    "combo.noMatch": "Ничего не найдено",
    "bar.add": "Добавить",
    "bar.move": "Переместить",
    "bar.save": "В любимые",
    "bar.clear": "Снять",

    "toast.added": "Добавлено {n}",
    "toast.addedHere": "Добавлено в плейлист: {n}",
    "toast.moved": "Перемещено {n}",
    "toast.saved": "В любимых: {n}",
    "toast.removed": "Удалено {n}",
    "toast.nothingInPlaylist": "Выбранного нет в этом плейлисте",
    "toast.copyCreated": "Копия создана",
    "confirm.remove": {
      one: "Удалить {n} трек? Отменить нельзя.",
      few: "Удалить {n} трека? Отменить нельзя.",
      many: "Удалить {n} треков? Отменить нельзя.",
      other: "Удалить {n} трека? Отменить нельзя.",
    },
    "prompt.copyName": "Название копии:",
    "copy.suffix": "копия",
    "moved.lead": "Playlist Checker теперь живёт на {domain}. Чтобы перенести настройки:",
    "moved.open": "Открой {domain} и загрузи там файл с настройками.",
    "moved.hide": "Скрыть",
  },
};
