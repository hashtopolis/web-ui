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
import { TimeoutComponent } from './shared/alert/timeout/timeout.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from './core/_services/shared/theme.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from 'src/environments/environment';
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

      idle.onIdleEnd.subscribe(() => {
        this.idleState = 'No longer idle.';
        this.modalRef.componentInstance.timedOut = false;
        this.timeoutCountdown = null;
        this.closeModal();
      });

      idle.onTimeout.subscribe(() => {
        this.idleState = 'Timed out!';
        this.timedOut = true;
        this.timeoutCountdown = null;
        this.modalRef.componentInstance.timedOut = true;
        this.onLogOut();
      });
      idle.onIdleStart.subscribe(() => this.idleState = 'You\'ll be logged out in 15 seconds!');
      idle.onTimeoutWarning.subscribe((countdown) => {
          if(!this.showingModal && this.idleTime > 1){
            this.openModal();
          }
          this.timeoutCountdown = this.timeoutMax - countdown +1;
          this.modalRef.componentInstance.timeoutCountdown = this.timeoutCountdown;
      });

      this.reset();

    }

  isLogged: boolean;

  ngOnInit(): void {
    this.configService.getConfig().subscribe(config => {
      // Assuming the JSON contains a property named 'backendUrl'
      if (config && config.hashtopolis_backend_url) {
        // If we get a config from the backend, we set the config property
        environment.config.prodApiEndpoint = config.hashtopolis_backend_url;
      // Test if the config is set but the hashtopolis_backend_url is not set
      } else if (config && !config.hashtopolis_backend_url) {
        console.error('Invalid configuration file. Please check your config.json.');
      }
    });
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

  // ToDo request refresh token
  reset(){
    this.idle.watch();
    this.idleState = 'Started';
    this.timedOut = false;
    this.timeoutCountdown = 0;
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
