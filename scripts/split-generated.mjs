#!/usr/bin/env node
/**
 * Post-process generated files from @hey-api/openapi-ts:
 * 1. Fix bigint -> number in zod schemas
 * 2. Split zod.gen.ts into per-resource files under zod/
 * 3. Split types.gen.ts into per-resource files under types/
 *
 * Run after openapi-ts generation:
 *   openapi-ts -f openapi-ts.config.mjs && node scripts/split-generated.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

const BASE_DIR = './src/generated/api';
const ZOD_FILE = join(BASE_DIR, 'zod.gen.ts');
const TYPES_FILE = join(BASE_DIR, 'types.gen.ts');
const ZOD_OUT_DIR = join(BASE_DIR, 'zod');
const TYPES_OUT_DIR = join(BASE_DIR, 'types');

// ─── Resource Configuration ───────────────────────────────────────────

// Model schema prefix -> output file name (longest first to avoid ambiguous matches)
const RESOURCE_PREFIXES = [
  ['GlobalPermissionGroup', 'global-permission-group'],
  ['NotificationSetting', 'notification-setting'],
  ['CrackerBinaryType', 'cracker-binary-type'],
  ['HealthCheckAgent', 'health-check-agent'],
  ['AgentAssignment', 'agent-assignment'],
  ['CrackerBinary', 'cracker-binary'],
  ['AgentBinary', 'agent-binary'],
  ['ConfigSection', 'config-section'],
  ['TaskWrapper', 'task-wrapper'],
  ['AccessGroup', 'access-group'],
  ['AgentError', 'agent-error'],
  ['HealthCheck', 'health-check'],
  ['AgentStat', 'agent-stat'],
  ['Preprocessor', 'preprocessor'],
  ['Supertask', 'supertask'],
  ['ApiToken', 'api-token'],
  ['Hashlist', 'hashlist'],
  ['HashType', 'hash-type'],
  ['LogEntry', 'log-entry'],
  ['PreTask', 'pre-task'],
  ['Voucher', 'voucher'],
  ['Config', 'config'],
  ['Agent', 'agent'],
  ['Chunk', 'chunk'],
  ['Speed', 'speed'],
  ['File', 'file'],
  ['Hash', 'hash'],
  ['Task', 'task'],
  ['User', 'user']
];

// Operation URL segment -> output file name (longest first)
const OPERATION_SEGMENTS = [
  ['Globalpermissiongroups', 'global-permission-group'],
  ['Healthcheckagents', 'health-check-agent'],
  ['Agentassignments', 'agent-assignment'],
  ['Agentbinaries', 'agent-binary'],
  ['Agenterrors', 'agent-error'],
  ['Taskwrappers', 'task-wrapper'],
  ['Configsections', 'config-section'],
  ['Crackertypes', 'cracker-binary-type'],
  ['Notifications', 'notification-setting'],
  ['Preprocessors', 'preprocessor'],
  ['Accessgroups', 'access-group'],
  ['Healthchecks', 'health-check'],
  ['Agentstats', 'agent-stat'],
  ['Logentries', 'log-entry'],
  ['ApiTokens', 'api-token'],
  ['Supertasks', 'supertask'],
  ['Hashlists', 'hashlist'],
  ['Hashtypes', 'hash-type'],
  ['Crackers', 'cracker-binary'],
  ['Pretasks', 'pre-task'],
  ['Vouchers', 'voucher'],
  ['Configs', 'config'],
  ['Agents', 'agent'],
  ['Chunks', 'chunk'],
  ['Speeds', 'speed'],
  ['Hashes', 'hash'],
  ['Files', 'file'],
  ['Tasks', 'task'],
  ['Users', 'user']
];

// Names that belong in common.ts
const COMMON_NAMES = new Set(['ErrorResponse', 'NotFoundResponse', 'Token', 'TokenRequest', 'ClientOptions']);

// TypeScript built-in type names to ignore during cross-reference detection
const TS_BUILTINS = new Set([
  'Array',
  'Record',
  'Partial',
  'Required',
  'Pick',
  'Omit',
  'Exclude',
  'Extract',
  'NonNullable',
  'ReturnType',
  'Promise',
  'Map',
  'Set',
  'Object',
  'Function',
  'Boolean',
  'String',
  'Number',
  'BigInt',
  'Symbol'
]);

// ─── Bigint Fix ───────────────────────────────────────────────────────

const BIGINT_CHAIN =
  "z.coerce.bigint().min(BigInt('-9223372036854775808'), { error: 'Invalid value: Expected int64 to be >= -9223372036854775808' }).max(BigInt('9223372036854775807'), { error: 'Invalid value: Expected int64 to be <= 9223372036854775807' })";

function fixBigint(content) {
  const before = (content.match(/z\.coerce\.bigint\(\)/g) || []).length;
  content = content.replaceAll(BIGINT_CHAIN, 'z.number()');
  const after = (content.match(/z\.coerce\.bigint\(\)/g) || []).length;
  console.log(`  Replaced ${before - after} bigint chains with z.number() (${after} remaining)`);
  if (after > 0) {
    console.warn('  Warning: some bigint patterns were not replaced — check for variant chains');
  }
  return content;
}

// ─── Block Parsing ────────────────────────────────────────────────────

/**
 * Parse a generated file into named export blocks.
 *
 * For zod.gen.ts:  exportPattern = /^export const (z[A-Z]\w+)/
 * For types.gen.ts: exportPattern = /^export type (\w+)/
 *
 * Each block includes any preceding JSDoc comment.
 */
function parseBlocks(content, exportPattern) {
  const lines = content.split('\n');
  const boundaries = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(exportPattern);
    if (match) {
      let start = i;
      // Include preceding JSDoc comment block
      if (start > 0 && lines[start - 1].trim() === '*/') {
        let j = start - 2;
        while (j >= 0 && !lines[j].trim().startsWith('/**')) j--;
        if (j >= 0) start = j;
      }
      boundaries.push({ name: match[1], startLine: start });
    }
  }

  const blocks = [];
  for (let i = 0; i < boundaries.length; i++) {
    const start = boundaries[i].startLine;
    const end = i + 1 < boundaries.length ? boundaries[i + 1].startLine : lines.length;

    // Trim trailing empty lines
    let endTrimmed = end;
    while (endTrimmed > start && lines[endTrimmed - 1].trim() === '') endTrimmed--;

    blocks.push({
      name: boundaries[i].name,
      content: lines.slice(start, endTrimmed).join('\n')
    });
  }

  return blocks;
}

// ─── Classification ───────────────────────────────────────────────────

/**
 * Classify a schema/type name to a resource file name.
 * @param {string} name - The export name (e.g., "zAccessGroupResponse" or "AccessGroupResponse")
 * @param {boolean} isZod - Whether this is a zod schema (has "z" prefix)
 * @returns {string} The target file name (without extension)
 */
function classifyName(name, isZod) {
  const baseName = isZod ? name.slice(1) : name;

  // Common/shared types
  if (COMMON_NAMES.has(baseName)) return 'common';

  // HelperApi model schemas
  if (baseName.includes('HelperApi')) return 'helper';

  // Operation schemas: start with HTTP method verb
  const opMatch = baseName.match(/^(Get|Post|Patch|Delete|Head)(.+)$/);
  if (opMatch) {
    const remainder = opMatch[2];

    // PostToken* -> login
    if (remainder.startsWith('Token')) return 'login';

    // Match against URL segments (longest first)
    for (const [segment, file] of OPERATION_SEGMENTS) {
      if (remainder.startsWith(segment)) return file;
    }

    // Unmatched operation -> helper
    return 'helper';
  }

  // Model schemas: match by resource prefix (longest first)
  for (const [prefix, file] of RESOURCE_PREFIXES) {
    if (baseName.startsWith(prefix)) return file;
  }

  // Fallback -> helper
  console.warn(`  Warning: unclassified name "${name}" -> helper`);
  return 'helper';
}

// ─── Cross-Reference Detection ────────────────────────────────────────

/**
 * Find cross-file references in zod blocks.
 * Scans for z[A-Z]... identifiers that reference schemas in other files.
 */
function buildZodCrossRefs(blocks, nameToFile) {
  // file -> Map<sourceFile, Set<importedName>>
  const fileCrossRefs = new Map();

  for (const block of blocks) {
    const selfFile = nameToFile.get(block.name);
    const matches = [...block.content.matchAll(/\bz([A-Z]\w+)\b/g)];

    for (const match of matches) {
      const refName = 'z' + match[1];
      if (refName === block.name) continue;

      const refFile = nameToFile.get(refName);
      if (!refFile || refFile === selfFile) continue;

      if (!fileCrossRefs.has(selfFile)) fileCrossRefs.set(selfFile, new Map());
      const imports = fileCrossRefs.get(selfFile);
      if (!imports.has(refFile)) imports.set(refFile, new Set());
      imports.get(refFile).add(refName);
    }
  }

  return fileCrossRefs;
}

/**
 * Find cross-file references in type blocks.
 * Scans for PascalCase identifiers that match known exported type names.
 */
function buildTypeCrossRefs(blocks, nameToFile, allTypeNames) {
  const fileCrossRefs = new Map();

  for (const block of blocks) {
    const selfFile = nameToFile.get(block.name);
    const matches = [...block.content.matchAll(/\b([A-Z][a-zA-Z0-9]+)\b/g)];

    for (const match of matches) {
      const refName = match[1];
      if (refName === block.name) continue;
      if (TS_BUILTINS.has(refName)) continue;
      if (!allTypeNames.has(refName)) continue;

      const refFile = nameToFile.get(refName);
      if (!refFile || refFile === selfFile) continue;

      if (!fileCrossRefs.has(selfFile)) fileCrossRefs.set(selfFile, new Map());
      const imports = fileCrossRefs.get(selfFile);
      if (!imports.has(refFile)) imports.set(refFile, new Set());
      imports.get(refFile).add(refName);
    }
  }

  return fileCrossRefs;
}

// ─── File Writing ─────────────────────────────────────────────────────

/**
 * Write per-resource split files.
 * @param {Array} blocks - Parsed blocks
 * @param {Map} nameToFile - name -> target file name
 * @param {Map} crossRefs - file -> Map<sourceFile, Set<name>>
 * @param {string} outDir - Output directory
 * @param {object} options - { zodImport: boolean, typeImport: boolean }
 * @returns {string[]} List of written file names
 */
function writeSplitFiles(blocks, nameToFile, crossRefs, outDir, options) {
  // Group blocks by target file
  const fileBlocks = new Map();
  for (const block of blocks) {
    const file = nameToFile.get(block.name);
    if (!fileBlocks.has(file)) fileBlocks.set(file, []);
    fileBlocks.get(file).push(block);
  }

  const writtenFiles = [];

  for (const [fileName, blockList] of fileBlocks) {
    const parts = [];

    // Zod import header
    if (options.zodImport) {
      parts.push("import * as z from 'zod';");
    }

    // Cross-file imports
    const imports = crossRefs.get(fileName);
    if (imports) {
      const importLines = [];
      for (const [sourceFile, names] of [...imports].sort((a, b) => a[0].localeCompare(b[0]))) {
        const sorted = [...names].sort();
        const keyword = options.zodImport ? 'import' : 'import type';
        importLines.push(`${keyword} { ${sorted.join(', ')} } from './${sourceFile}';`);
      }
      if (importLines.length > 0) parts.push(importLines.join('\n'));
    }

    // Block contents
    parts.push(blockList.map((b) => b.content).join('\n\n'));

    const filePath = join(outDir, `${fileName}.ts`);
    writeFileSync(filePath, parts.join('\n\n') + '\n');
    writtenFiles.push(fileName);
  }

  return writtenFiles;
}

function writeBarrelIndex(outDir, fileNames) {
  const lines = fileNames.sort().map((f) => `export * from './${f}';`);
  writeFileSync(join(outDir, 'index.ts'), lines.join('\n') + '\n');
}

// ─── Main ─────────────────────────────────────────────────────────────

function main() {
  console.log('Post-processing generated API files...\n');

  // 1. Read source files
  let zodContent = readFileSync(ZOD_FILE, 'utf-8');
  const typesContent = readFileSync(TYPES_FILE, 'utf-8');

  // 2. Apply bigint fix to zod content
  console.log('Fixing bigint chains in zod.gen.ts:');
  zodContent = fixBigint(zodContent);
  writeFileSync(ZOD_FILE, zodContent);

  // 3. Parse blocks
  console.log('\nParsing zod.gen.ts...');
  const zodBlocks = parseBlocks(zodContent, /^export const (z[A-Z]\w+)/);
  console.log(`  Found ${zodBlocks.length} schema blocks`);

  console.log('Parsing types.gen.ts...');
  const typeBlocks = parseBlocks(typesContent, /^export type (\w+)/);
  console.log(`  Found ${typeBlocks.length} type blocks`);

  // 4. Classify all blocks to resource files
  const zodNameToFile = new Map();
  for (const block of zodBlocks) {
    zodNameToFile.set(block.name, classifyName(block.name, true));
  }

  const typeNameToFile = new Map();
  for (const block of typeBlocks) {
    typeNameToFile.set(block.name, classifyName(block.name, false));
  }

  const zodFileCount = new Set(zodNameToFile.values()).size;
  const typeFileCount = new Set(typeNameToFile.values()).size;
  console.log(`\nZod schemas classified into ${zodFileCount} resource files`);
  console.log(`Type definitions classified into ${typeFileCount} resource files`);

  // 5. Detect cross-file references
  const zodCrossRefs = buildZodCrossRefs(zodBlocks, zodNameToFile);
  const typeCrossRefs = buildTypeCrossRefs(typeBlocks, typeNameToFile, new Set(typeNameToFile.keys()));

  // 6. Clean and create output directories
  rmSync(ZOD_OUT_DIR, { recursive: true, force: true });
  rmSync(TYPES_OUT_DIR, { recursive: true, force: true });
  mkdirSync(ZOD_OUT_DIR, { recursive: true });
  mkdirSync(TYPES_OUT_DIR, { recursive: true });

  // 7. Write split zod files
  console.log('\nWriting zod split files...');
  const zodFileNames = writeSplitFiles(zodBlocks, zodNameToFile, zodCrossRefs, ZOD_OUT_DIR, { zodImport: true });
  writeBarrelIndex(ZOD_OUT_DIR, zodFileNames);
  console.log(`  Wrote ${zodFileNames.length} resource files + barrel index`);

  // 8. Write split type files
  console.log('Writing types split files...');
  const typeFileNames = writeSplitFiles(typeBlocks, typeNameToFile, typeCrossRefs, TYPES_OUT_DIR, { zodImport: false });
  writeBarrelIndex(TYPES_OUT_DIR, typeFileNames);
  console.log(`  Wrote ${typeFileNames.length} resource files + barrel index`);

  // 9. Remove .gen.ts files (no longer needed — split files are the source of truth)
  console.log('\nRemoving .gen.ts files...');
  rmSync(ZOD_FILE);
  rmSync(TYPES_FILE);

  // 10. Simplify index.ts to re-export from types barrel
  const INDEX_FILE = join(BASE_DIR, 'index.ts');
  writeFileSync(INDEX_FILE, "// This file is auto-generated by @hey-api/openapi-ts\n\nexport * from './types';\n");

  console.log('\nDone!');
}

main();
