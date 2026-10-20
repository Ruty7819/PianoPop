const PATHS = {
  lower: 'M15 6l-6 6 6 6',
  higher: 'M9 6l6 6-6 6',
  sound: 'M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12',
  muted: 'M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6',
} as const;

/** Stroke icons for the piano bar (direction C: no emoji). */
export function BarIcon({ name }: { name: keyof typeof PATHS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
