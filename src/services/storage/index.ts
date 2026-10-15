// Public API of src/services/storage — see docs/architecture.md §6.
export type {
  Settings,
  StoredLesson,
  ProgressSnapshot,
  ExportBundle,
  ProgressRepository,
} from './types';
export { DEFAULT_SETTINGS } from './types';
export type { LocalRepositoryOptions } from './localRepository';
export { createLocalRepository, LOCAL_PROGRESS_KEY } from './localRepository';
