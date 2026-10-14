import { useEffect, useMemo, useRef, useState } from 'react';
import type { PressKeyDef } from '../../content';
import {
  noteLabel,
  pressKeyAnswer,
  pressKeyDone,
  pressKeyScore,
  pressKeyStart,
  type AttemptResult,
  type Midi,
  type NoteNaming,
} from '../../engine';
import { he } from '../../i18n/he';
import type { PianoInput } from '../../services/input';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { Piano, type KeyHighlight, type PianoAudio } from '../components/Piano';
import { PressKeySummary } from './PressKeySummary';

const FLASH_MS = 700;

interface Props {
  def: PressKeyDef;
  input: PianoInput;
  audio: PianoAudio;
  onDone?: (result: AttemptResult) => void;
  naming?: NoteNaming;
  octaves?: number;
  startMidi?: Midi;
}

/** "Press the named key" (requirements §6); rules live in engine/pressKey. */
export function PressKey({ def, input, audio, onDone, naming = 'solfege', ...piano }: Props) {
  const [state, setState] = useState(pressKeyStart);
  const [flash, setFlash] = useState<{ midi: Midi; correct: boolean } | null>(null);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const stateRef = useRef(state);
  const done = pressKeyDone(state, def.questions);

  useEffect(
    () =>
      input.subscribe(({ midi, on }) => {
        if (!on) return;
        const r = pressKeyAnswer(stateRef.current, def.questions, midi);
        if (r.state === stateRef.current) return;
        stateRef.current = r.state;
        setState(r.state);
        setFlash({ midi, correct: r.correct });
      }),
    [input, def.questions],
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
            exerciseId: def.id,
            hintsUsed: 0,
            ...pressKeyScore(state, 0),
            details: { firstTry: state.results },
            startedAt,
            finishedAt: new Date().toISOString(),
          }
        : null,
    [done, def.id, state, startedAt],
  );

  useEffect(() => {
    if (result) onDone?.(result);
  }, [result, onDone]);

  const restart = () => {
    stateRef.current = pressKeyStart();
    setState(stateRef.current);
    setFlash(null);
    setStartedAt(new Date().toISOString());
  };

  const target = def.questions[state.index];
  const highlights: Partial<Record<Midi, KeyHighlight>> = flash
    ? { [flash.midi]: flash.correct ? 'correct' : 'wrong' }
    : {};

  return (
    <section className="flex flex-col gap-4">
      {result ? (
        <PressKeySummary result={result} onRetry={restart} />
      ) : (
        <>
          <p className="text-slate-600">
            {he.pressKey.progress(state.index + 1, def.questions.length)}
          </p>
          <h2 className="text-3xl font-bold">
            {target !== undefined && he.pressKey.prompt(noteLabel(target, { naming }))}
          </h2>
          <FeedbackBanner tone={flash ? (flash.correct ? 'correct' : 'wrong') : 'neutral'}>
            {flash ? (flash.correct ? he.pressKey.correct : he.pressKey.wrong) : ' '}
          </FeedbackBanner>
        </>
      )}
      <Piano input={input} audio={audio} highlights={highlights} {...piano} />
    </section>
  );
}
