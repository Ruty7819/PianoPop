import type { PressKeyDef } from '../../content';
import {
  noteLabel,
  pressKeyAnswer,
  pressKeyScore,
  type AttemptResult,
  type Midi,
  type NoteNaming,
} from '../../engine';
import { he } from '../../i18n/he';
import type { PianoInput } from '../../services/input';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { Piano, type KeyHighlight, type PianoAudio } from '../components/Piano';
import { ExerciseProgress } from './ExerciseProgress';
import { ExerciseSummary } from './ExerciseSummary';
import { useQuestionSet } from './useQuestionSet';

const RULES = { answer: pressKeyAnswer, score: pressKeyScore };

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
  const { state, flash, result, restart } = useQuestionSet(
    def.id,
    def.questions,
    input,
    RULES,
    onDone,
  );
  const target = def.questions[state.index];
  const highlights: Partial<Record<Midi, KeyHighlight>> = flash
    ? { [flash.midi]: flash.correct ? 'correct' : 'wrong' }
    : {};

  return (
    <section className="flex flex-col gap-4">
      {result ? (
        <ExerciseSummary result={result} onRetry={restart} />
      ) : (
        <>
          <ExerciseProgress index={state.index} total={def.questions.length} />
          <h2 className="text-center text-4xl font-bold">
            {target !== undefined && he.pressKey.prompt(noteLabel(target, { naming }))}
          </h2>
          <FeedbackBanner tone={flash ? (flash.correct ? 'correct' : 'wrong') : 'neutral'}>
            {flash ? (flash.correct ? he.exercise.correct : he.exercise.wrong) : ' '}
          </FeedbackBanner>
        </>
      )}
      <Piano input={input} audio={audio} highlights={highlights} {...piano} />
    </section>
  );
}
