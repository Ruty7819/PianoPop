import { useMemo } from 'react';
import type { ReadNoteDef } from '../../content';
import {
  noteLabel,
  readNoteAnswer,
  readNoteStart,
  readNoteDone,
  pianoStartFor,
  readNoteScore,
  type AttemptResult,
  type Midi,
  type QuestionSetState,
  type NoteNaming,
} from '../../engine';
import { he } from '../../i18n/he';
import type { PianoInput } from '../../services/input';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { staffHint } from '../components/HintMenu';
import { Piano, type KeyHighlight, type PianoAudio } from '../components/Piano';
import { Staff, type StaffNote } from '../components/Staff';
import { useDemoPlayback, type DemoAudio } from '../hooks/useDemoPlayback';
import { useDeviceOctaves } from '../hooks/useDeviceOctaves';
import { ExerciseProgress } from './ExerciseProgress';
import { ExerciseSummary } from './ExerciseSummary';
import { HintBar } from './HintBar';
import { usePianoAnswers } from './usePianoAnswers';

interface Props {
  def: ReadNoteDef;
  input: PianoInput;
  audio: PianoAudio & DemoAudio;
  onDone?: (result: AttemptResult) => void;
  naming?: NoteNaming;
  octaves?: number;
}

/** "Read the note on the staff and play it" (requirements §6); rules in engine/readNote. */
export function ReadNote({ def, input, audio, onDone, naming = 'solfege', octaves }: Props) {
  const rules = useMemo(
    () => ({
      start: readNoteStart,
      done: (s: QuestionSetState) => readNoteDone(s, def.questions),
      answer: (s: QuestionSetState, m: Midi) => readNoteAnswer(s, def.questions, m),
      score: readNoteScore,
    }),
    [def.questions],
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
  const startMidi = useMemo(() => pianoStartFor(def.questions, oct), [def.questions, oct]);

  // A correct press advances at once; keep the answered note on screen while it flashes.
  const answered = flash?.correct ? def.questions[state.index - 1] : undefined;
  const current = def.questions[state.index];
  const shown = answered ?? current;

  // Name appears only after an answer; a miss also marks the right key (approved 14.10.2026).
  const staffNote: StaffNote | undefined =
    shown === undefined
      ? undefined
      : answered !== undefined
        ? { midi: shown, tone: 'correct', label: noteLabel(shown, { naming }) }
        : state.missed
          ? { midi: shown, tone: 'target', label: noteLabel(shown, { naming }) }
          : { midi: shown };

  const highlights: Partial<Record<Midi, KeyHighlight>> = {};
  if (demoMidi !== null) highlights[demoMidi] = 'demo';
  if (state.missed && shown !== undefined) highlights[shown] = 'target';
  if (flash) highlights[flash.midi] = flash.correct ? 'correct' : 'wrong';

  return (
    <section className="flex flex-col gap-4">
      {result ? (
        <ExerciseSummary result={result} onRetry={restart} />
      ) : (
        <>
          <ExerciseProgress index={state.index} total={def.questions.length} />
          <h2 className="text-center text-2xl font-bold">{he.readNote.prompt}</h2>
          {staffNote && <Staff notes={[staffNote]} clef={def.clef} />}
          <FeedbackBanner tone={flash ? (flash.correct ? 'correct' : 'wrong') : 'neutral'}>
            {flash ? (flash.correct ? he.exercise.correct : he.exercise.wrong) : ' '}
          </FeedbackBanner>
          {current !== undefined && (
            <HintBar
              skill={def.skill}
              short={staffHint(current, def.clef)}
              explanation={he.hints.explain['read-note']}
              onHint={takeHint}
              onDemo={() => {
                reveal();
                play([current]);
              }}
            />
          )}
        </>
      )}
      <Piano
        input={input}
        audio={audio}
        highlights={highlights}
        key={startMidi}
        octaves={oct}
        startMidi={startMidi}
      />
    </section>
  );
}
