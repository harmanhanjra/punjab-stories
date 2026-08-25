# Punjab Stories 🛺

A top-down, GTA-1-style open-world game set in a procedurally generated Punjab
city — walk, jack a bus/rickshaw/car, and drive across town. Vanilla JavaScript
+ Canvas, **zero runtime dependencies**. Version 1 of the "Punjab Stories"
franchise plan (see `docs/SPEC.md`).

![genre](https://img.shields.io/badge/genre-top--down%20open%20world-orange)

## Play

```bash
npm start          # serves http://localhost:8123
```

Open the URL in a browser. Controls: **WASD/arrows** move & drive · **E**
enter/exit vehicle. Time runs 1 game-min per real-sec with day/night tinting.
The city grid (roads every 4 tiles, buildings/parks/water blocks) is generated
from a seed — same seed, same city.

## Why

Operator directive to build a GTA-like game with a Punjab map, scoped per cycle.
Research (`docs/RESEARCH.md`): build-your-own-x's Game section has 34 tutorials
but no JS top-down open-world one; GitHub search found no maintained JS
GTA-style top-down repos — an open niche. Mechanics follow proven patterns:
fixed-timestep loop (Handmade Hero), seeded deterministic map, tile collision.

## Architecture

- `src/city.js` — mulberry32 PRNG + deterministic tile-grid city generator
- `src/entities.js` — player walk + car physics (accel/friction/curb stop); pure logic, no DOM
- `src/game.js` — fixed-timestep simulation, spawn, enter/exit vehicles, clock
- `src/missions.js` — mission state machine (IDLE→ACTIVE→COMPLETE/FAILED)
- `src/render.js` — Canvas renderer with camera culling + night tint
- `src/main.js`, `index.html` — browser shell; `server.js` — zero-dep static server

## Test results

Node built-in runner. Last run (`npm test`):

```
# tests 13 / # pass 13 / # fail 0   (exit 0)
```

Covers: map determinism, road topology, PRNG bounds, mission lifecycle &
timeout, 10-minute headless simulation, car entry/drive movement (>10px in 2s),
speed cap under input, no-car-nearby toggle rejection, day/night boundaries.

Live smoke test: server returns 200 for `/` and `/src/main.js`; path-traversal
attempts (`/../…`, `/..%2f…`, `%2e%2e`) are rejected (403/404) — see SECURITY.md.

## Known limitations (V1 scope)

- No pedestrians/NPC AI, combat, audio, saves, mobile controls (planned V2+)
- Cars can't collide with each other yet; only curb collision
- Missions are tracked but not yet surfaced as objectives on the map
- Single fixed viewport camera follows player only

## Security audit summary

Self-audit by the authoring agent using manual review + live curl probes — not
a substitute for independent review. Details in `docs/SECURITY.md`.

- Zero dependencies → no supply-chain surface (`npm audit`: n/a-clean)
- Static server: percent-decode → backslash-normalize → `path.resolve` → strict
  prefix check; verified traversal attempts blocked; malformed encoding → 400
- Binds localhost by default via dev-server usage pattern; no secrets, no auth,
  no user data stored

Open risks: server is for local play only (no hardening for public hosting —
use a real static host for deployment); canvas rendering untested headlessly
beyond logic tests.

## If continued (roadmap)

V2: NPC traffic + wanted level + radio · V3: low-poly 3D Three.js overworld ·
V4: mission editor with shareable JSON missions.

## License

MIT
