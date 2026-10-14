import type { HintType } from '../../engine';
import type { Skill } from '../../content';
import { he } from '../../i18n/he';
import { Button } from '../components/Button';
import { HintMenu } from '../components/HintMenu';

interface Props {
  skill: Skill;
  short: string;
  explanation: string;
  onHint: (type: HintType) => void;
  /** Free demo button; shown outside ear exercises only (D-23). */
  onDemo?: () => void;
  disabled?: boolean;
}

export function HintBar({ skill, short, explanation, onHint, onDemo, disabled }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <HintMenu
        skill={skill}
        short={short}
        explanation={explanation}
        onUse={onHint}
        disabled={disabled}
      />
      {skill !== 'ear' && onDemo && (
        <Button variant="pill" disabled={disabled} onClick={onDemo}>
          {he.hints.demo}
        </Button>
      )}
    </div>
  );
}
