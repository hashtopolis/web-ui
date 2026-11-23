import { StaticArrayKind, StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';

describe('StaticArrayPipe', () => {
  const pipe = new StaticArrayPipe();

  it.each([
    [StaticArrayKind.OS, 0, '<span class="fab fa-linux" aria-hidden="true"></span>'],
    [StaticArrayKind.OS, 1, '<span class="fab fa-windows" aria-hidden="true"></span>'],
    [StaticArrayKind.OS, 2, '<span class="fab fa-apple" aria-hidden="true"></span>'],
    [StaticArrayKind.STATES, 0, 'New'],
    [StaticArrayKind.STATES, 1, 'Init'],
    [StaticArrayKind.STATES, 2, 'Running'],
    [StaticArrayKind.STATES, 3, 'Paused'],
    [StaticArrayKind.STATES, 4, 'Exhausted'],
    [StaticArrayKind.STATES, 5, 'Cracked'],
    [StaticArrayKind.STATES, 6, 'Aborted'],
    [StaticArrayKind.STATES, 7, 'Quit'],
    [StaticArrayKind.STATES, 8, 'Bypass'],
    [StaticArrayKind.STATES, 9, 'Trimmed'],
    [StaticArrayKind.STATES, 10, 'Aborting...'],
    [StaticArrayKind.STATES_COLOR, 0, 'orange'],
    [StaticArrayKind.STATES_COLOR, 1, 'black'],
    [StaticArrayKind.STATES_COLOR, 2, 'green'],
    [StaticArrayKind.STATES_COLOR, 3, 'black'],
    [StaticArrayKind.STATES_COLOR, 4, 'black'],
    [StaticArrayKind.STATES_COLOR, 5, 'blue'],
    [StaticArrayKind.STATES_COLOR, 6, 'red'],
    [StaticArrayKind.STATES_COLOR, 7, 'red'],
    [StaticArrayKind.STATES_COLOR, 8, 'red'],
    [StaticArrayKind.STATES_COLOR, 9, 'red'],
    [StaticArrayKind.STATES_COLOR, 10, 'red'],
    [StaticArrayKind.FORMATS, 0, 'Text'],
    [StaticArrayKind.FORMATS, 1, 'HCCAPX / PMKID'],
    [StaticArrayKind.FORMATS, 2, 'Binary'],
    [StaticArrayKind.FORMATS, 3, 'Superhashlist'],
    [StaticArrayKind.FORMAT_TABLES, 0, 'hashes'],
    [StaticArrayKind.FORMAT_TABLES, 1, 'hashes_binary'],
    [StaticArrayKind.FORMAT_TABLES, 2, 'hashes_binary'],
    [StaticArrayKind.PLATFORMS, 0, 'unknown'],
    [StaticArrayKind.PLATFORMS, 1, 'NVidia'],
    [StaticArrayKind.PLATFORMS, 2, 'AMD'],
    [StaticArrayKind.PLATFORMS, 3, 'CPU']
  ])('returns the %s entry for ID %i', (kind, id, expected) => {
    const result = pipe.transform(id, kind);

    expect(result).toBe(expected);
  });

  it.each([StaticArrayKind.OS, StaticArrayKind.PLATFORMS])('returns unknown for %s ID -1', (kind) => {
    const result = pipe.transform(-1, kind);

    expect(result).toBe('unknown');
  });

  it.each(Object.values(StaticArrayKind))('returns an empty string for an undefined %s ID', (kind) => {
    const result = pipe.transform(undefined, kind);

    expect(result).toBe('');
  });

  it.each([
    [StaticArrayKind.OS, -2, 3],
    [StaticArrayKind.STATES, -1, 11],
    [StaticArrayKind.STATES_COLOR, -1, 11],
    [StaticArrayKind.FORMATS, -1, 4],
    [StaticArrayKind.FORMAT_TABLES, -1, 3],
    [StaticArrayKind.PLATFORMS, -2, 4]
  ])('returns undefined for out-of-range %s IDs', (kind, belowMinimum, aboveMaximum) => {
    const belowResult = pipe.transform(belowMinimum, kind);
    const aboveResult = pipe.transform(aboveMaximum, kind);

    expect(belowResult).toBeUndefined();
    expect(aboveResult).toBeUndefined();
  });
});
