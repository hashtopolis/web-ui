import { CookieService } from '@services/shared/cookies.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    service = new CookieService();
    document.cookie = 'tooltip=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'autorefresh=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  it('returns the default setting without writing a cookie when defaults are enabled', () => {
    const setCookieSpy = vi.spyOn(service, 'setCookie');

    const result = service.checkDefault(true, false, 'tooltip', '0', 365);

    expect(result).toBe(false);
    expect(setCookieSpy).not.toHaveBeenCalled();
    expect(service.defaultSettings).toBe(false);
  });

  it('writes the default cookie and prevents the event when defaults are disabled', () => {
    const event = new Event('click', { cancelable: true });

    const result = service.checkDefault(false, event, 'tooltip', '0', 365);

    expect(result).toBe('');
    expect(service.defaultSettings).toBe(true);
    expect(event.defaultPrevented).toBe(true);
    expect(service.getCookie('tooltip')).toBe('0');
  });

  it('returns the updated default setting on a subsequent check', () => {
    service.checkDefault(false, false, 'tooltip', '0', 365);

    const result = service.checkDefault(true, false, 'tooltip', '0', 365);

    expect(result).toBe(true);
  });

  it('sets default cookies when they are missing', () => {
    service.checkDefaultCookies();

    expect(service.getCookie('tooltip')).toBe('0');
    expect(service.getCookie('autorefresh')).toBe('{"active":false,"value":"10"}');
  });

  it('preserves existing cookie values when checking defaults', () => {
    document.cookie = 'tooltip=1';

    service.checkDefaultCookies();

    expect(service.getCookie('tooltip')).toBe('1');
    expect(service.getCookie('autorefresh')).toBe('{"active":false,"value":"10"}');
  });

  it('returns an empty string when the requested cookie is missing', () => {
    const result = service.getCookie('missing');

    expect(result).toBe('');
  });

  it('returns the requested cookie value without matching a longer cookie name', () => {
    document.cookie = 'sessionIdLong=wrong';
    document.cookie = 'sessionId=correct';

    const result = service.getCookie('sessionId');

    expect(result).toBe('correct');
  });

  it('decodes an encoded cookie value', () => {
    document.cookie = 'greeting=hello%20world';

    const result = service.getCookie('greeting');

    expect(result).toBe('hello world');
  });

  it('sets the cookie value, expiry date, and optional path', () => {
    vi.useFakeTimers({ toFake: ['Date'] });

    try {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const cookieSetter = vi.spyOn(document, 'cookie', 'set');

      service.setCookie('theme', 'dark', 1, '/settings');

      expect(cookieSetter).toHaveBeenCalledExactlyOnceWith(
        'theme=dark; expires=Tue, 02 Jan 2024 00:00:00 GMT; path=/settings; SameSite=Lax'
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it('omits the path attribute when no path is provided', () => {
    vi.useFakeTimers({ toFake: ['Date'] });

    try {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const cookieSetter = vi.spyOn(document, 'cookie', 'set');

      service.setCookie('theme', 'dark', 0);

      expect(cookieSetter).toHaveBeenCalledExactlyOnceWith(
        'theme=dark; expires=Mon, 01 Jan 2024 00:00:00 GMT; SameSite=Lax'
      );
    } finally {
      vi.useRealTimers();
    }
  });
});
