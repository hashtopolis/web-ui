import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { filter } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { UIConfig } from '@models/config-ui.model';

import { AuthService } from '@services/access/auth.service';
import { BreakpointService } from '@services/shared/breakpoint.service';
import { CookieService } from '@services/shared/cookies.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { TimeoutComponent } from '@src/app/shared/alert/timeout/timeout.component';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit, AfterViewInit {
  currentUrl: string;
  currentStep: string;
  idleState = 'Not Started';
  timedOut = false;
  lastPing?: Date = null;
  timeoutCountdown: number = null;
  timeoutMax = this.onTimeout();
  idleTime: number = this.onTimeout();
  showingModal = false;
  modalRef = null;
  uiSettings: UISettingsUtilityClass;
  isLogged: boolean;

  constructor(
    private cookieService: CookieService,
    private uicService: UIConfigService,
    private authService: AuthService,
    private modalService: NgbModal,
    private keepalive: Keepalive,
    private router: Router,
    private idle: Idle,
    private storage: LocalStorageService<UIConfig>,
    public screen: BreakpointService,
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
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
      this.modalRef.componentInstance.timedOut = false;
      this.timeoutCountdown = null;
      this.reset();
      this.closeModal();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'TIMED_OUT';
      this.timedOut = true;
      this.timeoutCountdown = null;
      this.modalRef.componentInstance.timedOut = true;
      this.onLogOut();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      if (!this.showingModal && this.idleTime > 1) {
        this.openModal();
      }
      this.timeoutCountdown = this.timeoutMax - countdown + 1;
      this.modalRef.componentInstance.timeoutCountdown = this.timeoutCountdown;
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
    this.authService.autoLogin();
    this.authService.isLogged.subscribe((status) => {
      this.isLogged = status;
      if (status) {
        this.storageInit();
      }
    });
    this.authService.checkStatus();
    this.uiSettings = new UISettingsUtilityClass(this.storage);
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

  private findCurrentStep(currentRoute) {
    const currRouteFragments = currentRoute.split('/');
    const length = currRouteFragments.length;
    this.currentStep = currentRoute.split('/')[length - 1];
  }

  checkLogin() {
    const userData: { _token: string; _expires: string } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    if (new Date(userData._expires) < new Date()) {
      this.idle.stop();
      window.location.reload();
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
    const uisData = JSON.parse(localStorage?.getItem('uis'));
    let timeoutidle = 1;
    if (uisData !== null) {
      timeoutidle = Number(uisData.find((o) => o.name === 'maxSessionLength').value * 60 * 60); //Convert max session hours to seconds
    }
    return timeoutidle;
  }

  openModal() {
    if (this.isLogged) {
      this.showingModal = true;

      this.modalRef = this.modalService.open(TimeoutComponent);
      this.modalRef.componentInstance.timeoutMax = this.timeoutMax;
    }
  }

  closeModal() {
    this.showingModal = false;
    this.modalService.dismissAll();
    this.ngOnInit();
  }

  closeResult = '';
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: ModalDismissReasons | string): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
