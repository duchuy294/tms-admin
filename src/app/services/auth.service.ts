import * as _ from 'lodash';
import { AppState } from './../app.service';
import { CanActivate, Router } from '@angular/router';
import { EventBusService } from './event.bus.service';
import { Injectable } from '@angular/core';
import { ProfileService } from './../modules/profile/services/admin.service';
import { ProfileSuccess } from '@/modules/profile/actions';
import { SessionService } from './../modules/utility/services/session.service';

@Injectable()
export class AuthService implements CanActivate {
    constructor(
        private router: Router,
        private sessionService: SessionService,
        private adminService: ProfileService,
        private eventBusService: EventBusService,
        private appState: AppState) {
    }

    public async canActivate(): Promise<boolean> {
        if (this.sessionService.isLoggedIn()) {
            if (_.isEqual(this.appState.get('profile'), {}) || _.isEqual(this.appState.get('settings'), {})) {
                const data = await this.adminService.verify();
                if (data) {
                    this.appState.set('profile', data);
                    this.appState.set('settings', {});
                    this.eventBusService.emit(new ProfileSuccess());
                } else {
                    this.sessionService.logout();
                }
            }
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
