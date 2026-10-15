import type { Lesson } from '../..';
import { seq } from './notes';

export const lesson: Lesson = {
  id: 'u1-l6',
  title: 'דופק ומנגינה ראשונה',
  steps: [
    {
      kind: 'explanation',
      text: 'במוזיקה יש דופק קבוע, כמו לב שפועם. הקשיבו לקליק והקישו יחד איתו.',
    },
    { kind: 'demo', text: 'ארבע פעימות שוות.', notes: seq('C4 C4 C4 C4') },
    {
      kind: 'exercise',
      exercise: {
        id: 'u1-l6-e1',
        type: 'tap-rhythm',
        skill: 'rhythm',
        bpm: 80,
        pattern: [0, 1, 2, 3, 4, 5, 6, 7],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'u1-l6-e2',
        type: 'tap-rhythm',
        skill: 'rhythm',
        bpm: 90,
        pattern: [0, 1, 2, 4, 5, 6],
      },
    },
    {
      // "יונתן הקטן" — German folk melody "Hänschen klein", public domain.
      kind: 'summary-exercise',
      exercise: {
        id: 'u1-l6-e3',
        type: 'play-sequence',
        skill: 'playing',
        show: 'names',
        notes: seq('G4 E4 E4 F4 D4 D4 C4 D4 E4 F4 G4 G4 G4'),
      },
    },
  ],
};
