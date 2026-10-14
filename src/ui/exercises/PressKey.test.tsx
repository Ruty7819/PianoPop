import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PressKeyDef } from '../../content';
import { he } from '../../i18n/he';
import type { SequenceNote } from '../../services/audio';
import { createPianoInput } from '../../services/input';
import { PressKey } from './PressKey';

const QUESTIONS = [60, 62, 64, 65, 67, 69, 71, 60, 62, 64];
const DEF: PressKeyDef = { id: 'pk', type: 'press-key', skill: 'keyboard', questions: QUESTIONS };

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
  render(
    <PressKey def={DEF} input={input} audio={audio} onDone={onDone} octaves={2} startMidi={48} />,
  );
  const press = (midi: number) =>
    act(() => {
      input.pointerDown(1, midi);
      input.pointerUp(1);
    });
  return { press, onDone, audio };
}

describe('PressKey', () => {
  it('asks for the named note and shows correct feedback', () => {
    const { press } = setup();
    expect(screen.getByRole('heading')).toHaveTextContent(he.pressKey.prompt('דו'));
    press(48);
    expect(screen.getByRole('status')).toHaveTextContent(he.exercise.correct);
    expect(screen.getByRole('heading')).toHaveTextContent(he.pressKey.prompt('רה'));
    expect(document.querySelector('[data-midi="48"]')).toHaveAttribute('data-highlight', 'correct');
  });

  it('stays on the question after a wrong press', () => {
    const { press } = setup();
    press(61);
    expect(screen.getByRole('status')).toHaveTextContent(he.exercise.wrong);
    expect(screen.getByRole('heading')).toHaveTextContent(he.pressKey.prompt('דו'));
  });

  it('scores a 10-question set and allows a retry', () => {
    const { press, onDone } = setup();
    press(61);
    press(60);
    press(63);
    for (const q of QUESTIONS.slice(1)) press(q);
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onDone.mock.calls[0]?.[0]).toMatchObject({
      exerciseId: 'pk',
      rawScore: 80,
      score: 80,
      passed: true,
      hintsUsed: 0,
    });
    expect(screen.getByRole('status')).toHaveTextContent(he.exercise.score(80));
    fireEvent.click(screen.getByRole('button', { name: he.exercise.retry }));
    expect(screen.getByRole('heading')).toHaveTextContent(he.pressKey.prompt('דו'));
  });

  it('free demo plays and lights the answer, and scores that question wrong', async () => {
    const { press, onDone, audio } = setup();
    fireEvent.click(screen.getByRole('button', { name: he.hints.demo }));
    expect(audio.playSequence.mock.calls[0]?.[0]).toMatchObject([{ midi: 60 }]);
    await waitFor(() =>
      expect(document.querySelector('[data-midi="60"]')).toHaveAttribute('data-highlight', 'demo'),
    );
    for (const q of QUESTIONS) press(q);
    expect(onDone.mock.calls[0]?.[0]).toMatchObject({ rawScore: 90, hintsUsed: 0 });
  });

  it('counts every hint opened from the menu in the score (D-81)', () => {
    const { press, onDone } = setup();
    const open = (type: 'short-hint' | 'explanation') => {
      fireEvent.click(screen.getByRole('button', { name: he.hints.open }));
      fireEvent.click(screen.getByRole('button', { name: he.hints.types[type] }));
    };
    open('short-hint');
    expect(screen.getByText(he.hints.whiteKeyAt('דו', he.hints.whiteKey.C))).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: he.hints.close }));
    open('short-hint');
    fireEvent.click(screen.getByRole('button', { name: he.hints.back }));
    fireEvent.click(screen.getByRole('button', { name: he.hints.types.explanation }));
    for (const q of QUESTIONS) press(q);
    expect(onDone.mock.calls[0]?.[0]).toMatchObject({ rawScore: 100, hintsUsed: 3, score: 70 });
  });
});
