import { describe, expect, it } from 'vitest';
import { createPianoInput } from './pianoInput';
import type { NoteEvent } from './types';

function setup() {
  let clock = 0;
  const input = createPianoInput(() => clock);
  const events: NoteEvent[] = [];
  input.subscribe((e) => events.push(e));
  const target = new EventTarget();
  const detach = input.attachKeyboard(target);
  const key = (type: 'keydown' | 'keyup', code: string, init: KeyboardEventInit = {}) => {
    const e = new KeyboardEvent(type, { code, cancelable: true, ...init });
    target.dispatchEvent(e);
    return e;
  };
  const tick = (t: number) => (clock = t);
  return { input, events, target, detach, key, tick };
}

describe('PianoInput pointer', () => {
  it('stamps note on/off with the audio clock', () => {
    const { input, events, tick } = setup();
    tick(1.25);
    input.pointerDown(1, 60);
    tick(1.75);
    input.pointerUp(1);
    expect(events).toEqual([
      { midi: 60, on: true, t: 1.25 },
      { midi: 60, on: false, t: 1.75 },
    ]);
  });

  it('supports multi-touch chords', () => {
    const { input, events } = setup();
    input.pointerDown(1, 60);
    input.pointerDown(2, 64);
    input.pointerDown(3, 67);
    expect(input.held()).toEqual([60, 64, 67]);
    input.pointerUp(2);
    expect(input.held()).toEqual([60, 67]);
    expect(events.filter((e) => e.on)).toHaveLength(3);
  });

  it('slides between keys while pressed and ignores hover', () => {
    const { input, events } = setup();
    input.pointerEnter(1, 62);
    expect(events).toEqual([]);
    input.pointerDown(1, 60);
    input.pointerEnter(1, 62);
    expect(events.map((e) => [e.midi, e.on])).toEqual([
      [60, true],
      [60, false],
      [62, true],
    ]);
  });

  it('ignores unknown pointer up', () => {
    const { input, events } = setup();
    input.pointerUp(9);
    expect(events).toEqual([]);
  });
});

describe('PianoInput keyboard', () => {
  it('maps by physical code (layout-independent)', () => {
    const { events, key, tick } = setup();
    tick(2);
    const e = key('keydown', 'KeyA', { key: 'ש' });
    key('keydown', 'KeyW', { key: "'" });
    tick(3);
    key('keyup', 'KeyA', { key: 'ש' });
    expect(e.defaultPrevented).toBe(true);
    expect(events).toEqual([
      { midi: 60, on: true, t: 2 },
      { midi: 61, on: true, t: 2 },
      { midi: 60, on: false, t: 3 },
    ]);
  });

  it('ignores auto-repeat, modifiers, unmapped keys and typing in fields', () => {
    const { events, key, target } = setup();
    key('keydown', 'KeyS');
    key('keydown', 'KeyS', { repeat: true });
    key('keydown', 'KeyD', { ctrlKey: true });
    key('keydown', 'KeyZ');
    const field = document.createElement('input');
    const typed = new KeyboardEvent('keydown', { code: 'KeyF' });
    Object.defineProperty(typed, 'target', { value: field });
    target.dispatchEvent(typed);
    expect(events.map((e) => e.midi)).toEqual([62]);
  });

  it('releases the note that was pressed even if the base changed', () => {
    const { input, events, key } = setup();
    key('keydown', 'KeyA');
    input.setKeyboardBase(48);
    key('keyup', 'KeyA');
    key('keydown', 'KeyA');
    expect(events.map((e) => [e.midi, e.on])).toEqual([
      [60, true],
      [60, false],
      [48, true],
    ]);
  });

  it('keeps a note sounding while a pointer still holds it', () => {
    const { input, events, key } = setup();
    input.pointerDown(1, 60);
    key('keydown', 'KeyA');
    key('keyup', 'KeyA');
    expect(input.held()).toEqual([60]);
    input.pointerUp(1);
    expect(events.map((e) => e.on)).toEqual([true, false]);
  });

  it('releases everything on blur and stops after detach', () => {
    const { input, events, key, target, detach } = setup();
    key('keydown', 'KeyA');
    input.pointerDown(1, 64);
    target.dispatchEvent(new Event('blur'));
    expect(input.held()).toEqual([]);
    expect(events.filter((e) => !e.on).map((e) => e.midi)).toEqual([60, 64]);
    detach();
    key('keydown', 'KeyA');
    expect(events).toHaveLength(4);
  });
});
