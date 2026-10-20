import type { HTMLAttributes } from 'react';

/** White surface block with a soft border (lesson card, summaries). */
export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`grid gap-3 rounded-card border-2 border-line bg-surface p-5 ${className}`}
      {...rest}
    />
  );
}
