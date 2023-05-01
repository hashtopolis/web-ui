import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from '../core/_services/access/auth.service';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  faLock=faLock;
  faUser=faUser;
  isLoading = false;
  errorRes: string | null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

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
