import { ApiAdminHttpService } from './api-admin-http.service';
import { BaseService } from 'app/services/base.service';
import { Injectable } from '@angular/core';
import { PrivilegeModel } from './../models/privilege.model';

@Injectable()
export class PrivilegeService extends BaseService {
    constructor(private readonly apiHttpService: ApiAdminHttpService) {
        super();
    }

    async get() {
        return super.returnObj<PrivilegeModel>(await this.apiHttpService.get('admin/privilege'));
    }

    async update(model: PrivilegeModel) {
        return await this.apiHttpService.put(`admin/privilege`, model);
    }
}
