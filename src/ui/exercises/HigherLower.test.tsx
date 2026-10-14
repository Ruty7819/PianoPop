import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { HigherLowerDef } from '../../content';
import { he } from '../../i18n/he';
import { HigherLower } from './HigherLower';
import { HL_TIMING } from './higherLowerTiming';

const PAIRS: [number, number][] = Array.from({ length: 10 }, (_, i) =>
  i % 2 ? [60, 67] : [72, 64],
);
const DEF: HigherLowerDef = { id: 'hl', type: 'higher-lower', skill: 'ear', pairs: PAIRS };
const LISTEN = HL_TIMING.lead + HL_TIMING.gap + HL_TIMING.note;

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function setup() {
  const audio = { playNote: vi.fn(), now: () => 0 };
  const onDone = vi.fn();
  render(<HigherLower def={DEF} audio={audio} onDone={onDone} />);
  const btn = (name: string) => screen.getByRole('button', { name });
  const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));
  return { audio, onDone, btn, wait };
}

describe('HigherLower', () => {
  it('plays the pair, then enables the answer buttons', () => {
    const { audio, btn, wait } = setup();
    expect(btn(he.higherLower.first)).toBeDisabled();
    wait(LISTEN);
    expect(audio.playNote).toHaveBeenCalledTimes(2);
    expect(audio.playNote.mock.calls.map((c) => c[0])).toEqual([72, 64]);
    expect(btn(he.higherLower.first)).toBeEnabled();
    expect(screen.queryByRole('button', { name: /השמיעו/ })).toBeNull();
  });

  it('shows the right answer after a mistake, then moves on', () => {
    const { btn, wait } = setup();
    wait(LISTEN);
    fireEvent.click(btn(he.higherLower.second));
    expect(screen.getByRole('status')).toHaveTextContent(he.higherLower.answerFirst);
    expect(btn(he.higherLower.first)).toHaveClass('bg-correct!');
    wait(HL_TIMING.wrong);
    expect(screen.getByText(he.exercise.progress(2, 10))).toBeInTheDocument();
  });

  it('scores the set (≥ 90%)', () => {
    const { btn, wait, onDone } = setup();
    PAIRS.forEach((p, i) => {
      wait(LISTEN);
      const higherFirst = p[0] > p[1];
      const pick = i === 0 ? !higherFirst : higherFirst;
      fireEvent.click(btn(pick ? he.higherLower.first : he.higherLower.second));
      wait(HL_TIMING.wrong);
    });
    expect(onDone.mock.calls[0]?.[0]).toMatchObject({ exerciseId: 'hl', score: 90, passed: true });
  });

  it('replays the pair from the hint menu and counts it as a hint (D-23)', () => {
    const { audio, btn, wait, onDone } = setup();
    wait(LISTEN);
    fireEvent.click(btn(he.hints.open));
    fireEvent.click(btn(he.hints.types['replay-demo']));
    expect(btn(he.higherLower.first)).toBeDisabled();
    wait(LISTEN);
    expect(audio.playNote.mock.calls.map((c) => c[0])).toEqual([72, 64, 72, 64]);
    PAIRS.forEach((p) => {
      fireEvent.click(btn(p[0] > p[1] ? he.higherLower.first : he.higherLower.second));
      wait(HL_TIMING.correct);
      wait(LISTEN);
    });
    expect(onDone.mock.calls[0]?.[0]).toMatchObject({ rawScore: 100, hintsUsed: 1, score: 90 });
  });
});
