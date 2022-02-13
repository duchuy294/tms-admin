import { ApiMarketingHttpService } from 'app/modules/marketing/services/api-marketing-http.service';
import { BaseService } from 'app/services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { RedeemedRewardModel } from 'app/modules/marketing/models/redeemed-reward.model';

@Injectable()
export class RedeemedRewardService extends BaseService {
    constructor(private _apiHttpService: ApiMarketingHttpService) {
        super();
    }

    async filter(query = new QueryModel({ limit: 1000 })) {
        const response = await this._apiHttpService.get(`redeemed-rewards${query.url()}`);

        return this.returnObj<PagingModel<RedeemedRewardModel>>(response);
    }

    async update(model: RedeemedRewardModel) {
        return await this._apiHttpService.put(`redeemed-reward/${model._id}`, model);
    }
}