# Manual test: hashtypes of cracker binaries (#886)

Manual UI test for the web-ui branch `886-hashtype-association` against the backend stack of hashtopolis/server#2503 and #2505, including the server commits that grant hashtype read with the hashlist permissions and backfill the supertask cracker type.

Last run: 2026-10-08, all steps passed after the fixes listed under [Findings of the first run](#findings-of-the-first-run).

Conventions: log in as admin unless a step says otherwise. Navigate through the menus and buttons, type a route only where a step asks for it. "Three dots" is the row action menu at the end of a table row.

## Test data

Database ids differ between setups, so the steps use names. Everything created for the test is prefixed with "[886]".

| What                                                                    | Purpose                                             |
| ----------------------------------------------------------------------- | --------------------------------------------------- |
| Hashtype 123456 "[886] Test, no cracker"                                | No cracker version supports it                      |
| Hashlist "Test MD5" (MD5, 0)                                            | Supported by hashcat only                           |
| Hashlist "[886] Unsupported hashtype" (123456)                          | Blocked everywhere                                  |
| Hashlist "[886] SHA1" (100)                                             | Supported by hashcat and by the generic version     |
| Hashlist "[886] Archived MD5" (0), archived                             | For the copy check                                  |
| A real hashcat version, scanned                                         | Supports all hashcat modes (582 for 7.1.2)          |
| hashcat "0.0.1-noscan"                                                  | Dummy archive, its scan fails, never gets hashtypes |
| generic "1.0" (type `generic`)                                          | Supports SHA1 (100) and SHA256 (1400), not MD5      |
| Pretasks "[886] hashcat pretask" and "[886] generic pretask"            | For the hashlist page builders                      |
| Supertasks "[886] hashcat supertask" and "[886] generic supertask"      | One pretask each, of the matching cracker type      |
| Task "[886] Copy me: generic on SHA1"                                   | generic 1.0 on "[886] SHA1"                         |
| Task "[886] Copy me: archived hashlist"                                 | hashcat on "[886] Archived MD5", archived itself    |
| User "claude" in its own permission group, access group "Default Group" | Steps 8.6 and 9, see there                          |

### Seeding

The data can be created through the UI, or seeded against the server dev containers (`hashtopolis-server-dev`, `hashtopolis-db-dev`, MySQL user/password/database `hashtopolis`):

```bash
DB="docker exec -i hashtopolis-db-dev mysql -uhashtopolis -phashtopolis hashtopolis"

# hashtype, dummy hashcat version with a pending scan, generic version with SHA1 and SHA256
$DB <<'SQL'
INSERT INTO HashType (hashTypeId, description, isSalted, isSlowHash) VALUES (123456, '[886] Test, no cracker', 0, 0);
INSERT INTO CrackerBinary (crackerBinaryTypeId, version, downloadUrl, binaryName, filename, accessGroupId)
  VALUES (1, '0.0.1-noscan', 'http://localhost/none.7z', 'hashcat', NULL, 1);
INSERT INTO BackgroundJob (jobType, payload, status, userId, createdAt)
  VALUES ('scan_cracker', CONCAT('{"crackerBinaryId": ', LAST_INSERT_ID(), '}'), 0, NULL, UNIX_TIMESTAMP());
INSERT INTO CrackerBinary (crackerBinaryTypeId, version, downloadUrl, binaryName, filename, accessGroupId)
  VALUES (2, '1.0', 'http://localhost/generic-1.0.7z', 'generic', NULL, 1);
INSERT INTO CrackerBinaryHashtype (crackerBinaryId, hashTypeId) VALUES (LAST_INSERT_ID(), 100), (LAST_INSERT_ID(), 1400);
SQL
```

- The scan looks for the archive at `/usr/local/share/hashtopolis/crackers/<id>_hashcat-0.0.1-noscan.7z`. Put any non-archive file there (owned by `www-data`, `docker exec -u root`), then run the background jobs once: `docker exec hashtopolis-server-dev php -d xdebug.mode=off -f /var/www/html/src/inc/cron.php`. The job of the dummy version must end as Failed.
- Pretasks inserted by SQL need `color = ''`, not `NULL`, or the UI rejects the pretask list. Supertasks need `crackerBinaryTypeId` set and one `SupertaskPretask` row each.
- Hashlists and tasks are easiest through the API (`POST /api/v2/auth/token` with basic auth for a token). The body must be JSON:API (`{"data":{"type":"hashlist","attributes":{...}}}`, `Content-Type: application/vnd.api+json`). A hashlist needs `hashCount: 0`, `sourceType: "paste"` and `sourceData` base64 encoded. Create the task on the archived hashlist before archiving the hashlist, then archive task, task wrapper and hashlist.

## 0. Preparation

1. Binaries → Crackers → click "generic 1.0". Under "Supported Hashtypes" exactly SHA1 (100) and SHA256 (1400) are listed.

The steps below assume this state. Only step 7 changes it, and restores it at its end.

## 1. Cracker version pages (Binaries → Crackers → click a version)

**Scanned hashcat version, read-only**

1. Scroll to "Supported Hashtypes".
2. Expected: the note "The hashtypes of hashcat versions are determined by a background scan of the archive. …", no "Add Hashtypes" button, no checkboxes and no three dots in the rows.
3. The paginator shows "1 – 25 of 582" (for 7.1.2). Click next: "26 – 50 of 582".
4. Click the "Description" column header: the rows are sorted by description.
5. Choose "Description" as filter column and type `md5`: 69 results.

**hashcat 0.0.1-noscan, no hashtypes**

1. Expected: "No hashtypes yet. The scan of this version is pending or has failed, see Background Jobs."
2. Click "Background Jobs": the page lists "Scan cracker binary" with status Failed for this version.

**generic 1.0, editable**

1. The table lists SHA1 (100) and SHA256 (1400).
2. Click "Add Hashtypes" and type `ntlm`: NTLM is offered. Typing `sha` or `256` does not offer SHA1 or SHA256.
3. Pick NTLM → "Add": toast "Added 1 hashtype", the table has 3 rows.
4. On the NTLM row: three dots → "Remove Hashtype" → confirm: toast "Removed 1 hashtype".
5. Click "Add Hashtypes" again: NTLM is offered again.
6. Close the add form. The version is back at SHA1 and SHA256.

**generic 1.0, create hashtypes**

1. With the add form open, click "New Hashtype": the form with Mode, Description, Salted and Slow Hash opens, the add form closes.
2. Mode `99000`, Description `[886] Custom mode`, "Create": toast "Created hashtype 99000 ([886] Custom mode) and added it to this version.", the table lists it.
3. "New Hashtype" again, Mode `0`, Description `anything`, "Create": toast "Hashtype 0 already existed and was added to this version. Its existing description was kept.", the table lists MD5.
4. "New Hashtype" again, Mode `0`, any description (it is required), "Create": red toast "Hashtype 0 is already assigned to this version.", no request is sent.
5. Clean up: on the rows 99000 and MD5, three dots → "Remove Hashtype". Config → Hashtypes → 99000 → three dots → delete. The version is back at SHA1 and SHA256.

## 2. New Task (Tasks → New Task)

1. Without a hashlist, both cracker selects offer everything.
2. Select the hashlist "[886] SHA1": "Binary type to run task" offers hashcat and generic, a version is preselected, the dummy version is not offered.
3. Remove the chip, select "Test MD5": only hashcat is left, its newest supported version is preselected.
4. Open the type select once and close it again. Remove the chip, select "[886] Unsupported hashtype":
   - Both selects are empty.
   - The alert reads "No accessible cracker version supports hashtype 123456 ([886] Test, no cracker)."
   - No "is required" hint appears under the selects, the page does not jump.
5. Fill in a name and an attack command with `#HL#` plus options (e.g. `#HL# -a 3 ?d?d`), click "Create": no task is created, no request is sent.
6. Remove the hashlist chip: the types and versions are back, the alert is gone.

## 3. Apply a supertask (Tasks → Supertasks → three dots → "Apply Hashlist")

1. "[886] generic supertask": "Supertask" and "Binary type" are shown read-only ("generic"), there is no type select. Pick "[886] SHA1": "Binary version" offers 1.0. Click "Create": Tasks → Tasks lists the new supertask, its task runs on generic 1.0.
2. Same supertask, pick "Test MD5": the version select is empty, the alert "No accessible cracker version supports hashtype 0 (MD5)." shows, "Create" sends nothing.
3. "[886] hashcat supertask", pick "Test MD5": only the scanned hashcat version is offered. Open the version select once, then switch to "[886] Unsupported hashtype": the alert, an empty select without "is required" hint, "Create" sends nothing.
4. Remove the hashlist chip: all versions of the type are back, the alert is gone.

## 4. Hashlist page, pre-configured tasks (Hashlists → Hashlists → click a name → "Create pre-configured tasks")

Always open the hashlist page from the list: the builder remembers a failed lookup until the page is loaded again.

1. **"Test MD5"**: tick both "[886]" pretasks, "Create".
   - One red toast: "Failed to create 1 task(s). No accessible cracker version supports hashtype 0 (MD5)."
   - The hashcat task appears in "Tasks Cracking this hashlist", on the scanned hashcat version.
2. **"[886] SHA1"**: tick both, "Create": toast "Created 2 task(s) from pre-configured tasks.", the generic one runs on generic 1.0.
3. **"[886] Unsupported hashtype"**: tick both, "Create": one red toast "Failed to create 2 task(s). No accessible cracker version supports hashtype 123456 ([886] Test, no cracker).", no task is created.

## 5. Hashlist page, supertask (same page, section "Create supertask")

1. **"Test MD5"**: the row "[886] hashcat supertask" shows "hashcat" and offers the scanned version, "Create Supertask" works. The row "[886] generic supertask" shows "generic" and "No accessible generic version supports this hashtype.", its button is disabled.
2. **"[886] SHA1"**: both rows offer a version.
3. **"[886] Unsupported hashtype"**: the alert above the rows, both rows blocked.

## 5a. Supertask templates (Tasks → Supertasks)

1. The table has a "Cracker type" column: "hashcat" and "generic" for the two test supertasks. (The column is in the default settings; a browser with table settings saved before may need it switched on under "Columns".)
2. "New Supertask": "Cracker type" is preselected to hashcat and the pretask list only offers "[886] hashcat pretask". Switch to generic: the pretask selection is cleared and only "[886] generic pretask" is offered. Create "[886] generic 2" with it, delete it afterwards.
3. Open "[886] generic supertask": "Cracker type" reads "generic" read-only, "Preconfigured tasks not part of this supertask" lists no hashcat pretask.

## 6. Copy a task

1. Tasks → Tasks → "[886] Copy me: generic on SHA1" → three dots → "Copy to Task": hashlist "[886] SHA1", type generic and version 1.0 are kept, no toast.
2. Tasks → Tasks → switch on "Show Archived" → "[886] Copy me: archived hashlist" → three dots → "Copy to Task": the archived hashlist is not in the hashlist select, but the cracker selects are still restricted to its hashtype MD5: only hashcat is offered.
3. Tasks → Preconfigured Tasks → "[886] generic pretask" → three dots → "Copy to Task": nothing is filtered until a hashlist is picked. Picking "Test MD5" leaves only hashcat.

## 7. Copy a task whose version lost the hashtype (changes the data, restored at the end)

1. Binaries → Crackers → generic 1.0 → on the SHA1 row: three dots → "Remove Hashtype" → confirm.
2. Tasks → Tasks → "[886] Copy me: generic on SHA1" → three dots → "Copy to Task":
   - hashcat with its newest supported version is selected instead of generic 1.0.
   - Info toast: "The cracker version of the copied task is not accessible or does not support the hashtype of the hashlist, the latest supported version was selected instead."
3. Restore: Binaries → Crackers → generic 1.0 → "Add Hashtypes" → SHA1 → "Add". The version lists SHA1 and SHA256 again.

## 8. Unchanged flows (regression)

1. Tasks → Preconfigured Tasks → New → "Advanced Settings": the binary type select offers hashcat and generic as before.
2. Config → Health Checks → New: the binary and version selects work as before, without hashtype filtering.
3. Tasks → Tasks → open a task: "Cracker Information" shows type and version read-only.
4. Config → Background Jobs: the scans are listed as "Scan cracker binary"; delete the failed one.
5. Config → Hashtypes: there is no "New Hashtype" button, the route `#/config/hashtypes/new` shows the not found page. Edit and delete of a hashtype work as before.
6. As a user with hashtype read but without hashtype update (the "claude" user below): Config has no "Hashtypes" entry, the routes `#/config/hashtypes` and `#/config/hashtypes/0/edit` show the toast "Access denied: You do not have the required role 'update HashTypes'", the cracker version page still shows "Supported Hashtypes" (with "Add Hashtypes" when the user may update crackers, without "New Hashtype").

### The "claude" test user

The permission editor writes the old permission bundles, so its boxes are coupled: ticking one box grants every create/read/update/delete flag of the bundles containing it. All four hashtype flags come with server configuration access; with the server change, hashtype read also comes with the hashlist permissions.

Create a permission group and tick only:

| Row            | Box    | Grants (bundle)                                                    |
| -------------- | ------ | ------------------------------------------------------------------ |
| Task           | Create | create tasks, read tasks and task wrappers                         |
| Hashlist       | Read   | view and manage hashlists, now with hashtype read                  |
| Cracker binary | Read   | all cracker, cracker type, cracker hashtype and agent binary flags |

Leave "Hash type" and "Config" empty. Create the user in this group and in the access group "Default Group". The web-ui reads the permissions at login: log in again after changing them.

## 9. Task creator without server configuration (regression for the permission bundles)

As the "claude" user:

1. Tasks → New Task → select "[886] SHA1": hashcat and generic are offered, a version is preselected, no alert. Create the task: it is listed under Tasks.
2. "Failed to load preprocessors" may show: preprocessor read comes only with server configuration, unrelated to #886.
3. Against a backend without the hashtype read in the hashlist bundles, the version lookup answers 403. The selects stay empty and the alert must read "Could not check which cracker versions support hashtype 100.", not "No accessible cracker version supports …".

## Findings of the first run

Fixed after the run of 2026-10-08:

- The "Cracker type" column of the supertasks table was missing from the default columns.
- A cracker select opened before a blocking hashlist was chosen showed its "is required" hint next to the alert (New Task, Apply Hashlist).
- A failed support lookup (403) produced "No accessible cracker version supports …". It now says the check failed.
- The backend granted hashtype read only with server configuration access, so task creators without it could not create any task. Hashtype read now comes with the hashlist permissions (server).

Known, not fixed:

- Without a hashlist, New Task and Apply Hashlist preselect the version with the highest id, which can be a version without hashtypes (e.g. 0.0.1-noscan).
- Hashlist page, "Create supertask": the cracker type label and the row hint sit lower than the supertask name, and the row hint repeats the alert when all rows are blocked.
- Permission editor: unticking "Hash type → Read" also removes hashlist and server configuration access, because the boxes map to the old bundles.

## Known gaps (backend, not part of the web-ui PR)

- The scan runs the cracker on the server: only a Linux build for the server's CPU can be scanned.
- Non-admins only see hashtypes linked to a cracker binary of their access groups. "New Hashtype" on a generic version also adds an existing mode which was invisible to them; after that they can see it, and with hashtype update or delete permission change or delete it for everyone.
