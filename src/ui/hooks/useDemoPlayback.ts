import { useCallback, useEffect, useRef, useState } from 'react';
import type { Midi } from '../../engine';
import type { AudioService } from '../../services/audio';

export type DemoAudio = Pick<AudioService, 'playSequence' | 'now'>;

const STEP_S = 0.6;
const LEAD_S = 0.05;

/** Plays notes and returns the key sounding now, for the animated `demo` highlight. */
export function useDemoPlayback(audio: DemoAudio) {
  const [demoMidi, setDemoMidi] = useState<Midi | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stop = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDemoMidi(null);
  }, []);

  const play = useCallback(
    (notes: readonly Midi[]) => {
      stop();
      const start = audio.now() + LEAD_S;
      audio.playSequence(
        notes.map((midi, i) => ({ midi, at: i * STEP_S, dur: STEP_S * 0.9 })),
        start,
      );
      // Timers follow the audio clock: delays are measured from the scheduled start.
      const delay = (s: number) => Math.max(0, (start + s - audio.now()) * 1000);
      timers.current = [
        ...notes.map((m, i) => setTimeout(() => setDemoMidi(m), delay(i * STEP_S))),
        setTimeout(() => setDemoMidi(null), delay(notes.length * STEP_S)),
      ];
    },
    [audio, stop],
  );

  useEffect(() => stop, [stop]);
  return { demoMidi, play, stop };
}
