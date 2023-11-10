import {
  AuthResponseData,
  AuthService
} from '../core/_services/access/auth.service';
import {
  faEye,
  faEyeSlash,
  faLock,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../environments/environment';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfigService } from '../core/_services/shared/config.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-content>
          <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)" novalidate>
            <mat-form-field appearance="fill">
              <mat-label>Username</mat-label>
              <input matInput type="text" ngModel name="username" required />
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Password</mat-label>
              <input
                matInput
                type="{{ hide ? 'password' : 'text' }}"
                ngModel
                name="password"
                required
              />
              <button
                mat-icon-button
                matSuffix
                (click)="hide = !hide"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hide"
              >
                <mat-icon>{{
                  hide ? 'visibility_off' : 'visibility'
                }}</mat-icon>
              </button>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit">
              Login
            </button>

            <!-- <p class="forgot-password-link">
              <a routerLink="/forgot" class="small">Forgot your password?</a>
            </p> -->
          </form>
        </mat-card-content>
      </mat-card>
      <mat-card class="mat-card-alert">
        <mat-card-content>
          This is a private closed system. If you need access, you need to
          contact an admin.
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .login-card {
        width: 400px;
        margin-bottom: 16px;
      }

      mat-form-field {
        width: 100%;
        margin-bottom: 16px;
      }

      .mat-raised-button {
        width: 100%;
      }

      .forgot-password-link {
        margin-top: 16px;
        text-align: center;
      }

      .forgot-password-link a {
        color: #2196f3; /* Use the color you prefer */
        text-decoration: none;
      }

      .mat-card-alert {
        background-color: #ffebee; /* Use the alert color you prefer */
        margin-top: 16px;
      }
    `
  ]
})
export class AuthComponent implements OnInit {
  errorRes: string | null;

  public hide = true;
  headerConfig: any;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private router: Router
  ) {
    this.headerConfig = environment.config.header;
  }

  ngOnInit(): void {
    this.configService.getEndpoint();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const username = form.value.username;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    authObs = this.authService.logIn(username, password);

    authObs.subscribe(
      (resData) => {
        if (this.authService.redirectUrl) {
          const redirectUrl = this.authService.redirectUrl;
          this.authService.redirectUrl = '';
          this.authService.setUserLoggedIn(true);
          this.router.navigate([redirectUrl]);
        } else {
          this.router.navigate(['/']);
        }
      },
      (errorMessage) => {
        this.errorRes = errorMessage;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.errorRes = null;
  }
}
