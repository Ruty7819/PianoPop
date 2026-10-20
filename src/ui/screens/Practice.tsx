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
import { ExerciseTile } from './practice/ExerciseTile';

const NAV = 'rounded-2xl border-2 border-line bg-surface px-4 py-2 font-medium';

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

  if (def) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
        <header className="flex items-center justify-between gap-3">
          <h1 className="text-2xl">{he.exerciseTypes[def.type]}</h1>
          <Button variant="pill" onClick={() => open()}>
            {he.practice.back}
          </Button>
        </header>
        <AudioGate audio={audio}>
          <ContinueContext.Provider value={{ onContinue: () => open(), requirePass: false }}>
            <ExerciseView key={def.id} def={def} onDone={(r) => void recordAttempt(r)} />
          </ContinueContext.Provider>
        </AudioGate>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-xl gap-5 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-3xl text-primary">{he.practice.title}</h1>
        <Link to="/" className={NAV}>
          {he.nav.home}
        </Link>
      </header>
      {lessons.length === 0 ? (
        <Card className="justify-items-center text-center">
          <p className="text-lg">{he.practice.empty}</p>
          <Button variant="primary" onClick={() => void navigate('/course')}>
            {he.course.toCourse}
          </Button>
        </Card>
      ) : (
        <>
          <p className="text-muted">{he.practice.pick}</p>
          {lessons.map((lesson) => (
            <Card key={lesson.id}>
              <h2 className="text-xl">
                {he.course.lessonTitle(lessonNumber(course, lesson.id), lesson.title)}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {lessonExercises(lesson).map((e) => (
                  <ExerciseTile key={e.id} type={e.type} onClick={() => open(e.id)} />
                ))}
              </div>
            </Card>
          ))}
        </>
      )}
    </main>
  );
}
