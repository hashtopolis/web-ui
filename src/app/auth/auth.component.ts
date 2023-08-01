import { AuthService, AuthResponseData } from '../core/_services/access/auth.service';
import { faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../environments/environment';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {

  faEyeSlash=faEyeSlash;
  faLock=faLock;
  faUser=faUser;
  faEye=faEye;

  errorRes: string | null;

  public showPassword: boolean;
  public showPasswordOnPress: boolean;
  headerConfig: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.headerConfig = environment.config.header;
  }

  ngOnInit(): void {

  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const username = form.value.username;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    authObs = this.authService.logIn(username, password);

    authObs.subscribe(
      resData =>{
      if (this.authService.redirectUrl) {
        const redirectUrl = this.authService.redirectUrl;
        this.authService.redirectUrl = '';
        this.router.navigate([redirectUrl]);
      } else {
          this.router.navigate(['/']);
      }
    }, errorMessage => {
      this.errorRes = errorMessage;
    });

    form.reset();
  }

  onHandleError() {
    this.errorRes = null;
  }

}
