import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { he } from '../../../i18n/he';
import { routes } from '../../../routes';
import { createLocalRepository } from '../../../services/storage';
import { setDeps, useProgressStore } from '../../../state';
import { fixtureCourse } from '../../../test/courseFixture';

vi.mock('../../../services/audio', async () =>
  (await import('../../../test/fakeAudio')).fakeAudioModule(),
);

async function open(path: string, done: string[] = []) {
  localStorage.clear();
  const repository = createLocalRepository();
  for (const id of done) await repository.completeLesson(id, 'normal');
  setDeps({ repository, course: fixtureCourse });
  useProgressStore.setState({ loaded: false });
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

beforeEach(() => localStorage.clear());

describe('CourseMap (D-79)', () => {
  it('shows done, current and locked lessons with one primary start button', async () => {
    await open('/course', ['u1-l1']);
    const items = await screen.findAllByRole('listitem');
    expect(items.map((li) => li.dataset.status)).toEqual(['done', 'current', 'locked', 'locked']);
    expect(screen.getAllByRole('button', { name: he.course.start })).toHaveLength(1);
    expect(screen.getByText(he.course.summaryLocked)).toBeInTheDocument();
  });

  it('opens the summary test once the unit is done', async () => {
    await open('/course', ['u1-l1', 'u1-l2', 'u1-l3']);
    expect(await screen.findByRole('button', { name: he.course.summaryStart })).toBeInTheDocument();
  });

  it.each(['/lesson/u1-l2', '/unit/u1/test', '/lesson/u1-l3/done'])(
    'sends locked %s back to the map',
    async (path) => {
      const router = await open(path);
      await screen.findByRole('heading', { name: he.course.title });
      expect(router.state.location.pathname).toBe('/course');
    },
  );
});
