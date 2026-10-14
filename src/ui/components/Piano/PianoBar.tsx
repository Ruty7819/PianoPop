import { he } from '../../../i18n/he';

interface Props {
  volume: number;
  muted: boolean;
  showKeyLetters: boolean;
  canLower: boolean;
  canHigher: boolean;
  onVolume: (v: number) => void;
  onMuted: (m: boolean) => void;
  onShowKeyLetters: (s: boolean) => void;
  onShift: (octaves: number) => void;
}

const btn =
  'min-h-11 min-w-11 rounded-lg border border-gray-300 bg-white px-2 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-sky-600';

/** Range arrows, volume + mute (D-14), key-letter toggle. Rendered LTR with the piano. */
export function PianoBar(p: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 pb-2">
      <button
        type="button"
        className={btn}
        aria-label={he.piano.lower}
        disabled={!p.canLower}
        onClick={() => p.onShift(-1)}
      >
        ◀
      </button>
      <button
        type="button"
        className={btn}
        aria-label={he.piano.higher}
        disabled={!p.canHigher}
        onClick={() => p.onShift(1)}
      >
        ▶
      </button>
      <button
        type="button"
        className={btn}
        aria-label={p.muted ? he.piano.unmute : he.piano.mute}
        aria-pressed={p.muted}
        onClick={() => p.onMuted(!p.muted)}
      >
        {p.muted ? '🔇' : '🔊'}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={p.volume}
        aria-label={he.piano.volume}
        className="h-11 w-28"
        onChange={(e) => p.onVolume(Number(e.target.value))}
      />
      <label className="ms-auto flex min-h-11 items-center gap-2" dir="rtl">
        <input
          type="checkbox"
          className="size-5"
          checked={p.showKeyLetters}
          onChange={(e) => p.onShowKeyLetters(e.target.checked)}
        />
        {he.piano.showKeyLetters}
      </label>
    </div>
  );
}
