import { useEffect, useMemo, useRef, useState } from 'react';
import {
  questionSetReveal,
  type AttemptResult,
  type Midi,
  type QuestionSetState,
  type ScoreResult,
} from '../../engine';
import type { Skill } from '../../content';
import type { PianoInput } from '../../services/input';
import { useHints } from '../hooks/useHints';

const FLASH_MS = 700;

/** Engine rules bound to one exercise; must be stable (useMemo / module constant). */
export interface PianoAnswerRules<S extends QuestionSetState> {
  start: () => S;
  done: (state: S) => boolean;
  answer: (state: S, pressed: Midi) => { state: S; correct: boolean };
  score: (state: S, hintsUsed: number) => ScoreResult;
}

/** Wires piano presses to an exercise's engine rules; holds only transient UI state. */
export function usePianoAnswers<S extends QuestionSetState>(
  exercise: { id: string; skill: Skill },
  input: PianoInput,
  rules: PianoAnswerRules<S>,
  onDone?: (result: AttemptResult) => void,
) {
  const [state, setState] = useState(rules.start);
  const [flash, setFlash] = useState<{ midi: Midi; correct: boolean } | null>(null);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const stateRef = useRef(state);
  const hints = useHints(exercise.skill);
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
            exerciseId: exercise.id,
            hintsUsed: hints.hintsUsed,
            ...rules.score(state, hints.hintsUsed),
            details: { firstTry: state.results },
            startedAt,
            finishedAt: new Date().toISOString(),
          }
        : null,
    [done, exercise.id, state, startedAt, rules, hints.hintsUsed],
  );

  useEffect(() => {
    if (result) onDone?.(result);
  }, [result, onDone]);

  const restart = () => {
    stateRef.current = rules.start();
    setState(stateRef.current);
    setFlash(null);
    hints.reset();
    setStartedAt(new Date().toISOString());
  };

  /** Free demo of the current answer: an unanswered question is scored wrong (approved 14.10.2026). */
  const reveal = () => {
    stateRef.current = questionSetReveal(stateRef.current);
    setState(stateRef.current);
  };

  return { state, flash, result, restart, reveal, takeHint: hints.use };
}
