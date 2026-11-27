/**
 * Text generators for the file preview specs. The xz fixtures next to this file were compressed from
 * exactly this output, so changing a generator means regenerating them (see `fixtures/README.md`).
 */

/** Text of `count` numbered lines, each terminated by a line feed. */
export const numberedLines = (count: number): string =>
  Array.from({ length: count }, (unused, index) => `line${index + 1}\n`).join('');

/** Lines of pseudo-random hex, which compressors can barely shrink, so a little text makes a large file. */
export const randomHexLines = (count: number): string => {
  let state = 1;
  const next = (): string => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state.toString(16).padStart(8, '0');
  };

  return Array.from({ length: count }, () => `${next()}${next()}\n`).join('');
};
