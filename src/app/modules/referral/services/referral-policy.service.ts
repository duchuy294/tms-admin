import { ApiMarketingHttpService } from '../../marketing/services/api-marketing-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from '../../utility/components/paging/paging.model';
import { QueryModel } from '../../../models/query.model';
import { ReferralPolicyModel } from '../models/referral-policy.model';

@Injectable()
export class ReferralPolicyService extends BaseService {
    constructor(private apiHttpService: ApiMarketingHttpService) {
        super();
    }

    async getReferralPolicies(query: QueryModel): Promise<PagingModel<ReferralPolicyModel>> {
        const response = await this.apiHttpService.get(`referral-policies${query.url()}`);
        return new PagingModel<ReferralPolicyModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async getReferralPolicy(id: any): Promise<ReferralPolicyModel> {
        return this.returnObj<ReferralPolicyModel>(await this.apiHttpService.get(`referral-policy/${id}`));
    }

    async createReferralPolicy(model: ReferralPolicyModel) {
        const response = await this.apiHttpService.post(`referral-policy`, model);
        return response;
    }

    async updateReferralPolicy(model: ReferralPolicyModel) {
        const response = await this.apiHttpService.put(`referral-policy/${model._id}`, omit(model, ['_id']));
        return response;
    }

    async activate(model) {
        const response = await this.apiHttpService.put(`referral-policy/activate/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

}