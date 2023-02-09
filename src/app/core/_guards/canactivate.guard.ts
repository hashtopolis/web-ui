import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate,Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../_services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated) {
        return true;
    }

    // Track URL user is trying to go to so we can send them there after logging in
    this.authService.redirectUrl = state.url;
    this.router.navigate(['/auth']);
    return false;
  }

}
