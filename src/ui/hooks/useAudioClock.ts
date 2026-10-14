import { useEffect, useState } from 'react';

/** Re-renders every animation frame with the audio-clock time while active (architecture §5). */
export function useAudioClock(now: () => number, active: boolean): number {
  const [t, setT] = useState(now);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const tick = () => {
      setT(now());
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(id);
  }, [now, active]);
  return t;
}
