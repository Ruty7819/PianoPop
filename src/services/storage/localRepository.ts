import type { AttemptResult, CompletionSource } from '../../engine';
import {
  DEFAULT_SETTINGS,
  type ExportBundle,
  type ProgressRepository,
  type ProgressSnapshot,
  type Settings,
} from './types';

export const LOCAL_PROGRESS_KEY = 'pianopop-progress';

export interface LocalRepositoryOptions {
  storage?: Storage;
  key?: string;
  now?: () => Date;
}

function emptySnapshot(settings: Settings = DEFAULT_SETTINGS): ProgressSnapshot {
  return { completedLessons: [], attempts: [], activity: {}, settings: { ...settings } };
}

/** Guest persistence in localStorage; same data shape as the server (requirements §10). */
export function createLocalRepository(opts: LocalRepositoryOptions = {}): ProgressRepository {
  const storage = opts.storage ?? localStorage;
  const key = opts.key ?? LOCAL_PROGRESS_KEY;
  const now = opts.now ?? (() => new Date());

  function read(): ProgressSnapshot {
    const raw = storage.getItem(key);
    if (!raw) return emptySnapshot();
    try {
      const data = JSON.parse(raw) as Partial<ProgressSnapshot>;
      return {
        completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
        attempts: Array.isArray(data.attempts) ? data.attempts : [],
        activity: data.activity && typeof data.activity === 'object' ? data.activity : {},
        settings: { ...DEFAULT_SETTINGS, ...data.settings },
      };
    } catch {
      return emptySnapshot();
    }
  }

  function update(fn: (s: ProgressSnapshot) => void): Promise<void> {
    const snap = read();
    fn(snap);
    storage.setItem(key, JSON.stringify(snap));
    return Promise.resolve();
  }

  return {
    load: () => Promise.resolve(read()),
    saveAttempt: (a: AttemptResult) => update((s) => void s.attempts.push(a)),
    completeLesson: (id: string, source: CompletionSource) =>
      update((s) => {
        if (s.completedLessons.some((l) => l.lessonId === id)) return;
        s.completedLessons.push({ lessonId: id, source, completedAt: now().toISOString() });
      }),
    addActiveSeconds: (day: string, sec: number) =>
      update((s) => {
        s.activity[day] = (s.activity[day] ?? 0) + sec;
      }),
    saveSettings: (settings: Settings) => update((s) => void (s.settings = { ...settings })),
    exportAll: (): Promise<ExportBundle> =>
      Promise.resolve({ version: 1, exportedAt: now().toISOString(), ...read() }),
    reset: () =>
      update((s) => {
        Object.assign(s, emptySnapshot(s.settings));
      }),
  };
}
