import * as _ from 'lodash';
import { ApiLocationHttpServiceObservable } from './api-location-http.service.observable';
import { Injectable } from '@angular/core';
import { QueryModel } from '../../../models/query.model';
import { RegionModel } from '../components/address/address.model';

@Injectable()
export class LocationServiceObservable {
    constructor(private apiHttpService: ApiLocationHttpServiceObservable) {
    }

    getRegions(query: QueryModel) {
        return this.apiHttpService.get(`general/regions${query.url()}`);
    }

    filter(filter: QueryModel) {
        return this.getRegions(filter);
    }

    get(id: string) {
        return this.apiHttpService.get(`general/regions/${id}`);
    }

    createRegion(query: RegionModel) {
        query = _.omit(query, query.omitFields()) as RegionModel;
        return this.apiHttpService.post(`admin/region`, query);
    }

    updateRegion(query: RegionModel) {
        return this.apiHttpService.put(`admin/region`, query);
    }

    deleteRegion(id: string) {
        return this.apiHttpService.delete(
            `admin/region/${id}`
        );
    }

    getCities(query: QueryModel) {
        return this.apiHttpService.get(`general/cities${query.url()}`);
    }
}
