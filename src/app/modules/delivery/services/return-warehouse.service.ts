import * as _ from 'lodash';
import { ApiDeliveryHttpService } from './api-delivery-http.service';
import { BaseService } from 'app/services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { ReturnWarehouseModel } from './../models/return-warehouse.model';

@Injectable()
export class ReturnWarehouseService extends BaseService {
  constructor(
    private apiHttpService: ApiDeliveryHttpService
  ) { super(); }

  async update(warehouse: ReturnWarehouseModel) {
    return await this.apiHttpService.put(`warehouse/${warehouse._id}`, warehouse);
  }

  async add(warehouse: ReturnWarehouseModel) {
    return await this.apiHttpService.post(`warehouse`, warehouse);
  }

  async filter(query: QueryModel): Promise<PagingModel<ReturnWarehouseModel>> {
    const response = await this.apiHttpService.get(`warehouses${query.url()}`);
    return new PagingModel<ReturnWarehouseModel>(
      response.errorCode === 0 ? response.data : {}
    );
  }

  async get(id: string): Promise<ReturnWarehouseModel> {
    const response = await this.apiHttpService.get(`warehouse/${id}`);
    return response.errorCode === 0 ? response.data : null;
  }

  async remove(id: string): Promise<any> {
    const response = await this.apiHttpService.delete(`warehouse/${id}`);
    return response.errorCode;
  }
}
