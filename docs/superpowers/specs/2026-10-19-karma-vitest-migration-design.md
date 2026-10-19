# Karma to Vitest migration

Branch `karma-vitest-migration`, based on `angular-22-update`.

## Why

Karma is deprecated. Angular 22 uses Vitest with a simulated DOM (jsdom) as its default unit test setup through the `@angular/build:unit-test` builder. The web-ui still runs its unit tests on Karma, Jasmine and a puppeteer-provided headless Chrome. This branch moves the existing suite to the Angular 22 default.

## Done means

- `ng test` runs on `@angular/build:unit-test` with Vitest and jsdom.
- The same tests pass as on Karma. Before anything changes, the branch records a Karma baseline (spec files, test count, all green) and the Vitest run must match it.
- No Karma or Jasmine dependency is left: `karma`, `karma-*`, `jasmine-core`, `@types/jasmine` and `puppeteer` are removed from `package.json`, and `karma.conf.js`, `jasmine.conf.json` and `src/test.ts` are deleted.
- `npm test`, `npm run test:ci` and the CI workflow work on Vitest, and CI still uploads a coverage report.

## Goals

- Replace the runner and the assertion/spy library (Jasmine to Vitest `vi` / `expect`).
- Keep test behaviour identical where the old setup defined it (see "Carry over from Karma").
- Replace zone.js test helpers (`fakeAsync`, `tick`, `flush`, `flushMicrotasks`, `discardPeriodicTasks`) with native `async` / `await` and Vitest fake timers (`vi.useFakeTimers()`, `vi.advanceTimersByTime()`, `vi.runAllTimers()` and so on), and `jasmine.clock` likewise. No spec imports `zone.js/testing` afterwards.

## Non-goals

- Upgrading `zone.js` (a production dependency, `~0.15.0`). The `zone.js/plugins/vitest-patch` that would keep `fakeAsync` alive only ships with 0.16.2+, which is one reason `fakeAsync` goes instead.
- Zoneless change detection in the app or in TestBed. The app still bootstraps with zone.js, so TestBed keeps `provideZoneChangeDetection()`.
- Adding, removing or extending tests.
- Vitest browser mode (Playwright). Simulated DOM only.

## Anti-goals

- A test that is green on Vitest for a different reason than it was green on Karma (assertions weakened, spies that no longer verify anything, expectations silently dropped).
- Silently skipped tests.
- One unreviewable diff mixing generated and hand-written changes.

## Current state (measured on `a2251650`)

- 123 spec files, about 27k lines.
- Jasmine API use: `jasmine.*` in 100 files (802 hits), `jasmine.createSpyObj` 308, `.and.*` 452 (`returnValue` 372, `callFake` 57, `callThrough` 18, `throwError` 3), `.calls.*` 162, `spyOn` 135, `spyOnProperty` 2, `jasmine.objectContaining` 78, `jasmine.any` 37, `toBeTrue/False` 272, `toHaveBeenCalledOnceWith` 51, `withContext` 5.
- Async: `fakeAsync` in 18 files (`tick` 156, `flush` 68), `jasmine.clock` in 2 files (`home.component.spec.ts`, `http-cache.interceptor.spec.ts`), `done` callbacks in 9 files. No `waitForAsync`, no custom matchers, no focused or excluded specs.
- `HttpTestingController` in 8 files.
- `angular.json` test target uses `@angular/build:karma` with `main: src/test.ts`, `polyfills: src/polyfills.ts`, `inlineStyleLanguage: scss`, `stylePreprocessorOptions`, `styles: src/styles/styles.scss`, `assets`, and global `scripts` (`src/assets/optparse/optparse.1.1.1.js`, `optparse.hashtopolis.1.1.1.js`).
- `package.json`: `"test": "ng test --karma-config=karma.conf.js --include=src/app --code-coverage"`, `"test:ci": "ng test --watch=false --browsers=ChromeHeadless --code-coverage"`.
- CI (`.github/workflows/test.yml`): step "Run tests with Karma using ChromeHeadless" runs `npm run test:ci`, then uploads `coverage/hashtopolis/` as artifact `coverage-report`.

## Carry over from Karma

Each of these exists today and has to survive the move:

| Today | On Vitest |
|---|---|
| `src/test.ts` registers `provideZoneChangeDetection()` for TestBed (the app bootstraps with zone.js; TestBed defaults to zoneless since Angular 21) | Same provider in a Vitest setup / providers file |
| `zone.js` and `zone.js/testing` loaded, `fakeAsync` works | `zone.js` still loaded (zone change detection); `zone.js/testing` dropped once no spec uses `fakeAsync` |
| `process.env.TZ = 'Europe/Berlin'` in `karma.conf.js` | Same time zone for the Vitest run |
| `jasmine.conf.json`: `failSpecWithNoExpectations: true` | Closest Vitest equivalent (e.g. `expect.requireAssertions`); if none fits exactly, note the gap |
| `jasmine.conf.json`: `random: false` | Deterministic order (Vitest default within a file) |
| `reflect-metadata` imported in `src/polyfills.ts` | Still loaded before specs |
| Global `optparse` scripts and `styles.scss` on the test target | Moved to a dedicated test build configuration used as `buildTarget`, since the unit-test builder no longer accepts them on the test target |
| `--include=src/app` in `npm test` | Dropped; all 123 specs live under `src/app` |
| `singleRun: true`: `npm test` runs once | `npm test` runs once (no watch mode) |
| Coverage to `coverage/hashtopolis/` (html, text-summary) | `@vitest/coverage-v8`, same output directory so the CI artifact path keeps working |

## How (decided)

A hybrid of the Angular schematics and agentic cleanup, in this order, each step its own commit:

1. **Baseline:** `npm ci`, run the Karma suite, record spec and test counts.
2. **Config migration:** run the Angular CLI Karma-to-Vitest migration (`ng update @angular/cli --name migrate-karma-to-vitest`, as noted in `docs/angular-22-notes.md`), then complete what it leaves out (dependencies, carry-over table above).
3. **Mechanical spec rewrite:** run the `refactor-jasmine-vitest` schematic over all specs. Committed untouched so reviewers can see what was generated.
4. **Agentic cleanup until green:** resolve schematic TODOs, nested or chained spies, remaining `jasmine.*`, `.calls.*`, `toBeTrue/False`, `toHaveBeenCalledOnceWith`, `withContext`, `done` callbacks (9 files), and DOM emulation gaps. May be split into several commits by theme.
5. **Timers:** rewrite the 18 `fakeAsync` files and the 2 `jasmine.clock` files to `async` / `await` and Vitest fake timers, in its own commit(s) so the timing changes are reviewable apart from the runner swap. Each rewritten test must still fail if the behaviour it checks breaks (for example, a debounce test still fails when the debounce is removed).
6. **Cleanup:** remove Karma/Jasmine/puppeteer dependencies and files; replace `jasmine` types with Vitest globals in both `tsconfig.spec.json` and the root `tsconfig.json`; remove the now dead `PUPPETEER_SKIP_DOWNLOAD` from `Dockerfile` and `docker-entrypoint.sh`; rename the CI step; update the testing section of `STYLE_GUIDE.md`; in `docs/angular-22-notes.md` tick the Karma item and drop the "18 specs with `fakeAsync`" remark from the Zoneless item.

Other decisions:

- **Environment: jsdom**, the Angular 22 default (user decision, revised from happy-dom). Only `jsdom` is installed, never `happy-dom`: the CLI prefers `happy-dom` whenever it is present.
- **`fakeAsync` goes** (user decision, revised): replaced by native async and Vitest fake timers in this branch, see step 5.
- **DOM emulation gaps** (no layout, no `ResizeObserver`, no `matchMedia`, no canvas): first add global stubs in the Vitest setup file without touching the tests. If a test still cannot pass, adjust the test so it no longer needs real layout while keeping what it verifies. Skip only as a last resort, with a comment explaining why, and list every skipped test in the PR description.
- **Commits:** the builder makes the step commits itself on `karma-vitest-migration` (user decision): single-line messages, no attribution, never pushes.

## Left to the builder

- Exact Vitest / jsdom / coverage package versions (respect the `.npmrc` 14-day `min-release-age`).
- Whether settings live in `angular.json` options or a `runnerConfig` Vitest config file.
- Names and location of the setup file(s).
- How to map each `fakeAsync` pattern to Vitest timers, and whether fake timers are enabled per test or per file.
- How to map individual Jasmine idioms (`createSpyObj`, `.calls.mostRecent()`, `toBeTrue`, `withContext` and so on) as long as the assertion strength stays the same.
- How to split step 4 into commits.
