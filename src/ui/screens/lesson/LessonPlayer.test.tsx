import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { he } from '../../../i18n/he';
import { routes } from '../../../routes';
import { pianoInput } from '../../../services/input';
import { createLocalRepository } from '../../../services/storage';
import { setDeps, useProgressStore } from '../../../state';
import { fixtureCourse } from '../../../test/courseFixture';

vi.mock('../../../services/audio', async () =>
  (await import('../../../test/fakeAudio')).fakeAudioModule(),
);

const press = (...midis: number[]) =>
  midis.forEach((m) =>
    act(() => {
      pianoInput.pointerDown(1, m);
      pianoInput.pointerUp(1);
    }),
  );
const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }));

beforeEach(async () => {
  localStorage.clear();
  setDeps({ repository: createLocalRepository(), course: fixtureCourse });
  useProgressStore.setState({ loaded: false });
  const router = createMemoryRouter(routes, { initialEntries: ['/lesson/u1-l1'] });
  render(<RouterProvider router={router} />);
  await screen.findByText('הסבר');
});

describe('LessonPlayer', () => {
  it('runs explanation → exercises → done screen and completes the lesson (D-58)', async () => {
    click(he.lesson.next);
    press(60, 62);
    click(he.exercise.continue);
    press(60, 62);
    click(he.exercise.continue);
    expect(await screen.findByRole('heading', { name: he.lessonDone.title })).toBeVisible();
    expect(screen.getByRole('button', { name: he.lessonDone.nextLesson })).toBeVisible();
    expect(useProgressStore.getState().completedLessons.map((l) => l.lessonId)).toEqual(['u1-l1']);
  });

  it('blocks moving on after a failed exercise until it is passed', () => {
    click(he.lesson.next);
    press(61, 60, 62);
    expect(screen.getByText(he.exercise.failed, { exact: false })).toBeVisible();
    expect(screen.queryByRole('button', { name: he.exercise.continue })).toBeNull();
    click(he.exercise.retry);
    press(60, 62);
    expect(screen.getByRole('button', { name: he.exercise.continue })).toBeVisible();
  });
});
