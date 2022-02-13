import { QueryModel } from '@/models/query.model';
export class ReferralQueryModel extends QueryModel {
    referralPolicyId?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}