/**
 * Starts the dev server for `npm start`.
 *
 * ng serve polls for file changes every 500 ms, because file system events do not reach it
 * everywhere, for example in the dev container on Colima or with a checkout on the Windows drive.
 * Polling keeps the CPU busy, so where the events do arrive, set NG_SERVE_POLL=0 to rely on them
 * instead. Any other value sets the polling interval in milliseconds.
 *
 * This is a script rather than shell syntax in package.json because npm runs scripts through
 * cmd.exe on Windows, which cannot leave out an argument depending on a variable.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ng = fileURLToPath(new URL('../node_modules/@angular/cli/bin/ng.js', import.meta.url));

const args = [ng, 'serve', '--host', '0.0.0.0'];

const poll = process.env.NG_SERVE_POLL || '500';
if (poll !== '0') {
  args.push('--poll', poll);
}

const result = spawnSync(process.execPath, args, { stdio: 'inherit' });

process.exit(result.status ?? 1);
