import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalRepository, DEFAULT_SETTINGS } from '../services/storage';
import { setDeps } from './deps';
import { useSettingsStore } from './settingsStore';

const repo = () => createLocalRepository();

beforeEach(() => {
  localStorage.clear();
  setDeps({ repository: repo() });
  useSettingsStore.setState({ ...DEFAULT_SETTINGS });
});

describe('settingsStore', () => {
  it('keeps the latency offset per device in localStorage (D-80)', () => {
    expect(useSettingsStore.getState().latencyOffsetMs).toBeNull();
    useSettingsStore.getState().setLatencyOffsetMs(120);
    expect(useSettingsStore.getState().latencyOffsetMs).toBe(120);
    expect(localStorage.getItem('pianopop-settings')).toContain('"latencyOffsetMs":120');
  });

  it('saves updates through the repository', async () => {
    useSettingsStore.getState().update({ noteNames: 'letters' });
    expect((await repo().load()).settings.noteNames).toBe('letters');
  });

  it('hydrate applies loaded settings but keeps this device offset', () => {
    useSettingsStore.setState({ latencyOffsetMs: 80 });
    useSettingsStore
      .getState()
      .hydrate({ ...DEFAULT_SETTINGS, latencyOffsetMs: 200, showKeyLabels: false });
    expect(useSettingsStore.getState().latencyOffsetMs).toBe(80);
    expect(useSettingsStore.getState().showKeyLabels).toBe(false);
  });

  it('hydrate uses the loaded offset when this device has none', () => {
    useSettingsStore.getState().hydrate({ ...DEFAULT_SETTINGS, latencyOffsetMs: 200 });
    expect(useSettingsStore.getState().latencyOffsetMs).toBe(200);
  });
});
