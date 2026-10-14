import type { Course, Skill } from '../content/types';
import { allMastery } from './mastery';
import { latestAttempts, nextLesson, practiceExercises } from './progress';
import type { AttemptResult } from './scoring';

export type Recommendation =
  { kind: 'lesson'; lessonId: string } | { kind: 'exercise'; exerciseId: string; skill: Skill };

/**
 * Next incomplete lesson; if all are done, the learned exercise with the lowest
 * latest score in the weakest skill (D-75). A suggestion only (D-31).
 */
export function recommend(
  course: Course,
  completed: ReadonlySet<string>,
  attempts: readonly AttemptResult[],
): Recommendation | null {
  const lesson = nextLesson(course, completed);
  if (lesson) return { kind: 'lesson', lessonId: lesson.id };

  const learned = practiceExercises(course, completed);
  if (learned.length === 0) return null;
  const mastery = allMastery(course, attempts);
  const skills = [...new Set(learned.map((e) => e.skill))];
  const weakest = skills.reduce((w, s) => ((mastery[s] ?? 0) < (mastery[w] ?? 0) ? s : w));

  const latest = latestAttempts(attempts);
  const scoreOf = (id: string) => latest.get(id)?.score ?? -1;
  const pick = learned
    .filter((e) => e.skill === weakest)
    .reduce((best, e) => (scoreOf(e.id) < scoreOf(best.id) ? e : best));
  return { kind: 'exercise', exerciseId: pick.id, skill: weakest };
}
