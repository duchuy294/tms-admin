import { ApiMarketingHttpServiceObservable } from './api-marketing-http.service.observable';
import { BaseService } from 'app/services/base.service';
import { Injectable } from '@angular/core';
import { QueryModel } from 'app/models/query.model';
import { RewardModel } from 'app/modules/marketing/models/reward.model';

@Injectable()
export class RewardServiceObservable extends BaseService {
    constructor(private _apiHttpService: ApiMarketingHttpServiceObservable) {
        super();
    }
    filter(query = new QueryModel({ limit: 1000 })) {
        return this._apiHttpService.get(`rewards${query.url()}`);
    }

    update(model: RewardModel) {
        return this._apiHttpService.put(`reward/${model._id}`, model);
    }

    create(model: RewardModel) {
        return this._apiHttpService.post(`reward`, model);
    }

    get(id) {
        return this._apiHttpService.get(`reward/${id}`);
    }
}
