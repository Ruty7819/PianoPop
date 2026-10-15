import { useEffect, useMemo } from 'react';
import { getDeps, useProgressStore } from '../../state';

/** Progress for screens; loads it from the repository on first use (architecture §7). */
export function useProgress() {
  const loaded = useProgressStore((s) => s.loaded);
  const load = useProgressStore((s) => s.load);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const attempts = useProgressStore((s) => s.attempts);
  const recordAttempt = useProgressStore((s) => s.recordAttempt);
  useEffect(() => {
    if (!loaded) void load();
  }, [loaded, load]);
  const completed = useMemo(
    () => new Set(completedLessons.map((l) => l.lessonId)),
    [completedLessons],
  );
  return { loaded, completed, attempts, recordAttempt, course: getDeps().course };
}
