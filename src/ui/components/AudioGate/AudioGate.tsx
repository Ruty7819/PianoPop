import { useEffect, useState, type ReactNode } from 'react';
import { he } from '../../../i18n/he';
import type { AudioService, AudioState } from '../../../services/audio';
import { Button } from '../Button';

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
      <Button variant="primary" disabled={busy} onClick={() => void audio.start()}>
        {he.demo.start}
      </Button>
      {busy && <p className="text-muted">{he.demo.loading}</p>}
      {state === 'blocked' && <p className="text-wrong-text">{he.demo.blocked}</p>}
    </div>
  );
}
