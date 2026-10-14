import { useEffect, useState } from 'react';

/** Phone 2, tablet 3, desktop 4 (D-70). Phone = touch screen whose short side < 500px. */
export function octavesFor(width: number, height: number, coarse: boolean): number {
  if (coarse && Math.min(width, height) < 500) return 2;
  if (coarse || width < 1024) return 3;
  return 4;
}

function measure(): number {
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  return octavesFor(window.innerWidth, window.innerHeight, coarse);
}

export function useDeviceOctaves(): number {
  const [octaves, setOctaves] = useState(measure);
  useEffect(() => {
    const onResize = () => setOctaves(measure());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return octaves;
}
