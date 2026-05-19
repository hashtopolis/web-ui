import { TestBed } from '@angular/core/testing';

import { ApiKeyRevealStore } from '@services/api-key-reveal.store';

describe('ApiKeyRevealStore', () => {
  let store: ApiKeyRevealStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ApiKeyRevealStore);
  });

  it('returns null when nothing has been set', () => {
    expect(store.consume()).toBeNull();
  });

  it('returns the value previously set', () => {
    store.set('jwt-abc');
    expect(store.consume()).toBe('jwt-abc');
  });

  it('clears the value so a second consume returns null', () => {
    store.set('jwt-abc');
    store.consume();
    expect(store.consume()).toBeNull();
  });

  it('set() overwrites a previous unread token', () => {
    store.set('first');
    store.set('second');
    expect(store.consume()).toBe('second');
  });
});
