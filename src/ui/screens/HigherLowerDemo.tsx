import type { HigherLowerDef } from '../../content';
import { he } from '../../i18n/he';
import { audio } from '../../services/audio';
import { AudioGate } from '../components/AudioGate';
import { HigherLower } from '../exercises/HigherLower';

const DEMO_DEF: HigherLowerDef = {
  id: 'demo-higher-lower',
  type: 'higher-lower',
  skill: 'ear',
  pairs: [
    [60, 67],
    [72, 64],
    [62, 65],
    [69, 60],
    [64, 71],
    [67, 62],
    [60, 64],
    [71, 67],
    [65, 69],
    [74, 72],
  ],
};

/** Temporary demo route (plan M2.2); removed once lessons exist. */
export function HigherLowerDemo() {
  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{he.higherLower.title}</h1>
      <AudioGate audio={audio}>
        <HigherLower def={DEMO_DEF} audio={audio} />
      </AudioGate>
    </main>
  );
}
