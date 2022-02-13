import { ApiMarketingHttpService } from 'app/modules/marketing/services/api-marketing-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { RewardProviderModel } from './../models/reward-provider.model';

@Injectable()
export class RewardProviderService extends BaseService {
    constructor(private _apiHttpService: ApiMarketingHttpService) {
        super();
    }
    async filter(query = new QueryModel()) {
        const response = await this._apiHttpService.get(`reward-providers${query.url()}`);

        return this.returnObj<PagingModel<RewardProviderModel>>(response);
    }

    async update(model: RewardProviderModel) {
        return await this._apiHttpService.put(`reward-provider/${model._id}`, model);
    }

    async create(model: RewardProviderModel) {
        return await this._apiHttpService.post(`reward-provider`, model);
    }

    async get(id) {
        return this.returnObj<RewardProviderModel>(await this._apiHttpService.get(`reward-provider/${id}`));
    }
}
