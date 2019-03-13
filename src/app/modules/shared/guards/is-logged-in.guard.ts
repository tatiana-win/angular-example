import {Injectable} from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanLoad,
    Route,
    CanActivateChild,
    Router
} from '@angular/router';

import {UserService} from '@app/modules/core';

@Injectable()
export class IsLoggedInGuard implements CanLoad, CanActivate, CanActivateChild {
    constructor(
        private router: Router) {
    }

    canLoad(route: Route): boolean {
        return this.isLoggedIn();
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.isLoggedIn();
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.isLoggedIn();
    }

    /**
     * check if user is logged in
     */
    private isLoggedIn(): boolean {
        const slt = localStorage.getItem('slt');
        if (!!slt) {
            return true;
        }

        this.router.navigate(['/login']);

        return false;
    }
}
