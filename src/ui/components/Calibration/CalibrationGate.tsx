import type { ReactNode } from 'react';
import type { AudioService } from '../../../services/audio';
import { useSettingsStore } from '../../../state';
import { CalibrationWizard } from './CalibrationWizard';

/** Opens the wizard before a rhythm exercise until an offset is stored (approved 14.10.2026). */
export function CalibrationGate({
  audio,
  children,
}: {
  audio: Pick<AudioService, 'click' | 'now'>;
  children: (latencyOffsetMs: number) => ReactNode;
}) {
  const offset = useSettingsStore((s) => s.latencyOffsetMs);
  const setOffset = useSettingsStore((s) => s.setLatencyOffsetMs);
  if (offset === null) return <CalibrationWizard audio={audio} onDone={setOffset} />;
  return children(offset);
}
