// Public API of src/state — see docs/architecture.md §2.
export type { SettingsState } from './settingsStore';
export { useSettingsStore } from './settingsStore';
export type { ProgressState } from './progressStore';
export { useProgressStore, completedIds } from './progressStore';
export { getDeps, setDeps } from './deps';
export type { OnboardingState } from './onboardingStore';
export { useOnboardingStore } from './onboardingStore';
