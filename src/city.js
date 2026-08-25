// Seeded PRNG (mulberry32) + deterministic city map generator.
// The city is a tile grid: 0=road-h, 1=road-v, 2=intersection, 3=building, 4=park, 5=water.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const TILE = { ROAD_H: 0, ROAD_V: 1, XING: 2, BUILDING: 3, PARK: 4, WATER: 5 };

// Generate a grid city: every 4th row/col is a road; blocks filled with buildings/parks/water.
export function generateCity(cols, rows, seed = 42) {
  const rand = mulberry32(seed);
  const grid = new Array(rows * cols).fill(TILE.BUILDING);
  const isRoadC = (c) => c % 4 === 1;
  const isRoadR = (r) => r % 4 === 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let t;
      if (isRoadC(c) && isRoadR(r)) t = TILE.XING;
      else if (isRoadC(c)) t = TILE.ROAD_V;
      else if (isRoadR(r)) t = TILE.ROAD_H;
      else {
        const roll = rand();
        t = roll < 0.72 ? TILE.BUILDING : roll < 0.94 ? TILE.PARK : TILE.WATER;
      }
      grid[r * cols + c] = t;
    }
  }
  return { cols, rows, seed, grid, isRoad: (c, r) => {
    if (c < 0 || r < 0 || c >= cols || r >= rows) return false;
    const t = grid[r * cols + c];
    return t === TILE.ROAD_H || t === TILE.ROAD_V || t === TILE.XING;
  } };
}
