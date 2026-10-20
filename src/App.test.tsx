import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { routes } from './routes';
import { he } from './i18n/he';
import { useOnboardingStore } from './state';

describe('App routing', () => {
  it('renders the Hebrew home screen', async () => {
    useOnboardingStore.setState({ startSeen: true });
    render(<RouterProvider router={createMemoryRouter(routes)} />);
    expect(await screen.findByRole('heading', { name: he.home.title })).toBeInTheDocument();
  });

  it('renders not-found for unknown paths', () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/x'] })} />);
    expect(screen.getByText(he.notFound)).toBeInTheDocument();
  });
});
