import { ApiOrderHttpService } from 'app/modules/order/services/api-order-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from './../../utility/components/paging/paging.model';
import { QueryModel } from './../../../models/query.model';
import { RestrictedReachModel } from 'app/modules/order/models/restricted-reach.model';

@Injectable()
export class RestrictedReachService extends BaseService {
    constructor(private apiHttpService: ApiOrderHttpService) {
        super();
    }

    async filter(query: QueryModel): Promise<PagingModel<RestrictedReachModel>> {
        const response = await this.apiHttpService
            .get(`restricted-reaches${query.url()}`);

        return new PagingModel<RestrictedReachModel>(response.errorCode === 0 ? response.data : {});
    }

    public async delete(id: string) {
        return this.returnSuccess(await this.apiHttpService.delete(`restricted-reach/${id}`));
    }

    public async create(model: RestrictedReachModel) {
        return await this.apiHttpService.post('restricted-reach', model);
    }

    public async update(model: RestrictedReachModel) {
        return await this.apiHttpService.put(`restricted-reach/${model._id}`, model);
    }
}
