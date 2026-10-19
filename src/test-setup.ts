// Global setup for the Vitest unit tests. The builder runs it after the polyfills and the
// TestBed initialisation. Stubs for browser APIs that jsdom does not implement go here.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInThisContext } from 'node:vm';

// The jsdom run does not load the global `scripts` from angular.json, but the keyspace calculation
// relies on the globals they declare (`parser`, `options`, `defaultOptions`). Run them as classic
// scripts, in the angular.json order, so their top-level bindings become globals. The tests share
// one context per worker, so run them only once: a second run would redeclare their `let` bindings.
const optparseScripts = ['src/assets/optparse/optparse.1.1.1.js', 'src/assets/optparse/optparse.hashtopolis.1.1.1.js'];
if (!('parser' in globalThis)) {
  for (const script of optparseScripts) {
    const filename = resolve(script);
    runInThisContext(readFileSync(filename, 'utf8'), { filename });
  }
}
