import { Link, Navigate, useNavigate } from 'react-router';
import { getExercise, getLesson } from '../../content';
import { lessonNumber, needsStart, recommend } from '../../engine';
import { he } from '../../i18n/he';
import { useOnboardingStore } from '../../state';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useProgress } from '../hooks/useProgress';

/** `/`: "recommended next" as a suggestion the user may ignore (D-75, D-31). */
export function Home() {
  const navigate = useNavigate();
  const startSeen = useOnboardingStore((s) => s.startSeen);
  const { loaded, completed, attempts, course } = useProgress();
  if (!loaded) return <p className="p-6 text-muted">{he.course.loading}</p>;
  if (needsStart(startSeen, completed.size, attempts.length))
    return <Navigate to="/start" replace />;

  const rec = recommend(course, completed, attempts);
  const lesson = rec?.kind === 'lesson' ? getLesson(course, rec.lessonId) : undefined;
  const exercise = rec?.kind === 'exercise' ? getExercise(course, rec.exerciseId) : undefined;

  return (
    <main className="mx-auto grid max-w-2xl gap-6 p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold">{he.home.title}</h1>
        <p className="mt-2 text-lg text-muted">{he.home.subtitle}</p>
      </div>
      {rec && (
        <Card className="justify-items-center">
          <h2 className="text-sm text-muted">{he.home.recommended}</h2>
          {lesson && (
            <>
              <p className="text-xl font-bold">
                {he.course.lessonTitle(lessonNumber(course, lesson.id), lesson.title)}
              </p>
              <Button variant="primary" onClick={() => void navigate(`/lesson/${lesson.id}`)}>
                {he.home.continueLesson}
              </Button>
            </>
          )}
          {exercise && rec.kind === 'exercise' && (
            <>
              <p className="text-xl font-bold">{he.home.practiceSkill(he.skills[rec.skill])}</p>
              <Button
                variant="primary"
                onClick={() => void navigate(`/practice?exercise=${exercise.id}`)}
              >
                {he.home.toPractice}
              </Button>
            </>
          )}
          <p className="text-sm text-muted">{he.home.recommendNote}</p>
        </Card>
      )}
      <nav className="flex flex-wrap justify-center gap-4">
        <Link to="/course" className="font-bold underline">
          {he.course.toCourse}
        </Link>
        <Link to="/practice" className="font-bold underline">
          {he.home.toPracticeFree}
        </Link>
      </nav>
    </main>
  );
}
