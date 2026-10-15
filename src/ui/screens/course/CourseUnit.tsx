import { Link, useNavigate } from 'react-router';
import { unitSummary, type AttemptResult, type MapUnit } from '../../../engine';
import { he } from '../../../i18n/he';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

interface Props {
  item: MapUnit;
  number: number;
  attempts: readonly AttemptResult[];
  /** Lesson that gets the screen's one primary button (D-79). */
  primaryLessonId: string | undefined;
}

/** One unit on the course map: lessons with done / current / locked state. */
export function CourseUnit({ item, number, attempts, primaryLessonId }: Props) {
  const navigate = useNavigate();
  const { unit, display, lessons, summaryOpen } = item;
  const summary = unitSummary(unit, attempts);

  return (
    <details open={display !== 'collapsed'} className="rounded-card bg-surface p-4">
      <summary className="cursor-pointer text-xl font-bold">
        {he.course.unitTitle(number, unit.title)}
      </summary>
      <ol className="mt-3 grid gap-2">
        {lessons.map(({ lesson, status }, i) => (
          <li
            key={lesson.id}
            data-status={status}
            className="flex flex-wrap items-center justify-between gap-2 rounded-card border border-line p-3"
          >
            <span className={status === 'locked' ? 'text-muted' : 'font-bold'}>
              {he.course.lessonTitle(i + 1, lesson.title)}
            </span>
            {status === 'done' && (
              <Link to={`/lesson/${lesson.id}`} className="text-correct-text underline">
                ✓ {he.course.done}
              </Link>
            )}
            {status === 'current' && (
              <Button
                variant={lesson.id === primaryLessonId ? 'primary' : 'secondary'}
                onClick={() => void navigate(`/lesson/${lesson.id}`)}
              >
                {he.course.start}
              </Button>
            )}
            {status === 'locked' && <span className="text-sm text-muted">{he.course.locked}</span>}
          </li>
        ))}
      </ol>
      {unit.summaryTest.length > 0 && (
        <Card className="mt-3 border border-line">
          <h3 className="font-bold">{he.course.summaryTitle}</h3>
          <p className="text-muted">
            {summaryOpen ? he.course.summaryOpen : he.course.summaryLocked}
          </p>
          {summary.score !== null && <p>{he.course.summaryScore(Math.round(summary.score))}</p>}
          {summaryOpen && (
            <Button
              variant={primaryLessonId ? 'secondary' : 'primary'}
              onClick={() => void navigate(`/unit/${unit.id}/test`)}
            >
              {he.course.summaryStart}
            </Button>
          )}
        </Card>
      )}
    </details>
  );
}
