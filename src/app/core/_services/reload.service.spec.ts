import type { Mock } from 'vitest';

import { ReloadService } from '@services/reload.service';

describe('ReloadService', () => {
  let reload: Mock;

  beforeEach(() => {
    reload = vi.fn().mockName('location.reload');
  });
  it('reloads the current page', () => {
    vi.stubGlobal('window', { location: { reload } });
    try {
      new ReloadService().reloadPage();
      expect(reload).toHaveBeenCalledExactlyOnceWith();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
