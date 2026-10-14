import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { PlaySequenceDef } from '../../content';
import { he } from '../../i18n/he';
import type { SequenceNote } from '../../services/audio';
import { createPianoInput } from '../../services/input';
import { PlaySequence } from './PlaySequence';

const NOTES = [60, 62, 64, 65, 67];

beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

function setup(show: PlaySequenceDef['show'], skill: PlaySequenceDef['skill'] = 'playing') {
  const def: PlaySequenceDef = { id: 'ps', type: 'play-sequence', skill, notes: NOTES, show };
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
  render(<PlaySequence def={def} input={input} audio={audio} onDone={onDone} octaves={2} />);
  const press = (midi: number) =>
    act(() => {
      input.pointerDown(1, midi);
      input.pointerUp(1);
    });
  return { press, onDone, audio };
}

const steps = () =>
  [...document.querySelectorAll('li[data-step]')].map((e) => (e as HTMLElement).dataset.step);

describe('PlaySequence', () => {
  it('shows names, marks progress and keeps the octave of the first note', () => {
    const { press } = setup('names');
    expect(steps()).toEqual(['current', 'todo', 'todo', 'todo', 'todo']);
    press(72);
    expect(steps()?.[0]).toBe('done');
    press(62);
    expect(screen.getByRole('status')).toHaveTextContent(he.exercise.wrong);
    press(74);
    expect(steps()?.slice(0, 3)).toEqual(['done', 'done', 'current']);
  });

  it('free demo plays the sequence and scores the current note wrong', () => {
    const { audio, press, onDone } = setup('names');
    fireEvent.click(screen.getByRole('button', { name: he.hints.demo }));
    expect(audio.playSequence).toHaveBeenCalledOnce();
    expect(audio.playSequence.mock.calls[0]?.[0]).toHaveLength(5);
    for (const n of NOTES) press(n);
    expect(onDone.mock.calls[0]?.[0]).toMatchObject({ rawScore: 80, hintsUsed: 0 });
  });

  it('in ear exercises the replay is only in the hint menu and counts (D-23)', () => {
    const { audio, press, onDone } = setup('names', 'ear');
    expect(screen.queryByRole('button', { name: he.hints.demo })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: he.hints.open }));
    fireEvent.click(screen.getByRole('button', { name: he.hints.types['replay-demo'] }));
    expect(audio.playSequence).toHaveBeenCalledOnce();
    for (const n of NOTES) press(n);
    expect(onDone.mock.calls[0]?.[0]).toMatchObject({ rawScore: 100, hintsUsed: 1, score: 90 });
  });

  it('on the staff needs the exact pitch and scores first tries', () => {
    const { press, onDone } = setup('staff');
    expect(screen.getByRole('img', { name: he.staff.label })).toBeInTheDocument();
    press(72);
    press(60);
    for (const n of NOTES.slice(1)) press(n);
    expect(onDone.mock.calls[0]?.[0]).toMatchObject({ rawScore: 80, passed: true });
  });
});
