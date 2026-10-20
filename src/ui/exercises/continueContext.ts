import { createContext, useContext } from 'react';

export interface ContinueOptions {
  onContinue: () => void;
  /** Lesson exercises need a pass to continue; the unit summary test does not (D-61). */
  requirePass: boolean;
  /** Placement counts the first try only (D-82); default true. */
  allowRetry?: boolean;
}

/** Set by a flow (lesson player, summary test) to show "המשיכו" on the exercise summary. */
export const ContinueContext = createContext<ContinueOptions | null>(null);

export const useContinue = () => useContext(ContinueContext);
