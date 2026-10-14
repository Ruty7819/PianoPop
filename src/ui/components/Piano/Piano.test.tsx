import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { he } from '../../../i18n/he';
import { createPianoInput } from '../../../services/input';
import { Piano } from './Piano';
import type { PianoAudio } from './types';

function setup(props: Partial<Parameters<typeof Piano>[0]> = {}) {
  const input = createPianoInput(() => 1.5);
  const audio: PianoAudio = {
    noteOn: vi.fn(),
    noteOff: vi.fn(),
    setVolume: vi.fn(),
    setMuted: vi.fn(),
  };
  render(<Piano input={input} audio={audio} octaves={2} startMidi={48} {...props} />);
  const key = (midi: number) => document.querySelector(`[data-midi="${midi}"]`) as HTMLElement;
  return { input, audio, key };
}

describe('Piano', () => {
  it('renders 2 octaves LTR with the closing C', () => {
    const { key } = setup();
    expect(
      screen.getAllByRole('button', { pressed: false }).filter((b) => b.dataset.midi),
    ).toHaveLength(25);
    expect(key(48)).toBeInTheDocument();
    expect(key(72)).toBeInTheDocument();
    expect(key(48).closest('[dir]')).toHaveAttribute('dir', 'ltr');
  });

  it('plays a pointer press on the audio clock and shows it pressed', () => {
    const { audio, key } = setup();
    fireEvent.pointerDown(key(60), { pointerId: 1 });
    expect(audio.noteOn).toHaveBeenCalledWith(60, 1.5);
    expect(key(60)).toHaveAttribute('aria-pressed', 'true');
    fireEvent.pointerUp(window, { pointerId: 1 });
    expect(audio.noteOff).toHaveBeenCalledWith(60, 1.5);
    expect(key(60)).toHaveAttribute('aria-pressed', 'false');
  });

  it('plays from the computer keyboard by code (base = lowest visible C)', () => {
    const { audio } = setup();
    fireEvent.keyDown(window, { code: 'KeyA', key: 'ש' });
    expect(audio.noteOn).toHaveBeenCalledWith(48, 1.5);
  });

  it('shows highlights and toggles key letters', () => {
    const { key } = setup({ highlights: { 60: 'target', 62: 'wrong' } });
    expect(key(60)).toHaveAttribute('data-highlight', 'target');
    expect(key(62)).toHaveAttribute('data-highlight', 'wrong');
    expect(key(48)).toHaveTextContent('A');
    fireEvent.click(screen.getByLabelText(he.piano.showKeyLetters));
    expect(key(48)).not.toHaveTextContent('A');
  });

  it('shifts the range by octave and remaps the keyboard', () => {
    const { audio, key } = setup();
    fireEvent.click(screen.getByLabelText(he.piano.higher));
    expect(key(48)).toBeNull();
    expect(key(84)).toBeInTheDocument();
    fireEvent.keyDown(window, { code: 'KeyA' });
    expect(audio.noteOn).toHaveBeenCalledWith(60, 1.5);
  });

  it('volume and mute reach the audio service', () => {
    const { audio } = setup();
    fireEvent.change(screen.getByLabelText(he.piano.volume), { target: { value: '0.3' } });
    expect(audio.setVolume).toHaveBeenLastCalledWith(0.3);
    fireEvent.click(screen.getByLabelText(he.piano.mute));
    expect(audio.setMuted).toHaveBeenLastCalledWith(true);
  });
});
