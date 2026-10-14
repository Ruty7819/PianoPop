import { useCallback, useState } from 'react';
import { countsAsHint, type HintType } from '../../engine';
import type { Skill } from '../../content';

/** Counts hints for one attempt (D-23, D-81); reset on retry. */
export function useHints(skill: Skill) {
  const [hintsUsed, setHintsUsed] = useState(0);
  const use = useCallback(
    (type: HintType) => {
      if (countsAsHint(type, skill)) setHintsUsed((n) => n + 1);
    },
    [skill],
  );
  const reset = useCallback(() => setHintsUsed(0), []);
  return { hintsUsed, use, reset };
}
