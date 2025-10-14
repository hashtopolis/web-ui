import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AlertService } from '@services/shared/alert.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

const mockLocalStorageService = {
  getItem: jasmine.createSpy('getItem'),
  setItem: jasmine.createSpy('setItem')
};

/**
 * Unit tests for AutoRefreshService.
 */
describe('AutoRefreshService', () => {
  let service: AutoRefreshService;

  const refreshIntervalSeconds = 5; // 5 seconds for testing (virtual time for fakeAsync)
  const refreshIntervalMs = refreshIntervalSeconds * 1000;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AutoRefreshService,
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: AlertService, useValue: { showSuccessMessage: jasmine.createSpy() } }
      ]
    });
    service = TestBed.inject(AutoRefreshService);

    spyOn(service.uiSettings, 'getSetting').and.callFake(<T>(key: string) => {
      if (key === 'refreshInterval') return refreshIntervalSeconds as unknown as T;
      if (key === 'refreshPage') return true as unknown as T;
      return null as unknown as T;
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit refresh$ immediately when called startAutoRefresh with immediate=true', fakeAsync(() => {
    let emittedCount = 0;
    service.refresh$.subscribe(() => emittedCount++);
    service.startAutoRefresh({ immediate: true });

    tick(0); // Advance virtual time to trigger immediate emission
    expect(emittedCount).toBe(1); // first emission happens immediately

    tick(refreshIntervalMs - 1); // just before interval
    expect(emittedCount).toBe(1); // no second emission yet

    tick(2); // just after interval
    expect(emittedCount).toBe(2); // second emission

    service.stopAutoRefresh();

    tick(refreshIntervalMs); // another interval
    expect(emittedCount).toBe(2); // no more emissions after stop
  }));

  it('should emit refresh$ after the correct interval when called startAutoRefresh with immediate=false', fakeAsync(() => {
    let emittedCount = 0;
    service.refresh$.subscribe(() => emittedCount++);
    service.startAutoRefresh({ immediate: false });

    tick(0); // Advance virtual time
    expect(emittedCount).toBe(0); // nothing emitted yet

    tick(refreshIntervalMs - 1); // just before interval
    expect(emittedCount).toBe(0); // still nothing

    tick(2); // just after interval
    expect(emittedCount).toBe(1); // now emitted

    tick(refreshIntervalMs); // another interval
    expect(emittedCount).toBe(2); // second emission

    service.stopAutoRefresh();

    tick(refreshIntervalMs); // another interval
    expect(emittedCount).toBe(2); // no more emissions after stop
  }));

  it('toggleAutoRefresh should update settings, call AlertService, and start/stop refresh timer', fakeAsync(() => {
    // Spy on methods
    const updateSettings = spyOn(service.uiSettings, 'updateSettings');
    const showSucessMessage = TestBed.inject(AlertService).showSuccessMessage as jasmine.Spy;

    let emittedCount = 0;
    service.refresh$.subscribe(() => emittedCount++);

    // Toggle ON
    service.toggleAutoRefresh(true, { immediate: false });
    expect(updateSettings).toHaveBeenCalledWith({ refreshPage: true });
    expect(showSucessMessage).toHaveBeenCalledWith('Autoreload is enabled');

    tick(refreshIntervalMs - 1); // just before interval
    expect(emittedCount).toBe(0); // no emission yet

    tick(2); // just after interva
    expect(emittedCount).toBe(1); // first emission

    tick(refreshIntervalMs); // next interval
    expect(emittedCount).toBe(2); // second emission

    // Toggle OFF
    service.toggleAutoRefresh(false);
    expect(updateSettings).toHaveBeenCalledWith({ refreshPage: false });
    expect(showSucessMessage).toHaveBeenCalledWith('Autoreload is paused');

    tick(refreshIntervalMs); // next interval
    expect(emittedCount).toBe(2); // ensure no more emissions
  }));
});
