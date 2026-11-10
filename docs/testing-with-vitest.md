# Writing unit tests with Vitest

For developers and agents who know the old Karma + Jasmine setup. It lists what replaces each Jasmine API, the patterns the suite uses now, and the pitfalls the migration ran into.

## What changed

|                    | Karma + Jasmine                                     | Now                                                                    |
| ------------------ | --------------------------------------------------- | ---------------------------------------------------------------------- |
| Runner             | Karma, headless Chrome (puppeteer)                  | Vitest 5 through `@angular/build:unit-test`                            |
| DOM                | Real browser                                        | jsdom: no layout, no canvas, no real rendering                         |
| Spies and matchers | `jasmine.*`, `spyOn`                                | `vi.*`, Vitest `expect`                                                |
| Async helpers      | `fakeAsync`, `tick`, `flush`, `done`                | `async` / `await`, Vitest fake timers                                  |
| Global setup       | `src/test.ts`, `karma.conf.js`, `jasmine.conf.json` | `src/test-setup.ts`, `src/test-providers.ts`, `vitest-base.config.mts` |

What stayed the same: specs are colocated as `*.spec.ts`, `describe` / `it` / `beforeEach` / `expect` are globals (no import), TestBed runs with zone change detection, the time zone is `Europe/Berlin`, and a test without an assertion fails.

## Running tests

```bash
npm test                                                   # whole suite, once, with coverage
npx ng test --watch=false                                  # whole suite, no coverage
npx ng test --watch=false --include src/app/home/home.component.spec.ts
npx ng test --watch=false --include <spec> --filter "should emit"   # only tests whose name matches the regex
npx ng test                                                # watch mode
npx ng test --watch=false --debug                          # attach a debugger (VS Code: "ng test" launch config)
```

Console output is shown only for failing tests (`silent: 'passed-only'`).

## Quick reference: Jasmine to Vitest

### Creating spies

| Jasmine                                           | Vitest                                                                                                |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `jasmine.createSpy('name')`                       | `vi.fn().mockName('name')`                                                                            |
| `jasmine.createSpyObj('Svc', ['a', 'b'])`         | `{ a: vi.fn().mockName('Svc.a'), b: vi.fn().mockName('Svc.b') } as MockedObject<Svc>`                 |
| `jasmine.createSpyObj('Svc', ['a'], { prop: 1 })` | add `prop: 1` to the same object literal                                                              |
| `jasmine.SpyObj<Svc>`                             | `MockedObject<Svc>` (`import type { MockedObject } from 'vitest'`)                                    |
| `jasmine.Spy`                                     | `Mock` (`import type { Mock } from 'vitest'`)                                                         |
| `spyOn(obj, 'method')`                            | `vi.spyOn(obj, 'method').mockReturnValue(undefined as never)`, or return a real value (see pitfall 1) |
| `spyOn(obj, 'method').and.callThrough()`          | `vi.spyOn(obj, 'method')`                                                                             |
| `spyOnProperty(obj, 'prop', 'get')`               | `vi.spyOn(obj, 'prop', 'get').mockReturnValue(x)` (without a value it calls the real getter)          |

### Configuring spies

| Jasmine                           | Vitest                                                                |
| --------------------------------- | --------------------------------------------------------------------- |
| `.and.returnValue(x)`             | `.mockReturnValue(x)`                                                 |
| `.and.returnValues(a, b)`         | `.mockReturnValueOnce(a).mockReturnValueOnce(b)` (see the note below) |
| `.and.callFake(fn)`               | `.mockImplementation(fn)`                                             |
| `.and.resolveTo(x)`               | `.mockResolvedValue(x)`                                               |
| `.and.rejectWith(e)`              | `.mockRejectedValue(e)`                                               |
| `.and.throwError(e)`              | `.mockImplementation(() => { throw e; })`                             |
| `.and.stub()`                     | `.mockReturnValue(undefined as never)`                                |
| `.withArgs(a).and.returnValue(x)` | `vi.when(spy).calledWith(a).thenReturn(x)`                            |
| `.calls.reset()`                  | `.mockClear()`                                                        |

Once the `...Once` values are used up, the mock falls back to its default implementation. For a `vi.spyOn` spy that is the real method, where Jasmine returned `undefined`. End the chain with `.mockReturnValue(...)` when more calls can follow.

### Inspecting calls

| Jasmine                                      | Vitest                                                          |
| -------------------------------------------- | --------------------------------------------------------------- |
| `.calls.mostRecent().args`                   | `.mock.lastCall`                                                |
| `.calls.argsFor(i)` / `.calls.all()[i].args` | `.mock.calls[i]`                                                |
| `.calls.count()`                             | `.mock.calls.length`, or assert with `toHaveBeenCalledTimes(n)` |
| `.calls.first().args`                        | `.mock.calls[0]`                                                |
| `.calls.allArgs()`                           | `.mock.calls`                                                   |

### Matchers

| Jasmine                                      | Vitest                                                                      |
| -------------------------------------------- | --------------------------------------------------------------------------- |
| `toBeTrue()` / `toBeFalse()`                 | `toBe(true)` / `toBe(false)`, never `toBeTruthy()` / `toBeFalsy()`          |
| `toHaveBeenCalledOnceWith(x)`                | `toHaveBeenCalledExactlyOnceWith(x)`, never plain `toHaveBeenCalledWith(x)` |
| `toContain(obj)` on an array of objects      | `toContainEqual(obj)` (see pitfall 4)                                       |
| `expect(x).withContext('msg')`               | `expect(x, 'msg')`                                                          |
| `jasmine.objectContaining(...)`              | `expect.objectContaining(...)`                                              |
| `jasmine.any(Type)` / `jasmine.anything()`   | `expect.any(Type)` / `expect.anything()`                                    |
| `jasmine.arrayContaining` / `stringMatching` | `expect.arrayContaining` / `expect.stringMatching`                          |
| `toEqual(x)`                                 | `toStrictEqual(x)`, always (see pitfall 14)                                 |
| `await expectAsync(p).toBeResolvedTo(x)`     | `await expect(p).resolves.toStrictEqual(x)`                                 |
| `await expectAsync(p).toBeRejectedWith(e)`   | `await expect(p).rejects.toThrow(e)`                                        |

Always `await` a `.resolves` / `.rejects` assertion; without it the test ends before the check runs. ESLint enforces this (`vitest/valid-expect`).

### Async and time

| Jasmine / zone.js                                 | Vitest                                                                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `it('...', (done) => { ...; done(); })`           | `it('...', async () => { ... })` and `await` the work                                                                          |
| `obs.subscribe((v) => { expect(v)...; done(); })` | `const v = await firstValueFrom(obs); expect(v)...`                                                                            |
| `fakeAsync(() => { ... })`                        | `async () => { ... }` with `vi.useFakeTimers()`                                                                                |
| `tick(ms)`                                        | `await vi.advanceTimersByTimeAsync(ms)`                                                                                        |
| `tick()`                                          | `await vi.advanceTimersByTimeAsync(0)`                                                                                         |
| `flush()`                                         | `await vi.runAllTimersAsync()`                                                                                                 |
| `flushMicrotasks()`                               | `await Promise.resolve()` (one turn) or `await fixture.whenStable()`; under fake timers `await vi.advanceTimersByTimeAsync(0)` |
| `discardPeriodicTasks()`                          | `vi.clearAllTimers()`                                                                                                          |
| `jasmine.clock().install()` / `.uninstall()`      | `vi.useFakeTimers()` / `vi.useRealTimers()`                                                                                    |
| `jasmine.clock().mockDate(d)`                     | `vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(d)`                                                                  |

`fakeAsync`, `tick` and `flush` do not work on this setup: a `fakeAsync` test fails with `Expected to be running in 'ProxyZone', but it was not found`. Do not import them.

## Patterns

### Mocking a service

Build an object of `vi.fn()`s, name each one (`mockName` makes failure messages readable), and cast to `MockedObject<T>` so both the service methods and the mock methods are typed.

```ts
import type { MockedObject } from 'vitest';

let gsSpy: MockedObject<GlobalService>;

beforeEach(() => {
  gsSpy = {
    get: vi.fn().mockName('GlobalService.get'),
    getAll: vi.fn().mockName('GlobalService.getAll')
  } as MockedObject<GlobalService>;
  gsSpy.getAll.mockReturnValue(of(mockResponse()));

  TestBed.configureTestingModule({
    providers: [{ provide: GlobalService, useValue: gsSpy }]
  });
});
```

Create mocks in `beforeEach`, so every test starts with fresh mocks. A mock that lives at module level keeps its configured return values across tests (see pitfall 2).

With a `MockedObject`, read calls directly; `vi.mocked(...)` is not needed:

```ts
const [, params] = gsSpy.getAll.mock.lastCall!;

expect((params as RequestParams).filter).toContainEqual(expect.objectContaining({ field: 'name', value: 'sha1' }));
```

### Returning a partial object from a typed mock

When the mocked method returns a big type and the code under test uses a small part of it, use `vi.mocked(fn, { partial: true })` instead of casting the return value:

```ts
vi.mocked(mockDialog.open, { partial: true }).mockReturnValue({
  afterClosed: () => afterClosedSubject.asObservable()
});
```

### Different return values per argument

```ts
vi.when(roleService.hasRole).calledWith('create').thenReturn(true);

// with a fallback for all other arguments
const getAll = vi.spyOn(mockService, 'getAll').mockReturnValue(undefined as never);
vi.when(getAll).calledWith(SERV.TASKS).thenReturn(of(taskValues));
```

### Asserting a single call

One matcher instead of two:

```ts
// not: toHaveBeenCalledTimes(1) + toHaveBeenCalledWith(...)
expect(mockGlobalService.delete).toHaveBeenCalledExactlyOnceWith(SERV.ACCESS_GROUPS, group.id);
expect(globalServiceSpy.get).toHaveBeenNthCalledWith(1, SERV.AGENTS, 1, expect.any(Object));
```

### Observables

`await` the value instead of asserting inside `subscribe`. An assertion in a `subscribe` callback that never runs is skipped without notice as soon as the test has any other assertion.

```ts
const links = await firstValueFrom(nameCol.routerLink!(agent));

expect(links[0].routerLink).toStrictEqual(['/agents', 'show-agents', 7, 'edit']);
```

Use `lastValueFrom` when the last emission matters.

### Waiting for async work: pick the lightest tool

Most tests need no timer control at all. In order of preference:

1. **Nothing.** `of(...)` mocks and `HttpTestingController.flush()` are synchronous. Call, then assert.
2. **`await fixture.whenStable()`** for a component whose template or forms have pending async work.
3. **`await wait()`** from `@src/app/testing/wait` when the code under test defers through a promise, a `setTimeout(0)` or a router navigation and no fixture is involved.
4. **Fake `Date` only** when the code just reads the clock (`Date.now()`, `new Date()`): cache TTLs, expiry checks, "today". Prefer this over letting real time pass with `await wait(150)`, which is slower; `http-cache.service.spec.ts` still does that.
5. **Full fake timers** only when the code schedules work with `setTimeout` / `setInterval` / RxJS `timer`, `interval`, `debounceTime` and the test has to control when it fires.

The migration first converted every `fakeAsync` to full fake timers, then removed most of them again because the code under test never needed them. Do not add fake timers "to be safe".

### Fake `Date` only

```ts
it('should remove data from local storage after expiration', () => {
  // Expiry is checked against Date.now(), so only the clock needs to be fake.
  vi.useFakeTimers({ toFake: ['Date'] });

  try {
    service.setItem(key, value, 1);

    vi.setSystemTime(Date.now() + 2);

    expect(service.getItem(key)).toBeNull();
  } finally {
    vi.useRealTimers();
  }
});
```

Pin the date the same way whenever a test depends on "today" (a test that builds `${year}-01-02` failed on 1 January until it was pinned).

### Full fake timers

Scope them to the tests that need them. If every test in a `describe` needs them, use hooks; if only one or two do, use `try` / `finally` inside the test as above.

```ts
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('should emit only once the interval has passed', async () => {
  let emittedCount = 0;
  service.refresh$.subscribe(() => emittedCount++);
  service.startAutoRefresh({ immediate: false });

  await vi.advanceTimersByTimeAsync(refreshIntervalMs - 1);
  const emittedBeforeInterval = emittedCount;
  await vi.advanceTimersByTimeAsync(1);

  expect(emittedBeforeInterval).toBe(0);
  expect(emittedCount).toBe(1);
});
```

Always use the `...Async` variants and `await` them. ESLint rejects `vi.advanceTimersByTime`, `vi.runAllTimers`, `vi.runOnlyPendingTimers` and `vi.advanceTimersToNextTimer` in specs: the sync variants do not flush promise and RxJS microtasks between timers, so the assertion can run before the work it checks.

After advancing time in a component test, call `fixture.detectChanges()` before asserting on the DOM.

A timing test is only worth something if it fails when the timing breaks. Check it once: change the delay in the production code, see the test fail, revert.

### HTTP

Unchanged: `provideHttpClient()`, `provideHttpClientTesting()`, `HttpTestingController`, and `httpMock.verify()` in `afterEach`.

To assert on a response, turn the request into a promise, flush it, then await the result:

```ts
const result = lastValueFrom(httpClient.get(testUrl));
httpMock.expectOne(testUrl).flush(freshData);

await expect(result).resolves.toStrictEqual(freshData);
```

Older HTTP specs assert inside `subscribe` and flush right after. That works because `flush()` runs the callback synchronously, but a callback that never runs goes unnoticed; use the form above in new tests.

### Components

- Unknown elements and properties are errors by default. A spec that renders a template without declaring or importing all its children adds `schemas: [NO_ERRORS_SCHEMA]` (or `CUSTOM_ELEMENTS_SCHEMA`). Prefer importing the real child or a stub when the test is about that child.
- Material overlays, dialogs and menus: add `provideDisabledMaterialAnimations()` from `@src/app/testing/material-animations`, so they open and close synchronously.
- If the component navigates, register the target route: `provideRouter([{ path: 'account/notifications', children: [] }])`. A navigation to an unknown route rejects, and a test that ends before it settles does not notice (see pitfall 6).
- API fixtures: `mockResponse`, `mockResource` and `mockValidResponse` from `@src/app/testing/mock-response`.

### Tests that only check "does not throw"

Every test must run at least one assertion (`expect.requireAssertions`, the replacement for Jasmine's `failSpecWithNoExpectations`). State the implicit check:

```ts
expect(() => {
  component.openDialog(config);
  fixture.detectChanges();
}).not.toThrow();
```

## Pitfalls

1. **`vi.spyOn` calls the real method.** Jasmine's `spyOn` replaced it with a stub returning `undefined`. A bare `vi.spyOn(console, 'error')` still prints; a bare `vi.spyOn(service, 'save')` still saves. Add a mock value or `.mockImplementation(...)` unless calling through is what you want.

   `.mockReturnValue(undefined)` only compiles for a `void` method. For a method with a return type write `.mockReturnValue(undefined as never)`, or return a real value. Specs are type-checked as one bundle: a single type error in any spec stops the whole run before a test starts.

2. **A shared `vi.fn()` keeps its configured behaviour between tests.** Vitest clears the call history of every mock before each test (`clearMocks`, on by default), and the global setup restores `vi.spyOn` spies after it. A `mockReturnValue` / `mockImplementation` set on a `vi.fn()` is not undone: on a mock object declared at module level or in `beforeAll`, a return value set in one test is still there in the next, in file order. Create mocks in `beforeEach`, or set the behaviour every test relies on in `beforeEach`.

   Within a test, calls made during setup count too (`ngOnInit`, the first `detectChanges()`). Call `.mockClear()` before the action when you assert on call counts or `not.toHaveBeenCalled()`.

3. **A failing `afterEach` skips the remaining `afterEach` hooks.** Jasmine ran them all. Hooks run last-registered first, so once one throws, the ones registered before it do not run. The global setup already restores real timers and resets TestBed after every test for this reason, so one failing `httpMock.verify()` does not break the following spec files. Your own cleanup that must always run belongs in `try` / `finally` or `onTestFinished(() => ...)`, not in a later `afterEach`.

4. **`toContain` compares by identity.** Jasmine's `toContain` used deep equality, so `expect(filters).toContain({ field: 'x' })` passed. In Vitest it fails; use `toContainEqual`. Asymmetric matchers need it as well: `toContainEqual(expect.objectContaining(...))`. `toContain` stays right for primitives and substrings.

5. **Fake timers and `wait()` do not mix.** Under `vi.useFakeTimers()`, `await wait()` and `await new Promise((r) => setTimeout(r))` never resolve and the test times out. Use `await vi.advanceTimersByTimeAsync(ms)` there.

6. **Errors after the test: some fail the run, some go unnoticed.** An error thrown in a timer or event callback after the test is reported by Vitest as an unhandled error and fails the run, even when every test passed. A rejected promise that nobody handles is caught by zone.js and only logged, which Vitest does not see. The global setup therefore records these and fails the test that was running with `Unhandled promise rejection during this test`.

   The guard only sees a rejection that settles while a test is still running. A synchronous test that starts a `router.navigate()` to an unregistered route (`NG04002`) and ends right away still passes: TestBed is torn down before the navigation fails. Register every route the code navigates to, `await` the promises the test starts, and stop timers and subscriptions before the test ends.

7. **jsdom is not a browser.** There is no layout: `offsetWidth`, `getBoundingClientRect()` and friends return `0`, nothing is ever visible or scrolled. `src/test-setup.ts` stubs the 2D canvas context (ECharts), `DataTransfer` (file uploads) and fixes `TextEncoder` output for `arraybuffer` responses. Assert on state, options and DOM structure, not on pixels or sizes.

   `matchMedia`, `ResizeObserver` and `IntersectionObserver` do not exist. App code that feature-detects them (`action-menu.component.ts`, `ht-table.component.ts`) takes its fallback branch in every test, without any notice. To test the other branch, stub the API in that spec with `vi.stubGlobal(...)` and call `vi.unstubAllGlobals()` in `onTestFinished`: globals are not unstubbed automatically. Do not add such a stub to `src/test-setup.ts`; it would switch the branch for every spec.

8. **All specs in a worker share one global context.** Anything you patch on a prototype, `window`, `navigator` or `document` without `vi.spyOn` stays patched for the following spec files. Use `vi.spyOn` (restored for you) or restore it yourself.

9. **Time zone.** Tests run with `TZ=Europe/Berlin`, locally and in CI. Date formatting expectations are written for that zone.

10. **Do not weaken assertions to get green.** No `toBeTruthy()` where `toBe(true)` is meant, no `toHaveBeenCalledWith` where the call count matters, no deleted `expect`. No `it.skip` without a comment saying why.

11. **`vi.mock()` does not work for app code.** The Angular builder makes `vi.mock` and its relatives throw for relative imports. Replace dependencies through Angular DI (`{ provide: X, useValue: mock }`) or `vi.spyOn`.

12. **`it.only` and `describe.only` are lint errors** (`vitest/no-focused-tests`), so a focused test cannot be committed by accident. Use `--include` and `--filter` to run a subset.

13. **Type imports.** `vi`, `describe`, `it`, `expect`, `beforeEach`, `onTestFinished` are globals. Types are not: `import type { Mock, MockedObject } from 'vitest'`, placed with the third-party imports.

14. **Use `toStrictEqual`, not `toEqual`.** Vitest's `toEqual` is looser than Jasmine's was: it ignores keys whose value is `undefined` and ignores the class, so `expect({ a: undefined }).toEqual({})` and `expect(new Point(1)).toEqual({ x: 1 })` both pass, and both failed in Jasmine. `toStrictEqual` checks both. The whole suite uses it and ESLint rejects `toEqual` in specs (`vitest/prefer-strict-equal`). To compare only part of an object, say so explicitly with `toStrictEqual(expect.objectContaining({ ... }))`.

## What the global setup does for you

| File                            | What it does                                                                                                                                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `vitest-base.config.mts`        | `TZ=Europe/Berlin`, `expect.requireAssertions`, console output only for failing tests                                                                                                                                                                        |
| `src/test-providers.ts`         | `provideZoneChangeDetection()` for every TestBed (TestBed would otherwise be zoneless, the app is not)                                                                                                                                                       |
| `src/test-setup.ts`             | Restores `vi.spyOn` spies, real timers and TestBed after each test; fails a test on an unhandled promise rejection; installs the typed `localStorage` / `sessionStorage` wrappers; loads the `optparse` globals; stubs canvas, `DataTransfer`, `TextEncoder` |
| `angular.json`, `build:testing` | Test-only polyfills and styles used by the `test` target                                                                                                                                                                                                     |

So in a spec you do not need `vi.restoreAllMocks()`, `TestBed.resetTestingModule()` or a safety-net `vi.useRealTimers()`. Still pair your own `vi.useFakeTimers()` with `vi.useRealTimers()`, so the reader sees where fake time ends.

## Checklist for a new spec

- [ ] Mocks are `vi.fn().mockName(...)` objects typed as `MockedObject<T>`, created in `beforeEach`.
- [ ] `vi.spyOn` has a mock value or implementation unless calling through is intended.
- [ ] Exact matchers: `toBe(true)`, `toHaveBeenCalledExactlyOnceWith`, `toContainEqual` for objects, `toStrictEqual` instead of `toEqual`.
- [ ] Observables are awaited with `firstValueFrom` / `lastValueFrom` instead of asserting inside `subscribe`; `.resolves` / `.rejects` assertions are awaited.
- [ ] No fake timers unless the code under test schedules work; fake only `Date` if it just reads the clock.
- [ ] Fake timers are advanced with awaited `...Async` calls and switched off again.
- [ ] Every test has at least one assertion.
- [ ] Nothing depends on layout, real rendering or the current date.
- [ ] Every route the code navigates to is registered, and no promise started by the test is left unawaited.
- [ ] `npx ng test --watch=false --include <spec>` passes on its own and in the full run, with no unhandled errors.
