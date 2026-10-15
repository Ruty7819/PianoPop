import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { isSummaryOpen, unitSummary } from '../../engine';
import { he } from '../../i18n/he';
import { audio } from '../../services/audio';
import { AudioGate } from '../components/AudioGate';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ContinueContext } from '../exercises/continueContext';
import { ExerciseView } from '../exercises/ExerciseView';
import { useProgress } from '../hooks/useProgress';

/** `/unit/:unitId/test`: assessment only, a fail never blocks (D-61). */
export function UnitTest() {
  const { unitId = '' } = useParams();
  const navigate = useNavigate();
  const { loaded, completed, attempts, course, recordAttempt } = useProgress();
  const [index, setIndex] = useState(0);
  if (!loaded) return <p className="p-6 text-muted">{he.course.loading}</p>;
  const unit = course.find((u) => u.id === unitId);
  if (!unit || !isSummaryOpen(unit, completed)) return <Navigate to="/course" replace />;

  const tests = unit.summaryTest;
  const def = tests[index];
  const toCourse = () => void navigate('/course');
  const score = unitSummary(unit, attempts).score;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{he.unitTest.title(unit.title)}</h1>
        {def && (
          <Button variant="pill" onClick={toCourse}>
            {he.lesson.exit}
          </Button>
        )}
      </header>
      <ProgressBar
        steps
        value={index}
        max={tests.length}
        label={he.unitTest.progress(Math.min(index + 1, tests.length), tests.length)}
      />
      {def ? (
        <AudioGate audio={audio}>
          <ContinueContext.Provider
            value={{ onContinue: () => setIndex(index + 1), requirePass: false }}
          >
            <ExerciseView key={def.id} def={def} onDone={(r) => void recordAttempt(r)} />
          </ContinueContext.Provider>
        </AudioGate>
      ) : (
        <Card className="justify-items-center text-center">
          <h2 className="text-2xl font-bold">{he.unitTest.resultTitle}</h2>
          {score !== null && <p className="text-xl">{he.unitTest.result(Math.round(score))}</p>}
          <p className="text-muted">{he.unitTest.note}</p>
          <Button variant="primary" onClick={toCourse}>
            {he.course.toCourse}
          </Button>
        </Card>
      )}
    </main>
  );
}
