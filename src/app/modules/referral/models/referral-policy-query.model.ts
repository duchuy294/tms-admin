import { QueryModel } from '@/models/query.model';

export class ReferralPolicyQueryModel extends QueryModel {
    name: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}