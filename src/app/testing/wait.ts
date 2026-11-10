/**
 * Resolves after `ms` milliseconds of timer time, giving everything already queued
 * (promises, RxJS work, earlier timers) the chance to run first.
 *
 *  - `await wait()` lets pending async work settle, e.g. a router navigation started by a click
 *  - `await wait(150)` lets real time pass. Avoid it in new tests: when the code only reads the
 *    clock (a cache TTL, an expiry check), fake `Date` and move it with `vi.setSystemTime()`
 *    instead, which costs no real time
 *
 * Under `vi.useFakeTimers()` this never resolves on its own; use
 * `await vi.advanceTimersByTimeAsync(ms)` there instead.
 */
export function wait(ms = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
