import { ApiMarketingHttpService } from 'app/modules/marketing/services/api-marketing-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { ReferralModel } from '../models/referral.model';
import { ReferralQueryModel } from '../models/referral-query.model';

@Injectable()
export class ReferralService extends BaseService {
    constructor(private apiService: ApiMarketingHttpService) {
        super();
    }

    public async filter(query = new ReferralQueryModel()) {
        return this.returnObj<PagingModel<ReferralModel>>(await this.apiService.get(`referrals/${query.url()}`));
    }

    public async getStatistic(query = new ReferralQueryModel()) {
        return this.returnObj<PagingModel<ReferralModel>>(await this.apiService.get(`referral/statistic/${query.url()}`));
    }
}