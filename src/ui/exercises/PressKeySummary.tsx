import type { AttemptResult } from '../../engine';
import { he } from '../../i18n/he';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { FeedbackBanner } from '../components/FeedbackBanner';

export function PressKeySummary({
  result,
  onRetry,
}: {
  result: AttemptResult;
  onRetry: () => void;
}) {
  return (
    <Card className="justify-items-center text-center">
      <FeedbackBanner tone={result.passed ? 'correct' : 'wrong'}>
        {he.pressKey.done} {he.pressKey.score(Math.round(result.score))} ·{' '}
        {result.passed ? he.pressKey.passed : he.pressKey.failed}
      </FeedbackBanner>
      <Button variant="primary" onClick={onRetry}>
        {he.pressKey.retry}
      </Button>
    </Card>
  );
}
