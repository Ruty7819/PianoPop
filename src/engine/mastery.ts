import type { Course, Skill } from '../content/types';
import { allExercises } from '../content/lookup';
import type { AttemptResult } from './scoring';

export const SKILLS: readonly Skill[] = ['keyboard', 'reading', 'ear', 'rhythm', 'playing'];
/** Attempts that count toward a skill's mastery (D-59). */
export const MASTERY_WINDOW = 3;

export type MasteryLevel = 'beginner' | 'advancing' | 'good';

/** Mean of the last 3 attempt scores in the skill; null if never attempted (D-59). */
export function skillMastery(
  course: Course,
  attempts: readonly AttemptResult[],
  skill: Skill,
): number | null {
  const skillOf = new Map(allExercises(course).map((e) => [e.id, e.skill]));
  const recent = attempts
    .filter((a) => skillOf.get(a.exerciseId) === skill)
    .sort((a, b) => a.finishedAt.localeCompare(b.finishedAt))
    .slice(-MASTERY_WINDOW);
  if (recent.length === 0) return null;
  return recent.reduce((s, a) => s + a.score, 0) / recent.length;
}

export function allMastery(
  course: Course,
  attempts: readonly AttemptResult[],
): Record<Skill, number | null> {
  return Object.fromEntries(SKILLS.map((s) => [s, skillMastery(course, attempts, s)])) as Record<
    Skill,
    number | null
  >;
}

/** 0–59 beginner, 60–84 advancing, 85–100 good (D-81). */
export function masteryLevel(percent: number): MasteryLevel {
  if (percent >= 85) return 'good';
  if (percent >= 60) return 'advancing';
  return 'beginner';
}
