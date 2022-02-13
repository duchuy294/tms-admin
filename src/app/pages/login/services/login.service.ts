import { ApiAuthHttpService } from '@/modules/http/services/api-auth-http.service';
import { LoginUser } from './../models/LoginUser';
import { SessionService } from '@/modules/utility/services/session.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
    constructor(
        private httpService: ApiAuthHttpService,
        private sessionService: SessionService,
        private router: Router
    ) { }

    public checkLoggedIn() {
        if (this.sessionService.isLoggedIn()) {
            this.router.navigate(['/']);
        }
    }

    public async login(user: LoginUser) {
        const result = await this.httpService.post('login',
            user
        );

        if (result.errorCode === 0) {
            await this.sessionService.storeSession(
                result.data.token,
                result.data.profile
            );
            setTimeout(async () => await this.sessionService.gotoPreLoginPage(), 1000);
        }
        return result.errorCode === 0;
    }
}