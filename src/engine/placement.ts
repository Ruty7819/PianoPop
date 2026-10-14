import type { Course, PlacementItem } from '../content/types';

/** Placement run (D-82): items in increasing difficulty, stop at the first fail. */
export interface PlacementState {
  items: readonly PlacementItem[];
  index: number;
  /** Lesson ids to mark completed with source `placement`. */
  completed: string[];
  finished: boolean;
}

/** All units' placement items in course order — generic so later units join in. */
export function placementItems(course: Course): PlacementItem[] {
  return course.flatMap((u) => u.placement);
}

export function placementStart(items: readonly PlacementItem[]): PlacementState {
  return { items, index: 0, completed: [], finished: items.length === 0 };
}

export function placementCurrent(state: PlacementState): PlacementItem | undefined {
  return state.finished ? undefined : state.items[state.index];
}

/** A pass completes the item's lessons and moves on; a fail ends the test. */
export function placementAnswer(state: PlacementState, passed: boolean): PlacementState {
  const item = placementCurrent(state);
  if (!item) return state;
  if (!passed) return { ...state, finished: true };
  const index = state.index + 1;
  return {
    ...state,
    index,
    completed: [...state.completed, ...item.completes],
    finished: index >= state.items.length,
  };
}

/** The learner may leave at any time; passes so far are kept (D-82). */
export function placementExit(state: PlacementState): PlacementState {
  return { ...state, finished: true };
}
