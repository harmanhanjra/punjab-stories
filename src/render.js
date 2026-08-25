// Canvas renderer: tiles, cars, player, day-night tint, mission HUD. DOM-coupled but thin.

import { TILE } from './city.js';
import { isNight } from './game.js';

const COLORS = {
  [TILE.ROAD_H]: '#3f3f46', [TILE.ROAD_V]: '#3f3f46', [TILE.XING]: '#52525b',
  [TILE.BUILDING]: '#a16207', [TILE.PARK]: '#166534', [TILE.WATER]: '#1d4ed8',
};

export function render(ctx, game, canvasW, canvasH) {
  const ts = game.city.tileSize;
  ctx.fillStyle = '#111'; ctx.fillRect(0, 0, canvasW, canvasH);
  const c0 = Math.max(0, Math.floor((game.player.x - canvasW / 2) / ts));
  const r0 = Math.max(0, Math.floor((game.player.y - canvasH / 2) / ts));
  for (let r = r0; r < Math.min(game.city.rows, r0 + canvasH / ts + 1); r++) {
    for (let c = c0; c < Math.min(game.city.cols, c0 + canvasW / ts + 1); c++) {
      const t = game.city.grid[r * game.city.cols + c];
      ctx.fillStyle = COLORS[t] || '#333';
      // buildings get a little variation so blocks don't look flat
      if (t === TILE.BUILDING) ctx.fillStyle = (r * 31 + c * 17) % 3 === 0 ? '#ca8a04' : '#854d0e';
      ctx.fillRect(c * ts, r * ts, ts - 1, ts - 1);
    }
  }
  drawCars(ctx, game, ts);
  drawPlayer(ctx, game);
  if (isNight(game)) {
    ctx.fillStyle = 'rgba(15,23,42,0.35)';
    ctx.fillRect(0, 0, canvasW, canvasH);
  }
}

function drawCars(ctx, game, ts) {
  for (const car of game.cars) {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    const len = car.kind === 'bus' ? 44 : car.kind === 'rickshaw' ? 22 : 30;
    ctx.fillStyle = car.color;
    ctx.fillRect(-len / 2, -9, len, 18);
    if (car.kind === 'bus') { ctx.fillStyle = '#065f46'; ctx.fillRect(-len / 2, -9, len, 5); } // green bus stripe
    ctx.restore();
  }
}

function drawPlayer(ctx, game) {
  const p = game.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  if (p.inCar == null) {
    ctx.rotate(p.dir);
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.stroke();
  }
  ctx.restore();
}
