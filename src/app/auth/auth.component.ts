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

  faEye=faEye;
  faLock=faLock;
  faUser=faUser;
  faEyeSlash=faEyeSlash;
  isLoading = false;
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

    this.isLoading = true;

    authObs = this.authService.logIn(username, password);

    authObs.subscribe(
      resData =>{
      this.isLoading = false;
      if (this.authService.redirectUrl) {
        const redirectUrl = this.authService.redirectUrl;
        this.authService.redirectUrl = '';
        this.router.navigate([redirectUrl]);
      } else {
          this.router.navigate(['/']);
      }
    }, errorMessage => {
      this.errorRes = errorMessage;
      this.isLoading = false;
    });

    form.reset();
  }

  onHandleError() {
    this.errorRes = null;
  }

}
