interface Props {
  /** Completed items (0..max). */
  value: number;
  max: number;
  /** Accessible name, e.g. "שאלה 4 מתוך 10". */
  label: string;
  /** One segment per item, current one in brass (lesson step bar). */
  steps?: boolean;
}

export function ProgressBar({ value, max, label, steps }: Props) {
  const clamped = Math.min(Math.max(value, 0), max);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      className={steps ? 'flex gap-1.5' : 'h-4 overflow-hidden rounded-full bg-line'}
    >
      {steps ? (
        Array.from({ length: max }, (_, i) => (
          <i
            key={i}
            data-step={i < clamped ? 'done' : i === clamped ? 'current' : 'todo'}
            className={`h-3 flex-1 rounded-full ${
              i < clamped ? 'bg-mint' : i === clamped ? 'bg-primary' : 'bg-line'
            }`}
          />
        ))
      ) : (
        <i
          className="block h-full rounded-full bg-mint motion-safe:transition-[width]"
          style={{ width: `${max ? (clamped / max) * 100 : 0}%` }}
        />
      )}
    </div>
  );
}
