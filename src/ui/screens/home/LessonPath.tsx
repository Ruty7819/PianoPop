import { Link } from 'react-router';
import type { MapUnit } from '../../../engine';
import { he } from '../../../i18n/he';

// Zig-zag offsets for the path of lesson circles (direction C).
const OFFSETS = ['ms-24', 'ms-2', 'me-20', 'ms-8', 'ms-28', 'me-10'];

const CIRCLE = {
  done: 'size-18 bg-mint border-mint-dark text-white',
  current: 'size-22 bg-primary border-primary-dark text-white ring-8 ring-primary-soft',
  locked: 'size-18 bg-line border-locked text-muted',
} as const;

function Icon({ status }: { status: keyof typeof CIRCLE }) {
  const common = {
    viewBox: '0 0 24 24',
    'aria-hidden': true,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  if (status === 'done')
    return (
      <svg {...common} className="size-8" strokeWidth={3}>
        <path d="M5 12l5 5L20 7" />
      </svg>
    );
  if (status === 'current')
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="size-9 fill-current">
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  return (
    <svg {...common} className="size-7" strokeWidth={2.4}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

/** The current unit as a zig-zag path of lesson circles: done ✓, current ▶, locked 🔒 (D-79). */
export function LessonPath({ item }: { item: MapUnit }) {
  return (
    <ol className="grid justify-items-center gap-4 py-2">
      {item.lessons.map(({ lesson, status }, i) => {
        const label = he.course.lessonTitle(i + 1, lesson.title);
        const circle = `flex items-center justify-center rounded-full border-b-6 ${CIRCLE[status]}`;
        return (
          <li
            key={lesson.id}
            data-status={status}
            className={`flex items-center gap-3 ${OFFSETS[i % OFFSETS.length]}`}
          >
            {status === 'locked' ? (
              <span className={circle} title={label}>
                <Icon status={status} />
                <span className="sr-only">
                  {label} · {he.course.locked}
                </span>
              </span>
            ) : (
              <Link to={`/lesson/${lesson.id}`} className={circle} aria-label={label}>
                <Icon status={status} />
              </Link>
            )}
            {status === 'current' && (
              <span className="rounded-2xl border-2 border-primary-soft bg-surface px-4 py-2 font-bold">
                {label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
