import { useMemo } from 'react';
import type { PlaySequenceDef } from '../../content';
import {
  pianoStartFor,
  playSequenceAnswer,
  playSequenceDone,
  playSequenceScore,
  playSequenceStart,
  type AttemptResult,
  type HintType,
  type Midi,
  type NoteNaming,
  type PlaySequenceState,
} from '../../engine';
import { he } from '../../i18n/he';
import type { PianoInput } from '../../services/input';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { keyHint, staffHint } from '../components/HintMenu';
import { Piano, type KeyHighlight, type PianoAudio } from '../components/Piano';
import { Staff } from '../components/Staff';
import { useDemoPlayback, type DemoAudio } from '../hooks/useDemoPlayback';
import { useDeviceOctaves } from '../hooks/useDeviceOctaves';
import { ExerciseSummary } from './ExerciseSummary';
import { HintBar } from './HintBar';
import { SequenceNames } from './SequenceNames';
import { usePianoAnswers } from './usePianoAnswers';

interface Props {
  def: PlaySequenceDef;
  input: PianoInput;
  audio: PianoAudio & DemoAudio;
  onDone?: (result: AttemptResult) => void;
  naming?: NoteNaming;
  octaves?: number;
}

/** "Play the shown sequence" (requirements §6); rules in engine/playSequence. */
export function PlaySequence({ def, input, audio, onDone, naming = 'solfege', octaves }: Props) {
  const rules = useMemo(
    () => ({
      start: playSequenceStart,
      done: (s: PlaySequenceState) => playSequenceDone(s, def.notes),
      answer: (s: PlaySequenceState, m: Midi) => playSequenceAnswer(s, def.notes, m, def.show),
      score: playSequenceScore,
    }),
    [def.notes, def.show],
  );
  const { state, flash, result, restart, reveal, takeHint } = usePianoAnswers(
    def,
    input,
    rules,
    onDone,
  );
  const { demoMidi, play } = useDemoPlayback(audio);
  const deviceOctaves = useDeviceOctaves();
  const oct = octaves ?? deviceOctaves;
  const startMidi = useMemo(() => pianoStartFor(def.notes, oct), [def.notes, oct]);

  const current = def.notes[state.index];
  const highlights: Partial<Record<Midi, KeyHighlight>> = {};
  if (demoMidi !== null) highlights[demoMidi] = 'demo';
  if (flash) highlights[flash.midi] = flash.correct ? 'correct' : 'wrong';

  // Ear: replay only from the menu, counted as a hint; else a free demo of the answer (D-23).
  const onHint = (type: HintType) => {
    takeHint(type);
    if (type === 'replay-demo') play(def.notes);
  };
  const demo = () => {
    reveal();
    play(def.notes);
  };

  return (
    <section className="flex flex-col gap-4">
      {result ? (
        <ExerciseSummary result={result} onRetry={restart} />
      ) : (
        <>
          <h2 className="text-center text-2xl font-bold">{he.playSequence.prompt}</h2>
          {def.show === 'staff' ? (
            <Staff
              notes={def.notes.map((midi, i) => ({
                midi,
                tone: i < state.index ? 'correct' : i === state.index ? 'target' : undefined,
              }))}
            />
          ) : (
            <SequenceNames notes={def.notes} index={state.index} naming={naming} />
          )}
          <FeedbackBanner tone={flash ? (flash.correct ? 'correct' : 'wrong') : 'neutral'}>
            {flash ? (flash.correct ? he.exercise.correct : he.exercise.wrong) : ' '}
          </FeedbackBanner>
          {current !== undefined && (
            <HintBar
              skill={def.skill}
              short={def.show === 'staff' ? staffHint(current) : keyHint(current, naming)}
              explanation={he.hints.explain['play-sequence']}
              onHint={onHint}
              onDemo={demo}
            />
          )}
        </>
      )}
      <Piano
        key={startMidi}
        input={input}
        audio={audio}
        highlights={highlights}
        octaves={oct}
        startMidi={startMidi}
      />
    </section>
  );
}
