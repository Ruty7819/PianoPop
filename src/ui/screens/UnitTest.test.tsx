import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { he } from '../../i18n/he';
import { routes } from '../../routes';
import { pianoInput } from '../../services/input';
import { createLocalRepository } from '../../services/storage';
import { setDeps, useProgressStore } from '../../state';
import { fixtureCourse } from '../../test/courseFixture';

vi.mock('../../services/audio', async () =>
  (await import('../../test/fakeAudio')).fakeAudioModule(),
);

describe('UnitTest (D-61)', () => {
  it('lets a failed exercise continue and shows the unit score', async () => {
    localStorage.clear();
    const repository = createLocalRepository();
    for (const id of ['u1-l1', 'u1-l2', 'u1-l3']) await repository.completeLesson(id, 'normal');
    setDeps({ repository, course: fixtureCourse });
    useProgressStore.setState({ loaded: false });
    render(
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/unit/u1/test'] })} />,
    );
    await screen.findByRole('heading', { name: he.unitTest.title('יחידה 1') });
    for (const m of [61, 60, 62]) {
      act(() => {
        pianoInput.pointerDown(1, m);
        pianoInput.pointerUp(1);
      });
    }
    fireEvent.click(screen.getByRole('button', { name: he.exercise.continue }));
    expect(screen.getByRole('heading', { name: he.unitTest.resultTitle })).toBeVisible();
    expect(screen.getByText(he.unitTest.result(50))).toBeVisible();
  });
});
