import { ApiTelecomHttpService } from './api-telecom-http.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { ProviderModel } from '../models/provider.model';
import { QueryModel } from '@/models/query.model';
import { omit } from 'lodash';

@Injectable()
export class ProviderService extends BaseService {
    constructor(private apiService: ApiTelecomHttpService) {
        super();
    }

    public async get(id) {
        return this.returnObj<ProviderModel>(await this.apiService.get(`provider/${id}`));
    }

    public async filter(query = new QueryModel()) {
        return this.returnObj<PagingModel<ProviderModel>>(await this.apiService.get(`providers/${query.url()}`));
    }

    public async create(provider: ProviderModel) {
        return await this.apiService.post(`provider`, provider);
    }

    public async update(provider: ProviderModel) {
        return await this.apiService.put(`provider/${provider._id}`, provider);
    }

    public async changePassword(model) {
        return await this.apiService.put(`provider/change-password/${model._id}`, model);
    }

    public async activate(model) {
        const response = await this.apiService.put(`provider/activate/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async remove(id): Promise<any> {
        return await this.apiService.delete(`provider/${id}`);
    }
}