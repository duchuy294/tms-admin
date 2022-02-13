import { ApiWarrantyHttpService } from 'app/modules/warranty-repair/services/api-warranty-http.service';
import { BaseService } from '@/services/base.service';
import { BrandModel } from '../models/brand.model';
import { CreateStore } from '../models/create-store.model';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { OrderStoreModel } from '../models/order-store.model';
import { OrderStoreQueryModel } from '../models/order-store-query.model';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { ProductTypeModel } from '../models/product-type.model';
import { QueryModel } from '@/models/query.model';
import { StoreModel } from '../models/store.model';
import { StoreQueryModel } from '../models/store-query.model';
import { StoreStatistic } from '../models/store-statistic.model';

@Injectable()
export class StoreService extends BaseService {
    constructor(private apiHttpService: ApiWarrantyHttpService) {
        super();
    }

    async create(model: CreateStore) {
        const response = await this.apiHttpService.post('stores', model);

        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async update(model: CreateStore) {
        const response = await this.apiHttpService.put(
            `stores/${model._id}`,
            omit(model, ['_id'])
        );
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async getStores(query?: StoreQueryModel): Promise<PagingModel<StoreModel>> {
        const response = await this.apiHttpService.get(
            `stores${query ? query.url() : ''}`
        );

        return new PagingModel<StoreModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async get(id): Promise<StoreModel> {
        const response = await this.apiHttpService.get(`stores/${id}`);

        return response.errorCode === 0 ? response.data : null;
    }

    async delete(id) {
        const response = await this.apiHttpService.delete(`stores/${id}`);
        return response.errorCode === 0;
    }

    async getStatistics(id): Promise<StoreStatistic> {
        const response = await this.apiHttpService.get(`stores/${id}/statistics`);

        return response.errorCode === 0 ? response.data : null;
    }

    async getOrders(
        id,
        query?: OrderStoreQueryModel
    ): Promise<PagingModel<OrderStoreModel>> {
        const response = await this.apiHttpService.get(`stores/${id}/orders${query ? query.url() : ''}`);

        return new PagingModel<OrderStoreModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async getAllStatistics(): Promise<any> {
        const response = await this.apiHttpService.get(`stores/statistics`);

        return response.errorCode === 0 ? response.data : null;
    }

    async getBrands(query?: QueryModel) {
        const response = await this.apiHttpService.get(
            `brands${query ? query.url() : ''}`
        );
        return response.errorCode === 0
            ? (response.data.data as BrandModel[])
            : [];
    }

    async getProductTypes(query?: QueryModel) {
        const response = await this.apiHttpService.get(
            `product-types${query ? query.url() : ''}`
        );
        return response.errorCode === 0
            ? (response.data.data as ProductTypeModel[])
            : [];
    }
}
