import { useCallback, useEffect, useRef } from 'react';
import type { ExerciseDef } from '../../content';
import type { AttemptResult } from '../../engine';
import { audio } from '../../services/audio';
import { pianoInput } from '../../services/input';
import { useSettingsStore } from '../../state';
import { CalibrationGate } from '../components/Calibration';
import { HigherLower } from './HigherLower';
import { PlaySequence } from './PlaySequence';
import { PressKey } from './PressKey';
import { ReadNote } from './ReadNote';
import { TapRhythm } from './TapRhythm';

interface Props {
  def: ExerciseDef;
  onDone: (result: AttemptResult) => void;
}

/** Stable callback, called once per result (exercises report from an effect). */
function useStableDone(onDone: Props['onDone']) {
  const latest = useRef(onDone);
  const last = useRef<AttemptResult | null>(null);
  useEffect(() => {
    latest.current = onDone;
  });
  return useCallback((r: AttemptResult) => {
    if (last.current === r) return;
    last.current = r;
    latest.current(r);
  }, []);
}

/** Renders any exercise type with the app's audio, input and note-name setting. */
export function ExerciseView(props: Props) {
  const { def } = props;
  const naming = useSettingsStore((s) => s.noteNames);
  const onDone = useStableDone(props.onDone);
  const common = { input: pianoInput, audio, onDone, naming };
  switch (def.type) {
    case 'press-key':
      return <PressKey def={def} {...common} />;
    case 'read-note':
      return <ReadNote def={def} {...common} />;
    case 'play-sequence':
      return <PlaySequence def={def} {...common} />;
    case 'higher-lower':
      return <HigherLower def={def} audio={audio} onDone={onDone} />;
    case 'tap-rhythm':
      return (
        <CalibrationGate audio={audio}>
          {(offset) => (
            <TapRhythm def={def} audio={audio} latencyOffsetMs={offset} onDone={onDone} />
          )}
        </CalibrationGate>
      );
  }
}
