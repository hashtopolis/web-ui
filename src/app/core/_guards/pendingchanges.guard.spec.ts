import { EMPTY, of, throwError } from 'rxjs';

import { CanComponentDeactivate, PendingChangesGuard } from '@src/app/core/_guards/pendingchanges.guard';

describe('PendingChangesGuard', () => {
  let guard: PendingChangesGuard;

  beforeEach(() => {
    guard = new PendingChangesGuard();
  });

  it('allows components without a deactivation method', async () => {
    await expect(guard.canDeactivate({} as CanComponentDeactivate)).resolves.toBe(true);
  });

  it.each([true, false])('returns synchronous decision %s', async (decision) => {
    await expect(guard.canDeactivate({ canDeactivate: () => decision })).resolves.toBe(decision);
  });

  it.each([true, false])('returns promise decision %s', async (decision) => {
    await expect(guard.canDeactivate({ canDeactivate: () => Promise.resolve(decision) })).resolves.toBe(decision);
  });

  it('uses the first observable decision', async () => {
    await expect(guard.canDeactivate({ canDeactivate: () => of(false, true) })).resolves.toBe(false);
  });

  it('propagates rejected promises and observable errors', async () => {
    const error = new Error('failed');
    await expect(guard.canDeactivate({ canDeactivate: () => Promise.reject(error) })).rejects.toBe(error);
    await expect(guard.canDeactivate({ canDeactivate: () => throwError(() => error) })).rejects.toBe(error);
    await expect(guard.canDeactivate({ canDeactivate: () => EMPTY })).rejects.toThrow();
  });
});
