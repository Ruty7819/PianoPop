import type { ReadNoteDef } from '../../content';
import { he } from '../../i18n/he';
import { audio } from '../../services/audio';
import { pianoInput } from '../../services/input';
import { AudioGate } from '../components/AudioGate';
import { ReadNote } from '../exercises/ReadNote';

const DEMO_DEF: ReadNoteDef = {
  id: 'demo-read-note',
  type: 'read-note',
  skill: 'reading',
  clef: 'treble',
  questions: [64, 67, 71, 74, 77, 65, 69, 72, 76, 60],
};

/** Temporary demo route (plan M2.1); removed once lessons exist. */
export function ReadNoteDemo() {
  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{he.readNote.title}</h1>
      <AudioGate audio={audio}>
        <ReadNote def={DEMO_DEF} input={pianoInput} audio={audio} />
      </AudioGate>
    </main>
  );
}
