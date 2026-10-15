import type { Lesson } from '../..';
import { MARY_SHORT, seq } from './notes';

export const lesson: Lesson = {
  id: 'u1-l3',
  title: 'דו, רה, מי',
  steps: [
    {
      kind: 'explanation',
      text: 'רה נמצא בין שני הקלידים השחורים. מי נמצא מימין להם. דו, רה, מי – שלושה קלידים לבנים צמודים.',
    },
    { kind: 'demo', text: 'דו, רה, מי.', notes: seq('C4 D4 E4') },
    {
      kind: 'exercise',
      exercise: {
        id: 'u1-l3-e1',
        type: 'press-key',
        skill: 'keyboard',
        questions: seq('C4 E4 D4 C4 D4 E4 E4 C4 D4 E4'),
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'u1-l3-e2',
        type: 'play-sequence',
        skill: 'playing',
        show: 'names',
        notes: seq('C4 D4 E4 D4 C4'),
      },
    },
    {
      // "Mary Had a Little Lamb" — traditional, public domain.
      kind: 'exercise',
      exercise: {
        id: 'u1-l3-e3',
        type: 'play-sequence',
        skill: 'playing',
        show: 'names',
        notes: seq(MARY_SHORT),
      },
    },
  ],
};
