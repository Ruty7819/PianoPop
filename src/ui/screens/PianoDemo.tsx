import { useEffect, useState } from 'react';
import { he } from '../../i18n/he';
import { audio, type AudioState } from '../../services/audio';
import { pianoInput } from '../../services/input';
import { Piano } from '../components/Piano';

/** Temporary demo route (plan M1.4–M1.5); removed once lessons exist. */
export function PianoDemo() {
  const [state, setState] = useState<AudioState>(audio.state);
  useEffect(() => {
    void audio.preload();
    return audio.subscribe(setState);
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{he.demo.title}</h1>
      {state === 'ready' ? (
        <Piano input={pianoInput} audio={audio} highlights={{ 60: 'target' }} noteNames="solfege" />
      ) : (
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            className="min-h-11 rounded-lg bg-sky-600 px-6 text-lg text-white disabled:opacity-50"
            disabled={state === 'starting' || state === 'loading'}
            onClick={() => void audio.start()}
          >
            {he.demo.start}
          </button>
          {(state === 'starting' || state === 'loading') && <p>{he.demo.loading}</p>}
          {state === 'blocked' && <p className="text-red-700">{he.demo.blocked}</p>}
        </div>
      )}
    </main>
  );
}
