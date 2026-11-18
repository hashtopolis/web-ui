import { lastValueFrom, of, take, toArray } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { BuiltInTheme } from '@models/config-ui.model';

import { THEME_LOADER, THEME_SAVER, THEME_STORAGE_KEY, ThemeService } from '@services/shared/theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let loadTheme: ReturnType<typeof vi.fn>;
  let saveTheme: ReturnType<typeof vi.fn>;
  let styleLinks: HTMLLinkElement[];
  let existingLinks: Set<HTMLLinkElement>;

  beforeEach(() => {
    localStorage.removeItem(THEME_STORAGE_KEY);
    document.body.removeAttribute('data-theme');
    document.body.className = '';
    existingLinks = new Set(document.head.querySelectorAll('link'));
    styleLinks = [];

    loadTheme = vi.fn().mockName('ThemeLoader').mockReturnValue(of(null));
    saveTheme = vi.fn().mockName('ThemeSaver');
  });

  afterEach(() => {
    styleLinks.forEach((link) => link.remove());
    document.body.removeAttribute('data-theme');
    document.body.className = '';
    localStorage.removeItem(THEME_STORAGE_KEY);
  });

  const createService = (initialTheme: string | null = null): void => {
    loadTheme.mockReturnValue(of(initialTheme));
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: THEME_LOADER, useValue: loadTheme },
        { provide: THEME_SAVER, useValue: saveTheme }
      ]
    });

    service = TestBed.inject(ThemeService);
    const newLink = Array.from(document.head.querySelectorAll('link')).find((link) => !existingLinks.has(link));
    if (newLink) {
      styleLinks.push(newLink);
    }
  };

  it('loads the initial theme and applies it to the document', () => {
    createService(BuiltInTheme.DARK);

    expect(loadTheme).toHaveBeenCalledExactlyOnceWith();
    expect(service.theme).toBe(BuiltInTheme.DARK);
    expect(document.body.getAttribute('data-theme')).toBe(BuiltInTheme.DARK);
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(saveTheme).toHaveBeenCalledExactlyOnceWith(BuiltInTheme.DARK);
  });

  it('updates and clears the active theme', () => {
    createService();

    service.theme = BuiltInTheme.DARK;
    expect(document.body.getAttribute('data-theme')).toBe(BuiltInTheme.DARK);
    expect(document.body.classList.contains('dark-theme')).toBe(true);

    service.theme = null;

    expect(service.theme).toBeNull();
    expect(document.body.hasAttribute('data-theme')).toBe(false);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
    expect(saveTheme.mock.calls.map(([theme]) => theme)).toStrictEqual([null, BuiltInTheme.DARK, null]);
  });

  it('uses custom theme stylesheets and removes them when switching away', () => {
    createService();
    service.setCustomThemes([{ value: 'midnight', href: '/themes/midnight.css' }]);

    service.theme = 'midnight';

    expect(styleLinks[0].getAttribute('href')).toBe('/themes/midnight.css');
    expect(document.body.classList.contains('midnight-theme')).toBe(true);

    service.theme = BuiltInTheme.LIGHT;

    expect(styleLinks[0].hasAttribute('href')).toBe(false);
    expect(document.body.classList.contains('midnight-theme')).toBe(false);
    expect(document.body.classList.contains('light-theme')).toBe(true);
  });

  it('tracks built-in and custom dark themes and replaces custom flags', () => {
    createService();
    service.setCustomThemes([
      { value: 'midnight', isDark: true },
      { value: 'soft', isDark: false }
    ]);

    expect(service.isDark(BuiltInTheme.DARK)).toBe(true);
    expect(service.isDark(BuiltInTheme.LIGHT)).toBe(false);
    expect(service.isDark('midnight')).toBe(true);
    expect(service.isDark('soft')).toBe(false);
    expect(service.isDark(null)).toBe(false);

    service.setCustomThemes([{ value: 'soft', isDark: true }]);

    expect(service.isDark('midnight')).toBe(false);
    expect(service.isDark('soft')).toBe(true);
    expect(service.isDark(BuiltInTheme.DARK)).toBe(true);
  });

  it('emits dark-mode changes and falls back to the stored theme when no theme is active', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, BuiltInTheme.DARK);
    createService();

    const changesPromise = lastValueFrom(service.isDarkMode$.pipe(take(3), toArray()));
    service.theme = BuiltInTheme.LIGHT;
    service.theme = BuiltInTheme.DARK;

    expect(await changesPromise).toStrictEqual([true, false, true]);
  });

  it('defaults the current theme to light and persists explicit values', () => {
    createService();
    expect(service.current).toBe(BuiltInTheme.LIGHT);

    service.current = BuiltInTheme.DARK;

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(BuiltInTheme.DARK);
    expect(service.current).toBe(BuiltInTheme.DARK);
  });

  it('loads the saved theme and matching storage events through the default loader', async () => {
    TestBed.configureTestingModule({});
    localStorage.setItem(THEME_STORAGE_KEY, BuiltInTheme.LIGHT);
    const loader = TestBed.inject(THEME_LOADER);
    const themesPromise = lastValueFrom(loader().pipe(take(3), toArray()));

    window.dispatchEvent(new StorageEvent('storage', { key: 'other', newValue: 'ignored' }));
    window.dispatchEvent(new StorageEvent('storage', { key: THEME_STORAGE_KEY, newValue: BuiltInTheme.DARK }));
    window.dispatchEvent(new StorageEvent('storage', { key: THEME_STORAGE_KEY, newValue: null }));

    expect(await themesPromise).toStrictEqual([BuiltInTheme.LIGHT, BuiltInTheme.DARK, null]);
  });

  it('saves non-empty themes and removes the saved theme for an empty value', () => {
    TestBed.configureTestingModule({});
    const saver = TestBed.inject(THEME_SAVER);

    saver(BuiltInTheme.DARK);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(BuiltInTheme.DARK);

    saver(null);

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });
});
