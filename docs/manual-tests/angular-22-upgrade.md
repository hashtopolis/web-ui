# Manual test: Angular 22 upgrade

Manual UI test for the web-ui branch `angular-22-update` (stacked on `angular-21-update`) against the backend `master`. The upgrade is meant to be behaviour neutral, so every step compares against the Angular 21 build: anything that looks or behaves differently from `angular-21-update` is a finding.

Not run yet.

Conventions: log in as admin unless a step says otherwise. Navigate through the menus and buttons, type a route only where a step asks for it. Keep the browser console open for the whole run: any Angular error (`NG0...`), uncaught exception or failed chunk load is a finding, also when the page looks fine. "Three dots" is the row action menu at the end of a table row.

## What changed and why it is tested here

| Change                                                                                             | Steps        |
| -------------------------------------------------------------------------------------------------- | ------------ |
| Bootstrap via `platformBrowser` instead of `platformBrowserDynamic`, `@angular/localize` removed   | 1            |
| Production chunk optimization is on by default (lazy feature modules are merged into fewer chunks) | 1, 2         |
| Components default to OnPush; `ng update` pins existing ones to `ChangeDetectionStrategy.Eager`    | 3, 4         |
| `?.` in templates returns `undefined` instead of `null` (migration wrapped null-sensitive uses)    | 5            |
| `@angular/animations` and `BrowserAnimationsModule` removed, Material 22                           | 6, 7         |
| HTTP: `provideHttpClient(withXhr(), ...)` keeps the XHR backend (Angular 22 defaults to fetch)     | 8, 9, 10, 11 |
| Router `paramsInheritanceStrategy` default is now `'always'`                                       | 12           |
| `@ng-idle/core` and `@ng-idle/keepalive` 13 to 16                                                  | 13           |
| `@fortawesome/angular-fontawesome` 4 to 5                                                          | 14           |
| One of the two `app-form` selectors renamed (`FormComponent` / `FormConfigComponent`)              | 15           |
| Components with `ViewEncapsulation.None` (Angular 22 changed when shared styles are removed)       | 16           |

## Test data

A fresh review stack is enough: at least one hashlist, one task with a few chunks dispatched to the stack's agent (so the task progress image and speed graph have data), one wordlist file of a few KB and one large file (1 GB or more) in Files. The large file can be generated on the host and uploaded through the UI in step 9, or copied into the server's files directory and registered through the UI.

## 1. Boot and console

1. Open the UI, log in. The dashboard renders, the console shows no errors.
2. Reload the page with the cache disabled. Same result.
3. Open a deep link directly in a new tab, e.g. `#/tasks/show-tasks`. The page renders after login without errors.

## 2. Lazy feature modules

1. Open every main menu section once: Home, Agents, Tasks, Hashlists, Files, Account, Users, Config. Every page renders, the console shows no chunk load error.
2. Repeat 1 after a hard reload starting from a different section, so the preloading strategy starts from another place.

## 3. Change detection, general

1. Agents → Show agents: the table loads, paginate, sort by a column, filter by text. The table updates after each action without a second click.
2. Tasks → Show tasks: same as 1. Leave the page open for one auto refresh interval: the values update without interaction.
3. Open a few dialogs that load data (e.g. the column selection dialog of a table, a file preview). Their content appears without a click or mouse move into the dialog.
4. Submit any create form with a validation error (e.g. a new hashlist without a name). The error message appears immediately.

## 4. Components that were explicitly `Default` (now `Eager`)

1. Tasks → New task: select a hashlist, attack command, files, cracker. All dependent fields (e.g. cracker version list, files tables, command preview) update as the selections change.
2. Tasks → Supertasks → apply a supertask to a hashlist (the "apply hashlist" page). The hashlist and cracker selections work and the supertask is applied.

## 5. Templates with `?.` (null vs undefined)

Each page below renders, shows the same values as on Angular 21, and shows nothing like "undefined" or an empty field where a value was shown before.

1. Hashlists → edit a hashlist (three dots → edit).
2. Users → Global permission groups → edit a group.
3. Account → API keys → create a new API key, then open its detail page.
4. A page that uses the wordlist generator (e.g. Files → New wordlist → generator).
5. A config form built by the dynamic form builder (e.g. Config → General settings).
6. Tasks → Show tasks: a table cell that links to the task progress image (the graph link type).
7. A task with dispatched chunks: the task speed graph and the heatmap chart render.

## 6. Material components and animations

Animations now come from Material's own CSS. Check that each opens, closes and looks as before (no element stuck half visible, no flicker that leaves a backdrop behind).

1. Dialogs: open and close by button, by Escape and by clicking the backdrop.
2. Snackbar: trigger a success message (e.g. save a setting). It appears and disappears on its own.
3. Menus: the three dots row menu, the user menu.
4. Tooltips on icons in table rows.
5. Expansion panels, tabs and the stepper where they exist (e.g. the new hashlist and new task pages).
6. Datepicker, if a page uses it (e.g. API key expiry).
7. Progress bar and spinner while a table loads.

## 7. Select and autocomplete inside dialogs

Material 22 changed how select and autocomplete overlays behave in modal dialogs.

1. A table's column selection dialog: open the select/autocomplete, choose with the mouse, then with the keyboard (arrow keys, Enter). The choice is applied and the dialog stays open.
2. Files → preview a file → use the select in the preview dialog the same way.
3. In both: after choosing, Tab moves focus within the dialog and Escape closes only the overlay first, then the dialog.

## 8. Session and authentication

1. Log out, log in again.
2. Wait until the access token is about to expire (or shorten it on the server) and use the app: requests keep working, no error dialog, no forced logout. This exercises the refresh cookie (`withCredentials`).
3. Log in as a user without the permission for a page (e.g. no agent read permission) and open that page through the menu. The access denied page or a permission message appears, as on Angular 21.

## 9. Files: upload, preview, download

1. Files → New wordlist: upload a small file. The upload progress is shown and the file appears in the table.
2. Upload the large file. The progress advances during the upload, the upload completes.
3. Three dots on the small file → preview. The first lines are shown with the right line numbers; scroll or page to load further lines (range requests).
4. Download the small file from the files table. The browser saves the file with the right name and content.
5. Download the large file from the files table and from the preview dialog's download button. The download completes, the tab does not crash or freeze, the saved file has the full size.

## 10. Images loaded as blobs

1. Edit a task with dispatched chunks: the task progress image is shown.
2. Tasks → Show tasks: the progress image preview in the table row is shown.

## 11. HTTP error handling

1. Trigger a 403 (as a restricted user, an action the user may not do). A snackbar or error message with the backend's message appears.
2. Open a route with an id that does not exist (e.g. edit agent with an unused id). The not found handling is the same as on Angular 21.
3. Stop the server container (`docker stop htpctrl-<slot>-server`), then trigger a request. The "Network error. Please verify the IP address ..." dialog appears. Start the container again (`docker start ...`) and continue.

## 12. Routes with parameters

1. Open each detail or edit page through the UI: agent edit, task edit, hashlist edit and its hashes page, user edit, group edit, health check view, preprocessor edit, cracker version edit, API key detail. Each loads the right record.
2. Navigate from one edit page directly to another record's edit page (e.g. via a link in the page). The page updates to the new record.

## 13. Idle timeout (ng-idle 16)

The idle time is the server's max session length in hours, read from local storage key `uis` (`maxSessionLength`) when the app starts.

1. In the browser's local storage, set `maxSessionLength` in `uis` to `0.005` (18 seconds) and reload.
2. Stay idle. The timeout dialog with the countdown appears, then the session ends and the login page is shown.
3. Log in, stay idle until the dialog appears, then move the mouse or press a key. The dialog closes and the session continues.
4. Restore the original `maxSessionLength` and reload.

## 14. Font Awesome icons

1. Tables with icon links (e.g. tasks and hashlists tables) show their icons.
2. Pages with brand icons (e.g. the footer or about page) show them.

## 15. Forms on the renamed `app-form` component

1. Config → Agent, Task/Chunk, Hashcat (HCH), Notifications and General settings: each form loads its values, a changed value saves and survives a reload.
2. Config → Hashtypes → new, and edit an existing hashtype.
3. Config → Engine → Agent binaries → new and edit; Crackers → new version and edit version.
4. Files → the new and edit forms that use the generic form (e.g. edit a wordlist).
5. Users → Global permission groups → new; Access groups → new.

## 16. Components with `ViewEncapsulation.None`

Angular 22 changed when shared styles are removed. These three components set global styles, so check that they look right the first time and still look right after navigating away and back.

1. Submit buttons (`button-submit`, used on about 44 forms): open a form, check the button's look (colour, spacing, disabled state while invalid, loading state while saving). Navigate to another form and back: the look is unchanged.
2. Colour input (`input-color`): Tasks → New task, Edit task, New preconfigured task and Edit preconfigured task. The colour field shows its swatch and picker, picking a colour updates the swatch. Navigate away and back: unchanged.
3. Hashtype detector: Hashlists → New hashlist → open the hashtype detector dialog, paste a hash, check the suggestions list and its styling. Close and reopen the dialog: unchanged.

## 17. Theme

1. Switch between light and dark theme (and back). All pages from the steps above keep readable colours; dialogs and overlays follow the theme.

## Findings

None yet.
