import { useEffect, useState, type ReactNode } from 'react';
import { he } from '../../../i18n/he';
import type { AudioService, AudioState } from '../../../services/audio';

type GateAudio = Pick<AudioService, 'state' | 'preload' | 'start' | 'subscribe'>;

/** "התחילו" button that starts audio from a user gesture; renders children once ready. */
export function AudioGate({ audio, children }: { audio: GateAudio; children: ReactNode }) {
  const [state, setState] = useState<AudioState>(audio.state);
  useEffect(() => {
    void audio.preload();
    return audio.subscribe(setState);
  }, [audio]);

  if (state === 'ready') return children;
  const busy = state === 'starting' || state === 'loading';
  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        className="min-h-11 rounded-lg bg-sky-600 px-6 text-lg text-white disabled:opacity-50"
        disabled={busy}
        onClick={() => void audio.start()}
      >
        {he.demo.start}
      </button>
      {busy && <p>{he.demo.loading}</p>}
      {state === 'blocked' && <p className="text-red-700">{he.demo.blocked}</p>}
    </div>
  );
}
