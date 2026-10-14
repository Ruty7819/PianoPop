import { Accidental, Formatter, Renderer, Stave, StaveNote } from 'vexflow/bravura';
import { spell, type Clef } from '../../../engine';
import { BOTTOM_LINE_Y, STAFF_HEIGHT, STAFF_WIDTH, type StaffNote } from './types';

const ACC = { [-1]: 'b', 0: '', 1: '#' } as const;

/**
 * Renders the staff into `el` (VexFlow, SVG). Everything is drawn in
 * currentColor so the theme and per-note tones come from CSS.
 * Returns each note head's x in SVG units.
 */
export function drawStaff(el: HTMLElement, notes: readonly StaffNote[], clef: Clef): number[] {
  el.replaceChildren();
  const renderer = new Renderer(el as HTMLDivElement, Renderer.Backends.SVG);
  renderer.resize(STAFF_WIDTH, STAFF_HEIGHT);
  const ctx = renderer.getContext();
  ctx.setFillStyle('currentColor');
  ctx.setStrokeStyle('currentColor');

  // Stave top line sits 4 spaces (40px) below y; bottom line 40px further.
  const stave = new Stave(0, BOTTOM_LINE_Y - 80, STAFF_WIDTH - 1);
  stave.addClef(clef).setContext(ctx).draw();

  const vfNotes = notes.map(({ midi }) => {
    const s = spell(midi);
    const n = new StaveNote({
      keys: [`${s.letter}${ACC[s.accidental]}/${s.octave}`],
      duration: 'w',
      clef,
    });
    if (s.accidental) n.addModifier(new Accidental(ACC[s.accidental]), 0);
    return n;
  });
  if (vfNotes.length) Formatter.FormatAndDraw(ctx, stave, vfNotes);

  const svg = el.querySelector('svg');
  if (svg) {
    svg.setAttribute('viewBox', `0 0 ${STAFF_WIDTH} ${STAFF_HEIGHT}`);
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('class', 'block h-auto w-full');
    svg.setAttribute('aria-hidden', 'true');
    svg.querySelectorAll('.vf-stavenote').forEach((g, i) => {
      const tone = notes[i]?.tone;
      if (tone) g.setAttribute('data-tone', tone);
    });
  }
  return vfNotes.map((n) => n.getAbsoluteX());
}
