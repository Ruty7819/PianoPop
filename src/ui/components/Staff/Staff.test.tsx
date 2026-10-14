import { render, screen, waitFor } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { he } from '../../../i18n/he';
import { Staff } from './Staff';

// jsdom has no canvas; VexFlow only uses it to measure text and copes with null.
beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

describe('Staff', () => {
  it('draws an LTR staff with tone attribute and label overlay', async () => {
    const { container } = render(<Staff notes={[{ midi: 64, tone: 'correct', label: 'מי' }]} />);
    const staff = screen.getByRole('img', { name: he.staff.label });
    expect(staff).toHaveAttribute('dir', 'ltr');
    await waitFor(() => expect(container.querySelector('svg')).toBeInTheDocument());
    expect(container.querySelector('[data-tone="correct"]')).toBeInTheDocument();
    expect(await screen.findByText('מי')).toHaveAttribute('data-label-for', '64');
  });

  it('shows no label when none is given', async () => {
    const { container } = render(<Staff notes={[{ midi: 67 }]} />);
    await waitFor(() => expect(container.querySelector('svg')).toBeInTheDocument());
    expect(container.querySelector('[data-label-for]')).toBeNull();
  });
});
