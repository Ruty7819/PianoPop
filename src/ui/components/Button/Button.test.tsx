import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('defaults to type=button and keeps a 44px touch target', () => {
    render(<Button variant="primary">התחילו</Button>);
    const b = screen.getByRole('button', { name: 'התחילו' });
    expect(b).toHaveAttribute('type', 'button');
    expect(b.className).toContain('min-h-11');
  });
});
