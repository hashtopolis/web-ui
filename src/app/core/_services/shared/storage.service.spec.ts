import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

// Side-effect import: ensures window.localStorage is our typed wrapper.
import '@services/storage/local-storage';

import { UiSettings, uisSettingsSchema } from '@models/config-ui.schema';

import { GlobalService } from '@services/main.service';
import { UIConfigService } from '@services/shared/storage.service';

/** Helper to create a minimal valid UiSettings object for tests. */
function makeUiSettings(overrides: Partial<UiSettings> = {}): UiSettings {
  return {
    chunktime: 600,
    agentStatLimit: 0,
    agentStatTension: 0,
    agentTempThreshold1: 0,
    agentTempThreshold2: 0,
    agentUtilThreshold1: 0,
    agentUtilThreshold2: 0,
    statustimer: 5,
    agenttimeout: 0,
    maxSessionLength: 0,
    hashcatBrainEnable: 0,
    hashlistAlias: '#HL#',
    blacklistChars: '',
    _timestamp: Date.now(),
    _expiresin: 72 * 60 * 60 * 1000,
    ...overrides
  };
}

describe('UIConfigService', () => {
  let service: UIConfigService;

  beforeEach(() => {
    const globalServiceSpy = jasmine.createSpyObj('GlobalService', ['getAll']);
    globalServiceSpy.getAll.and.returnValue(of({ data: [], included: [] }));

    TestBed.configureTestingModule({
      providers: [UIConfigService, { provide: GlobalService, useValue: globalServiceSpy }]
    });
    service = TestBed.inject(UIConfigService);
  });

  afterEach(() => {
    localStorage.removeItem('uis');
  });

  describe('checkExpiry', () => {
    it('should refresh when stored data has expired', () => {
      const storeDefaultSpy = spyOn(service, 'storeDefault');

      // Timestamp 100 hours ago, expiry window is 72 hours → stale
      const settings = makeUiSettings({
        _timestamp: Date.now() - 100 * 60 * 60 * 1000,
        _expiresin: 72 * 60 * 60 * 1000
      });
      localStorage.setItem<UiSettings>('uis', settings, uisSettingsSchema);

      service.checkExpiry();

      expect(storeDefaultSpy).toHaveBeenCalled();
    });

    it('should not refresh when stored data is still fresh', () => {
      const storeDefaultSpy = spyOn(service, 'storeDefault');

      // Timestamp is now, expiry window is 72 hours → fresh
      const settings = makeUiSettings({
        _timestamp: Date.now(),
        _expiresin: 72 * 60 * 60 * 1000
      });
      localStorage.setItem<UiSettings>('uis', settings, uisSettingsSchema);

      service.checkExpiry();

      expect(storeDefaultSpy).not.toHaveBeenCalled();
    });
  });
});
