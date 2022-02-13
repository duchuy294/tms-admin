import { ApiHookHttpService } from './api-hook-http.service';
import { BaseService } from '@/services/base.service';
import { HookTypeModel } from '../models/hook-type.model';
import { HookTypeQueryModel } from './../models/hook-type-query.model';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from '@/utility/components/paging/paging.model';

@Injectable()
export class HookTypeService extends BaseService {
    constructor(private apiService: ApiHookHttpService) {
        super();
    }

    public async get(id) {
        return this.returnObj<HookTypeModel>(await this.apiService.get(`hook-type/${id}`));
    }

    public async filter(query = new HookTypeQueryModel()) {
        return this.returnObj<PagingModel<HookTypeModel>>(await this.apiService.get(`hook-types/${query.url()}`));
    }

    public async delete(id) {
        return this.returnSuccess(await this.apiService.delete(`hook-type/${id}`));
    }

    public async create(model: HookTypeModel) {
        const response = await this.apiService.post('hook-type', model);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async update(model: HookTypeModel) {
        const response = await this.apiService.put(`hook-type/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async activate(model) {
        const response = await this.apiService.put(`hook-type/activate/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }
}