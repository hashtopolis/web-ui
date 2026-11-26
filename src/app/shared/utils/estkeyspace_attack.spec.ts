import { JFile } from '@models/file.model';

import { HashcatAttackMode, calculateKeyspace } from '@src/app/shared/utils/estkeyspace_attack';

declare const parser: { parse: (args: string[]) => void };

const file = (lineCount: number): JFile => ({ lineCount }) as JFile;

describe('calculateKeyspace', () => {
  it('multiplies the line counts of files in a combination attack', () => {
    const files = [file(120), file(30)];

    const result = calculateKeyspace(files, 'lineCount', 'hashcat -a 1 left.txt right.txt');

    expect(result).toBe(3600);
  });

  it('uses the requested file property for the count', () => {
    const files = [{ ...file(120), size: 25 }];

    const result = calculateKeyspace(files, 'size', 'hashcat -a 0 words.txt');

    expect(result).toBe(25);
  });

  it('returns the attack mode instead of the keyspace when requested', () => {
    const files = [file(120)];

    const result = calculateKeyspace(files, 'lineCount', 'hashcat -a 6 words.txt ?d', true);

    expect(result).toBe(HashcatAttackMode.HYBRID_WORDLIST_MASK);
  });

  it.each([
    ['?a', 95],
    ['?d', 10],
    ['?l', 26],
    ['?u', 26],
    ['?s', 33],
    ['?h', 16],
    ['?H', 16],
    ['?b', 256]
  ])('calculates the keyspace for the standard charset %s', (mask, expected) => {
    const result = calculateKeyspace([], 'lineCount', `hashcat -a 3 ${mask}`);

    expect(result).toStrictEqual([expected]);
  });

  it('multiplies repeated and mixed mask charsets while ignoring literal characters', () => {
    const result = calculateKeyspace([], 'lineCount', 'hashcat -a 3 prefix?d?d?l');

    expect(result).toStrictEqual([2600]);
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8])('uses custom charset %i in a mask', (index) => {
    const command = `hashcat -a 3 -${index} ?l?d! ?${index}?${index}`;

    const result = calculateKeyspace([], 'lineCount', command);

    expect(result).toStrictEqual([37 * 37]);
  });

  it('returns the brute-force attack mode in an array when a mask is present', () => {
    const result = calculateKeyspace([], 'lineCount', 'hashcat -a3 ?d', true);

    expect(result).toStrictEqual([HashcatAttackMode.BRUTE_FORCE]);
  });

  it('returns null for a brute-force command without a mask, or its mode when requested', () => {
    const command = 'hashcat -a 3';

    const keyspace = calculateKeyspace([], 'lineCount', command);
    const attackMode = calculateKeyspace([], 'lineCount', command, true);

    expect(keyspace).toBeNull();
    expect(attackMode).toBe(HashcatAttackMode.BRUTE_FORCE);
  });

  it('resets custom charsets between calls', () => {
    const first = calculateKeyspace([], 'lineCount', 'hashcat -a 3 -1 abc ?1');
    const second = calculateKeyspace([], 'lineCount', 'hashcat -a 3 -1 ab ?1');

    expect(first).toStrictEqual([3]);
    expect(second).toStrictEqual([2]);
  });

  it.each([
    ['', 'hashcat -a 0 words.txt'],
    ['lineCount', '']
  ])('rejects a missing property name or command', (name, command) => {
    const result = calculateKeyspace([file(10)], name, command);

    expect(result).toBe('Wrong Command');
  });

  it('returns an empty string when no files are supplied for a non-brute-force attack', () => {
    const result = calculateKeyspace([], 'lineCount', 'hashcat -a 0 words.txt');

    expect(result).toBe('');
  });

  it('returns an empty string when a requested count is missing', () => {
    const result = calculateKeyspace([file(10)], 'missing', 'hashcat -a 0 words.txt');

    expect(result).toBe('');
  });

  it('returns null for an empty file, but still returns the attack mode when requested', () => {
    const files = [file(0)];
    const command = 'hashcat -a 0 words.txt';

    const keyspace = calculateKeyspace(files, 'lineCount', command);
    const attackMode = calculateKeyspace(files, 'lineCount', command, true);

    expect(keyspace).toBeNull();
    expect(attackMode).toBe(HashcatAttackMode.STRAIGHT);
  });

  it('propagates parser errors', () => {
    const error = new Error('Invalid command');
    vi.spyOn(parser, 'parse').mockImplementation(() => {
      throw error;
    });

    const calculate = () => calculateKeyspace([file(10)], 'lineCount', 'hashcat -a 0 words.txt');

    expect(calculate).toThrow(error);
  });
});
