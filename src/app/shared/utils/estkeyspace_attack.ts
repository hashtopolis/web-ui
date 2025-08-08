/**
 * This file contains the logic to calculate the estimated keyspace and attack runtime
 * for hashcat attacks based on the provided command and asset files.
 *
 * It uses a parser to extract options from the command and calculates the keyspace
 * based on the number of lines in the provided files.
 */

import { JFile } from '@models/file.model';

/**
 * Interface representing the options parsed from an attack command.
 *
 * - `ruleFiles`: List of rule files applied in the attack.
 * - `posArgs`: Positional arguments extracted from the command line.
 * - `unrecognizedFlag`: Flags not recognized by the parser.
 * - `customCharset1` to `customCharset4`: Custom character sets used in mask attacks.
 * - `attackType`: Numeric code representing the attack mode (e.g., brute-force, mask, dictionary).
 * - Additional properties can be included as needed.
 */
interface ParserOptions {
  ruleFiles: string[];
  posArgs: string[];
  unrecognizedFlag: string[];
  customCharset1: string;
  customCharset2: string;
  customCharset3: string;
  customCharset4: string;
  attackType: number;
  [key: string]: unknown;
}

/**
 * Global parser object responsible for parsing command-line arguments into options.
 * This parser utilizes the optparse logic from the assets folder to interpret
 * the attack command parameters.
 * Expected to have a method `parse` that takes an array of strings (arguments) and processes them.
 */
declare let parser: { parse: (args: string[]) => void };

/**
 * Current attack options parsed from the command string.
 * This object is reset and updated before each keyspace calculation.
 */
declare let options: ParserOptions;

/**
 * Default attack options used as a baseline to reset `options` before parsing new commands.
 */
declare let defaultOptions: ParserOptions;

/**
 * This function calculates the keyspace using the asset files optparse located in assets folder
 * @param file - Object
 * @param name - files object to extract line count
 * @param cmd - Attack
 * @param attacktype - If true, returns attack type
 * @returns number
 **/
export const calculateKeyspace = (
  file: JFile[],
  name: string,
  cmd: string,
  attacktype?: boolean
): number | string | [number] | null => {
  if (!cmd || !name) {
    return 'Wrong Command';
  }

  // Reset options before parsing
  options = { ...defaultOptions };
  options.ruleFiles = [];
  options.posArgs = [];
  options.unrecognizedFlag = [];

  // Normalize and split args
  const args = cmd
    .replace('hashcat', '')
    .replace(/(-a)(\d)(\s)/, '-a $2 ')
    .replace(/(-\d)(\S+)(\s)/, '$1 $2 ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/ |=/g);

  parser.parse(args);

  // Handle brute-force attack type (attackType === 3) first, no need for files
  if (options.attackType === 3) {
    for (const posArg of options.posArgs) {
      if (posArg.includes('?')) {
        const keyspace = attacktype ? options.attackType : maskToKeyspace(posArg);
        return [keyspace];
      }
    }
    // fallback for brute-force with no valid mask found
    return attacktype ? options.attackType : null;
  }

  // For other attack types, extract line counts from files
  const counts = file.map((v) => Number(v[name]));

  // Only return '' here if the file list is empty or any count is NaN AND it's NOT a brute-force attack
  if (counts.length === 0 || counts.some(isNaN)) {
    return '';
  }

  const mpow = counts.reduce((a, i) => a * i, 1);

  // For other attacks, return keyspace or attack type
  if (mpow > 0 && options.attackType !== 3) {
    return attacktype ? options.attackType : mpow;
  }

  return attacktype ? options.attackType : null;
};

/**
 * Calculates the total keyspace size represented by a given mask string.
 *
 * This function calculates the product of all charset sizes used in the mask,
 * including both standard charsets (like ?a, ?d) and custom charsets (?1 - ?4).
 * It uses `customCharsetToOptions` to compute the size of each custom charset.
 *
 * @param mask - The mask string representing the attack pattern.
 * @returns The total keyspace size as a number.
 */
const maskToKeyspace = (mask: string): number => {
  const charsetCount = (cs: string, ch: string) =>
    cs ? Math.pow(customCharsetToOptions(cs), (mask.match(new RegExp(`\\${ch}`, 'g')) || []).length) : 1;

  const custom =
    charsetCount(options.customCharset1, '?1') *
    charsetCount(options.customCharset2, '?2') *
    charsetCount(options.customCharset3, '?3') *
    charsetCount(options.customCharset4, '?4');

  const standardCounts = {
    '?a': 95,
    '?d': 10,
    '?l': 26,
    '?u': 26,
    '?s': 33,
    '?h': 16,
    '?H': 16,
    '?b': 256
  };

  const standard = Object.entries(standardCounts).reduce(
    (total, [symbol, size]) => total * Math.pow(size, (mask.match(new RegExp(`\\${symbol}`, 'g')) || []).length),
    1
  );

  return custom * standard;
};

/**
 * Calculates the size of a custom charset in the mask string.
 *
 * Each standard charset symbol (e.g., ?a, ?d) has a predefined size.
 * This function counts occurrences of each charset symbol in the mask
 * and sums their contributions to the total charset size.
 * Additionally, it adjusts for characters in the mask not covered by standard charsets.
 *
 * @param mask - The mask string to analyze, e.g. "?a?d?1?2"
 * @returns The calculated size of the custom charset in the mask.
 */
const customCharsetToOptions = (mask: string): number => {
  const counts = {
    '?a': 95,
    '?d': 10,
    '?l': 26,
    '?u': 26,
    '?s': 33,
    '?h': 16,
    '?H': 16,
    '?b': 256
  };

  let total = 0;
  for (const [key, val] of Object.entries(counts)) {
    const matchCount = (mask.match(new RegExp(`\\${key}`, 'g')) || []).length;
    total += val * Math.min(1, matchCount);
  }

  const standardCount = Object.keys(counts).reduce(
    (sum, key) => sum + 2 * (mask.match(new RegExp(`\\${key}`, 'g')) || []).length,
    0
  );

  total += mask.length - standardCount;
  return total;
};
