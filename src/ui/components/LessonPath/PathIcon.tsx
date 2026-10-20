import type { LessonStatus } from '../../../engine';

const STROKE = {
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** ✓ done, ▶ current, lock for locked (direction C). */
export function PathIcon({ status }: { status: LessonStatus }) {
  if (status === 'done')
    return (
      <svg {...STROKE} className="size-8" strokeWidth={3}>
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
    <svg {...STROKE} className="size-7" strokeWidth={2.4}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
