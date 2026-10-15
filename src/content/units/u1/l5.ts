import type { Lesson } from '../..';
import { CLOSE_PAIRS, pairs, seq } from './notes';

export const lesson: Lesson = {
  id: 'u1-l5',
  title: 'גבוה ונמוך',
  steps: [
    {
      kind: 'explanation',
      text: 'אותו שם חוזר שוב ושוב – וכל פעם שהוא מופיע ימינה יותר, הוא נשמע גבוה יותר. גם האוזניים יודעות להבדיל בין צליל גבוה לנמוך. בואו נתאמן!',
    },
    { kind: 'demo', text: 'דו, ואז דו גבוה יותר.', notes: seq('C4 C5') },
    { kind: 'demo', text: 'סול, ואז סול גבוה יותר.', notes: seq('G3 G4') },
    {
      kind: 'exercise',
      exercise: {
        id: 'u1-l5-e1',
        type: 'higher-lower',
        skill: 'ear',
        pairs: pairs('C4/G4 A4/E4 D4/F4 G4/C4 E4/C4 F4/A4 B4/G4 C5/F4 D4/A4 G4/E4'),
      },
    },
    {
      kind: 'exercise',
      exercise: { id: 'u1-l5-e2', type: 'higher-lower', skill: 'ear', pairs: pairs(CLOSE_PAIRS) },
    },
  ],
};
