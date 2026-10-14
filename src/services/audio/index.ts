import { createToneAudioService } from './toneAudio';

export type { AudioService, AudioState, SequenceNote } from './types';
export { createToneAudioService } from './toneAudio';

/** App-wide singleton (architecture §5). */
export const audio = createToneAudioService();
