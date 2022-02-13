import { ApiWarrantyHttpServiceObservable } from 'app/modules/warranty-repair/services/api-warranty-http.service.observable';
import { BaseService } from '@/services/base.service';
import { BrandModel } from '../models/brand.model';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class BrandServiceObservable extends BaseService {
    constructor(private apiHttpService: ApiWarrantyHttpServiceObservable) {
        super();
    }

    create(model: BrandModel) {
        return this.apiHttpService.post('brands', model);
    }

    update(model: BrandModel) {
        return this.apiHttpService.put(
            `brands/${model._id}`,
            omit(model, ['_id'])
        );
    }

    getBrands(query?: QueryModel) {
        return this.apiHttpService.get(
            `brands${query ? query.url() : ''}`
        );
    }

    getBrandsSelection(query?: QueryModel) {
        return this.apiHttpService.get(
            `brands${query ? query.url() : ''}`
        );
    }

    get(id) {
        return this.apiHttpService.get(`brands/${id}`);
    }

    delete(id) {
        return this.apiHttpService.delete(`brands/${id}`);
    }
}
