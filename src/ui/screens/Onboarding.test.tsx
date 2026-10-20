import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { he } from '../../i18n/he';
import { routes } from '../../routes';
import { pianoInput } from '../../services/input';
import { createLocalRepository } from '../../services/storage';
import { setDeps, useOnboardingStore, useProgressStore } from '../../state';
import { attempt, fixtureCourse } from '../../test/courseFixture';

vi.mock('../../services/audio', async () =>
  (await import('../../test/fakeAudio')).fakeAudioModule(),
);

const press = (...midis: number[]) =>
  midis.forEach((m) =>
    act(() => {
      pianoInput.pointerDown(1, m);
      pianoInput.pointerUp(1);
    }),
  );
const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }));
const doneIds = () => useProgressStore.getState().completedLessons.map((l) => l.lessonId);

async function open(path: string, done: string[] = [], startSeen = true) {
  localStorage.clear();
  const repository = createLocalRepository();
  for (const id of done) await repository.completeLesson(id, 'normal');
  setDeps({ repository, course: fixtureCourse });
  useProgressStore.setState({ loaded: false });
  useOnboardingStore.setState({ startSeen });
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

beforeEach(() => localStorage.clear());

describe('first visit', () => {
  it('sends a new guest from home to /start, then offers lesson 1 or placement', async () => {
    const router = await open('/', [], false);
    await screen.findByRole('heading', { name: he.start.title });
    expect(router.state.location.pathname).toBe('/start');
    await waitFor(() => expect(useOnboardingStore.getState().startSeen).toBe(true));
    fireEvent.click(await screen.findByRole('button', { name: he.start.placement }));
    expect(router.state.location.pathname).toBe('/placement');
  });

  it('does not redirect a guest who has progress', async () => {
    await open('/', ['u1-l1'], false);
    expect(await screen.findByRole('heading', { name: he.home.title })).toBeVisible();
  });
});

describe('placement (D-82)', () => {
  it('marks passed items completed, stops at the first fail, no retry', async () => {
    await open('/placement');
    fireEvent.click(await screen.findByRole('button', { name: he.placement.begin }));
    press(60, 62);
    click(he.exercise.continue);
    press(61, 60, 62);
    expect(screen.queryByRole('button', { name: he.exercise.retry })).toBeNull();
    click(he.exercise.continue);
    expect(screen.getByText(he.placement.result(1))).toBeVisible();
    expect(doneIds()).toEqual(['u1-l1']);
    expect(useProgressStore.getState().completedLessons[0]?.source).toBe('placement');
  });

  it('keeps passes when leaving early', async () => {
    await open('/placement');
    fireEvent.click(await screen.findByRole('button', { name: he.placement.begin }));
    press(60, 62);
    click(he.exercise.continue);
    click(he.placement.exit);
    expect(screen.getByText(he.placement.result(1))).toBeVisible();
    expect(doneIds()).toEqual(['u1-l1']);
  });
});

describe('practice (D-48)', () => {
  it('lists learned lessons only', async () => {
    await open('/practice', ['u1-l1']);
    expect(await screen.findByText(he.course.lessonTitle(1, 'u1-l1'))).toBeVisible();
    expect(screen.queryByText(he.course.lessonTitle(2, 'u1-l2'))).toBeNull();
    expect(screen.getAllByRole('button', { name: he.exerciseTypes['press-key'] })).toHaveLength(2);
  });

  it('shows an empty note before any lesson is done', async () => {
    await open('/practice');
    expect(await screen.findByText(he.practice.empty)).toBeVisible();
  });

  it('refuses an exercise of a locked lesson', async () => {
    await open('/practice?exercise=u1-l2-e1', ['u1-l1']);
    expect(await screen.findByText(he.practice.pick)).toBeVisible();
  });

  it('runs a learned exercise and returns to the list', async () => {
    await open('/practice?exercise=u1-l1-e1', ['u1-l1']);
    await screen.findByRole('button', { name: he.practice.back });
    press(60, 62);
    click(he.exercise.continue);
    expect(screen.getByText(he.practice.pick)).toBeVisible();
    expect(useProgressStore.getState().attempts).toHaveLength(1);
  });
});

describe('home recommendation (D-75)', () => {
  it('suggests the next lesson', async () => {
    await open('/', ['u1-l1']);
    expect(await screen.findByText(he.course.lessonTitle(2, 'u1-l2'))).toBeVisible();
    expect(screen.getByRole('button', { name: he.home.continueLesson })).toBeVisible();
  });

  it('suggests the weakest skill once everything is done', async () => {
    localStorage.clear();
    const repository = createLocalRepository();
    for (const id of ['u1-l1', 'u1-l2', 'u1-l3', 'u2-l1'])
      await repository.completeLesson(id, 'normal');
    for (const [id, s] of [
      ['u1-l1-e1', 90],
      ['u1-l1-e2', 90],
      ['u1-l2-e1', 90],
      ['u1-l2-e2', 90],
      ['u2-l1-e1', 90],
      ['u1-l3-e1', 40],
    ] as const)
      await repository.saveAttempt(attempt(id, s));
    setDeps({ repository, course: fixtureCourse });
    useProgressStore.setState({ loaded: false });
    useOnboardingStore.setState({ startSeen: true });
    render(<RouterProvider router={createMemoryRouter(routes)} />);
    expect(await screen.findByText(he.home.practiceSkill(he.skills.rhythm))).toBeVisible();
  });
});
