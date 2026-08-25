// Mission state machine: IDLE -> ACTIVE -> {COMPLETE, FAILED}. Deterministic, time-based.

export const MISSIONS = [
  { id: 'deliver', label: 'Deliver phulkari to the old city', timeLimit: 60,
    describe: (city) => 'Drive the package to the marked corner before time runs out.' },
  { id: 'bus-run', label: 'Bus route: 3 stops before sunset', timeLimit: 90,
    describe: () => 'Hit all three stops in the bus.' },
  { id: 'rickshaw-rush', label: 'Rickshaw rush across town', timeLimit: 45,
    describe: () => 'Cross to the far side of the city in the rickshaw.' },
];

export function createMissionState(missions = MISSIONS) {
  return { missions, current: null, elapsed: 0, status: 'IDLE', completed: [] };
}

export function startMission(st, id) {
  const m = st.missions.find((m) => m.id === id);
  if (!m) throw new Error(`unknown mission ${id}`);
  st.current = m;
  st.elapsed = 0;
  st.status = 'ACTIVE';
  return st;
}

// tick advances timers; arrive() marks checkpoint progress.
export function tick(st, dt) {
  if (st.status !== 'ACTIVE') return st;
  st.elapsed += dt;
  if (st.elapsed >= st.current.timeLimit) st.status = 'FAILED';
  return st;
}

export function complete(st) {
  if (st.status === 'ACTIVE') {
    st.status = 'COMPLETE';
    st.completed.push(st.current.id);
  }
  return st;
}
