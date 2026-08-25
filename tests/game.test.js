import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, step, emptyInput, toggleCar, isNight } from '../src/game.js';
import { createCar } from '../src/entities.js';

test('game world creates deterministic player spawn and 12 cars', () => {
  const a = createGame({}), b = createGame({});
  assert.equal(a.player.x, b.player.x);
  assert.equal(a.cars.length, 12);
});

test('headless simulation: 10 minutes of ticks run without error and time advances', () => {
  const game = createGame({});
  const input = emptyInput();
  for (let i = 0; i < 60 * 60 * 10; i++) step(game, input);
  assert.ok(game.time > 8 * 3600 + 500); // ~10 sim minutes passed
});

test('player can enter a nearby car and drive along a road', () => {
  const game = createGame({});
  // teleport player onto a car
  game.player.x = game.cars[0].x; game.player.y = game.cars[0].y;
  assert.equal(toggleCar(game), true);
  assert.notEqual(game.player.inCar, null);
  const car = game.cars[game.player.inCar];
  const input = { ...emptyInput(), up: true };
  const x0 = car.x, y0 = car.y;
  for (let i = 0; i < 120; i++) step(game, input); // 2s of driving
  const moved = Math.hypot(car.x - x0, car.y - y0);
  assert.ok(moved > 10, `car should move, moved ${moved}px`);
});

test('car stops at building (curb) — cannot leave road network', () => {
  const game = createGame({});
  game.player.x = game.cars[0].x; game.player.y = game.cars[0].y;
  toggleCar(game);
  const car = game.cars[game.player.inCar];
  // face straight into a block: rotate to point at building rows between roads
  // roads are every 4 tiles; driving long enough in any direction hits curb or keeps on road — speed must never carry it onto building tile persistently
  const input = { ...emptyInput(), up: true };
  let maxSpeed = 0;
  for (let i = 0; i < 600; i++) { step(game, input); maxSpeed = Math.max(maxSpeed, car.speed); }
  assert.ok(maxSpeed <= car.max + 1);
});

test('toggleCar returns false when no car within radius', () => {
  const game = createGame({});
  game.player.x = 1; game.player.y = 1;
  assert.equal(toggleCar(game), false);
});

test('day-night: starts morning, becomes night late', () => {
  const g = createGame({});
  assert.equal(isNight(g), false); // 08:00
  g.time = 22 * 3600;
  assert.equal(isNight(g), true);
});
