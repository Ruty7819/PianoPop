import type { AudioService } from '../services/audio';

/** Ready-to-play audio service for screen tests: `vi.mock('…/services/audio', fakeAudioModule)`. */
export function fakeAudioModule() {
  const audio: AudioService = {
    state: 'ready',
    preload: () => Promise.resolve(),
    start: () => Promise.resolve(),
    now: () => 1,
    playNote: () => undefined,
    noteOn: () => undefined,
    noteOff: () => undefined,
    playSequence: () => 0,
    click: () => undefined,
    setVolume: () => undefined,
    setMuted: () => undefined,
    subscribe: () => () => undefined,
  };
  return { audio };
}
