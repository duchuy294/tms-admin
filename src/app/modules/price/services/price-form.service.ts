import { ApiPriceHttpService } from 'app/modules/price/services/api-price-http.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { PriceFormModel } from 'app/modules/price/models/price-form.model';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class PriceFormService extends BaseService {
    constructor(private _apiHttpService: ApiPriceHttpService) { super(); }

    async filter(query = new QueryModel()) {
        const response = await this._apiHttpService.get(`price-forms${query.url()}`);

        return this.returnObj<PagingModel<PriceFormModel>>(response);
    }

    async get(id) {
        const response = await this._apiHttpService.get(`price-form/${id}`);

        return this.returnObj<PriceFormModel>(response);
    }

    async create(originalId, data: PriceFormModel) {
        return await this._apiHttpService.post(`price-form/${originalId}/clone`, data);
    }

    async update(data: PriceFormModel) {
        return await this._apiHttpService.put(`price-form/${data._id}`, data);
    }

    async setDefault(priceFormlId) {
        return await this._apiHttpService.put(`price-form/${priceFormlId}/default`, null);
    }

}