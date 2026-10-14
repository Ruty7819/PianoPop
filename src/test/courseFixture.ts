import type { Course, ExerciseDef, Lesson, Skill, Unit } from '../content/types';
import type { AttemptResult } from '../engine/scoring';

export function pressKey(id: string, skill: Skill = 'keyboard'): ExerciseDef {
  return { id, type: 'press-key', skill, questions: [60, 62] };
}

function lesson(id: string, skills: Skill[]): Lesson {
  return {
    id,
    title: id,
    steps: [
      { kind: 'explanation', text: 'הסבר' },
      ...skills.map((s, i) => ({
        kind: i === skills.length - 1 ? ('summary-exercise' as const) : ('exercise' as const),
        exercise: pressKey(`${id}-e${i + 1}`, s),
      })),
    ],
  };
}

/** u1 with 3 lessons, a summary test and placement. */
export const fixtureU1: Unit = {
  id: 'u1',
  title: 'יחידה 1',
  lessons: [
    lesson('u1-l1', ['keyboard', 'keyboard']),
    lesson('u1-l2', ['reading', 'ear']),
    lesson('u1-l3', ['rhythm']),
  ],
  summaryTest: [pressKey('u1-s1')],
  placement: [
    { exercise: pressKey('u1-p1'), completes: ['u1-l1'] },
    { exercise: pressKey('u1-p2'), completes: ['u1-l2'] },
    { exercise: pressKey('u1-p3'), completes: ['u1-l3'] },
  ],
};

/** Two units: u1 above, u2 with 1 lesson. */
export const fixtureCourse: Course = [
  fixtureU1,
  {
    id: 'u2',
    title: 'יחידה 2',
    lessons: [lesson('u2-l1', ['playing'])],
    summaryTest: [],
    placement: [],
  },
];

let clock = 0;
/** Attempt with increasing timestamps in call order. */
export function attempt(exerciseId: string, score: number, passed = score >= 80): AttemptResult {
  clock += 1;
  const t = new Date(Date.UTC(2026, 0, 1, 0, 0, clock)).toISOString();
  return {
    exerciseId,
    rawScore: score,
    score,
    passed,
    hintsUsed: 0,
    details: null,
    startedAt: t,
    finishedAt: t,
  };
}
