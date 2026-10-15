import { Navigate, useNavigate, useParams } from 'react-router';
import { getLesson, lessonExercises } from '../../../content';
import { isLessonComplete, latestAttempts, lessonDoneNext } from '../../../engine';
import { he } from '../../../i18n/he';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useProgress } from '../../hooks/useProgress';

/** `/lesson/:lessonId/done`: congrats, score per exercise, next step (approved 15.10.2026). */
export function LessonDone() {
  const { lessonId = '' } = useParams();
  const navigate = useNavigate();
  const { loaded, completed, attempts, course } = useProgress();
  if (!loaded) return <p className="p-6 text-muted">{he.course.loading}</p>;
  const lesson = getLesson(course, lessonId);
  if (!lesson) return <Navigate to="/course" replace />;
  if (!completed.has(lesson.id) && !isLessonComplete(lesson, attempts)) {
    return <Navigate to={`/lesson/${lesson.id}`} replace />;
  }

  const latest = latestAttempts(attempts);
  const next = lessonDoneNext(course, lesson.id);
  const nextPath =
    next.kind === 'lesson'
      ? `/lesson/${next.id}`
      : next.kind === 'summary'
        ? `/unit/${next.id}/test`
        : '/course';

  return (
    <main className="mx-auto grid max-w-2xl gap-4 p-4 text-center">
      <h1 className="text-3xl font-bold">{he.lessonDone.title}</h1>
      <p className="text-lg">{he.lessonDone.body(lesson.title)}</p>
      <Card>
        <ul className="grid gap-1">
          {lessonExercises(lesson).map((e, i) => {
            const a = latest.get(e.id);
            return a ? <li key={e.id}>{he.lessonDone.score(i + 1, Math.round(a.score))}</li> : null;
          })}
        </ul>
      </Card>
      <div className="flex flex-wrap justify-center gap-3">
        {next.kind !== 'course' && (
          <Button variant="primary" onClick={() => void navigate(nextPath)}>
            {next.kind === 'lesson' ? he.lessonDone.nextLesson : he.lessonDone.summary}
          </Button>
        )}
        <Button
          variant={next.kind === 'course' ? 'primary' : 'secondary'}
          onClick={() => void navigate('/course')}
        >
          {he.course.toCourse}
        </Button>
      </div>
    </main>
  );
}
