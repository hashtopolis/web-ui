import { Component, HostBinding, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';
/**
 * Authentification Service, Cookies and Local Storage
 *
**/
import { UIConfigService } from './core/_services/shared/storage.service';
import { CookieService } from './core/_services/shared/cookies.service';
import { ConfigService } from './core/_services/shared/config.service';
import { AuthService } from './core/_services/access/auth.service';
/**
 * Idle watching
 *
**/
import { CheckTokenService } from './core/_services/access/checktoken.service';
import { TimeoutComponent } from './shared/alert/timeout/timeout.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from './core/_services/shared/theme.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  currentUrl: string;
  currentStep: string;
  appTitle = 'Hashtopolis';
  idleState = 'Not Started';
  timedOut = false;
  lastPing?: Date  = null;
  timeoutCountdown:number = null;
  timeoutMax= this.onTimeout();
  idleTime: number = this.onTimeout();
  showingModal = false;
  modalRef = null;
  screenmode:string = localStorage.getItem('screenmode') || 'true';
  theme: string;

  @HostBinding('class.light-theme')
  public isLightTheme = false;

  @HostBinding('class.dark-theme')
  public isDarkTheme = false;

  /**
   * set theme
   */
  private setTheme(val: string) {
    this.theme = val;
    this.isLightTheme = (val === 'light');
    this.isDarkTheme = (val === 'dark');
  }

  constructor(
    private configService: ConfigService,
    private cookieService: CookieService,
    private uicService:UIConfigService,
    private checkt: CheckTokenService,
    private authService: AuthService,
    private modalService: NgbModal,
    private themes: ThemeService,
    private keepalive: Keepalive,
    private metaTitle: Title,
    private router: Router,
    private meta: Meta,
    private idle: Idle,
    @Inject(PLATFORM_ID) private platformId: object
    ){
      this.setTheme(this.themes.theme);
      this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
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
        this.idleState = 'You\'ll be logged out in 15 seconds!'
      });

      idle.onIdleEnd.subscribe(() => {
        this.idleState = "NOT_IDLE.";
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
          if(!this.showingModal && this.idleTime > 1){
            this.openModal();
          }
          this.timeoutCountdown = this.timeoutMax - countdown +1;
          this.modalRef.componentInstance.timeoutCountdown = this.timeoutCountdown;
      });

      keepalive.interval(15);

      keepalive.onPing.subscribe(() => this.lastPing = new Date());

      this.authService.getUserLoggedIn().subscribe(userLoggedIn => {
        if (userLoggedIn) {
          idle.watch()
          this.timedOut = false;
        } else {
          idle.stop();
        }
      })

      // this.reset();

    }

  isLogged: boolean;

  ngOnInit(): void {
    this.authService.autoLogin();
    this.authService.isLogged.subscribe(logged => {
      this.isLogged = logged;
      if (logged) {
        this.storageInit();
      }
    });
    this.authService.checkStatus();
  }

  private findCurrentStep(currentRoute) {
    const currRouteFragments = currentRoute.split('/');
    const length = currRouteFragments.length;
    this.currentStep = currentRoute.split('/')[length - 1];
  }

  checkLogin() {
    const userData: { _token: string, _expires: string} = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
        return;
    }
    if(new Date(userData._expires) <  new Date()){
      this.idle.stop();
      window.location.reload();
    }
  }

  reset(){
    this.idle.setTimeout(false);
    this.idle.watch();
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idleState = "NOT_IDLE.";
    this.timedOut = false;
    this.timeoutCountdown = 0;
    this.lastPing = null;
    this.closeModal();
  }

  onLogOut(){
    this.authService.logOut();
    this.closeModal();
  }

  storageInit(){
    this.cookieService.checkDefaultCookies();
    this.uicService.checkStorage();
  }

  onTimeout() : number {
    const uisData = JSON.parse(localStorage?.getItem('uis'));
    let timeoutidle = 1;
    if(uisData !== null){
      timeoutidle = Number(uisData.find(o => o.name === 'maxSessionLength').value*60*60); //Convert max session hours to seconds
    }
    return timeoutidle;
  }

  openModal(){
    if (this.isLogged) {
      this.showingModal = true;

      this.modalRef = this.modalService.open(TimeoutComponent);
      this.modalRef.componentInstance.timeoutMax = this.timeoutMax;
    }
  }

  closeModal(){
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
			},
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
