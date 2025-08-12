import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import { UIConfig } from '@models/config-ui.model';

import { AuthResponseData, AuthService } from '@services/access/auth.service';
import { AlertService } from '@services/shared/alert.service';
import { ConfigService } from '@services/shared/config.service';
import { LocalStorageService } from '@services/storage/local-storage.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { HeaderConfig } from '@src/config/default/app/config.model';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  standalone: false
})
export class AuthComponent implements OnInit, OnDestroy {
  /** Form group for the new SuperHashlist. */
  loginForm: FormGroup;

  errorRes: string | null;

  protected uiSettings: UISettingsUtilityClass;
  public isVisible = true;
  headerConfig: HeaderConfig;
  isDarkMode = false;

  /** on loggin loading */
  isLoading = false;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private storage: LocalStorageService<UIConfig>,
    private configService: ConfigService,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.headerConfig = environment.config.header;
    this.uiSettings = new UISettingsUtilityClass(this.storage);
    this.isDarkMode = this.uiSettings.getSetting('theme') === 'dark';
    this.buildForm();
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.setupConfig();
    this.configService.getEndpoint();
  }

  private setupConfig(): void {
    this.configService.getEndpoint();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the form for creating a new Hashlist.
   */
  buildForm(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(3)])
    });
  }

  /**
   * Handle login, when user submits the login form.
   */
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.isLoading = true; // Show spinner

    const authObs: Observable<AuthResponseData> = this.authService.logIn(username, password);

    const authSubscription$ = authObs.subscribe({
      next: () => {
        this.loginForm.reset();
      },
      error: () => {
        this.isLoading = false;
        this.handleError('An error occurred. Please try again later.');
      },
      complete: () => {
        this.isLoading = false; // Hide spinner after attempting to log in
      }
    });

    this.unsubscribeService.add(authSubscription$);
  }

  /**
   * Show and log specified error message
   * @param errorMessage Message to log/display
   * @private
   */
  private handleError(errorMessage: string): void {
    this.errorRes = errorMessage;
    console.log(this.errorRes);
    this.alertService.showErrorMessage(errorMessage);
  }
}
