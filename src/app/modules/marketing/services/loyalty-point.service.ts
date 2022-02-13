import * as _ from 'lodash';
import { ApiMarketingHttpService } from './api-marketing-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { LoyaltyPoint } from '../models/loyalty-point.model';
import { LoyaltyPointAdjustModel } from '../models/loyalty-point-adjust.model.';
import { PagingModel } from '../../utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class LoyaltyPointService extends BaseService {
    constructor(private apiHttpService: ApiMarketingHttpService) {
        super();
    }

    async get(query: QueryModel): Promise<PagingModel<LoyaltyPoint>> {
        const response = await this.apiHttpService.get(`loyalty-points${query.url()}`);
        return new PagingModel<LoyaltyPoint>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async pointAdjust(model: LoyaltyPointAdjustModel) {
        const response = await this.apiHttpService.post('loyalty-points', model);
        return this.responseWithMessage(response);
    }

}
