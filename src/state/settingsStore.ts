import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface SettingsState {
  /** Per-device tap latency in ms; null until calibrated or skipped (D-80). */
  latencyOffsetMs: number | null;
  setLatencyOffsetMs: (ms: number | null) => void;
}

/** Device settings, persisted in localStorage (D-80: offset is per device). */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      latencyOffsetMs: null,
      setLatencyOffsetMs: (latencyOffsetMs) => set({ latencyOffsetMs }),
    }),
    { name: 'pianopop-settings', storage: createJSONStorage(() => localStorage) },
  ),
);
