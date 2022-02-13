import * as _ from 'lodash';
import { ApiOrderHttpService } from 'app/modules/order/services/api-order-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { OrderStatisticModel } from '../models/order-statistic.model';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class OrderStatisticService extends BaseService {
    constructor(private apiHttpService: ApiOrderHttpService) {
        super();
    }

    async filter(query: QueryModel) {
        return this.returnObj<OrderStatisticModel>(await this.apiHttpService.get(`order-statistic${query.url()}`));
    }

    async filterOnStatus(query = new QueryModel()) {
        return this.returnObj(await this.apiHttpService.get(`order-statistic/status${query.url()}`));
    }
}
