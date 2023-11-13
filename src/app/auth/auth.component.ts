import {
  AuthResponseData,
  AuthService
} from '../core/_services/access/auth.service';
import { environment } from './../../environments/environment';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfigService } from '../core/_services/shared/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  errorRes: string | null;

  public isVisible = true;
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
