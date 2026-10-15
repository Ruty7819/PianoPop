import { HINT_PENALTY, MAX_PENALIZED_HINTS, type AttemptResult } from '../../engine';
import { he } from '../../i18n/he';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { useContinue } from './continueContext';

export function ExerciseSummary({
  result,
  onRetry,
}: {
  result: AttemptResult;
  onRetry: () => void;
}) {
  const flow = useContinue();
  const canContinue = flow !== null && (result.passed || !flow.requirePass);
  return (
    <Card className="justify-items-center text-center">
      <FeedbackBanner tone={result.passed ? 'correct' : 'wrong'}>
        {he.exercise.done} {he.exercise.score(Math.round(result.score))} ·{' '}
        {result.passed ? he.exercise.passed : he.exercise.failed}
      </FeedbackBanner>
      {result.hintsUsed > 0 && (
        <p className="text-muted">
          {he.exercise.hintsUsed(
            result.hintsUsed,
            HINT_PENALTY * Math.min(result.hintsUsed, MAX_PENALIZED_HINTS),
          )}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        {canContinue && (
          <Button variant="primary" onClick={flow?.onContinue}>
            {he.exercise.continue}
          </Button>
        )}
        <Button variant={canContinue ? 'secondary' : 'primary'} onClick={onRetry}>
          {he.exercise.retry}
        </Button>
      </div>
    </Card>
  );
}
