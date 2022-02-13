import { ApiWarrantyHttpServiceObservable } from 'app/modules/warranty-repair/services/api-warranty-http.service.observable';
import { BaseService } from '@/services/base.service';
import { CreateStore } from '../models/create-store.model';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { OrderStoreQueryModel } from '../models/order-store-query.model';
import { QueryModel } from '@/models/query.model';
import { StoreQueryModel } from '../models/store-query.model';

@Injectable()
export class StoreServiceObservable extends BaseService {
    constructor(private apiHttpService: ApiWarrantyHttpServiceObservable) {
        super();
    }

    create(model: CreateStore) {
        return this.apiHttpService.post('stores', model);
    }

    update(model: CreateStore) {
        return this.apiHttpService.put(
            `stores/${model._id}`,
            omit(model, ['_id'])
        );
    }

    getStores(query?: StoreQueryModel) {
        return this.apiHttpService.get(`stores${query ? query.url() : ''}`);
    }

    get(id) {
        return this.apiHttpService.get(`stores/${id}`);
    }

    delete(id) {
        return this.apiHttpService.delete(`stores/${id}`);
    }

    getStatistics(id) {
        return this.apiHttpService.get(`stores/${id}/statistics`);
    }

    getOrders(id, query?: OrderStoreQueryModel) {
        return this.apiHttpService.get(
            `stores/${id}/orders${query ? query.url() : ''}`
        );
    }

    getAllStatistics() {
        return this.apiHttpService.get(`stores/statistics`);
    }

    getBrands(query?: QueryModel) {
        return this.apiHttpService.get(`brands${query ? query.url() : ''}`);
    }

    getProductTypes(query?: QueryModel) {
        return this.apiHttpService.get(
            `product-types${query ? query.url() : ''}`
        );
    }
}
