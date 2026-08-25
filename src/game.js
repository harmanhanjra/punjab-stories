// Game loop: fixed-timestep simulation, render callback decoupled. Headless-testable.

import { generateCity, TILE } from './city.js';
import { createPlayer, createCar, updatePlayer } from './entities.js';
import { createMissionState } from './missions.js';

export const TILE_SIZE = 48;

export function createGame({ seed = 42, cols = 33, rows = 33 } = {}) {
  const city = generateCity(cols, rows, seed);
  city.tileSize = TILE_SIZE;
  // spawn player at an intersection near center; scatter cars on roads
  const mid = Math.floor(cols / 2) - ((Math.floor(cols / 2)) % 4) + 1;
  const player = createPlayer(mid * TILE_SIZE + TILE_SIZE / 2, mid * TILE_SIZE + TILE_SIZE / 2);
  const rand = () => 0.5; // deterministic car placement
  const cars = [];
  let n = 0;
  for (let r = 1; r < rows; r += 4) {
    for (let c = 3; c < cols; c += 6) {
      if (n >= 12) break;
      const kinds = ['car', 'bus', 'rickshaw'];
      cars.push(createCar(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2, kinds[n % 3]));
      n++;
    }
  }
  return { city, player, cars, missions: createMissionState(), time: 8 * 3600 }; // start 8am
}

const INPUT_KEYS = ['up', 'down', 'left', 'right', 'action'];
export function emptyInput() {
  return Object.fromEntries(INPUT_KEYS.map((k) => [k, false]));
}

// One fixed step (dt=1/60). Returns game state.
export function step(game, input) {
  const dt = 1 / 60;
  game.time = (game.time + dt * 60) % (24 * 3600); // 1 real s = 1 game min
  updatePlayer(game.player, input, game.city, game.cars, dt);
  return game;
}

// Enter/exit nearest car within pickup radius.
export function toggleCar(game) {
  const p = game.player;
  if (p.inCar != null) {
    p.inCar = null;
    return true;
  }
  let best = -1, bestD = 64;
  game.cars.forEach((car, i) => {
    const d = Math.hypot(car.x - p.x, car.y - p.y);
    if (d < bestD) { bestD = d; best = i; }
  });
  if (best >= 0) { p.inCar = best; return true; }
  return false;
}

export function isNight(game) {
  const h = game.time / 3600;
  return h < 6.5 || h > 19;
}
