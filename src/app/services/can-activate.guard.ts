import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { BaMenuService } from '@/modules/theme/services/baMenu.service';
import * as _ from 'lodash';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class CanActivateGuard implements CanActivateChild {
    constructor(
        private baMenuService: BaMenuService,
        private router: Router
    ) {

    }
    canActivateChild(
        _next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        let menuList = [];
        this.baMenuService.menuItems.subscribe(menus => {
            for (const menu of menus) {
                menuList = [...menuList, menu];
                if (menu.children) {
                    menuList = [...menuList, ...menu.children];
                }
            }
            if (menuList.length > 0) {
                const check = menuList.find(item => state.url.indexOf(item.path) !== -1);
                if (!check && !['/pages/dashboard/welcome', '/pages/dashboard/permission-deny', '/'].includes(state.url)) {
                    this.router.navigate(['/pages/dashboard/permission-deny']);
                    return false;
                }
            }

        });
        return true;
    }
}
