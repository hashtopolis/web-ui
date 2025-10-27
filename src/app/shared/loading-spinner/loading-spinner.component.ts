import { environment } from '@env/environment';

import { Component } from '@angular/core';

import { LoadingService } from '@services/shared/loading.service';
import { ThemeService } from '@services/shared/theme.service';

@Component({
  selector: 'app-loading-spinner',
  template: `
    @if (isLoading) {
      <div class="logo_spinner_container">
        <div class="logo_spinner_box">
          <div class="loading-dots">
            <div class="dot dot1"></div>
            <div class="dot dot2"></div>
            <div class="dot dot3"></div>
            <div class="dot dot4"></div>
          </div>
        </div>
        @if (currentTheme() !== 'dark') {
          <img class="logoImage" [src]="this.headerConfig.brand.logo" alt="" />
        }
        @if (currentTheme() === 'dark') {
          <img class="logoImage" [src]="this.headerConfig.brand.logored" alt="" />
        }
      </div>
    }
  `,
  standalone: false
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
