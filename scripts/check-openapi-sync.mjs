/**
 * Verify the committed openapi.json matches the backend's committed spec,
 * without needing a running backend.
 *
 * The backend repo (hashtopolis/server) commits its own openapi.json, and its
 * CI enforces that it matches what the server actually serves. So comparing
 * against that file at a pinned commit is equivalent to comparing against a
 * running backend at that commit.
 *
 * Usage:
 *   node scripts/check-openapi-sync.mjs [--ref <server ref>] [--server-path <local checkout>]
 *
 * The ref defaults to the contents of .backend-ref, which must hold a full
 * commit SHA so the check is deterministic: a branch name is a moving target
 * that lets an unrelated backend merge retroactively break frontend CI.
 * With --server-path, the spec is read from a local server checkout instead
 * of the network.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SERVER_RAW_BASE = 'https://raw.githubusercontent.com/hashtopolis/server';

function parseArgs(argv) {
  const args = { ref: undefined, serverPath: undefined };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--ref') {
      args.ref = argv[++i];
    } else if (argv[i] === '--server-path') {
      args.serverPath = argv[++i];
    } else {
      console.error(`Unknown argument: ${argv[i]}`);
      process.exit(2);
    }
  }
  return args;
}

function pinnedRef() {
  let ref;
  try {
    ref = readFileSync(new URL('../.backend-ref', import.meta.url), 'utf8').trim();
  } catch {
    console.error('.backend-ref is missing; it must contain the hashtopolis/server commit SHA this frontend targets.');
    process.exit(2);
  }
  if (!/^[0-9a-f]{40}$/.test(ref)) {
    console.error(`.backend-ref must contain a full 40-character commit SHA, got: '${ref}'`);
    console.error('Branch names are moving targets and make the sync check non-deterministic.');
    process.exit(2);
  }
  return ref;
}

/** JSON.stringify with recursively sorted object keys, so ordering differences don't count as drift. */
function stableStringify(value) {
  const sortKeys = (v) => {
    if (Array.isArray(v)) return v.map(sortKeys);
    if (v !== null && typeof v === 'object') {
      return Object.fromEntries(
        Object.keys(v)
          .sort()
          .map((k) => [k, sortKeys(v[k])])
      );
    }
    return v;
  };
  return JSON.stringify(sortKeys(value), null, 2) + '\n';
}

async function loadServerSpec({ ref, serverPath }) {
  if (serverPath) {
    const path = join(serverPath, 'openapi.json');
    console.log(`Comparing against local server checkout: ${path}`);
    return JSON.parse(readFileSync(path, 'utf8'));
  }
  const url = `${SERVER_RAW_BASE}/${ref}/openapi.json`;
  console.log(`Comparing against hashtopolis/server@${ref}`);
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch ${url}: HTTP ${response.status}`);
    console.error('Check that the ref in .backend-ref (or --ref) exists in hashtopolis/server.');
    process.exit(2);
  }
  return response.json();
}

const args = parseArgs(process.argv.slice(2));
const ref = args.ref ?? pinnedRef();

const committed = JSON.parse(readFileSync(new URL('../openapi.json', import.meta.url), 'utf8'));
const served = await loadServerSpec({ ref, serverPath: args.serverPath });

const committedNorm = stableStringify(committed);
const servedNorm = stableStringify(served);

if (committedNorm === servedNorm) {
  console.log('openapi.json is in sync with the backend spec.');
  process.exit(0);
}

console.error('openapi.json is OUT OF SYNC with the backend spec.');
console.error('Regenerate it with `npm run generate` (against the matching backend) and commit the result,');
console.error('or update .backend-ref to the backend commit this branch targets.\n');

const dir = mkdtempSync(join(tmpdir(), 'openapi-sync-'));
const committedFile = join(dir, 'openapi.committed.json');
const servedFile = join(dir, 'openapi.backend.json');
writeFileSync(committedFile, committedNorm);
writeFileSync(servedFile, servedNorm);

const diff = spawnSync('diff', ['-u', committedFile, servedFile], { encoding: 'utf8' });
if (diff.stdout) {
  const lines = diff.stdout.split('\n');
  console.error(lines.slice(0, 200).join('\n'));
  if (lines.length > 200) {
    console.error(`... diff truncated (${lines.length} lines total; full files in ${dir})`);
  }
} else {
  console.error(`Normalized specs written to ${dir} for manual comparison.`);
}
process.exit(1);
