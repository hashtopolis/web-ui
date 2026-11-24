import { ASC } from '@constants/agentsc.config';
import type { MockedObject } from 'vitest';

import { TestBed } from '@angular/core/testing';

import { UIConfigService } from '@services/shared/storage.service';

import { AgentSColorPipe } from '@src/app/core/_pipes/agentstat-color.pipe';

describe('AgentSColorPipe', () => {
  let pipe: AgentSColorPipe;
  let uiService: MockedObject<UIConfigService>;

  beforeEach(() => {
    uiService = {
      getUISettings: vi.fn().mockName('UIConfigService.getUISettings')
    } as MockedObject<UIConfigService>;

    TestBed.configureTestingModule({ providers: [{ provide: UIConfigService, useValue: uiService }] });
    pipe = TestBed.runInInjectionContext(() => new AgentSColorPipe());
  });

  it.each([false, 0])('returns no color for inactive status %s', (isActive: boolean | number) => {
    const color = pipe.transform('No data', 80, 40, ASC.GPU_UTIL, isActive, 0);

    expect(color).toBe('');
    expect(uiService.getUISettings).not.toHaveBeenCalled();
  });

  describe.each([ASC.GPU_UTIL, ASC.CPU_UTIL])('utilisation type %s', (statType) => {
    it.each([
      [81, 'var(--success)'],
      [80, 'var(--warning)'],
      [41, 'var(--warning)'],
      [40, 'color-mix(in oklch, var(--destructive), black 30%)'],
      [1, 'color-mix(in oklch, var(--destructive), black 30%)'],
      [0, 'var(--destructive)'],
      ['81', 'var(--success)'],
      ['0', 'var(--destructive)']
    ])('returns the expected color for value %s', (value: number | string, expected: string) => {
      const color = pipe.transform(value, 80, 40, statType, true, 0);

      expect(color).toBe(expected);
    });
  });

  describe('GPU temperature', () => {
    it.each([
      [1, 'var(--success)'],
      [60, 'var(--success)'],
      [61, 'var(--warning)'],
      [80, 'var(--warning)'],
      [81, 'color-mix(in oklch, var(--destructive), black 30%)'],
      [0, 'var(--destructive)'],
      ['60', 'var(--success)']
    ])('returns the expected color for value %s', (value: number | string, expected: string) => {
      const color = pipe.transform(value, 60, 80, ASC.GPU_TEMP, 1, 0);

      expect(color).toBe(expected);
    });
  });

  describe('missing data', () => {
    it.each([
      [true, 999, 'var(--info)'],
      [1, 999, 'var(--info)'],
      [true, 1000, 'var(--subtle-foreground)'],
      [true, 1001, 'var(--subtle-foreground)']
    ])(
      'uses the timeout for active status %s and elapsed time %s',
      (isActive: boolean | number, elapsed: number, expected: string) => {
        vi.useFakeTimers({ toFake: ['Date'] });
        try {
          vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
          vi.mocked(uiService.getUISettings, { partial: true }).mockReturnValue({ agenttimeout: 1000 });
          const lastActivity = Date.now() - elapsed;

          const color = pipe.transform('No data', 80, 40, ASC.GPU_UTIL, isActive, lastActivity);

          expect(color).toBe(expected);
        } finally {
          vi.useRealTimers();
        }
      }
    );

    it('uses a zero timeout when settings are unavailable', () => {
      uiService.getUISettings.mockReturnValue(null);
      const lastActivity = Date.now();

      const color = pipe.transform('No data', 80, 40, ASC.GPU_UTIL, true, lastActivity);

      expect(color).toBe('var(--subtle-foreground)');
    });
  });

  it('returns the error color for a nonnumeric value', () => {
    const color = pipe.transform('invalid', 80, 40, ASC.GPU_UTIL, true, 0);

    expect(color).toBe('color-mix(in oklch, var(--destructive), black 30%)');
  });

  it('returns the error color for an unknown stat type', () => {
    const color = pipe.transform(75, 80, 40, 999, true, 0);

    expect(color).toBe('color-mix(in oklch, var(--destructive), black 30%)');
  });
});
