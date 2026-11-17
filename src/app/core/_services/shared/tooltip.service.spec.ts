import type { MockedObject } from 'vitest';

import { CookieService } from '@services/shared/cookies.service';
import { TooltipService } from '@services/shared/tooltip.service';

import { DEFAULT_CONFIG_TOOLTIP } from '@src/config/default/app/tooltip';

const tooltipLevels = [
  { cookieValue: '0', index: 0 },
  { cookieValue: '1', index: 1 },
  { cookieValue: '2', index: 2 }
] as const;

describe('TooltipService', () => {
  let service: TooltipService;
  let mockCookieService: MockedObject<CookieService>;

  beforeEach(() => {
    mockCookieService = {
      getCookie: vi.fn().mockName('CookieService.getCookie')
    } as MockedObject<CookieService>;
    service = new TooltipService(mockCookieService);
  });

  it('returns the tooltip level from the cookie service', () => {
    mockCookieService.getCookie.mockReturnValue('2');

    const result = service.getTooltipLevel();

    expect(result).toBe('2');
    expect(mockCookieService.getCookie).toHaveBeenCalledExactlyOnceWith('tooltip');
  });

  it.each(tooltipLevels)('returns task tooltips for level $index', ({ cookieValue, index }) => {
    mockCookieService.getCookie.mockReturnValue(cookieValue);

    const result = service.getTaskTooltips();

    expect(result).toStrictEqual(DEFAULT_CONFIG_TOOLTIP.tasks[index]);
    expect(mockCookieService.getCookie).toHaveBeenCalledExactlyOnceWith('tooltip');
  });

  it.each(tooltipLevels)('returns config tooltips for level $index', ({ cookieValue, index }) => {
    mockCookieService.getCookie.mockReturnValue(cookieValue);

    const result = service.getConfigTooltips();

    expect(result).toStrictEqual(DEFAULT_CONFIG_TOOLTIP.config[index]);
    expect(mockCookieService.getCookie).toHaveBeenCalledExactlyOnceWith('tooltip');
  });

  it('uses the concise tooltips when the cookie value is empty', () => {
    mockCookieService.getCookie.mockReturnValue('');

    const taskTooltips = service.getTaskTooltips();
    const configTooltips = service.getConfigTooltips();

    expect(taskTooltips).toStrictEqual(DEFAULT_CONFIG_TOOLTIP.tasks[0]);
    expect(configTooltips).toStrictEqual(DEFAULT_CONFIG_TOOLTIP.config[0]);
    expect(mockCookieService.getCookie).toHaveBeenCalledTimes(2);
  });
});
