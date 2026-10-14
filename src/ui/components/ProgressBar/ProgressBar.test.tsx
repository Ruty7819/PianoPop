import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('exposes progress values and clamps', () => {
    render(<ProgressBar value={12} max={10} label="p" />);
    const bar = screen.getByRole('progressbar', { name: 'p' });
    expect(bar).toHaveAttribute('aria-valuenow', '10');
    expect(bar).toHaveAttribute('aria-valuemax', '10');
  });

  it('renders one segment per step with done/current/todo', () => {
    const { container } = render(<ProgressBar value={2} max={6} label="s" steps />);
    const states = [...container.querySelectorAll('[data-step]')].map(
      (e) => (e as HTMLElement).dataset.step,
    );
    expect(states).toEqual(['done', 'done', 'current', 'todo', 'todo', 'todo']);
  });
});
