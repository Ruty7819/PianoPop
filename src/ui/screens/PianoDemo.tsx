import { Link } from 'react-router';
import { he } from '../../i18n/he';
import { audio } from '../../services/audio';
import { pianoInput } from '../../services/input';
import { AudioGate } from '../components/AudioGate';
import { Piano } from '../components/Piano';

/** Temporary demo route (plan M1.4–M1.5); removed once lessons exist. */
export function PianoDemo() {
  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{he.demo.title}</h1>
      <AudioGate audio={audio}>
        <Piano input={pianoInput} audio={audio} highlights={{ 60: 'target' }} noteNames="solfege" />
      </AudioGate>
      <Link className="mt-4 inline-block text-muted underline" to="/demo/press-key">
        {he.pressKey.title}
      </Link>
      <Link className="ms-4 mt-4 inline-block text-muted underline" to="/demo/read-note">
        {he.readNote.title}
      </Link>
      <Link className="ms-4 mt-4 inline-block text-muted underline" to="/demo/play-sequence">
        {he.playSequence.title}
      </Link>
      <Link className="ms-4 mt-4 inline-block text-muted underline" to="/demo/higher-lower">
        {he.higherLower.title}
      </Link>
      <Link className="ms-4 mt-4 inline-block text-muted underline" to="/demo/tap-rhythm">
        {he.tapRhythm.title}
      </Link>
    </main>
  );
}
