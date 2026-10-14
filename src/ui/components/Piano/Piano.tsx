import { useEffect, useMemo, useState } from 'react';
import { noteLabel, type Midi } from '../../../engine';
import { he } from '../../../i18n/he';
import { keyLabelFor } from '../../../services/input';
import { useDeviceOctaves } from '../../hooks/useDeviceOctaves';
import { clampStart, defaultStart, layoutKeys, MAX_END, MIN_START } from './layout';
import { PianoBar } from './PianoBar';
import { PianoKey } from './PianoKey';
import type { PianoProps } from './types';

const MIDDLE_C: Midi = 60;

/** On-screen piano (requirements §5): always LTR, plays its own sound, shows highlights. */
export function Piano({
  input,
  audio,
  highlights = {},
  octaves,
  startMidi,
  noteNames,
}: PianoProps) {
  const deviceOctaves = useDeviceOctaves();
  const oct = octaves ?? deviceOctaves;
  const [requestedStart, setStart] = useState<Midi | undefined>(startMidi);
  const start = clampStart(requestedStart ?? defaultStart(oct), oct);
  const keys = useMemo(() => layoutKeys(start, oct), [start, oct]);

  const [held, setHeld] = useState<ReadonlySet<Midi>>(() => new Set(input.held()));
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showKeyLetters, setShowKeyLetters] = useState(true);

  useEffect(
    () =>
      input.subscribe(({ midi, on, t }) => {
        if (on) audio.noteOn(midi, t);
        else audio.noteOff(midi, t);
        setHeld(new Set(input.held()));
      }),
    [input, audio],
  );

  useEffect(() => {
    const detach = input.attachKeyboard(window);
    const up = (e: PointerEvent) => input.pointerUp(e.pointerId);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      detach();
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      input.releaseAll();
    };
  }, [input]);

  useEffect(() => input.setKeyboardBase(start), [input, start]);
  useEffect(() => audio.setVolume(volume), [audio, volume]);
  useEffect(() => audio.setMuted(muted), [audio, muted]);

  return (
    <div dir="ltr" className="w-full">
      <PianoBar
        volume={volume}
        muted={muted}
        showKeyLetters={showKeyLetters}
        canLower={start > MIN_START}
        canHigher={start + 12 * oct < MAX_END}
        onVolume={setVolume}
        onMuted={setMuted}
        onShowKeyLetters={setShowKeyLetters}
        onShift={(d) => setStart(clampStart(start + 12 * d, oct))}
      />
      <div
        role="group"
        aria-label={he.piano.keyboard}
        className="relative h-40 w-full touch-none rounded-card border-x-8 border-b-8 border-ink bg-ink sm:h-48"
        onContextMenu={(e) => e.preventDefault()}
      >
        {keys.map((k) => (
          <PianoKey
            key={k.midi}
            layout={k}
            pressed={held.has(k.midi)}
            highlight={highlights[k.midi]}
            name={noteLabel(k.midi, { octave: true })}
            noteText={noteNames && noteLabel(k.midi, { naming: noteNames })}
            keyText={showKeyLetters ? keyLabelFor(k.midi, start) : undefined}
            marker={k.midi === MIDDLE_C}
            onDown={(id) => input.pointerDown(id, k.midi)}
            onEnter={(id) => input.pointerEnter(id, k.midi)}
          />
        ))}
      </div>
    </div>
  );
}
