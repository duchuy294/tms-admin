import { ApiEmailHttpService } from './api-email-http.service';
import { BaseService } from '@/services/base.service';
import { EmailAccountModel } from '../models/email-account.model';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class EmailAccountService extends BaseService {
    constructor(private apiService: ApiEmailHttpService) {
        super();
    }

    public async get(id) {
        return this.returnObj<EmailAccountModel>(await this.apiService.get(`email-account/${id}`));
    }

    public async filter(query = new QueryModel()) {
        return this.returnObj<PagingModel<EmailAccountModel>>(await this.apiService.get(`email-accounts/${query.url()}`));
    }

    public async delete(id) {
        return this.returnSuccess(await this.apiService.delete(`email-account/${id}`));
    }

    public async create(model: EmailAccountModel) {
        const response = await this.apiService.post('email-account', model);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async update(model: EmailAccountModel) {
        const response = await this.apiService.put(`email-account/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async changePassword(model) {
        const response = await this.apiService.put(`email-account/change-password/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async activate(model) {
        const response = await this.apiService.put(`email-account/activate/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }
}