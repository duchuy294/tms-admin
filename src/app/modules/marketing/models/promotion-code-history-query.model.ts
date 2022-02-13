import { QueryModel } from '@/models/query.model';

export class PromotionCodeHistoryQuery extends QueryModel {
    statistic?: boolean;
    policyId?: string;
    extraFields?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}