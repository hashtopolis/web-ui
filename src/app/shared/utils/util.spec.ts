import { truncateMiddle } from '@src/app/shared/utils/util';

describe('truncateMiddle', () => {
  it('returns the value unchanged when it is not longer than maxLength', () => {
    expect(truncateMiddle('000405dbc07c3b595fc87031af6f9879', 64, 10)).toBe('000405dbc07c3b595fc87031af6f9879');
  });

  it('leaves a value at exactly maxLength untouched (boundary)', () => {
    const sha256 = 'a'.repeat(64);
    expect(truncateMiddle(sha256, 64, 10)).toBe(sha256);
  });

  it('cuts a contiguous middle slice once longer than maxLength', () => {
    // 65 chars: keep first 54 + "…" + last 10, removing exactly the 1 middle char (index 54).
    const value = Array.from({ length: 65 }, (_, i) => String(i % 10)).join('');
    const result = truncateMiddle(value, 64, 10);
    expect(result).toBe(value.slice(0, 54) + '…' + value.slice(-10));
  });

  it('never overlaps the start and end slices (no duplicated characters)', () => {
    const value = 'x'.repeat(128);
    const [start, end] = truncateMiddle(value, 64, 10).split('…');
    // start + end must sum to at most maxLength, so the ellipsis stands for real omitted chars.
    expect(start.length + end.length).toBe(64);
    expect(128 - (start.length + end.length)).toBeGreaterThan(0);
  });

  it('is never rendered longer than the original value', () => {
    const value = 'y'.repeat(65);
    expect(truncateMiddle(value, 64, 10).length).toBeLessThanOrEqual(value.length);
  });
});
