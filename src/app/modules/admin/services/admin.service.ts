import * as _ from 'lodash';
import { AccountGroupModel } from 'app/modules/admin/models/account-group.model';
import { AccountModel } from '../models/admin.model';
import { ApiHttpService } from './../../../modules/http/services/api-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from './../../utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';


@Injectable()
export class AdminService extends BaseService {
    constructor(private apiHttpService: ApiHttpService) { super(); }

    async createAdmin(model: AccountModel) {
        return await this.apiHttpService.post(`admin/account`, model);
    }

    async getAdmins(query: QueryModel) {
        const response = await this.apiHttpService.get(`admin/accounts${query.url()}`);
        return this.returnObj<PagingModel<AccountModel>>(response);
    }

    async getAdmin(_id: string) {
        const response = await this.apiHttpService.get(`admin/account/${_id}`);
        return response.errorCode === 0 ? response.data : {};
    }

    async updateAdmin(model: AccountModel) {
        return await this.apiHttpService.put(`admin/account/${model._id}`, model);
    }

    async deleteAdmin(_id: string) {
        return await this.apiHttpService.delete(`admin/account/${_id}`);
    }

    async resetPassword(accountId: string, password: string) {
        const response = await this.apiHttpService.put(`admin/account/${accountId}/password`, { password });
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async createGroupAdmin(model: AccountGroupModel) {
        return await this.apiHttpService.post(`admin/accountGroup`, model);
    }

    async updateGroupAdmin(model: AccountGroupModel) {
        return await this.apiHttpService.put(`admin/accountGroup`, model);
    }

    async getGroupAdmins(query = new QueryModel({ limit: 1000 })) {
        const response = await this.apiHttpService.get(`admin/accountGroups${query.url()}`);
        return this.returnObj<PagingModel<AccountGroupModel>>(response);
    }

    async getGroupAdmin(_id: string) {
        const response = await this.apiHttpService.get(`admin/accountGroup/${_id}`);
        return response.errorCode === 0 ? response.data : {};
    }

    async deleteGroupAdmin(_id: string) {
        return await this.apiHttpService.delete(`admin/accountGroup/${_id}`);
    }

    async getMenuItems(groupId: string) {
        return this.returnList(await this.apiHttpService.get(`admin/accountGroup/${groupId}/menu-items`)) as string[];
    }

    async updateMenuItems(groupId: string, menuItemIds: string[]) {
        return await this.apiHttpService.put(`admin/accountGroup/${groupId}/menu-item`, { menuItemIds });
    }

    async listAccounts(params) {
        return await this.apiHttpService.post(`admin/filter/list`, params);
    }
}
