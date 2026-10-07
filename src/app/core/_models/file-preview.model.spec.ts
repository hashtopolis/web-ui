import { walkLines } from '@models/file-preview.model';

describe('walkLines', () => {
  const encode = (text: string): Uint8Array => new TextEncoder().encode(text);

  it('stops after the asked-for number of whole lines', () => {
    expect(walkLines(encode('a\nb\nc\n'), 0, 2)).toEqual({ to: 4, lineCount: 2 });
  });

  it('stops after the last terminator when the bytes hold fewer lines than asked for', () => {
    // "xyz" has no terminator, so it is not a whole line and stays beyond `to`.
    expect(walkLines(encode('a\nb\nxyz'), 0, 10)).toEqual({ to: 4, lineCount: 2 });
  });

  it('makes no progress over bytes that hold no terminator at all', () => {
    expect(walkLines(encode('abc'), 0, 10)).toEqual({ to: 0, lineCount: 0 });
  });

  it('starts walking at the given offset', () => {
    expect(walkLines(encode('a\nb\nc\n'), 2, 1)).toEqual({ to: 4, lineCount: 1 });
  });
});
