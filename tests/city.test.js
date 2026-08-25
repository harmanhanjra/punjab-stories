import test from 'node:test';
import assert from 'node:assert/strict';
import { generateCity, TILE, mulberry32 } from '../src/city.js';

test('map generation is deterministic per seed', () => {
  const a = generateCity(33, 33, 42);
  const b = generateCity(33, 33, 42);
  const c = generateCity(33, 33, 7);
  assert.deepEqual(a.grid, b.grid);
  assert.notDeepEqual(a.grid, c.grid);
});

test('roads form on every 4th row/col and connect at intersections', () => {
  const city = generateCity(17, 17, 1);
  assert.equal(city.grid[1 * 17 + 1], TILE.XING);       // r=1,c=1
  assert.equal(city.grid[1 * 17 + 2], TILE.ROAD_H);
  assert.equal(city.grid[2 * 17 + 1], TILE.ROAD_V);
});

test('isRoad covers road types only', () => {
  const city = generateCity(9, 9, 5);
  assert.ok(city.isRoad(1, 1));
  assert.ok(!city.isRoad(0, 0)); // building block
});

test('mulberry32 stays in [0,1) and repeats with same seed', () => {
  const r1 = mulberry32(99), r2 = mulberry32(99);
  for (let i = 0; i < 100; i++) {
    const v1 = r1(), v2 = r2();
    assert.equal(v1, v2);
    assert.ok(v1 >= 0 && v1 < 1);
  }
});
