import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  placementAnswer,
  placementCurrent,
  placementExit,
  placementItems,
  placementStart,
  type AttemptResult,
} from '../../engine';
import { he } from '../../i18n/he';
import { audio } from '../../services/audio';
import { useProgressStore } from '../../state';
import { AudioGate } from '../components/AudioGate';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ContinueContext } from '../exercises/continueContext';
import { ExerciseView } from '../exercises/ExerciseView';
import { useProgress } from '../hooks/useProgress';

/** `/placement`: one try per item, stops at the first fail, exit anytime (D-82). */
export function Placement() {
  const navigate = useNavigate();
  const { loaded, course, recordAttempt } = useProgress();
  const completeFromPlacement = useProgressStore((s) => s.completeFromPlacement);
  const [state, setState] = useState(() => placementStart(placementItems(course)));
  const [begun, setBegun] = useState(false);
  const last = useRef<AttemptResult | null>(null);
  if (!loaded) return <p className="p-6 text-muted">{he.course.loading}</p>;

  const item = placementCurrent(state);
  const total = state.items.length;
  const onDone = (r: AttemptResult) => {
    last.current = r;
    void recordAttempt(r);
  };
  const onContinue = () => {
    const passed = last.current?.passed ?? false;
    if (passed && item) void completeFromPlacement(item.completes);
    setState(placementAnswer(state, passed));
  };
  const toCourse = () => void navigate('/course');

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{he.placement.title}</h1>
        {item && begun && (
          <Button variant="pill" onClick={() => setState(placementExit(state))}>
            {he.placement.exit}
          </Button>
        )}
      </header>
      {!begun ? (
        <Card>
          <p className="text-lg">{he.placement.intro}</p>
          <Button variant="primary" onClick={() => setBegun(true)}>
            {he.placement.begin}
          </Button>
        </Card>
      ) : item ? (
        <>
          <ProgressBar
            steps
            value={state.index}
            max={total}
            label={he.placement.progress(state.index + 1, total)}
          />
          <AudioGate audio={audio}>
            <ContinueContext.Provider value={{ onContinue, requirePass: false, allowRetry: false }}>
              <ExerciseView key={item.exercise.id} def={item.exercise} onDone={onDone} />
            </ContinueContext.Provider>
          </AudioGate>
        </>
      ) : (
        <Card className="justify-items-center text-center">
          <h2 className="text-2xl font-bold">{he.placement.resultTitle}</h2>
          <p className="text-xl">{he.placement.result(state.completed.length)}</p>
          <Button variant="primary" onClick={toCourse}>
            {he.course.toCourse}
          </Button>
        </Card>
      )}
    </main>
  );
}
