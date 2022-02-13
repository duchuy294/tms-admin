import { ApiWarehouseHttpService } from './api-warehouse-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { WarehouseContactModel } from '../models/warehouse-contact.model';

@Injectable()
export class WarehouseContactService extends BaseService {
    constructor(private apiHttpService: ApiWarehouseHttpService) {
        super();
    }

    async filter(query: QueryModel): Promise<PagingModel<WarehouseContactModel>> {
        const response = await this.apiHttpService.get(`contacts${query.url()}`);
        return new PagingModel<WarehouseContactModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async get(id: string): Promise<WarehouseContactModel> {
        return this.returnObj<WarehouseContactModel>(await this.apiHttpService.get(`contact/${id}`));
    }

    async getOrderStat(query: QueryModel): Promise<any> {
        return this.returnObj<any>(await this.apiHttpService.get(`contact/statistic/order${query.url()}`));
    }

    async getStatusStat(): Promise<any> {
        return this.returnObj<any>(await this.apiHttpService.get(`contact/statistic/status`));
    }

    async process(id: string) {
        const response = await this.apiHttpService.put(`contact/process/${id}`, {});
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async updateStatus(id: string, model) {
        const response = await this.apiHttpService.put(`contact/update-status/${id}`, model);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }
}