import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'pill';

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 select-none font-bold motion-safe:transition-[transform,border-width] disabled:cursor-not-allowed disabled:opacity-40';

/** Chunky "pressable" buttons: thick bottom edge that flattens on press (direction C). */
const PRESS = 'active:translate-y-1 active:border-b-2 disabled:active:translate-y-0';

const VARIANT: Record<ButtonVariant, string> = {
  // One primary action per screen (D-79).
  primary: `min-h-13 rounded-2xl border-b-6 border-primary-dark bg-primary px-7 text-lg text-white hover:brightness-110 ${PRESS}`,
  secondary: `rounded-2xl border-2 border-b-5 border-line bg-surface px-5 text-ink hover:bg-canvas ${PRESS}`,
  pill: 'rounded-full border-2 border-line bg-surface px-4 text-sm text-muted hover:bg-canvas',
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
