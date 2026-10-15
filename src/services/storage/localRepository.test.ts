import { beforeEach, describe, expect, it } from 'vitest';
import { attempt } from '../../test/courseFixture';
import { createLocalRepository, LOCAL_PROGRESS_KEY } from './localRepository';
import { DEFAULT_SETTINGS } from './types';

const now = () => new Date(Date.UTC(2026, 9, 15, 10));

beforeEach(() => localStorage.clear());

describe('LocalRepository', () => {
  it('loads an empty snapshot with default settings', async () => {
    const snap = await createLocalRepository().load();
    expect(snap).toEqual({
      completedLessons: [],
      attempts: [],
      activity: {},
      settings: DEFAULT_SETTINGS,
    });
  });

  it('persists attempts, lessons, activity and settings across instances', async () => {
    const repo = createLocalRepository({ now });
    const a = attempt('u1-l1-e1', 90);
    await repo.saveAttempt(a);
    await repo.completeLesson('u1-l1', 'placement');
    await repo.completeLesson('u1-l1', 'normal');
    await repo.addActiveSeconds('2026-10-15', 30);
    await repo.addActiveSeconds('2026-10-15', 15);
    await repo.saveSettings({ ...DEFAULT_SETTINGS, noteNames: 'letters' });

    const snap = await createLocalRepository().load();
    expect(snap.attempts).toEqual([a]);
    expect(snap.completedLessons).toEqual([
      { lessonId: 'u1-l1', source: 'placement', completedAt: now().toISOString() },
    ]);
    expect(snap.activity).toEqual({ '2026-10-15': 45 });
    expect(snap.settings.noteNames).toBe('letters');
  });

  it('exports all data with a version and timestamp', async () => {
    const repo = createLocalRepository({ now });
    await repo.saveAttempt(attempt('u1-l1-e1', 50));
    const bundle = await repo.exportAll();
    expect(bundle.version).toBe(1);
    expect(bundle.exportedAt).toBe(now().toISOString());
    expect(bundle.attempts).toHaveLength(1);
  });

  it('reset clears progress but keeps settings', async () => {
    const repo = createLocalRepository();
    await repo.saveAttempt(attempt('u1-l1-e1', 50));
    await repo.completeLesson('u1-l1', 'normal');
    await repo.saveSettings({ ...DEFAULT_SETTINGS, showKeyLabels: false });
    await repo.reset();
    const snap = await repo.load();
    expect(snap.attempts).toEqual([]);
    expect(snap.completedLessons).toEqual([]);
    expect(snap.settings.showKeyLabels).toBe(false);
  });

  it('survives corrupt data', async () => {
    localStorage.setItem(LOCAL_PROGRESS_KEY, '{not json');
    const snap = await createLocalRepository().load();
    expect(snap.attempts).toEqual([]);
  });
});
