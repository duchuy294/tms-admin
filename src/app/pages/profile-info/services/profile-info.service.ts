import { ApiHttpService } from './../../../modules/http/services/api-http.service';
import { BaseService } from './../../../services/base.service';
import { ChangePassword } from './change-password.model';
import { Injectable } from '@angular/core';
import { Profile } from '../../../modules/profile/models/profile.model';

@Injectable()
export class ProfileInfoService extends BaseService {
    constructor(private apiHttpService: ApiHttpService) {
        super();
    }

    async update(model: Profile) {
        const result = await this.apiHttpService.put(`admin/account`, model);

        return result;
    }

    async changePassword(model: ChangePassword) {
        const result = await this.apiHttpService.put(`admin/password`, {
            password: model.password,
            newPassword: model.newPassword
        });

        return result;
    }
}
