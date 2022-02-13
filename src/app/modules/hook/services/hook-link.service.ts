import { ApiHookHttpService } from './api-hook-http.service';
import { BaseService } from './../../../services/base.service';
import { HookLinkModel } from '@/modules/hook/models/hook-link.model';
import { HookLinkQueryModel } from './../models/hook-link-query.model';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from '@/utility/components/paging/paging.model';

@Injectable()
export class HookLinkService extends BaseService {
    constructor(private apiService: ApiHookHttpService) {
        super();
    }

    public async get(id) {
        return this.returnObj<HookLinkModel>(await this.apiService.get(`link/${id}`));
    }

    public async filter(query = new HookLinkQueryModel()) {
        return this.returnObj<PagingModel<HookLinkModel>>(await this.apiService.get(`links/${query.url()}`));
    }

    public async create(model: HookLinkModel) {
        const response = await this.apiService.post('link', model);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async update(model: HookLinkModel) {
        const response = await this.apiService.put(`link/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async delete(id) {
        return this.returnSuccess(await this.apiService.delete(`link/${id}`));
    }
}