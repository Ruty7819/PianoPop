import { useEffect, useId, useRef, type ReactNode } from 'react';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Buttons row; the dialog never decides what they do. */
  actions?: ReactNode;
}

/** Modal on native <dialog>: focus trap, Esc to close, backdrop. */
export function Dialog({ open, title, onClose, children, actions }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    // jsdom has no showModal; fall back to the open attribute.
    if (open && !d.open) {
      if (d.showModal) d.showModal();
      else d.setAttribute('open', '');
    } else if (!open && d.open) {
      if (d.close) d.close();
      else d.removeAttribute('open');
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-card bg-surface p-6 text-ink backdrop:bg-ink/40"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <h2 id={titleId} className="mb-3 text-2xl">
        {title}
      </h2>
      <div className="text-muted">{children}</div>
      {actions && <div className="mt-6 flex flex-wrap gap-2">{actions}</div>}
    </dialog>
  );
}
