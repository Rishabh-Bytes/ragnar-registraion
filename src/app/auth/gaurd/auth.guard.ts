import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ROUTES } from 'src/app/shared/constants';
import { localStorageConstant } from 'src/app/shared/constants/local-storage.const';
import { RegistrationConfigService } from 'src/app/shared/services/registration-config.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  routes = ROUTES;
  currentRoute: string = '';
  eventId: string = '';
  loginType: string = '';
  type: string = '';
  constructor(private router: Router, private route: ActivatedRoute, private RegistrationConfigDataService: RegistrationConfigService) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const authToken = localStorage.getItem(localStorageConstant.jwtToken);
      if (authToken) {
        let routeData: any = route.data;
        return true;
      } else {
        this.router.navigate([this.routes.LOGIN]);
        return false;
      }

    // return true;
  }
}
