import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import {
  Observable
} from 'rxjs/Observable';
import { UserLoginService } from './user-login.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private userLoginService: UserLoginService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
      const promise = this.userLoginService.isAuthenticatedPromise()
        .then(
          (authenticated: boolean) => {
            if (authenticated) {
              return true;
            } else {
              this.router.navigate(['/login']);
            }
          }

        );

        promise.catch((err) => {
            this.router.navigate(['/login']);
            return false;
        });

        return promise;
    }

}
