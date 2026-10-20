import type { ExerciseType } from '../../../content';
import { he } from '../../../i18n/he';

// One stroke icon per exercise type (direction C: no emoji).
const PATHS: Record<ExerciseType, string> = {
  'press-key': 'M3 5h18v14H3zM8 5v9M12 5v9M16 5v9',
  'read-note': 'M3 7h18M3 11h18M3 15h18M14 17.5a2.5 2 0 1 1-5 0 2.5 2 0 0 1 5 0zM14 17.5V5',
  'play-sequence':
    'M9 18V5l11-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  'higher-lower': 'M7 20V4M3 8l4-4 4 4M17 4v16M13 16l4 4 4-4',
  'tap-rhythm': 'M4 12h3l2-6 4 12 2-6h5',
};

const TONE: Record<ExerciseType, string> = {
  'press-key': 'bg-primary-soft text-primary-dark',
  'read-note': 'bg-[#ffe3ee] text-wrong-text',
  'play-sequence': 'bg-mint-soft text-correct-text',
  'higher-lower': 'bg-[#dcedff] text-[#1d5fa8]',
  'tap-rhythm': 'bg-[#fff1cc] text-[#7a5300]',
};

/** A practice exercise as a pressable tile with its type icon. */
export function ExerciseTile({ type, onClick }: { type: ExerciseType; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-b-5 border-line bg-surface p-2 pe-4 text-start font-bold hover:bg-canvas active:translate-y-1 active:border-b-2"
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${TONE[type]}`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={PATHS[type]} />
        </svg>
      </span>
      {he.exerciseTypes[type]}
    </button>
  );
}
