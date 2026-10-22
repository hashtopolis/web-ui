/**
 * Resolves after `ms` milliseconds of timer time, giving everything already queued
 * (promises, RxJS work, earlier timers) the chance to run first.
 *
 *  - `await wait()` lets pending async work settle, e.g. a router navigation started by a click
 *  - `await wait(150)` lets real time pass, e.g. a cache TTL that reads `Date.now()`
 *
 * Under `vi.useFakeTimers()` this never resolves on its own; use
 * `await vi.advanceTimersByTimeAsync(ms)` there instead.
 */
export function wait(ms = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
