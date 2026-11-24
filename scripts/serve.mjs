/**
 * Starts the dev server for `npm start`.
 *
 * ng serve picks up file changes through native file system events. Where those do not arrive, for
 * example with a checkout on the Windows drive that is bind-mounted into the dev container, set
 * NG_SERVE_POLL to an interval in milliseconds to poll for changes instead. Polling keeps the CPU
 * busy, so it is off unless asked for.
 *
 * This is a script rather than shell syntax in package.json because npm runs scripts through
 * cmd.exe on Windows, which cannot add an argument only when a variable is set.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ng = fileURLToPath(new URL('../node_modules/@angular/cli/bin/ng.js', import.meta.url));

const args = [ng, 'serve', '--host', '0.0.0.0'];

const poll = process.env.NG_SERVE_POLL;
if (poll) {
  args.push('--poll', poll);
}

const result = spawnSync(process.execPath, args, { stdio: 'inherit' });

process.exit(result.status ?? 1);
