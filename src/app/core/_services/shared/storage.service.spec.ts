import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

// Side-effect import: ensures window.localStorage is our typed wrapper.
import '@services/storage/local-storage';

import { UiSetting, uisSchema } from '@models/config-ui.schema';

import { GlobalService } from '@services/main.service';
import { UIConfigService } from '@services/shared/storage.service';

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
      const entries: UiSetting[] = [
        { name: '_timestamp', value: Date.now() - 100 * 60 * 60 * 1000 },
        { name: '_expiresin', value: 72 * 60 * 60 * 1000 }
      ];
      localStorage.setItem<UiSetting[]>('uis', entries, uisSchema);

      service.checkExpiry();

      expect(storeDefaultSpy).toHaveBeenCalled();
    });

    it('should not refresh when stored data is still fresh', () => {
      const storeDefaultSpy = spyOn(service, 'storeDefault');

      // Timestamp is now, expiry window is 72 hours → fresh
      const entries: UiSetting[] = [
        { name: '_timestamp', value: Date.now() },
        { name: '_expiresin', value: 72 * 60 * 60 * 1000 }
      ];
      localStorage.setItem<UiSetting[]>('uis', entries, uisSchema);

      service.checkExpiry();

      expect(storeDefaultSpy).not.toHaveBeenCalled();
    });
  });
});
