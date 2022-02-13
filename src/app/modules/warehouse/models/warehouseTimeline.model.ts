import { BaseModel } from '@/models/BaseModel';

export class WarehouseTimelineModel extends BaseModel {
    code?: string;
    status?: number;
    name?: string;
    numberOfDays?: number;
    note?: string;
    createdBy?: string;
    updatedBy?: string;
    constructor(item = null) {
        super(item);
    }
}
