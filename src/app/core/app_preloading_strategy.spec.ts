import { firstValueFrom, of, throwError } from 'rxjs';
import type { Mock } from 'vitest';

import { AppPreloadingStrategy } from '@src/app/core/app_preloading_strategy';

describe('AppPreloadingStrategy', () => {
  let load: Mock;

  beforeEach(() => {
    load = vi.fn().mockName('load').mockReturnValue(of('loaded'));
  });
  it('loads only routes marked for preload', async () => {
    const strategy = new AppPreloadingStrategy();
    await expect(firstValueFrom(strategy.preload({}, load))).resolves.toBeNull();
    expect(load).not.toHaveBeenCalled();
    await expect(firstValueFrom(strategy.preload({ data: { preload: true } }, load))).resolves.toBe('loaded');
    expect(load).toHaveBeenCalledExactlyOnceWith();
  });
  it('waits before loading delayed routes', async () => {
    vi.useFakeTimers();
    try {
      const result = firstValueFrom(
        new AppPreloadingStrategy().preload({ data: { preload: true, delay: true } }, load)
      );
      await vi.advanceTimersByTimeAsync(149);
      expect(load).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(1);
      await expect(result).resolves.toBe('loaded');
      expect(load).toHaveBeenCalledExactlyOnceWith();
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects invalid route data without loading', () => {
    expect(() => new AppPreloadingStrategy().preload({ data: { preload: 'yes' } }, load)).toThrow();
    expect(load).not.toHaveBeenCalled();
  });

  it('propagates loader errors', async () => {
    const error = new Error('load failed');
    load.mockReturnValue(throwError(() => error));
    await expect(firstValueFrom(new AppPreloadingStrategy().preload({ data: { preload: true } }, load))).rejects.toBe(
      error
    );
    expect(load).toHaveBeenCalledExactlyOnceWith();
  });
});
