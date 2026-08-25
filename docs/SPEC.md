# Punjab Stories V1 — spec (cycle 5, Game)

1. Problem: no playable, open, GTA-style game set in Punjab exists; also no JS top-down open-world tutorial in build-your-own-x.
2. User: browser players (desktop keyboard); portfolio viewers; Channel A audience.
3. Solution: vanilla TypeScript-free JS + Canvas top-down 2D city — walk, enter/exit & drive cars with simple physics,
   seeded procedural street grid styled as a Punjab city (buses, signage colors), 3 missions (deliver, reach-in-time, chase-avoid),
   day-night tint cycle. Static site, zero runtime deps.
4. Why now: operator directive (game series V1); empty niche per research log.
5. Done (falsifiable): `npm test` passes logic tests (car physics, collision, mission state machine, map gen determinism);
   game runs headless-simulated for N ticks without errors; index.html playable via any static server; PR opened.

Non-goals this cycle: NPCs/pedestrian AI, shooting/combat, audio, save games, mobile controls, multiplayer.
