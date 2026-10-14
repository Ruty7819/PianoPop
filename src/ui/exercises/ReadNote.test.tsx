import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { ReadNoteDef } from '../../content';
import { he } from '../../i18n/he';
import type { SequenceNote } from '../../services/audio';
import { createPianoInput } from '../../services/input';
import { ReadNote } from './ReadNote';

const QUESTIONS = [64, 67, 71, 74, 77, 65, 69, 72, 76, 62];
const DEF: ReadNoteDef = {
  id: 'rn',
  type: 'read-note',
  skill: 'reading',
  clef: 'treble',
  questions: QUESTIONS,
};

beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

function setup() {
  const input = createPianoInput(() => 0);
  const audio = {
    noteOn: vi.fn(),
    noteOff: vi.fn(),
    setVolume: vi.fn(),
    setMuted: vi.fn(),
    playSequence: vi.fn<(notes: SequenceNote[], at?: number) => number>(() => 0),
    now: () => 1,
  };
  const onDone = vi.fn();
  render(<ReadNote def={DEF} input={input} audio={audio} onDone={onDone} octaves={2} />);
  const press = (midi: number) =>
    act(() => {
      input.pointerDown(1, midi);
      input.pointerUp(1);
    });
  const key = (midi: number) => document.querySelector(`[data-midi="${midi}"]`);
  return { press, onDone, key };
}

describe('ReadNote', () => {
  it('shows the staff without the note name before an answer', async () => {
    setup();
    expect(screen.getByRole('heading')).toHaveTextContent(he.readNote.prompt);
    await waitFor(() => expect(document.querySelector('svg')).toBeInTheDocument());
    expect(document.querySelector('[data-label-for]')).toBeNull();
    expect(screen.getByText(he.exercise.progress(1, 10))).toBeInTheDocument();
  });

  it('rejects the right name in the wrong octave and marks the right key', async () => {
    const { press, key } = setup();
    press(76);
    expect(screen.getByRole('status')).toHaveTextContent(he.exercise.wrong);
    expect(key(76)).toHaveAttribute('data-highlight', 'wrong');
    expect(key(64)).toHaveAttribute('data-highlight', 'target');
    expect(await screen.findByText('מי')).toHaveAttribute('data-label-for', '64');
  });

  it('labels the answered note after a correct press, then scores the set', async () => {
    const { press, onDone } = setup();
    press(64);
    expect(screen.getByRole('status')).toHaveTextContent(he.exercise.correct);
    expect(await screen.findByText('מי')).toHaveAttribute('data-label-for', '64');
    press(55);
    press(67);
    for (const q of QUESTIONS.slice(2)) press(q);
    expect(onDone.mock.calls[0]?.[0]).toMatchObject({ exerciseId: 'rn', rawScore: 90 });
  });
});
