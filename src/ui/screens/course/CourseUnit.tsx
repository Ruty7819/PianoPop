import { useNavigate } from 'react-router';
import { unitSummary, type AttemptResult, type MapUnit } from '../../../engine';
import { he } from '../../../i18n/he';
import { Button } from '../../components/Button';
import { LessonPath } from '../../components/LessonPath';

interface Props {
  item: MapUnit;
  number: number;
  attempts: readonly AttemptResult[];
  /** Lesson that gets the screen's one primary button (D-79). */
  primaryLessonId: string | undefined;
}

/** One unit on the course map: lesson path + summary test card. */
export function CourseUnit({ item, number, attempts, primaryLessonId }: Props) {
  const navigate = useNavigate();
  const { unit, display, summaryOpen } = item;
  const summary = unitSummary(unit, attempts);
  const done = item.lessons.filter((l) => l.status === 'done').length;

  return (
    <details
      open={display !== 'collapsed'}
      className="group rounded-card border-2 border-line bg-surface p-5"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <h2 className="text-2xl">{he.course.unitTitle(number, unit.title)}</h2>
        <span className="rounded-full bg-canvas px-3 py-1 text-sm font-bold text-muted">
          {done}/{item.lessons.length}
        </span>
      </summary>
      <LessonPath
        item={item}
        primaryLessonId={primaryLessonId}
        onStart={(id) => void navigate(`/lesson/${id}`)}
      />
      {unit.summaryTest.length > 0 && (
        <div
          className={`mt-3 flex flex-wrap items-center gap-4 rounded-2xl border-2 p-4 ${
            summaryOpen ? 'border-primary-soft bg-canvas' : 'border-line'
          }`}
        >
          <span
            aria-hidden
            className={`flex size-14 shrink-0 items-center justify-center rounded-2xl border-b-5 ${
              summaryOpen
                ? 'border-primary-dark bg-primary text-white'
                : 'border-locked bg-line text-muted'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
            </svg>
          </span>
          <div className="grid flex-1 gap-1">
            <h3 className="font-bold">{he.course.summaryTitle}</h3>
            <p className="text-sm text-muted">
              {summaryOpen ? he.course.summaryOpen : he.course.summaryLocked}
            </p>
            {summary.score !== null && (
              <p className="text-sm font-bold text-correct-text">
                {he.course.summaryScore(Math.round(summary.score))}
              </p>
            )}
          </div>
          {summaryOpen && (
            <Button
              variant={primaryLessonId ? 'secondary' : 'primary'}
              onClick={() => void navigate(`/unit/${unit.id}/test`)}
            >
              {he.course.summaryStart}
            </Button>
          )}
        </div>
      )}
    </details>
  );
}
