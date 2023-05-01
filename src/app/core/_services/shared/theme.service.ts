import {Inject, Injectable, InjectionToken, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {BehaviorSubject, fromEvent, Observable, of, Subject} from 'rxjs';
import {filter, map, startWith} from 'rxjs/operators';

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
        filter(event => event.key === 'theme' && event.storageArea === localStorage),
        map(event => event.newValue),
        startWith(localStorage.getItem('theme')),
      );
    };
  },
});

/**
 * A function that saves the theme.
 * Defaults to saving to local storage with the key `theme`.
 */
export const THEME_SAVER: InjectionToken<ThemeSaver> = new InjectionToken<ThemeSaver>('', {
  factory(): ThemeSaver {
    return theme => {
      if (typeof localStorage === 'undefined') {
        return;
      }
      if (theme) {
        localStorage.setItem('theme', theme);
      } else {
        localStorage.removeItem('theme');
      }
    };
  },
});

export interface ThemeObject {
  oldValue: string;
  newValue: string;
};


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _theme = new BehaviorSubject<string | null>(null);

  public get current(): string {
  	return localStorage.getItem('theme') ?? 'light';
  }

  public set current(value: string) {
  	localStorage.setItem('theme', value);
  	this.style.href = `${value}.css`;
  }

  private readonly style: HTMLLinkElement;

  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) document: any,
    @Inject(THEME_LOADER) loadHandler: any,
    @Inject(THEME_SAVER) saveHandler: any,
  ) {
    ((loadHandler as ThemeLoader)()).subscribe(theme => this._theme.next(theme));

    this.renderer = rendererFactory.createRenderer(null, null);

    this.style = document.createElement('link');
    this.style.rel = 'stylesheet';
    document.head.appendChild(this.style);

    if (localStorage.getItem('theme') !== undefined) {
    	this.style.href = `${this.current}.css`;
    }

    this._theme.subscribe(theme => {
      if (theme) {
        this.renderer.removeClass(document.body, this.current);
        document.body.setAttribute('data-theme', theme);
        this.style.href = `${theme}.css`;
        this.renderer.addClass(document.body, theme);
      } else {
        document.body.removeAttribute('data-theme');
        this.renderer.removeClass(document.body, this.current);
      }

      (saveHandler as ThemeSaver)(theme);
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
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
  console.log(mediaQuery);
  return fromEvent<MediaQueryListEvent>(mediaQuery, 'change').pipe(
    map(event => event.matches),
    startWith(mediaQuery.matches),
    map(matches => matches ? 'dark' : 'light'),
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
