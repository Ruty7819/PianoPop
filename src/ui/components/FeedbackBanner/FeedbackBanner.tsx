import type { ReactNode } from 'react';

export type FeedbackTone = 'neutral' | 'correct' | 'wrong';

const TONE_CLASS: Record<FeedbackTone, string> = {
  neutral: 'text-muted',
  correct: 'bg-mint-soft text-correct-text',
  wrong: 'bg-wrong/10 text-wrong-text',
};

/** Short visual feedback text, announced to screen readers (D-19). */
export function FeedbackBanner({ tone, children }: { tone: FeedbackTone; children: ReactNode }) {
  return (
    <p
      role="status"
      aria-live="polite"
      data-tone={tone}
      className={`inline-flex min-h-12 items-center justify-center self-center rounded-2xl px-6 text-xl font-bold ${TONE_CLASS[tone]}`}
    >
      {children}
    </p>
  );
}
