import type { Clef, Midi } from '../../../engine';

/** Note colour on the staff; mirrors the piano key states (requirements §5). */
export type StaffTone = 'target' | 'correct' | 'wrong';

export interface StaffNote {
  midi: Midi;
  tone?: StaffTone;
  /** Hebrew name shown beside the note (HTML overlay, never in the SVG). */
  label?: string;
}

export interface StaffProps {
  notes: readonly StaffNote[];
  clef?: Clef;
}

/** Drawing geometry shared by drawStaff and the label overlay (SVG units). */
export const STAFF_WIDTH = 260;
export const STAFF_HEIGHT = 140;
/** Y of the bottom staff line; one diatonic step = half a line space. */
export const BOTTOM_LINE_Y = 90;
export const STEP_PX = 5;
