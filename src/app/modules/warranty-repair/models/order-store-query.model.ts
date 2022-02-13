import { QueryModel } from '@/models/query.model';

export class OrderStoreQueryModel extends QueryModel {
    servicerCode?: string;
    from?: number;
    to?: number;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
