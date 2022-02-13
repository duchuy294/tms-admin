import { BaseModel } from '@/models/BaseModel';

export class StoreStatistic extends BaseModel {
    totalOrders?: number = 0;
    totalSuccessfulOrders: number = 0;
    totalIncome: number = 0;
    totalCommissionFee: number = 0;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
