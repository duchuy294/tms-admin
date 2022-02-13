import { ApiLocationHttpService } from './api-location-http.service';
import { BaseService } from 'app/services/base.service';
import { FlatLocationModel } from '@/modules/location/components/address/address.model';
import { Injectable } from '@angular/core';
import { LocationModel } from 'app/models/location.model';
import { LocationQueryModel } from 'app/modules/location/models/location-query.model';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { ServicerLocationModel } from './../models/servicer-location.model';

@Injectable()
export class LocationService extends BaseService {
    constructor(private apiService: ApiLocationHttpService) {
        super();
    }

    async get(query: QueryModel) {
        query.limit = 100000;
        const response = await this.apiService.get(`admin/list${query.url()}`);
        return new PagingModel<LocationModel>
            (response.errorCode === 0 ? response : {});
    }

    async getCurrentLocations(query: LocationQueryModel) {
        query.limit = 100000;
        const response = await this.apiService.get(`admin/current-locations${query.url()}`);
        return this.returnObj<PagingModel<ServicerLocationModel>>(response);
    }

    async filter(query: QueryModel): Promise<PagingModel<FlatLocationModel>> {
        const response = await this.apiService.get(`admin/locations${query.url()}`);
        return new PagingModel<FlatLocationModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }
    async getId(id): Promise<FlatLocationModel> {
        const response = await this.apiService.get(`admin/location/${id}`);
        return response.errorCode === 0 ? response.data : null;
    }

    async addLocation(location: FlatLocationModel) {
        return await this.apiService.post(`admin/location`, location);
    }

    async updateLocation(location: FlatLocationModel) {
        return await this.apiService.put(`admin/location/${location._id}`, location);
    }

    async deleleLocation(id): Promise<any> {
        return await this.apiService.delete(`admin/location/${id}`);
    }

}
