import * as _ from 'lodash';
import { ApiPriceHttpService } from 'app/modules/price/services/api-price-http.service';
import { BaseService } from './../../../services/base.service';
import { CollectionFeeModel } from './../models/collection-fee.model';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from './../../../models/query.model';

@Injectable()
export class CollectionService extends BaseService {
    constructor(private _apiHttpService: ApiPriceHttpService) { super(); }

    async filter(query = new QueryModel()) {
        const response = await this._apiHttpService.get(`collection-fees${query.url()}`);

        return this.returnObj<PagingModel<CollectionFeeModel>>(response);

    }

    async update(fee: CollectionFeeModel) {
        const response = await this._apiHttpService
            .put(`collection-fee/${fee._id}`, _.omit(fee, ['_id', 'changed']));

        return this.returnSuccess(response);
    }

    async delete(id: number) {
        const response = await this._apiHttpService
            .delete(`collection-fee/${id}`);

        return this.returnSuccess(response);
    }

    async add(fee: CollectionFeeModel) {
        const response = await this._apiHttpService.post(`collection-fee`, fee);

        return this.returnSuccess(response);
    }
}
