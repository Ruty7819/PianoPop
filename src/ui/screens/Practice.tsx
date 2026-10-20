import { Link, useNavigate, useSearchParams } from 'react-router';
import { lessonExercises } from '../../content';
import { lessonNumber, practiceExercises, practiceLessons } from '../../engine';
import { he } from '../../i18n/he';
import { audio } from '../../services/audio';
import { AudioGate } from '../components/AudioGate';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ContinueContext } from '../exercises/continueContext';
import { ExerciseView } from '../exercises/ExerciseView';
import { useProgress } from '../hooks/useProgress';

/** `/practice[?exercise=id]`: exercises of learned lessons only (D-48), chosen by the user (D-28). */
export function Practice() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { loaded, completed, course, recordAttempt } = useProgress();
  if (!loaded) return <p className="p-6 text-muted">{he.course.loading}</p>;

  const open = (id?: string) => void navigate(id ? `/practice?exercise=${id}` : '/practice');
  const wanted = params.get('exercise');
  const def = practiceExercises(course, completed).find((e) => e.id === wanted);
  const lessons = practiceLessons(course, completed);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{he.practice.title}</h1>
        {def && (
          <Button variant="pill" onClick={() => open()}>
            {he.practice.back}
          </Button>
        )}
      </header>
      {def ? (
        <AudioGate audio={audio}>
          <ContinueContext.Provider value={{ onContinue: () => open(), requirePass: false }}>
            <ExerciseView key={def.id} def={def} onDone={(r) => void recordAttempt(r)} />
          </ContinueContext.Provider>
        </AudioGate>
      ) : lessons.length === 0 ? (
        <Card>
          <p>{he.practice.empty}</p>
          <Link to="/course" className="font-bold underline">
            {he.course.toCourse}
          </Link>
        </Card>
      ) : (
        <>
          <p className="text-muted">{he.practice.pick}</p>
          {lessons.map((lesson) => (
            <Card key={lesson.id}>
              <h2 className="text-xl font-bold">
                {he.course.lessonTitle(lessonNumber(course, lesson.id), lesson.title)}
              </h2>
              <div className="flex flex-wrap gap-2">
                {lessonExercises(lesson).map((e) => (
                  <Button key={e.id} onClick={() => open(e.id)}>
                    {he.exerciseTypes[e.type]}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </>
      )}
    </main>
  );
}
