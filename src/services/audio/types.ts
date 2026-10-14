import type { Midi } from '../../engine';

/** idle → starting (unlocking context) → loading (samples) → ready; blocked if the browser refused. */
export type AudioState = 'idle' | 'starting' | 'loading' | 'ready' | 'blocked';

export interface SequenceNote {
  midi: Midi;
  /** Offset in seconds from the sequence start. */
  at: number;
  /** Duration in seconds. */
  dur: number;
}

export interface AudioService {
  readonly state: AudioState;
  /** Fetch the Tone.js chunk early so start() stays inside the user gesture. */
  preload(): Promise<void>;
  /** Must be called from a user gesture ("התחילו" click). Resolves when samples are loaded. */
  start(): Promise<void>;
  /** Audio clock in seconds — the single time source for input and scheduling. */
  now(): number;
  playNote(midi: Midi, dur?: number, time?: number): void;
  noteOn(midi: Midi, time?: number): void;
  noteOff(midi: Midi, time?: number): void;
  /** Schedules notes; returns the audio-clock time the sequence ends. */
  playSequence(notes: SequenceNote[], startAt?: number): number;
  /** Metronome click; accented for downbeats. */
  click(time?: number, accent?: boolean): void;
  /** 0..1 */
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  subscribe(listener: (state: AudioState) => void): () => void;
}
