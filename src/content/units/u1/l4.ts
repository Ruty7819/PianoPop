import type { Lesson } from '../..';
import { ALL_SEVEN, seq } from './notes';

export const lesson: Lesson = {
  id: 'u1-l4',
  title: 'פה, סול, לה, סי',
  steps: [
    {
      kind: 'explanation',
      text: 'עכשיו חפשו קבוצה של 3 קלידים שחורים. פה נמצא משמאל לה, ואחריו סול, לה וסי. אחרי סי מגיע שוב דו – שבעת השמות חוזרים לאורך כל הפסנתר.',
    },
    { kind: 'demo', text: 'פה, סול, לה, סי.', notes: seq('F4 G4 A4 B4') },
    { kind: 'demo', text: 'וכל השבעה, מדו עד דו.', notes: seq('C4 D4 E4 F4 G4 A4 B4 C5') },
    {
      kind: 'exercise',
      exercise: {
        id: 'u1-l4-e1',
        type: 'press-key',
        skill: 'keyboard',
        questions: seq('F4 A4 G4 B4 F4 B4 G4 A4 F4 B4'),
      },
    },
    {
      kind: 'exercise',
      exercise: { id: 'u1-l4-e2', type: 'press-key', skill: 'keyboard', questions: seq(ALL_SEVEN) },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'u1-l4-e3',
        type: 'play-sequence',
        skill: 'playing',
        show: 'names',
        notes: seq('C4 D4 E4 F4 G4 A4 B4 C5'),
      },
    },
  ],
};
