import { ApiWarrantyHttpService } from 'app/modules/warranty-repair/services/api-warranty-http.service';
import { BaseService } from '@/services/base.service';
import { BrandModel } from '../models/brand.model';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class BrandService extends BaseService {
    constructor(private apiHttpService: ApiWarrantyHttpService) {
        super();
    }

    async create(model: BrandModel) {
        const response = await this.apiHttpService.post('brands', model);

        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async update(model: BrandModel) {
        const response = await this.apiHttpService.put(
            `brands/${model._id}`,
            omit(model, ['_id'])
        );

        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async getBrands(query?: QueryModel): Promise<PagingModel<BrandModel>> {
        const response = await this.apiHttpService.get(
            `brands${query ? query.url() : ''}`
        );

        return new PagingModel<BrandModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async getBrandsSelection(query?: QueryModel) {
        const response = await this.apiHttpService.get(
            `brands${query ? query.url() : ''}`
        );
        return response.errorCode === 0
            ? (response.data.data as BrandModel[])
            : [];
    }

    async get(id): Promise<BrandModel> {
        const response = await this.apiHttpService.get(`brands/${id}`);

        return response.errorCode === 0 ? response.data : null;
    }

    async delete(id) {
        const response = await this.apiHttpService.delete(`brands/${id}`);

        return this.returnSuccess(response);
    }
}
