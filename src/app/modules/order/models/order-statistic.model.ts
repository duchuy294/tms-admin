import { BaseModel } from '@/models/BaseModel';

export class OrderStatisticModel extends BaseModel {
    totalOrder = 0;
    totalSuccessfulOrder = 0;
    totalCommission = 0;
    totalCost = 0;
    totalIncome = 0;
    totalBaseUserCost = 0;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
