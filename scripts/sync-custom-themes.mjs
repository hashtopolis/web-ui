#!/usr/bin/env node
/**
 * Generate the custom-theme manifest + assets for a local dev server (no Docker).
 *
 * Mirrors `sync_custom_themes` in docker-entrypoint.sh so `ng serve` produces the
 * same `/assets/themes/custom-themes.json` the container would: it scans a source
 * folder of `.css` files, copies them into the served assets and writes a manifest
 * (with a `isDark` flag inferred from `color-scheme: dark`).
 *
 * Runs automatically on `npm start`; also available as `npm run themes:sync`.
 * Override the source folder with HASHTOPOLIS_CUSTOM_THEMES_DIR.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'fs';
import { basename, extname, join } from 'path';

const SOURCE_DIR = process.env.HASHTOPOLIS_CUSTOM_THEMES_DIR || 'custom-themes';
const TARGET_CSS_DIR = 'src/assets/custom-themes';
const MANIFEST_DIR = 'src/assets/themes';
const MANIFEST_FILE = join(MANIFEST_DIR, 'custom-themes.json');
const RESERVED_IDS = new Set(['light', 'dark']);

// Regenerate from scratch so removed themes don't linger.
rmSync(TARGET_CSS_DIR, { recursive: true, force: true });
mkdirSync(TARGET_CSS_DIR, { recursive: true });
mkdirSync(MANIFEST_DIR, { recursive: true });

const entries = [];
const seen = new Set();

if (existsSync(SOURCE_DIR)) {
  const cssFiles = readdirSync(SOURCE_DIR)
    .filter((name) => extname(name).toLowerCase() === '.css')
    .sort();

  for (const fileName of cssFiles) {
    const base = basename(fileName, extname(fileName));
    const id = base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!id) {
      console.warn(`Skipping invalid theme file: ${fileName}`);
      continue;
    }
    if (RESERVED_IDS.has(id) || seen.has(id)) {
      console.warn(`Skipping reserved/duplicate theme id: ${id}`);
      continue;
    }
    seen.add(id);

    const css = readFileSync(join(SOURCE_DIR, fileName), 'utf8');
    copyFileSync(join(SOURCE_DIR, fileName), join(TARGET_CSS_DIR, `${id}.css`));

    entries.push({
      value: id,
      description: base.replace(/[_-]+/g, ' ').replace(/["\\]/g, '').trim() || id,
      href: `/assets/custom-themes/${id}.css`,
      icon: 'style',
      isDark: /color-scheme\s*:[^;]*dark/i.test(css)
    });
  }
} else {
  console.warn(`Custom theme source directory not found: ${SOURCE_DIR}`);
}

writeFileSync(MANIFEST_FILE, `${JSON.stringify(entries, null, 2)}\n`);
console.log(`Synced ${entries.length} custom theme(s) from ${SOURCE_DIR} to ${TARGET_CSS_DIR}`);
