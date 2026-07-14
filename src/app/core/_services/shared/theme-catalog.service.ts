import { themes } from '@constants/settings.config';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface RuntimeThemeOption {
  value: string;
  description: string;
  icon: string;
  href?: string;
  source: 'builtin' | 'custom';
  isDark: boolean;
}

interface RuntimeThemeManifestEntry {
  value?: string;
  description?: string;
  href?: string;
  icon?: string;
  isDark?: boolean;
}

const BUILT_IN_THEME_ICONS: Record<string, string> = {
  light: 'light_mode',
  dark: 'dark_mode'
};

@Injectable({
  providedIn: 'root'
})
export class ThemeCatalogService {
  private http = inject(HttpClient);

  private readonly builtInThemes: RuntimeThemeOption[] = themes.map((theme) => ({
    ...theme,
    icon: BUILT_IN_THEME_ICONS[theme.value] ?? 'palette',
    source: 'builtin',
    isDark: theme.value === 'dark'
  }));

  private themes$?: Observable<RuntimeThemeOption[]>;

  getThemes(): Observable<RuntimeThemeOption[]> {
    if (!this.themes$) {
      this.themes$ = this.http.get<RuntimeThemeManifestEntry[]>('/assets/themes/custom-themes.json').pipe(
        map((entries) => this.mergeThemes(Array.isArray(entries) ? entries : [])),
        catchError(() => of(this.builtInThemes)),
        shareReplay(1)
      );
    }
    return this.themes$;
  }

  private mergeThemes(entries: RuntimeThemeManifestEntry[]): RuntimeThemeOption[] {
    const reserved = new Set(this.builtInThemes.map((theme) => theme.value));
    const customThemes: RuntimeThemeOption[] = [];

    for (const entry of entries) {
      const value = (entry.value ?? '').trim();
      const description = (entry.description ?? '').trim();
      const href = (entry.href ?? '').trim();

      if (!value || reserved.has(value) || !/^[a-z0-9-]+$/.test(value) || !href) {
        continue;
      }

      reserved.add(value);
      customThemes.push({
        value,
        description: description || value,
        href,
        icon: entry.icon?.trim() || 'style',
        source: 'custom',
        isDark: entry.isDark === true
      });
    }

    return [...this.builtInThemes, ...customThemes];
  }
}
