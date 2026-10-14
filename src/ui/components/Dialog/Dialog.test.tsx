import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('opens with a labelled title and closes on Esc (cancel)', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Dialog open title="כותרת" onClose={onClose} actions={<button>ok</button>}>
        גוף
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'כותרת' });
    expect(dialog).toHaveAttribute('open');
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(onClose).toHaveBeenCalledOnce();

    rerender(
      <Dialog open={false} title="כותרת" onClose={onClose}>
        גוף
      </Dialog>,
    );
    expect(dialog).not.toHaveAttribute('open');
  });
});
