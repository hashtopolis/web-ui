import { parseHcmaskLine } from '@src/app/shared/utils/hcmask';

describe('parseHcmaskLine', () => {
  // --- Plain masks (no custom charsets) ---

  it('should return a plain mask as-is when no commas are present', () => {
    const result = parseHcmaskLine('?d?d?d?d?d?d');
    expect(result.mask).toBe('?d?d?d?d?d?d');
    expect(result.charsetFlags).toBe('');
  });

  it('should handle a single-character mask', () => {
    const result = parseHcmaskLine('?a');
    expect(result.mask).toBe('?a');
    expect(result.charsetFlags).toBe('');
  });

  it('should handle an empty string', () => {
    const result = parseHcmaskLine('');
    expect(result.mask).toBe('');
    expect(result.charsetFlags).toBe('');
  });

  // --- One custom charset ---

  it('should parse one custom charset correctly', () => {
    const result = parseHcmaskLine('?l?d,?1?1?1?1?1');
    expect(result.mask).toBe('?1?1?1?1?1');
    expect(result.charsetFlags).toBe('-1 ?l?d');
  });

  // --- Two custom charsets ---

  it('should parse two custom charsets correctly', () => {
    const result = parseHcmaskLine('?u?s,?l?d,?1?2?1?2?1?2');
    expect(result.mask).toBe('?1?2?1?2?1?2');
    expect(result.charsetFlags).toBe('-1 ?u?s -2 ?l?d');
  });

  // --- Three custom charsets ---

  it('should parse three custom charsets correctly', () => {
    const result = parseHcmaskLine('?l,?u,?d,?1?2?3?1?2?3');
    expect(result.mask).toBe('?1?2?3?1?2?3');
    expect(result.charsetFlags).toBe('-1 ?l -2 ?u -3 ?d');
  });

  // --- Four custom charsets ---

  it('should parse four custom charsets correctly', () => {
    const result = parseHcmaskLine('?l,?u,?d,?s,?1?2?3?4');
    expect(result.mask).toBe('?1?2?3?4');
    expect(result.charsetFlags).toBe('-1 ?l -2 ?u -3 ?d -4 ?s');
  });

  // --- More than 4+1 comma-separated fields (max 4 charsets) ---

  it('should cap custom charsets at 4 and join remaining fields as mask', () => {
    const result = parseHcmaskLine('?l,?u,?d,?s,?1?2?3,?4');
    expect(result.mask).toBe('?1?2?3,?4');
    expect(result.charsetFlags).toBe('-1 ?l -2 ?u -3 ?d -4 ?s');
  });

  // --- Fallback: commas present but mask does not reference custom charsets ---

  it('should treat as plain mask when mask does not reference ?1 (no hcmask format)', () => {
    // e.g. someone typed a mask that happens to contain a comma
    const result = parseHcmaskLine('?l?d,?d?d?d?d');
    expect(result.mask).toBe('?l?d,?d?d?d?d');
    expect(result.charsetFlags).toBe('');
  });

  it('should treat as plain mask when two fields but mask does not reference ?1', () => {
    const result = parseHcmaskLine('hello,world');
    expect(result.mask).toBe('hello,world');
    expect(result.charsetFlags).toBe('');
  });

  it('should treat as plain mask when charset defined but not referenced in mask', () => {
    // charset1 = ?l?d, but mask only uses built-in ?d — never ?1
    const result = parseHcmaskLine('?l?d,?d?d?d?l?l');
    expect(result.mask).toBe('?l?d,?d?d?d?l?l');
    expect(result.charsetFlags).toBe('');
  });

  // --- Real-world hcmask examples ---

  it('should handle hex charset definition', () => {
    const result = parseHcmaskLine('0123456789abcdef,?1?1?1?1');
    expect(result.mask).toBe('?1?1?1?1');
    expect(result.charsetFlags).toBe('-1 0123456789abcdef');
  });

  it('should handle mixed built-in and custom charsets in mask', () => {
    const result = parseHcmaskLine('?l?d,?1?1?d?d?1?1');
    expect(result.mask).toBe('?1?1?d?d?1?1');
    expect(result.charsetFlags).toBe('-1 ?l?d');
  });
});
