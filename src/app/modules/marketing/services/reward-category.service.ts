import { ApiMarketingHttpService } from 'app/modules/marketing/services/api-marketing-http.service';
import { BaseService } from 'app/services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { RewardCategoryModel } from 'app/modules/marketing/models/reward-category.model';

@Injectable()
export class RewardCategoryService extends BaseService {
    constructor(private _apiHttpService: ApiMarketingHttpService) {
        super();
    }
    async filter(query = new QueryModel({ limit: 1000 })) {
        const response = await this._apiHttpService.get(`reward-categories${query.url()}`);

        return this.returnObj<PagingModel<RewardCategoryModel>>(response);
    }

    async update(model: RewardCategoryModel) {
        return await this._apiHttpService.put(`reward-category/${model._id}`, model);
    }

    async create(model: RewardCategoryModel) {
        return await this._apiHttpService.post('reward-category', model);
    }

    async get(id) {
        return this.returnObj<RewardCategoryModel>(await this._apiHttpService.get(`reward-category/${id}`));
    }
}
