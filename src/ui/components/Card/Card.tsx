import type { HTMLAttributes } from 'react';

/** Soft surface block (lesson card, summaries). */
export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`grid gap-3 rounded-card bg-surface p-4 ${className}`} {...rest} />;
}
