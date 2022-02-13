import { ApiFinanceHttpService } from './api-finance-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { SystemBankAccountModel } from '../models/system-bank-account.model';

@Injectable()
export class SystemBankAccountService extends BaseService {
    constructor(private apiService: ApiFinanceHttpService) {
        super();
    }

    public async get(id) {
        return this.returnObj<SystemBankAccountModel>(await this.apiService.get(`system-bank-account/${id}`));
    }

    public async filter(query = new QueryModel()) {
        return this.returnObj<PagingModel<SystemBankAccountModel>>(await this.apiService.get(`system-bank-accounts${query.url()}`));
    }

    public async delete(id) {
        return this.returnSuccess(await this.apiService.delete(`system-bank-account/${id}`));
    }

    public async create(model: SystemBankAccountModel) {
        const response = await this.apiService.post('system-bank-account', model);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async update(model: SystemBankAccountModel) {
        const response = await this.apiService.put(`system-bank-account/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }
}