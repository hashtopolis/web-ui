import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable, Output, EventEmitter } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Subject, throwError, map, Observable, Observer  } from 'rxjs';
import { User } from '../_models/auth-user.model';
import { Data, Router } from "@angular/router";

export interface AuthResponseData {
  token: string,
  expires: string,
}

@Injectable({providedIn: 'root'})
export class AuthService {

    user = new BehaviorSubject<User>(null);
    @Output() authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    isAuthenticated = false;
    redirectUrl: string = '';
    private tokenExpiration: any;
    private endpoint = environment.config.prodApiEndpoint + '/auth';

    constructor(
      private http: HttpClient, private router: Router
      ){}

    autoLogin(){
        const userData: { _token: string, _expires: string} = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return;
        }

        const loadedUser = new User(userData._token, new Date(userData._expires), '-');

        if(loadedUser.token){
            this.user.next(loadedUser);
            const tokenExpiration = new Date(userData._expires).getTime() - new Date().getTime();
            // this.autologOut(tokenExpiration);
            this.getRefreshToken(tokenExpiration);
        }
    }

    logIn(username: string, password: string): Observable<any>{
        return this.http.post<AuthResponseData>(this.endpoint + '/token', {username: username, password: password},
            {headers: new HttpHeaders({ 'Authorization': 'Basic '+window.btoa(username+':'+password) })})
            .pipe(
              catchError(this.handleError),
              tap(resData => {
                  this.handleAuthentication(resData.token, +resData.expires, username);
                  this.isAuthenticated = true;
                  this.userAuthChanged(true);
        }));
    }

    // With autologOut we use only the expiration date of the bearer token, approx. 2 hours
    autologOut(expirationDuration: number){
        this.tokenExpiration = setTimeout(() => {
            this.logOut();
        }, expirationDuration);
    }

    getRefreshToken(expirationDuration: number){
        this.tokenExpiration = setTimeout(() => {
          const userData: {_token: string, _expires: string, _username: string} = JSON.parse(localStorage.getItem('userData'));
          return this.http.post<AuthResponseData>(this.endpoint + '/refresh', {headers: new HttpHeaders({ Authorization: `Bearer ${userData._token}` })})
          .pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.token, +resData.expires, userData._username);
        }));
      }, expirationDuration);
    }

    logOut(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpiration){
            clearTimeout(this.tokenExpiration)
        }
        this.tokenExpiration = null;
    }


    private userAuthChanged(status: boolean) {
      this.authChanged.emit(status); // Raise changed event
    }

    private handleAuthentication(token: string, expires: number, username: string) {
        const expirationDate = new Date(expires * 1000); // expires, its epoch time in seconds and returns milliseconds sin Jan 1, 1970. We need to multiple by 1000
        const user = new User(token, expirationDate, username);
        this.user.next(user);
        this.autologOut(expires) // Epoch time
        localStorage.setItem('userData', JSON.stringify(user));
      }

    private handleError ( errorRes : HttpErrorResponse ) {
        let errorMessage = 'An unknown error ocurred!';
        if (!errorRes.error || !errorRes.error.error){
            return throwError(() => errorMessage);
        }
        switch(errorRes.error.error.message){
            case 'INVALID_PASSWORD': //We can add easily more common errors but for security better dont give more hints
              errorMessage = 'Wrong username/password/OTP!';
              break;
        }
        return throwError(() => errorMessage);
    }

}


// //
// Section Using Http Authentification (We changed Auth method to use fetch instead of Xhr)
// //


// user = new BehaviorSubject<User>(null);
// private tokenExpiration: any;
// private endpoint = Configuration.BASE_URL_APIV1 + '/auth/token';

// constructor(private http: HttpClient, private router: Router){}

// autoLogin(){
//     const userData: {email:string, id: string, _token: string, _tokenExpirationDate: string} = JSON.parse(localStorage.getItem('userData'));
//     if(!userData){
//         return;
//     }

//     const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

//     if(loadedUser.token){
//         this.user.next(loadedUser);
//         const tokenExpiration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime(); // Expiring date in miliseconds minus current time in miliseconds
//         this.autologOut(tokenExpiration);
//     }
// }

// logIn(email: string, password: string){
//     return this.http.post<AuthResponseData>(
//         'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyACqMPe7bIGBYKE1jDGamrOlAZifBm0jhM',
//         {
//             email: email,
//             password: password,
//             returnSecureToken: true
//         }
//     ).pipe(catchError(this.handleError), tap(resData => {
//         this.handleAuthentication(resData.email,resData.localId, resData.idToken, +resData.expiresIn);
//     }));
// }

// autologOut(expirationDuration: number){
//     this.tokenExpiration = setTimeout(() => {
//         this.logOut();
//     }, expirationDuration);  // To test change expirationDuration for a number. i.e 3000 (3 seconds)
// }

// logOut(){
//     this.user.next(null);
//     this.router.navigate(['/auth']);
//     localStorage.removeItem('userData');
//     if(this.tokenExpiration){
//         clearTimeout(this.tokenExpiration)
//     }
//     this.tokenExpiration = null;
// }

// private handleAuthentication(
//     email: string,
//     userId: string,
//     token: string,
//     expiresIn: number
//   ) {
//     const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
//     const user = new User(email, userId, token, expirationDate);
//     this.user.next(user);
//     this.autologOut(expiresIn *1000)    // expiresIn is in seconds and autologout in miliseconds
//     localStorage.setItem('userData', JSON.stringify(user));
//   }

// private handleError ( errorRes : HttpErrorResponse ) {
//     let errorMessage = 'An unknown error ocurred!';
//     if (!errorRes.error || !errorRes.error.error){
//         return throwError(() => errorMessage);
//     }
//     switch(errorRes.error.error.message){
//         case 'INVALID_PASSWORD': //We can add easily more common errors but for security better dont give more hints
//           errorMessage = 'Wrong username/password/OTP!';
//           break;
//     }
//     return throwError(() => errorMessage);
// }



