import { BaseModel } from '@/models/BaseModel';

export class OrderStoreModel extends BaseModel {
    code?: string;
    createdAt?: number;
    status?: number;
    statusLabel?: string;
    userCost?: number;
    servicerCost?: number;
    customerName?: string;
    type?: number;
    typeLabel?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
