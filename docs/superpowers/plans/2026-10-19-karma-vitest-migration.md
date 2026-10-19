# Karma to Vitest Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run the existing unit test suite on Vitest (`@angular/build:unit-test`, jsdom) with the same tests passing as on Karma, and no Karma, Jasmine or puppeteer left.

**Architecture:** Two Angular schematics do the mechanical work (`migrate-karma-to-vitest` for config, `refactor-jasmine-vitest` for specs), each committed on its own. Agentic passes then fix what they leave, rewrite `fakeAsync` / `jasmine.clock` to Vitest fake timers, and remove the old tooling. A Karma baseline of test names is the yardstick for "same tests".

**Tech Stack:** Angular 22.2.1, `@angular/build:unit-test`, Vitest 5 (globals), jsdom, `@vitest/coverage-v8`, zone.js 0.15 (unchanged).

**Spec:** `docs/superpowers/specs/2026-10-19-karma-vitest-migration-design.md`

## Global Constraints

- Work only in `/Users/uhashy/projects/hashtopolis/web-ui-karma` on branch `karma-vitest-migration`.
- Commit each task yourself; single-line message; no attribution of any kind; never push.
- `zone.js` stays at `~0.15.0`. No production `dependencies` change in `package.json`.
- Only `jsdom` as DOM library (the Angular 22 default); never install `happy-dom`, which the CLI would prefer over jsdom if present.
- New dev dependency versions come from `npm install`; the `.npmrc` 14-day `min-release-age` decides what resolves. Do not override it.
- No test is added or removed. A test may be adjusted only so it runs without real layout or without `fakeAsync`, and it must still verify the same thing. `it.skip` only as last resort, with a comment saying why.
- Never weaken an assertion: no deleted `expect`, no spy that no longer verifies anything, no `toBeTruthy` where `toBe(true)` was meant.
- CI runs ESLint and the Prettier check on every changed file, so each commit leaves changed files lint- and prettier-clean.
- Test time zone stays `Europe/Berlin`.

## Review Focus

- **Silently dropped tests.** The schematic or a hand edit turns an `it()` into nothing, or a `describe` stops being collected. Expected: the final Vitest test name list equals the Karma baseline (Task 6 compares them).
- **Tests green for a new reason.** A converted spy (`createSpyObj` → object of `vi.fn()`) returning `undefined` where Jasmine returned a configured value, or `toHaveBeenCalledOnceWith` mapped to a weaker matcher. Expected: assertion strength unchanged (Task 4 diff review step).
- **Fake timers that never advance.** A rewritten `tick(300)` that no longer awaits the async flush, so the assertion runs before the timer fires yet still passes because it asserts an initial state. Expected: each rewritten timing test fails when the timing it covers is broken (Task 5 mutation step).
- **Time zone drift.** Date formatting specs pass locally in CEST but would fail in CI's UTC. Expected: Vitest workers run with `TZ=Europe/Berlin` (Task 2 check).
- **Change detection mode.** TestBed falls back to zoneless (Angular 21+ default) once `src/test.ts` is gone, so specs relying on zone-triggered detection behave differently. Expected: `provideZoneChangeDetection()` registered through `providersFile` (Task 2 check).

---

### Task 1: Karma baseline

**Files:**
- Create: `.superpowers/sdd/2026-10-19-karma-vitest-migration/karma-baseline.txt` (not committed)
- Commit: `docs/superpowers/specs/2026-10-19-karma-vitest-migration-design.md`, `docs/superpowers/plans/2026-10-19-karma-vitest-migration.md`

**Interfaces:**
- Produces: `karma-baseline.txt`, one passing test per line as `<describe path> > <test name>`, sorted. Task 6 diffs the Vitest list against it.

- [ ] **Step 1: Run the Karma suite once**

`node_modules` is already installed. Puppeteer's Chrome is in `~/.cache/puppeteer` (its postinstall is blocked by `allow-scripts`, which is fine).

Run: `npx ng test --watch=false 2>&1 | tee .superpowers/sdd/2026-10-19-karma-vitest-migration/karma-run.log`
Expected: ends with `Executed N of N SUCCESS`. If anything fails or is skipped, stop and report: the baseline must be all green.

- [ ] **Step 2: Extract the baseline**

The spec reporter prints suites as indented headings and tests as `OK: <name>` lines. Turn the log into `<describe path> > <test name>` lines (nested describes joined with ` > `), sort, write `karma-baseline.txt`. The line count must equal `N` from Step 1; write `N` as the first line of `.superpowers/sdd/2026-10-19-karma-vitest-migration/karma-count.txt`.

- [ ] **Step 3: Commit the design and plan**

```bash
git add docs/superpowers/specs/2026-10-19-karma-vitest-migration-design.md docs/superpowers/plans/2026-10-19-karma-vitest-migration.md
git commit -m "Add the design and plan for the Karma to Vitest migration"
```

---

### Task 2: Config migration to the unit-test builder

**Files:**
- Modify (by schematic, then by hand): `angular.json`, `package.json`, `package-lock.json`, `tsconfig.spec.json`
- Create: `src/test-providers.ts`, `src/test-setup.ts`, `vitest-base.config.ts`
- Delete: `src/test.ts`

**Interfaces:**
- Produces:
  - `angular.json` `test` target: `builder: @angular/build:unit-test`, `runner: vitest`, `buildTarget: ::build:testing` (the `testing` build configuration holds the test-only `polyfills`, `styles`, `scripts`, `stylePreprocessorOptions`, `inlineStyleLanguage`, `assets` the schematic moved), `providersFile: src/test-providers.ts`, `setupFiles: [src/test-setup.ts]`, `runnerConfig: true`.
  - `src/test-providers.ts`: `export default [provideZoneChangeDetection()]` (type `EnvironmentProviders | Provider` array as the builder documents).
  - `src/test-setup.ts`: global DOM stubs; starts empty except a header comment; Task 4 adds stubs.
  - `vitest-base.config.ts`: `defineConfig({ test: { env: { TZ: 'Europe/Berlin' }, expect: { requireAssertions: true } } })`.

- [ ] **Step 1: Run the config migration**

Run: `npx ng update @angular/cli --name migrate-karma-to-vitest`
Expected: summary lists `hashtopolis` as migrated; `karma.conf.js` is likely reported as needing manual migration (custom launcher, puppeteer). Read the log and keep it for Step 3.

- [ ] **Step 2: Install the DOM library and coverage provider**

Run: `npm install --save-dev jsdom` (plus `@vitest/coverage-v8` if the schematic did not add it; it should, since coverage is on).
Expected: `vitest`, `@vitest/coverage-v8`, `jsdom` in `devDependencies`; no `happy-dom` (check `npm ls happy-dom` is empty).

- [ ] **Step 3: Replace `src/test.ts`**

The schematic maps `main: src/test.ts` to `setupFiles`. Remove that mapping and delete `src/test.ts`: the builder initialises TestBed itself, and the zone opt-in moves to `src/test-providers.ts` (`providersFile`). `zone.js/testing` is no longer imported anywhere; the 18 `fakeAsync` files will fail until Task 5, which is expected.

- [ ] **Step 4: Add `vitest-base.config.ts` and set `runnerConfig: true`**

Contents as in Interfaces. If `expect.requireAssertions` is not available in the installed Vitest, leave it out and note it for the PR description (closest equivalent to Jasmine's `failSpecWithNoExpectations`).

- [ ] **Step 5: Verify the setup on two known specs**

Run: `npx ng test --watch=false --include src/app/core/_services/shared/http-cache.service.spec.ts --include src/app/home/home.component.spec.ts`
Expected: the run starts (builds, collects tests). Test failures from Jasmine APIs are expected at this stage; build or environment errors are not.

Then confirm with a throwaway spec (delete it before committing) that: `new Date(0).getTimezoneOffset()` is `-60`; `document` is jsdom (`navigator.userAgent` contains `jsdom`); a component fixture gets zone change detection (`TestBed.inject(NgZone)` is not `NoopNgZone`).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Move the test target from Karma to the Vitest unit-test builder"
```

---

### Task 3: Mechanical Jasmine to Vitest rewrite

**Files:**
- Modify: `src/app/**/*.spec.ts` (by schematic only)
- Not committed: `jasmine-vitest-<date>.md` report in the repo root

**Interfaces:**
- Produces: the schematic report, used as the work list for Task 4.

- [ ] **Step 1: Run the schematic**

Run: `npx ng g @schematics/angular:refactor-jasmine-vitest --project hashtopolis`
(defaults: `--fake-async=false`, `--browser-mode=false`, `--add-imports=false`, `--report=true`)
Expected: specs rewritten, report file written. Move the report to .superpowers/sdd/2026-10-19-karma-vitest-migration so it stays out of the commit.

- [ ] **Step 2: Commit the untouched output**

Do not hand-edit, do not run Prettier or ESLint fixes in this commit: it must show exactly what the schematic generated.

```bash
git add src
git commit -m "Run the refactor-jasmine-vitest schematic over all specs"
```

---

### Task 4: Fix what the schematic left until green

**Files:**
- Modify: `src/app/**/*.spec.ts`, `src/test-setup.ts`
- Excluded here: the 18 `fakeAsync` files and the 2 `jasmine.clock` files listed in Task 5

**Interfaces:**
- Consumes: the schematic report (Task 3), `src/test-setup.ts` (Task 2).

- [ ] **Step 1: Run the suite and bucket the failures**

Run: `npx ng test --watch=false --exclude <each Task 5 file>`
Group failures by cause: schematic TODOs, leftover `jasmine.*`, spy objects (`createSpyObj` / `.and.*` / `.calls.*`), `done` callbacks, `withContext`, `toBeTrue/False`, `toHaveBeenCalledOnceWith`, DOM emulation gaps, other.

- [ ] **Step 2: Fix bucket by bucket, one commit per bucket**

Mapping rules where the choice matters:
- `toHaveBeenCalledOnceWith(x)` → `toHaveBeenCalledExactlyOnceWith(x)` (not `toHaveBeenCalledWith`).
- `toBeTrue()` / `toBeFalse()` → `toBe(true)` / `toBe(false)` (not `toBeTruthy`).
- `done` callbacks (9 files: the 7 table component specs under `src/app/core/_components/tables/`, `http-cache.interceptor.spec.ts`, `http-cache.service.spec.ts`) → return / await a Promise; keep every assertion that ran inside the callback.
- `withContext('msg')` → `expect(value, 'msg')`.
- `spyOnProperty` (2 files) → `vi.spyOn(obj, 'prop', 'get')`.
- DOM gaps: first a stub in `src/test-setup.ts` (for example `ResizeObserver`, `matchMedia`), then adjust the test, skip last.

After each bucket: `npx eslint <changed files>` and `npx prettier --check <changed files>` clean, then commit, e.g. `git commit -m "Convert done callbacks in specs to async tests"`.

- [ ] **Step 3: Review assertion strength**

Run: `git diff <Task 3 commit>..HEAD -- src/app` and check every removed line containing `expect(` has a counterpart; every `vi.fn()` replacing a `createSpyObj` method that had `.and.returnValue` still returns that value.

- [ ] **Step 4: Verify**

Run: `npx ng test --watch=false --exclude <each Task 5 file>`
Expected: all green, no skipped tests except documented last-resort skips.

---

### Task 5: Rewrite fakeAsync and jasmine.clock to Vitest fake timers

**Files (20):**
- `fakeAsync`: `src/app/account/settings/acc-settings/acc-settings.component.spec.ts`, `src/app/agents/edit-agent/edit-agent.component.spec.ts`, `src/app/agents/new-agent/new-agent.component.spec.ts`, `src/app/auth/auth.component.spec.ts`, `src/app/auth/forgot-password/forgot-password.component.spec.ts`, `src/app/core/_datasources/specs/agents.datasource.spec.ts`, `src/app/core/_datasources/specs/base.datasource.spec.ts`, `src/app/core/_services/shared/refresh/auto-refresh.service.spec.ts`, `src/app/core/_services/storage/local-storage.service.spec.ts`, `src/app/core/_services/storage/session-storage.service.spec.ts`, `src/app/files/new-files/new-files.component.spec.ts`, `src/app/hashlists/edit-hashlist/edit-hashlist.component.spec.ts`, `src/app/hashlists/import-cracked-hashes/import-cracked-hashes.component.spec.ts`, `src/app/hashlists/new-hashlist/new-hashlist.component.spec.ts`, `src/app/shared/dynamic-form-builder/dynamicform.component.spec.ts`, `src/app/shared/widgets/last-updated/last-updated.component.spec.ts`, `src/app/tasks/edit-tasks/edit-tasks.component.spec.ts`, `src/app/users/new-user/new-user.component.spec.ts`
- `jasmine.clock`: `src/app/home/home.component.spec.ts`, `src/app/core/_interceptors/http-cache.interceptor.spec.ts`

These 20 files were excluded in Task 4, so besides the timers they may still carry the Task 4 buckets (spies, `done`, matchers); fix those with the same mapping rules.

- [ ] **Step 1: Try the schematic's fake-timer transform per file**

Run for each file: `npx ng g @schematics/angular:refactor-jasmine-vitest --project hashtopolis --include <file> --fake-async --report=false`
Review the diff. Keep it if it compiles and reads right; otherwise `git checkout -- <file>` and rewrite by hand.

- [ ] **Step 2: Rewrite by hand where needed**

Patterns: `fakeAsync(() => …)` → `async () => …` with `vi.useFakeTimers()` in `beforeEach` and `vi.useRealTimers()` in `afterEach`; `tick(n)` → `await vi.advanceTimersByTimeAsync(n)`; `flush()` → `await vi.runAllTimersAsync()`; `flushMicrotasks()` → `await Promise.resolve()` or `await fixture.whenStable()`; `discardPeriodicTasks()` → `vi.clearAllTimers()`; `jasmine.clock().mockDate(d)` → `vi.setSystemTime(d)`. Follow each advance with `fixture.detectChanges()` where the original relied on zone-driven detection.

- [ ] **Step 3: Mutation check per file**

For each of the 20 files, pick the production behaviour its timing tests cover (debounce, refresh interval, timeout, cache expiry, last-updated ticker), break it temporarily (change the delay or remove the timer), run that spec: it must fail. Revert the production change. Note file → mutation → result in .superpowers/sdd/2026-10-19-karma-vitest-migration (`timer-mutations.txt`).

- [ ] **Step 4: Verify and commit**

Run: `npx ng test --watch=false`
Expected: whole suite green. `grep -rE "fakeAsync|tick\(|flushMicrotasks|discardPeriodicTasks|jasmine\." src` returns nothing.
ESLint and Prettier clean on changed files, then:

```bash
git commit -am "Replace fakeAsync and jasmine.clock in specs with Vitest fake timers"
```

---

### Task 6: Remove Karma tooling and compare against the baseline

**Files:**
- Modify: `package.json` (`devDependencies`, `scripts.test`, `scripts.test:ci`), `package-lock.json`, `tsconfig.json` (`types`), `.github/workflows/test.yml`, `Dockerfile`, `docker-entrypoint.sh`, `STYLE_GUIDE.md:709-710`, `docs/angular-22-notes.md`
- Delete: `karma.conf.js`, `jasmine.conf.json` (and `src/test.ts` if still present)

Baseline count from Task 1: first line of `.superpowers/sdd/2026-10-19-karma-vitest-migration/karma-count.txt`.

- [ ] **Step 1: Uninstall and delete**

Run: `npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter karma-spec-reporter jasmine-core @types/jasmine puppeteer`
Delete `karma.conf.js`, `jasmine.conf.json`. Root `tsconfig.json` `types`: `["jasmine", "node"]` → `["vitest/globals", "node"]`. Remove `PUPPETEER_SKIP_DOWNLOAD` from `Dockerfile` line 2 and `docker-entrypoint.sh` line 110. Check `.npmrc` / `package.json` for any `allow-scripts` entry naming puppeteer and drop it.

- [ ] **Step 2: Scripts and CI**

`package.json`: `"test": "ng test --watch=false --coverage"`, `"test:ci": "ng test --watch=false --coverage"`. `.github/workflows/test.yml`: step name `Run tests with Karma using ChromeHeadless` → `Run unit tests with Vitest`; the coverage artifact path `coverage/hashtopolis/` stays (the builder's default `coverage/<project>`).

- [ ] **Step 3: Docs**

`STYLE_GUIDE.md` testing bullet: Vitest via `@angular/build:unit-test` with jsdom, `vitest-base.config.ts`, `src/test-providers.ts`, `src/test-setup.ts`; specs colocated as `*.spec.ts`. `docs/angular-22-notes.md`: tick `Karma to Vitest`; Zoneless item becomes `Zoneless (after OnPush)`; add to "Keep in mind": `Specs run on Vitest with jsdom: no layout, use vi.useFakeTimers instead of fakeAsync`.

- [ ] **Step 4: Compare with the baseline**

Run: `npx ng test --watch=false --coverage --reporters=json --reporters=default --output-file=.superpowers/sdd/2026-10-19-karma-vitest-migration/vitest.json`
Turn `vitest.json` into `<describe path> > <test name>` lines, sort, `diff` against `karma-baseline.txt`.
(`outputFile` applies to the first reporter, hence `json` first.)
Expected: no difference, passed count equals `N`, `coverage/hashtopolis/index.html` exists. Any difference is either a fix to make or a documented last-resort skip.

- [ ] **Step 5: Final checks and commit**

Run: `grep -rniE "karma|jasmine|puppeteer" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=docs/superpowers .`
Expected: nothing (except historic mentions you judge intentional; list them).
Run: `npm run lint`, `npm run build:ci`; both pass. ESLint and Prettier clean on changed files.

```bash
git add -A
git commit -m "Remove Karma, Jasmine and puppeteer"
```

Report to the user: baseline vs final counts, skipped tests with reasons, the `requireAssertions` outcome, and the commits made. Do not push.
