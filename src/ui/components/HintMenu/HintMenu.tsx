import { useState } from 'react';
import { hintMenuTypes, type HintType } from '../../../engine';
import type { Skill } from '../../../content';
import { he } from '../../../i18n/he';
import { Button } from '../Button';
import { Dialog } from '../Dialog';

interface Props {
  skill: Skill;
  short: string;
  explanation: string;
  /** Called on every pick; the exercise counts it and runs the replay. */
  onUse: (type: HintType) => void;
  disabled?: boolean;
}

/** Hints only on request (D-25); the learner picks the type (D-22, D-23). */
export function HintMenu({ skill, short, explanation, onUse, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<HintType | null>(null);
  const close = () => {
    setOpen(false);
    setShown(null);
  };
  const pick = (type: HintType) => {
    onUse(type);
    if (type === 'replay-demo') close();
    else setShown(type);
  };

  return (
    <>
      <Button variant="pill" disabled={disabled} onClick={() => setOpen(true)}>
        {he.hints.open}
      </Button>
      <Dialog
        open={open}
        title={shown ? he.hints.types[shown] : he.hints.title}
        onClose={close}
        actions={
          <>
            {shown && <Button onClick={() => setShown(null)}>{he.hints.back}</Button>}
            <Button onClick={close}>{he.hints.close}</Button>
          </>
        }
      >
        {shown ? (
          <p className="text-lg text-ink">{shown === 'short-hint' ? short : explanation}</p>
        ) : (
          <div className="flex flex-col gap-2">
            <p>{he.hints.penalty}</p>
            {hintMenuTypes(skill).map((t) => (
              <Button key={t} wide onClick={() => pick(t)}>
                {he.hints.types[t]}
              </Button>
            ))}
          </div>
        )}
      </Dialog>
    </>
  );
}
