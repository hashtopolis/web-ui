import { AuthService } from "./auth.service";
import { Injectable,} from "@angular/core";

export interface AuthResponseData {
  token: string,
  expires: string,
}

@Injectable({providedIn: 'root'})
export class CheckTokenService {
  constructor(
    private authService: AuthService,
  ) {
    // We Listen using visibility api to look change events, tab inactive and active
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // When tab is now active; we check token validity and refresh if we have time
        this.checkTokenValidity();
      }
    });
  }

  checkTokenValidity() {
    const userData: { _token: string, _expires: string} = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
        return;
    }
    let tokendate  = new Date(userData._expires).getTime();
    let currentDate = new Date().getTime();
    let timeDifference = tokendate - currentDate;
    // We should be refreshing but when using refresh token, we get an error "Signature verification failure"
    // if(timeDifference > 0 && timeDifference <  600){
    //   console.log('trying to refresh token')
    //   this.authService.refreshToken().subscribe(
    //     (data) => {
    //        console.log(data)
    //     }
    //   );
    // }
    if(timeDifference < 15){
      this.authService.logOut();
    }
  }

}
