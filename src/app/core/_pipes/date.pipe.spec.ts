import type { MockedObject } from 'vitest';

import { TestBed } from '@angular/core/testing';

import { UiSettingsService } from '@services/shared/ui-settings.service';

import { uiDatePipe } from '@src/app/core/_pipes/date.pipe';
import { TimePrecision } from '@src/app/shared/utils/datetime';

describe('uiDatePipe', () => {
  let pipe: uiDatePipe;
  let uiSettings: MockedObject<UiSettingsService>;

  beforeEach(() => {
    uiSettings = {
      getDateTimeFormat: vi.fn().mockName('UiSettingsService.getDateTimeFormat').mockReturnValue('dd.MM.yyyy HH:mm:ss')
    } as unknown as MockedObject<UiSettingsService>;

    TestBed.configureTestingModule({ providers: [{ provide: UiSettingsService, useValue: uiSettings }] });
    pipe = TestBed.runInInjectionContext(() => new uiDatePipe());
  });

  it.each([1694866300, '1694866300'])('formats a Unix timestamp with the configured format: %s', (epoch) => {
    const result = pipe.transform(epoch);

    expect(result).toBe('16.09.2023 14:11:40');
    expect(uiSettings.getDateTimeFormat).toHaveBeenCalledExactlyOnceWith(TimePrecision.SECONDS);
  });

  it('uses the current date and time format for each transformation', () => {
    uiSettings.getDateTimeFormat.mockReturnValueOnce('yyyy-MM-dd h:mm:ss a').mockReturnValueOnce('dd.MM.yyyy HH:mm:ss');

    const first = pipe.transform(1694866300);
    const second = pipe.transform(1694866300);

    expect(first).toBe('2023-09-16 2:11:40 PM');
    expect(second).toBe('16.09.2023 14:11:40');
    expect(uiSettings.getDateTimeFormat).toHaveBeenCalledTimes(2);
    expect(uiSettings.getDateTimeFormat).toHaveBeenNthCalledWith(1, TimePrecision.SECONDS);
    expect(uiSettings.getDateTimeFormat).toHaveBeenNthCalledWith(2, TimePrecision.SECONDS);
  });

  it.each([null, undefined])('returns null for a missing timestamp: %s', (epoch) => {
    const result = pipe.transform(epoch);

    expect(result).toBeNull();
    expect(uiSettings.getDateTimeFormat).not.toHaveBeenCalled();
  });

  it.each([0, '', 'not a timestamp', NaN, Infinity, new Date(NaN)])(
    'returns N/A for an unusable timestamp: %s',
    (epoch) => {
      const result = pipe.transform(epoch);

      expect(result).toBe('N/A');
      expect(uiSettings.getDateTimeFormat).toHaveBeenCalledExactlyOnceWith(TimePrecision.SECONDS);
    }
  );

  it('treats a Date value as its numeric millisecond value before formatting', () => {
    const epoch = new Date(1694866300);

    const result = pipe.transform(epoch);

    expect(result).toBe('16.09.2023 14:11:40');
    expect(uiSettings.getDateTimeFormat).toHaveBeenCalledExactlyOnceWith(TimePrecision.SECONDS);
  });
});
