import type { Lesson } from '../..';
import { pairs, seq, WIDE_PAIRS } from './notes';

export const lesson: Lesson = {
  id: 'u1-l1',
  title: 'המקלדת: לבנים ושחורים',
  steps: [
    {
      kind: 'explanation',
      text: 'בפסנתר יש קלידים לבנים וקלידים שחורים. הקלידים השחורים מסודרים בקבוצות של 2 ושל 3. ככל שהולכים שמאלה – הצליל נמוך יותר, וככל שהולכים ימינה – הצליל גבוה יותר.',
    },
    { kind: 'demo', text: 'הקשיבו: מהנמוך אל הגבוה.', notes: seq('C3 C4 C5 C6') },
    {
      kind: 'exercise',
      exercise: { id: 'u1-l1-e1', type: 'higher-lower', skill: 'ear', pairs: pairs(WIDE_PAIRS) },
    },
  ],
};
