import { ApiWarehouseHttpObservableService } from './api-warehouse-http.observable.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class WarehouseServiceObservable extends BaseService {
    constructor(private apiHttpService: ApiWarehouseHttpObservableService) {
        super();
    }

    getWarehouses(query: QueryModel) {
        return this.apiHttpService.get(`warehouses${query.url()}`);
    }
}