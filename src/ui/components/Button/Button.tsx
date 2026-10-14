import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'pill';

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 select-none disabled:cursor-not-allowed disabled:opacity-40';

const VARIANT: Record<ButtonVariant, string> = {
  // One primary action per screen (D-79).
  primary: 'min-h-13 rounded-card bg-ink px-6 text-lg font-bold text-surface hover:bg-ink/90',
  secondary: 'rounded-card border border-line bg-transparent px-4 hover:bg-surface',
  pill: 'rounded-full bg-surface px-4 text-sm hover:bg-line/50',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  wide?: boolean;
}

export function Button({ variant = 'secondary', wide, className = '', type, ...rest }: Props) {
  return (
    <button
      type={type ?? 'button'}
      className={`${BASE} ${VARIANT[variant]} ${wide ? 'w-full' : ''} ${className}`}
      {...rest}
    />
  );
}
