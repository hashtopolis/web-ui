import { firstValueFrom, of, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { RuntimeThemeOption, ThemeCatalogService } from '@services/shared/theme-catalog.service';

const BUILT_IN_THEMES: RuntimeThemeOption[] = [
  {
    value: 'light',
    description: 'Light Mode',
    icon: 'light_mode',
    source: 'builtin',
    isDark: false
  },
  {
    value: 'dark',
    description: 'Dark Mode',
    icon: 'dark_mode',
    source: 'builtin',
    isDark: true
  }
];

describe('ThemeCatalogService', () => {
  let service: ThemeCatalogService;
  let httpGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    httpGet = vi.fn().mockName('HttpClient.get').mockReturnValue(of([]));
    TestBed.configureTestingModule({
      providers: [ThemeCatalogService, { provide: HttpClient, useValue: { get: httpGet } }]
    });
    service = TestBed.inject(ThemeCatalogService);
  });

  it('returns the built-in themes with their configured icons and dark-mode flags', async () => {
    const themes = await firstValueFrom(service.getThemes());

    expect(themes).toStrictEqual(BUILT_IN_THEMES);
    expect(httpGet).toHaveBeenCalledExactlyOnceWith('/assets/themes/custom-themes.json');
  });

  it('adds valid custom themes and normalizes optional display fields', async () => {
    httpGet.mockReturnValue(
      of([
        {
          value: ' midnight ',
          description: ' Night theme ',
          href: ' /themes/night.css ',
          icon: ' moon ',
          isDark: true
        },
        { value: 'soft', description: '  ', href: '/themes/soft.css', icon: ' ' }
      ])
    );

    const themes = await firstValueFrom(service.getThemes());

    expect(themes).toStrictEqual([
      ...BUILT_IN_THEMES,
      {
        value: 'midnight',
        description: 'Night theme',
        href: '/themes/night.css',
        icon: 'moon',
        source: 'custom',
        isDark: true
      },
      {
        value: 'soft',
        description: 'soft',
        href: '/themes/soft.css',
        icon: 'style',
        source: 'custom',
        isDark: false
      }
    ]);
  });

  it('ignores reserved, duplicate, malformed and incomplete custom themes', async () => {
    httpGet.mockReturnValue(
      of([
        { value: '', href: '/themes/empty.css' },
        { value: 'missing-href' },
        { value: 'light', href: '/themes/light.css' },
        { value: 'Uppercase', href: '/themes/uppercase.css' },
        { value: 'with_underscore', href: '/themes/underscore.css' },
        { value: 'custom', href: '/themes/custom.css' },
        { value: 'custom', href: '/themes/duplicate.css' }
      ])
    );

    const themes = await firstValueFrom(service.getThemes());

    expect(themes).toStrictEqual([
      ...BUILT_IN_THEMES,
      {
        value: 'custom',
        description: 'custom',
        href: '/themes/custom.css',
        icon: 'style',
        source: 'custom',
        isDark: false
      }
    ]);
  });

  it('returns only built-in themes when the manifest request fails', async () => {
    httpGet.mockReturnValue(throwError(() => new Error('Manifest request failed')));

    const themes = await firstValueFrom(service.getThemes());

    expect(themes).toStrictEqual(BUILT_IN_THEMES);
  });

  it('treats a non-array manifest response as an empty list', async () => {
    httpGet.mockReturnValue(of(null));

    const themes = await firstValueFrom(service.getThemes());

    expect(themes).toStrictEqual(BUILT_IN_THEMES);
  });

  it('loads the manifest once and replays the cached theme list', async () => {
    const firstThemes = await firstValueFrom(service.getThemes());
    const secondThemes = await firstValueFrom(service.getThemes());

    expect(secondThemes).toBe(firstThemes);
    expect(httpGet).toHaveBeenCalledExactlyOnceWith('/assets/themes/custom-themes.json');
  });
});
