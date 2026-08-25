// Player + vehicle physics. Deterministic: update(state, input, dt) mutates and returns state.
// Pure logic — no DOM — so tests can simulate headless.

export const SPEED_LIMIT = 260;      // px/s in car
export const WALK_SPEED = 90;        // px/s on foot
export const ACCEL = 300;
export const FRICTION = 140;

export function createPlayer(x, y) {
  return { x, y, dir: 0, inCar: null, speed: 0 };
}

export function createCar(x, y, kind = 'car') {
  // kinds: car, bus, rickshaw — buses slower/heavier, rickshaw nimbler
  const stats = {
    car: { max: SPEED_LIMIT, accel: ACCEL, color: '#e2e8f0' },
    bus: { max: 180, accel: 120, color: '#f59e0b' },
    rickshaw: { max: 200, accel: 340, color: '#22c55e' },
  };
  return { x, y, angle: -Math.PI / 2, speed: 0, kind, ...stats[kind], occupied: false };
}

// dt in seconds; input: {up,down,left,right,action}
export function updatePlayer(p, input, city, cars, dt, TILE_ROAD_CHECK) {
  if (p.inCar != null) {
    const car = cars[p.inCar];
    stepCar(car, input, city, dt);
    p.x = car.x; p.y = car.y;
    return p;
  }
  let dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  let dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  if (dx || dy) {
    const len = Math.hypot(dx, dy);
    const nx = p.x + (dx / len) * WALK_SPEED * dt;
    const ny = p.y + (dy / len) * WALK_SPEED * dt;
    // walk on roads and parks only; buildings block
    if (!isBlocked(city, nx, p.y)) p.x = nx;
    if (!isBlocked(city, p.x, ny)) p.y = ny;
    p.dir = Math.atan2(dy, dx);
  }
  return p;
}

function isBlocked(city, x, y) {
  const c = Math.floor(x / city.tileSize);
  const r = Math.floor(y / city.tileSize);
  const t = city.grid[r * city.cols + c];
  return t === 3 || t === 5; // building or water
}

function roadOnly(city, x, y) {
  const c = Math.floor(x / city.tileSize);
  const r = Math.floor(y / city.tileSize);
  const t = city.grid[r * city.cols + c];
  return t === 0 || t === 1 || t === 2;
}

export function stepCar(car, input, city, dt) {
  if (input.up) car.speed += car.accel * dt;
  else if (input.down) car.speed -= car.accel * 0.7 * dt;
  else car.speed -= Math.sign(car.speed) * FRICTION * dt;
  car.speed = Math.max(-60, Math.min(car.max, car.speed));

  if (car.speed !== 0 && (input.left || input.right)) {
    const turn = (input.left ? -1 : 1) * 1.9 * dt * Math.sign(car.speed);
    car.angle += turn;
  }
  const nx = car.x + Math.cos(car.angle) * car.speed * dt;
  const ny = car.y + Math.sin(car.angle) * car.speed * dt;
  if (roadOnly(city, nx, ny)) { car.x = nx; car.y = ny; }
  else car.speed = 0; // curb hit — stop
  // keep angle sane
  if (car.angle > Math.PI) car.angle -= 2 * Math.PI;
  if (car.angle < -Math.PI) car.angle += 2 * Math.PI;
}
