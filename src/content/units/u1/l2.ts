import type { Lesson } from '../..';
import { seq } from './notes';

export const lesson: Lesson = {
  id: 'u1-l2',
  title: 'מוצאים את דו',
  steps: [
    {
      kind: 'explanation',
      text: 'חפשו קבוצה של 2 קלידים שחורים. הקליד הלבן שמשמאל לה הוא דו. בפסנתר יש הרבה דו – ודו האמצעי מסומן בנקודה.',
    },
    { kind: 'demo', text: 'כל אלה הם דו, מהנמוך אל הגבוה.', notes: seq('C3 C4 C5 C6') },
    {
      kind: 'exercise',
      exercise: {
        id: 'u1-l2-e1',
        type: 'press-key',
        skill: 'keyboard',
        questions: seq('C4 C4 C5 C4 C3 C4 C5 C4 C4 C5'),
      },
    },
  ],
};
