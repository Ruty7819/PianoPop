import { Link } from 'react-router';
import { courseMap, nextLesson } from '../../../engine';
import { he } from '../../../i18n/he';
import { useProgress } from '../../hooks/useProgress';
import { CourseUnit } from './CourseUnit';

/** `/course`: current + next unit open, the rest collapsed (D-79). */
export function CourseMap() {
  const { loaded, completed, attempts, course } = useProgress();
  if (!loaded) return <p className="p-6 text-muted">{he.course.loading}</p>;
  const primary = nextLesson(course, completed)?.id;

  return (
    <main className="mx-auto grid max-w-xl gap-5 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-3xl text-primary">{he.course.title}</h1>
        <Link to="/" className="rounded-2xl border-2 border-line bg-surface px-4 py-2 font-medium">
          {he.nav.home}
        </Link>
      </header>
      {courseMap(course, completed).map((item, i) => (
        <CourseUnit
          key={item.unit.id}
          item={item}
          number={i + 1}
          attempts={attempts}
          primaryLessonId={primary}
        />
      ))}
    </main>
  );
}
