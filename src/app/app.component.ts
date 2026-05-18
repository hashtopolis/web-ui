import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { filter } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';

import { UIConfig } from '@models/config-ui.model';
import { UiSettings, uisSettingsSchema } from '@models/config-ui.schema';
import { UserData, userDataSchema } from '@models/user-data.schema';

import { AuthService } from '@services/access/auth.service';
import { CheckTokenService } from '@services/access/checktoken.service';
import { ReloadService } from '@services/reload.service';
import { BreakpointService } from '@services/shared/breakpoint.service';
import { CookieService } from '@services/shared/cookies.service';
import { UIConfigService } from '@services/shared/storage.service';
import { ThemeService } from '@services/shared/theme.service';
import '@services/storage/local-storage';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { TimeoutDialogComponent } from '@src/app/shared/dialog/timeout/timeout-dialog.component';
import { DialogData } from '@src/app/shared/dialog/timeout/timeout-dialog.model';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit, AfterViewInit {
  private cookieService = inject(CookieService);
  private reloadService = inject(ReloadService);
  private uicService = inject(UIConfigService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private keepalive = inject(Keepalive);
  private router = inject(Router);
  private idle = inject(Idle);
  private storage = inject<LocalStorageService<UIConfig>>(LocalStorageService);
  private themeService = inject(ThemeService);
  screen = inject(BreakpointService);
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  currentUrl: string;
  currentStep: string;
  idleState = 'Not Started';
  timedOut = false;
  lastPing: Date | null = null;
  timeoutCountdown: number | null = null;
  timeoutMax = this.onTimeout();
  idleTime: number = this.onTimeout();
  showingModal = false;
  uiSettings: UISettingsUtilityClass;
  isLogged: boolean;

  private dialogRef: MatDialogRef<TimeoutDialogComponent> | null = null;
  private dialogData: DialogData = { message: '', value: 0, bufferValue: 100, timedOut: false };

  constructor() {
    const idle = this.idle;

    inject(CheckTokenService);
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      this.currentUrl = e.url;
      this.findCurrentStep(this.currentUrl);
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });

    idle.setIdle(this.idleTime);
    idle.setTimeout(this.timeoutMax);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleStart.subscribe(() => {
      idle.clearInterrupts();
      this.checkLogin();
      this.idleState = "You'll be logged out in 15 seconds!";
    });

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'NOT_IDLE.';
      this.dialogData.timedOut = false;
      this.timeoutCountdown = null;
      this.reset();
      this.closeModal();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'TIMED_OUT';
      this.timedOut = true;
      this.timeoutCountdown = null;
      this.dialogData.timedOut = true;
      this.onLogOut();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      if (!this.showingModal && this.idleTime > 1) {
        this.openModal();
      }
      this.timeoutCountdown = this.timeoutMax - countdown + 1;
      this.dialogData.value = (this.timeoutCountdown / this.timeoutMax) * 100;
    });

    this.keepalive.interval(15);
    this.keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.authService.getUserLoggedIn().subscribe((userLoggedIn) => {
      if (userLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });
  }

  ngOnInit(): void {
    this.authService.isLogged.subscribe((status) => {
      this.isLogged = status;
      if (status) {
        this.storageInit();
      }
    });
    this.authService.checkStatus();
    this.uiSettings = new UISettingsUtilityClass(this.storage, this.themeService);
  }

  ngAfterViewInit() {
    this.setBodyClasses();
  }

  /**
   * Sets CSS classes on the `<body>` element of the document based on user interface settings.
   * The classes reflect the chosen layout and theme, allowing dynamic theming of the application.
   *
   * - For layout, it supports 'fixed' and 'full' layouts.
   * - For themes, it supports 'light' and 'dark' themes.
   *
   * @remarks
   * This function retrieves layout and theme settings from the `uiSettings` service and sets
   * corresponding CSS classes on the `<body>` element to apply visual styling changes.
   */
  private setBodyClasses(): void {
    const classes: string[] = [];
    if (this.uiSettings) {
      const layout = this.uiSettings.getSetting('layout');
      if (layout === 'fixed') {
        classes.push('fixed-width-layout');
      } else if (layout === 'full') {
        classes.push('full-width-layout');
      }

      const theme = this.uiSettings.getSetting('theme');
      if (theme === 'light') {
        classes.push('light-theme');
      } else if (theme === 'dark') {
        classes.push('dark-theme');
      }
    }
    if (classes) {
      this.elementRef.nativeElement.ownerDocument.body.className = classes.join(' ');
    }
  }

  private findCurrentStep(currentRoute: string) {
    const currRouteFragments = currentRoute.split('/');
    const length = currRouteFragments.length;
    this.currentStep = currentRoute.split('/')[length - 1];
  }

  checkLogin() {
    const userData = localStorage.getItem<UserData>('userData', userDataSchema);
    if (!userData) {
      return;
    }
    if (new Date(userData._expires) < new Date()) {
      this.idle.stop();
      this.reloadService.reloadPage();
    }
  }

  reset() {
    this.idle.setTimeout(false);
    this.idle.watch();
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idleState = 'NOT_IDLE.';
    this.timedOut = false;
    this.timeoutCountdown = 0;
    this.lastPing = null;
    this.closeModal();
  }

  onLogOut() {
    this.authService.logOut();
    this.closeModal();
  }

  storageInit() {
    this.cookieService.checkDefaultCookies();
    this.uicService.checkStorage();
  }

  onTimeout(): number {
    const settings = localStorage.getItem<UiSettings>('uis', uisSettingsSchema);
    let timeoutidle = 1;
    if (settings !== null) {
      const hours = settings.maxSessionLength;
      if (!isNaN(hours) && hours > 0) {
        timeoutidle = hours * 60 * 60; // Convert max session hours to seconds
      }
    }
    return timeoutidle;
  }

  openModal() {
    if (this.isLogged) {
      this.showingModal = true;
      this.dialogData = { message: "You'll be logged out soon!", value: 0, bufferValue: 100, timedOut: false };
      this.dialogRef = this.dialog.open(TimeoutDialogComponent, {
        data: this.dialogData,
        disableClose: true
      });
    }
  }

  closeModal() {
    this.showingModal = false;
    this.dialogRef?.close();
    this.dialogRef = null;
  }
}
