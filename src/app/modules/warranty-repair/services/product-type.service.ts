import { ApiWarrantyHttpService } from 'app/modules/warranty-repair/services/api-warranty-http.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { ProductTypeModel } from '../models/product-type.model';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class ProductTypeService extends BaseService {
    constructor(private apiHttpService: ApiWarrantyHttpService) {
        super();
    }

    async create(model: ProductTypeModel) {
        const response = await this.apiHttpService.post('product-types', model);

        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async update(model: ProductTypeModel) {
        const response = await this.apiHttpService.put(
            `product-types/${model._id}`,
            omit(model, ['_id'])
        );

        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async getProductTypes(
        query?: QueryModel
    ): Promise<PagingModel<ProductTypeModel>> {
        const response = await this.apiHttpService.get(
            `product-types${query ? query.url() : ''}`
        );

        return new PagingModel<ProductTypeModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async get(id): Promise<ProductTypeModel> {
        const response = await this.apiHttpService.get(`product-types/${id}`);

        return response.errorCode === 0 ? response.data : null;
    }

    async getProductTypesSelection(query?: QueryModel) {
        const response = await this.apiHttpService.get(
            `product-types${query ? query.url() : ''}`
        );
        return response.errorCode === 0
            ? (response.data.data as ProductTypeModel[])
            : [];
    }

    async delete(id) {
        const response = await this.apiHttpService.delete(
            `product-types/${id}`
        );

        return this.returnSuccess(response);
    }
}
