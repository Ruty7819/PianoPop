import { Link, useSearchParams } from 'react-router';
import type { PlaySequenceDef } from '../../content';
import { he } from '../../i18n/he';
import { audio } from '../../services/audio';
import { pianoInput } from '../../services/input';
import { AudioGate } from '../components/AudioGate';
import { PlaySequence } from '../exercises/PlaySequence';

const NAMES_DEF: PlaySequenceDef = {
  id: 'demo-play-sequence-names',
  type: 'play-sequence',
  skill: 'playing',
  show: 'names',
  notes: [60, 62, 64, 65, 67, 67, 69, 67],
};
const STAFF_DEF: PlaySequenceDef = { ...NAMES_DEF, id: 'demo-play-sequence-staff', show: 'staff' };

/** Temporary demo route (plan M2.2); removed once lessons exist. ?show=staff for the staff view. */
export function PlaySequenceDemo() {
  const [params] = useSearchParams();
  const staff = params.get('show') === 'staff';
  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{he.playSequence.title}</h1>
      <AudioGate audio={audio}>
        <PlaySequence
          key={staff ? 's' : 'n'}
          def={staff ? STAFF_DEF : NAMES_DEF}
          input={pianoInput}
          audio={audio}
        />
      </AudioGate>
      <Link className="mt-4 inline-block text-muted underline" to={staff ? '?' : '?show=staff'}>
        {staff ? he.demo.showNames : he.demo.showStaff}
      </Link>
    </main>
  );
}
