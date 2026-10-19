import type { Mock } from 'vitest';

import { TestBed } from '@angular/core/testing';

import { AlertService } from '@services/shared/alert.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

const mockLocalStorageService = {
  getItem: vi.fn().mockName('getItem'),
  setItem: vi.fn().mockName('setItem')
};

/**
 * Unit tests for AutoRefreshService.
 */
describe('AutoRefreshService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let service: AutoRefreshService;

  const refreshIntervalSeconds = 5; // 5 seconds for testing (virtual time via fake timers)
  const refreshIntervalMs = refreshIntervalSeconds * 1000;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AutoRefreshService,
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: AlertService, useValue: { showSuccessMessage: vi.fn() } }
      ]
    });
    service = TestBed.inject(AutoRefreshService);

    vi.spyOn(service.uiSettings, 'getSetting').mockImplementation(<T>(key: string) => {
      if (key === 'refreshInterval') return refreshIntervalSeconds as unknown as T;
      if (key === 'refreshPage') return true as unknown as T;
      return null as unknown as T;
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit refresh$ immediately when called startAutoRefresh with immediate=true', async () => {
    let emittedCount = 0;
    service.refresh$.subscribe(() => emittedCount++);
    service.startAutoRefresh({ immediate: true });

    await vi.advanceTimersByTimeAsync(0); // Advance virtual time to trigger immediate emission
    expect(emittedCount).toBe(1); // first emission happens immediately

    await vi.advanceTimersByTimeAsync(refreshIntervalMs - 1); // just before interval
    expect(emittedCount).toBe(1); // no second emission yet

    await vi.advanceTimersByTimeAsync(2); // just after interval
    expect(emittedCount).toBe(2); // second emission

    service.stopAutoRefresh();

    await vi.advanceTimersByTimeAsync(refreshIntervalMs); // another interval
    expect(emittedCount).toBe(2); // no more emissions after stop
  });

  it('should emit refresh$ after the correct interval when called startAutoRefresh with immediate=false', async () => {
    let emittedCount = 0;
    service.refresh$.subscribe(() => emittedCount++);
    service.startAutoRefresh({ immediate: false });

    await vi.advanceTimersByTimeAsync(0); // Advance virtual time
    expect(emittedCount).toBe(0); // nothing emitted yet

    await vi.advanceTimersByTimeAsync(refreshIntervalMs - 1); // just before interval
    expect(emittedCount).toBe(0); // still nothing

    await vi.advanceTimersByTimeAsync(2); // just after interval
    expect(emittedCount).toBe(1); // now emitted

    await vi.advanceTimersByTimeAsync(refreshIntervalMs); // another interval
    expect(emittedCount).toBe(2); // second emission

    service.stopAutoRefresh();

    await vi.advanceTimersByTimeAsync(refreshIntervalMs); // another interval
    expect(emittedCount).toBe(2); // no more emissions after stop
  });

  it('toggleAutoRefresh should update settings, call AlertService, and start/stop refresh timer', async () => {
    // Spy on methods
    const updateSettings = vi.spyOn(service.uiSettings, 'updateSettings').mockReturnValue(undefined as never);
    const showSucessMessage = TestBed.inject(AlertService).showSuccessMessage as Mock;

    let emittedCount = 0;
    service.refresh$.subscribe(() => emittedCount++);

    // Toggle ON
    service.toggleAutoRefresh(true, { immediate: false });
    expect(updateSettings).toHaveBeenCalledWith({ refreshPage: true });
    expect(showSucessMessage).toHaveBeenCalledWith('Autoreload is enabled');

    await vi.advanceTimersByTimeAsync(refreshIntervalMs - 1); // just before interval
    expect(emittedCount).toBe(0); // no emission yet

    await vi.advanceTimersByTimeAsync(2); // just after interva
    expect(emittedCount).toBe(1); // first emission

    await vi.advanceTimersByTimeAsync(refreshIntervalMs); // next interval
    expect(emittedCount).toBe(2); // second emission

    // Toggle OFF
    service.toggleAutoRefresh(false);
    expect(updateSettings).toHaveBeenCalledWith({ refreshPage: false });
    expect(showSucessMessage).toHaveBeenCalledWith('Autoreload is paused');

    await vi.advanceTimersByTimeAsync(refreshIntervalMs); // next interval
    expect(emittedCount).toBe(2); // ensure no more emissions
  });
});
