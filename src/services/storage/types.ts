import type { AttemptResult, CompletionSource, NoteNaming } from '../../engine';

/** User settings; same shape as `profiles.settings` (requirements §10). */
export interface Settings {
  noteNames: NoteNaming;
  /** Per-device tap latency in ms; null until calibrated or skipped (D-80). */
  latencyOffsetMs: number | null;
  showKeyLabels: boolean;
  explanationLength: 'short' | 'full';
}

export const DEFAULT_SETTINGS: Settings = {
  noteNames: 'solfege', // D-51
  latencyOffsetMs: null,
  showKeyLabels: true,
  explanationLength: 'full',
};

export interface StoredLesson {
  lessonId: string;
  source: CompletionSource;
  /** ISO timestamp. */
  completedAt: string;
}

export interface ProgressSnapshot {
  completedLessons: StoredLesson[];
  attempts: AttemptResult[];
  /** Active seconds per day key (Asia/Jerusalem, D-74). */
  activity: Record<string, number>;
  settings: Settings;
}

/** All user data for export (D-38). */
export interface ExportBundle extends ProgressSnapshot {
  version: 1;
  exportedAt: string;
}

/** Persistence contract; guest → LocalRepository, logged in → SupabaseRepository (architecture §6). */
export interface ProgressRepository {
  load(): Promise<ProgressSnapshot>;
  saveAttempt(a: AttemptResult): Promise<void>;
  completeLesson(id: string, source: CompletionSource): Promise<void>;
  addActiveSeconds(day: string, s: number): Promise<void>;
  saveSettings(s: Settings): Promise<void>;
  exportAll(): Promise<ExportBundle>;
  /** Clears progress (lessons, attempts, activity); settings are kept. */
  reset(): Promise<void>;
}
