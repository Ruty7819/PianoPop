import type { PressKeyDef } from '../../content';
import { he } from '../../i18n/he';
import { audio } from '../../services/audio';
import { pianoInput } from '../../services/input';
import { AudioGate } from '../components/AudioGate';
import { PressKey } from '../exercises/PressKey';

const DEMO_DEF: PressKeyDef = {
  id: 'demo-press-key',
  type: 'press-key',
  skill: 'keyboard',
  questions: [60, 64, 67, 62, 65, 69, 71, 60, 67, 64],
};

/** Temporary demo route (plan M1.5); removed once lessons exist. */
export function PressKeyDemo() {
  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{he.pressKey.title}</h1>
      <AudioGate audio={audio}>
        <PressKey def={DEMO_DEF} input={pianoInput} audio={audio} />
      </AudioGate>
    </main>
  );
}
