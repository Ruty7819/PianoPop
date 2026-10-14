import type { ReactNode } from 'react';

export type FeedbackTone = 'neutral' | 'correct' | 'wrong';

const TONE_CLASS: Record<FeedbackTone, string> = {
  neutral: 'bg-slate-100 text-slate-900',
  correct: 'bg-green-100 text-green-900',
  wrong: 'bg-red-100 text-red-900',
};

/** Short visual feedback text, announced to screen readers (D-19). */
export function FeedbackBanner({ tone, children }: { tone: FeedbackTone; children: ReactNode }) {
  return (
    <p
      role="status"
      aria-live="polite"
      data-tone={tone}
      className={`min-h-11 rounded-lg px-4 py-2 text-lg ${TONE_CLASS[tone]}`}
    >
      {children}
    </p>
  );
}
