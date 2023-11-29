import {
  AuthResponseData,
  AuthService
} from '../core/_services/access/auth.service';
import { environment } from './../../environments/environment';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { LocalStorageService } from '../core/_services/storage/local-storage.service';
import { UnsubscribeService } from '../core/_services/unsubscribe.service';
import { ConfigService } from '../core/_services/shared/config.service';
import { UISettingsUtilityClass } from '../shared/utils/config';
import { UIConfig } from '../core/_models/config-ui.model';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  /** Form group for the new SuperHashlist. */
  loginForm: FormGroup;

  errorRes: string | null;

  protected uiSettings: UISettingsUtilityClass;
  public isVisible = true;
  headerConfig: any;
  isDarkMode = false;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private storage: LocalStorageService<UIConfig>,
    private configService: ConfigService,
    private authService: AuthService,
    private ngZone: NgZone,
    private router: Router
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
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(2)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ])
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    let authObs: Observable<AuthResponseData>;
    authObs = this.authService.logIn(username, password);

    const authSubscription$ = authObs.subscribe(
      (resData) => {
        this.ngZone.run(() => {
          this.handleSuccessfulLogin(resData);
          this.loginForm.reset();
        });
      },
      (errorMessage) => {
        this.handleError(errorMessage);
      }
    );

    this.unsubscribeService.add(authSubscription$);
  }

  private handleSuccessfulLogin(resData: AuthResponseData): void {
    if (this.authService.redirectUrl) {
      const redirectUrl = this.authService.redirectUrl;
      this.authService.redirectUrl = '';
      this.authService.setUserLoggedIn(true);
      this.router.navigate([redirectUrl]);
    } else {
      this.router.navigate(['/']);
    }
  }

  private handleError(errorMessage: string): void {
    this.errorRes = errorMessage;
  }

  onHandleError() {
    this.errorRes = null;
  }
}
