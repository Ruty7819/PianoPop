import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_SETTINGS, type Settings } from '../services/storage';
import { getDeps } from './deps';

export interface SettingsState extends Settings {
  update: (patch: Partial<Settings>) => void;
  setLatencyOffsetMs: (ms: number | null) => void;
  /** Apply settings loaded from the repository; this device's offset wins (D-80). */
  hydrate: (s: Settings) => void;
}

function pick(s: SettingsState): Settings {
  const { noteNames, latencyOffsetMs, showKeyLabels, explanationLength } = s;
  return { noteNames, latencyOffsetMs, showKeyLabels, explanationLength };
}

/** User settings; saved through the repository, latency offset also kept per device (D-80). */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      update: (patch) => {
        set(patch);
        void getDeps()
          .repository.saveSettings(pick(get()))
          .catch(() => undefined);
      },
      setLatencyOffsetMs: (latencyOffsetMs) => get().update({ latencyOffsetMs }),
      hydrate: (s) => set({ ...s, latencyOffsetMs: get().latencyOffsetMs ?? s.latencyOffsetMs }),
    }),
    {
      name: 'pianopop-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ latencyOffsetMs: s.latencyOffsetMs }),
    },
  ),
);
