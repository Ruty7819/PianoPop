import type { TapRhythmDef } from '../../content';
import { he } from '../../i18n/he';
import { audio } from '../../services/audio';
import { AudioGate } from '../components/AudioGate';
import { CalibrationGate } from '../components/Calibration';
import { TapRhythm } from '../exercises/TapRhythm';

const DEMO_DEF: TapRhythmDef = {
  id: 'demo-tap-rhythm',
  type: 'tap-rhythm',
  skill: 'rhythm',
  bpm: 80,
  pattern: [0, 1, 2, 2.5, 3],
};

/** Temporary demo route (plan M2.3); removed once lessons exist. */
export function TapRhythmDemo() {
  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{he.tapRhythm.title}</h1>
      <AudioGate audio={audio}>
        <CalibrationGate audio={audio}>
          {(offset) => <TapRhythm def={DEMO_DEF} audio={audio} latencyOffsetMs={offset} />}
        </CalibrationGate>
      </AudioGate>
    </main>
  );
}
