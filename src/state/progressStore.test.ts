import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalRepository } from '../services/storage';
import { attempt, fixtureCourse } from '../test/courseFixture';
import { setDeps } from './deps';
import { completedIds, useProgressStore } from './progressStore';

const repo = () => createLocalRepository();
const store = () => useProgressStore.getState();

beforeEach(async () => {
  localStorage.clear();
  setDeps({ repository: repo(), course: fixtureCourse });
  await store().reset();
});

describe('progressStore', () => {
  it('completes a lesson once every exercise passed (D-58)', async () => {
    expect(await store().recordAttempt(attempt('u1-l1-e1', 90))).toBeNull();
    expect(await store().recordAttempt(attempt('u1-l1-e2', 40))).toBeNull();
    expect(await store().recordAttempt(attempt('u1-l1-e2', 85))).toBe('u1-l1');
    expect(await store().recordAttempt(attempt('u1-l1-e2', 95))).toBeNull();
    expect(completedIds(store())).toEqual(new Set(['u1-l1']));
    const snap = await repo().load();
    expect(snap.attempts).toHaveLength(4);
    expect(snap.completedLessons.map((l) => l.source)).toEqual(['normal']);
  });

  it('records summary attempts without completing lessons', async () => {
    expect(await store().recordAttempt(attempt('u1-s1', 100))).toBeNull();
    expect(store().completedLessons).toEqual([]);
  });

  it('marks placement lessons with source placement, skipping unknown ids (D-82)', async () => {
    await store().completeFromPlacement(['u1-l1', 'nope']);
    expect(store().completedLessons.map((l) => [l.lessonId, l.source])).toEqual([
      ['u1-l1', 'placement'],
    ]);
  });

  it('loads a saved snapshot and accumulates activity', async () => {
    await store().addActiveSeconds('2026-10-15', 20);
    await store().addActiveSeconds('2026-10-15', 10);
    useProgressStore.setState({ loaded: false, activity: {} });
    await store().load();
    expect(store().loaded).toBe(true);
    expect(store().activity).toEqual({ '2026-10-15': 30 });
  });

  it('reset clears memory and storage', async () => {
    await store().recordAttempt(attempt('u1-l1-e1', 90));
    await store().reset();
    expect(store().attempts).toEqual([]);
    expect((await repo().load()).attempts).toEqual([]);
  });
});
