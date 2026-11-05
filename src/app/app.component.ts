import { filter } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Layout } from '@models/config-ui.model';

import { AuthService } from '@services/access/auth.service';
import { CheckTokenService } from '@services/access/checktoken.service';
import { BreakpointService } from '@services/shared/breakpoint.service';
import { CookieService } from '@services/shared/cookies.service';
import { UIConfigService } from '@services/shared/storage.service';
import { ThemeCatalogService } from '@services/shared/theme-catalog.service';
import { ThemeService } from '@services/shared/theme.service';
import { UiSettingsService } from '@services/shared/ui-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit, AfterViewInit {
  private cookieService = inject(CookieService);
  private uicService = inject(UIConfigService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private themeCatalog = inject(ThemeCatalogService);
  screen = inject(BreakpointService);
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  uiSettings = inject(UiSettingsService);

  constructor() {
    inject(CheckTokenService);
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    this.themeCatalog.getThemes().subscribe((themes) => {
      this.themeService.setCustomThemes(themes);
    });

    this.authService.isLogged.subscribe((status) => {
      if (status) {
        this.storageInit();
      }
    });
    this.authService.checkStatus();
  }

  ngAfterViewInit() {
    this.setBodyClasses();
  }

  /**
   * Sets CSS classes on the `<body>` element of the document based on user interface settings.
   * The classes reflect the chosen layout and theme, allowing dynamic theming of the application.
   *
   * - For layout, it supports 'fixed' and 'full' layouts.
   * - For themes, it supports built-in themes plus any runtime custom themes.
   *
   * @remarks
   * This function retrieves layout and theme settings from the `uiSettings` service and sets
   * corresponding CSS classes on the `<body>` element to apply visual styling changes.
   */
  private setBodyClasses(): void {
    const classes: string[] = [];
    const layout = this.uiSettings.getSetting('layout');
    if (layout === Layout.FIXED) {
      classes.push('fixed-width-layout');
    } else if (layout === Layout.FULL) {
      classes.push('full-width-layout');
    }

    const theme = this.uiSettings.getSetting('theme');
    if (theme) {
      classes.push(`${theme}-theme`);
    }
    if (classes) {
      this.elementRef.nativeElement.ownerDocument.body.className = classes.join(' ');
    }
  }

  storageInit() {
    this.cookieService.checkDefaultCookies();
    this.uicService.checkStorage();
  }
}
