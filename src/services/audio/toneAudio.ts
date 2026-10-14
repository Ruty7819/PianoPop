import type { Midi } from '../../engine';
import type { AudioService, AudioState, SequenceNote } from './types';
import { SAMPLE_BASE_URL, sampleUrls, volumeToDb } from './samples';

type ToneModule = typeof import('tone');

const NOTE_DUR = 1;

/** Tone.js-backed AudioService. Tone is loaded lazily so it stays out of the main bundle. */
export function createToneAudioService(
  load: () => Promise<ToneModule> = () => import('tone'),
): AudioService {
  let state: AudioState = 'idle';
  let tone: ToneModule | null = null;
  let loading: Promise<ToneModule> | null = null;
  let starting: Promise<void> | null = null;
  let sampler: InstanceType<ToneModule['Sampler']> | null = null;
  let clicker: InstanceType<ToneModule['MembraneSynth']> | null = null;
  let volume = 0.8;
  let muted = false;
  const listeners = new Set<(s: AudioState) => void>();

  const setState = (s: AudioState) => {
    state = s;
    listeners.forEach((l) => l(s));
  };
  const getTone = () => (loading ??= load().then((t) => (tone = t)));
  const freq = (midi: Midi) => tone!.Frequency(midi, 'midi').toFrequency();
  const applyVolume = () => {
    if (!tone) return;
    const dest = tone.getDestination();
    dest.mute = muted;
    dest.volume.value = volumeToDb(volume);
  };

  async function doStart() {
    setState('starting');
    try {
      const t = await getTone();
      await t.start();
      if (t.getContext().state !== 'running') throw new Error('AudioContext not running');
      t.getContext().lookAhead = 0; // live key presses must sound immediately
      applyVolume();
      setState('loading');
      sampler = new t.Sampler({
        urls: sampleUrls(),
        baseUrl: SAMPLE_BASE_URL,
        release: 1,
      }).toDestination();
      clicker = new t.MembraneSynth({
        octaves: 2,
        envelope: { attack: 0.001, decay: 0.08, sustain: 0 },
      }).toDestination();
      await t.loaded();
      setState('ready');
    } catch (err) {
      starting = null;
      setState('blocked');
      throw err;
    }
  }

  const ready = () => state === 'ready' && sampler !== null;

  return {
    get state() {
      return state;
    },
    preload: () => getTone().then(() => undefined),
    start: () => (starting ??= doStart()),
    now: () => tone?.getContext().rawContext.currentTime ?? 0,
    playNote(midi, dur = NOTE_DUR, time) {
      if (ready()) sampler!.triggerAttackRelease(freq(midi), dur, time);
    },
    noteOn(midi, time) {
      if (ready()) sampler!.triggerAttack(freq(midi), time);
    },
    noteOff(midi, time) {
      if (ready()) sampler!.triggerRelease(freq(midi), time);
    },
    playSequence(notes: SequenceNote[], startAt) {
      const t0 = startAt ?? this.now() + 0.1;
      let end = t0;
      for (const n of notes) {
        this.playNote(n.midi, n.dur, t0 + n.at);
        end = Math.max(end, t0 + n.at + n.dur);
      }
      return end;
    },
    click(time, accent = false) {
      if (ready()) clicker!.triggerAttackRelease(accent ? 'C6' : 'G5', 0.05, time);
    },
    setVolume(v) {
      volume = v;
      applyVolume();
    },
    setMuted(m) {
      muted = m;
      applyVolume();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
