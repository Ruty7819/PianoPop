import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { getLesson } from '../../../content';
import { canLeaveStep, canOpenLesson, skipToExercise } from '../../../engine';
import { he } from '../../../i18n/he';
import { audio } from '../../../services/audio';
import { AudioGate } from '../../components/AudioGate';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { ContinueContext } from '../../exercises/continueContext';
import { ExerciseView } from '../../exercises/ExerciseView';
import { useProgress } from '../../hooks/useProgress';
import { TextStep } from './TextStep';

/** `/lesson/:lessonId`: steps in order; exercises must be passed to move on (D-58). */
export function LessonPlayer() {
  const { lessonId = '' } = useParams();
  const navigate = useNavigate();
  const { loaded, completed, course, recordAttempt } = useProgress();
  const [index, setIndex] = useState(0);
  if (!loaded) return <p className="p-6 text-muted">{he.course.loading}</p>;
  const lesson = getLesson(course, lessonId);
  // D-9: locked lessons go back to the map.
  if (!lesson || !canOpenLesson(course, lessonId, completed)) {
    return <Navigate to="/course" replace />;
  }

  const { steps } = lesson;
  const step = steps[index];
  const goTo = (i: number) => {
    if (i >= steps.length) void navigate(`/lesson/${lesson.id}/done`);
    else setIndex(i);
  };
  const skipTo = skipToExercise(steps, index + 1);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        <Button variant="pill" onClick={() => void navigate('/course')}>
          {he.lesson.exit}
        </Button>
      </header>
      <ProgressBar
        steps
        value={index}
        max={steps.length}
        label={he.lesson.steps(index + 1, steps.length)}
      />
      <AudioGate audio={audio}>
        {step?.kind === 'explanation' || step?.kind === 'demo' ? (
          <TextStep
            key={index}
            text={step.text}
            notes={step.kind === 'demo' ? step.notes : undefined}
            onNext={() => goTo(index + 1)}
            onSkip={skipTo > index + 1 ? () => goTo(skipTo) : undefined}
          />
        ) : step ? (
          <ContinueContext.Provider
            value={{ onContinue: () => goTo(index + 1), requirePass: !canLeaveStep(step, false) }}
          >
            <ExerciseView
              key={step.exercise.id}
              def={step.exercise}
              onDone={(r) => void recordAttempt(r)}
            />
          </ContinueContext.Provider>
        ) : null}
      </AudioGate>
    </main>
  );
}
