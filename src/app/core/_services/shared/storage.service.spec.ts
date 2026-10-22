import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

// Side-effect import: ensures window.localStorage is our typed wrapper.
import '@services/storage/local-storage';

import { UiSettings, uisSettingsSchema } from '@models/config-ui.schema';

import { GlobalService } from '@services/main.service';
import { UIConfigService } from '@services/shared/storage.service';

import { mockResponse } from '@src/app/testing/mock-response';

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
    hideImportMasks: 1,
    defaultBenchmark: 1,
    _timestamp: Date.now(),
    _expiresin: 72 * 60 * 60 * 1000,
    ...overrides
  };
}

describe('UIConfigService', () => {
  let service: UIConfigService;

  beforeEach(() => {
    const globalServiceSpy = {
      ghelper: vi.fn().mockName('GlobalService.ghelper')
    };
    globalServiceSpy.ghelper.mockReturnValue(of(mockResponse()));

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
      const storeDefaultSpy = vi.spyOn(service, 'storeDefault').mockReturnValue(undefined);
      const settings = makeUiSettings();
      localStorage.setItem<UiSettings>('uis', settings, uisSettingsSchema);

      service.checkStorage();

      expect(storeDefaultSpy).not.toHaveBeenCalled();
      expect(service.defaultSettings).toBe(false);
    });

    it('should call storeDefault and set defaultSettings when no data exists', () => {
      const storeDefaultSpy = vi.spyOn(service, 'storeDefault').mockReturnValue(undefined);
      localStorage.removeItem('uis');

      service.checkStorage();

      expect(storeDefaultSpy).toHaveBeenCalled();
      expect(service.defaultSettings).toBe(true);
    });

    it('should self-heal and call storeDefault when data is corrupt', () => {
      const storeDefaultSpy = vi.spyOn(service, 'storeDefault').mockReturnValue(undefined);
      // Write corrupt data directly bypassing schema validation
      // The typed localStorage will fail validation on read and remove the key
      window.localStorage.setItem('uis', '"not-a-valid-settings-object"');

      service.checkStorage();

      expect(storeDefaultSpy).toHaveBeenCalled();
      expect(service.defaultSettings).toBe(true);
    });

    it('should write back migrated format to persist it', () => {
      vi.spyOn(service, 'storeDefault').mockReturnValue(undefined);
      const settings = makeUiSettings({ chunktime: 999 });
      localStorage.setItem<UiSettings>('uis', settings, uisSettingsSchema);

      const setItemSpy = vi.spyOn(localStorage, 'setItem');

      service.checkStorage();

      // checkStorage reads + writes back to persist any migration
      expect(setItemSpy).toHaveBeenCalledWith('uis', expect.anything(), uisSettingsSchema);
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
      const storeDefaultSpy = vi.spyOn(service, 'storeDefault').mockReturnValue(undefined);

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
      const storeDefaultSpy = vi.spyOn(service, 'storeDefault').mockReturnValue(undefined);

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
