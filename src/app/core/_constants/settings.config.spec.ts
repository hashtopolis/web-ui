import { DateFormat, TimeFormat, browserDateFormat, browserTimeFormat, dateFormats } from '@constants/settings.config';

describe('browserDateFormat', () => {
  /** Pins the locale Intl resolves to, which is otherwise whatever the test browser runs in. */
  function withLocale(locale: string): void {
    const real = Intl.DateTimeFormat;
    spyOn(Intl, 'DateTimeFormat').and.callFake(function (
      _locales?: Intl.LocalesArgument,
      options?: Intl.DateTimeFormatOptions
    ) {
      return new real(locale, options);
    } as unknown as typeof Intl.DateTimeFormat);
  }

  it('maps a day-first locale to the matching preset', () => {
    withLocale('en-GB');
    expect(browserDateFormat()).toBe(DateFormat.DAY_MONTH_YEAR_SLASH);
  });

  it('maps a dot-separated locale to the matching preset', () => {
    withLocale('de-CH');
    expect(browserDateFormat()).toBe(DateFormat.DAY_MONTH_YEAR_DOT);
  });

  it('maps a month-first locale to the matching preset', () => {
    withLocale('en-US');
    expect(browserDateFormat()).toBe(DateFormat.MONTH_DAY_YEAR_SLASH);
  });

  it('maps an ISO-style locale to the matching preset', () => {
    withLocale('sv-SE');
    expect(browserDateFormat()).toBe(DateFormat.YEAR_MONTH_DAY_DASH);
  });

  it('falls back for a locale whose date has no preset', () => {
    withLocale('zh-CN');
    expect(dateFormats.map((format) => format.value)).toContain(browserDateFormat());
  });

  it('returns a selectable option for the browser the tests run in', () => {
    expect(dateFormats.map((format) => format.value)).toContain(browserDateFormat());
  });
});

describe('browserTimeFormat', () => {
  function withLocale(locale: string): void {
    const real = Intl.DateTimeFormat;
    spyOn(Intl, 'DateTimeFormat').and.callFake(function (
      _locales?: Intl.LocalesArgument,
      options?: Intl.DateTimeFormatOptions
    ) {
      return new real(locale, options);
    } as unknown as typeof Intl.DateTimeFormat);
  }

  it('detects a 12-hour locale', () => {
    withLocale('en-US');
    expect(browserTimeFormat()).toBe(TimeFormat.TWELVE_HOUR);
  });

  it('detects a 24-hour locale', () => {
    withLocale('de-CH');
    expect(browserTimeFormat()).toBe(TimeFormat.TWENTY_FOUR_HOUR);
  });
});
