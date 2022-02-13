import { ApiMarketingHttpService } from 'app/modules/marketing/services/api-marketing-http.service';
import { BaseService } from 'app/services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { RewardModel } from 'app/modules/marketing/models/reward.model';
import { SendRewardRequest } from '../models/send-reward-request';

@Injectable()
export class RewardService extends BaseService {
    constructor(private _apiHttpService: ApiMarketingHttpService) {
        super();
    }
    async filter(query = new QueryModel({ limit: 1000 })) {
        const response = await this._apiHttpService.get(`rewards${query.url()}`);

        return this.returnObj<PagingModel<RewardModel>>(response);
    }

    async update(model: RewardModel) {
        return await this._apiHttpService.put(`reward/${model._id}`, model);
    }

    async create(model: RewardModel) {
        return await this._apiHttpService.post(`reward`, model);
    }

    public async get(id) {
        return this.returnObj<RewardModel>(await this._apiHttpService.get(`reward/${id}`));
    }

    async send(rewardId: string, model: SendRewardRequest) {
        return await this._apiHttpService.post(`reward/${rewardId}`, model);
    }
}
