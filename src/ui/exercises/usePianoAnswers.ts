import { useEffect, useMemo, useRef, useState } from 'react';
import type { AttemptResult, Midi, ScoreResult } from '../../engine';
import type { PianoInput } from '../../services/input';

const FLASH_MS = 700;

interface AnswerState {
  index: number;
  results: boolean[];
}

/** Engine rules bound to one exercise; must be stable (useMemo / module constant). */
export interface PianoAnswerRules<S extends AnswerState> {
  start: () => S;
  done: (state: S) => boolean;
  answer: (state: S, pressed: Midi) => { state: S; correct: boolean };
  score: (state: S, hintsUsed: number) => ScoreResult;
}

/** Wires piano presses to an exercise's engine rules; holds only transient UI state. */
export function usePianoAnswers<S extends AnswerState>(
  exerciseId: string,
  input: PianoInput,
  rules: PianoAnswerRules<S>,
  onDone?: (result: AttemptResult) => void,
) {
  const [state, setState] = useState(rules.start);
  const [flash, setFlash] = useState<{ midi: Midi; correct: boolean } | null>(null);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const stateRef = useRef(state);
  const done = rules.done(state);

  useEffect(
    () =>
      input.subscribe(({ midi, on }) => {
        if (!on) return;
        const r = rules.answer(stateRef.current, midi);
        if (r.state === stateRef.current) return;
        stateRef.current = r.state;
        setState(r.state);
        setFlash({ midi, correct: r.correct });
      }),
    [input, rules],
  );

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), FLASH_MS);
    return () => clearTimeout(id);
  }, [flash]);

  const result = useMemo<AttemptResult | null>(
    () =>
      done
        ? {
            exerciseId,
            hintsUsed: 0,
            ...rules.score(state, 0),
            details: { firstTry: state.results },
            startedAt,
            finishedAt: new Date().toISOString(),
          }
        : null,
    [done, exerciseId, state, startedAt, rules],
  );

  useEffect(() => {
    if (result) onDone?.(result);
  }, [result, onDone]);

  const restart = () => {
    stateRef.current = rules.start();
    setState(stateRef.current);
    setFlash(null);
    setStartedAt(new Date().toISOString());
  };

  return { state, flash, result, restart };
}
