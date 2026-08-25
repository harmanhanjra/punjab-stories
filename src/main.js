// Browser entry: canvas, keyboard input, HUD, main loop.
import { createGame, step, emptyInput, toggleCar } from './game.js';
import { render } from './render.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;

const game = createGame({});
const input = emptyInput();
const KEYMAP = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };

addEventListener('keydown', (e) => {
  if (e.code === 'KeyE') { toggleCar(game); return; }
  const k = KEYMAP[e.code];
  if (k) { input[k] = true; e.preventDefault(); }
});
addEventListener('keyup', (e) => {
  const k = KEYMAP[e.code];
  if (k) input[k] = false;
});

let last = performance.now();
function frame(now) {
  // fixed-timestep catch-up (max 5 steps to avoid spiral of death)
  let steps = Math.min(5, Math.floor((now - last) / (1000 / 60)));
  last = now;
  while (steps-- > 0) step(game, input);
  render(ctx, game, canvas.width, canvas.height);
  drawHud();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function drawHud() {
  const h = Math.floor(game.time / 3600), m = Math.floor((game.time % 3600) / 60);
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.fillText(`🕰️ ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}   🚗 E: enter/exit   WASD/Arrows`, 12, 24);
  const st = game.missions.status;
  if (st !== 'IDLE') {
    ctx.fillText(`Mission: ${st} (${Math.ceil(game.missions.elapsed)}s)`, 12, 48);
  } else {
    ctx.fillText('Missions: deliver · bus-run · rickshaw-rush — start by finding a vehicle!', 12, 48);
  }
}
