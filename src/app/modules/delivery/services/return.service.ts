import { ApiDeliveryHttpService } from './api-delivery-http.service';
import { BaseService } from 'app/services/base.service';
import { Injectable } from '@angular/core';
import { QueryModel } from 'app/models/query.model';

@Injectable()
export class ReturnService extends BaseService {
    constructor(private _apiHttpService: ApiDeliveryHttpService) { super(); }

    async getCodes(query: QueryModel) {
        const response = await this._apiHttpService.get(`return/codes${query.url()}`);

        return this.returnList(response);
    }

    async returnOrder(orderIds: string[]) {
        const response = await this._apiHttpService.post(`return`, { orderIds });
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }
}