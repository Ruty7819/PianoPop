import { he } from '../../i18n/he';
import { ProgressBar } from '../components/ProgressBar';

export function ExerciseProgress({ index, total }: { index: number; total: number }) {
  const text = he.exercise.progress(index + 1, total);
  return (
    <div className="grid gap-1 text-sm text-muted">
      <span>{text}</span>
      <ProgressBar value={index} max={total} label={text} />
    </div>
  );
}
