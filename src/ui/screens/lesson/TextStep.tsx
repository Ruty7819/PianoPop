import type { DemoStep } from '../../../content';
import type { Midi } from '../../../engine';
import { he } from '../../../i18n/he';
import { audio } from '../../../services/audio';
import { pianoInput } from '../../../services/input';
import { useSettingsStore } from '../../../state';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Piano, type KeyHighlight } from '../../components/Piano';
import { useDemoPlayback } from '../../hooks/useDemoPlayback';

interface Props {
  text: string;
  /** Demo steps play these notes on the piano. */
  notes?: DemoStep['notes'];
  onNext: () => void;
  /** Jump past explanations to the next exercise (D-21); omitted when it equals onNext. */
  onSkip?: () => void;
}

/** Explanation or demo step: text, optional piano demo, "המשיכו". */
export function TextStep({ text, notes, onNext, onSkip }: Props) {
  const naming = useSettingsStore((s) => s.noteNames);
  const labels = useSettingsStore((s) => s.showKeyLabels);
  const { demoMidi, play } = useDemoPlayback(audio);
  const highlights: Partial<Record<Midi, KeyHighlight>> = {};
  if (demoMidi !== null) highlights[demoMidi] = 'demo';

  return (
    <section className="flex flex-col gap-4">
      <Card>
        <p className="text-xl leading-relaxed">{text}</p>
        {notes && (
          <Button className="justify-self-start" onClick={() => play(notes)}>
            {he.lesson.play}
          </Button>
        )}
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={onNext}>
          {he.lesson.next}
        </Button>
        {onSkip && <Button onClick={onSkip}>{he.lesson.skip}</Button>}
      </div>
      {notes && (
        <Piano
          input={pianoInput}
          audio={audio}
          highlights={highlights}
          noteNames={labels ? naming : undefined}
        />
      )}
    </section>
  );
}
