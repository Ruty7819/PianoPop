import { Link, Navigate, useNavigate } from 'react-router';
import { getExercise } from '../../content';
import { courseMap, needsStart, recommend } from '../../engine';
import { he } from '../../i18n/he';
import { useOnboardingStore } from '../../state';
import { Button } from '../components/Button';
import { useProgress } from '../hooks/useProgress';
import { LessonPath } from '../components/LessonPath';

/** `/`: current unit path + "recommended next" as a suggestion (D-75, D-31). */
export function Home() {
  const navigate = useNavigate();
  const startSeen = useOnboardingStore((s) => s.startSeen);
  const { loaded, completed, attempts, course } = useProgress();
  if (!loaded) return <p className="p-6 text-muted">{he.course.loading}</p>;
  if (needsStart(startSeen, completed.size, attempts.length))
    return <Navigate to="/start" replace />;

  const map = courseMap(course, completed);
  const unitIndex = Math.max(
    0,
    map.findIndex((m) => m.display === 'current'),
  );
  const item = map[unitIndex];
  const rec = recommend(course, completed, attempts);
  const exercise = rec?.kind === 'exercise' ? getExercise(course, rec.exerciseId) : undefined;
  const go = () => {
    if (rec?.kind === 'lesson') void navigate(`/lesson/${rec.lessonId}`);
    else if (exercise) void navigate(`/practice?exercise=${exercise.id}`);
  };

  return (
    <main className="mx-auto grid max-w-xl gap-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-display text-4xl text-primary">{he.appName}</span>
        <nav className="flex gap-2">
          <Link
            to="/course"
            className="rounded-2xl border-2 border-line bg-surface px-4 py-2 font-medium"
          >
            {he.course.title}
          </Link>
          <Link
            to="/practice"
            className="rounded-2xl border-2 border-line bg-surface px-4 py-2 font-medium"
          >
            {he.home.toPracticeFree}
          </Link>
        </nav>
      </header>
      <section className="grid gap-4 rounded-card border-2 border-line bg-surface p-5">
        <div>
          <h1 className="text-3xl">{he.home.title}</h1>
          <p className="text-muted">{he.home.subtitle}</p>
        </div>
        {item && (
          <>
            <h2 className="text-xl text-primary">
              {he.course.unitTitle(unitIndex + 1, item.unit.title)}
            </h2>
            <LessonPath item={item} />
          </>
        )}
        {rec && (
          <div className="grid gap-2">
            <p className="text-center text-sm text-muted">
              {he.home.recommended}
              {rec.kind === 'exercise' && ` · ${he.home.practiceSkill(he.skills[rec.skill])}`}
            </p>
            <Button variant="primary" wide onClick={go}>
              {rec.kind === 'lesson' ? he.home.continueLesson : he.home.toPractice}
            </Button>
            <p className="text-center text-sm text-muted">{he.home.recommendNote}</p>
          </div>
        )}
      </section>
    </main>
  );
}
