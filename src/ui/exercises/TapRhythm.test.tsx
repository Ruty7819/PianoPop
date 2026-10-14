import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TapRhythmDef } from '../../content';
import { he } from '../../i18n/he';
import { TapRhythm, TR_TIMING } from './TapRhythm';

// 60 bpm → 1 s per beat; one bar.
const DEF: TapRhythmDef = {
  id: 'tr',
  type: 'tap-rhythm',
  skill: 'rhythm',
  bpm: 60,
  pattern: [0, 1, 2, 3],
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function setup(latencyOffsetMs = 0) {
  const audio = { click: vi.fn(), playNote: vi.fn(), now: () => Date.now() / 1000 };
  const onDone = vi.fn();
  render(<TapRhythm def={DEF} audio={audio} latencyOffsetMs={latencyOffsetMs} onDone={onDone} />);
  const wait = (s: number) => act(() => vi.advanceTimersByTime(s * 1000));
  const tap = () => fireEvent.keyDown(window, { code: 'Space' });
  const pad = () => screen.getByRole('button', { name: he.tapRhythm.tapHint });
  fireEvent.click(screen.getByRole('button', { name: he.tapRhythm.start }));
  return { audio, onDone, wait, tap, pad };
}

describe('TapRhythm', () => {
  it('plays the demo with clicks for demo, count-in and tapping bars', () => {
    const { audio, pad } = setup();
    expect(audio.click).toHaveBeenCalledTimes(12);
    expect(audio.playNote).toHaveBeenCalledTimes(4);
    expect(screen.getByText(he.tapRhythm.demo)).toBeInTheDocument();
    expect(pad()).toBeDisabled();
  });

  it('scores taps on the beat and shows feedback per tap', () => {
    const { onDone, wait, tap, pad } = setup();
    wait(TR_TIMING.lead + 4);
    expect(screen.getByText(he.tapRhythm.countIn)).toBeInTheDocument();
    expect(pad()).toBeEnabled();
    wait(4);
    tap();
    expect(screen.getByText(he.tapRhythm.onTime)).toBeInTheDocument();
    wait(1.15);
    tap();
    expect(screen.getByText(he.tapRhythm.late)).toBeInTheDocument();
    wait(0.85);
    tap();
    wait(5);
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onDone.mock.calls[0]?.[0]).toMatchObject({
      exerciseId: 'tr',
      rawScore: 75,
      passed: true,
    });
    expect(document.querySelectorAll('[data-beat="miss"]')).toHaveLength(1);
  });

  it('applies the latency offset', () => {
    const { onDone, wait, tap } = setup(300);
    wait(TR_TIMING.lead + 8 + 0.3);
    for (let i = 0; i < 4; i++) {
      tap();
      wait(1);
    }
    wait(2);
    expect(onDone.mock.calls[0]?.[0]).toMatchObject({ rawScore: 100 });
  });

  it('retries from the start', () => {
    const { wait } = setup();
    wait(20);
    fireEvent.click(screen.getByRole('button', { name: he.exercise.retry }));
    expect(screen.getByRole('button', { name: he.tapRhythm.start })).toBeInTheDocument();
  });
});
