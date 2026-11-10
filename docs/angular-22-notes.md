# After the Angular 22 migration

Checklist from #842. The upgrade pinned old behaviour wherever a default changed.

## Keep in mind

- New components default to **OnPush**: use signals / `async`, or set `Eager` explicitly; never `Default`
- Template `?.` returns `undefined`, not `null`
- TypeScript 6.0; no `baseUrl`, import via aliases (`@src/...`), never `'src/...'`
- Selectors must be unique (NG8023)
- `ngModel` in a child component inside a form: `[ngModelOptions]="{ standalone: true }"` or native binding (NG01354)
- No `@angular/animations`: CSS or `animate.enter` / `animate.leave`
- `withXhr()` stays: fetch buffers blob downloads in memory (`getFile()`)
- Router `paramsInheritanceStrategy` `'always'`: nested routes inherit parent `data` (`roleName`)
- Specs: `provideDisabledMaterialAnimations()`, `provideRouter([])` + `RouterLink` + `provideLocationMocks()`, no `withXhr()`
- CI lints whole changed files: old lint debt comes along
- `.npmrc` 14-day `min-release-age`: versions trail latest
- CLI 22: chunk merging on (`NG_BUILD_OPTIMIZE_CHUNKS=false`), `PORT` env wins in `ng serve`

## Follow-ups

- [ ] OnPush instead of `Eager` (144 components)
- [ ] Remove suppressed `nullishCoalescingNotNullable` / `optionalChainNotNullable` (`tsconfig.app.json`, `tsconfig.spec.json`)
- [ ] Zoneless (after OnPush; 18 specs with `fakeAsync`)
- [ ] Standalone components (154 `standalone: false`, 38 NgModules): `@angular/core:standalone-migration`
- [ ] Signal inputs / outputs / queries: `@angular/core:signal-input-migration`, `output-migration`, `signal-queries-migration`
- [ ] `inject()` in services (42) and `auth.guard.ts`, `chunks.component.ts`: `@angular/core:inject-migration`
- [ ] Functional interceptors (3) and `CanDeactivateFn` for `pendingchanges.guard.ts`
- [ ] Native file download, then drop `withXhr()`
- [ ] Karma to Vitest: `ng update @angular/cli --name migrate-karma-to-vitest`
- [ ] Signal forms (public since 22) for new forms
- [ ] TypeScript 7 once `@angular/compiler-cli` allows it

## Found during testing, also on master

- [ ] Idle timeout never starts: no `setUserLoggedIn(true)` since 8cc4e386f
- [ ] Network error dialog missing on table reload / Hashlists
- [x] Safari blue status colours (oklch): #844
