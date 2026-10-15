import { create } from 'zustand';
import { getLesson, lessonOfExercise } from '../content';
import { isLessonComplete, type AttemptResult, type CompletionSource } from '../engine';
import type { StoredLesson } from '../services/storage';
import { getDeps } from './deps';
import { useSettingsStore } from './settingsStore';

export interface ProgressState {
  loaded: boolean;
  completedLessons: StoredLesson[];
  attempts: AttemptResult[];
  activity: Record<string, number>;
  /** Load once per session from the repository (architecture §7). */
  load: () => Promise<void>;
  /** Saves the attempt; returns the lesson id if this attempt completed it (D-58). */
  recordAttempt: (a: AttemptResult) => Promise<string | null>;
  /** Mark lessons completed by a passed placement item (D-82). */
  completeFromPlacement: (lessonIds: readonly string[]) => Promise<void>;
  addActiveSeconds: (day: string, s: number) => Promise<void>;
  reset: () => Promise<void>;
}

const empty = { completedLessons: [], attempts: [], activity: {} };

/** Set of completed lesson ids, as the engine functions expect. */
export function completedIds(s: Pick<ProgressState, 'completedLessons'>): Set<string> {
  return new Set(s.completedLessons.map((l) => l.lessonId));
}

export const useProgressStore = create<ProgressState>()((set, get) => {
  async function complete(lessonId: string, source: CompletionSource): Promise<boolean> {
    if (completedIds(get()).has(lessonId)) return false;
    const entry = { lessonId, source, completedAt: new Date().toISOString() };
    set((s) => ({ completedLessons: [...s.completedLessons, entry] }));
    await getDeps().repository.completeLesson(lessonId, source);
    return true;
  }

  return {
    loaded: false,
    ...empty,
    load: async () => {
      const snap = await getDeps().repository.load();
      const { completedLessons, attempts, activity } = snap;
      set({ loaded: true, completedLessons, attempts, activity });
      useSettingsStore.getState().hydrate(snap.settings);
    },
    recordAttempt: async (a) => {
      set((s) => ({ attempts: [...s.attempts, a] }));
      await getDeps().repository.saveAttempt(a);
      const lesson = lessonOfExercise(getDeps().course, a.exerciseId);
      if (!lesson || !isLessonComplete(lesson, get().attempts)) return null;
      return (await complete(lesson.id, 'normal')) ? lesson.id : null;
    },
    completeFromPlacement: async (lessonIds) => {
      for (const id of lessonIds) {
        if (getLesson(getDeps().course, id)) await complete(id, 'placement');
      }
    },
    addActiveSeconds: async (day, sec) => {
      set((s) => ({ activity: { ...s.activity, [day]: (s.activity[day] ?? 0) + sec } }));
      await getDeps().repository.addActiveSeconds(day, sec);
    },
    reset: async () => {
      set(empty);
      await getDeps().repository.reset();
    },
  };
});
