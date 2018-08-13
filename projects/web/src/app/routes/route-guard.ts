import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  NavigationEnd,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import {
  TokenService,
  JWTTokenModel,
  DelonAuthConfig,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import { UserService } from 'store';
import { IUserBiz } from 'store';

@Injectable()
export class RoutingGuard implements CanActivate, CanActivateChild {
  constructor(
    private _userSrv: UserService,
    private _router: Router,
    private _authConfig: DelonAuthConfig,
    @Inject(DOCUMENT) private _document,
  ) {
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.hideSpinner();
      });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): Observable<boolean> {
    // return of(true);
    return this._userSrv.loggedIn$.pipe(
      map((user: IUserBiz) => {
        if (!!user) {
          return true;
        } else {
          this._router.navigateByUrl(this._authConfig.login_url);
          return false;
        }
      }),
    );
  }

  private hideSpinner(): void {
    const body = this._document.querySelector('body');
    const preloader = this._document.querySelector('.preloader');
    // preloader value null when running --hmr
    if (!preloader) return;

    preloader.className = 'preloader-hidden';
  }
}
