import * as _ from 'lodash';
import { ApiPriceHttpService } from 'app/modules/price/services/api-price-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ServicePricingModel } from 'app/modules/price/models/service-pricing.model';

@Injectable()
export class ServicePricingService extends BaseService {
    constructor(private _apiHttpService: ApiPriceHttpService) { super(); }

    async filter(query = new QueryModel()) {
        const response = await this._apiHttpService.get(`service-pricings${query.url()}`);

        return this.returnObj<PagingModel<ServicePricingModel>>(response);
    }

    async update(pricing: ServicePricingModel) {
        const response = await this._apiHttpService
            .put(`service-pricing/${pricing._id}`, _.omit(pricing, ['_id', 'changed']));

        return this.returnSuccess(response);
    }

    async delete(id: string) {
        const response = await this._apiHttpService
            .delete(`service-pricing/${id}`);

        return this.returnSuccess(response);
    }

    async add(pricing: ServicePricingModel) {
        const response = await this._apiHttpService.post(`service-pricing`, _.omit(pricing, ['_id', 'changed']));

        return this.returnSuccess(response);
    }
}
