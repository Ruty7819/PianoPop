import type { ExerciseDef, Unit } from '../..';
import { lesson as l1 } from './l1';
import { lesson as l2 } from './l2';
import { lesson as l3 } from './l3';
import { lesson as l4 } from './l4';
import { lesson as l5 } from './l5';
import { lesson as l6 } from './l6';
import { ALL_SEVEN, CLOSE_PAIRS, MARY_PHRASE, WIDE_PAIRS, pairs, seq } from './notes';

const first5 = <T>(items: T[]): T[] => items.slice(0, 5);

// D-61: assessment only.
const summaryTest: ExerciseDef[] = [
  {
    id: 'u1-s1',
    type: 'press-key',
    skill: 'keyboard',
    questions: seq('E4 B4 D4 G4 C4 A4 F4 D4 G4 B4'),
  },
  {
    id: 'u1-s2',
    type: 'higher-lower',
    skill: 'ear',
    pairs: pairs('F4/E4 C5/B4 D4/E4 A4/G4 E4/D4 G4/F4 B4/C5 C4/D4 F4/G4 A4/B4'),
  },
  // "Mary Had a Little Lamb" — traditional, public domain.
  { id: 'u1-s3', type: 'play-sequence', skill: 'playing', show: 'names', notes: seq(MARY_PHRASE) },
  { id: 'u1-s4', type: 'tap-rhythm', skill: 'rhythm', bpm: 90, pattern: [0, 2, 3, 4, 6, 8, 9, 10] },
];

export const u1: Unit = {
  id: 'u1',
  title: 'מכירים את הפסנתר',
  lessons: [l1, l2, l3, l4, l5, l6],
  summaryTest,
  // D-82: 5 questions each, increasing difficulty.
  placement: [
    {
      completes: ['u1-l1'],
      exercise: {
        id: 'u1-p1',
        type: 'higher-lower',
        skill: 'ear',
        pairs: first5(pairs(WIDE_PAIRS)),
      },
    },
    {
      completes: ['u1-l2'],
      exercise: {
        id: 'u1-p2',
        type: 'press-key',
        skill: 'keyboard',
        questions: seq('C4 C5 C4 C3 C4'),
      },
    },
    {
      completes: ['u1-l3'],
      exercise: {
        id: 'u1-p3',
        type: 'press-key',
        skill: 'keyboard',
        questions: seq('D4 E4 C4 E4 D4'),
      },
    },
    {
      completes: ['u1-l4'],
      exercise: {
        id: 'u1-p4',
        type: 'press-key',
        skill: 'keyboard',
        questions: first5(seq(ALL_SEVEN)),
      },
    },
    {
      completes: ['u1-l5'],
      exercise: {
        id: 'u1-p5',
        type: 'higher-lower',
        skill: 'ear',
        pairs: first5(pairs(CLOSE_PAIRS)),
      },
    },
    {
      completes: ['u1-l6'],
      exercise: {
        id: 'u1-p6',
        type: 'tap-rhythm',
        skill: 'rhythm',
        bpm: 80,
        pattern: [0, 1, 2, 3, 4, 5, 6, 7],
      },
    },
  ],
};
