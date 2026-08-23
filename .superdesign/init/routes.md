# Routes

Static HTML routing; there is no router.

- `/` → `index.html` — realtime game entry.
- `/realtime.html` → `realtime.html` — realtime game.
- `/tactics.html` → `tactics.html` — tactical campaign and the requested title screen.
- `/studio.html` → `studio.html` — visual tuning editor embedding the games in an iframe.

All pages load `poop-config.js`. TACTICS is a single document whose title, battle, camp, and ending states are overlay screens.
