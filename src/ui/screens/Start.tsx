import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { he } from '../../i18n/he';
import { audio } from '../../services/audio';
import { getDeps, useOnboardingStore } from '../../state';
import { AudioGate } from '../components/AudioGate';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

/** Shown once audio runs; marks the first visit as seen. */
function Intro() {
  const navigate = useNavigate();
  const markStartSeen = useOnboardingStore((s) => s.markStartSeen);
  useEffect(markStartSeen, [markStartSeen]);
  const first = getDeps().course[0]?.lessons[0]?.id;

  return (
    <Card>
      <ul className="grid gap-2 text-lg">
        {he.start.intro.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="font-bold">{he.start.offer}</p>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={() => void navigate(first ? `/lesson/${first}` : '/course')}
        >
          {he.start.fromStart}
        </Button>
        <Button onClick={() => void navigate('/placement')}>{he.start.placement}</Button>
      </div>
    </Card>
  );
}

/** `/start` first visit: start audio → short intro → offer placement (requirements §12, D-82). */
export function Start() {
  return (
    <main className="mx-auto grid max-w-2xl gap-4 p-6">
      <h1 className="text-3xl font-bold">{he.start.title}</h1>
      <p className="text-muted">{he.start.audio}</p>
      <AudioGate audio={audio}>
        <Intro />
      </AudioGate>
    </main>
  );
}
