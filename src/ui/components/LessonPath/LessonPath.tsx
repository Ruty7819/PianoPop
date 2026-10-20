import { Link } from 'react-router';
import type { MapUnit } from '../../../engine';
import { he } from '../../../i18n/he';
import { Button } from '../Button';
import { PathIcon } from './PathIcon';

// Zig-zag offsets for the path of lesson circles (direction C).
const OFFSETS = ['ms-24', 'ms-2', 'me-20', 'ms-8', 'ms-28', 'me-10'];

const CIRCLE = {
  done: 'size-18 bg-mint border-mint-dark text-white',
  current: 'size-22 bg-primary border-primary-dark text-white ring-8 ring-primary-soft',
  locked: 'size-18 bg-line border-locked text-muted',
} as const;

interface Props {
  item: MapUnit;
  /** Course map: a start button beside the current lesson. */
  onStart?: (lessonId: string) => void;
  /** Lesson whose start button is the screen's one primary action (D-79). */
  primaryLessonId?: string;
}

/** A unit as a zig-zag path of lesson circles: done ✓, current ▶, locked (D-79). */
export function LessonPath({ item, onStart, primaryLessonId }: Props) {
  return (
    <ol className="grid justify-items-center gap-4 py-2">
      {item.lessons.map(({ lesson, status }, i) => {
        const label = he.course.lessonTitle(i + 1, lesson.title);
        const circle = `flex shrink-0 items-center justify-center rounded-full border-b-6 ${CIRCLE[status]}`;
        return (
          <li
            key={lesson.id}
            data-status={status}
            className={`flex items-center gap-3 ${OFFSETS[i % OFFSETS.length]}`}
          >
            {status === 'locked' ? (
              <span className={circle} title={label}>
                <PathIcon status={status} />
                <span className="sr-only">
                  {label} · {he.course.locked}
                </span>
              </span>
            ) : (
              <Link to={`/lesson/${lesson.id}`} className={circle} aria-label={label}>
                <PathIcon status={status} />
              </Link>
            )}
            {status === 'current' && (
              <span className="grid gap-2 rounded-2xl border-2 border-primary-soft bg-surface px-4 py-2 font-bold">
                {label}
                {onStart && (
                  <Button
                    variant={lesson.id === primaryLessonId ? 'primary' : 'secondary'}
                    onClick={() => onStart(lesson.id)}
                  >
                    {he.course.start}
                  </Button>
                )}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
