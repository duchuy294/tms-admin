import { ApiMarketingHttpService } from 'app/modules/marketing/services/api-marketing-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { LoyaltyPointPolicyModel } from 'app/modules/marketing/models/loyalty-point-policy.model';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';

@Injectable()
export class LoyaltyPointPolicyService extends BaseService {
    constructor(private _apiHttpService: ApiMarketingHttpService) {
        super();
    }
    async filter(query = new QueryModel()) {
        const response = await this._apiHttpService.get(`loyalty-point-policies${query.url()}`);

        return this.returnObj<PagingModel<LoyaltyPointPolicyModel>>(response);
    }

    async update(model: LoyaltyPointPolicyModel) {
        return await this._apiHttpService.put(`loyalty-point-policy/${model._id}`, model);
    }

    async create(model: LoyaltyPointPolicyModel) {
        return await this._apiHttpService.post(`loyalty-point-policy`, model);
    }

    async get(id) {
        return this.returnObj<LoyaltyPointPolicyModel>(await this._apiHttpService.get(`loyalty-point-policy/${id}`));
    }
}
