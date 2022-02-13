import * as _ from 'lodash';
import { ApiOrderHttpService } from 'app/modules/order/services/api-order-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '../../utility/components/paging/paging.model';
import { QueryModel } from '../../../models/query.model';
import { RatingModel } from '../models/rating.model';

@Injectable()
export class RatingService extends BaseService {
    constructor(
        private apiHttpService: ApiOrderHttpService
    ) {
        super();
    }

    async filter(query = new QueryModel()) {
        const response = await this.apiHttpService.get(`ratings${query.url()}`);
        return this.returnObj<PagingModel<RatingModel>>(response);
    }
}
