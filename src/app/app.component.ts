import { isPlatformBrowser } from '@angular/common';
import { Component,Inject,OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { AuthService } from './core/_services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  currentUrl: string;
  currentStep: string;
  appTitle = 'Hashtopolis';
  constructor(
    private authService: AuthService,
    private router: Router,
    private metaTitle: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
    ){
      this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.currentUrl = e.url;
        this.findCurrentStep(this.currentUrl);
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      });

    }

  ngOnInit(): void {
    this.authService.autoLogin();
  }

  private findCurrentStep(currentRoute) {
    const currRouteFragments = currentRoute.split('/');
    const length = currRouteFragments.length;
    this.currentStep = currentRoute.split('/')[length - 1];
  }



}
