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
    globalServiceSpy.getAll.and.returnValue(of({ jsonapi: { version: '1.1', ext: [] }, data: [], included: [] }));

    TestBed.configureTestingModule({
      providers: [UIConfigService, { provide: GlobalService, useValue: globalServiceSpy }]
    });
    service = TestBed.inject(UIConfigService);
  });

  afterEach(() => {
    localStorage.removeItem('uis');
  });

  describe('checkStorage', () => {
    it('should not call storeDefault when valid data exists in localStorage', () => {
      const storeDefaultSpy = spyOn(service, 'storeDefault');
      const settings = makeUiSettings();
      localStorage.setItem<UiSettings>('uis', settings, uisSettingsSchema);

      service.checkStorage();

      expect(storeDefaultSpy).not.toHaveBeenCalled();
      expect(service.defaultSettings).toBeFalse();
    });

    it('should call storeDefault and set defaultSettings when no data exists', () => {
      const storeDefaultSpy = spyOn(service, 'storeDefault');
      localStorage.removeItem('uis');

      service.checkStorage();

      expect(storeDefaultSpy).toHaveBeenCalled();
      expect(service.defaultSettings).toBeTrue();
    });

    it('should self-heal and call storeDefault when data is corrupt', () => {
      const storeDefaultSpy = spyOn(service, 'storeDefault');
      // Write corrupt data directly bypassing schema validation
      // The typed localStorage will fail validation on read and remove the key
      window.localStorage.setItem('uis', '"not-a-valid-settings-object"');

      service.checkStorage();

      expect(storeDefaultSpy).toHaveBeenCalled();
      expect(service.defaultSettings).toBeTrue();
    });

    it('should write back migrated format to persist it', () => {
      spyOn(service, 'storeDefault');
      const settings = makeUiSettings({ chunktime: 999 });
      localStorage.setItem<UiSettings>('uis', settings, uisSettingsSchema);

      const setItemSpy = spyOn(localStorage, 'setItem').and.callThrough();

      service.checkStorage();

      // checkStorage reads + writes back to persist any migration
      expect(setItemSpy).toHaveBeenCalledWith('uis', jasmine.anything(), uisSettingsSchema);
    });
  });

  describe('getUISettings', () => {
    it('should return the correct value for an existing key', () => {
      const settings = makeUiSettings({ chunktime: 600, statustimer: 5 });
      localStorage.setItem<UiSettings>('uis', settings, uisSettingsSchema);

      expect(service.getUISettings()?.chunktime).toBe(600);
      expect(service.getUISettings()?.statustimer).toBe(5);
      expect(service.getUISettings()?.hashlistAlias).toBe('#HL#');
    });

    it('should return null when uis key is missing from localStorage', () => {
      localStorage.removeItem('uis');

      expect(service.getUISettings()).toBeNull();
    });
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
