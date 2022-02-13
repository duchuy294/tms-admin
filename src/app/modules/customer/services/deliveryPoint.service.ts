import { ApiHttpService } from '../../../modules/http/services/api-http.service';
import { BaseService } from './../../../services/base.service';
import { DeliveryPointModel } from '../models/delivery-point.model';
import { Injectable } from '@angular/core';
import { PagingModel } from './../../utility/components/paging/paging.model';
import { QueryModel } from '../../../models/query.model';


@Injectable()
export class DeliveryPointService extends BaseService {
    constructor(private apiHttpService: ApiHttpService) { super(); }

    async getDeliveryPoints(query: QueryModel) {
        const response = await this.apiHttpService.get(`admin/sub-end-users${query.url()}`);
        return new PagingModel<DeliveryPointModel>(response.errorCode === 0 ? response.data : null);
    }

    async getDeliveryPoint(id) {
        const response = await this.apiHttpService.get(`admin/sub-end-user/${id}`);
        return response.errorCode === 0 ? new DeliveryPointModel(response.data) : new DeliveryPointModel();
    }

    async createDeliveryPoint(query: DeliveryPointModel) {
        return await this.apiHttpService.post(`admin/sub-end-user`, query);
    }

    async updateDeliveryPoint(model: DeliveryPointModel) {
        return await this.apiHttpService.put(`admin/sub-end-user/${model._id}`, model);
    }

    async deleteDeliveryPoint(id: string) {
        return await this.apiHttpService.delete(`admin/sub-end-user/${id}`);
    }
}
