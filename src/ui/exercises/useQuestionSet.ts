import { useEffect, useMemo, useRef, useState } from 'react';
import {
  questionSetDone,
  questionSetStart,
  type AttemptResult,
  type Midi,
  type QuestionSetState,
  type ScoreResult,
} from '../../engine';
import type { PianoInput } from '../../services/input';

const FLASH_MS = 700;

export interface QuestionSetRules {
  answer: (
    state: QuestionSetState,
    questions: readonly Midi[],
    pressed: Midi,
  ) => { state: QuestionSetState; correct: boolean };
  score: (state: QuestionSetState, hintsUsed: number) => ScoreResult;
}

/** Wires piano presses to a single-key question set; rules come from the engine. */
export function useQuestionSet(
  exerciseId: string,
  questions: readonly Midi[],
  input: PianoInput,
  rules: QuestionSetRules,
  onDone?: (result: AttemptResult) => void,
) {
  const [state, setState] = useState(questionSetStart);
  const [flash, setFlash] = useState<{ midi: Midi; correct: boolean } | null>(null);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const stateRef = useRef(state);
  const done = questionSetDone(state, questions);
  const { answer, score } = rules;

  useEffect(
    () =>
      input.subscribe(({ midi, on }) => {
        if (!on) return;
        const r = answer(stateRef.current, questions, midi);
        if (r.state === stateRef.current) return;
        stateRef.current = r.state;
        setState(r.state);
        setFlash({ midi, correct: r.correct });
      }),
    [input, questions, answer],
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
            ...score(state, 0),
            details: { firstTry: state.results },
            startedAt,
            finishedAt: new Date().toISOString(),
          }
        : null,
    [done, exerciseId, state, startedAt, score],
  );

  useEffect(() => {
    if (result) onDone?.(result);
  }, [result, onDone]);

  const restart = () => {
    stateRef.current = questionSetStart();
    setState(stateRef.current);
    setFlash(null);
    setStartedAt(new Date().toISOString());
  };

  return { state, flash, result, restart };
}
