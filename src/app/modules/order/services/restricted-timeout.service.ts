import { ApiOrderHttpService } from 'app/modules/order/services/api-order-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '../../utility/components/paging/paging.model';
import { QueryModel } from '../../../models/query.model';
import { RestrictedTimeoutModel } from '../models/restricted-timeout.model';

@Injectable()
export class RestrictedTimeoutService extends BaseService {
    constructor(private apiHttpService: ApiOrderHttpService) {
        super();
    }

    async filter(query: QueryModel): Promise<PagingModel<RestrictedTimeoutModel>> {
        const response = await this.apiHttpService
            .get(`expired-time-by-user${query.url()}`);

        return new PagingModel<RestrictedTimeoutModel>(response.errorCode === 0 ? response.data : {});
    }

    public async delete(id: string) {
        return this.returnSuccess(await this.apiHttpService.delete(`expired-time-by-user/${id}`));
    }

    public async create(model: RestrictedTimeoutModel) {
        return await this.apiHttpService.post('expired-time-by-user', model);
    }

    public async update(model: RestrictedTimeoutModel) {
        return await this.apiHttpService.put(`expired-time-by-user/${model._id}`, model);
    }
}
