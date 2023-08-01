import { ThemeService } from 'src/app/core/_services/shared/theme.service';
import { environment } from './../../../environments/environment';
import { Component } from "@angular/core";
import { delay } from 'rxjs';

import { LoadingService } from 'src/app/core/_services/shared/loading.service';

@Component({
    selector: 'app-loading-spinner',
    template: `
<div class="logo_spinner_container" *ngIf="isLoading">
  <div class="logo_spinner_box">
    <div class="loading-dots">
      <div class="dot dot1"></div>
      <div class="dot dot2"></div>
      <div class="dot dot3"></div>
      <div class="dot dot4"></div>
    </div>
  </div>
  <img class="logoImage" *ngIf="currentTheme() !== 'dark'" [src]="this.headerConfig.brand.logo" alt="">
  <img class="logoImage" *ngIf="currentTheme() === 'dark'" [src]="this.headerConfig.brand.logored" alt="">
</div>
  `
})
export class LoadingSpinnerComponent {

  headerConfig = environment.config.header;
  isLoading = true;

  constructor(
    private theme: ThemeService,
    public ls: LoadingService
    ) {
      this.ls.showSpinner.subscribe(this.stateSpinner.bind(this));
     }

  public currentTheme(): string {
    return this.theme.current;
  }

  stateSpinner = (state: boolean): void => {
    this.isLoading = state;
  };

}


