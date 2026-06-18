import { BehaviorSubject, Observable, Subject, fromEvent, of } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { z } from 'zod';

import { DOCUMENT, Inject, Injectable, InjectionToken, Renderer2, RendererFactory2 } from '@angular/core';

const themeSchema = z.string().min(1);

export type DetectedTheme = 'dark' | 'light';
export type ThemeLoader = () => Observable<string | null>;
export type ThemeSaver = (theme: string | null) => void;

export const THEME_LOADER: InjectionToken<ThemeLoader> = new InjectionToken<ThemeLoader>('', {
  factory(): ThemeLoader {
    return () => {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return of(null);
      }
      return fromEvent<StorageEvent>(window, 'storage').pipe(
        filter((event: StorageEvent) => event.key === 'theme'),
        map((event: StorageEvent): string | null => event.newValue),
        startWith<string | null>(localStorage.getItem('theme', themeSchema) ?? null)
      );
    };
  }
});

/**
 * A function that saves the theme.
 * Defaults to saving to local storage with the key `theme`.
 */
export const THEME_SAVER: InjectionToken<ThemeSaver> = new InjectionToken<ThemeSaver>('', {
  factory(): ThemeSaver {
    return (theme) => {
      if (typeof localStorage === 'undefined') {
        return;
      }
      if (theme) {
        localStorage.setItem('theme', theme, themeSchema);
      } else {
        localStorage.removeItem('theme');
      }
    };
  }
});

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme = new BehaviorSubject<string | null>(null);
  private readonly supportedThemeClasses = ['light-theme', 'dark-theme'];
  private readonly customThemeHrefs = new Map<string, string>();
  private readonly darkThemes = new Set<string>(['dark']);
  private activeThemeClass: string | null = null;

  public get current(): string {
    return localStorage.getItem('theme', themeSchema) ?? 'light';
  }

  public set current(value: string) {
    localStorage.setItem('theme', value, themeSchema);
  }

  private readonly style: HTMLLinkElement;

  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(THEME_LOADER) private loadHandler: ThemeLoader,
    @Inject(THEME_SAVER) private saveHandler: ThemeSaver
  ) {
    loadHandler().subscribe((theme) => this._theme.next(theme));

    this.renderer = rendererFactory.createRenderer(null, null);

    this.style = document.createElement('link');
    this.style.rel = 'stylesheet';
    document.head.appendChild(this.style);

    this._theme.subscribe((theme) => {
      this.renderer.addClass(document.body, 'theme-no-transition');

      this.supportedThemeClasses.forEach((className) => {
        this.renderer.removeClass(document.body, className);
      });

      if (this.activeThemeClass) {
        this.renderer.removeClass(document.body, this.activeThemeClass);
      }

      if (theme) {
        document.body.setAttribute('data-theme', theme);
        this.activeThemeClass = `${theme}-theme`;
        this.renderer.addClass(document.body, this.activeThemeClass);
      } else {
        document.body.removeAttribute('data-theme');
        this.activeThemeClass = null;
      }

      const customThemeHref = theme ? this.customThemeHrefs.get(theme) : undefined;
      if (customThemeHref) {
        this.style.href = customThemeHref;
      } else {
        this.style.removeAttribute('href');
      }

      saveHandler(theme);

      this.reEnableTransitions();
    });
  }

  setCustomThemes(themes: Array<{ value: string; href?: string; isDark?: boolean }>): void {
    this.customThemeHrefs.clear();
    this.darkThemes.clear();
    this.darkThemes.add('dark');

    for (const theme of themes) {
      if (theme.href) {
        this.customThemeHrefs.set(theme.value, theme.href);
      }
      if (theme.isDark) {
        this.darkThemes.add(theme.value);
      }
    }

    this._theme.next(this._theme.getValue());
  }

  /**
   * @param theme the theme to test, defaulting to the active theme
   * @return whether the theme uses a dark color scheme (built-in `dark` or a custom theme flagged dark)
   */
  isDark(theme: string | null = this.theme ?? this.current): boolean {
    return !!theme && this.darkThemes.has(theme);
  }

  /**
   * @return an observable emitting whether the active theme is dark, updating on theme changes
   */
  get isDarkMode$(): Observable<boolean> {
    return this._theme.pipe(map((theme) => this.isDark(theme ?? this.current)));
  }

  /**
   * Re-enable CSS transitions after the new theme has painted, so a theme switch lands in a single
   * repaint instead of animating every transitioned element (e.g. table rows) over its transition
   * duration.
   */
  private reEnableTransitions(): void {
    if (typeof requestAnimationFrame === 'undefined') {
      this.renderer.removeClass(this.document.body, 'theme-no-transition');
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.renderer.removeClass(this.document.body, 'theme-no-transition');
      });
    });
  }

  /**
   * @return a subject representing the currently active theme
   */
  get theme$(): Subject<string | null> {
    return this._theme;
  }

  /**
   * @return `dark` if the user agent prefers dark color scheme, `light` otherwise
   */
  get detectedTheme(): DetectedTheme {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  /**
   * @return an observable version of {@link detectedTheme} that automatically updates on changes, e.g. when the user
   * changes their operating system theme preference, or it switches depending on day/night.
   */
  get detectedTheme$(): Observable<DetectedTheme> {
    if (typeof window === 'undefined') {
      return of('light');
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return fromEvent<MediaQueryListEvent>(mediaQuery, 'change').pipe(
      map((event) => event.matches),
      startWith(mediaQuery.matches),
      map((matches) => (matches ? 'dark' : 'light'))
    );
  }

  /**
   * @return the current theme
   */
  get theme(): string | null {
    return this._theme.getValue();
  }

  /**
   * @param value
   *  the new theme
   */
  set theme(value: string | null) {
    this._theme.next(value);
  }
}
