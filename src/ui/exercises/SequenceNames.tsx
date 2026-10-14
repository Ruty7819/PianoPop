import { noteLabel, type Midi, type NoteNaming } from '../../engine';
import { he } from '../../i18n/he';

const STATE_CLASS = {
  done: 'bg-correct/15 text-correct-text',
  current: 'bg-target/20 ring-2 ring-target text-ink',
  todo: 'bg-surface text-muted',
} as const;

/** The sequence as note-name chips; done / current / todo. */
export function SequenceNames({
  notes,
  index,
  naming,
}: {
  notes: readonly Midi[];
  index: number;
  naming: NoteNaming;
}) {
  return (
    <ol aria-label={he.playSequence.sequence} className="flex flex-wrap justify-center gap-2">
      {notes.map((m, i) => {
        const st = i < index ? 'done' : i === index ? 'current' : 'todo';
        return (
          <li
            key={i}
            data-step={st}
            aria-current={st === 'current' ? 'step' : undefined}
            className={`min-w-14 rounded-full px-4 py-2 text-center text-2xl ${STATE_CLASS[st]}`}
          >
            {noteLabel(m, { naming })}
          </li>
        );
      })}
    </ol>
  );
}
