import type { Midi, NoteNaming } from '../../../engine';
import type { AudioService } from '../../../services/audio';
import type { PianoInput } from '../../../services/input';

/** Visual key states (requirements §5). */
export type KeyHighlight = 'target' | 'correct' | 'wrong' | 'demo';

export type PianoAudio = Pick<AudioService, 'noteOn' | 'noteOff' | 'setVolume' | 'setMuted'>;

export interface PianoProps {
  input: PianoInput;
  audio: PianoAudio;
  highlights?: Readonly<Partial<Record<Midi, KeyHighlight>>>;
  /** Visible octaves; defaults to the device size (D-70). */
  octaves?: number;
  /** Lowest visible C; defaults to a range around middle C. */
  startMidi?: Midi;
  /** Note names printed on keys (exercise decides). */
  noteNames?: NoteNaming;
}

export interface KeyLayout {
  midi: Midi;
  black: boolean;
  /** Left edge in % of the keyboard width. */
  left: number;
  /** Width in % of the keyboard width. */
  width: number;
}
