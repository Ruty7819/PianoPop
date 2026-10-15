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
    <main className="mx-auto grid max-w-2xl gap-4 p-4">
      <h1 className="text-2xl font-bold">{he.course.title}</h1>
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
