import { QueryModel } from '@/models/query.model';

export class LoyaltyPointQueryModel extends QueryModel {
    type?: string;
    userType?: string;
    orderCode?: string;
    expiredAt?: string;
    point?: number;
    createdBy?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}