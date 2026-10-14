import { beforeEach, describe, expect, it } from 'vitest';
import { useSettingsStore } from './settingsStore';

beforeEach(() => useSettingsStore.setState({ latencyOffsetMs: null }));

describe('settingsStore', () => {
  it('stores the latency offset in localStorage', () => {
    expect(useSettingsStore.getState().latencyOffsetMs).toBeNull();
    useSettingsStore.getState().setLatencyOffsetMs(120);
    expect(useSettingsStore.getState().latencyOffsetMs).toBe(120);
    expect(localStorage.getItem('pianopop-settings')).toContain('"latencyOffsetMs":120');
  });
});
