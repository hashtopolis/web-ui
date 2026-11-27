import * as WordpolisOriginal from 'wordpolis';

import { Wordpolis } from '@src/app/shared/wordlist-generator/wordpolis-wrapper';

describe('Wordpolis wrapper', () => {
  it('exposes the original candidate generator', () => {
    expect(Wordpolis.generateCandidates).toBe(WordpolisOriginal.generateCandidates);
  });

  it('allows the generator to be spied on and restored', () => {
    const spy = vi.spyOn(Wordpolis, 'generateCandidates').mockReturnValue(undefined);

    expect(Wordpolis.generateCandidates).toBe(spy);
    spy.mockRestore();
    expect(Wordpolis.generateCandidates).toBe(WordpolisOriginal.generateCandidates);
  });
});
