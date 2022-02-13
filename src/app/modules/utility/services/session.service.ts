import * as _ from 'lodash';
import { AppState } from './../../../app.service';
import { Injectable } from '@angular/core';
import { Profile } from './../../profile/models/profile.model';
import { Router } from '@angular/router';

@Injectable()
export class SessionService {
    public user: Profile = null;

    constructor(
        private router: Router,
        private appState: AppState
    ) { }

    public isLoggedIn(): boolean {
        return this.verifyToken();
    }

    private verifyToken() {
        return !!this.getToken();
    }

    public getToken() {
        return localStorage.getItem('_token');
    }

    public async storeSession(token: string, user: Profile) {
        localStorage.setItem('_token', token);
        this.appState.set('profile', user);
    }

    public getCurrentUser(): Profile {
        return this.appState.get('profile');
    }

    public async gotoPreLoginPage() {
        await this.router.navigate(['/']);
    }

    public async logout() {
        localStorage.removeItem('_token');
        this.router.navigate(['/login']);
    }
}
