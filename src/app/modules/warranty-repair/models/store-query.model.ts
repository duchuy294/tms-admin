import { QueryModel } from '@/models/query.model';

export class StoreQueryModel extends QueryModel {
    productTypeId?: string;
    brandId?: string;
    district?: string;
    city?: string;
    from?: number;
    to?: number;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
