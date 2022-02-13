import { ApiFinanceHttpService } from './api-finance-http.service';
import { BankModel } from '../models/bank.model';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from './../../../models/query.model';

@Injectable()
export class BankService extends BaseService {
    constructor(private apiService: ApiFinanceHttpService) {
        super();
    }

    public async get(id) {
        return this.returnObj<BankModel>(await this.apiService.get(`bank/${id}`));
    }

    public async filter(query = new QueryModel()) {
        return this.returnObj<PagingModel<BankModel>>(await this.apiService.get(`banks${query.url()}`));
    }

    public async delete(id) {
        return this.returnSuccess(await this.apiService.delete(`bank/${id}`));
    }

    public async create(model: BankModel) {
        const response = await this.apiService.post('bank', model);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async update(model: BankModel) {
        const response = await this.apiService.put(`bank/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }
}
