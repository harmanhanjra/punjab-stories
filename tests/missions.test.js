import test from 'node:test';
import assert from 'node:assert/strict';
import { createMissionState, startMission, tick, complete } from '../src/missions.js';

test('mission lifecycle: idle -> active -> complete', () => {
  const st = createMissionState();
  assert.equal(st.status, 'IDLE');
  startMission(st, 'deliver');
  assert.equal(st.status, 'ACTIVE');
  complete(st);
  assert.equal(st.status, 'COMPLETE');
  assert.deepEqual(st.completed, ['deliver']);
});

test('mission fails when time limit exceeded', () => {
  const st = createMissionState();
  startMission(st, 'rickshaw-rush'); // 45s limit
  for (let i = 0; i < 46; i++) tick(st, 1);
  assert.equal(st.status, 'FAILED');
});

test('unknown mission id throws', () => {
  assert.throws(() => startMission(createMissionState(), 'nope'), /unknown mission/);
});
