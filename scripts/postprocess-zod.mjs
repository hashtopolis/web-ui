/**
 * Post-process generated zod.gen.ts to fix bigint → number.
 *
 * The Zod plugin hardcodes z.coerce.bigint() for int64 fields,
 * but our J* interfaces use `number`. This script replaces all
 * bigint validator chains with plain z.number().
 */
import { readFileSync, writeFileSync } from 'fs';

const file = './src/generated/api/zod.gen.ts';
let content = readFileSync(file, 'utf-8');

const before = (content.match(/z\.coerce\.bigint\(\)/g) || []).length;

// Replace the full bigint chain (with int64 min/max) with z.number()
content = content.replaceAll(
  `z.coerce.bigint().min(BigInt('-9223372036854775808'), { error: 'Invalid value: Expected int64 to be >= -9223372036854775808' }).max(BigInt('9223372036854775807'), { error: 'Invalid value: Expected int64 to be <= 9223372036854775807' })`,
  'z.number()'
);

const after = (content.match(/z\.coerce\.bigint\(\)/g) || []).length;

writeFileSync(file, content);
console.log(`Replaced ${before - after} bigint chains with z.number() (${after} remaining)`);

if (after > 0) {
  console.warn('Warning: some bigint patterns were not replaced — check for variant chains');
}
