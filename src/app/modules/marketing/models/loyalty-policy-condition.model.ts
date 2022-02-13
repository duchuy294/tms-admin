import { BaseModel } from 'app/models/BaseModel';
import { Condition } from './condition';

export class LoyaltyPointConditionModel extends BaseModel {
    key?: string;
    name?: string;
    pointValue?: number = 0;
    note?: string;
    conditions: Condition;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }

    omitFields() {
        return ['key'];
    }
}