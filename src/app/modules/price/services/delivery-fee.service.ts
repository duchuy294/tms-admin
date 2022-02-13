import * as _ from 'lodash';
import { ApiPriceHttpService } from 'app/modules/price/services/api-price-http.service';
import { BaseService } from './../../../services/base.service';
import { DeliveryFeeModel } from './../models/delivery-fee.model';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from './../../../models/query.model';

@Injectable()
export class DeliveryFeeService extends BaseService {
    constructor(private _apiHttpService: ApiPriceHttpService) { super(); }

    async filter(query = new QueryModel()) {
        const response = await this._apiHttpService.get(`delivery-fees${query.url()}`);

        return this.returnObj<PagingModel<DeliveryFeeModel>>(response);

    }

    async update(fee: DeliveryFeeModel) {
        return await this._apiHttpService.put(`delivery-fee/${fee._id}`, _.omit(fee, ['_id', 'changed']));
    }

    async delete(id: number) {
        const response = await this._apiHttpService
            .delete(`delivery-fee/${id}`);

        return this.returnSuccess(response);
    }

    async add(fee: DeliveryFeeModel) {
        const response = await this._apiHttpService.post(`delivery-fee`, fee);

        return this.returnSuccess(response);
    }
}
