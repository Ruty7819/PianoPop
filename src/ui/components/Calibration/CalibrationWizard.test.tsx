import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { he } from '../../../i18n/he';
import { CALIBRATION, CalibrationWizard } from './CalibrationWizard';

const SPB = 60 / CALIBRATION.bpm;

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function setup() {
  const audio = { click: vi.fn(), now: () => Date.now() / 1000 };
  const onDone = vi.fn();
  render(<CalibrationWizard audio={audio} onDone={onDone} />);
  const wait = (s: number) => act(() => vi.advanceTimersByTime(Math.round(s * 1000)));
  const tap = () => fireEvent.keyDown(window, { code: 'Space' });
  return { audio, onDone, wait, tap };
}

describe('CalibrationWizard', () => {
  it('measures the median delay over 12 taps and saves it', () => {
    const { audio, onDone, wait, tap } = setup();
    fireEvent.click(screen.getByRole('button', { name: he.calibration.start }));
    expect(audio.click).toHaveBeenCalledTimes(16);
    wait(CALIBRATION.lead + 4 * SPB + 0.2);
    for (let i = 0; i < 12; i++) {
      tap();
      if (i < 11) wait(SPB);
    }
    expect(screen.getByText(he.calibration.lateTip)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: he.calibration.done }));
    const ms = onDone.mock.calls[0]?.[0] as number;
    expect(Math.abs(ms - 200)).toBeLessThanOrEqual(5);
  });

  it('asks to retry when too few taps arrive', () => {
    const { wait } = setup();
    fireEvent.click(screen.getByRole('button', { name: he.calibration.start }));
    wait(20 * SPB);
    expect(screen.getByText(he.calibration.tooFew)).toBeInTheDocument();
  });

  it('skipping stores offset 0', () => {
    const { onDone } = setup();
    fireEvent.click(screen.getByRole('button', { name: he.calibration.skip }));
    expect(onDone).toHaveBeenCalledWith(0);
  });
});
