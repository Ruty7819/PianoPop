import { useEffect, useMemo, useState } from 'react';
import type { HigherLowerDef } from '../../content';
import {
  higherLowerAnswer,
  higherLowerCorrect,
  higherLowerDone,
  higherLowerScore,
  higherLowerStart,
  type AttemptResult,
  type HigherLowerState,
  type HintType,
  type PairChoice,
} from '../../engine';
import { he } from '../../i18n/he';
import type { AudioService } from '../../services/audio';
import { Button } from '../components/Button';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { useHints } from '../hooks/useHints';
import { ExerciseProgress } from './ExerciseProgress';
import { HintBar } from './HintBar';
import { HL_TIMING } from './higherLowerTiming';
import { ExerciseSummary } from './ExerciseSummary';

interface Feedback {
  choice: PairChoice;
  correct: boolean;
  next: HigherLowerState;
}

interface Props {
  def: HigherLowerDef;
  audio: Pick<AudioService, 'playNote' | 'now'>;
  onDone?: (result: AttemptResult) => void;
}

/** "Which of two sounds is higher" (requirements §6); no piano, no free replay (D-23). */
export function HigherLower({ def, audio, onDone }: Props) {
  const [state, setState] = useState(higherLowerStart);
  const [listening, setListening] = useState(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [replays, setReplays] = useState(0);
  const hints = useHints(def.skill);
  const pair = def.pairs[state.index];
  const done = higherLowerDone(state, def.pairs);

  // Play the pair on each new question; the delay lets StrictMode's remount cancel it.
  useEffect(() => {
    if (!pair) return;
    const { lead, gap, note } = HL_TIMING;
    const play = setTimeout(() => {
      const t = audio.now() + 0.05;
      audio.playNote(pair[0], note / 1000, t);
      audio.playNote(pair[1], note / 1000, t + gap / 1000);
    }, lead);
    const ready = setTimeout(() => setListening(false), lead + gap + note);
    return () => {
      clearTimeout(play);
      clearTimeout(ready);
    };
  }, [pair, state.index, audio, startedAt, replays]);

  useEffect(() => {
    if (!feedback) return;
    const id = setTimeout(
      () => {
        setFeedback(null);
        setListening(true);
        setState(feedback.next);
      },
      feedback.correct ? HL_TIMING.correct : HL_TIMING.wrong,
    );
    return () => clearTimeout(id);
  }, [feedback]);

  const result = useMemo<AttemptResult | null>(
    () =>
      done
        ? {
            exerciseId: def.id,
            hintsUsed: hints.hintsUsed,
            ...higherLowerScore(state, hints.hintsUsed),
            details: { firstTry: state.results },
            startedAt,
            finishedAt: new Date().toISOString(),
          }
        : null,
    [done, def.id, state, startedAt, hints.hintsUsed],
  );

  useEffect(() => {
    if (result) onDone?.(result);
  }, [result, onDone]);

  if (result) {
    const retry = () => {
      setState(higherLowerStart());
      setListening(true);
      hints.reset();
      setStartedAt(new Date().toISOString());
    };
    return <ExerciseSummary result={result} onRetry={retry} />;
  }
  if (!pair) return null;

  const right = higherLowerCorrect(pair);
  // Ear exercise: the replay lives in the hint menu and counts (D-23).
  const onHint = (type: HintType) => {
    hints.use(type);
    if (type !== 'replay-demo') return;
    setListening(true);
    setReplays((n) => n + 1);
  };
  const choose = (choice: PairChoice) => {
    const r = higherLowerAnswer(state, def.pairs, choice);
    setFeedback({ choice, correct: r.correct, next: r.state });
  };
  const btnClass = (c: PairChoice) =>
    !feedback
      ? ''
      : c === right
        ? 'disabled:opacity-100 bg-correct! text-surface! border-correct!'
        : c === feedback.choice
          ? 'disabled:opacity-100 bg-wrong! text-surface! border-wrong!'
          : '';

  return (
    <section className="flex flex-col gap-6">
      <ExerciseProgress index={state.index} total={def.pairs.length} />
      <h2 className="text-center text-3xl font-bold">{he.higherLower.prompt}</h2>
      <div className="grid grid-cols-2 gap-3">
        {([0, 1] as const).map((c) => (
          <Button
            key={c}
            className={`min-h-20 text-2xl ${btnClass(c)}`}
            disabled={listening || !!feedback}
            data-choice={c}
            onClick={() => choose(c)}
          >
            {c === 0 ? he.higherLower.first : he.higherLower.second}
          </Button>
        ))}
      </div>
      <FeedbackBanner tone={feedback ? (feedback.correct ? 'correct' : 'wrong') : 'neutral'}>
        {feedback
          ? feedback.correct
            ? he.exercise.correct
            : right === 0
              ? he.higherLower.answerFirst
              : he.higherLower.answerSecond
          : listening
            ? he.higherLower.listening
            : ' '}
      </FeedbackBanner>
      <HintBar
        skill={def.skill}
        short={he.hints.higherLower}
        explanation={he.hints.explain['higher-lower']}
        onHint={onHint}
        disabled={listening || !!feedback}
      />
    </section>
  );
}
