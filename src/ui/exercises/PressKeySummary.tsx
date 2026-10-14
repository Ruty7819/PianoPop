import type { AttemptResult } from '../../engine';
import { he } from '../../i18n/he';
import { FeedbackBanner } from '../components/FeedbackBanner';

export function PressKeySummary({
  result,
  onRetry,
}: {
  result: AttemptResult;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <FeedbackBanner tone={result.passed ? 'correct' : 'wrong'}>
        {he.pressKey.done} {he.pressKey.score(Math.round(result.score))} ·{' '}
        {result.passed ? he.pressKey.passed : he.pressKey.failed}
      </FeedbackBanner>
      <button
        type="button"
        className="min-h-11 rounded-lg bg-sky-600 px-6 text-lg text-white"
        onClick={onRetry}
      >
        {he.pressKey.retry}
      </button>
    </div>
  );
}
