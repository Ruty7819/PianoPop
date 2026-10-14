import { useMemo } from 'react';
import type { PlaySequenceDef } from '../../content';
import {
  pianoStartFor,
  playSequenceAnswer,
  playSequenceDone,
  playSequenceScore,
  playSequenceStart,
  type AttemptResult,
  type Midi,
  type NoteNaming,
  type PlaySequenceState,
} from '../../engine';
import { he } from '../../i18n/he';
import type { AudioService } from '../../services/audio';
import type { PianoInput } from '../../services/input';
import { Button } from '../components/Button';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { Piano, type KeyHighlight, type PianoAudio } from '../components/Piano';
import { Staff } from '../components/Staff';
import { useDeviceOctaves } from '../hooks/useDeviceOctaves';
import { ExerciseSummary } from './ExerciseSummary';
import { SequenceNames } from './SequenceNames';
import { usePianoAnswers } from './usePianoAnswers';

const STEP_S = 0.6;

interface Props {
  def: PlaySequenceDef;
  input: PianoInput;
  audio: PianoAudio & Pick<AudioService, 'playSequence' | 'now'>;
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
  const { state, flash, result, restart } = usePianoAnswers(def.id, input, rules, onDone);
  const deviceOctaves = useDeviceOctaves();
  const oct = octaves ?? deviceOctaves;
  const startMidi = useMemo(() => pianoStartFor(def.notes, oct), [def.notes, oct]);

  const listen = () =>
    audio.playSequence(
      def.notes.map((midi, i) => ({ midi, at: i * STEP_S, dur: STEP_S * 0.9 })),
      audio.now() + 0.05,
    );

  const highlights: Partial<Record<Midi, KeyHighlight>> = flash
    ? { [flash.midi]: flash.correct ? 'correct' : 'wrong' }
    : {};

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
          {/* Free replay outside ear exercises (D-23). */}
          {def.skill !== 'ear' && (
            <Button variant="pill" className="self-center" onClick={listen}>
              {he.playSequence.listen}
            </Button>
          )}
          <FeedbackBanner tone={flash ? (flash.correct ? 'correct' : 'wrong') : 'neutral'}>
            {flash ? (flash.correct ? he.exercise.correct : he.exercise.wrong) : ' '}
          </FeedbackBanner>
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
