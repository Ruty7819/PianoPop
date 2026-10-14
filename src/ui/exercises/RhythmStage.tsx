import type { RhythmJudgement, RhythmTimeline, TapTiming } from '../../engine';
import { he } from '../../i18n/he';
import { FeedbackBanner } from '../components/FeedbackBanner';

export type RhythmPhase = 'ready' | 'demo' | 'count' | 'tap' | 'done';

const STEP_OF: Partial<Record<RhythmPhase, number>> = { demo: 0, count: 1, tap: 2 };
const TIMING_TEXT: Record<TapTiming, string> = {
  early: he.tapRhythm.early,
  'on-time': he.tapRhythm.onTime,
  late: he.tapRhythm.late,
};

interface Props {
  phase: RhythmPhase;
  tl: RhythmTimeline | null;
  /** Audio-clock now. */
  t: number;
  last: TapTiming | null;
  judged: RhythmJudgement | null;
}

/** Step indicator + what to do right now (big count-in, tap feedback, result legend). */
export function RhythmStage({ phase, tl, t, last, judged }: Props) {
  if (judged) {
    const hits = judged.beats.filter((b) => b.hit).length;
    return (
      <div className="grid justify-items-center gap-1 text-center">
        <p className="text-xl font-bold">{he.tapRhythm.result(hits, judged.beats.length)}</p>
        <p className="text-muted">{he.tapRhythm.legend}</p>
      </div>
    );
  }
  if (phase === 'ready' || !tl) {
    return (
      <div className="grid gap-2 text-center">
        <p className="text-lg">{he.tapRhythm.intro}</p>
        <p className="text-muted">{he.tapRhythm.barHint}</p>
      </div>
    );
  }

  const spb = (tl.countIn[1] ?? 0) - (tl.countIn[0] ?? 0);
  const count = Math.min(4, Math.max(1, Math.floor((t - tl.countIn[0]!) / spb) + 1));
  const step = STEP_OF[phase] ?? 2;
  const firstBeat = phase === 'tap' && t - tl.tapStart < spb;

  return (
    <div className="grid justify-items-center gap-3">
      <ol className="flex gap-2" aria-label={he.tapRhythm.title}>
        {he.tapRhythm.steps.map((name, i) => (
          <li
            key={name}
            aria-current={i === step ? 'step' : undefined}
            className={`rounded-full px-3 py-1 text-sm ${i === step ? 'bg-ink text-surface' : 'bg-line/50 text-muted'}`}
          >
            {i + 1}. {name}
          </li>
        ))}
      </ol>
      {phase === 'count' || firstBeat ? (
        <p data-count className="text-6xl font-bold tabular-nums">
          {phase === 'count' ? count : he.tapRhythm.go}
        </p>
      ) : (
        <FeedbackBanner tone={phase === 'tap' && last === 'on-time' ? 'correct' : 'neutral'}>
          {phase === 'demo' ? he.tapRhythm.demo : last ? TIMING_TEXT[last] : he.tapRhythm.tapNow}
        </FeedbackBanner>
      )}
    </div>
  );
}
