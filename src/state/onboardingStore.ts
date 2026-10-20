import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface OnboardingState {
  /** The first-visit screen was shown on this device (requirements §12). */
  startSeen: boolean;
  markStartSeen: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      startSeen: false,
      markStartSeen: () => set({ startSeen: true }),
    }),
    {
      name: 'pianopop-onboarding',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ startSeen: s.startSeen }),
    },
  ),
);
