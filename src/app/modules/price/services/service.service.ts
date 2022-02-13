import { ApiPriceHttpService } from 'app/modules/price/services/api-price-http.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ServiceModel } from 'app/modules/price/models/service.model';

@Injectable()
export class ServiceService extends BaseService {
    constructor(private apiHttpService: ApiPriceHttpService) { super(); }

    public async filter(query = new QueryModel()) {
        const response = await this.apiHttpService.get(`services${query.url()}`);
        return this.returnObj<PagingModel<ServiceModel>>(response);
    }

    public async delete(id) {
        return await this.apiHttpService.delete(`service/${id}`);
    }

    public async add(data: ServiceModel) {
        return await this.apiHttpService.post(`service`, data);
    }

    public async update(id: string, data: ServiceModel) {
        return await this.apiHttpService.put(`service/${id}`, data);
    }
}