import { Component, inject } from '@angular/core';

import { LoadingService } from '@services/shared/loading.service';
import { ThemeService } from '@services/shared/theme.service';

import { environment } from '@src/environments/environment';

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
        @if (!isDark()) {
          <img class="logoImage" [src]="this.headerConfig.brand.logo" alt="" />
        }
        @if (isDark()) {
          <img class="logoImage" [src]="this.headerConfig.brand.logored" alt="" />
        }
      </div>
    }
  `,
  styleUrls: ['./loading-spinner.component.scss'],
  standalone: false
})
export class LoadingSpinnerComponent {
  private theme = inject(ThemeService);
  public ls = inject(LoadingService);

  headerConfig = environment.config.header;
  isLoading = true;

  constructor() {
    this.ls.showSpinner.subscribe(this.stateSpinner.bind(this));
  }

  public isDark(): boolean {
    return this.theme.isDark();
  }

  stateSpinner = (state: boolean): void => {
    this.isLoading = state;
  };
}
